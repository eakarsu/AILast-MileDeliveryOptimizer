import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RouteManifestPDF = () => {
  const [routeId, setRouteId] = useState('R-101');
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = (id) => {
    setLoading(true);
    setErr(null);
    const token = localStorage.getItem('token');
    axios
      .get(`http://localhost:3601/api/custom-views/route-manifest?routeId=${encodeURIComponent(id)}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => setData(r.data))
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(routeId); /* eslint-disable-next-line */ }, []);

  const openPrintable = () => {
    const token = localStorage.getItem('token');
    // Fetch HTML version and open in a new window for print -> PDF
    axios
      .get(`http://localhost:3601/api/custom-views/route-manifest?routeId=${encodeURIComponent(routeId)}&format=html`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'text',
      })
      .then((r) => {
        const w = window.open('', '_blank');
        if (w) {
          w.document.write(r.data);
          w.document.close();
        }
      })
      .catch((e) => setErr(e.message));
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.controls}>
        <label style={styles.label}>Route ID</label>
        <input
          style={styles.input}
          value={routeId}
          onChange={(e) => setRouteId(e.target.value)}
        />
        <button style={styles.btn} onClick={() => load(routeId)} disabled={loading}>
          {loading ? 'Loading...' : 'Load Manifest'}
        </button>
        <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={openPrintable}>
          Open Printable PDF
        </button>
      </div>

      {err && <div style={{ color: '#dc2626', marginTop: 8 }}>Error: {err}</div>}

      {data && (
        <div style={styles.preview}>
          <h3 style={{ marginTop: 0 }}>Manifest {data.routeId}</h3>
          <div style={styles.meta}>
            Driver: <b>{data.driver}</b> | Vehicle: <b>{data.vehicle}</b><br />
            Depot: {data.depot} | Departure: {data.departureTime}
          </div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Tracking</th>
                <th style={styles.th}>Recipient</th>
                <th style={styles.th}>Address</th>
                <th style={styles.th}>Window</th>
                <th style={styles.th}>Weight</th>
                <th style={styles.th}>Sig?</th>
              </tr>
            </thead>
            <tbody>
              {data.stops.map((s) => (
                <tr key={s.seq}>
                  <td style={styles.td}>{s.seq}</td>
                  <td style={styles.td}>{s.trackingId}</td>
                  <td style={styles.td}>{s.recipient}</td>
                  <td style={styles.td}>{s.address}</td>
                  <td style={styles.td}>{s.window}</td>
                  <td style={styles.td}>{s.weightKg} kg</td>
                  <td style={styles.td}>{s.signature ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={styles.totals}>
            <b>Totals:</b> {data.totals.stops} stops • {data.totals.weightKg} kg • {data.totals.distanceKm} km • ETA {data.totals.etaMinutes} min
          </div>
          <div style={styles.notes}><b>Notes:</b> {data.notes}</div>
        </div>
      )}
    </div>
  );
};

const styles = {
  wrap: { background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  controls: { display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' },
  label: { fontSize: 13, color: '#475569', fontWeight: 600 },
  input: { padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13 },
  btn: { padding: '8px 14px', borderRadius: 6, border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer', fontSize: 13 },
  btnPrimary: { background: '#3b82f6', color: '#fff', border: 'none' },
  preview: { marginTop: 16, borderTop: '1px solid #e2e8f0', paddingTop: 12 },
  meta: { color: '#475569', fontSize: 13, marginBottom: 10 },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: { padding: '8px 10px', background: '#f1f5f9', textAlign: 'left', border: '1px solid #e2e8f0' },
  td: { padding: '8px 10px', border: '1px solid #e2e8f0' },
  totals: { marginTop: 10, fontSize: 13 },
  notes: { marginTop: 8, padding: 10, background: '#fef3c7', borderLeft: '4px solid #f59e0b', fontSize: 13 },
};

export default RouteManifestPDF;
