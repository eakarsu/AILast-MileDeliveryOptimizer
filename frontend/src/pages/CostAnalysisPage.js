import { DollarSign } from 'lucide-react';
import { costAnalysisAPI } from '../services/api';
import createEntityPage from './EntityPage';

export default createEntityPage({
  title: 'Cost Analysis',
  icon: DollarSign,
  api: costAnalysisAPI,
  entityName: 'Cost Record',
  badgeColumns: ['category', 'trend'],
  listColumns: ['id', 'category', 'period', 'totalCost', 'costPerDelivery', 'trend', 'revenue'],
  fields: [
    { key: 'category', label: 'Category', type: 'select', options: ['fuel', 'maintenance', 'labor', 'insurance', 'depreciation', 'tolls', 'packaging', 'technology', 'overhead', 'other'] },
    { key: 'period', label: 'Period', type: 'text' },
    { key: 'startDate', label: 'Start Date', type: 'date' },
    { key: 'endDate', label: 'End Date', type: 'date' },
    { key: 'totalCost', label: 'Total Cost ($)', type: 'number' },
    { key: 'costPerDelivery', label: 'Cost Per Delivery ($)', type: 'number' },
    { key: 'costPerKm', label: 'Cost Per Km ($)', type: 'number' },
    { key: 'revenue', label: 'Revenue ($)', type: 'number' },
    { key: 'profit', label: 'Profit ($)', type: 'number' },
    { key: 'profitMargin', label: 'Profit Margin (%)', type: 'number' },
    { key: 'trend', label: 'Trend', type: 'select', options: ['increasing', 'decreasing', 'stable'] },
    { key: 'budgetAllocated', label: 'Budget Allocated ($)', type: 'number' },
    { key: 'budgetUsed', label: 'Budget Used ($)', type: 'number' },
    { key: 'zoneId', label: 'Zone ID', type: 'number' },
    { key: 'warehouseId', label: 'Warehouse ID', type: 'number' },
    { key: 'notes', label: 'Notes', type: 'textarea' },
  ],
});
