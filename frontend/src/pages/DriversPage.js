import { Users } from 'lucide-react';
import { driversAPI } from '../services/api';
import createEntityPage from './EntityPage';

export default createEntityPage({
  title: 'Drivers',
  icon: Users,
  api: driversAPI,
  entityName: 'Driver',
  badgeColumns: ['status', 'licenseType'],
  listColumns: ['id', 'name', 'email', 'phone', 'status', 'licenseType', 'rating'],
  fields: [
    { key: 'name', label: 'Full Name', type: 'text' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'phone', label: 'Phone', type: 'text' },
    { key: 'licenseNumber', label: 'License Number', type: 'text' },
    { key: 'licenseType', label: 'License Type', type: 'select', options: ['A', 'B', 'C', 'D', 'CDL'] },
    { key: 'licenseExpiry', label: 'License Expiry', type: 'date' },
    { key: 'status', label: 'Status', type: 'select', options: ['active', 'inactive', 'on_route', 'off_duty', 'suspended'] },
    { key: 'rating', label: 'Rating', type: 'number' },
    { key: 'totalDeliveries', label: 'Total Deliveries', type: 'number' },
    { key: 'successRate', label: 'Success Rate (%)', type: 'number' },
    { key: 'vehicleId', label: 'Vehicle ID', type: 'number' },
    { key: 'zoneId', label: 'Zone ID', type: 'number' },
    { key: 'hireDate', label: 'Hire Date', type: 'date' },
    { key: 'address', label: 'Address', type: 'text' },
    { key: 'emergencyContact', label: 'Emergency Contact', type: 'text' },
    { key: 'notes', label: 'Notes', type: 'textarea' },
  ],
});
