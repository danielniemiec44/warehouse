const { DataTypes } = require('sequelize');
const sequelize = require('../db');

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
        allowNull: false
    },
    min: {
        type: DataTypes.STRING,
        allowNull: false
    },
    max: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_use: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_add: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'Category',
    timestamps: false
});

module.exports = Category;