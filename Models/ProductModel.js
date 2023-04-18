import { DataTypes } from "sequelize";
import { db } from "../DataBase/DBConnection.js"

const productModel = db.define( 'user', {
    id:{
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    size:{
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    unit:{
        type: DataTypes.ENUM('ml', 'l'),
        allowNull:false
    },
    brand:{
        type: DataTypes.STRING,
        allowNull: false
    },
    stock:{
        type: DataTypes.INTEGER
    },
    price:{
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    KeyBucket:{
        type: DataTypes.STRING
    },
    arrivalDate:{
        type: DataTypes.DATE,
        defaultValue: Date.now,
        allowNull: false
    }
}, {
    indexes: [
        {
          unique: true,
          fields: ['name', 'size']
        }
      ],
    sequelize: db,
    tableName: 'products'
})

db.sync()
    .then(() => {
        console.log("Tablas de Productos Creadas")
    })
    .catch((error) => {
        console.log("Error al crear las tablas de los productos: " + error)
    })

export { productModel };