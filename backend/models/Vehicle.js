const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vehicle = sequelize.define('Vehicle', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  plateNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  type: {
    type: DataTypes.ENUM('van', 'truck', 'bike', 'car', 'motorcycle'),
    allowNull: false,
  },
  make: {
    type: DataTypes.STRING,
  },
  model: {
    type: DataTypes.STRING,
  },
  year: {
    type: DataTypes.INTEGER,
  },
  status: {
    type: DataTypes.ENUM('active', 'maintenance', 'retired'),
    defaultValue: 'active',
  },
  fuelType: {
    type: DataTypes.STRING,
  },
  capacity: {
    type: DataTypes.FLOAT,
  },
  currentMileage: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  lastMaintenance: {
    type: DataTypes.DATE,
  },
}, {
  tableName: 'vehicles',
  timestamps: true,
});

module.exports = Vehicle;
