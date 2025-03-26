const {sequelize} = require("../db");
const Sales = require('../models/Sales');

const getOrders = async (req, res) => {
    try {
        const orders = await Sales.findAll();
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getOrders
}