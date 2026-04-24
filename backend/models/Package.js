const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Package = sequelize.define('Package', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  trackingNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  weight: {
    type: DataTypes.FLOAT,
  },
  length: {
    type: DataTypes.FLOAT,
  },
  width: {
    type: DataTypes.FLOAT,
  },
  height: {
    type: DataTypes.FLOAT,
  },
  type: {
    type: DataTypes.ENUM('standard', 'fragile', 'perishable', 'hazardous', 'oversized'),
    defaultValue: 'standard',
  },
  status: {
    type: DataTypes.ENUM('warehouse', 'in_transit', 'delivered', 'returned'),
    defaultValue: 'warehouse',
  },
  deliveryId: {
    type: DataTypes.INTEGER,
  },
  warehouseId: {
    type: DataTypes.INTEGER,
  },
  description: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'packages',
  timestamps: true,
});

module.exports = Package;
