import { productModel } from "../../../Models/ProductModel.js";
import { s3 } from "../../../AWS/aws.js";

async function getProducts(producto){

    console.log("Entro a servce")
    let productos = await findProducts(producto.name, producto.brand)
    if(productos.length > 0){
        productos[0].dataValues['status'] = 200
        productos[0].dataValues['image'] = await getImage(productos[0].dataValues.KeyBucket)
        return productos
    } else {
        return [
            {
                status:404,
                error:{
                    code:"NOT FOUND"
                },
                message: "No se encontro nada con ese nombre de producto y marca"
            }
        ]
    }
}

async function findProducts(name, brand){
    console.log("Entro a findProduct")
    let products = await productModel.findAll({
        where:{
            name: name,
            brand: brand
        },
        attributes:['name', 'brand', 'size', 'unit', 'stock', 'price', 'KeyBucket'],
        order:[
            ['name', 'ASC'],
            ['price', 'ASC']
        ]
    })
    return products;
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

export { getProducts }