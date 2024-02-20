// models/trade_accounts.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database';

interface TradeAccountAttributes {
  id: string;
  userId: string;
  balance: string;
  currency: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class TradeAccount extends Model<TradeAccountAttributes> implements TradeAccountAttributes {
  declare id: string;
  declare userId: string;
  declare balance: string;
  declare currency: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

TradeAccount.init({
  id: { type: DataTypes.STRING(45), primaryKey: true },
  userId: { type: DataTypes.STRING(45), allowNull: false },
  balance: { type: DataTypes.DECIMAL(38, 18), allowNull: false, defaultValue: '0.000000000000000000' },
  currency: { type: DataTypes.STRING(3), allowNull: false, defaultValue: 'USD' },
  createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
}, {
  sequelize,
  modelName: 'TradeAccount',
  tableName: 'trade_accounts'
});

export default TradeAccount;
