import React, { useState, useEffect } from 'react';
import { getDashboard, deliveriesAPI } from '../services/api';
import { Package, Users, Truck, DollarSign, Clock, AlertCircle, TrendingUp, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [dashRes, delRes] = await Promise.allSettled([
        getDashboard(),
        deliveriesAPI.getAll({ limit: 10 }),
      ]);
      if (dashRes.status === 'fulfilled') setStats(dashRes.value.data);
      if (delRes.status === 'fulfilled') {
        const d = delRes.value.data;
        setDeliveries(Array.isArray(d) ? d : d.deliveries || d.data || []);
      }
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const kpis = [
    { label: 'Total Deliveries', value: stats?.deliveries?.total || deliveries.length || 0, icon: Package, color: '#3B82F6', bg: '#EFF6FF' },
    { label: 'Active Drivers', value: stats?.drivers?.available || 0, icon: Users, color: '#10B981', bg: '#F0FDF4' },
    { label: 'Fleet Size', value: stats?.vehicles?.total || 0, icon: Truck, color: '#8B5CF6', bg: '#F5F3FF' },
    { label: 'Revenue', value: `$${(stats?.financial?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: '#F59E0B', bg: '#FFFBEB' },
    { label: 'On-Time Rate', value: `${stats?.performance?.onTimeRate || 0}%`, icon: Clock, color: '#10B981', bg: '#F0FDF4' },
    { label: 'Pending', value: stats?.deliveries?.pending || 0, icon: AlertCircle, color: '#EF4444', bg: '#FEF2F2' },
  ];

  const statusData = [
    { name: 'Delivered', value: stats?.deliveries?.delivered || 12 },
    { name: 'In Transit', value: stats?.deliveries?.inTransit || 8 },
    { name: 'Pending', value: stats?.deliveries?.pending || 5 },
    { name: 'Failed', value: stats?.deliveries?.failed || 2 },
  ];

  const trendData = [
    { day: 'Mon', deliveries: 45, onTime: 42 },
    { day: 'Tue', deliveries: 52, onTime: 48 },
    { day: 'Wed', deliveries: 49, onTime: 45 },
    { day: 'Thu', deliveries: 63, onTime: 59 },
    { day: 'Fri', deliveries: 58, onTime: 55 },
    { day: 'Sat', deliveries: 35, onTime: 33 },
    { day: 'Sun', deliveries: 28, onTime: 26 },
  ];

  if (loading) return <div style={s.loading}>Loading dashboard...</div>;

  return (
    <div>
      <div style={s.pageHeader}>
        <h2 style={s.pageTitle}>Dashboard</h2>
        <p style={s.pageSubtitle}>Overview of your delivery operations</p>
      </div>

      <div style={s.kpiGrid}>
        {kpis.map((kpi, i) => (
          <div key={i} style={s.kpiCard}>
            <div style={{ ...s.kpiIcon, backgroundColor: kpi.bg, color: kpi.color }}>
              <kpi.icon size={22} />
            </div>
            <div>
              <p style={s.kpiLabel}>{kpi.label}</p>
              <p style={s.kpiValue}>{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={s.chartsRow}>
        <div style={s.chartCard}>
          <h3 style={s.chartTitle}><TrendingUp size={18} /> Delivery Trends</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="deliveries" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="onTime" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={s.chartCard}>
          <h3 style={s.chartTitle}><BarChart3 size={18} /> Status Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={s.tableCard}>
        <h3 style={s.chartTitle}>Recent Deliveries</h3>
        <div style={s.tableWrapper}>
          <table style={s.table}>
            <thead>
              <tr>
                {['ID', 'Customer', 'Status', 'Address', 'Date'].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {deliveries.length === 0 ? (
                <tr><td colSpan={5} style={{ ...s.td, textAlign: 'center', color: '#94A3B8' }}>No deliveries found</td></tr>
              ) : deliveries.slice(0, 8).map((d, i) => (
                <tr key={d.id || i} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#F8FAFC' }}>
                  <td style={s.td}>#{d.id}</td>
                  <td style={s.td}>{d.customerName || d.customer_name || '-'}</td>
                  <td style={s.td}>
                    <span style={{ ...s.badge, ...getBadgeStyle(d.status) }}>{d.status || 'pending'}</span>
                  </td>
                  <td style={s.td}>{d.deliveryAddress || d.delivery_address || d.address || '-'}</td>
                  <td style={s.td}>{d.createdAt ? new Date(d.createdAt).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

function getBadgeStyle(status) {
  const s = (status || '').toLowerCase();
  if (s === 'delivered' || s === 'completed') return { backgroundColor: '#D1FAE5', color: '#059669' };
  if (s === 'in_transit' || s === 'in transit') return { backgroundColor: '#DBEAFE', color: '#2563EB' };
  if (s === 'pending') return { backgroundColor: '#FEF3C7', color: '#D97706' };
  if (s === 'failed' || s === 'cancelled') return { backgroundColor: '#FEE2E2', color: '#DC2626' };
  return { backgroundColor: '#F1F5F9', color: '#64748B' };
}

const s = {
  loading: { textAlign: 'center', padding: '60px', color: '#64748B', fontSize: '16px' },
  pageHeader: { marginBottom: '24px' },
  pageTitle: { fontSize: '24px', fontWeight: '700', color: '#1E293B', margin: 0 },
  pageSubtitle: { fontSize: '14px', color: '#64748B', marginTop: '4px' },
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' },
  kpiCard: {
    backgroundColor: '#fff', borderRadius: '12px', padding: '20px',
    display: 'flex', alignItems: 'center', gap: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #E2E8F0',
  },
  kpiIcon: { width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  kpiLabel: { fontSize: '13px', color: '#64748B', margin: 0, fontWeight: '500' },
  kpiValue: { fontSize: '22px', fontWeight: '700', color: '#1E293B', margin: 0 },
  chartsRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' },
  chartCard: { backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #E2E8F0' },
  chartTitle: { fontSize: '16px', fontWeight: '600', color: '#1E293B', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' },
  tableCard: { backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #E2E8F0' },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #E2E8F0' },
  td: { padding: '12px 16px', fontSize: '14px', color: '#334155', borderBottom: '1px solid #F1F5F9' },
  badge: { padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', textTransform: 'capitalize' },
};

export default DashboardPage;
