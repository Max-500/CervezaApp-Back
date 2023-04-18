import { DataTypes } from "sequelize";
import { db } from "../DataBase/DBConnection.js"

const userModel = db.define( 'user', {
    id:{
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt:{
        type: DataTypes.DATE,
        defaultValue: Date.now,
        allowNull: false
    },
    updatedAt:{
        type: DataTypes.DATE,
        defaultValue: ()=>{
            Date.now();
        }
    }
}, {
    hooks: {
        beforeUpdate: (user) => {
            user.updateAt = Date.now()
        }
    },
    sequelize: db,
    tableName: 'users'
})

db.sync()
    .then(() => {
        console.log("Tablas de Usuario creadas correctamente")
    })
    .catch((error) => {
        console.log("Error al crear las tablas: " + error)
    })

export { userModel };