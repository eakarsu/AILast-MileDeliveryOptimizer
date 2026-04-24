const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DemandForecast = sequelize.define('DemandForecast', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  date: {
    type: DataTypes.DATEONLY,
  },
  zoneId: {
    type: DataTypes.INTEGER,
  },
  predictedDeliveries: {
    type: DataTypes.INTEGER,
  },
  actualDeliveries: {
    type: DataTypes.INTEGER,
  },
  confidence: {
    type: DataTypes.FLOAT,
  },
  factors: {
    type: DataTypes.TEXT,
  },
  aiModelUsed: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'demand_forecasts',
  timestamps: true,
});

module.exports = DemandForecast;
