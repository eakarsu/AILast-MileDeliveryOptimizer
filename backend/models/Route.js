const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Route = sequelize.define('Route', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startLocation: {
    type: DataTypes.STRING,
  },
  endLocation: {
    type: DataTypes.STRING,
  },
  distance: {
    type: DataTypes.FLOAT,
  },
  estimatedTime: {
    type: DataTypes.FLOAT,
  },
  optimizedTime: {
    type: DataTypes.FLOAT,
  },
  stops: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  driverId: {
    type: DataTypes.INTEGER,
  },
  status: {
    type: DataTypes.ENUM('planned', 'active', 'completed'),
    defaultValue: 'planned',
  },
  aiScore: {
    type: DataTypes.FLOAT,
  },
  fuelSaved: {
    type: DataTypes.FLOAT,
  },
}, {
  tableName: 'routes',
  timestamps: true,
});

module.exports = Route;
