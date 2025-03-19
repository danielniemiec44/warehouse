const Customer = require('../models/Customer');


const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.findAll();
        res.json(customers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database query failed' });
    }
}

const createNewCustomer = async (req, res) => {
    try {
        const customer = await Customer.create(req.body);
        res.json(customer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ errors: 'Could not create new customer', message: err.message });
    }
}

module.exports = {
    getAllCustomers,
    createNewCustomer
}