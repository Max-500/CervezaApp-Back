import {productModel} from "../../../Models/ProductModel.js"
import { s3 } from "../../../AWS/aws.js";


async function getProductService(){
    let productos = await getProduct();
    let newProducts = await generateUrl(productos);
    return newProducts;
}

async function getProduct(){
    return await productModel.findAll({
        attributes:['name', 'brand', 'size', 'unit', 'stock', 'price', 'keyBucket'],
        order:[
            ['name', 'ASC'],
            ['price', 'ASC']
        ]
    })
}

async function generateUrl(productos){
    for(let i = 0; i < productos.length; i++){
        let url = productos[i].dataValues.keyBucket
        let image = getImage(url)
        productos[i].dataValues.keyBucket = image
    }
    return productos;
}

function getImage(key) {
    console.log("entro a getimage")
  const params = {
    Bucket: "products-image-cervezaapp",
    Key: key,
    Expires: 31540000, // tiempo en segundos antes de que la URL prefirmada expire
  };
  return s3.getSignedUrl("getObject", params);
}

export { getProductService }