const Warehouse = require("../models/Warehouse");
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

        const saleItemsWithSaleId = saleItems.map(item => ({
            productId: item.id, // Map frontend item.id to productId
            quantity: item.quantity,
            saleId: sale.id,
            unitPrice: 0,
            totalPrice: 0
        }));

        // Create sales items within transaction
        await SalesItems.bulkCreate(saleItemsWithSaleId, { transaction });

        // try to distract the product qauntity
        await Promise.all(saleItems.map(async item => {
            const product = await Warehouse.findByPk(item.id, { transaction });
            if (product.quantity < item.quantity) {
                throw new Error('Not enough quantity');
            }
            product.quantity -= item.quantity;
            await product.save({ transaction });
        }));

        // Get items with product details
        const saleItemsWithProducts = await SalesItems.findAll({
            where: { saleId: sale.id },
            include: [{ model: Warehouse, required: true, as: 'product' }],
            transaction
        });

        // Instead of creating one document per sale item
        const document = {
            saleId: sale.id,
            documentType: 'receipt',
            documentData: JSON.stringify({
                sale: sale,
                items: saleItemsWithProducts,
                timestamp: new Date()
            }),
            documentDate: new Date()
        };

// Create single document within transaction
        await Documents.create(document, { transaction });

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