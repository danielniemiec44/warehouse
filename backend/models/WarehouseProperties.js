const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const CategoryCustomField = require('./CategoryCustomField');

const WarehouseProperties = sequelize.define('WarehouseProperties', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        autoIncrement: true,
        primaryKey: true
    },
    WarehouseID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    CustomFieldID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: CategoryCustomField,
            key: 'CustomFieldID'
        },
        field: 'CustomFieldID'
    },
    PropertyValue: {
        type: DataTypes.STRING,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'WarehouseProperties',
    timestamps: true
});

module.exports = WarehouseProperties;