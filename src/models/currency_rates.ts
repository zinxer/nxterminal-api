import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database'; // Adjust the import path as needed

class CurrencyRate extends Model {
    public id!: number; // Use the appropriate type
    public baseCurrency!: string;
    public quoteCurrency!: string;
    public exchangeRate!: number;
    public createdAt!: Date;
    public updatedAt!: Date;
}

CurrencyRate.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        baseCurrency: {
            type: DataTypes.STRING(8),
            allowNull: false,
        },
        quoteCurrency: {
            type: DataTypes.STRING(8),
            allowNull: false,
        },
        exchangeRate: {
            type: DataTypes.DECIMAL(10, 6),
            allowNull: false,
        },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    },
    {
        tableName: 'currency_rates', // Ensure this matches the table name in your SQL
        sequelize, // passing the `sequelize` instance is required
        timestamps: true, // Assuming you want Sequelize to handle `createdAt` and `updatedAt`
    }
);

export default CurrencyRate;
