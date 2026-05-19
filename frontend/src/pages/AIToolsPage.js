import React, { useState } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: { 'Content-Type': 'application/json' },
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const TOOLS = [
  {
    key: 'anomaly-detection',
    label: 'Anomaly Detection',
    icon: '⚠️',
    endpoint: '/ai/anomaly-detection',
    description: 'Detect operational anomalies across deliveries.',
    fields: [
      { key: 'window', label: 'Window (days)', type: 'number', placeholder: '7' },
      { key: 'context', label: 'Context / Notes', type: 'textarea' },
    ],
  },
  {
    key: 'customer-churn-predictor',
    label: 'Customer Churn Predictor',
    icon: '📉',
    endpoint: '/ai/customer-churn-predictor',
    description: 'Predict customer churn risk and retention plays.',
    fields: [
      { key: 'customerId', label: 'Customer ID', type: 'text' },
      { key: 'lookbackDays', label: 'Lookback (days)', type: 'number', placeholder: '90' },
      { key: 'context', label: 'Context / Notes', type: 'textarea' },
    ],
  },
  {
    key: 'dynamic-pricing-recommender',
    label: 'Dynamic Pricing Recommender',
    icon: '💵',
    endpoint: '/ai/dynamic-pricing-recommender',
    description: 'Recommend zone/SLA delivery price adjustments.',
    fields: [
      { key: 'zoneId', label: 'Zone ID', type: 'text' },
      { key: 'slaTier', label: 'SLA Tier', type: 'text', placeholder: 'standard | express | same-day' },
      { key: 'currentDemand', label: 'Current Demand (req/hr)', type: 'number' },
      { key: 'capacityUtilizationPct', label: 'Capacity Utilization %', type: 'number' },
      { key: 'context', label: 'Market / Notes', type: 'textarea' },
    ],
  },
  {
    key: 'vehicle-maintenance-alert',
    label: 'Vehicle Maintenance Alert',
    icon: '🛠️',
    endpoint: '/ai/vehicle-maintenance-alert',
    description: 'Predict imminent maintenance needs and breakdown risk.',
    fields: [
      { key: 'vehicleId', label: 'Vehicle ID', type: 'text' },
      { key: 'mileage', label: 'Mileage', type: 'number' },
      { key: 'ageYears', label: 'Age (years)', type: 'number' },
      { key: 'context', label: 'Recent telemetry / incidents', type: 'textarea' },
    ],
  },
];

const styles = {
  container: { padding: '8px' },
  header: { fontSize: '24px', fontWeight: 700, color: '#1E293B', marginBottom: '16px' },
  cardsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px', marginBottom: '24px' },
  card: { padding: '16px', background: '#FFFFFF', borderRadius: '8px', cursor: 'pointer', border: '1px solid #E2E8F0' },
  cardActive: { background: '#3B82F6', color: '#fff', border: '1px solid #3B82F6' },
  panel: { maxWidth: '720px', background: '#FFFFFF', padding: '24px', borderRadius: '8px', border: '1px solid #E2E8F0' },
  field: { marginBottom: '12px' },
  label: { display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 600, color: '#334155' },
  input: { width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '14px', fontFamily: 'inherit' },
  button: { width: '100%', marginTop: '12px', padding: '12px', fontSize: '15px', background: '#3B82F6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 },
  error: { marginTop: '16px', padding: '12px', background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', borderRadius: '6px' },
  result: { marginTop: '20px', padding: '16px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' },
  pre: { whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0, fontSize: '13px' },
};

export default function AIToolsPage() {
  const [active, setActive] = useState(TOOLS[0].key);
  const [inputs, setInputs] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const tool = TOOLS.find(t => t.key === active);

  const submit = async () => {
    setLoading(true); setError(null); setResult(null);
    try {
      const payload = {};
      tool.fields.forEach(f => {
        const v = inputs[f.key];
        if (v === undefined || v === '') return;
        payload[f.key] = f.type === 'number' ? Number(v) : v;
      });
      const res = await api.post(tool.endpoint, payload);
      setResult(res.data);
    } catch (e) {
      setError(e?.response?.data?.error || e?.response?.data?.message || e.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>AI Tools</h1>
      <div style={styles.cardsGrid}>
        {TOOLS.map(t => (
          <div
            key={t.key}
            onClick={() => { setActive(t.key); setInputs({}); setResult(null); setError(null); }}
            style={{ ...styles.card, ...(active === t.key ? styles.cardActive : {}) }}
          >
            <div style={{ fontSize: '24px' }}>{t.icon}</div>
            <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '4px' }}>{t.label}</div>
            <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.85 }}>{t.description}</div>
          </div>
        ))}
      </div>

      <div style={styles.panel}>
        <h2 style={{ marginTop: 0 }}>{tool.icon} {tool.label}</h2>
        <p style={{ color: '#64748B', marginBottom: '16px' }}>{tool.description}</p>

        {tool.fields.map(field => (
          <div key={field.key} style={styles.field}>
            <label style={styles.label}>{field.label}{field.required ? ' *' : ''}</label>
            {field.type === 'textarea' ? (
              <textarea rows={4} style={styles.input}
                value={inputs[field.key] || ''}
                onChange={e => setInputs(prev => ({ ...prev, [field.key]: e.target.value }))}
                placeholder={field.placeholder || ''} />
            ) : (
              <input type={field.type || 'text'} style={styles.input}
                value={inputs[field.key] || ''}
                onChange={e => setInputs(prev => ({ ...prev, [field.key]: e.target.value }))}
                placeholder={field.placeholder || ''} />
            )}
          </div>
        ))}

        <button style={{ ...styles.button, opacity: loading ? 0.7 : 1 }} onClick={submit} disabled={loading}>
          {loading ? 'Running…' : 'Run AI Tool'}
        </button>

        {error && <div style={styles.error}>{String(error)}</div>}

        {result && (
          <div style={styles.result}>
            <h3 style={{ marginTop: 0 }}>Result</h3>
            <pre style={styles.pre}>
              {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
