const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const CategoryCustomField = require('./CategoryCustomField');

const WarehouseProperties = sequelize.define('WarehouseProperties', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    WarehouseID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Warehouse',
            key: 'id'
        }
    },
    CustomFieldID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'CategoryCustomField',
            key: 'CustomFieldID'  // Changed from 'CategoryID'
        }
    },
    PropertyValue: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
            const rawValue = this.getDataValue('PropertyValue');
            const customField = this.getDataValue('customField');
            if (customField && customField.type === 'number' && rawValue !== null) {
                return Number(rawValue);
            }
            return rawValue;
        },
        set(value) {
            this.setDataValue('PropertyValue', value?.toString());
        }
    }
}, {
    tableName: 'WarehouseProperties',
    timestamps: true
});


module.exports = WarehouseProperties;