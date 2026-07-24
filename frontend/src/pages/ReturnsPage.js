import React, { useEffect, useState } from 'react';

// Apply pass 7: Return / Reverse Logistics workflow UI
// Uses /api/returns CRUD + /api/returns/:id/status workflow.
const API_BASE = '/api';
const STATUSES = ['requested', 'approved', 'picked_up', 'received', 'refunded', 'rejected'];
const REASONS = ['damaged', 'wrong_item', 'not_needed', 'late_delivery', 'quality_issue', 'other'];

export default function ReturnsPage() {
  const [items, setItems] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ trackingNumber: '', reason: 'damaged', description: '', refundAmount: '', customerName: '', customerEmail: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const qs = filterStatus ? `?status=${encodeURIComponent(filterStatus)}` : '';
      const r = await fetch(`${API_BASE}/returns${qs}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = await r.json();
      setItems(j.data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filterStatus]);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.trackingNumber.trim()) return setError('Tracking number is required');
    try {
      const token = localStorage.getItem('token');
      const r = await fetch(`${API_BASE}/returns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          trackingNumber: form.trackingNumber.trim(),
          reason: form.reason,
          description: form.description || null,
          refundAmount: form.refundAmount ? Number(form.refundAmount) : null,
          customerName: form.customerName || null,
          customerEmail: form.customerEmail || null,
        }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || `HTTP ${r.status}`);
      setForm({ trackingNumber: '', reason: 'damaged', description: '', refundAmount: '', customerName: '', customerEmail: '' });
      setCreating(false);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const advance = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const r = await fetch(`${API_BASE}/returns/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!r.ok) {
        const j = await r.json();
        throw new Error(j.error || `HTTP ${r.status}`);
      }
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, margin: 0 }}>Returns / Reverse Logistics</h1>
          <p style={{ color: '#555', marginTop: 4 }}>Manage return requests and their workflow lifecycle.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={inp}>
            <option value="">All statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={() => setCreating(!creating)} style={btnPrimary}>{creating ? 'Cancel' : 'New return'}</button>
        </div>
      </div>

      {error && <div style={{ color: '#991b1b', background: '#fef2f2', padding: 10, borderRadius: 6, marginBottom: 12 }}>{error}</div>}

      {creating && (
        <form onSubmit={submit} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <div><label style={lbl}>Tracking number</label><input value={form.trackingNumber} onChange={(e) => setForm({ ...form, trackingNumber: e.target.value })} style={inp} /></div>
            <div><label style={lbl}>Reason</label>
              <select value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} style={inp}>
                {REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Refund amount</label><input type="number" step="0.01" value={form.refundAmount} onChange={(e) => setForm({ ...form, refundAmount: e.target.value })} style={inp} /></div>
            <div><label style={lbl}>Customer name</label><input value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} style={inp} /></div>
            <div><label style={lbl}>Customer email</label><input value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} style={inp} /></div>
            <div style={{ gridColumn: 'span 3' }}><label style={lbl}>Description</label><textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ ...inp, fontFamily: 'inherit' }} /></div>
          </div>
          <div style={{ marginTop: 12 }}><button type="submit" style={btnPrimary}>Create return</button></div>
        </form>
      )}

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
        {loading ? <div>Loading...</div> : items.length === 0 ? (
          <div style={{ color: '#6b7280' }}>No return requests.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
                <th style={th}>ID</th><th style={th}>Tracking</th><th style={th}>Customer</th><th style={th}>Reason</th><th style={th}>Refund</th><th style={th}>Status</th><th style={th}>Updated</th><th style={th}>Advance</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={td}>{r.id}</td>
                  <td style={td}>{r.tracking_number}</td>
                  <td style={td}>{r.customer_name || '-'}</td>
                  <td style={td}>{r.reason}</td>
                  <td style={td}>{r.refund_amount != null ? `$${Number(r.refund_amount).toFixed(2)}` : '-'}</td>
                  <td style={td}><span style={badge(r.status)}>{r.status}</span></td>
                  <td style={td}>{r.updated_at ? new Date(r.updated_at).toLocaleString() : '-'}</td>
                  <td style={td}>
                    <select value="" onChange={(e) => { if (e.target.value) advance(r.id, e.target.value); }} style={{ ...inp, padding: 6 }}>
                      <option value="">→ change</option>
                      {STATUSES.filter((s) => s !== r.status).map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const lbl = { display: 'block', fontWeight: 600, marginBottom: 6, fontSize: 13, color: '#374151' };
const inp = { width: '100%', padding: 9, border: '1px solid #d1d5db', borderRadius: 6, fontFamily: 'inherit', fontSize: 14, boxSizing: 'border-box' };
const btnPrimary = { background: '#3B82F6', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: 6, cursor: 'pointer', fontWeight: 600 };
const th = { padding: '8px 6px', fontSize: 13, color: '#374151' };
const td = { padding: '8px 6px', fontSize: 13, color: '#111827' };
function badge(status) {
  const map = {
    requested: { bg: '#FEF3C7', fg: '#92400E' },
    approved: { bg: '#DBEAFE', fg: '#1E40AF' },
    picked_up: { bg: '#E0E7FF', fg: '#3730A3' },
    received: { bg: '#CCFBF1', fg: '#115E59' },
    refunded: { bg: '#D1FAE5', fg: '#065F46' },
    rejected: { bg: '#FEE2E2', fg: '#991B1B' },
  };
  const c = map[status] || { bg: '#F3F4F6', fg: '#374151' };
  return { background: c.bg, color: c.fg, padding: '2px 8px', borderRadius: 999, fontSize: 12, fontWeight: 600 };
}
