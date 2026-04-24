const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Delivery = sequelize.define('Delivery', {
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
  status: {
    type: DataTypes.ENUM('pending', 'picked_up', 'in_transit', 'delivered', 'failed'),
    defaultValue: 'pending',
  },
  customerName: {
    type: DataTypes.STRING,
  },
  customerPhone: {
    type: DataTypes.STRING,
  },
  customerEmail: {
    type: DataTypes.STRING,
  },
  pickupAddress: {
    type: DataTypes.STRING,
  },
  deliveryAddress: {
    type: DataTypes.STRING,
  },
  packageWeight: {
    type: DataTypes.FLOAT,
  },
  packageSize: {
    type: DataTypes.STRING,
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium',
  },
  estimatedDelivery: {
    type: DataTypes.DATE,
  },
  actualDelivery: {
    type: DataTypes.DATE,
  },
  driverId: {
    type: DataTypes.INTEGER,
  },
  vehicleId: {
    type: DataTypes.INTEGER,
  },
  zoneId: {
    type: DataTypes.INTEGER,
  },
  cost: {
    type: DataTypes.FLOAT,
  },
  notes: {
    type: DataTypes.TEXT,
  },
  aiOptimized: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'deliveries',
  timestamps: true,
});

module.exports = Delivery;
