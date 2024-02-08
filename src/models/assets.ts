import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database'; // Adjust the import path as needed

class Asset extends Model {
  public symbol!: string;
  public type!: string;
  public name!: string;
  public description!: string;
  public logoResourcePath!: string;
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

// As long as the timestamps option is not explicitly set to false in the model options, Sequelize will automatically manage the createdAt and updatedAt fields

export default Asset;
