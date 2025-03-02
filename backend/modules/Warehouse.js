const Warehouse = require('./Warehouse');
const Category = require('../models/Category');
const Category = require('../models/Category');
const { handleDatabaseQuery } = require("../db");

const WarehouseData = (req, res) => {
    handleDatabaseQuery(() => Warehouse.findAll({
        include: [
            { model: Category, required: true, as: 'category' },
            { model: Category, required: true, as: 'Category' }
        ]
    }), res);
};

const getWarehouseDataByID = (req, res) => {
    handleDatabaseQuery(() => Warehouse.findOne({
        where: { product_id: req.params.id },
        include: [
            { model: Category, required: true, as: 'category' },
            { model: Category, required: true, as: 'Category' }
        ]
    }), res);
};

const setWarehouseDataByID = (req, res) => {
    handleDatabaseQuery(() => Warehouse.update(req.body, {
        where: { product_id: req.params.id },
    }), res);
};

const getCategory = (req, res) => {
    handleDatabaseQuery(() => Category.findAll(), res);
};

const getCategories = (req, res) => {
    handleDatabaseQuery(() => Category.findAll(), res);
};

const addNewItem = async (req, res) => {
    const { name, quantity, categoryId } = req.body;
    try {
        const newItem = await Warehouse.create({ name, quantity, categoryId });
        res.status(201).json(newItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Could not add new item' });
    }
};

const updateItemQuantity = async (req, res) => {
    const { id, quantity } = req.body;
    try {
        const item = await Warehouse.findByPk(id);
        if (!item) return res.status(404).json({ error: 'Item not found' });

        item.quantity = quantity;
        await item.save();
        res.status(200).json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Could not update quantity' });
    }
};

const addCategory = async (req, res) => {
    const { name } = req.body;
    try {
        const category = await Category.create({ name });
        res.status(201).json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Could not add category' });
    }
};

module.exports = {
    WarehouseData,
    getWarehouseDataByID,
    setWarehouseDataByID,
    getCategory,
    getCategories,
    addNewItem,
    updateItemQuantity,
    addCategory
};
