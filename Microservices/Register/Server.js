import express from "express";
import bodyParser from "body-parser";
import * as userController from "./src/UserController.js"

import { createConnection } from "../../RabbitMQ/ConnectionRabbitMQ.js";

let content;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.listen(3001, "0.0.0.0", (req, res) => {
  console.log("SERVER RUNNING IN http://localhost:3001");
});

//RabbitMq

const channel = await createConnection()

channel.consume('registro', async (message) => {
    content = JSON.parse(message.content.toString())
    console.log("Mensaje Recibido desde la cola registro")
    channel.ack(message);

    let result = await userController.createUserController(content)

    console.log("Vengo del controller")
    console.log(result)

    const sent = await channel.sendToQueue('registroRespuesta', Buffer.from(JSON.stringify(result), {persistent: true}))
    sent ? console.log(`Enviando mensaje de respuesta a la cola `, message) : console.log("Fallo todo");
})