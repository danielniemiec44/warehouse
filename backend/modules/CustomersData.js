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

const generateNIP = () => {
    // Generate 9 random digits (not 10)
    const digits = Array.from({length: 9}, () => faker.number.int(9));

    // Calculate checksum according to NIP algorithm
    const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
    let sum = 0;

    for (let i = 0; i < 9; i++) {
        sum += digits[i] * weights[i];
    }

    const checkDigit = sum % 11 === 10 ? 0 : sum % 11;
    digits.push(checkDigit);

    // Return the 10-digit NIP (9 random + 1 check digit)
    return digits.join('');
};


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
                nip: isCompany ? generateNIP() : null,
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