const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CostAnalysis = sequelize.define('CostAnalysis', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  date: {
    type: DataTypes.DATEONLY,
  },
  totalDeliveries: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  totalCost: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  fuelCost: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  laborCost: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  maintenanceCost: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  avgCostPerDelivery: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  revenue: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  profit: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  zoneId: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'cost_analyses',
  timestamps: true,
});

module.exports = CostAnalysis;
