const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Incident = sequelize.define('Incident', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  deliveryId: {
    type: DataTypes.INTEGER,
  },
  driverId: {
    type: DataTypes.INTEGER,
  },
  type: {
    type: DataTypes.ENUM('delay', 'damage', 'lost', 'wrong_address', 'customer_complaint', 'vehicle_breakdown', 'weather'),
    allowNull: false,
  },
  severity: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    defaultValue: 'medium',
  },
  description: {
    type: DataTypes.TEXT,
  },
  resolution: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM('open', 'investigating', 'resolved', 'closed'),
    defaultValue: 'open',
  },
  reportedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  resolvedAt: {
    type: DataTypes.DATE,
  },
}, {
  tableName: 'incidents',
  timestamps: true,
});

module.exports = Incident;
