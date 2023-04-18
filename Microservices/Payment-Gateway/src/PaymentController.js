import * as paymentService from "./PaymentService.js"

async function createOrderController(product){
    let response = await paymentService.createOrder(product)
    console.log(response)
    return response
}

export { createOrderController }