import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database'; // Adjust the import path as needed

class Asset extends Model {
  public key!: string;
  public value!: string;
}

Asset.init(
  {
    symbol: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    type: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    logoResourcePath: {
      type: DataTypes.STRING(45),
      allowNull: true,
    }
  },
  {
    tableName: 'assets',
    sequelize, // passing the `sequelize` instance is required
  }
);

export default Asset;
