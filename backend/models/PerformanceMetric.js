const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PerformanceMetric = sequelize.define('PerformanceMetric', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  driverId: {
    type: DataTypes.INTEGER,
  },
  date: {
    type: DataTypes.DATEONLY,
  },
  deliveriesCompleted: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  onTimeRate: {
    type: DataTypes.FLOAT,
  },
  avgDeliveryTime: {
    type: DataTypes.FLOAT,
  },
  customerRating: {
    type: DataTypes.FLOAT,
  },
  fuelEfficiency: {
    type: DataTypes.FLOAT,
  },
  incidentCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  earnings: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
}, {
  tableName: 'performance_metrics',
  timestamps: true,
});

module.exports = PerformanceMetric;
