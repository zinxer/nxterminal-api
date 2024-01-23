import 'dotenv/config';
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DB_SCHEMA!, 
  process.env.DB_USER!, 
  process.env.DB_PASSWORD!, 
  {
    host: process.env.DB_HOST!,
    dialect: 'mysql',
    logging: false
  },
);

export default sequelize;