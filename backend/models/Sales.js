const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Sales = sequelize.define('Sales', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    orderNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User',
            key: 'id'
        }
    },
    warehouseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Warehouse',
            key: 'id'
        }
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    paymentStatus: {
        type: DataTypes.ENUM('pending', 'paid', 'canceled', 'refunded'),
        defaultValue: 'pending'
    },
    paymentMethod: {
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
    tableName: 'Sales',
    timestamps: true
});

module.exports = Sales;