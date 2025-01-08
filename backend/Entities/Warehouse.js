const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Warehouse = sequelize.define('Warehouse', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        field: 'product_id'
    },
    product_name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    product_category: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    available_condition: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    maximum_condition: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'Warehouse',
    timestamps: false
});

module.exports = Warehouse;