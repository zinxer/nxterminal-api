'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('assets', {
      symbol: {
        type: Sequelize.STRING(45),
        allowNull: false,
        primaryKey: true,
      },
      type: {
        type: Sequelize.STRING(45),
        allowNull: true,
      },
      name: {
        type: Sequelize.STRING(45),
        allowNull: true,
      },
      description: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      logoResourcePath: {
        type: Sequelize.STRING(255),
        allowNull: true,
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

    // Add a unique constraint
    await queryInterface.addConstraint('assets', {
      type: 'unique',
      fields: ['symbol'],
      name: 'symbol_UNIQUE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Drop the table
    await queryInterface.dropTable('assets');
  },
};
