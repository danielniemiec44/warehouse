const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const { Category } = require("./Category"); // Adjust the path to your database configuration

const CategoryCustomField = sequelize.define('CategoryCustomField', {
    CategoryID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: true,
        unique: true,
        field: 'CustomFieldID'
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'CustomFieldName'
    },
    type: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'CustomFieldType'
    },
    maxLen: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'CustomFieldMaxLength'
    },
    defaultValue: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'CustomFieldDefaultValue'
    }
}, {
    tableName: 'CategoryCustomField',
});

module.exports = CategoryCustomField;