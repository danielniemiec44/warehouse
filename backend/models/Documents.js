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
        type: DataTypes.VIRTUAL,
        get() {
            const id = this.getDataValue('id');
            const docType = this.getDataValue('documentType');
            const generatedAt = this.getDataValue('generatedAt') || new Date();
            const date = new Date(generatedAt);

            // Format date components
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');

            // Get prefix based on document type
            const prefixMap = {
                'invoice': 'INV',
                'wz': 'WZ',
                'pz': 'PZ',
                'receipt': 'REC'
            };
            const prefix = prefixMap[docType] || 'DOC';

            // Get sale ID
            const saleId = this.getDataValue('saleId');

            return `${prefix}-${id}-${year}${month}${day}-${saleId}`;
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'Documents',
    timestamps: false
});

module.exports = Documents;