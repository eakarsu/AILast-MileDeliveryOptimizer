import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, Truck, Users, Building2, MapPin,
  Box, Route, AlertTriangle, Shield, BarChart3,
  DollarSign, TrendingUp, Brain, ChevronLeft, ChevronRight, LogOut,
  History, ShieldAlert, Layers
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/deliveries', label: 'Deliveries', icon: Package },
  { path: '/drivers', label: 'Drivers', icon: Users },
  { path: '/vehicles', label: 'Vehicles', icon: Truck },
  { path: '/customers', label: 'Customers', icon: Users },
  { path: '/warehouses', label: 'Warehouses', icon: Building2 },
  { path: '/zones', label: 'Zones', icon: MapPin },
  { path: '/packages', label: 'Packages', icon: Box },
  { path: '/routes', label: 'Routes', icon: Route },
  { path: '/incidents', label: 'Incidents', icon: AlertTriangle },
  { path: '/slas', label: 'SLAs', icon: Shield },
  { path: '/performance', label: 'Performance', icon: BarChart3 },
  { path: '/cost-analysis', label: 'Cost Analysis', icon: DollarSign },
  { path: '/demand-forecast', label: 'Demand Forecast', icon: TrendingUp },
  { path: '/ai-hub', label: 'AI Hub', icon: Brain },
  { path: '/ai-history', label: 'AI History', icon: History },
  { path: '/sla-predictor', label: 'SLA Predictor', icon: ShieldAlert },
  { path: '/ai-tools', label: 'AI Tools', icon: Brain },
  { path: '/custom-views', label: 'Delivery Views', icon: Layers },
];

const Sidebar = ({ onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div style={{ ...styles.sidebar, width: collapsed ? '68px' : '250px' }}>
      <div style={styles.logoArea}>
        {!collapsed && (
          <div style={styles.logoText}>
            <span style={styles.logoIcon}><Truck size={24} /></span>
            <span style={styles.logoLabel}>LastMile AI</span>
          </div>
        )}
        <button style={styles.collapseBtn} onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav style={styles.nav}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {}),
                justifyContent: collapsed ? 'center' : 'flex-start',
                padding: collapsed ? '10px' : '10px 16px',
              }}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={20} style={{ flexShrink: 0 }} />
              {!collapsed && <span style={styles.navLabel}>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div style={styles.bottomSection}>
        <button
          onClick={onLogout}
          style={{
            ...styles.navItem,
            ...styles.logoutBtn,
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '10px' : '10px 16px',
          }}
        >
          <LogOut size={20} />
          {!collapsed && <span style={styles.navLabel}>Logout</span>}
        </button>
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    backgroundColor: '#1E293B', color: '#CBD5E1',
    height: '100vh', display: 'flex', flexDirection: 'column',
    transition: 'width 0.2s ease', overflow: 'hidden', flexShrink: 0,
    position: 'sticky', top: 0,
  },
  logoArea: {
    padding: '16px', display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', borderBottom: '1px solid #334155',
    minHeight: '64px',
  },
  logoText: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoIcon: { color: '#3B82F6' },
  logoLabel: { fontSize: '18px', fontWeight: '700', color: '#F1F5F9', whiteSpace: 'nowrap' },
  collapseBtn: {
    background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer',
    padding: '4px', borderRadius: '6px', display: 'flex', alignItems: 'center',
  },
  nav: {
    flex: 1, overflowY: 'auto', padding: '8px', display: 'flex',
    flexDirection: 'column', gap: '2px',
  },
  navItem: {
    display: 'flex', alignItems: 'center', gap: '12px',
    color: '#94A3B8', border: 'none', background: 'none',
    cursor: 'pointer', borderRadius: '8px', fontSize: '14px',
    fontWeight: '500', width: '100%', textAlign: 'left',
    transition: 'all 0.15s ease', fontFamily: 'Inter, sans-serif',
  },
  navItemActive: {
    backgroundColor: '#3B82F6', color: '#FFFFFF',
  },
  navLabel: { whiteSpace: 'nowrap' },
  bottomSection: { padding: '8px', borderTop: '1px solid #334155' },
  logoutBtn: { color: '#EF4444' },
};

export default Sidebar;
