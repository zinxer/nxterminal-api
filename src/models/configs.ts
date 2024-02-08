import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database'; // Adjust the import path as needed

class Config extends Model {
  public key!: string;
  public value!: string;
}

Config.init(
  {
    key: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    value: {
      type: DataTypes.STRING(45),
      allowNull: false,
    }
  },
  {
    tableName: 'configs',
    sequelize, // passing the `sequelize` instance is required
  }
);

// As long as the timestamps option is not explicitly set to false in the model options, Sequelize will automatically manage the createdAt and updatedAt fields

export default Config;
