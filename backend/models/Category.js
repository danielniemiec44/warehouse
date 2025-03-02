const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const CategoryCustomField = require('./CategoryCustomField');

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            msg: "Your category already exists"
        },
        validate: {
            notEmpty: {
                msg: "Your category is empty"
            }
        }
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
    tableName: 'Category',
    timestamps: true
});

Category.hasMany(CategoryCustomField, { as: 'customFields', foreignKey: 'CategoryID' });

module.exports = Category;