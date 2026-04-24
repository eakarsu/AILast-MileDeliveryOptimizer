import { TrendingUp } from 'lucide-react';
import { demandForecastAPI } from '../services/api';
import createEntityPage from './EntityPage';

export default createEntityPage({
  title: 'Demand Forecasts',
  icon: TrendingUp,
  api: demandForecastAPI,
  entityName: 'Forecast',
  badgeColumns: ['confidence', 'status', 'trend'],
  listColumns: ['id', 'zoneId', 'forecastDate', 'predictedDemand', 'actualDemand', 'confidence', 'trend'],
  fields: [
    { key: 'zoneId', label: 'Zone ID', type: 'number' },
    { key: 'warehouseId', label: 'Warehouse ID', type: 'number' },
    { key: 'forecastDate', label: 'Forecast Date', type: 'date' },
    { key: 'period', label: 'Period', type: 'select', options: ['daily', 'weekly', 'monthly'] },
    { key: 'predictedDemand', label: 'Predicted Demand', type: 'number' },
    { key: 'actualDemand', label: 'Actual Demand', type: 'number' },
    { key: 'accuracy', label: 'Accuracy (%)', type: 'number' },
    { key: 'confidence', label: 'Confidence', type: 'select', options: ['low', 'medium', 'high'] },
    { key: 'trend', label: 'Trend', type: 'select', options: ['increasing', 'decreasing', 'stable', 'seasonal'] },
    { key: 'peakHour', label: 'Peak Hour', type: 'number' },
    { key: 'driversNeeded', label: 'Drivers Needed', type: 'number' },
    { key: 'vehiclesNeeded', label: 'Vehicles Needed', type: 'number' },
    { key: 'factors', label: 'Contributing Factors', type: 'textarea' },
    { key: 'status', label: 'Status', type: 'select', options: ['pending', 'active', 'completed', 'expired'] },
    { key: 'notes', label: 'Notes', type: 'textarea' },
  ],
});
