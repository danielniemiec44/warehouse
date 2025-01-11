const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const Category = require('./Category');
const ProductType = require('./ProductType');

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
    product_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    product_category_id: {
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
    tableName: 'Warehouse',
    timestamps: true
});

Warehouse.belongsTo(Category, { as: 'category', foreignKey: 'product_category_id' });
Warehouse.belongsTo(ProductType, { as: 'productType', foreignKey: 'product_type_id' });

module.exports = Warehouse;