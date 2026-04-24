import { Building2 } from 'lucide-react';
import { warehousesAPI } from '../services/api';
import createEntityPage from './EntityPage';

export default createEntityPage({
  title: 'Warehouses',
  icon: Building2,
  api: warehousesAPI,
  entityName: 'Warehouse',
  badgeColumns: ['status'],
  listColumns: ['id', 'name', 'address', 'city', 'status', 'capacity', 'currentLoad'],
  fields: [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'code', label: 'Code', type: 'text' },
    { key: 'address', label: 'Address', type: 'text' },
    { key: 'city', label: 'City', type: 'text' },
    { key: 'state', label: 'State', type: 'text' },
    { key: 'zipCode', label: 'Zip Code', type: 'text' },
    { key: 'latitude', label: 'Latitude', type: 'number' },
    { key: 'longitude', label: 'Longitude', type: 'number' },
    { key: 'status', label: 'Status', type: 'select', options: ['operational', 'maintenance', 'closed', 'opening_soon'] },
    { key: 'capacity', label: 'Capacity', type: 'number' },
    { key: 'currentLoad', label: 'Current Load', type: 'number' },
    { key: 'managerName', label: 'Manager Name', type: 'text' },
    { key: 'managerPhone', label: 'Manager Phone', type: 'text' },
    { key: 'operatingHours', label: 'Operating Hours', type: 'text' },
    { key: 'notes', label: 'Notes', type: 'textarea' },
  ],
});
