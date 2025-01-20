const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const Category = require("./Category"); // Adjust the path to your database configuration

const CategoryCustomField = sequelize.define('CategoryCustomField', {
    CategoryID: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    CustomFieldID: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    FieldValue: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    tableName: 'CategoryCustomField',
});

CategoryCustomField.belongsTo(Category, { as: 'category', foreignKey: 'CategoryID', targetKey: 'id' });

module.exports = CategoryCustomField;