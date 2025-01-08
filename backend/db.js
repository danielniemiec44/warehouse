const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('db_108545', 'db_108545', 'm0zAd54OzRIZNg9A', {
    host: 'sql.22.svpj.link',
    dialect: 'mysql'
});

module.exports = sequelize;