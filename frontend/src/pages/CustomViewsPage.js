import React, { useState } from 'react';
import RouteOptimizationMap from '../components/RouteOptimizationMap';
import PerformanceHeatmap from '../components/PerformanceHeatmap';
import RouteManifestPDF from '../components/RouteManifestPDF';
import DeliveryRulesEditor from '../components/DeliveryRulesEditor';

const tabs = [
  { id: 'map', label: 'Route Optimization Map' },
  { id: 'heatmap', label: 'Driver/Zone Heatmap' },
  { id: 'manifest', label: 'Route Manifest PDF' },
  { id: 'rules', label: 'Delivery Rules Editor' },
];

const CustomViewsPage = () => {
  const [tab, setTab] = useState('map');

  return (
    <div data-testid="custom-views-page">
      <div style={styles.header}>
        <h2 style={styles.title}>Delivery Views</h2>
        <p style={styles.subtitle}>Custom operational views for last-mile delivery optimization</p>
      </div>

      <div style={styles.tabs}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{ ...styles.tab, ...(tab === t.id ? styles.tabActive : {}) }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={styles.panel}>
        {tab === 'map' && <RouteOptimizationMap />}
        {tab === 'heatmap' && <PerformanceHeatmap />}
        {tab === 'manifest' && <RouteManifestPDF />}
        {tab === 'rules' && <DeliveryRulesEditor />}
      </div>
    </div>
  );
};

const styles = {
  header: { marginBottom: 16 },
  title: { margin: 0, fontSize: 22, color: '#0f172a' },
  subtitle: { margin: '4px 0 0 0', color: '#64748b', fontSize: 13 },
  tabs: { display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' },
  tab: {
    padding: '8px 14px', borderRadius: 8, border: '1px solid #cbd5e1',
    background: '#fff', color: '#334155', cursor: 'pointer', fontSize: 13, fontWeight: 500,
  },
  tabActive: { background: '#3b82f6', color: '#fff', border: '1px solid #3b82f6' },
  panel: { minHeight: 400 },
};

export default CustomViewsPage;
