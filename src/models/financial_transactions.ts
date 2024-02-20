// models/financial_transactions.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database';
import TradeAccount from './trade_accounts';

interface FinancialTransactionAttributes {
  id: string;
  tradeAccId: string;
  type: string;
  amount: string;
  currency: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class FinancialTransaction extends Model<FinancialTransactionAttributes> implements FinancialTransactionAttributes {
  declare id: string;
  declare tradeAccId: string;
  declare type: string;
  declare amount: string;
  declare currency: string;
  declare status: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

FinancialTransaction.init({
    id: { type: DataTypes.STRING(45), primaryKey: true },
    tradeAccId: { type: DataTypes.STRING(45), allowNull: false },
    type: { type: DataTypes.STRING(255), allowNull: false },
    amount: { type: DataTypes.DECIMAL(38, 18), allowNull: false },
    currency: { type: DataTypes.STRING(3), allowNull: false },
    status: { type: DataTypes.STRING(255), allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  }, {
    sequelize,
    modelName: 'FinancialTransaction',
    tableName: 'financial_transactions'
  });

FinancialTransaction.belongsTo(TradeAccount, { foreignKey: 'tradeAccId', targetKey: 'id' });
TradeAccount.hasMany(FinancialTransaction, { foreignKey: 'tradeAccId' });

export default FinancialTransaction;
