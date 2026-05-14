import React, { useState, useEffect, useCallback } from 'react';
import Modal from '../components/Modal';
import { Plus, Search, Edit2, Trash2, Eye, X } from 'lucide-react';

function getBadgeStyle(value) {
  const v = (value || '').toString().toLowerCase();
  if (['delivered', 'completed', 'active', 'available', 'resolved', 'met', 'good', 'excellent', 'operational'].includes(v))
    return { backgroundColor: '#D1FAE5', color: '#059669' };
  if (['in_transit', 'in transit', 'in_progress', 'processing', 'assigned', 'investigating', 'on_route'].includes(v))
    return { backgroundColor: '#DBEAFE', color: '#2563EB' };
  if (['pending', 'warning', 'medium', 'maintenance', 'open', 'at_risk', 'moderate'].includes(v))
    return { backgroundColor: '#FEF3C7', color: '#D97706' };
  if (['failed', 'cancelled', 'inactive', 'critical', 'high', 'urgent', 'overdue', 'poor', 'out_of_service', 'unresolved'].includes(v))
    return { backgroundColor: '#FEE2E2', color: '#DC2626' };
  if (['low', 'picked_up', 'scheduled'].includes(v))
    return { backgroundColor: '#E0E7FF', color: '#4338CA' };
  return null;
}

