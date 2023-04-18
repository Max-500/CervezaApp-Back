import express from "express";
import bodyParser from "body-parser";
import * as productController from "./src/RegisterProductController.js"
import { createConnection } from "../../RabbitMQ/ConnectionRabbitMQ.js";

let content;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.listen(3003, "0.0.0.0", (req, res) => {
  console.log("SERVER RUNNING IN http://localhost:3003");
});
  
const channel = await createConnection()

channel.consume('newProductRequest', async(message) => {
    content = JSON.parse(message.content.toString())
    channel.ack(message)
    console.log("Mensaje de la cola registroProducto")
    console.log(content)
    let product = await productController.registerProductController(content)
    channel.sendToQueue("newProductResponse", Buffer.from(JSON.stringify(product), {persistent: true}))
})