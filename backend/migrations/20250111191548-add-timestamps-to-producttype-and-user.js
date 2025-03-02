'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableNames = ['Category', 'Users', 'Warehouse', 'Category'];
    for (const tableName of tableNames) {
      const table = await queryInterface.describeTable(tableName);
      if (!table.createdAt) {
        await queryInterface.addColumn(tableName, 'createdAt', {
          type: Sequelize.DATE,
          allowNull: true,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        });
      } else {
        await queryInterface.changeColumn(tableName, 'createdAt', {
          type: Sequelize.DATE,
          allowNull: true,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        });
      }
      if (!table.updatedAt) {
        await queryInterface.addColumn(tableName, 'updatedAt', {
          type: Sequelize.DATE,
          allowNull: true,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        });
      } else {
        await queryInterface.changeColumn(tableName, 'updatedAt', {
          type: Sequelize.DATE,
          allowNull: true,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        });
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableNames = ['Category', 'Users', 'Warehouse', 'Category'];
    for (const tableName of tableNames) {
      await queryInterface.removeColumn(tableName, 'createdAt');
      await queryInterface.removeColumn(tableName, 'updatedAt');
    }
  }
};