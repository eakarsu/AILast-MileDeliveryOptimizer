import { Shield } from 'lucide-react';
import { slasAPI } from '../services/api';
import createEntityPage from './EntityPage';

export default createEntityPage({
  title: 'SLAs',
  icon: Shield,
  api: slasAPI,
  entityName: 'SLA',
  badgeColumns: ['status', 'priority', 'complianceStatus'],
  listColumns: ['id', 'name', 'customerTier', 'maxDeliveryTime', 'status', 'complianceStatus', 'penaltyRate'],
  fields: [
    { key: 'name', label: 'SLA Name', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'customerTier', label: 'Customer Tier', type: 'select', options: ['standard', 'premium', 'enterprise', 'vip'] },
    { key: 'maxDeliveryTime', label: 'Max Delivery Time (hrs)', type: 'number' },
    { key: 'onTimeTarget', label: 'On-Time Target (%)', type: 'number' },
    { key: 'status', label: 'Status', type: 'select', options: ['active', 'inactive', 'expired'] },
    { key: 'complianceStatus', label: 'Compliance Status', type: 'select', options: ['met', 'at_risk', 'breached'] },
    { key: 'priority', label: 'Priority', type: 'select', options: ['low', 'medium', 'high', 'critical'] },
    { key: 'penaltyRate', label: 'Penalty Rate (%)', type: 'number' },
    { key: 'startDate', label: 'Start Date', type: 'date' },
    { key: 'endDate', label: 'End Date', type: 'date' },
    { key: 'reviewFrequency', label: 'Review Frequency', type: 'select', options: ['weekly', 'monthly', 'quarterly'] },
    { key: 'escalationProcedure', label: 'Escalation Procedure', type: 'textarea' },
    { key: 'notes', label: 'Notes', type: 'textarea' },
  ],
});
