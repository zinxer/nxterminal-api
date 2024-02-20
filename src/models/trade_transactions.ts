// models/trade_transactions.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database'; // Adjust the import path as needed
import TradeOrder from './trade_orders'; // Ensure this path correctly points to your TradeOrder model
import TradeAccount from './trade_accounts'; // Ensure this path correctly points to your TradeAccount model

interface TradeTransactionAttributes {
    id: string;
    orderId?: string; // Optional since FOREIGN KEY constraint is ON DELETE SET NULL
    userId: string;
    type: string;
    amount: string;
    currency: string;
    createdAt?: Date;
    updatedAt?: Date;
}

class TradeTransaction extends Model<TradeTransactionAttributes> implements TradeTransactionAttributes {
    declare id: string;
    declare orderId?: string;
    declare userId: string;
    declare type: string;
    declare amount: string;
    declare currency: string;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

TradeTransaction.init({
    id: { type: DataTypes.STRING(45), primaryKey: true },
    orderId: { type: DataTypes.STRING(45), allowNull: true }, // Reflecting ON DELETE SET NULL
    userId: { type: DataTypes.STRING(45), allowNull: false },
    type: { type: DataTypes.STRING(255), allowNull: false },
    amount: { type: DataTypes.DECIMAL(38, 18), allowNull: false },
    currency: { type: DataTypes.STRING(3), allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
}, {
    sequelize,
    modelName: 'TradeTransaction',
    tableName: 'trade_transactions'
});

// Associations
TradeTransaction.belongsTo(TradeAccount, { foreignKey: 'userId' });
TradeAccount.hasMany(TradeTransaction, { foreignKey: 'userId' });

TradeTransaction.belongsTo(TradeOrder, { foreignKey: 'orderId' });
TradeOrder.hasMany(TradeTransaction, { foreignKey: 'orderId' });

export default TradeTransaction;
