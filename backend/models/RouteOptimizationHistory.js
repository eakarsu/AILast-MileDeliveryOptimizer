const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Stores the result of every AI route optimization call.
 * Enables history retrieval via GET /api/routes/history.
 */
const RouteOptimizationHistory = sequelize.define('RouteOptimizationHistory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  addresses: {
    type: DataTypes.JSONB,
    allowNull: false,
    comment: 'Input addresses sent to the optimizer',
  },
  optimizedOrder: {
    type: DataTypes.JSONB,
    comment: 'AI-returned optimized address order',
  },
  estimatedDistance: {
    type: DataTypes.STRING,
  },
  estimatedTime: {
    type: DataTypes.STRING,
  },
  fuelSavings: {
    type: DataTypes.STRING,
  },
  reasoning: {
    type: DataTypes.TEXT,
  },
  rawResponse: {
    type: DataTypes.TEXT,
    comment: 'Full raw response string from OpenRouter',
  },
  parsedResult: {
    type: DataTypes.JSONB,
    comment: 'Full parsed JSON result from OpenRouter',
  },
  success: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  driverId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  routeId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'route_optimization_history',
  timestamps: true,
});

module.exports = RouteOptimizationHistory;
