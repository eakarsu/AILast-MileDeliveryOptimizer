import React, { useState } from 'react';

// Apply pass 7: Customer-facing public tracking lookup.
// Uses GET /api/public-tracking/:trackingNumber (no auth required).
const API_BASE = '/api';

export default function PublicTrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = async (e) => {
    e && e.preventDefault();
    setError(null); setData(null);
    if (!trackingNumber.trim()) return setError('Enter a tracking number');
    setLoading(true);
    try {
      const r = await fetch(`${API_BASE}/public-tracking/${encodeURIComponent(trackingNumber.trim())}`);
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || `HTTP ${r.status}`);
      setData(j);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, marginBottom: 6 }}>Track Your Delivery</h1>
      <p style={{ color: '#555', marginBottom: 20 }}>Enter your tracking number to see the latest status.</p>

      <form onSubmit={search} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 20, display: 'flex', gap: 8 }}>
        <input value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder="TRK-1234" style={{ flex: 1, padding: 10, border: '1px solid #d1d5db', borderRadius: 6, fontSize: 15 }} />
        <button type="submit" style={{ background: '#3B82F6', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>{loading ? 'Searching...' : 'Track'}</button>
      </form>

      {error && <div style={{ color: '#991b1b', background: '#fef2f2', padding: 12, borderRadius: 6, marginBottom: 16 }}>{error}</div>}

      {data && (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>Tracking number</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{data.trackingNumber}</div>
            </div>
            <span style={statusBadge(data.status)}>{data.status}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <Info label="Recipient" value={data.recipient || '-'} />
            <Info label="Priority" value={data.priority || '-'} />
            <Info label="Destination zone" value={data.destinationZone || '-'} />
            <Info label="Driver" value={data.driverName || 'Not yet assigned'} />
            <Info label="Estimated delivery" value={data.estimatedDelivery ? new Date(data.estimatedDelivery).toLocaleString() : 'TBD'} />
            <Info label="Actual delivery" value={data.actualDelivery ? new Date(data.actualDelivery).toLocaleString() : '-'} />
            <Info label="Current location" value={data.currentLocation || '-'} />
            <Info label="Last updated" value={data.lastUpdated ? new Date(data.lastUpdated).toLocaleString() : '-'} />
          </div>

          <div>
            <h3 style={{ marginTop: 0, marginBottom: 8 }}>Timeline</h3>
            {(data.events || []).length === 0 ? (
              <div style={{ color: '#6b7280' }}>No events yet.</div>
            ) : (
              <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {data.events.map((ev, i) => (
                  <li key={i} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                    <div style={{ width: 14, height: 14, borderRadius: 999, background: '#3B82F6', marginTop: 4, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>{String(ev.status).replace(/_/g, ' ')}</div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>{ev.at ? new Date(ev.at).toLocaleString() : ''}</div>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: '#6b7280' }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 500, color: '#111827' }}>{value}</div>
    </div>
  );
}

function statusBadge(status) {
  const map = {
    pending: { bg: '#FEF3C7', fg: '#92400E' },
    picked_up: { bg: '#DBEAFE', fg: '#1E40AF' },
    in_transit: { bg: '#E0E7FF', fg: '#3730A3' },
    delivered: { bg: '#D1FAE5', fg: '#065F46' },
    failed: { bg: '#FEE2E2', fg: '#991B1B' },
  };
  const c = map[status] || { bg: '#F3F4F6', fg: '#374151' };
  return { background: c.bg, color: c.fg, padding: '4px 12px', borderRadius: 999, fontSize: 13, fontWeight: 600, textTransform: 'capitalize' };
}
