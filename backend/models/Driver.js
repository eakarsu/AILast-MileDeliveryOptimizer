const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Driver = sequelize.define('Driver', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  phone: {
    type: DataTypes.STRING,
  },
  licenseNumber: {
    type: DataTypes.STRING,
    unique: true,
  },
  status: {
    type: DataTypes.ENUM('available', 'on_delivery', 'off_duty', 'on_break'),
    defaultValue: 'available',
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 5.0,
  },
  totalDeliveries: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  currentLocation: {
    type: DataTypes.STRING,
  },
  vehicleId: {
    type: DataTypes.INTEGER,
  },
  hireDate: {
    type: DataTypes.DATE,
  },
}, {
  tableName: 'drivers',
  timestamps: true,
});

module.exports = Driver;
