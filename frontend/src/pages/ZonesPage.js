import { MapPin } from 'lucide-react';
import { zonesAPI } from '../services/api';
import createEntityPage from './EntityPage';

export default createEntityPage({
  title: 'Delivery Zones',
  icon: MapPin,
  api: zonesAPI,
  entityName: 'Zone',
  badgeColumns: ['status', 'priority'],
  listColumns: ['id', 'name', 'code', 'status', 'priority', 'driverCount', 'deliveryCount'],
  fields: [
    { key: 'name', label: 'Zone Name', type: 'text' },
    { key: 'code', label: 'Zone Code', type: 'text' },
    { key: 'description', label: 'Description', type: 'text' },
    { key: 'status', label: 'Status', type: 'select', options: ['active', 'inactive', 'restricted'] },
    { key: 'priority', label: 'Priority', type: 'select', options: ['low', 'medium', 'high', 'critical'] },
    { key: 'city', label: 'City', type: 'text' },
    { key: 'state', label: 'State', type: 'text' },
    { key: 'boundaries', label: 'Boundaries (JSON)', type: 'textarea' },
    { key: 'driverCount', label: 'Driver Count', type: 'number' },
    { key: 'deliveryCount', label: 'Delivery Count', type: 'number' },
    { key: 'avgDeliveryTime', label: 'Avg Delivery Time (min)', type: 'number' },
    { key: 'warehouseId', label: 'Warehouse ID', type: 'number' },
    { key: 'notes', label: 'Notes', type: 'textarea' },
  ],
});
