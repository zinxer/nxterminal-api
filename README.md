# Project Name


## TypeScript Project Initialization
```bash
npm i typescript --save-dev
npm i gts --save-dev
npx gts init
npm install -g ts-node typescript '@types/node'
npm install --save-dev ts-node nodemon
```

## Sequelize-cli
### Initialize sequelize-cli by running the following command:
```bash
npx sequelize-cli init
````
### To create new migration
```bash
npx sequelize-cli migration:generate --name MIGRATION_ACTION_NAME
````
### To create new seeder
```bash
npx sequelize-cli seed:generate --name SEED_ACTION_NAME
````
### To run migration
Make sure to add ./config/config.json for sequelize-cli to read and remove it after
To run database migrations and update the database schema, use the following command:
```bash
npx sequelize-cli db:migrate
````
### To run seeder
You would probably only want to run this during development for dev test data
```bash
npx sequelize-cli db:seed:all
```

### Trade Tables Definitions
```sql

CREATE TABLE nxterminal.`trade_accounts` (
  `id` VARCHAR(45) NOT NULL, -- Unique identifier for the trade account, possibly a UUID.
  `userId` VARCHAR(45) NOT NULL, -- Reference to the user's ID in the `users` table.
  `balance` DECIMAL(38,18) NOT NULL DEFAULT 0.000000000000000000, -- The account's current balance.
  `currency` VARCHAR(3) NOT NULL, -- The currency of the account's balance (e.g., USD, BTC).
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Timestamp of account creation.
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Timestamp of the last update to the account.
  PRIMARY KEY (`id`),
  FOREIGN KEY (`userId`) REFERENCES nxterminal.`users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE nxterminal.`financial_transactions` (
  `id` VARCHAR(45) NOT NULL, -- Unique identifier for the financial transaction, potentially a UUID.
  `userId` VARCHAR(45) NOT NULL, -- Identifier for the user associated with this transaction, linking to `trade_accounts`.
  `type` VARCHAR(255) NOT NULL, -- Describes the type of financial transaction (e.g., "deposit", "withdrawal").
  `amount` DECIMAL(38,18) NOT NULL, -- The monetary amount involved in the transaction.
  `currency` VARCHAR(3) NOT NULL, -- The currency code (ISO 4217) for the transaction amount (e.g., "USD", "EUR").
  `status` VARCHAR(255) NOT NULL, -- The current status of the transaction (e.g., "pending", "completed", "failed").
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- The timestamp of when the transaction was initially recorded.
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- The timestamp of the last update to the transaction record.
  PRIMARY KEY (`id`),
  FOREIGN KEY (`userId`) REFERENCES nxterminal.`trade_accounts`(`id`) ON DELETE CASCADE -- Ensures that transactions are deleted if the associated trade account is deleted.
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE nxterminal.`trade_orders` (
  `id` VARCHAR(45) NOT NULL, -- Unique identifier for the order, could be a UUID.
  `userId` VARCHAR(45) NOT NULL, -- Identifier for the user who placed the order.
  `isMarketOrder` TINYINT DEFAULT 0, -- Flag indicating if the order is a market order (1 for yes, 0 for no).
  `type` VARCHAR(255) NOT NULL, -- The type of order (e.g., buy, sell).
  `symbol` VARCHAR(255) NOT NULL, -- The trading symbol for the order (e.g., BTCUSD).
  `base` VARCHAR(45) NOT NULL, -- The base currency of the trading pair.
  `quote` VARCHAR(45) NOT NULL, -- The quote currency of the trading pair.
  `units` DECIMAL(38,18) NOT NULL, -- The quantity of the base currency in the order.
  `price` DECIMAL(38,18) NOT NULL, -- The price per unit of the base currency.
  `filledUnits` DECIMAL(38,18) DEFAULT NULL, -- The quantity of the order that has been filled.
  `totalAmount` DECIMAL(38,18) DEFAULT NULL, -- The total cost or value of the filled order.
  `currency` VARCHAR(45) NOT NULL, -- The currency used for `totalAmount`.
  `status` VARCHAR(255) NOT NULL, -- The status of the order (e.g., open, filled, partially filled, cancelled).
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the order was placed.
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Timestamp when the order was last updated.
  PRIMARY KEY (`id`),
  FOREIGN KEY (`userId`) REFERENCES nxterminal.`trade_accounts`(`id`) ON DELETE CASCADE -- Foreign key to the trade_accounts table.
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE nxterminal.`trade_transactions` (
  `id` VARCHAR(45) NOT NULL, -- Unique identifier for the transaction, could be a UUID.
  `orderId` VARCHAR(45), -- Identifier for the order associated with this transaction (nullable for transactions not directly tied to a specific order).
  `userId` VARCHAR(45) NOT NULL, -- Identifier for the user associated with this transaction.
  `type` VARCHAR(255) NOT NULL, -- The type of transaction (e.g., order execution, fee).
  `amount` DECIMAL(38,18) NOT NULL, -- The amount of the transaction.
  `currency` VARCHAR(3) NOT NULL, -- The currency of the transaction amount.
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the transaction was created.
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Timestamp when the transaction was last updated.
  PRIMARY KEY (`id`),
  FOREIGN KEY (`userId`) REFERENCES nxterminal.`trade_accounts`(`id`) ON DELETE CASCADE, -- Foreign key to the trade_accounts table.
  FOREIGN KEY (`orderId`) REFERENCES nxterminal.`trade_orders`(`id`) ON DELETE SET NULL -- Foreign key to the trade_orders table, set to NULL on order deletion.
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE nxterminal.`trade_positions` (
  `id` VARCHAR(45) NOT NULL, -- Unique identifier for the position, could be a UUID.
  `userId` VARCHAR(45) NOT NULL, -- Identifier for the user who holds the position.
  `orderId` VARCHAR(45) NOT NULL, -- Identifier for the order that opened this position.
  `symbol` VARCHAR(255) NOT NULL, -- The trading symbol for the position (e.g., BTCUSD).
  `base` VARCHAR(45) NOT NULL, -- The base currency of the trading pair.
  `quote` VARCHAR(45) NOT NULL, -- The quote currency of the trading pair.
  `unitsOpen` DECIMAL(38,18) NOT NULL, -- The quantity of the base currency that is currently open.
  `unitsClosed` DECIMAL(38,18) DEFAULT 0, -- The quantity of the base currency that has been closed.
  `openPrice` DECIMAL(38,18) NOT NULL, -- The price at which the position was opened.
  `closePrice` DECIMAL(38,18), -- The price at which the position was closed (nullable for open positions).
  `totalCost` DECIMAL(38,18) NOT NULL, -- The total cost of opening the position.
  `totalValue` DECIMAL(38,18) DEFAULT NULL, -- The total value of the position at close or current market value (nullable for open positions).
  `profitLoss` DECIMAL(38,18) DEFAULT NULL, -- The profit or loss realized on the position (nullable for open positions).
  `currency` VARCHAR(45) NOT NULL, -- The currency used for `totalCost` and `totalValue`.
  `status` VARCHAR(255) NOT NULL, -- The status of the position (e.g., 'Open', 'Closed').
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the position was opened.
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Timestamp when the position was last updated.
  PRIMARY KEY (`id`),
  FOREIGN KEY (`userId`) REFERENCES nxterminal.`trade_accounts`(`id`) ON DELETE CASCADE, -- Foreign key to the trade_accounts table.
  FOREIGN KEY (`orderId`) REFERENCES nxterminal.`trade_orders`(`id`) ON DELETE CASCADE -- Foreign key to the trade_orders table.
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


```