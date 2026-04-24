const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Zone = sequelize.define('Zone', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  city: {
    type: DataTypes.STRING,
  },
  state: {
    type: DataTypes.STRING,
  },
  zipCodeRange: {
    type: DataTypes.STRING,
  },
  baseDeliveryCost: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  avgDeliveryTime: {
    type: DataTypes.FLOAT,
  },
  activeDrivers: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  demandLevel: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium',
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
  },
}, {
  tableName: 'zones',
  timestamps: true,
});

module.exports = Zone;
