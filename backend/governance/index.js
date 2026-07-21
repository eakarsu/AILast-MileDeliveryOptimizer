'use strict';
const { createRouter } = require('./router');
const { sequelize } = require('./store');
const database = require('../config/database');
const auth = require('../middleware/auth');
const { evaluate } = require('./domain');
module.exports = createRouter({ db: sequelize(database), auth, evaluate,
  workflow: 'last-mile-dispatch',
  providers: ['telemetry','erp','wms','tms','gis','device','weather','maintenance','notifications'],
  approverRoles: ['dispatcher','safety_operator','fleet_manager','admin'] });

