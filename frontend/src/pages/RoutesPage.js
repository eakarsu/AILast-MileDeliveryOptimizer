import { Route } from 'lucide-react';
import { routesAPI } from '../services/api';
import createEntityPage from './EntityPage';

export default createEntityPage({
  title: 'Routes',
  icon: Route,
  api: routesAPI,
  entityName: 'Route',
  badgeColumns: ['status', 'optimized'],
  listColumns: ['id', 'name', 'status', 'driverId', 'totalStops', 'totalDistance', 'estimatedTime'],
  fields: [
    { key: 'name', label: 'Route Name', type: 'text' },
    { key: 'status', label: 'Status', type: 'select', options: ['planned', 'active', 'completed', 'cancelled'] },
    { key: 'driverId', label: 'Driver ID', type: 'number' },
    { key: 'vehicleId', label: 'Vehicle ID', type: 'number' },
    { key: 'warehouseId', label: 'Start Warehouse ID', type: 'number' },
    { key: 'zoneId', label: 'Zone ID', type: 'number' },
    { key: 'totalStops', label: 'Total Stops', type: 'number' },
    { key: 'totalDistance', label: 'Total Distance (km)', type: 'number' },
    { key: 'estimatedTime', label: 'Estimated Time (min)', type: 'number' },
    { key: 'actualTime', label: 'Actual Time (min)', type: 'number' },
    { key: 'startTime', label: 'Start Time', type: 'datetime-local' },
    { key: 'endTime', label: 'End Time', type: 'datetime-local' },
    { key: 'optimized', label: 'AI Optimized', type: 'select', options: ['true', 'false'] },
    { key: 'fuelCost', label: 'Fuel Cost', type: 'number' },
    { key: 'stops', label: 'Stops (JSON)', type: 'textarea' },
    { key: 'notes', label: 'Notes', type: 'textarea' },
  ],
});
