'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('symbols', [
      {
        symbol: 'AAPL',
        isActive: 0,
        type: 'stock',
        provider: 'liquidity-provider',
        createdAt: '2024-01-21 02:11:39',
        updatedAt: '2024-01-24 01:21:18',
      },
      {
        symbol: 'BTCUSDT',
        isActive: 1,
        type: 'crypto',
        provider: 'binance',
        createdAt: '2024-01-21 02:08:27',
        updatedAt: '2024-01-22 01:14:00',
      },
      {
        symbol: 'ETHUSDT',
        isActive: 1,
        type: 'crypto',
        provider: 'binance',
        createdAt: '2024-01-21 02:08:45',
        updatedAt: '2024-01-24 03:28:49',
      },
      {
        symbol: 'EURUSD',
        isActive: 0,
        type: 'forex',
        provider: 'liquidity-provider',
        createdAt: '2024-01-21 02:11:39',
        updatedAt: '2024-01-24 01:21:18',
      },
      {
        symbol: 'GBPUSD',
        isActive: 0,
        type: 'forex',
        provider: 'liquidity-provider',
        createdAt: '2024-01-21 02:11:39',
        updatedAt: '2024-01-24 01:21:18',
      },
      {
        symbol: 'GOOG',
        isActive: 0,
        type: 'stock',
        provider: 'liquidity-provider',
        createdAt: '2024-01-21 02:11:39',
        updatedAt: '2024-01-24 01:21:18',
      },
      {
        symbol: 'MSFT',
        isActive: 0,
        type: 'stock',
        provider: 'liquidity-provider',
        createdAt: '2024-01-21 02:11:39',
        updatedAt: '2024-01-24 01:21:18',
      },
      {
        symbol: 'TSLA',
        isActive: 0,
        type: 'stock',
        provider: 'liquidity-provider',
        createdAt: '2024-01-21 02:11:39',
        updatedAt: '2024-01-24 01:21:18',
      },
      {
        symbol: 'USDJPY',
        isActive: 0,
        type: 'forex',
        provider: 'liquidity-provider',
        createdAt: '2024-01-21 02:11:39',
        updatedAt: '2024-01-24 01:21:18',
      },
      {
        symbol: 'VXTUSDT',
        isActive: 0,
        type: 'crypto',
        provider: 'custom',
        createdAt: '2024-01-21 02:09:06',
        updatedAt: '2024-01-22 01:14:00',
      },
      {
        symbol: 'XRPUSDT',
        isActive: 1,
        type: 'cryoto',
        provider: 'binance',
        createdAt: '2024-01-21 02:09:24',
        updatedAt: '2024-01-22 01:14:00',
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the seeded data, if needed
  },
};
