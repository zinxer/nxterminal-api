'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('configs', [
      {
        key: 'WSS_BASEURL',
        value: `ws://localhost:3000/ws`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'API_BASEURL',
        value: `http://localhost:3000/api/`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
