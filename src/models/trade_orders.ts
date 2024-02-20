// models/trade_orders.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database'; // Adjust the import path as needed
import TradeAccount from './trade_accounts'; // Ensure this path correctly points to your TradeAccount model

interface TradeOrderAttributes {
  id: string;
  userId: string;
  isMarketOrder: boolean;
  type: string;
  symbol: string;
  base: string;
  quote: string;
  units: string;
  price: string;
  filledUnits?: string;
  totalAmount?: string;
  currency: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class TradeOrder extends Model<TradeOrderAttributes> implements TradeOrderAttributes {
  declare id: string;
  declare userId: string;
  declare isMarketOrder: boolean;
  declare type: string;
  declare symbol: string;
  declare base: string;
  declare quote: string;
  declare units: string;
  declare price: string;
  declare filledUnits?: string;
  declare totalAmount?: string;
  declare currency: string;
  declare status: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

TradeOrder.init({
  id: { type: DataTypes.STRING(45), primaryKey: true },
  userId: { type: DataTypes.STRING(45), allowNull: false },
  isMarketOrder: { type: DataTypes.TINYINT, defaultValue: '0' },
  type: { type: DataTypes.STRING(255), allowNull: false },
  symbol: { type: DataTypes.STRING(255), allowNull: false },
  base: { type: DataTypes.STRING(45), allowNull: false },
  quote: { type: DataTypes.STRING(45), allowNull: false },
  units: { type: DataTypes.DECIMAL(38, 18), allowNull: false },
  price: { type: DataTypes.DECIMAL(38, 18), allowNull: false },
  filledUnits: { type: DataTypes.DECIMAL(38, 18) },
  totalAmount: { type: DataTypes.DECIMAL(38, 18) },
  currency: { type: DataTypes.STRING(45), allowNull: false },
  status: { type: DataTypes.STRING(255), allowNull: false },
  createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
}, {
  sequelize,
  modelName: 'TradeOrder',
  tableName: 'trade_orders'
});

TradeOrder.belongsTo(TradeAccount, { foreignKey: 'userId', targetKey: 'userId' });
TradeAccount.hasMany(TradeOrder, { foreignKey: 'userId' });

export default TradeOrder;
