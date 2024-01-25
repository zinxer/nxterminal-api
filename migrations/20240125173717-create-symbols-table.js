'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('symbols', {
      symbol: {
        type: Sequelize.STRING(45),
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      isActive: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 1,
      },
      type: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      provider: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('symbols');
  },
};
