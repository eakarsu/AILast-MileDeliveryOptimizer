import React from 'react';
import { CheckCircle, AlertTriangle, Info, TrendingUp, Lightbulb, BarChart3 } from 'lucide-react';

const AIResultDisplay = ({ result, loading }) => {
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner} />
        <p style={styles.loadingText}>AI is analyzing your data...</p>
        <p style={styles.loadingSubtext}>This may take a moment</p>
      </div>
    );
  }

  if (!result) return null;

  const data = typeof result === 'string' ? parseAIText(result) : result;

  if (typeof data === 'object' && !Array.isArray(data)) {
    return <div style={styles.container}>{renderObject(data, 0)}</div>;
  }

  if (typeof data === 'string') {
    return <div style={styles.container}>{renderFormattedText(data)}</div>;
  }

  return (
    <div style={styles.container}>
      <pre style={styles.fallback}>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

function parseAIText(text) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function renderObject(obj, depth) {
  if (!obj || typeof obj !== 'object') {
    return <span>{String(obj)}</span>;
  }

  return Object.entries(obj).map(([key, value]) => {
    const label = key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());

    if (Array.isArray(value)) {
      return (
        <div key={key} style={{ ...styles.section, marginLeft: depth * 8 }}>
          <div style={styles.sectionHeader}>
            {getSectionIcon(key)}
            <h3 style={styles.sectionTitle}>{label}</h3>
            <span style={styles.badge}>{value.length}</span>
          </div>
          <div style={styles.sectionBody}>
            {value.map((item, i) => (
              <div key={i} style={styles.listItem}>
                {typeof item === 'object' ? (
                  <div style={styles.card}>
                    {renderObject(item, depth + 1)}
                  </div>
                ) : (
                  <div style={styles.bulletItem}>
                    <span style={styles.bullet} />
                    <span>{String(item)}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (typeof value === 'object' && value !== null) {
      return (
        <div key={key} style={{ ...styles.section, marginLeft: depth * 8 }}>
          <div style={styles.sectionHeader}>
            {getSectionIcon(key)}
            <h3 style={styles.sectionTitle}>{label}</h3>
          </div>
          <div style={styles.nestedCard}>
            {renderObject(value, depth + 1)}
          </div>
        </div>
      );
    }

    if (typeof value === 'number' && key.toLowerCase().includes('score') || key.toLowerCase().includes('rate') || key.toLowerCase().includes('percent')) {
      const pct = value > 1 ? value : value * 100;
      return (
        <div key={key} style={styles.metricRow}>
          <span style={styles.metricLabel}>{label}</span>
          <div style={styles.progressContainer}>
            <div style={{ ...styles.progressBar, width: `${Math.min(pct, 100)}%`, backgroundColor: pct > 70 ? '#10B981' : pct > 40 ? '#F59E0B' : '#EF4444' }} />
          </div>
          <span style={styles.metricValue}>{typeof value === 'number' && value < 1 ? `${(value * 100).toFixed(1)}%` : value}</span>
        </div>
      );
    }

    const colorTag = getValueColor(key, value);
    return (
      <div key={key} style={styles.fieldRow}>
        <span style={styles.fieldLabel}>{label}</span>
        <span style={{ ...styles.fieldValue, ...(colorTag ? { color: colorTag.color, backgroundColor: colorTag.bg, padding: '2px 10px', borderRadius: '12px', fontSize: '13px' } : {}) }}>
          {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
        </span>
      </div>
    );
  });
}

function renderFormattedText(text) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) return <div key={i} style={{ height: '8px' }} />;
    if (trimmed.startsWith('###')) return <h4 key={i} style={styles.h4}>{trimmed.replace(/^###\s*/, '')}</h4>;
    if (trimmed.startsWith('##')) return <h3 key={i} style={styles.h3}>{trimmed.replace(/^##\s*/, '')}</h3>;
    if (trimmed.startsWith('#')) return <h2 key={i} style={styles.h2}>{trimmed.replace(/^#\s*/, '')}</h2>;
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const content = trimmed.substring(2);
      const isWarning = content.toLowerCase().includes('warning') || content.toLowerCase().includes('caution');
      const isSuccess = content.toLowerCase().includes('recommend') || content.toLowerCase().includes('improve') || content.toLowerCase().includes('success');
      return (
        <div key={i} style={{ ...styles.textBullet, ...(isWarning ? styles.warningBg : isSuccess ? styles.successBg : {}) }}>
          <span style={{ ...styles.bullet, backgroundColor: isWarning ? '#F59E0B' : isSuccess ? '#10B981' : '#3B82F6' }} />
          <span>{content}</span>
        </div>
      );
    }
    if (trimmed.match(/^\d+\./)) {
      return (
        <div key={i} style={styles.numberedItem}>
          <span style={styles.number}>{trimmed.match(/^(\d+)/)[1]}</span>
          <span>{trimmed.replace(/^\d+\.\s*/, '')}</span>
        </div>
      );
    }
    return <p key={i} style={styles.paragraph}>{trimmed}</p>;
  });
}

function getSectionIcon(key) {
  const k = key.toLowerCase();
  if (k.includes('recommend') || k.includes('suggest')) return <Lightbulb size={18} style={{ color: '#10B981' }} />;
  if (k.includes('warn') || k.includes('risk') || k.includes('issue')) return <AlertTriangle size={18} style={{ color: '#F59E0B' }} />;
  if (k.includes('metric') || k.includes('stat') || k.includes('analys')) return <BarChart3 size={18} style={{ color: '#3B82F6' }} />;
  if (k.includes('optim') || k.includes('improve') || k.includes('trend')) return <TrendingUp size={18} style={{ color: '#8B5CF6' }} />;
  if (k.includes('success') || k.includes('complet')) return <CheckCircle size={18} style={{ color: '#10B981' }} />;
  return <Info size={18} style={{ color: '#64748B' }} />;
}

function getValueColor(key, value) {
  const v = String(value).toLowerCase();
  if (v === 'high' || v === 'critical' || v === 'failed' || v === 'overdue') return { color: '#DC2626', bg: '#FEE2E2' };
  if (v === 'medium' || v === 'warning' || v === 'pending') return { color: '#D97706', bg: '#FEF3C7' };
  if (v === 'low' || v === 'success' || v === 'completed' || v === 'delivered' || v === 'active' || v === 'good') return { color: '#059669', bg: '#D1FAE5' };
  if (v === 'in_transit' || v === 'in transit' || v === 'processing') return { color: '#2563EB', bg: '#DBEAFE' };
  return null;
}

const spin = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '16px' },
  loadingContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 24px', gap: '16px' },
  spinner: { width: '48px', height: '48px', border: '4px solid #E2E8F0', borderTopColor: '#3B82F6', borderRadius: '50%', animation: 'spin 1s linear infinite' },
  loadingText: { fontSize: '16px', fontWeight: '600', color: '#1E293B' },
  loadingSubtext: { fontSize: '14px', color: '#64748B' },
  section: { marginBottom: '8px' },
  sectionHeader: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' },
  sectionTitle: { fontSize: '16px', fontWeight: '600', color: '#1E293B', margin: 0 },
  sectionBody: { display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '8px' },
  badge: { backgroundColor: '#EFF6FF', color: '#3B82F6', padding: '2px 8px', borderRadius: '10px', fontSize: '12px', fontWeight: '600' },
  listItem: {},
  card: { backgroundColor: '#F8FAFC', borderRadius: '8px', padding: '12px 16px', border: '1px solid #E2E8F0' },
  nestedCard: { backgroundColor: '#F8FAFC', borderRadius: '8px', padding: '16px', border: '1px solid #E2E8F0' },
  bulletItem: { display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '6px 0' },
  bullet: { width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#3B82F6', marginTop: '6px', flexShrink: 0 },
  metricRow: { display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0' },
  metricLabel: { fontSize: '14px', color: '#64748B', minWidth: '140px' },
  metricValue: { fontSize: '14px', fontWeight: '600', color: '#1E293B', minWidth: '60px', textAlign: 'right' },
  progressContainer: { flex: 1, height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' },
  progressBar: { height: '100%', borderRadius: '4px', transition: 'width 0.5s ease' },
  fieldRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #F1F5F9' },
  fieldLabel: { fontSize: '14px', color: '#64748B', fontWeight: '500' },
  fieldValue: { fontSize: '14px', color: '#1E293B', fontWeight: '500' },
  h2: { fontSize: '20px', fontWeight: '700', color: '#1E293B', margin: '16px 0 8px' },
  h3: { fontSize: '17px', fontWeight: '600', color: '#1E293B', margin: '12px 0 6px' },
  h4: { fontSize: '15px', fontWeight: '600', color: '#334155', margin: '10px 0 4px' },
  textBullet: { display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '8px 12px', borderRadius: '8px', margin: '4px 0' },
  warningBg: { backgroundColor: '#FFFBEB' },
  successBg: { backgroundColor: '#F0FDF4' },
  numberedItem: { display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '6px 0' },
  number: { width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#3B82F6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600', flexShrink: 0 },
  paragraph: { fontSize: '14px', color: '#334155', lineHeight: '1.6', margin: '4px 0' },
  fallback: { fontSize: '13px', color: '#334155', backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '8px', overflow: 'auto', whiteSpace: 'pre-wrap' },
};

// Inject keyframe animation
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = spin;
  document.head.appendChild(styleSheet);
}

export default AIResultDisplay;
