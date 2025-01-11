const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('db_108545', 'db_108545', 'm0zAd54OzRIZNg9A', {
    host: 'sql.22.svpj.link',
    dialect: 'mysql'
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