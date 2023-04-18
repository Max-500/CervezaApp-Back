import { getProductService } from "./GetProductService.js"

async function getProductController(){
    let response = await getProductService()
    return response
}

export { getProductController }