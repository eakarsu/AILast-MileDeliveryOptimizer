import React, { useState, useEffect, useCallback } from 'react';
import { History, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../services/api';

const AIHistoryPage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [expanded, setExpanded] = useState({});
  const [error, setError] = useState('');
  const PAGE_SIZE = 20;

  const loadRecords = useCallback(async (pageNum = 1) => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/ai-results', { params: { page: pageNum, limit: PAGE_SIZE } });
      const data = res.data;
      setRecords(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalCount(data.pagination?.total || 0);
    } catch (err) {
      setError('Failed to load AI history: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadRecords(page); }, [loadRecords, page]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const formatDate = (d) => {
    if (!d) return '-';
    try { return new Date(d).toLocaleString(); } catch { return d; }
  };

  const endpointLabel = (e) => (e || '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  const endpointColor = (e) => {
    const colors = {
      'optimize-route': '#3B82F6',
      'predict-delivery-time': '#10B981',
      'forecast-demand': '#8B5CF6',
      'analyze-costs': '#F59E0B',
      'suggest-improvements': '#10B981',
      'analyze-incident': '#EF4444',
      'optimize-fleet': '#6366F1',
      'predict-performance': '#EC4899',
      'sla-breach-predictor': '#DC2626',
      'driver-route-match': '#0891B2',
    };
    return colors[e] || '#64748B';
  };

  return (
    <div>
      <div style={st.header}>
        <div>
          <h2 style={st.title}><History size={24} /> AI History</h2>
          <p style={st.subtitle}>{totalCount} total AI requests</p>
        </div>
      </div>

      {error && <div style={st.errorBox}>{error}</div>}

      {loading ? (
        <div style={st.loading}>Loading AI history...</div>
      ) : (
        <>
          <div style={st.tableCard}>
            <div style={st.tableWrap}>
              <table style={st.table}>
                <thead>
                  <tr>
                    <th style={st.th}>ID</th>
                    <th style={st.th}>Endpoint</th>
                    <th style={st.th}>Status</th>
                    <th style={st.th}>Timestamp</th>
                    <th style={st.th}>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {records.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ ...st.td, textAlign: 'center', color: '#94A3B8', padding: '40px' }}>
                        No AI history found
                      </td>
                    </tr>
                  ) : records.map((rec, i) => (
                    <React.Fragment key={rec.id}>
                      <tr style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#F8FAFC' }}>
                        <td style={st.td}>{rec.id}</td>
                        <td style={st.td}>
                          <span style={{
                            ...st.badge,
                            backgroundColor: endpointColor(rec.endpointType) + '20',
                            color: endpointColor(rec.endpointType),
                          }}>
                            {endpointLabel(rec.endpointType)}
                          </span>
                        </td>
                        <td style={st.td}>
                          <span style={{
                            ...st.badge,
                            backgroundColor: rec.success ? '#D1FAE5' : '#FEE2E2',
                            color: rec.success ? '#059669' : '#DC2626',
                          }}>
                            {rec.success ? 'Success' : 'Failed'}
                          </span>
                        </td>
                        <td style={st.td}>{formatDate(rec.createdAt)}</td>
                        <td style={st.td}>
                          <button
                            style={st.expandBtn}
                            onClick={() => toggleExpand(rec.id)}
                          >
                            {expanded[rec.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            {expanded[rec.id] ? 'Collapse' : 'Expand'}
                          </button>
                        </td>
                      </tr>
                      {expanded[rec.id] && (
                        <tr key={`${rec.id}-detail`}>
                          <td colSpan={5} style={{ padding: '0 16px 16px' }}>
                            {rec.errorMessage && (
                              <div style={st.errorMsg}>Error: {rec.errorMessage}</div>
                            )}
                            {rec.parsedResult && (
                              <div>
                                <div style={st.jsonLabel}>Parsed Result</div>
                                <pre style={st.jsonBlock}>{JSON.stringify(rec.parsedResult, null, 2)}</pre>
                              </div>
                            )}
                            {!rec.parsedResult && rec.rawResponse && (
                              <div>
                                <div style={st.jsonLabel}>Raw Response</div>
                                <pre style={{ ...st.jsonBlock, color: '#64748B' }}>{rec.rawResponse}</pre>
                              </div>
                            )}
                            {rec.inputPayload && (
                              <div style={{ marginTop: '12px' }}>
                                <div style={st.jsonLabel}>Input</div>
                                <pre style={{ ...st.jsonBlock, backgroundColor: '#F8FAFC' }}>{JSON.stringify(rec.inputPayload, null, 2)}</pre>
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={st.pagination}>
              <button style={{ ...st.pageBtn, opacity: page <= 1 ? 0.4 : 1 }} onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>&laquo; Prev</button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pn;
                if (totalPages <= 7) pn = i + 1;
                else if (page <= 4) pn = i + 1;
                else if (page >= totalPages - 3) pn = totalPages - 6 + i;
                else pn = page - 3 + i;
                return (
                  <button key={pn} style={{ ...st.pageBtn, ...(pn === page ? st.pageActive : {}) }} onClick={() => handlePageChange(pn)}>{pn}</button>
                );
              })}
              <button style={{ ...st.pageBtn, opacity: page >= totalPages ? 0.4 : 1 }} onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}>Next &raquo;</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const st = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' },
  title: { fontSize: '24px', fontWeight: '700', color: '#1E293B', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' },
  subtitle: { fontSize: '14px', color: '#64748B', marginTop: '4px' },
  errorBox: { backgroundColor: '#FEE2E2', color: '#DC2626', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' },
  loading: { textAlign: 'center', padding: '60px', color: '#64748B' },
  tableCard: { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #E2E8F0', overflow: 'hidden' },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '14px 16px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #E2E8F0', backgroundColor: '#F8FAFC' },
  td: { padding: '12px 16px', fontSize: '14px', color: '#334155', borderBottom: '1px solid #F1F5F9' },
  badge: { padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', display: 'inline-block' },
  expandBtn: { display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', border: '1px solid #E2E8F0', borderRadius: '6px', backgroundColor: '#F8FAFC', color: '#64748B', fontSize: '13px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' },
  jsonLabel: { fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' },
  jsonBlock: { backgroundColor: '#0F172A', color: '#E2E8F0', padding: '16px', borderRadius: '8px', fontSize: '13px', overflowX: 'auto', maxHeight: '300px', overflowY: 'auto', margin: 0 },
  errorMsg: { backgroundColor: '#FEE2E2', color: '#DC2626', padding: '10px', borderRadius: '6px', fontSize: '13px', marginBottom: '8px' },
  pagination: { display: 'flex', alignItems: 'center', gap: '6px', marginTop: '16px', justifyContent: 'center' },
  pageBtn: { padding: '8px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', backgroundColor: '#fff', color: '#334155', fontSize: '14px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: '500' },
  pageActive: { backgroundColor: '#3B82F6', color: '#fff', borderColor: '#3B82F6' },
};

export default AIHistoryPage;
