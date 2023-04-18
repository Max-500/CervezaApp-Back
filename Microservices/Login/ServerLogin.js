import express from "express";
import bodyParser from "body-parser";
import * as UserLoginController from "./src/UserLoginController.js"

//
import { createConnection } from "../../RabbitMQ/ConnectionRabbitMQ.js"

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.listen(3002, "0.0.0.0", (req, res) => {
  console.log("SERVER RUNNING IN http://localhost:3002");
});

let content;

//RabbitMq

const channel = await createConnection();

let queueLogin = "login"
let queuResponseLogin = "loginRespuesta"


channel.consume(queueLogin, async(message) => {
    content = JSON.parse(message.content.toString())
    console.log(content)
    channel.ack(message)
    let result = await UserLoginController.loginUserController(content)
    console.log("ServerLogin")
    console.log(result)
    const sent = channel.sendToQueue(queuResponseLogin, Buffer.from(JSON.stringify(result)))
    sent ? console.log(`Enviando mensaje de respuesta a la cola loginRespuesta `, message) : console.log("Fallo todo")
})