const createEntityPage = ({ title, icon: Icon, api, fields, listColumns, badgeColumns = [], entityName }) => {
  const EntityPage = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const PAGE_SIZE = 20;

    const loadItems = useCallback(async (pageNum = 1) => {
      try {
        setLoading(true);
        const res = await api.getAll({ page: pageNum, limit: PAGE_SIZE });
        const data = res.data;
        if (data && data.data && data.pagination) {
          setItems(data.data);
          setTotalPages(data.pagination.totalPages || 1);
          setTotalCount(data.pagination.total || data.data.length);
        } else if (Array.isArray(data)) {
          setItems(data);
          setTotalPages(1);
          setTotalCount(data.length);
        } else {
          const key = Object.keys(data).find(k => Array.isArray(data[k]));
          setItems(key ? data[key] : []);
          setTotalPages(1);
          setTotalCount(key ? data[key].length : 0);
        }
      } catch (err) {
        console.error(err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }, []);

    useEffect(() => { loadItems(page); }, [loadItems, page]);

    const handlePageChange = (newPage) => {
      if (newPage < 1 || newPage > totalPages) return;
      setPage(newPage);
    };

    const filtered = items.filter(item => {
      if (!search) return true;
      const s = search.toLowerCase();
      return Object.values(item).some(v => String(v).toLowerCase().includes(s));
    });

    const openDetail = (item) => { setSelected(item); setShowDetail(true); };
    const openCreate = () => { setFormData({}); setIsEditing(false); setShowForm(true); setError(''); };
    const openEdit = (item) => {
      setFormData({ ...item });
      setIsEditing(true);
      setShowForm(true);
      setShowDetail(false);
      setError('');
    };

    const handleSave = async () => {
      try {
        setError('');
        if (isEditing) {
          await api.update(formData.id, formData);
        } else {
          await api.create(formData);
        }
        setShowForm(false);
        loadItems();
      } catch (err) {
        setError(err.response?.data?.message || 'Operation failed');
      }
    };

    const handleDelete = async (item) => {
      if (!window.confirm(`Delete ${entityName} #${item.id}? This cannot be undone.`)) return;
      try {
        await api.delete(item.id);
        setShowDetail(false);
        loadItems();
      } catch (err) {
        alert('Delete failed: ' + (err.response?.data?.message || err.message));
      }
    };

    const updateField = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

    const renderCellValue = (col, value) => {
      if (badgeColumns.includes(col)) {
        const bs = getBadgeStyle(value);
        if (bs) return <span style={{ ...st.badge, ...bs }}>{String(value || '-')}</span>;
      }
      if (value === null || value === undefined) return '-';
      if (typeof value === 'boolean') return value ? 'Yes' : 'No';
      return String(value);
    };

    const colLabel = (col) => col.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/^./, s => s.toUpperCase());

    return (
      <div>
        <div style={st.header}>
          <div>
            <h2 style={st.title}><Icon size={24} /> {title}</h2>
            <p style={st.subtitle}>{totalCount} total records</p>
          </div>
          <button style={st.addBtn} onClick={openCreate}><Plus size={18} /> New {entityName}</button>
        </div>

        <div style={st.searchBar}>
          <Search size={18} style={st.searchIcon} />
          <input style={st.searchInput} placeholder={`Search ${title.toLowerCase()}...`} value={search} onChange={(e) => setSearch(e.target.value)} />
          {search && <button style={st.clearSearch} onClick={() => setSearch('')}><X size={16} /></button>}
        </div>

        {loading ? (
          <div style={st.loading}>Loading...</div>
        ) : (
          <div style={st.tableCard}>
            <div style={st.tableWrap}>
              <table style={st.table}>
                <thead>
                  <tr>
                    {listColumns.map(col => <th key={col} style={st.th}>{colLabel(col)}</th>)}
                    <th style={st.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={listColumns.length + 1} style={{ ...st.td, textAlign: 'center', color: '#94A3B8', padding: '40px' }}>No records found</td></tr>
                  ) : filtered.map((item, i) => (
                    <tr key={item.id || i} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#F8FAFC', cursor: 'pointer' }} onClick={() => openDetail(item)}>
                      {listColumns.map(col => (
                        <td key={col} style={st.td}>{renderCellValue(col, item[col])}</td>
                      ))}
                      <td style={st.td} onClick={e => e.stopPropagation()}>
                        <div style={st.actions}>
                          <button style={st.actionBtn} onClick={() => openDetail(item)} title="View"><Eye size={16} /></button>
                          <button style={{ ...st.actionBtn, color: '#3B82F6' }} onClick={() => openEdit(item)} title="Edit"><Edit2 size={16} /></button>
                          <button style={{ ...st.actionBtn, color: '#EF4444' }} onClick={() => handleDelete(item)} title="Delete"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div style={st.pagination}>
            <button style={{ ...st.pageBtn, opacity: page <= 1 ? 0.4 : 1 }} onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
              &laquo; Prev
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pageNum;
              if (totalPages <= 7) pageNum = i + 1;
              else if (page <= 4) pageNum = i + 1;
              else if (page >= totalPages - 3) pageNum = totalPages - 6 + i;
              else pageNum = page - 3 + i;
              return (
                <button
                  key={pageNum}
                  style={{ ...st.pageBtn, ...(pageNum === page ? st.pageActive : {}) }}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
            <button style={{ ...st.pageBtn, opacity: page >= totalPages ? 0.4 : 1 }} onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}>
              Next &raquo;
            </button>
          </div>
        )}

        <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} title={`${entityName} #${selected?.id || ''}`} width="700px">
          {selected && (
            <div>
              <div style={st.detailGrid}>
                {fields.map(f => (
                  <div key={f.key} style={st.detailField}>
                    <span style={st.detailLabel}>{f.label}</span>
                    <span style={st.detailValue}>{renderCellValue(f.key, selected[f.key])}</span>
                  </div>
                ))}
              </div>
              <div style={st.detailActions}>
                <button style={st.editBtn} onClick={() => openEdit(selected)}><Edit2 size={16} /> Edit</button>
                <button style={st.deleteBtn} onClick={() => handleDelete(selected)}><Trash2 size={16} /> Delete</button>
              </div>
            </div>
          )}
        </Modal>

        <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={isEditing ? `Edit ${entityName}` : `New ${entityName}`} width="700px">
          {error && <div style={st.error}>{error}</div>}
          <div style={st.formGrid}>
            {fields.map(f => (
              <div key={f.key} style={{ ...st.formGroup, ...(f.type === 'textarea' ? { gridColumn: 'span 2' } : {}) }}>
                <label style={st.formLabel}>{f.label}</label>
                {f.type === 'select' ? (
                  <select style={st.formInput} value={formData[f.key] || ''} onChange={e => updateField(f.key, e.target.value)}>
                    <option value="">Select...</option>
                    {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : f.type === 'textarea' ? (
                  <textarea style={{ ...st.formInput, minHeight: '80px', resize: 'vertical' }} value={formData[f.key] || ''} onChange={e => updateField(f.key, e.target.value)} />
                ) : (
                  <input style={st.formInput} type={f.type || 'text'} value={formData[f.key] || ''} onChange={e => updateField(f.key, e.target.value)} />
                )}
              </div>
            ))}
          </div>
          <div style={st.formActions}>
            <button style={st.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
            <button style={st.saveBtn} onClick={handleSave}>{isEditing ? 'Update' : 'Create'}</button>
          </div>
        </Modal>
      </div>
    );
  };

  return EntityPage;
};

const st = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' },
  title: { fontSize: '24px', fontWeight: '700', color: '#1E293B', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' },
  subtitle: { fontSize: '14px', color: '#64748B', marginTop: '4px' },
  addBtn: { display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', backgroundColor: '#3B82F6', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Inter, sans-serif' },
  searchBar: { position: 'relative', marginBottom: '16px' },
  searchIcon: { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' },
  searchInput: { width: '100%', padding: '12px 40px 12px 42px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '14px', fontFamily: 'Inter, sans-serif', backgroundColor: '#fff', outline: 'none' },
  clearSearch: { position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' },
  loading: { textAlign: 'center', padding: '60px', color: '#64748B' },
  tableCard: { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #E2E8F0', overflow: 'hidden' },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '14px 16px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #E2E8F0', backgroundColor: '#F8FAFC', whiteSpace: 'nowrap' },
  td: { padding: '12px 16px', fontSize: '14px', color: '#334155', borderBottom: '1px solid #F1F5F9' },
  badge: { padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', textTransform: 'capitalize', display: 'inline-block' },
  actions: { display: 'flex', gap: '4px' },
  actionBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '6px', color: '#64748B', display: 'flex', alignItems: 'center' },
  detailGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' },
  detailField: { display: 'flex', flexDirection: 'column', gap: '4px' },
  detailLabel: { fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' },
  detailValue: { fontSize: '14px', color: '#1E293B', fontWeight: '500' },
  detailActions: { display: 'flex', gap: '12px', paddingTop: '16px', borderTop: '1px solid #E2E8F0' },
  editBtn: { display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', backgroundColor: '#3B82F6', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Inter, sans-serif' },
  deleteBtn: { display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', backgroundColor: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Inter, sans-serif' },
  error: { backgroundColor: '#FEE2E2', color: '#DC2626', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  formLabel: { fontSize: '13px', fontWeight: '600', color: '#334155' },
  formInput: { padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '14px', fontFamily: 'Inter, sans-serif', outline: 'none', width: '100%' },
  formActions: { display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px', borderTop: '1px solid #E2E8F0' },
  cancelBtn: { padding: '10px 20px', backgroundColor: '#F1F5F9', color: '#64748B', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Inter, sans-serif' },
  saveBtn: { padding: '10px 24px', backgroundColor: '#3B82F6', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Inter, sans-serif' },
  pagination: { display: 'flex', alignItems: 'center', gap: '6px', marginTop: '16px', justifyContent: 'center' },
  pageBtn: { padding: '8px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', backgroundColor: '#fff', color: '#334155', fontSize: '14px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: '500' },
  pageActive: { backgroundColor: '#3B82F6', color: '#fff', borderColor: '#3B82F6' },
};

export default createEntityPage;
