'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('configs', [
      {
        key: 'BINANCE_SPOT_WSS_BASEURL',
        value: 'wss://stream.binance.com:9443/ws/',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'BINANCE_SPOT_API_BASEURL',
        value: 'https://api.binance.com/api/v3/',
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
