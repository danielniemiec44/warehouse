const Warehouse = require('../Entities/Warehouse');
const Category = require('../Entities/Category');

const WarehouseData = async (req, res) => {
   try {
       const data = await Warehouse.findAll();
       res.json(data);
       console.log("Data: " + data);
   } catch (err) {
       console.error(err);
       res.status(500).json({ error: 'Database query failed' });
   }
}

const getWarehouseDataByID = async (req, res) => {
    try {
         const data = await Warehouse.findOne({ where: { product_id: req.body.editEntryId } });
         res.json(data);
    } catch (err) {
         console.error(err);
         res.status(500).json({ error: 'Database query failed' });
    }
}

const getCategories = async (req, res) => {
    try {
        const data = await Category.findAll();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database query failed' });
    }
}


module.exports = { WarehouseData, getWarehouseDataByID, getCategories };