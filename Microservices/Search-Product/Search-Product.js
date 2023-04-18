import express from "express";
import bodyParser from "body-parser";
import * as SearchproductController from "./src/SearchproductController.js"
import { createConnection } from "../../RabbitMQ/ConnectionRabbitMQ.js";

let content;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.listen(3004, "0.0.0.0", (req, res) => {
  console.log("SERVER RUNNING IN http://localhost:3004");
});

const channel = await createConnection()

channel.consume('searchProductRequest', async(message) => {
    content = JSON.parse(message.content.toString())
    channel.ack(message)
    console.log("Mensaje de la cola registroProducto")
    console.log(content)
    let product = await SearchproductController.searchProduct(content)
    console.log("Regreso de todos los procesos")
    console.log(product)
    channel.sendToQueue("searchProductResponse", Buffer.from(JSON.stringify(product), {persistent: true}))
})