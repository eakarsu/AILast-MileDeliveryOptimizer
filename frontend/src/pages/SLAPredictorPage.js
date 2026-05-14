import React, { useState } from 'react';
import { ShieldAlert, Send, AlertTriangle } from 'lucide-react';
import api from '../services/api';

const getRiskStyle = (riskLevel) => {
  const level = (riskLevel || '').toLowerCase();
  if (level === 'critical') return { bg: '#FEE2E2', color: '#DC2626', label: 'Critical' };
  if (level === 'high') return { bg: '#FFEDD5', color: '#EA580C', label: 'High' };
  if (level === 'medium') return { bg: '#FEF3C7', color: '#D97706', label: 'Medium' };
  return { bg: '#D1FAE5', color: '#059669', label: 'Low' };
};

const SLAPredictorPage = () => {
  const [deliveryId, setDeliveryId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handlePredict = async () => {
    if (!deliveryId) { setError('Please enter a Delivery ID'); return; }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await api.post('/ai/sla-breach-predictor', { deliveryId: parseInt(deliveryId, 10) });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Prediction failed. Please check the Delivery ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  const riskStyle = result ? getRiskStyle(result.risk_level) : null;

  return (
    <div>
      <div style={st.header}>
        <div style={st.headerIcon}>
          <ShieldAlert size={28} />
        </div>
        <div>
          <h2 style={st.title}>SLA Breach Predictor</h2>
          <p style={st.subtitle}>AI-powered prediction of SLA breach risk for deliveries</p>
        </div>
      </div>

      <div style={st.card}>
        <h3 style={st.cardTitle}>Predict SLA Risk</h3>
        <div style={st.inputRow}>
          <div style={st.inputGroup}>
            <label style={st.label}>Delivery ID</label>
            <input
              style={st.input}
              type="number"
              placeholder="e.g. 42"
              value={deliveryId}
              onChange={e => setDeliveryId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handlePredict()}
            />
          </div>
          <button style={st.btn} onClick={handlePredict} disabled={loading}>
            <Send size={16} />
            {loading ? 'Analyzing...' : 'Predict SLA Risk'}
          </button>
        </div>

        {error && (
          <div style={st.errorBox}>
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {result && (
        <div style={st.resultCard}>
          <h3 style={st.cardTitle}>Prediction Result</h3>

          {/* Risk Level Badge */}
          <div style={{ ...st.riskBadge, backgroundColor: riskStyle.bg, color: riskStyle.color }}>
            <ShieldAlert size={20} />
            <span style={st.riskLabel}>{riskStyle.label} Risk</span>
          </div>

          {/* Breach Probability Bar */}
          <div style={st.probSection}>
            <div style={st.probHeader}>
              <span style={st.probLabel}>Breach Probability</span>
              <span style={{ ...st.probValue, color: riskStyle.color }}>{result.breach_probability ?? '—'}%</span>
            </div>
            <div style={st.barBg}>
              <div style={{
                ...st.barFill,
                width: `${Math.min(100, Math.max(0, result.breach_probability || 0))}%`,
                backgroundColor: riskStyle.color,
              }} />
            </div>
          </div>

          {/* Recommended Action */}
          {result.recommended_action && (
            <div style={st.section}>
              <div style={st.sectionLabel}>Recommended Action</div>
              <div style={st.sectionContent}>{result.recommended_action}</div>
            </div>
          )}

          {/* Reasoning */}
          {result.reasoning && (
            <div style={st.section}>
              <div style={st.sectionLabel}>AI Reasoning</div>
              <div style={{ ...st.sectionContent, color: '#64748B' }}>{result.reasoning}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const st = {
  header: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' },
  headerIcon: { width: '56px', height: '56px', borderRadius: '14px', backgroundColor: '#FEF2F2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  title: { fontSize: '24px', fontWeight: '700', color: '#1E293B', margin: 0 },
  subtitle: { fontSize: '14px', color: '#64748B', marginTop: '4px' },
  card: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: '20px' },
  cardTitle: { fontSize: '16px', fontWeight: '600', color: '#1E293B', marginBottom: '20px' },
  inputRow: { display: 'flex', alignItems: 'flex-end', gap: '16px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, maxWidth: '300px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#334155' },
  input: { padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '14px', fontFamily: 'Inter, sans-serif', outline: 'none', width: '100%' },
  btn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#DC2626', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Inter, sans-serif', height: '42px' },
  errorBox: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#FEF2F2', color: '#DC2626', padding: '12px 16px', borderRadius: '8px', marginTop: '16px', fontSize: '14px' },
  resultCard: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  riskBadge: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px', marginBottom: '24px' },
  riskLabel: { fontSize: '18px', fontWeight: '700' },
  probSection: { marginBottom: '24px' },
  probHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  probLabel: { fontSize: '14px', fontWeight: '600', color: '#334155' },
  probValue: { fontSize: '20px', fontWeight: '700' },
  barBg: { height: '12px', backgroundColor: '#F1F5F9', borderRadius: '6px', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: '6px', transition: 'width 0.5s ease' },
  section: { marginBottom: '16px', padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' },
  sectionLabel: { fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' },
  sectionContent: { fontSize: '14px', color: '#1E293B', lineHeight: '1.6' },
};

export default SLAPredictorPage;
