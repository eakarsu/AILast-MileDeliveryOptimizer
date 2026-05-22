import React, { useEffect, useState } from 'react';
import axios from 'axios';

const colorFor = (v, legend) => {
  if (v >= legend.high) return '#065f46';
  if (v >= legend.mid) return '#10b981';
  if (v >= legend.low) return '#fbbf24';
  return '#ef4444';
};

const PerformanceHeatmap = () => {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:3601/api/custom-views/performance-heatmap', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => setData(r.data))
      .catch((e) => setErr(e.message));
  }, []);

  if (err) return <div style={{ color: '#dc2626' }}>Failed to load: {err}</div>;
  if (!data) return <div>Loading heatmap...</div>;

  return (
    <div style={styles.wrap}>
      <div style={styles.head}>
        <div><b>Metric:</b> On-Time Delivery %</div>
        <div style={styles.legend}>
          <span style={{ ...styles.swatch, background: '#ef4444' }} />&lt; {data.legend.low}
          <span style={{ ...styles.swatch, background: '#fbbf24' }} />{data.legend.low}-{data.legend.mid}
          <span style={{ ...styles.swatch, background: '#10b981' }} />{data.legend.mid}-{data.legend.high}
          <span style={{ ...styles.swatch, background: '#065f46' }} />&ge; {data.legend.high}
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Driver \ Zone</th>
              {data.cols.map((c) => (
                <th key={c} style={styles.th}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((r, ri) => (
              <tr key={r}>
                <td style={styles.rowHead}>{r}</td>
                {data.matrix[ri].map((v, ci) => (
                  <td key={ci} style={{ ...styles.cell, background: colorFor(v, data.legend) }}>
                    {v}%
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  wrap: { background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  head: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, fontSize: 13, color: '#475569', flexWrap: 'wrap', gap: 12 },
  legend: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 },
  swatch: { display: 'inline-block', width: 14, height: 14, borderRadius: 3, marginLeft: 8, marginRight: 4 },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: { padding: '8px 10px', background: '#f1f5f9', textAlign: 'left', border: '1px solid #e2e8f0' },
  rowHead: { padding: '8px 10px', background: '#f8fafc', fontWeight: 600, border: '1px solid #e2e8f0' },
  cell: { padding: '12px 10px', color: '#fff', textAlign: 'center', fontWeight: 600, border: '1px solid #e2e8f0' },
};

export default PerformanceHeatmap;
