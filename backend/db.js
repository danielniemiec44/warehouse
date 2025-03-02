const { Sequelize } = require('sequelize');
const config = require('./config/config.json');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect
});

const handleDatabaseQuery = async (query, res) => {
    try {
        const data = await query();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database query failed' });
    }
};

module.exports = { sequelize, handleDatabaseQuery };