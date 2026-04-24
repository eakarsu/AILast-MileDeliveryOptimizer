import { Users } from 'lucide-react';
import { customersAPI } from '../services/api';
import createEntityPage from './EntityPage';

export default createEntityPage({
  title: 'Customers',
  icon: Users,
  api: customersAPI,
  entityName: 'Customer',
  badgeColumns: ['status', 'tier'],
  listColumns: ['id', 'name', 'email', 'phone', 'status', 'tier', 'totalOrders'],
  fields: [
    { key: 'name', label: 'Full Name', type: 'text' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'phone', label: 'Phone', type: 'text' },
    { key: 'address', label: 'Address', type: 'text' },
    { key: 'city', label: 'City', type: 'text' },
    { key: 'state', label: 'State', type: 'text' },
    { key: 'zipCode', label: 'Zip Code', type: 'text' },
    { key: 'status', label: 'Status', type: 'select', options: ['active', 'inactive', 'suspended'] },
    { key: 'tier', label: 'Tier', type: 'select', options: ['standard', 'premium', 'enterprise', 'vip'] },
    { key: 'totalOrders', label: 'Total Orders', type: 'number' },
    { key: 'totalSpent', label: 'Total Spent', type: 'number' },
    { key: 'preferredDeliveryTime', label: 'Preferred Delivery Time', type: 'text' },
    { key: 'specialInstructions', label: 'Special Instructions', type: 'textarea' },
    { key: 'notes', label: 'Notes', type: 'textarea' },
  ],
});
