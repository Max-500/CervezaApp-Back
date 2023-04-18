import bcrypt, { hash } from "bcrypt";
import { userModel } from "../../../Models/UserModel.js";
import emailValidator from "email-validator";

import { sns } from "../../../AWS/aws.js"

const saltRounds = 10;

async function createUserService(userDetails) {
  console.log("Entro aca de create del service de user")
  const correoValidado = validarCorreo(userDetails.email);
  if (correoValidado) {
    let passwordHasheada = await hasheo(userDetails.password, saltRounds);
    const newUser = {
      name: userDetails.name,
      email: userDetails.email,
      password: passwordHasheada
    };
    const response = await crear(userModel, newUser);
    if(response !== undefined){
      await suscribeEmail(userDetails.email)
      return {status: 201, newProduct: {
        code: "CREATED",
        message: "El usuario a sido añadido correctamente",
      },}  
    }else{
      return {status: 409, message: "El correo que estas usando ya existe"}
    }
  } else {
    return {
      status: 400,
      message:
        "Verifica que tu correo que proporcionaste existe",
    };
  }
}

async function hasheo(password, saltRounds) {
  return await new Promise(function hasheando(resolve, reject) {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        console.log(err);
      } else {
        resolve(hash);
      }
    });
  });
}

function validarCorreo(email) {
  return !!(emailValidator.validate(email));
}

async function crear(userModel, newUser) {
  console.log("Entro a la funcion de crear del servicio");
  return await new Promise(async function creando(resolve, reject) {
    try{
      const result = await userModel.create(newUser).catch((error) => {console.log("Se controlo la promesa")})
      return resolve(result)
    }catch{
      console.log("Algo sucedio mal dentro de la funcion crear y cai en el catch")
      return reject({status: 409, message: "El correo que estas usando ya existe"})
    }
  });
}

async function suscribeEmail(email){
  console.log("Funcion Suscribe Email")
  let params = {
    Protocol: 'EMAIL', 
    TopicArn: 'arn:aws:sns:us-east-1:240106434588:CervezApp',
    Endpoint: email
  };
  sns.subscribe(params, (err, data) => {
    if (err) {
        console.log("Algo ha salido mal dentro de aca de sns suscribe")
        console.log(err);
    } else {
        console.log(data);
    }
});
}

export { createUserService };