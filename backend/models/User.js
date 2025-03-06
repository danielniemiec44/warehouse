const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
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
    },
    canAddProduct: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    canDeleteProduct: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    canEditProduct: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    canEditCategory: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    timestamps: true,
    tableName: 'User',
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

module.exports = User;
