import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database'; // Adjust the import path as needed

class Symbol extends Model {
  public symbol!: string;
  public isActive!: boolean;
  public provider!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Symbol.init(
  {
    symbol: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    isActive: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
    },
    type:{
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    provider: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'symbols',
    sequelize, // passing the `sequelize` instance is required
  }
);

export default Symbol;
