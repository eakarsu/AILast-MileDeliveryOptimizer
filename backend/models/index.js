const sequelize = require('../config/database');
const User = require('./User');
const Delivery = require('./Delivery');
const Driver = require('./Driver');
const Vehicle = require('./Vehicle');
const Customer = require('./Customer');
const Warehouse = require('./Warehouse');
const Zone = require('./Zone');
const Package = require('./Package');
const Route = require('./Route');
const Incident = require('./Incident');
const SLA = require('./SLA');
const PerformanceMetric = require('./PerformanceMetric');
const CostAnalysis = require('./CostAnalysis');
const DemandForecast = require('./DemandForecast');

// Associations
// Driver <-> Vehicle
Driver.belongsTo(Vehicle, { foreignKey: 'vehicleId', as: 'vehicle' });
Vehicle.hasMany(Driver, { foreignKey: 'vehicleId', as: 'drivers' });

// Delivery <-> Driver
Delivery.belongsTo(Driver, { foreignKey: 'driverId', as: 'driver' });
Driver.hasMany(Delivery, { foreignKey: 'driverId', as: 'deliveries' });

// Delivery <-> Vehicle
Delivery.belongsTo(Vehicle, { foreignKey: 'vehicleId', as: 'vehicle' });
Vehicle.hasMany(Delivery, { foreignKey: 'vehicleId', as: 'deliveries' });

// Delivery <-> Zone
Delivery.belongsTo(Zone, { foreignKey: 'zoneId', as: 'zone' });
Zone.hasMany(Delivery, { foreignKey: 'zoneId', as: 'deliveries' });

// Package <-> Delivery
Package.belongsTo(Delivery, { foreignKey: 'deliveryId', as: 'delivery' });
Delivery.hasMany(Package, { foreignKey: 'deliveryId', as: 'packages' });

// Package <-> Warehouse
Package.belongsTo(Warehouse, { foreignKey: 'warehouseId', as: 'warehouse' });
Warehouse.hasMany(Package, { foreignKey: 'warehouseId', as: 'packages' });

// Route <-> Driver
Route.belongsTo(Driver, { foreignKey: 'driverId', as: 'driver' });
Driver.hasMany(Route, { foreignKey: 'driverId', as: 'routes' });

// Incident <-> Delivery
Incident.belongsTo(Delivery, { foreignKey: 'deliveryId', as: 'delivery' });
Delivery.hasMany(Incident, { foreignKey: 'deliveryId', as: 'incidents' });

// Incident <-> Driver
Incident.belongsTo(Driver, { foreignKey: 'driverId', as: 'driver' });
Driver.hasMany(Incident, { foreignKey: 'driverId', as: 'incidents' });

// PerformanceMetric <-> Driver
PerformanceMetric.belongsTo(Driver, { foreignKey: 'driverId', as: 'driver' });
Driver.hasMany(PerformanceMetric, { foreignKey: 'driverId', as: 'performanceMetrics' });

// CostAnalysis <-> Zone
CostAnalysis.belongsTo(Zone, { foreignKey: 'zoneId', as: 'zone' });
Zone.hasMany(CostAnalysis, { foreignKey: 'zoneId', as: 'costAnalyses' });

// DemandForecast <-> Zone
DemandForecast.belongsTo(Zone, { foreignKey: 'zoneId', as: 'zone' });
Zone.hasMany(DemandForecast, { foreignKey: 'zoneId', as: 'demandForecasts' });

module.exports = {
  sequelize,
  User,
  Delivery,
  Driver,
  Vehicle,
  Customer,
  Warehouse,
  Zone,
  Package,
  Route,
  Incident,
  SLA,
  PerformanceMetric,
  CostAnalysis,
  DemandForecast,
};
