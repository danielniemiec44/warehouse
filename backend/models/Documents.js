const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Documents = sequelize.define('Documents', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    saleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Sales',
            key: 'id'
        }
    },
    documentType: {
        type: DataTypes.ENUM('invoice', 'wz', 'pz', 'receipt'),
        allowNull: false
    },
    documentNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    filePath: {
        type: DataTypes.STRING,
        allowNull: false
    },
    generatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'Documents',
    timestamps: false
});

module.exports = Documents;