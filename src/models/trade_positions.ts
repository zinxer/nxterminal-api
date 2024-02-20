// models/trade_positions.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database'; // Adjust the import path as needed
import TradeAccount from './trade_accounts';
import TradeOrder from './trade_orders';

interface TradePositionAttributes {
  id: string;
  userId: string;
  orderId: string;
  symbol: string;
  base: string;
  quote: string;
  unitsOpen: string;
  unitsClosed?: string;
  openPrice: string;
  closePrice?: string;
  totalCost: string;
  totalValue?: string;
  profitLoss?: string;
  currency: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class TradePosition extends Model<TradePositionAttributes> implements TradePositionAttributes {
  declare id: string;
  declare userId: string;
  declare orderId: string;
  declare symbol: string;
  declare base: string;
  declare quote: string;
  declare unitsOpen: string;
  declare unitsClosed?: string;
  declare openPrice: string;
  declare closePrice?: string;
  declare totalCost: string;
  declare totalValue?: string;
  declare profitLoss?: string;
  declare currency: string;
  declare status: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

TradePosition.init({
  id: { type: DataTypes.STRING(45), primaryKey: true },
  userId: { type: DataTypes.STRING(45), allowNull: false },
  orderId: { type: DataTypes.STRING(45), allowNull: false },
  symbol: { type: DataTypes.STRING(255), allowNull: false },
  base: { type: DataTypes.STRING(45), allowNull: false },
  quote: { type: DataTypes.STRING(45), allowNull: false },
  unitsOpen: { type: DataTypes.DECIMAL(38, 18), allowNull: false },
  unitsClosed: { type: DataTypes.DECIMAL(38, 18) },
  openPrice: { type: DataTypes.DECIMAL(38, 18), allowNull: false },
  closePrice: { type: DataTypes.DECIMAL(38, 18) },
  totalCost: { type: DataTypes.DECIMAL(38, 18), allowNull: false },
  totalValue: { type: DataTypes.DECIMAL(38, 18) },
  profitLoss: { type: DataTypes.DECIMAL(38, 18) },
  currency: { type: DataTypes.STRING(45), allowNull: false },
  status: { type: DataTypes.STRING(255), allowNull: false },
  createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
}, {
  sequelize,
  modelName: 'TradePosition',
  tableName: 'trade_positions'
});

TradePosition.belongsTo(TradeAccount, { foreignKey: 'userId', targetKey: 'userId' });
TradePosition.belongsTo(TradeOrder, { foreignKey: 'orderId', targetKey: 'id' });

export default TradePosition;
