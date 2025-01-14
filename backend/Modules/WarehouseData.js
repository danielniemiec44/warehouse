// backend/Modules/WarehouseData.js
const Warehouse = require('../models/Warehouse');
const Category = require('../models/Category');
const ProductType = require('../models/ProductType');
const { handleDatabaseQuery } = require("../db");

const WarehouseData = (req, res) => {
    handleDatabaseQuery(() => Warehouse.findAll({
        include: [
            {
                model: Category,
                required: true, // This ensures an inner join
                as: 'category'
            },
            {
                model: ProductType,
                required: true, // This ensures an inner join
                as: 'productType'
            }
        ]
    }), res);
};

const getWarehouseDataByID = (req, res) => {
    handleDatabaseQuery(() => Warehouse.findOne({
        where: { product_id: req.params.id },
        include: [
            {
                model: Category,
                required: true, // This ensures an inner join
                as: 'category'
            },
            {
                model: ProductType,
                required: true, // This ensures an inner join
                as: 'productType'
            }
        ]
    }), res);
};

// update by id with joined tables Category and ProductType
const setWarehouseDataByID = (req, res) => {
    handleDatabaseQuery(() => Warehouse.update(req.body, {
        where: { product_id: req.params.id },
    }), res);
}

const getProductType = (req, res) => {
    handleDatabaseQuery(() => ProductType.findAll(), res);
};

const getCategories = (req, res) => {
    handleDatabaseQuery(() => Category.findAll(), res);
};

module.exports = { WarehouseData, getWarehouseDataByID, setWarehouseDataByID, getCategories, getProductType };