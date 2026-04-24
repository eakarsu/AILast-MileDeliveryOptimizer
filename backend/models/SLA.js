const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SLA = sequelize.define('SLA', {
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
  deliveryTimeHours: {
    type: DataTypes.FLOAT,
  },
  priority: {
    type: DataTypes.STRING,
  },
  onTimeTarget: {
    type: DataTypes.FLOAT,
  },
  costPerDelivery: {
    type: DataTypes.FLOAT,
  },
  penaltyRate: {
    type: DataTypes.FLOAT,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
  },
}, {
  tableName: 'slas',
  timestamps: true,
});

module.exports = SLA;
