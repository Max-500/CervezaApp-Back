import express from "express"
import multer from "multer";
import { createConnection } from "../RabbitMQ/ConnectionRabbitMQ.js"
import { app, io } from "../Settings.js";

let socketLogin = io.of('/login')
let socketRegister = io.of('/register')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "Microservices/Register/src/Files/Images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer(
    {storage: storage}
);

const router = express.Router();

router.route('/user/login').get(async(req, res) => {
    const channel = await createConnection();
    let queueRequest = "login"
    let queueResponse = "loginRespuesta"
    const request = {
        email: req.body.email,
        password: req.body.password
    }
    const sent = channel.sendToQueue(queueRequest, Buffer.from(JSON.stringify(request)))
    sent ? console.log(`Enviando mensaje a la cola "${queueRequest}"`, request) : console.log("Fallo todo")
    let response = await consumeQueue(channel, queueResponse);

  //Aqui ira todo lo de los sockets, esto es momentaneo 
    res.status(response.status).send({ User: response})
    socketLogin.emit('login', {User: response})
    res.end()
})

router.route('/user/register').post(upload.single("my-file") ,async(req, res)=>{
  console.log(req)
  const channel = await createConnection();

  let queueRequest = "registro";
  let queueResponse = "registroRespuesta"

    const message = {
      name:  req.body.name,
      email: req.body.email,
      password: req.body.password,
      image: req.file.originalname
    };
    
    const sent = await channel.sendToQueue(queueRequest, Buffer.from(JSON.stringify(message)),
      { persistent: true }
    );
    sent ? console.log(`Enviando mensaje a la cola "${queueRequest}"`, message) : console.log("Fallo todo");
  
    try {
      let response = await consumeQueue(channel, queueResponse);
      console.log("***");
      console.log(response);
      res.status(201).send(response);
      console.log("Finalizo el proceso")
      res.end();
      socketRegister.emit('newRegister', response)
    } catch (error) {
      console.log("Error en la prueba: ", error);
      res.status(500).send({ error: "Ocurrió un error en la prueba" });
      socketRegister.emit('badRegister', { status: 500, message: "Ocurrio un error en el registro" })
    }
})

async function consumeQueue(channel, queueResponse){
    return new Promise(async function consumingQueue(resolve, reject) {
      await channel.consume(queueResponse, async (messageReceived) => {
        console.log("Consume Queue")
        console.log(messageReceived)
        channel.ack(messageReceived);
        let content = JSON.parse(messageReceived.content.toString());
        console.log(content)
        await channel.close();
        resolve(content)
      })
    })
  }

app.use(router)

export { router }