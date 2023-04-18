import { productModel } from "../../../Models/ProductModel.js";
import fs from "fs";
import path, { resolve } from "path";
import { s3, sns } from "../../../AWS/aws.js";

async function insertProductService(product) {
  const ext = path.extname(product.KeyBucket);
  const timestamp = new Date().getTime();
  const keyBucket = timestamp + " - " + product.KeyBucket;
  const filepath = "src/Files/Products/" + product.KeyBucket;
  let newproduct = {
    name: product.name,
    size: product.size,
    unit: product.unit,
    stock: product.stock,
    brand: product.brand,
    price: product.price,
    KeyBucket: keyBucket,
  };
  if (ext === ".jpg" || ext === ".jpeg" || ext === ".png") {
    let productAdd = await newProduct(newproduct);
    console.log("Regreso de querer crear el producto");
    if (productAdd !== undefined) {
      await setImage(filepath, keyBucket);
      let url = await getImage(productAdd.dataValues.KeyBucket)
      console.log(url)
      deleteImageServer(filepath);
        await sendEmail(productAdd.dataValues.name,productAdd.dataValues.size, productAdd.dataValues.unit, productAdd.dataValues.price, url)
      return {
        status: 201,
        newProduct: {
          code: "CREATED",
          message: "El producto a sido añadido correctamente",
        },
      };
    } else {
      deleteImageServer(filepath);
      return {
        status: 409,
        error: {
          code: "CONFLICT",
          message: "El producto no pudo haber sido añadido",
        },
      };
    }
  } else {
    deleteImageServer(filepath);
    return {
      status: 422,
      error: {
        code: "UNPROCESSABLE_ENTITY",
        message: "Envia una imagen",
      },
    };
  }
}

async function newProduct(product) {
  console.log("Entro a new Producto");
  let result = await productModel.create(product).catch((error) => {
    console.log("Por si acaso");
  });
  return result;
}

async function setImage(filepath, key) {
    console.log("Entro a setImage")
  const file = fs.readFileSync(filepath);
  const params = {
    Bucket: "products-image-cervezaapp",
    Key: key, // Puedes cambiar el nombre del archivo aquí si lo deseas
    Body: file,
    ACL: "public-read",
  };
  await settingImage(params)
}

async function settingImage(params){
    console.log("Entro a SettingImage")
    s3.putObject(params, async (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Imagen subida con exito");
        }
  });
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

function deleteImageServer(filepath) {
  fs.unlink(filepath, (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Se ha borrado exitosamente");
    }
  });
}

//Checar como ira el mensaje generico
function sendEmail(nombre, size, unit, precio, link) {
  let params = {
    Message: `Ven a nuestro local y disfruta nuestra nueva bebida alcohólica ${nombre} de ${size} ${unit} por tan solo ${precio}! "${link}"`,
    TopicArn: "arn:aws:sns:us-east-1:240106434588:CervezApp",
    MessageStructure: "html",
  };
  sns.publish(params, function (err, data) {
    if (err) {
         console.log(err, err.stack);
    } else {
        console.log(data);
    }    
  });
}

export { insertProductService };
