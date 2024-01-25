# Project Name

This is a description of your project.

## Database Setup

### Initialization

Initialize Sequelize by running the following command:

```bash
npx sequelize-cli init

To create new migration

```bash
npx sequelize-cli migration:generate --name MIGRATION_ACTION_NAME

To create new seeder

```bash
npx sequelize-cli seed:generate --name SEED_ACTION_NAME


### Migration

Make sure to add ./config/config.json for sequelize-cli to read and remove it after
To run database migrations and update the database schema, use the following command:


```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
