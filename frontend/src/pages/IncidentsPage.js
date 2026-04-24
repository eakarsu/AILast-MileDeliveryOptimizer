import { AlertTriangle } from 'lucide-react';
import { incidentsAPI } from '../services/api';
import createEntityPage from './EntityPage';

export default createEntityPage({
  title: 'Incidents',
  icon: AlertTriangle,
  api: incidentsAPI,
  entityName: 'Incident',
  badgeColumns: ['status', 'severity', 'type'],
  listColumns: ['id', 'title', 'type', 'severity', 'status', 'driverId', 'reportedAt'],
  fields: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'type', label: 'Type', type: 'select', options: ['accident', 'breakdown', 'theft', 'damage', 'delay', 'complaint', 'weather', 'road_closure', 'other'] },
    { key: 'severity', label: 'Severity', type: 'select', options: ['low', 'medium', 'high', 'critical'] },
    { key: 'status', label: 'Status', type: 'select', options: ['open', 'investigating', 'resolved', 'closed'] },
    { key: 'deliveryId', label: 'Delivery ID', type: 'number' },
    { key: 'driverId', label: 'Driver ID', type: 'number' },
    { key: 'vehicleId', label: 'Vehicle ID', type: 'number' },
    { key: 'location', label: 'Location', type: 'text' },
    { key: 'reportedAt', label: 'Reported At', type: 'datetime-local' },
    { key: 'resolvedAt', label: 'Resolved At', type: 'datetime-local' },
    { key: 'resolution', label: 'Resolution', type: 'textarea' },
    { key: 'costImpact', label: 'Cost Impact', type: 'number' },
    { key: 'timeImpact', label: 'Time Impact (min)', type: 'number' },
    { key: 'notes', label: 'Notes', type: 'textarea' },
  ],
});
