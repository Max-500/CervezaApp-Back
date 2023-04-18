import * as SearchProductService from "./SearchProductService.js";

async function searchProduct(productos){
    console.log("Vengo cel controlador")
    let productosResponse = await SearchProductService.getProducts(productos)
    console.log(productosResponse)
    return productosResponse;
}

export { searchProduct }