import React, { useEffect, useState } from 'react';
import axios from 'axios';

const empty = {
  name: '',
  zoneCode: '',
  zoneName: '',
  windowStart: '08:00',
  windowEnd: '12:00',
  priority: 'medium',
  active: true,
  maxStops: 20,
};

const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

const DeliveryRulesEditor = () => {
  const [rules, setRules] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [err, setErr] = useState(null);
  const [msg, setMsg] = useState(null);

  const load = () => {
    axios
      .get('http://localhost:3601/api/custom-views/delivery-rules', { headers: headers() })
      .then((r) => setRules(r.data.data || []))
      .catch((e) => setErr(e.message));
  };

  useEffect(() => { load(); }, []);

  const submit = (e) => {
    e.preventDefault();
    setErr(null); setMsg(null);
    const req = editingId
      ? axios.put(`http://localhost:3601/api/custom-views/delivery-rules/${editingId}`, form, { headers: headers() })
      : axios.post('http://localhost:3601/api/custom-views/delivery-rules', form, { headers: headers() });
    req
      .then(() => {
        setMsg(editingId ? 'Rule updated' : 'Rule created');
        setForm(empty); setEditingId(null); load();
      })
      .catch((e) => setErr(e.response?.data?.error || e.message));
  };

  const edit = (rule) => {
    setEditingId(rule.id);
    setForm({ ...rule });
    setMsg(null); setErr(null);
  };

  const remove = (id) => {
    if (!window.confirm('Delete this rule?')) return;
    axios
      .delete(`http://localhost:3601/api/custom-views/delivery-rules/${id}`, { headers: headers() })
      .then(() => { setMsg('Rule deleted'); load(); })
      .catch((e) => setErr(e.message));
  };

  const reset = () => { setForm(empty); setEditingId(null); };

  return (
    <div style={styles.wrap}>
      <form onSubmit={submit} style={styles.form}>
        <h3 style={{ marginTop: 0 }}>{editingId ? `Edit Rule #${editingId}` : 'Create New Rule'}</h3>
        <div style={styles.grid}>
          <label style={styles.field}>Name
            <input style={styles.input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </label>
          <label style={styles.field}>Zone Code
            <input style={styles.input} value={form.zoneCode} onChange={(e) => setForm({ ...form, zoneCode: e.target.value })} required />
          </label>
          <label style={styles.field}>Zone Name
            <input style={styles.input} value={form.zoneName} onChange={(e) => setForm({ ...form, zoneName: e.target.value })} />
          </label>
          <label style={styles.field}>Window Start
            <input style={styles.input} type="time" value={form.windowStart} onChange={(e) => setForm({ ...form, windowStart: e.target.value })} required />
          </label>
          <label style={styles.field}>Window End
            <input style={styles.input} type="time" value={form.windowEnd} onChange={(e) => setForm({ ...form, windowEnd: e.target.value })} required />
          </label>
          <label style={styles.field}>Priority
            <select style={styles.input} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
          </label>
          <label style={styles.field}>Max Stops
            <input style={styles.input} type="number" min="1" value={form.maxStops} onChange={(e) => setForm({ ...form, maxStops: parseInt(e.target.value || 0, 10) })} />
          </label>
          <label style={{ ...styles.field, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
            Active
          </label>
        </div>
        <div style={styles.actions}>
          <button type="submit" style={styles.btnPrimary}>{editingId ? 'Update Rule' : 'Create Rule'}</button>
          {editingId && <button type="button" style={styles.btn} onClick={reset}>Cancel</button>}
        </div>
        {msg && <div style={{ color: '#059669', marginTop: 8, fontSize: 13 }}>{msg}</div>}
        {err && <div style={{ color: '#dc2626', marginTop: 8, fontSize: 13 }}>{err}</div>}
      </form>

      <h3 style={{ marginBottom: 8 }}>Active Rules ({rules.length})</h3>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Zone</th>
            <th style={styles.th}>Window</th>
            <th style={styles.th}>Priority</th>
            <th style={styles.th}>Max Stops</th>
            <th style={styles.th}>Active</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((r) => (
            <tr key={r.id}>
              <td style={styles.td}>{r.id}</td>
              <td style={styles.td}>{r.name}</td>
              <td style={styles.td}>{r.zoneCode} - {r.zoneName}</td>
              <td style={styles.td}>{r.windowStart} – {r.windowEnd}</td>
              <td style={styles.td}>{r.priority}</td>
              <td style={styles.td}>{r.maxStops}</td>
              <td style={styles.td}>{r.active ? 'Yes' : 'No'}</td>
              <td style={styles.td}>
                <button style={styles.btnSm} onClick={() => edit(r)}>Edit</button>{' '}
                <button style={{ ...styles.btnSm, ...styles.btnDanger }} onClick={() => remove(r.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  wrap: { background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  form: { marginBottom: 24, padding: 16, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 },
  field: { display: 'flex', flexDirection: 'column', fontSize: 13, color: '#475569', gap: 4 },
  input: { padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13 },
  actions: { marginTop: 12, display: 'flex', gap: 8 },
  btn: { padding: '8px 14px', borderRadius: 6, border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontSize: 13 },
  btnPrimary: { padding: '8px 14px', borderRadius: 6, border: 'none', background: '#3b82f6', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600 },
  btnSm: { padding: '4px 10px', borderRadius: 4, border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontSize: 12 },
  btnDanger: { borderColor: '#fecaca', color: '#dc2626', background: '#fef2f2' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: { padding: '8px 10px', background: '#f1f5f9', textAlign: 'left', border: '1px solid #e2e8f0' },
  td: { padding: '8px 10px', border: '1px solid #e2e8f0' },
};

export default DeliveryRulesEditor;
