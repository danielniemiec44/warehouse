const {DataTypes} = require("sequelize");
const { sequelize } = require('../db');


const BarCode = sequelize.define('barcode', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    barcode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            msg: "Your barcode already exists"
        },
        validate: {
            notEmpty: {
                msg: "Your barcode is empty"
            }
        }
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'Barcode',
    timestamps: true
});

module.exports = BarCode;