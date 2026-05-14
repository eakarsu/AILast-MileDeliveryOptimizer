const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Persists all AI endpoint results for history and auditing.
 * endpointType: one of optimize-route, predict-delivery-time, forecast-demand,
 *               analyze-costs, suggest-improvements, analyze-incident,
 *               optimize-fleet, predict-performance
 */
const AIResult = sequelize.define('AIResult', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  endpointType: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'The AI endpoint that produced this result (e.g. optimize-route)',
  },
  inputPayload: {
    type: DataTypes.JSONB,
    allowNull: false,
    comment: 'The request body sent to the AI endpoint',
  },
  rawResponse: {
    type: DataTypes.TEXT,
    comment: 'Raw string response from OpenRouter',
  },
  parsedResult: {
    type: DataTypes.JSONB,
    comment: 'Parsed JSON result; null if response was not valid JSON',
  },
  success: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  errorMessage: {
    type: DataTypes.TEXT,
    comment: 'Error message if success is false',
  },
  // Optional foreign keys for context
  deliveryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  driverId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  routeId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  zoneId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  incidentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'ai_results',
  timestamps: true,
});

module.exports = AIResult;
