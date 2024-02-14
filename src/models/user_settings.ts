// user_settings.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database'; // Adjust this import to match your sequelize configuration file's actual location
import User from './users'; // Ensure this path correctly points to your User model

class UserSetting extends Model {
    declare id: number;
    declare userId: number;
    declare settingKey: string;
    declare settingValue: string; // Use JSON or TEXT based on your requirement
}

UserSetting.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: {
        type: DataTypes.STRING,
        references: { model: 'users', key: 'id' },
        allowNull: false
    },
    settingKey: { type: DataTypes.STRING, allowNull: false },
    settingValue: { type: DataTypes.TEXT, allowNull: false } // or DataTypes.JSON for JSON support
}, {
    sequelize,
    modelName: 'UserSetting',
    tableName: 'user_settings' // Explicitly specify table name
});

// Associations
User.hasMany(UserSetting, { foreignKey: 'userId' });
UserSetting.belongsTo(User, { foreignKey: 'userId' });

export default UserSetting;
