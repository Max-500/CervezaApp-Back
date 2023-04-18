import amqp from "amqplib";

async function createConnection() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    channel.assertQueue("registro");
    channel.assertQueue("registroRespuesta")
    channel.assertQueue("login");
    channel.assertQueue('loginRespuesta')
    channel.assertQueue('newProductRequest')
    channel.assertQueue('newProductResponse')
    channel.assertQueue('searchProductRequest')
    channel.assertQueue('searchProductResponse')
    channel.assertQueue('getAllProductRequest')
    channel.assertQueue('getAllProductResponse')
    channel.assertQueue('payProductRequest')
    channel.assertQueue('payProductResponse')
    return channel;
}

export { createConnection }