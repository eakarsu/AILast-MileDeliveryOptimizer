import { BarChart3 } from 'lucide-react';
import { performanceAPI } from '../services/api';
import createEntityPage from './EntityPage';

export default createEntityPage({
  title: 'Performance Metrics',
  icon: BarChart3,
  api: performanceAPI,
  entityName: 'Performance Record',
  badgeColumns: ['rating', 'period'],
  listColumns: ['id', 'driverId', 'period', 'totalDeliveries', 'onTimeRate', 'rating', 'avgDeliveryTime'],
  fields: [
    { key: 'driverId', label: 'Driver ID', type: 'number' },
    { key: 'period', label: 'Period', type: 'select', options: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'] },
    { key: 'startDate', label: 'Start Date', type: 'date' },
    { key: 'endDate', label: 'End Date', type: 'date' },
    { key: 'totalDeliveries', label: 'Total Deliveries', type: 'number' },
    { key: 'successfulDeliveries', label: 'Successful Deliveries', type: 'number' },
    { key: 'failedDeliveries', label: 'Failed Deliveries', type: 'number' },
    { key: 'onTimeRate', label: 'On-Time Rate (%)', type: 'number' },
    { key: 'avgDeliveryTime', label: 'Avg Delivery Time (min)', type: 'number' },
    { key: 'totalDistance', label: 'Total Distance (km)', type: 'number' },
    { key: 'fuelEfficiency', label: 'Fuel Efficiency (km/l)', type: 'number' },
    { key: 'customerRating', label: 'Customer Rating', type: 'number' },
    { key: 'rating', label: 'Overall Rating', type: 'select', options: ['excellent', 'good', 'moderate', 'poor'] },
    { key: 'incidentCount', label: 'Incident Count', type: 'number' },
    { key: 'revenue', label: 'Revenue', type: 'number' },
    { key: 'notes', label: 'Notes', type: 'textarea' },
  ],
});
