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
