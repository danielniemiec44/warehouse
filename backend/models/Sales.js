const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Sales = sequelize.define('Sales', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    orderNumber: {
        type: DataTypes.VIRTUAL,
        get() {
            const id = this.getDataValue('id');
            const createdAt = this.getDataValue('createdAt');
            const date = new Date(createdAt);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');

            const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}`;
            return `S-${id}-${timestamp}`;
        }
    },
    sellerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User',
            key: 'id'
        }
    },
    buyerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Customer',
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