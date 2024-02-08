import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database'; // Adjust the import path as needed

class User extends Model {
  public id!: string;
  public password!: string;
  public isActive!: boolean;
  public refreshToken!: string; // Added field for refresh token
}

User.init(
  {
    id: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    refreshToken: {
      type: DataTypes.TEXT, // or DataTypes.STRING for shorter tokens
      allowNull: true, // Allows null if the token is not yet generated or if it has been invalidated
    },
  },
  {
    tableName: 'users',
    sequelize, // passing the `sequelize` instance is required
  }
);

export default User;