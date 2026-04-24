const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const bcrypt = require('bcryptjs');
const {
  sequelize,
  User,
  Vehicle,
  Driver,
  Zone,
  Customer,
  Warehouse,
  Delivery,
  Package,
  Route,
  Incident,
  SLA,
  PerformanceMetric,
  CostAnalysis,
  DemandForecast,
} = require('../models');

async function seed() {
  try {
    console.log('Syncing database (force: true)...');
    await sequelize.sync({ force: true });
    console.log('Database synced.');

    // ---- Users ----
    const hashedPassword = await bcrypt.hash('password123', 10);
    const admin = await User.create({
      email: 'admin@lastmile.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
    });
    console.log('Admin user created.');

    // ---- Vehicles (15) ----
    const vehiclesData = [
      { plateNumber: 'VAN-001', type: 'van', make: 'Ford', model: 'Transit', year: 2023, status: 'active', fuelType: 'diesel', capacity: 1200, currentMileage: 15230, lastMaintenance: '2026-02-15' },
      { plateNumber: 'VAN-002', type: 'van', make: 'Mercedes', model: 'Sprinter', year: 2022, status: 'active', fuelType: 'diesel', capacity: 1500, currentMileage: 28450, lastMaintenance: '2026-01-20' },
      { plateNumber: 'TRK-001', type: 'truck', make: 'Isuzu', model: 'NPR', year: 2021, status: 'active', fuelType: 'diesel', capacity: 3000, currentMileage: 45600, lastMaintenance: '2026-03-01' },
      { plateNumber: 'TRK-002', type: 'truck', make: 'Freightliner', model: 'M2', year: 2020, status: 'maintenance', fuelType: 'diesel', capacity: 5000, currentMileage: 67800, lastMaintenance: '2026-02-28' },
      { plateNumber: 'CAR-001', type: 'car', make: 'Toyota', model: 'Corolla', year: 2024, status: 'active', fuelType: 'hybrid', capacity: 300, currentMileage: 5200, lastMaintenance: '2026-03-10' },
      { plateNumber: 'CAR-002', type: 'car', make: 'Honda', model: 'Civic', year: 2023, status: 'active', fuelType: 'gasoline', capacity: 280, currentMileage: 12400, lastMaintenance: '2026-02-05' },
      { plateNumber: 'BKE-001', type: 'bike', make: 'Rad Power', model: 'RadRunner', year: 2024, status: 'active', fuelType: 'electric', capacity: 50, currentMileage: 3200, lastMaintenance: '2026-03-05' },
      { plateNumber: 'BKE-002', type: 'bike', make: 'Aventon', model: 'Abound', year: 2024, status: 'active', fuelType: 'electric', capacity: 45, currentMileage: 2100, lastMaintenance: '2026-02-20' },
      { plateNumber: 'MCY-001', type: 'motorcycle', make: 'Honda', model: 'PCX', year: 2023, status: 'active', fuelType: 'gasoline', capacity: 80, currentMileage: 8900, lastMaintenance: '2026-01-15' },
      { plateNumber: 'MCY-002', type: 'motorcycle', make: 'Yamaha', model: 'NMAX', year: 2022, status: 'active', fuelType: 'gasoline', capacity: 75, currentMileage: 14500, lastMaintenance: '2026-02-10' },
      { plateNumber: 'VAN-003', type: 'van', make: 'Ram', model: 'ProMaster', year: 2023, status: 'active', fuelType: 'gasoline', capacity: 1400, currentMileage: 19800, lastMaintenance: '2026-03-08' },
      { plateNumber: 'VAN-004', type: 'van', make: 'Chevrolet', model: 'Express', year: 2021, status: 'retired', fuelType: 'gasoline', capacity: 1300, currentMileage: 89000, lastMaintenance: '2025-12-01' },
      { plateNumber: 'TRK-003', type: 'truck', make: 'Hino', model: '195', year: 2022, status: 'active', fuelType: 'diesel', capacity: 4000, currentMileage: 34200, lastMaintenance: '2026-03-12' },
      { plateNumber: 'CAR-003', type: 'car', make: 'Tesla', model: 'Model 3', year: 2024, status: 'active', fuelType: 'electric', capacity: 250, currentMileage: 7600, lastMaintenance: '2026-03-01' },
      { plateNumber: 'VAN-005', type: 'van', make: 'Nissan', model: 'NV200', year: 2022, status: 'active', fuelType: 'gasoline', capacity: 900, currentMileage: 22300, lastMaintenance: '2026-02-25' },
    ];
    const vehicles = await Vehicle.bulkCreate(vehiclesData);
    console.log(`${vehicles.length} vehicles created.`);

    // ---- Zones (15) ----
    const zonesData = [
      { name: 'Downtown Core', description: 'Central business district', city: 'New York', state: 'NY', zipCodeRange: '10001-10010', baseDeliveryCost: 8.50, avgDeliveryTime: 25, activeDrivers: 5, demandLevel: 'high', status: 'active' },
      { name: 'Midtown East', description: 'Commercial and residential mix', city: 'New York', state: 'NY', zipCodeRange: '10016-10022', baseDeliveryCost: 7.00, avgDeliveryTime: 30, activeDrivers: 4, demandLevel: 'high', status: 'active' },
      { name: 'Upper West Side', description: 'Residential area', city: 'New York', state: 'NY', zipCodeRange: '10023-10027', baseDeliveryCost: 6.50, avgDeliveryTime: 35, activeDrivers: 3, demandLevel: 'medium', status: 'active' },
      { name: 'Brooklyn Heights', description: 'Dense residential neighborhood', city: 'Brooklyn', state: 'NY', zipCodeRange: '11201-11205', baseDeliveryCost: 7.50, avgDeliveryTime: 32, activeDrivers: 3, demandLevel: 'medium', status: 'active' },
      { name: 'Williamsburg', description: 'Trendy mixed-use area', city: 'Brooklyn', state: 'NY', zipCodeRange: '11206-11211', baseDeliveryCost: 7.00, avgDeliveryTime: 28, activeDrivers: 4, demandLevel: 'high', status: 'active' },
      { name: 'Astoria', description: 'Diverse residential area', city: 'Queens', state: 'NY', zipCodeRange: '11101-11106', baseDeliveryCost: 6.00, avgDeliveryTime: 38, activeDrivers: 2, demandLevel: 'medium', status: 'active' },
      { name: 'Long Island City', description: 'Developing commercial area', city: 'Queens', state: 'NY', zipCodeRange: '11109-11120', baseDeliveryCost: 6.50, avgDeliveryTime: 35, activeDrivers: 3, demandLevel: 'medium', status: 'active' },
      { name: 'Harlem', description: 'Historic residential neighborhood', city: 'New York', state: 'NY', zipCodeRange: '10026-10037', baseDeliveryCost: 5.50, avgDeliveryTime: 40, activeDrivers: 2, demandLevel: 'low', status: 'active' },
      { name: 'SoHo', description: 'Shopping and commercial district', city: 'New York', state: 'NY', zipCodeRange: '10012-10013', baseDeliveryCost: 9.00, avgDeliveryTime: 22, activeDrivers: 4, demandLevel: 'high', status: 'active' },
      { name: 'Chelsea', description: 'Mixed residential and commercial', city: 'New York', state: 'NY', zipCodeRange: '10011-10014', baseDeliveryCost: 7.50, avgDeliveryTime: 28, activeDrivers: 3, demandLevel: 'medium', status: 'active' },
      { name: 'Financial District', description: 'Business hub with high-rise offices', city: 'New York', state: 'NY', zipCodeRange: '10004-10007', baseDeliveryCost: 9.50, avgDeliveryTime: 20, activeDrivers: 5, demandLevel: 'high', status: 'active' },
      { name: 'Jersey City', description: 'Suburban commercial area', city: 'Jersey City', state: 'NJ', zipCodeRange: '07301-07310', baseDeliveryCost: 8.00, avgDeliveryTime: 45, activeDrivers: 2, demandLevel: 'low', status: 'active' },
      { name: 'Hoboken', description: 'Dense walkable city', city: 'Hoboken', state: 'NJ', zipCodeRange: '07030-07032', baseDeliveryCost: 7.00, avgDeliveryTime: 42, activeDrivers: 2, demandLevel: 'medium', status: 'active' },
      { name: 'East Village', description: 'Vibrant nightlife and dining area', city: 'New York', state: 'NY', zipCodeRange: '10003-10009', baseDeliveryCost: 7.50, avgDeliveryTime: 26, activeDrivers: 3, demandLevel: 'high', status: 'active' },
      { name: 'South Bronx', description: 'Industrial and residential', city: 'Bronx', state: 'NY', zipCodeRange: '10451-10460', baseDeliveryCost: 5.00, avgDeliveryTime: 50, activeDrivers: 1, demandLevel: 'low', status: 'inactive' },
    ];
    const zones = await Zone.bulkCreate(zonesData);
    console.log(`${zones.length} zones created.`);

    // ---- Drivers (15) ----
    const driversData = [
      { name: 'Marcus Johnson', email: 'marcus.j@lastmile.com', phone: '212-555-0101', licenseNumber: 'DL-NY-10001', status: 'available', rating: 4.8, totalDeliveries: 1245, currentLocation: '40.7580,-73.9855', vehicleId: 1, hireDate: '2023-03-15' },
      { name: 'Sarah Chen', email: 'sarah.c@lastmile.com', phone: '212-555-0102', licenseNumber: 'DL-NY-10002', status: 'on_delivery', rating: 4.9, totalDeliveries: 2130, currentLocation: '40.7484,-73.9856', vehicleId: 2, hireDate: '2022-08-20' },
      { name: 'James Williams', email: 'james.w@lastmile.com', phone: '212-555-0103', licenseNumber: 'DL-NY-10003', status: 'available', rating: 4.7, totalDeliveries: 987, currentLocation: '40.7831,-73.9712', vehicleId: 3, hireDate: '2023-06-01' },
      { name: 'Maria Rodriguez', email: 'maria.r@lastmile.com', phone: '718-555-0104', licenseNumber: 'DL-NY-10004', status: 'on_delivery', rating: 4.6, totalDeliveries: 1567, currentLocation: '40.6892,-73.9857', vehicleId: 5, hireDate: '2022-11-10' },
      { name: 'David Kim', email: 'david.k@lastmile.com', phone: '718-555-0105', licenseNumber: 'DL-NY-10005', status: 'available', rating: 4.9, totalDeliveries: 2456, currentLocation: '40.7128,-74.0060', vehicleId: 6, hireDate: '2021-05-22' },
      { name: 'Emily Thompson', email: 'emily.t@lastmile.com', phone: '212-555-0106', licenseNumber: 'DL-NY-10006', status: 'off_duty', rating: 4.5, totalDeliveries: 678, currentLocation: '40.7282,-73.7949', vehicleId: 7, hireDate: '2024-01-15' },
      { name: 'Carlos Mendez', email: 'carlos.m@lastmile.com', phone: '347-555-0107', licenseNumber: 'DL-NY-10007', status: 'on_delivery', rating: 4.7, totalDeliveries: 1890, currentLocation: '40.7589,-73.9851', vehicleId: 8, hireDate: '2022-04-08' },
      { name: 'Lisa Park', email: 'lisa.p@lastmile.com', phone: '212-555-0108', licenseNumber: 'DL-NY-10008', status: 'available', rating: 4.8, totalDeliveries: 1456, currentLocation: '40.7505,-73.9934', vehicleId: 9, hireDate: '2023-02-28' },
      { name: 'Robert Brown', email: 'robert.b@lastmile.com', phone: '917-555-0109', licenseNumber: 'DL-NY-10009', status: 'on_break', rating: 4.4, totalDeliveries: 543, currentLocation: '40.7614,-73.9776', vehicleId: 10, hireDate: '2024-06-12' },
      { name: 'Amanda Davis', email: 'amanda.d@lastmile.com', phone: '646-555-0110', licenseNumber: 'DL-NY-10010', status: 'available', rating: 4.6, totalDeliveries: 876, currentLocation: '40.7282,-73.9942', vehicleId: 11, hireDate: '2023-09-05' },
      { name: 'Michael Lee', email: 'michael.l@lastmile.com', phone: '212-555-0111', licenseNumber: 'DL-NY-10011', status: 'on_delivery', rating: 4.8, totalDeliveries: 1654, currentLocation: '40.7061,-74.0088', vehicleId: 13, hireDate: '2022-07-18' },
      { name: 'Jennifer White', email: 'jennifer.w@lastmile.com', phone: '718-555-0112', licenseNumber: 'DL-NY-10012', status: 'available', rating: 4.7, totalDeliveries: 1234, currentLocation: '40.6782,-73.9442', vehicleId: 14, hireDate: '2023-01-10' },
      { name: 'Thomas Garcia', email: 'thomas.g@lastmile.com', phone: '347-555-0113', licenseNumber: 'DL-NY-10013', status: 'off_duty', rating: 4.3, totalDeliveries: 432, currentLocation: '40.7433,-74.0324', vehicleId: 15, hireDate: '2024-09-01' },
      { name: 'Aisha Patel', email: 'aisha.p@lastmile.com', phone: '917-555-0114', licenseNumber: 'DL-NY-10014', status: 'available', rating: 4.9, totalDeliveries: 1987, currentLocation: '40.7527,-73.9772', vehicleId: 1, hireDate: '2022-02-14' },
      { name: 'Kevin O\'Brien', email: 'kevin.o@lastmile.com', phone: '646-555-0115', licenseNumber: 'DL-NY-10015', status: 'on_delivery', rating: 4.5, totalDeliveries: 765, currentLocation: '40.7648,-73.9808', vehicleId: 3, hireDate: '2023-11-20' },
    ];
    const drivers = await Driver.bulkCreate(driversData);
    console.log(`${drivers.length} drivers created.`);

    // ---- Customers (15) ----
    const customersData = [
      { name: 'John Smith', email: 'john.smith@email.com', phone: '212-555-1001', address: '123 Broadway', city: 'New York', state: 'NY', zipCode: '10001', totalOrders: 24, customerSince: '2023-01-15', preferredTimeSlot: '9AM-12PM', notes: 'Leave at door' },
      { name: 'Emma Wilson', email: 'emma.w@email.com', phone: '212-555-1002', address: '456 5th Ave', city: 'New York', state: 'NY', zipCode: '10018', totalOrders: 15, customerSince: '2023-06-20', preferredTimeSlot: '12PM-3PM', notes: 'Ring buzzer 4B' },
      { name: 'Michael Chang', email: 'michael.c@email.com', phone: '718-555-1003', address: '789 Atlantic Ave', city: 'Brooklyn', state: 'NY', zipCode: '11201', totalOrders: 32, customerSince: '2022-11-05', preferredTimeSlot: '3PM-6PM', notes: null },
      { name: 'Sophie Anderson', email: 'sophie.a@email.com', phone: '212-555-1004', address: '321 W 86th St', city: 'New York', state: 'NY', zipCode: '10024', totalOrders: 8, customerSince: '2024-03-10', preferredTimeSlot: '9AM-12PM', notes: 'Fragile items - handle with care' },
      { name: 'Daniel Martinez', email: 'daniel.m@email.com', phone: '347-555-1005', address: '654 Bedford Ave', city: 'Brooklyn', state: 'NY', zipCode: '11211', totalOrders: 45, customerSince: '2022-05-18', preferredTimeSlot: '6PM-9PM', notes: 'Back entrance preferred' },
      { name: 'Olivia Taylor', email: 'olivia.t@email.com', phone: '917-555-1006', address: '987 Steinway St', city: 'Queens', state: 'NY', zipCode: '11103', totalOrders: 12, customerSince: '2024-01-08', preferredTimeSlot: '12PM-3PM', notes: null },
      { name: 'William Brown', email: 'william.b@email.com', phone: '646-555-1007', address: '147 Spring St', city: 'New York', state: 'NY', zipCode: '10012', totalOrders: 56, customerSince: '2021-09-22', preferredTimeSlot: '9AM-12PM', notes: 'Business address - reception desk' },
      { name: 'Isabella Garcia', email: 'isabella.g@email.com', phone: '212-555-1008', address: '258 W 23rd St', city: 'New York', state: 'NY', zipCode: '10011', totalOrders: 19, customerSince: '2023-08-14', preferredTimeSlot: '3PM-6PM', notes: 'Call before delivery' },
      { name: 'James Thompson', email: 'james.t@email.com', phone: '718-555-1009', address: '369 Court St', city: 'Brooklyn', state: 'NY', zipCode: '11231', totalOrders: 27, customerSince: '2023-03-30', preferredTimeSlot: '12PM-3PM', notes: null },
      { name: 'Mia Robinson', email: 'mia.r@email.com', phone: '347-555-1010', address: '741 Vernon Blvd', city: 'Queens', state: 'NY', zipCode: '11101', totalOrders: 5, customerSince: '2025-01-05', preferredTimeSlot: '6PM-9PM', notes: 'New customer' },
      { name: 'Alexander Lee', email: 'alex.l@email.com', phone: '917-555-1011', address: '852 Wall St', city: 'New York', state: 'NY', zipCode: '10005', totalOrders: 38, customerSince: '2022-07-12', preferredTimeSlot: '9AM-12PM', notes: 'Office deliveries only weekdays' },
      { name: 'Charlotte Davis', email: 'charlotte.d@email.com', phone: '646-555-1012', address: '963 E 7th St', city: 'New York', state: 'NY', zipCode: '10009', totalOrders: 21, customerSince: '2023-05-25', preferredTimeSlot: '3PM-6PM', notes: 'Apt 3R' },
      { name: 'Ethan Moore', email: 'ethan.m@email.com', phone: '201-555-1013', address: '159 Grove St', city: 'Jersey City', state: 'NJ', zipCode: '07302', totalOrders: 9, customerSince: '2024-07-19', preferredTimeSlot: '12PM-3PM', notes: null },
      { name: 'Ava Martinez', email: 'ava.m@email.com', phone: '201-555-1014', address: '267 Washington St', city: 'Hoboken', state: 'NJ', zipCode: '07030', totalOrders: 14, customerSince: '2023-10-02', preferredTimeSlot: '9AM-12PM', notes: 'Concierge building' },
      { name: 'Noah Johnson', email: 'noah.j@email.com', phone: '718-555-1015', address: '483 Grand Concourse', city: 'Bronx', state: 'NY', zipCode: '10451', totalOrders: 7, customerSince: '2024-11-30', preferredTimeSlot: '6PM-9PM', notes: null },
    ];
    const customers = await Customer.bulkCreate(customersData);
    console.log(`${customers.length} customers created.`);

    // ---- Warehouses (15) ----
    const warehousesData = [
      { name: 'Manhattan Central Hub', address: '100 W 33rd St', city: 'New York', state: 'NY', zipCode: '10001', capacity: 5000, currentLoad: 3200, managerId: 1, phone: '212-555-2001', operatingHours: '6AM-10PM', status: 'active' },
      { name: 'Brooklyn Distribution Center', address: '200 Flushing Ave', city: 'Brooklyn', state: 'NY', zipCode: '11205', capacity: 8000, currentLoad: 5400, managerId: 1, phone: '718-555-2002', operatingHours: '24/7', status: 'active' },
      { name: 'Queens Sorting Facility', address: '300 Northern Blvd', city: 'Queens', state: 'NY', zipCode: '11101', capacity: 6000, currentLoad: 2800, managerId: 1, phone: '718-555-2003', operatingHours: '5AM-11PM', status: 'active' },
      { name: 'Bronx Logistics Hub', address: '400 E 149th St', city: 'Bronx', state: 'NY', zipCode: '10451', capacity: 4000, currentLoad: 1200, managerId: 1, phone: '718-555-2004', operatingHours: '7AM-9PM', status: 'active' },
      { name: 'Jersey City Warehouse', address: '500 Marin Blvd', city: 'Jersey City', state: 'NJ', zipCode: '07302', capacity: 7000, currentLoad: 4100, managerId: 1, phone: '201-555-2005', operatingHours: '24/7', status: 'active' },
      { name: 'SoHo Express Point', address: '150 Wooster St', city: 'New York', state: 'NY', zipCode: '10012', capacity: 1500, currentLoad: 980, managerId: 1, phone: '212-555-2006', operatingHours: '8AM-8PM', status: 'active' },
      { name: 'FiDi Micro Hub', address: '75 Maiden Ln', city: 'New York', state: 'NY', zipCode: '10005', capacity: 1000, currentLoad: 750, managerId: 1, phone: '212-555-2007', operatingHours: '7AM-7PM', status: 'active' },
      { name: 'Williamsburg Depot', address: '350 Kent Ave', city: 'Brooklyn', state: 'NY', zipCode: '11211', capacity: 3000, currentLoad: 2100, managerId: 1, phone: '718-555-2008', operatingHours: '6AM-10PM', status: 'active' },
      { name: 'Astoria Local Hub', address: '25-10 Broadway', city: 'Queens', state: 'NY', zipCode: '11106', capacity: 2000, currentLoad: 900, managerId: 1, phone: '718-555-2009', operatingHours: '8AM-9PM', status: 'active' },
      { name: 'Chelsea Storage', address: '220 W 19th St', city: 'New York', state: 'NY', zipCode: '10011', capacity: 2500, currentLoad: 1800, managerId: 1, phone: '212-555-2010', operatingHours: '7AM-10PM', status: 'active' },
      { name: 'Harlem North Point', address: '450 Malcolm X Blvd', city: 'New York', state: 'NY', zipCode: '10037', capacity: 3500, currentLoad: 1500, managerId: 1, phone: '212-555-2011', operatingHours: '6AM-9PM', status: 'active' },
      { name: 'Hoboken Transit Hub', address: '100 Hudson Pl', city: 'Hoboken', state: 'NJ', zipCode: '07030', capacity: 2000, currentLoad: 1100, managerId: 1, phone: '201-555-2012', operatingHours: '7AM-8PM', status: 'active' },
      { name: 'LIC Express Center', address: '42-01 Queens Blvd', city: 'Queens', state: 'NY', zipCode: '11109', capacity: 4500, currentLoad: 3000, managerId: 1, phone: '718-555-2013', operatingHours: '24/7', status: 'active' },
      { name: 'Midtown Staging Area', address: '315 E 45th St', city: 'New York', state: 'NY', zipCode: '10017', capacity: 1800, currentLoad: 1200, managerId: 1, phone: '212-555-2014', operatingHours: '6AM-11PM', status: 'active' },
      { name: 'South Brooklyn Reserve', address: '750 4th Ave', city: 'Brooklyn', state: 'NY', zipCode: '11232', capacity: 5500, currentLoad: 200, managerId: 1, phone: '718-555-2015', operatingHours: '8AM-6PM', status: 'inactive' },
    ];
    const warehouses = await Warehouse.bulkCreate(warehousesData);
    console.log(`${warehouses.length} warehouses created.`);

    // ---- Deliveries (20) ----
    const deliveriesData = [
      { trackingNumber: 'LM-2026-00001', status: 'delivered', customerName: 'John Smith', customerPhone: '212-555-1001', customerEmail: 'john.smith@email.com', pickupAddress: '100 W 33rd St, New York', deliveryAddress: '123 Broadway, New York', packageWeight: 2.5, packageSize: 'medium', priority: 'medium', estimatedDelivery: '2026-03-14T14:00:00Z', actualDelivery: '2026-03-14T13:45:00Z', driverId: 1, vehicleId: 1, zoneId: 1, cost: 12.50, notes: 'Delivered to doorstep', aiOptimized: true },
      { trackingNumber: 'LM-2026-00002', status: 'in_transit', customerName: 'Emma Wilson', customerPhone: '212-555-1002', customerEmail: 'emma.w@email.com', pickupAddress: '200 Flushing Ave, Brooklyn', deliveryAddress: '456 5th Ave, New York', packageWeight: 1.2, packageSize: 'small', priority: 'high', estimatedDelivery: '2026-03-16T10:00:00Z', actualDelivery: null, driverId: 2, vehicleId: 2, zoneId: 2, cost: 15.00, notes: null, aiOptimized: true },
      { trackingNumber: 'LM-2026-00003', status: 'pending', customerName: 'Michael Chang', customerPhone: '718-555-1003', customerEmail: 'michael.c@email.com', pickupAddress: '200 Flushing Ave, Brooklyn', deliveryAddress: '789 Atlantic Ave, Brooklyn', packageWeight: 5.0, packageSize: 'large', priority: 'low', estimatedDelivery: '2026-03-18T16:00:00Z', actualDelivery: null, driverId: null, vehicleId: null, zoneId: 4, cost: 9.50, notes: 'Heavy package', aiOptimized: false },
      { trackingNumber: 'LM-2026-00004', status: 'delivered', customerName: 'Sophie Anderson', customerPhone: '212-555-1004', customerEmail: 'sophie.a@email.com', pickupAddress: '100 W 33rd St, New York', deliveryAddress: '321 W 86th St, New York', packageWeight: 0.8, packageSize: 'small', priority: 'urgent', estimatedDelivery: '2026-03-13T12:00:00Z', actualDelivery: '2026-03-13T11:30:00Z', driverId: 3, vehicleId: 3, zoneId: 3, cost: 22.00, notes: 'Fragile - handled with care', aiOptimized: true },
      { trackingNumber: 'LM-2026-00005', status: 'in_transit', customerName: 'Daniel Martinez', customerPhone: '347-555-1005', customerEmail: 'daniel.m@email.com', pickupAddress: '350 Kent Ave, Brooklyn', deliveryAddress: '654 Bedford Ave, Brooklyn', packageWeight: 3.2, packageSize: 'medium', priority: 'medium', estimatedDelivery: '2026-03-16T15:00:00Z', actualDelivery: null, driverId: 4, vehicleId: 5, zoneId: 5, cost: 11.00, notes: null, aiOptimized: true },
      { trackingNumber: 'LM-2026-00006', status: 'picked_up', customerName: 'Olivia Taylor', customerPhone: '917-555-1006', customerEmail: 'olivia.t@email.com', pickupAddress: '300 Northern Blvd, Queens', deliveryAddress: '987 Steinway St, Queens', packageWeight: 1.5, packageSize: 'small', priority: 'medium', estimatedDelivery: '2026-03-16T18:00:00Z', actualDelivery: null, driverId: 7, vehicleId: 8, zoneId: 6, cost: 8.00, notes: null, aiOptimized: false },
      { trackingNumber: 'LM-2026-00007', status: 'delivered', customerName: 'William Brown', customerPhone: '646-555-1007', customerEmail: 'william.b@email.com', pickupAddress: '150 Wooster St, New York', deliveryAddress: '147 Spring St, New York', packageWeight: 4.5, packageSize: 'large', priority: 'high', estimatedDelivery: '2026-03-12T11:00:00Z', actualDelivery: '2026-03-12T10:50:00Z', driverId: 5, vehicleId: 6, zoneId: 9, cost: 18.00, notes: 'Business delivery - signed', aiOptimized: true },
      { trackingNumber: 'LM-2026-00008', status: 'failed', customerName: 'Isabella Garcia', customerPhone: '212-555-1008', customerEmail: 'isabella.g@email.com', pickupAddress: '220 W 19th St, New York', deliveryAddress: '258 W 23rd St, New York', packageWeight: 2.0, packageSize: 'medium', priority: 'medium', estimatedDelivery: '2026-03-15T14:00:00Z', actualDelivery: null, driverId: 8, vehicleId: 9, zoneId: 10, cost: 10.50, notes: 'Customer not available - 2 attempts', aiOptimized: false },
      { trackingNumber: 'LM-2026-00009', status: 'in_transit', customerName: 'James Thompson', customerPhone: '718-555-1009', customerEmail: 'james.t@email.com', pickupAddress: '200 Flushing Ave, Brooklyn', deliveryAddress: '369 Court St, Brooklyn', packageWeight: 6.8, packageSize: 'large', priority: 'low', estimatedDelivery: '2026-03-17T16:00:00Z', actualDelivery: null, driverId: 11, vehicleId: 13, zoneId: 4, cost: 13.00, notes: 'Heavy - use dolly', aiOptimized: true },
      { trackingNumber: 'LM-2026-00010', status: 'pending', customerName: 'Mia Robinson', customerPhone: '347-555-1010', customerEmail: 'mia.r@email.com', pickupAddress: '42-01 Queens Blvd, Queens', deliveryAddress: '741 Vernon Blvd, Queens', packageWeight: 1.0, packageSize: 'small', priority: 'medium', estimatedDelivery: '2026-03-19T12:00:00Z', actualDelivery: null, driverId: null, vehicleId: null, zoneId: 7, cost: 8.50, notes: null, aiOptimized: false },
      { trackingNumber: 'LM-2026-00011', status: 'delivered', customerName: 'Alexander Lee', customerPhone: '917-555-1011', customerEmail: 'alex.l@email.com', pickupAddress: '75 Maiden Ln, New York', deliveryAddress: '852 Wall St, New York', packageWeight: 0.5, packageSize: 'small', priority: 'urgent', estimatedDelivery: '2026-03-15T09:00:00Z', actualDelivery: '2026-03-15T08:45:00Z', driverId: 5, vehicleId: 6, zoneId: 11, cost: 25.00, notes: 'Express delivery', aiOptimized: true },
      { trackingNumber: 'LM-2026-00012', status: 'in_transit', customerName: 'Charlotte Davis', customerPhone: '646-555-1012', customerEmail: 'charlotte.d@email.com', pickupAddress: '100 W 33rd St, New York', deliveryAddress: '963 E 7th St, New York', packageWeight: 3.0, packageSize: 'medium', priority: 'high', estimatedDelivery: '2026-03-16T11:00:00Z', actualDelivery: null, driverId: 15, vehicleId: 3, zoneId: 14, cost: 14.00, notes: null, aiOptimized: true },
      { trackingNumber: 'LM-2026-00013', status: 'pending', customerName: 'Ethan Moore', customerPhone: '201-555-1013', customerEmail: 'ethan.m@email.com', pickupAddress: '500 Marin Blvd, Jersey City', deliveryAddress: '159 Grove St, Jersey City', packageWeight: 2.2, packageSize: 'medium', priority: 'low', estimatedDelivery: '2026-03-20T14:00:00Z', actualDelivery: null, driverId: null, vehicleId: null, zoneId: 12, cost: 10.00, notes: null, aiOptimized: false },
      { trackingNumber: 'LM-2026-00014', status: 'delivered', customerName: 'Ava Martinez', customerPhone: '201-555-1014', customerEmail: 'ava.m@email.com', pickupAddress: '100 Hudson Pl, Hoboken', deliveryAddress: '267 Washington St, Hoboken', packageWeight: 1.8, packageSize: 'small', priority: 'medium', estimatedDelivery: '2026-03-14T16:00:00Z', actualDelivery: '2026-03-14T15:30:00Z', driverId: 10, vehicleId: 11, zoneId: 13, cost: 9.00, notes: 'Left with concierge', aiOptimized: true },
      { trackingNumber: 'LM-2026-00015', status: 'picked_up', customerName: 'Noah Johnson', customerPhone: '718-555-1015', customerEmail: 'noah.j@email.com', pickupAddress: '400 E 149th St, Bronx', deliveryAddress: '483 Grand Concourse, Bronx', packageWeight: 7.5, packageSize: 'large', priority: 'low', estimatedDelivery: '2026-03-18T18:00:00Z', actualDelivery: null, driverId: 12, vehicleId: 14, zoneId: 15, cost: 7.50, notes: 'Oversized package', aiOptimized: false },
      { trackingNumber: 'LM-2026-00016', status: 'delivered', customerName: 'John Smith', customerPhone: '212-555-1001', customerEmail: 'john.smith@email.com', pickupAddress: '315 E 45th St, New York', deliveryAddress: '123 Broadway, New York', packageWeight: 1.1, packageSize: 'small', priority: 'high', estimatedDelivery: '2026-03-11T10:00:00Z', actualDelivery: '2026-03-11T09:55:00Z', driverId: 14, vehicleId: 1, zoneId: 1, cost: 16.00, notes: 'Repeat customer', aiOptimized: true },
      { trackingNumber: 'LM-2026-00017', status: 'in_transit', customerName: 'Daniel Martinez', customerPhone: '347-555-1005', customerEmail: 'daniel.m@email.com', pickupAddress: '350 Kent Ave, Brooklyn', deliveryAddress: '654 Bedford Ave, Brooklyn', packageWeight: 0.7, packageSize: 'small', priority: 'urgent', estimatedDelivery: '2026-03-16T09:00:00Z', actualDelivery: null, driverId: 7, vehicleId: 8, zoneId: 5, cost: 20.00, notes: 'Time-sensitive documents', aiOptimized: true },
      { trackingNumber: 'LM-2026-00018', status: 'pending', customerName: 'William Brown', customerPhone: '646-555-1007', customerEmail: 'william.b@email.com', pickupAddress: '150 Wooster St, New York', deliveryAddress: '147 Spring St, New York', packageWeight: 12.0, packageSize: 'large', priority: 'low', estimatedDelivery: '2026-03-21T14:00:00Z', actualDelivery: null, driverId: null, vehicleId: null, zoneId: 9, cost: 11.00, notes: 'Multiple boxes', aiOptimized: false },
      { trackingNumber: 'LM-2026-00019', status: 'delivered', customerName: 'Mia Robinson', customerPhone: '347-555-1010', customerEmail: 'mia.r@email.com', pickupAddress: '42-01 Queens Blvd, Queens', deliveryAddress: '741 Vernon Blvd, Queens', packageWeight: 2.8, packageSize: 'medium', priority: 'medium', estimatedDelivery: '2026-03-13T15:00:00Z', actualDelivery: '2026-03-13T14:20:00Z', driverId: 9, vehicleId: 10, zoneId: 7, cost: 9.50, notes: null, aiOptimized: true },
      { trackingNumber: 'LM-2026-00020', status: 'failed', customerName: 'Noah Johnson', customerPhone: '718-555-1015', customerEmail: 'noah.j@email.com', pickupAddress: '400 E 149th St, Bronx', deliveryAddress: '483 Grand Concourse, Bronx', packageWeight: 4.0, packageSize: 'medium', priority: 'medium', estimatedDelivery: '2026-03-15T17:00:00Z', actualDelivery: null, driverId: 6, vehicleId: 7, zoneId: 15, cost: 7.00, notes: 'Wrong address - returned to warehouse', aiOptimized: false },
    ];
    const deliveries = await Delivery.bulkCreate(deliveriesData);
    console.log(`${deliveries.length} deliveries created.`);

    // ---- Packages (15) ----
    const packagesData = [
      { trackingNumber: 'PKG-2026-00001', weight: 2.5, length: 30, width: 20, height: 15, type: 'standard', status: 'delivered', deliveryId: 1, warehouseId: 1, description: 'Electronics - wireless headphones' },
      { trackingNumber: 'PKG-2026-00002', weight: 1.2, length: 25, width: 15, height: 10, type: 'standard', status: 'in_transit', deliveryId: 2, warehouseId: 2, description: 'Books and stationery' },
      { trackingNumber: 'PKG-2026-00003', weight: 5.0, length: 50, width: 40, height: 30, type: 'oversized', status: 'warehouse', deliveryId: 3, warehouseId: 2, description: 'Kitchen appliance - blender set' },
      { trackingNumber: 'PKG-2026-00004', weight: 0.8, length: 20, width: 15, height: 8, type: 'fragile', status: 'delivered', deliveryId: 4, warehouseId: 1, description: 'Crystal vase' },
      { trackingNumber: 'PKG-2026-00005', weight: 3.2, length: 35, width: 25, height: 20, type: 'standard', status: 'in_transit', deliveryId: 5, warehouseId: 8, description: 'Clothing and accessories' },
      { trackingNumber: 'PKG-2026-00006', weight: 1.5, length: 22, width: 18, height: 12, type: 'perishable', status: 'in_transit', deliveryId: 6, warehouseId: 3, description: 'Gourmet food items - refrigerated' },
      { trackingNumber: 'PKG-2026-00007', weight: 4.5, length: 45, width: 35, height: 25, type: 'standard', status: 'delivered', deliveryId: 7, warehouseId: 6, description: 'Office supplies bulk order' },
      { trackingNumber: 'PKG-2026-00008', weight: 2.0, length: 28, width: 22, height: 14, type: 'standard', status: 'returned', deliveryId: 8, warehouseId: 10, description: 'Home decor items' },
      { trackingNumber: 'PKG-2026-00009', weight: 6.8, length: 60, width: 45, height: 35, type: 'oversized', status: 'in_transit', deliveryId: 9, warehouseId: 2, description: 'Furniture parts - shelving unit' },
      { trackingNumber: 'PKG-2026-00010', weight: 1.0, length: 18, width: 12, height: 8, type: 'standard', status: 'warehouse', deliveryId: 10, warehouseId: 13, description: 'Personal care products' },
      { trackingNumber: 'PKG-2026-00011', weight: 0.5, length: 15, width: 10, height: 5, type: 'standard', status: 'delivered', deliveryId: 11, warehouseId: 7, description: 'Documents and contracts' },
      { trackingNumber: 'PKG-2026-00012', weight: 3.0, length: 32, width: 24, height: 18, type: 'fragile', status: 'in_transit', deliveryId: 12, warehouseId: 1, description: 'Ceramic dinnerware set' },
      { trackingNumber: 'PKG-2026-00013', weight: 2.2, length: 26, width: 20, height: 16, type: 'standard', status: 'warehouse', deliveryId: 13, warehouseId: 5, description: 'Sports equipment' },
      { trackingNumber: 'PKG-2026-00014', weight: 0.3, length: 12, width: 8, height: 4, type: 'hazardous', status: 'delivered', deliveryId: 14, warehouseId: 12, description: 'Lithium batteries - certified' },
      { trackingNumber: 'PKG-2026-00015', weight: 7.5, length: 70, width: 50, height: 40, type: 'oversized', status: 'in_transit', deliveryId: 15, warehouseId: 4, description: 'Fitness equipment' },
    ];
    const packages = await Package.bulkCreate(packagesData);
    console.log(`${packages.length} packages created.`);

    // ---- Routes (15) ----
    const routesData = [
      { name: 'Downtown Morning Express', startLocation: '100 W 33rd St, New York', endLocation: '123 Broadway, New York', distance: 12.5, estimatedTime: 45, optimizedTime: 38, stops: 6, driverId: 1, status: 'completed', aiScore: 92, fuelSaved: 1.2 },
      { name: 'Midtown-Brooklyn Loop', startLocation: '200 Flushing Ave, Brooklyn', endLocation: '456 5th Ave, New York', distance: 18.3, estimatedTime: 65, optimizedTime: 52, stops: 8, driverId: 2, status: 'active', aiScore: 88, fuelSaved: 2.1 },
      { name: 'Upper West Side Circuit', startLocation: '100 W 33rd St, New York', endLocation: '321 W 86th St, New York', distance: 8.7, estimatedTime: 35, optimizedTime: 28, stops: 4, driverId: 3, status: 'completed', aiScore: 95, fuelSaved: 0.8 },
      { name: 'Brooklyn Heights Route', startLocation: '200 Flushing Ave, Brooklyn', endLocation: '789 Atlantic Ave, Brooklyn', distance: 6.2, estimatedTime: 25, optimizedTime: 20, stops: 3, driverId: 4, status: 'active', aiScore: 90, fuelSaved: 0.5 },
      { name: 'SoHo-FiDi Express', startLocation: '150 Wooster St, New York', endLocation: '75 Maiden Ln, New York', distance: 4.8, estimatedTime: 20, optimizedTime: 15, stops: 5, driverId: 5, status: 'completed', aiScore: 97, fuelSaved: 0.4 },
      { name: 'Queens Distribution Run', startLocation: '300 Northern Blvd, Queens', endLocation: '987 Steinway St, Queens', distance: 15.6, estimatedTime: 55, optimizedTime: 43, stops: 7, driverId: 7, status: 'active', aiScore: 85, fuelSaved: 1.8 },
      { name: 'Williamsburg Local', startLocation: '350 Kent Ave, Brooklyn', endLocation: '654 Bedford Ave, Brooklyn', distance: 3.5, estimatedTime: 15, optimizedTime: 12, stops: 4, driverId: 7, status: 'completed', aiScore: 93, fuelSaved: 0.3 },
      { name: 'Chelsea-Village Loop', startLocation: '220 W 19th St, New York', endLocation: '963 E 7th St, New York', distance: 5.9, estimatedTime: 28, optimizedTime: 22, stops: 5, driverId: 8, status: 'planned', aiScore: 89, fuelSaved: 0.6 },
      { name: 'Jersey City Circuit', startLocation: '500 Marin Blvd, Jersey City', endLocation: '159 Grove St, Jersey City', distance: 7.4, estimatedTime: 30, optimizedTime: 25, stops: 4, driverId: 10, status: 'completed', aiScore: 91, fuelSaved: 0.7 },
      { name: 'Cross-Borough Express', startLocation: '100 W 33rd St, New York', endLocation: '400 E 149th St, Bronx', distance: 22.1, estimatedTime: 80, optimizedTime: 62, stops: 10, driverId: 11, status: 'active', aiScore: 82, fuelSaved: 3.2 },
      { name: 'Financial District AM', startLocation: '75 Maiden Ln, New York', endLocation: '852 Wall St, New York', distance: 2.1, estimatedTime: 12, optimizedTime: 9, stops: 3, driverId: 5, status: 'completed', aiScore: 98, fuelSaved: 0.2 },
      { name: 'Hoboken Express', startLocation: '100 Hudson Pl, Hoboken', endLocation: '267 Washington St, Hoboken', distance: 4.3, estimatedTime: 18, optimizedTime: 14, stops: 3, driverId: 12, status: 'completed', aiScore: 94, fuelSaved: 0.3 },
      { name: 'Evening Rush Multi-Stop', startLocation: '315 E 45th St, New York', endLocation: '123 Broadway, New York', distance: 9.8, estimatedTime: 42, optimizedTime: 33, stops: 6, driverId: 14, status: 'completed', aiScore: 87, fuelSaved: 1.1 },
      { name: 'LIC-Astoria Corridor', startLocation: '42-01 Queens Blvd, Queens', endLocation: '25-10 Broadway, Queens', distance: 5.5, estimatedTime: 22, optimizedTime: 17, stops: 4, driverId: 9, status: 'planned', aiScore: 91, fuelSaved: 0.5 },
      { name: 'South Bronx Delivery Run', startLocation: '400 E 149th St, Bronx', endLocation: '483 Grand Concourse, Bronx', distance: 3.8, estimatedTime: 16, optimizedTime: 13, stops: 3, driverId: 12, status: 'planned', aiScore: 86, fuelSaved: 0.3 },
    ];
    const routes = await Route.bulkCreate(routesData);
    console.log(`${routes.length} routes created.`);

    // ---- Incidents (15) ----
    const incidentsData = [
      { deliveryId: 8, driverId: 8, type: 'customer_complaint', severity: 'medium', description: 'Customer not home during delivery window. Two failed attempts.', resolution: 'Rescheduled delivery for next day with confirmed phone call.', status: 'resolved', reportedAt: '2026-03-15T14:30:00Z', resolvedAt: '2026-03-16T10:00:00Z' },
      { deliveryId: 20, driverId: 6, type: 'wrong_address', severity: 'high', description: 'Delivery address was incorrect. GPS pointed to vacant lot.', resolution: 'Customer provided updated address. Package returned to warehouse.', status: 'resolved', reportedAt: '2026-03-15T17:15:00Z', resolvedAt: '2026-03-16T09:00:00Z' },
      { deliveryId: 2, driverId: 2, type: 'delay', severity: 'low', description: 'Traffic congestion on Brooklyn Bridge caused 20-minute delay.', resolution: null, status: 'open', reportedAt: '2026-03-16T09:30:00Z', resolvedAt: null },
      { deliveryId: 9, driverId: 11, type: 'vehicle_breakdown', severity: 'high', description: 'Truck tire puncture on FDR Drive. Vehicle immobilized.', resolution: 'Roadside assistance dispatched. Packages transferred to backup vehicle.', status: 'resolved', reportedAt: '2026-03-16T11:00:00Z', resolvedAt: '2026-03-16T13:30:00Z' },
      { deliveryId: 5, driverId: 4, type: 'damage', severity: 'medium', description: 'Package dented during transport. External damage visible.', resolution: 'Customer notified. Replacement ordered and expedited.', status: 'investigating', reportedAt: '2026-03-16T12:00:00Z', resolvedAt: null },
      { deliveryId: 17, driverId: 7, type: 'delay', severity: 'medium', description: 'Building access code not working. Waiting for customer response.', resolution: null, status: 'open', reportedAt: '2026-03-16T09:15:00Z', resolvedAt: null },
      { deliveryId: 12, driverId: 15, type: 'weather', severity: 'low', description: 'Heavy rain causing slower delivery pace across Manhattan East.', resolution: 'Adjusted ETAs for all affected deliveries.', status: 'closed', reportedAt: '2026-03-16T08:00:00Z', resolvedAt: '2026-03-16T14:00:00Z' },
      { deliveryId: 1, driverId: 1, type: 'customer_complaint', severity: 'low', description: 'Customer said delivery arrived earlier than expected window.', resolution: 'Noted for future deliveries. Updated time preferences.', status: 'closed', reportedAt: '2026-03-14T14:00:00Z', resolvedAt: '2026-03-14T16:00:00Z' },
      { deliveryId: 15, driverId: 12, type: 'damage', severity: 'critical', description: 'Oversized package fell during loading. Contents possibly damaged.', resolution: null, status: 'investigating', reportedAt: '2026-03-16T07:30:00Z', resolvedAt: null },
      { deliveryId: 6, driverId: 7, type: 'delay', severity: 'low', description: 'Driver took a wrong turn in Queens. Minor route deviation.', resolution: 'AI route optimization suggested for future deliveries in this area.', status: 'closed', reportedAt: '2026-03-16T10:45:00Z', resolvedAt: '2026-03-16T11:00:00Z' },
      { deliveryId: 4, driverId: 3, type: 'lost', severity: 'critical', description: 'Package scanned at warehouse but not found in delivery vehicle.', resolution: 'Package located in wrong sorting bin. Re-routed for same-day delivery.', status: 'resolved', reportedAt: '2026-03-13T08:00:00Z', resolvedAt: '2026-03-13T09:30:00Z' },
      { deliveryId: 14, driverId: 10, type: 'vehicle_breakdown', severity: 'medium', description: 'Van engine warning light. Pulled over for safety check.', resolution: 'False alarm - sensor malfunction. Vehicle cleared for duty.', status: 'resolved', reportedAt: '2026-03-14T13:00:00Z', resolvedAt: '2026-03-14T14:00:00Z' },
      { deliveryId: 7, driverId: 5, type: 'customer_complaint', severity: 'low', description: 'Business customer requested specific delivery person for future orders.', resolution: 'Added driver preference to customer profile.', status: 'closed', reportedAt: '2026-03-12T12:00:00Z', resolvedAt: '2026-03-12T15:00:00Z' },
      { deliveryId: 19, driverId: 9, type: 'weather', severity: 'medium', description: 'Icy road conditions in Queens causing safety concerns.', resolution: 'Route modified to avoid hilly areas. Deliveries delayed by 30 min.', status: 'resolved', reportedAt: '2026-03-13T07:00:00Z', resolvedAt: '2026-03-13T12:00:00Z' },
      { deliveryId: 16, driverId: 14, type: 'delay', severity: 'low', description: 'Elevator out of service in high-rise building. Used stairs.', resolution: 'Delivery completed with 10-minute delay. Building notified.', status: 'closed', reportedAt: '2026-03-11T10:30:00Z', resolvedAt: '2026-03-11T11:00:00Z' },
    ];
    const incidents = await Incident.bulkCreate(incidentsData);
    console.log(`${incidents.length} incidents created.`);

    // ---- SLAs (15) ----
    const slasData = [
      { name: 'Standard Delivery', description: 'Regular delivery within 3-5 business days', deliveryTimeHours: 72, priority: 'low', onTimeTarget: 95, costPerDelivery: 5.00, penaltyRate: 0.10, status: 'active' },
      { name: 'Express Delivery', description: 'Next-day delivery by end of business', deliveryTimeHours: 24, priority: 'medium', onTimeTarget: 98, costPerDelivery: 12.00, penaltyRate: 0.25, status: 'active' },
      { name: 'Priority Delivery', description: 'Same-day delivery within 6 hours', deliveryTimeHours: 6, priority: 'high', onTimeTarget: 99, costPerDelivery: 20.00, penaltyRate: 0.50, status: 'active' },
      { name: 'Urgent Rush', description: 'Delivery within 2 hours of dispatch', deliveryTimeHours: 2, priority: 'urgent', onTimeTarget: 99.5, costPerDelivery: 35.00, penaltyRate: 1.00, status: 'active' },
      { name: 'Economy Shipping', description: 'Budget-friendly 5-7 day delivery', deliveryTimeHours: 168, priority: 'low', onTimeTarget: 90, costPerDelivery: 3.00, penaltyRate: 0.05, status: 'active' },
      { name: 'Scheduled Window', description: 'Delivery within customer-chosen 2-hour window', deliveryTimeHours: 48, priority: 'medium', onTimeTarget: 97, costPerDelivery: 15.00, penaltyRate: 0.30, status: 'active' },
      { name: 'Business Premium', description: 'Guaranteed morning delivery for business accounts', deliveryTimeHours: 12, priority: 'high', onTimeTarget: 99, costPerDelivery: 25.00, penaltyRate: 0.75, status: 'active' },
      { name: 'Weekend Delivery', description: 'Saturday/Sunday delivery service', deliveryTimeHours: 48, priority: 'medium', onTimeTarget: 95, costPerDelivery: 10.00, penaltyRate: 0.20, status: 'active' },
      { name: 'Fragile Handling', description: 'Special care delivery for fragile items', deliveryTimeHours: 48, priority: 'high', onTimeTarget: 99, costPerDelivery: 18.00, penaltyRate: 0.60, status: 'active' },
      { name: 'Bulk Delivery', description: 'Multi-package delivery for large orders', deliveryTimeHours: 72, priority: 'low', onTimeTarget: 94, costPerDelivery: 8.00, penaltyRate: 0.15, status: 'active' },
      { name: 'Temperature Controlled', description: 'Refrigerated delivery for perishable goods', deliveryTimeHours: 4, priority: 'urgent', onTimeTarget: 99.5, costPerDelivery: 30.00, penaltyRate: 1.50, status: 'active' },
      { name: 'White Glove Service', description: 'Premium delivery with setup and installation', deliveryTimeHours: 24, priority: 'high', onTimeTarget: 99, costPerDelivery: 50.00, penaltyRate: 2.00, status: 'active' },
      { name: 'Return Pickup', description: 'Scheduled pickup for return items', deliveryTimeHours: 48, priority: 'low', onTimeTarget: 93, costPerDelivery: 6.00, penaltyRate: 0.10, status: 'active' },
      { name: 'Cross-Borough Express', description: 'Fast delivery across borough lines', deliveryTimeHours: 8, priority: 'high', onTimeTarget: 97, costPerDelivery: 22.00, penaltyRate: 0.45, status: 'active' },
      { name: 'Legacy Standard', description: 'Old standard delivery tier - being phased out', deliveryTimeHours: 120, priority: 'low', onTimeTarget: 85, costPerDelivery: 4.00, penaltyRate: 0.05, status: 'inactive' },
    ];
    const slas = await SLA.bulkCreate(slasData);
    console.log(`${slas.length} SLAs created.`);

    // ---- Performance Metrics (15) ----
    const perfData = [];
    const perfDates = [
      '2026-03-10', '2026-03-11', '2026-03-12', '2026-03-13', '2026-03-14',
    ];
    for (let i = 0; i < 15; i++) {
      const dId = (i % 15) + 1;
      perfData.push({
        driverId: dId,
        date: perfDates[i % perfDates.length],
        deliveriesCompleted: Math.floor(Math.random() * 20) + 5,
        onTimeRate: parseFloat((85 + Math.random() * 15).toFixed(1)),
        avgDeliveryTime: parseFloat((18 + Math.random() * 25).toFixed(1)),
        customerRating: parseFloat((3.8 + Math.random() * 1.2).toFixed(1)),
        fuelEfficiency: parseFloat((6 + Math.random() * 8).toFixed(1)),
        incidentCount: Math.floor(Math.random() * 3),
        earnings: parseFloat((120 + Math.random() * 180).toFixed(2)),
      });
    }
    const performanceMetrics = await PerformanceMetric.bulkCreate(perfData);
    console.log(`${performanceMetrics.length} performance metrics created.`);

    // ---- Cost Analyses (15) ----
    const costData = [];
    const costDates = [
      '2026-03-01', '2026-03-02', '2026-03-03', '2026-03-04', '2026-03-05',
      '2026-03-06', '2026-03-07', '2026-03-08', '2026-03-09', '2026-03-10',
      '2026-03-11', '2026-03-12', '2026-03-13', '2026-03-14', '2026-03-15',
    ];
    for (let i = 0; i < 15; i++) {
      const totalDel = Math.floor(Math.random() * 80) + 40;
      const fuel = parseFloat((150 + Math.random() * 200).toFixed(2));
      const labor = parseFloat((800 + Math.random() * 600).toFixed(2));
      const maint = parseFloat((50 + Math.random() * 150).toFixed(2));
      const totalCost = parseFloat((fuel + labor + maint).toFixed(2));
      const revenue = parseFloat((totalCost * (1.2 + Math.random() * 0.4)).toFixed(2));
      costData.push({
        date: costDates[i],
        totalDeliveries: totalDel,
        totalCost,
        fuelCost: fuel,
        laborCost: labor,
        maintenanceCost: maint,
        avgCostPerDelivery: parseFloat((totalCost / totalDel).toFixed(2)),
        revenue,
        profit: parseFloat((revenue - totalCost).toFixed(2)),
        zoneId: (i % 14) + 1,
      });
    }
    const costAnalyses = await CostAnalysis.bulkCreate(costData);
    console.log(`${costAnalyses.length} cost analyses created.`);

    // ---- Demand Forecasts (15) ----
    const forecastData = [];
    const forecastDates = [
      '2026-03-17', '2026-03-18', '2026-03-19', '2026-03-20', '2026-03-21',
      '2026-03-22', '2026-03-23', '2026-03-24', '2026-03-25', '2026-03-26',
      '2026-03-27', '2026-03-28', '2026-03-29', '2026-03-30', '2026-03-31',
    ];
    const forecastFactors = [
      'Weather: sunny, high foot traffic expected',
      'Holiday weekend approaching, expect surge',
      'Midweek normal operations',
      'Construction on main roads, potential delays',
      'New business accounts starting this week',
      'Seasonal product launches driving demand',
      'Post-weekend inventory restocking',
    ];
    for (let i = 0; i < 15; i++) {
      const predicted = Math.floor(Math.random() * 100) + 30;
      forecastData.push({
        date: forecastDates[i],
        zoneId: (i % 14) + 1,
        predictedDeliveries: predicted,
        actualDeliveries: i < 5 ? Math.floor(predicted * (0.85 + Math.random() * 0.3)) : null,
        confidence: parseFloat((0.70 + Math.random() * 0.25).toFixed(2)),
        factors: forecastFactors[i % forecastFactors.length],
        aiModelUsed: i % 2 === 0 ? 'claude-haiku-4.5' : 'random-forest-v2',
      });
    }
    const demandForecasts = await DemandForecast.bulkCreate(forecastData);
    console.log(`${demandForecasts.length} demand forecasts created.`);

    console.log('\nSeed completed successfully!');
    console.log('Admin login: admin@lastmile.com / password123');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
