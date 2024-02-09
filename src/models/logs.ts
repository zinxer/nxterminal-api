import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database'; // Adjust this import based on your Sequelize configuration

class Log extends Model {
  public id!: number;
  public userId!: number;
  public action!: string;
  public details!: string;
  public createdAt!: Date;
}

Log.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  details: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ipAddress: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'logs',
  sequelize, // passing the `sequelize` instance is required
});

export default Log;
