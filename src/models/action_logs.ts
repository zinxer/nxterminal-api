import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database'; // Adjust this import based on your Sequelize configuration

class ActionLog extends Model {
  public id!: number;
  public userId!: number;
  public action!: string;
  public details!: string;
  public createdAt!: Date;
}

ActionLog.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.STRING,
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
  tableName: 'action_logs',
  sequelize, // passing the `sequelize` instance is required
});

export default ActionLog;
