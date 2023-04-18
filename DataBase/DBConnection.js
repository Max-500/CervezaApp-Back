import { Sequelize } from "sequelize";

const db = new Sequelize('sys', 'user', 'password', {
    host: 'aqui ira tu host',
    dialect: 'mysql',
    port: 3306
})

db.authenticate()
    .then(()=>{
        console.log("Conectado a la BDD")
    })
    .catch((error)=> {
        console.log("El error de la base de datos es: " + error)
    })

export { db }