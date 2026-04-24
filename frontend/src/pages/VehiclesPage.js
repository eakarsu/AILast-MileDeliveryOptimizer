import { Truck } from 'lucide-react';
import { vehiclesAPI } from '../services/api';
import createEntityPage from './EntityPage';

export default createEntityPage({
  title: 'Vehicles',
  icon: Truck,
  api: vehiclesAPI,
  entityName: 'Vehicle',
  badgeColumns: ['status', 'fuelType'],
  listColumns: ['id', 'licensePlate', 'make', 'model', 'year', 'status', 'fuelType', 'capacity'],
  fields: [
    { key: 'licensePlate', label: 'License Plate', type: 'text' },
    { key: 'make', label: 'Make', type: 'text' },
    { key: 'model', label: 'Model', type: 'text' },
    { key: 'year', label: 'Year', type: 'number' },
    { key: 'type', label: 'Vehicle Type', type: 'select', options: ['van', 'truck', 'motorcycle', 'bicycle', 'car', 'cargo_bike'] },
    { key: 'status', label: 'Status', type: 'select', options: ['available', 'in_use', 'maintenance', 'out_of_service'] },
    { key: 'fuelType', label: 'Fuel Type', type: 'select', options: ['gasoline', 'diesel', 'electric', 'hybrid'] },
    { key: 'capacity', label: 'Capacity (kg)', type: 'number' },
    { key: 'maxVolume', label: 'Max Volume (m3)', type: 'number' },
    { key: 'currentMileage', label: 'Current Mileage', type: 'number' },
    { key: 'fuelLevel', label: 'Fuel Level (%)', type: 'number' },
    { key: 'lastMaintenanceDate', label: 'Last Maintenance', type: 'date' },
    { key: 'nextMaintenanceDate', label: 'Next Maintenance', type: 'date' },
    { key: 'insuranceExpiry', label: 'Insurance Expiry', type: 'date' },
    { key: 'costPerKm', label: 'Cost Per Km', type: 'number' },
    { key: 'notes', label: 'Notes', type: 'textarea' },
  ],
});
