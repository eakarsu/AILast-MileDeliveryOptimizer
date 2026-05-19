import React, { useState } from 'react';
import {
  Brain, Route, Clock, TrendingUp, DollarSign, Lightbulb,
  AlertTriangle, Truck, BarChart3, ArrowLeft, Send, UserCheck
} from 'lucide-react';
import {
  optimizeRoute, predictDeliveryTime, forecastDemand, analyzeCosts,
  suggestImprovements, analyzeIncident, optimizeFleet, predictPerformance,
  matchDriverRoute
} from '../services/api';
import AIResultDisplay from '../components/AIResultDisplay';

const aiFeatures = [
  {
    id: 'route',
    title: 'Route Optimization',
    description: 'Optimize delivery routes using AI to minimize distance and time',
    icon: Route,
    color: '#3B82F6',
    bg: '#EFF6FF',
    apiCall: optimizeRoute,
    inputs: [
      { key: 'warehouseId', label: 'Warehouse ID', type: 'number', placeholder: 'e.g., 1' },
      { key: 'zoneId', label: 'Zone ID', type: 'number', placeholder: 'e.g., 1' },
      { key: 'driverId', label: 'Driver ID', type: 'number', placeholder: 'e.g., 1' },
      { key: 'deliveryIds', label: 'Delivery IDs (comma-separated)', type: 'text', placeholder: 'e.g., 1,2,3,4,5' },
      { key: 'maxStops', label: 'Max Stops', type: 'number', placeholder: 'e.g., 20' },
      { key: 'optimizeFor', label: 'Optimize For', type: 'select', options: ['distance', 'time', 'fuel', 'balanced'] },
    ],
  },
  {
    id: 'delivery-time',
    title: 'Delivery Time Prediction',
    description: 'Predict accurate delivery times using historical data and AI',
    icon: Clock,
    color: '#10B981',
    bg: '#F0FDF4',
    apiCall: predictDeliveryTime,
    inputs: [
      { key: 'deliveryId', label: 'Delivery ID', type: 'number', placeholder: 'e.g., 1' },
      { key: 'pickupAddress', label: 'Pickup Address', type: 'text', placeholder: 'e.g., 123 Main St' },
      { key: 'deliveryAddress', label: 'Delivery Address', type: 'text', placeholder: 'e.g., 456 Oak Ave' },
      { key: 'weight', label: 'Package Weight (kg)', type: 'number', placeholder: 'e.g., 5' },
      { key: 'timeOfDay', label: 'Time of Day', type: 'select', options: ['morning', 'afternoon', 'evening', 'night'] },
      { key: 'dayOfWeek', label: 'Day of Week', type: 'select', options: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
    ],
  },
  {
    id: 'demand',
    title: 'Demand Forecasting',
    description: 'Forecast delivery demand to optimize resource allocation',
    icon: TrendingUp,
    color: '#8B5CF6',
    bg: '#F5F3FF',
    apiCall: forecastDemand,
    inputs: [
      { key: 'zoneId', label: 'Zone ID', type: 'number', placeholder: 'e.g., 1' },
      { key: 'period', label: 'Period', type: 'select', options: ['daily', 'weekly', 'monthly'] },
      { key: 'forecastDays', label: 'Forecast Days Ahead', type: 'number', placeholder: 'e.g., 7' },
      { key: 'historicalDays', label: 'Historical Days to Analyze', type: 'number', placeholder: 'e.g., 30' },
      { key: 'includeWeather', label: 'Include Weather', type: 'select', options: ['true', 'false'] },
      { key: 'includeEvents', label: 'Include Events', type: 'select', options: ['true', 'false'] },
    ],
  },
  {
    id: 'cost',
    title: 'Cost Analysis',
    description: 'Analyze delivery costs and identify optimization opportunities',
    icon: DollarSign,
    color: '#F59E0B',
    bg: '#FFFBEB',
    apiCall: analyzeCosts,
    inputs: [
      { key: 'period', label: 'Analysis Period', type: 'select', options: ['last_week', 'last_month', 'last_quarter', 'last_year'] },
      { key: 'zoneId', label: 'Zone ID (optional)', type: 'number', placeholder: 'Leave empty for all' },
      { key: 'category', label: 'Cost Category', type: 'select', options: ['all', 'fuel', 'maintenance', 'labor', 'overhead'] },
      { key: 'compareWith', label: 'Compare With', type: 'select', options: ['previous_period', 'same_period_last_year', 'budget'] },
    ],
  },
  {
    id: 'improvements',
    title: 'Improvement Suggestions',
    description: 'Get AI-powered suggestions to improve delivery operations',
    icon: Lightbulb,
    color: '#10B981',
    bg: '#F0FDF4',
    apiCall: suggestImprovements,
    inputs: [
      { key: 'area', label: 'Focus Area', type: 'select', options: ['overall', 'efficiency', 'cost', 'customer_satisfaction', 'driver_performance', 'fleet_utilization'] },
      { key: 'zoneId', label: 'Zone ID (optional)', type: 'number', placeholder: 'Leave empty for all' },
      { key: 'urgency', label: 'Urgency', type: 'select', options: ['low', 'medium', 'high'] },
      { key: 'budget', label: 'Available Budget ($)', type: 'number', placeholder: 'e.g., 10000' },
    ],
  },
  {
    id: 'incident',
    title: 'Incident Analysis',
    description: 'Analyze incidents and get prevention recommendations',
    icon: AlertTriangle,
    color: '#EF4444',
    bg: '#FEF2F2',
    apiCall: analyzeIncident,
    inputs: [
      { key: 'incidentId', label: 'Incident ID', type: 'number', placeholder: 'e.g., 1' },
      { key: 'incidentType', label: 'Incident Type', type: 'select', options: ['accident', 'breakdown', 'theft', 'damage', 'delay', 'complaint'] },
      { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Describe the incident...' },
      { key: 'severity', label: 'Severity', type: 'select', options: ['low', 'medium', 'high', 'critical'] },
      { key: 'location', label: 'Location', type: 'text', placeholder: 'e.g., Zone 3, Main St' },
    ],
  },
  {
    id: 'fleet',
    title: 'Fleet Optimization',
    description: 'Optimize fleet allocation and vehicle assignments',
    icon: Truck,
    color: '#6366F1',
    bg: '#EEF2FF',
    apiCall: optimizeFleet,
    inputs: [
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'zoneId', label: 'Zone ID (optional)', type: 'number', placeholder: 'Leave empty for all' },
      { key: 'expectedDemand', label: 'Expected Demand', type: 'number', placeholder: 'e.g., 100' },
      { key: 'optimizeFor', label: 'Optimize For', type: 'select', options: ['cost', 'speed', 'coverage', 'balanced'] },
      { key: 'constraints', label: 'Special Constraints', type: 'textarea', placeholder: 'Any special requirements...' },
    ],
  },
  {
    id: 'performance',
    title: 'Performance Prediction',
    description: 'Predict driver and fleet performance metrics',
    icon: BarChart3,
    color: '#EC4899',
    bg: '#FDF2F8',
    apiCall: predictPerformance,
    inputs: [
      { key: 'driverId', label: 'Driver ID', type: 'number', placeholder: 'e.g., 1' },
      { key: 'period', label: 'Prediction Period', type: 'select', options: ['next_week', 'next_month', 'next_quarter'] },
      { key: 'metrics', label: 'Metrics to Predict', type: 'select', options: ['all', 'delivery_rate', 'on_time_rate', 'customer_rating', 'efficiency'] },
      { key: 'includeRecommendations', label: 'Include Recommendations', type: 'select', options: ['true', 'false'] },
    ],
  },
  {
    id: 'driver-route-match',
    title: 'Driver-Route Match',
    description: 'AI-powered ranking of best drivers for a given route',
    icon: UserCheck,
    color: '#0891B2',
    bg: '#ECFEFF',
    apiCall: matchDriverRoute,
    inputs: [
      { key: 'routeId', label: 'Route ID', type: 'number', placeholder: 'e.g., 1' },
    ],
    renderResult: true,
  },
];

const AIHubPage = () => {
  const [activeFeature, setActiveFeature] = useState(null);
  const [formData, setFormData] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const openFeature = (feature) => {
    setActiveFeature(feature);
    setFormData({});
    setResult(null);
    setError('');
  };

  const goBack = () => {
    setActiveFeature(null);
    setResult(null);
    setError('');
  };

  const handleSubmit = async () => {
    if (!activeFeature) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const payload = { ...formData };
      // Convert comma-separated IDs to arrays
      if (payload.deliveryIds && typeof payload.deliveryIds === 'string') {
        payload.deliveryIds = payload.deliveryIds.split(',').map(s => s.trim()).filter(Boolean);
      }
      const res = await activeFeature.apiCall(payload);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'AI analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

  if (activeFeature) {
    return (
      <div>
        <button style={st.backBtn} onClick={goBack}>
          <ArrowLeft size={18} /> Back to AI Hub
        </button>

        <div style={st.featureHeader}>
          <div style={{ ...st.featureHeaderIcon, backgroundColor: activeFeature.bg, color: activeFeature.color }}>
            <activeFeature.icon size={28} />
          </div>
          <div>
            <h2 style={st.featureTitle}>{activeFeature.title}</h2>
            <p style={st.featureDesc}>{activeFeature.description}</p>
          </div>
        </div>

        <div style={st.splitLayout}>
          <div style={st.inputPanel}>
            <h3 style={st.panelTitle}>Input Parameters</h3>
            <div style={st.inputGrid}>
              {activeFeature.inputs.map(input => (
                <div key={input.key} style={{ ...st.inputGroup, ...(input.type === 'textarea' ? { gridColumn: 'span 2' } : {}) }}>
                  <label style={st.inputLabel}>{input.label}</label>
                  {input.type === 'select' ? (
                    <select style={st.inputField} value={formData[input.key] || ''} onChange={e => updateField(input.key, e.target.value)}>
                      <option value="">Select...</option>
                      {input.options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : input.type === 'textarea' ? (
                    <textarea style={{ ...st.inputField, minHeight: '80px', resize: 'vertical' }} placeholder={input.placeholder} value={formData[input.key] || ''} onChange={e => updateField(input.key, e.target.value)} />
                  ) : (
                    <input style={st.inputField} type={input.type} placeholder={input.placeholder} value={formData[input.key] || ''} onChange={e => updateField(input.key, e.target.value)} />
                  )}
                </div>
              ))}
            </div>
            <button style={{ ...st.submitBtn, backgroundColor: activeFeature.color }} onClick={handleSubmit} disabled={loading}>
              <Send size={18} />
              {loading ? 'Analyzing...' : 'Run AI Analysis'}
            </button>
          </div>

          <div style={st.resultPanel}>
            <h3 style={st.panelTitle}>AI Results</h3>
            {error && (
              <div style={st.errorBox}>
                <AlertTriangle size={18} />
                <span>{error}</span>
              </div>
            )}
            {!result && !loading && !error && (
              <div style={st.placeholder}>
                <Brain size={48} style={{ color: '#CBD5E1' }} />
                <p style={st.placeholderText}>Configure parameters and run analysis to see AI results</p>
              </div>
            )}
            <AIResultDisplay result={result} loading={loading} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={st.pageHeader}>
        <div style={st.pageHeaderIcon}>
          <Brain size={28} />
        </div>
        <div>
          <h2 style={st.pageTitle}>AI Hub</h2>
          <p style={st.pageSubtitle}>Leverage AI to optimize your delivery operations</p>
        </div>
      </div>

      <div style={st.cardGrid}>
        {aiFeatures.map(feature => (
          <div key={feature.id} style={st.card} onClick={() => openFeature(feature)}>
            <div style={{ ...st.cardIcon, backgroundColor: feature.bg, color: feature.color }}>
              <feature.icon size={28} />
            </div>
            <h3 style={st.cardTitle}>{feature.title}</h3>
            <p style={st.cardDesc}>{feature.description}</p>
            <div style={{ ...st.cardAction, color: feature.color }}>
              Run Analysis →
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const st = {
  pageHeader: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' },
  pageHeaderIcon: { width: '56px', height: '56px', borderRadius: '14px', backgroundColor: '#EFF6FF', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  pageTitle: { fontSize: '24px', fontWeight: '700', color: '#1E293B', margin: 0 },
  pageSubtitle: { fontSize: '14px', color: '#64748B', marginTop: '4px' },
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
  card: {
    backgroundColor: '#fff', borderRadius: '14px', padding: '24px',
    border: '1px solid #E2E8F0', cursor: 'pointer',
    transition: 'all 0.2s ease', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  cardIcon: { width: '56px', height: '56px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' },
  cardTitle: { fontSize: '17px', fontWeight: '700', color: '#1E293B', margin: '0 0 8px' },
  cardDesc: { fontSize: '14px', color: '#64748B', lineHeight: '1.5', margin: '0 0 16px' },
  cardAction: { fontSize: '14px', fontWeight: '600' },

  // Feature detail view
  backBtn: {
    display: 'flex', alignItems: 'center', gap: '6px', background: 'none',
    border: 'none', color: '#64748B', fontSize: '14px', fontWeight: '500',
    cursor: 'pointer', marginBottom: '20px', padding: 0, fontFamily: 'Inter, sans-serif',
  },
  featureHeader: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' },
  featureHeaderIcon: { width: '56px', height: '56px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  featureTitle: { fontSize: '22px', fontWeight: '700', color: '#1E293B', margin: 0 },
  featureDesc: { fontSize: '14px', color: '#64748B', marginTop: '4px' },
  splitLayout: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'flex-start' },
  inputPanel: { backgroundColor: '#fff', borderRadius: '14px', padding: '24px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  resultPanel: { backgroundColor: '#fff', borderRadius: '14px', padding: '24px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', minHeight: '400px' },
  panelTitle: { fontSize: '16px', fontWeight: '600', color: '#1E293B', marginBottom: '20px' },
  inputGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  inputLabel: { fontSize: '13px', fontWeight: '600', color: '#334155' },
  inputField: { padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '14px', fontFamily: 'Inter, sans-serif', outline: 'none', width: '100%' },
  submitBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    width: '100%', padding: '12px', border: 'none', borderRadius: '8px',
    color: '#fff', fontSize: '15px', fontWeight: '600', cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
  },
  errorBox: {
    display: 'flex', alignItems: 'center', gap: '8px',
    backgroundColor: '#FEF2F2', color: '#DC2626', padding: '12px 16px',
    borderRadius: '8px', marginBottom: '16px', fontSize: '14px',
  },
  placeholder: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', gap: '16px' },
  placeholderText: { fontSize: '14px', color: '#94A3B8', textAlign: 'center' },
};

export default AIHubPage;
