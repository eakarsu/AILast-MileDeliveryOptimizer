import { Box } from 'lucide-react';
import { packagesAPI } from '../services/api';
import createEntityPage from './EntityPage';

export default createEntityPage({
  title: 'Packages',
  icon: Box,
  api: packagesAPI,
  entityName: 'Package',
  badgeColumns: ['status', 'priority', 'fragile'],
  listColumns: ['id', 'trackingNumber', 'status', 'weight', 'priority', 'senderName', 'recipientName'],
  fields: [
    { key: 'trackingNumber', label: 'Tracking Number', type: 'text' },
    { key: 'status', label: 'Status', type: 'select', options: ['pending', 'processing', 'shipped', 'in_transit', 'delivered', 'returned', 'lost'] },
    { key: 'priority', label: 'Priority', type: 'select', options: ['low', 'medium', 'high', 'urgent'] },
    { key: 'weight', label: 'Weight (kg)', type: 'number' },
    { key: 'length', label: 'Length (cm)', type: 'number' },
    { key: 'width', label: 'Width (cm)', type: 'number' },
    { key: 'height', label: 'Height (cm)', type: 'number' },
    { key: 'fragile', label: 'Fragile', type: 'select', options: ['true', 'false'] },
    { key: 'contents', label: 'Contents', type: 'text' },
    { key: 'declaredValue', label: 'Declared Value', type: 'number' },
    { key: 'senderName', label: 'Sender Name', type: 'text' },
    { key: 'senderAddress', label: 'Sender Address', type: 'text' },
    { key: 'recipientName', label: 'Recipient Name', type: 'text' },
    { key: 'recipientAddress', label: 'Recipient Address', type: 'text' },
    { key: 'deliveryId', label: 'Delivery ID', type: 'number' },
    { key: 'specialHandling', label: 'Special Handling', type: 'textarea' },
  ],
});
