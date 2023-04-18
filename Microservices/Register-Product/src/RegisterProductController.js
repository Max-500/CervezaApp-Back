import * as productControllerService from "./RegisterProductService.js"

async function registerProductController(product){
    let response = await productControllerService.insertProductService(product)
    console.log("Regrese del servicio")
    console.log(response)
    return response;
}

export { registerProductController }