import express from "express";
import bodyParser from "body-parser";
import * as GetProductController from "./src/GetProductController.js"
import { createConnection } from "../../RabbitMQ/ConnectionRabbitMQ.js";

let content;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.listen(3006, "0.0.0.0", (req, res) => {
  console.log("SERVER RUNNING IN http://localhost:3006");
});

//RabbitMq

const channel = await createConnection()

channel.consume('getAllProductRequest', async (message) => {
    content = JSON.parse(message.content.toString())
    channel.ack(message);
    let result = await GetProductController.getProductController()
    console.log("Vengo del controller")
    console.log(result)
    const sent = await channel.sendToQueue('getAllProductResponse', Buffer.from(JSON.stringify(result), {persistent: true}))
    sent ? console.log(`Enviando mensaje de respuesta a la cola `, message) : console.log("Fallo todo");
})