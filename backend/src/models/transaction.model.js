import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import User from "./user.model.js";

const Transaction = sequelize.define("Transaction", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING(50),
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: "transactions",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: false,
});

// Связь — транзакция принадлежит пользователю
User.hasMany(Transaction, { foreignKey: "user_id" });
Transaction.belongsTo(User, { foreignKey: "user_id" });

export default Transaction;