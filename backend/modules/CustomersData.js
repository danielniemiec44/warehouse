const Customer = require('../models/Customer');
const { faker } = require('@faker-js/faker');

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

const generateRandomCustomers = async (req, res) => {
    try {
        const count = parseInt(req.params.count) || 10;
        const generatedCustomers = [];

        for (let i = 0; i < count; i++) {
            const isCompany = Math.random() > 0.5;

            const customerData = {
                type: isCompany ? 'company' : 'individual',
                customer_name: isCompany ? '' : faker.name.firstName(),
                customer_surname: isCompany ? '' : faker.name.lastName(),
                companyName: isCompany ? faker.company.name() : '',
                email: faker.internet.email(),
                phone: faker.phone.number('###-###-###'),
                address: faker.address.streetAddress(),
                postalCode: faker.address.zipCode('##-###'),
                city: faker.address.city()
            };

            const newCustomer = await Customer.create(customerData);
            generatedCustomers.push(newCustomer);
        }

        res.status(201).json({
            message: `Successfully generated ${count} customers`,
            customers: generatedCustomers
        });
    } catch (error) {
        console.error('Error generating random customers:', error);
        res.status(500).json({ error: 'Failed to generate customers' });
    }
};

module.exports = {
    getAllCustomers,
    createNewCustomer,
    generateRandomCustomers
}