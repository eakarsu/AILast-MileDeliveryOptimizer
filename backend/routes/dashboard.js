const express = require('express');
const router = express.Router();
const { Delivery, Driver, Vehicle, Customer, Warehouse, Zone, Package, Route, Incident, CostAnalysis, PerformanceMetric } = require('../models');
const { Op, fn, col } = require('sequelize');

// GET /api/dashboard
router.get('/', async (req, res) => {
  try {
    const [
      totalDeliveries,
      pendingDeliveries,
      inTransitDeliveries,
      deliveredCount,
      failedDeliveries,
      activeDrivers,
      totalDrivers,
      activeVehicles,
      totalVehicles,
      totalCustomers,
      totalWarehouses,
      activeZones,
      totalPackages,
      activeRoutes,
      openIncidents,
      costData,
      performanceData,
    ] = await Promise.all([
      Delivery.count(),
      Delivery.count({ where: { status: 'pending' } }),
      Delivery.count({ where: { status: 'in_transit' } }),
      Delivery.count({ where: { status: 'delivered' } }),
      Delivery.count({ where: { status: 'failed' } }),
      Driver.count({ where: { status: 'available' } }),
      Driver.count(),
      Vehicle.count({ where: { status: 'active' } }),
      Vehicle.count(),
      Customer.count(),
      Warehouse.count({ where: { status: 'active' } }),
      Zone.count({ where: { status: 'active' } }),
      Package.count(),
      Route.count({ where: { status: 'active' } }),
      Incident.count({ where: { status: { [Op.in]: ['open', 'investigating'] } } }),
      CostAnalysis.findAll({
        attributes: [
          [fn('SUM', col('revenue')), 'totalRevenue'],
          [fn('SUM', col('profit')), 'totalProfit'],
          [fn('SUM', col('totalCost')), 'totalCost'],
          [fn('AVG', col('avgCostPerDelivery')), 'avgCostPerDelivery'],
        ],
        raw: true,
      }),
      PerformanceMetric.findAll({
        attributes: [
          [fn('AVG', col('onTimeRate')), 'avgOnTimeRate'],
          [fn('AVG', col('customerRating')), 'avgCustomerRating'],
          [fn('SUM', col('deliveriesCompleted')), 'totalCompleted'],
        ],
        raw: true,
      }),
    ]);

    const cost = costData[0] || {};
    const perf = performanceData[0] || {};

    const onTimeRate = perf.avgOnTimeRate ? parseFloat(parseFloat(perf.avgOnTimeRate).toFixed(1)) : 0;
    const totalRevenue = cost.totalRevenue ? parseFloat(parseFloat(cost.totalRevenue).toFixed(2)) : 0;
    const totalProfit = cost.totalProfit ? parseFloat(parseFloat(cost.totalProfit).toFixed(2)) : 0;

    res.json({
      deliveries: {
        total: totalDeliveries,
        pending: pendingDeliveries,
        inTransit: inTransitDeliveries,
        delivered: deliveredCount,
        failed: failedDeliveries,
      },
      drivers: {
        total: totalDrivers,
        available: activeDrivers,
      },
      vehicles: {
        total: totalVehicles,
        active: activeVehicles,
      },
      customers: totalCustomers,
      warehouses: totalWarehouses,
      zones: activeZones,
      packages: totalPackages,
      activeRoutes,
      openIncidents,
      financial: {
        totalRevenue,
        totalProfit,
        totalCost: cost.totalCost ? parseFloat(parseFloat(cost.totalCost).toFixed(2)) : 0,
        avgCostPerDelivery: cost.avgCostPerDelivery ? parseFloat(parseFloat(cost.avgCostPerDelivery).toFixed(2)) : 0,
      },
      performance: {
        onTimeRate,
        avgCustomerRating: perf.avgCustomerRating ? parseFloat(parseFloat(perf.avgCustomerRating).toFixed(1)) : 0,
      },
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
