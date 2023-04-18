import express from "express";
import bodyParser from "body-parser";
import * as paymentProductController from "./src//PaymentController.js"
import { executePayment } from "./src/PaymentService.js";
import { createConnection } from "../../RabbitMQ/ConnectionRabbitMQ.js";

let content;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const channel = await createConnection()

channel.consume('payProductRequest', async(message) => {
    content = JSON.parse(message.content.toString())
    channel.ack(message)
    console.log("Mensaje de la cola paymentRequest")
    console.log(content)
    let product = await paymentProductController.createOrderController(content)
    console.log("Regreso de todos los procesos")
    let response = {
                    status: 200, 
                    link: product.links[1].href
                    }
    
    console.log(response)
    channel.sendToQueue("payProductResponse", Buffer.from(JSON.stringify(response), {persistent: true}))
})

app.get('/execute-payment', executePayment)

app.get('/cancel-payment', async(req, res) => {
    res.status(410).send({status: 410, message:"La compra se detuvo"})
})

app.listen(3005,"0.0.0.0", (req, res) => {
  console.log("SERVER RUNNING IN http://localhost:3005");
});