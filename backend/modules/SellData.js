const Warehouse = require("./Warehouse");
const {sequelize} = require("../db");
const Sales = require('../models/Sales');
const SalesItems = require('../models/SalesItems');
const Documents = require('../models/Documents');


const sell = async (req, res) => {
    // Initialize transaction
    const transaction = await sequelize.transaction();

    try {
        const { saleItems, buyerId, sellerId } = req.body;

        // Create sale within transaction
        const sale = await Sales.create({ buyerId, sellerId }, { transaction });

        // Add saleId to each item
        const saleItemsWithSaleId = saleItems.map(item => ({
            ...item,
            saleId: sale.id
        }));

        // Create sales items within transaction
        await SalesItems.bulkCreate(saleItemsWithSaleId, { transaction });

        // Get items with product details
        const saleItemsWithProducts = await SalesItems.findAll({
            where: { saleId: sale.id },
            include: [{ model: Warehouse, required: true, as: 'product' }],
            transaction
        });

        // Prepare documents
        const documents = saleItemsWithProducts.map(item => ({
            saleId: sale.id,
            documentType: 'sale',
            documentData: JSON.stringify(item),
            documentDate: new Date()
        }));

        // Create documents within transaction
        await Documents.bulkCreate(documents, { transaction });

        // Commit transaction
        await transaction.commit();

        res.status(201).json(sale);
    } catch (error) {
        // Roll back transaction on error
        await transaction.rollback();
        console.error(error);
        res.status(500).json({ error: 'Could not sell items' });
    }
};

module.exports = {
    sell
};