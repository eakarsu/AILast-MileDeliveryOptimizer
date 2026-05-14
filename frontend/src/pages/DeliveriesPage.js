import React, { useState, useEffect, useCallback } from 'react';
import { deliveriesAPI } from '../services/api';
import Modal from '../components/Modal';
import { Package, Plus, Search, Edit2, Trash2, Eye, X } from 'lucide-react';

const fields = [
  { key: 'trackingNumber', label: 'Tracking Number', type: 'text' },
  { key: 'customerName', label: 'Customer Name', type: 'text' },
  { key: 'customerEmail', label: 'Customer Email', type: 'email' },
  { key: 'customerPhone', label: 'Customer Phone', type: 'text' },
  { key: 'pickupAddress', label: 'Pickup Address', type: 'text' },
  { key: 'deliveryAddress', label: 'Delivery Address', type: 'text' },
  { key: 'status', label: 'Status', type: 'select', options: ['pending', 'picked_up', 'in_transit', 'delivered', 'failed'] },
  { key: 'priority', label: 'Priority', type: 'select', options: ['low', 'medium', 'high', 'urgent'] },
  { key: 'packageWeight', label: 'Weight (kg)', type: 'number' },
  { key: 'packageSize', label: 'Package Size', type: 'text' },
  { key: 'notes', label: 'Notes', type: 'textarea' },
  { key: 'estimatedDelivery', label: 'Est. Delivery Time', type: 'datetime-local' },
  { key: 'actualDelivery', label: 'Actual Delivery Time', type: 'datetime-local' },
  { key: 'driverId', label: 'Driver ID', type: 'number' },
  { key: 'vehicleId', label: 'Vehicle ID', type: 'number' },
  { key: 'zoneId', label: 'Zone ID', type: 'number' },
  { key: 'cost', label: 'Delivery Cost ($)', type: 'number' },
  { key: 'aiOptimized', label: 'AI Optimized', type: 'select', options: ['true', 'false'] },
];

const listColumns = ['id', 'trackingNumber', 'customerName', 'status', 'priority', 'deliveryAddress'];

const DeliveriesPage = () => {
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
      const res = await deliveriesAPI.getAll({ page: pageNum, limit: PAGE_SIZE });
      const data = res.data;
      if (data && data.data && data.pagination) {
        setItems(data.data);
        setTotalPages(data.pagination.totalPages || 1);
        setTotalCount(data.pagination.total || 0);
      } else {
        const arr = Array.isArray(data) ? data : data.deliveries || data.data || [];
        setItems(arr);
        setTotalPages(1);
        setTotalCount(arr.length);
      }
    } catch (err) {
      console.error(err);
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
        await deliveriesAPI.update(formData.id, formData);
      } else {
        await deliveriesAPI.create(formData);
      }
      setShowForm(false);
      loadItems();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete delivery #${item.id}? This cannot be undone.`)) return;
    try {
      await deliveriesAPI.delete(item.id);
      setShowDetail(false);
      loadItems();
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const updateField = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

  return (
    <div>
      <div style={ps.header}>
        <div>
          <h2 style={ps.title}><Package size={24} /> Deliveries</h2>
          <p style={ps.subtitle}>{totalCount} total deliveries</p>
        </div>
        <button style={ps.addBtn} onClick={openCreate}><Plus size={18} /> New Delivery</button>
      </div>

      <div style={ps.searchBar}>
        <Search size={18} style={ps.searchIcon} />
        <input
          style={ps.searchInput}
          placeholder="Search deliveries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && <button style={ps.clearSearch} onClick={() => setSearch('')}><X size={16} /></button>}
      </div>

      {loading ? (
        <div style={ps.loading}>Loading...</div>
      ) : (
        <div style={ps.tableCard}>
          <div style={ps.tableWrap}>
            <table style={ps.table}>
              <thead>
                <tr>
                  {listColumns.map(col => (
                    <th key={col} style={ps.th}>{col.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</th>
                  ))}
                  <th style={ps.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={listColumns.length + 1} style={{ ...ps.td, textAlign: 'center', color: '#94A3B8', padding: '40px' }}>No deliveries found</td></tr>
                ) : filtered.map((item, i) => (
                  <tr key={item.id || i} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#F8FAFC', cursor: 'pointer' }} onClick={() => openDetail(item)}>
                    {listColumns.map(col => (
                      <td key={col} style={ps.td}>
                        {col === 'status' || col === 'priority' ? (
                          <span style={{ ...ps.badge, ...getBadgeStyle(col, item[col]) }}>{item[col] || '-'}</span>
                        ) : (
                          String(item[col] ?? '-')
                        )}
                      </td>
                    ))}
                    <td style={ps.td} onClick={e => e.stopPropagation()}>
                      <div style={ps.actions}>
                        <button style={ps.actionBtn} onClick={() => openDetail(item)} title="View"><Eye size={16} /></button>
                        <button style={{ ...ps.actionBtn, color: '#3B82F6' }} onClick={() => openEdit(item)} title="Edit"><Edit2 size={16} /></button>
                        <button style={{ ...ps.actionBtn, color: '#EF4444' }} onClick={() => handleDelete(item)} title="Delete"><Trash2 size={16} /></button>
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
        <div style={ps.pagination}>
          <button style={{ ...ps.pageBtn, opacity: page <= 1 ? 0.4 : 1 }} onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>&laquo; Prev</button>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            let pn;
            if (totalPages <= 7) pn = i + 1;
            else if (page <= 4) pn = i + 1;
            else if (page >= totalPages - 3) pn = totalPages - 6 + i;
            else pn = page - 3 + i;
            return (
              <button key={pn} style={{ ...ps.pageBtn, ...(pn === page ? ps.pageActive : {}) }} onClick={() => handlePageChange(pn)}>{pn}</button>
            );
          })}
          <button style={{ ...ps.pageBtn, opacity: page >= totalPages ? 0.4 : 1 }} onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}>Next &raquo;</button>
        </div>
      )}

      {/* Detail Modal */}
      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} title={`Delivery #${selected?.id || ''}`} width="700px">
        {selected && (
          <div>
            <div style={ps.detailGrid}>
              {fields.map(f => (
                <div key={f.key} style={ps.detailField}>
                  <span style={ps.detailLabel}>{f.label}</span>
                  <span style={ps.detailValue}>
                    {f.key === 'status' || f.key === 'priority' ? (
                      <span style={{ ...ps.badge, ...getBadgeStyle(f.key, selected[f.key]) }}>{selected[f.key] || '-'}</span>
                    ) : (
                      String(selected[f.key] ?? '-')
                    )}
                  </span>
                </div>
              ))}
            </div>
            <div style={ps.detailActions}>
              <button style={ps.editBtn} onClick={() => openEdit(selected)}><Edit2 size={16} /> Edit</button>
              <button style={ps.deleteBtn} onClick={() => handleDelete(selected)}><Trash2 size={16} /> Delete</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Form Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={isEditing ? 'Edit Delivery' : 'New Delivery'} width="700px">
        {error && <div style={ps.error}>{error}</div>}
        <div style={ps.formGrid}>
          {fields.map(f => (
            <div key={f.key} style={ps.formGroup}>
              <label style={ps.formLabel}>{f.label}</label>
              {f.type === 'select' ? (
                <select style={ps.formInput} value={formData[f.key] || ''} onChange={e => updateField(f.key, e.target.value)}>
                  <option value="">Select...</option>
                  {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : f.type === 'textarea' ? (
                <textarea style={{ ...ps.formInput, minHeight: '80px', resize: 'vertical' }} value={formData[f.key] || ''} onChange={e => updateField(f.key, e.target.value)} />
              ) : (
                <input style={ps.formInput} type={f.type} value={formData[f.key] || ''} onChange={e => updateField(f.key, e.target.value)} />
              )}
            </div>
          ))}
        </div>
        <div style={ps.formActions}>
          <button style={ps.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
          <button style={ps.saveBtn} onClick={handleSave}>{isEditing ? 'Update' : 'Create'}</button>
        </div>
      </Modal>
    </div>
  );
};

function getBadgeStyle(type, value) {
  const v = (value || '').toLowerCase();
  if (type === 'status') {
    if (v === 'delivered' || v === 'completed') return { backgroundColor: '#D1FAE5', color: '#059669' };
    if (v === 'in_transit') return { backgroundColor: '#DBEAFE', color: '#2563EB' };
    if (v === 'pending' || v === 'assigned') return { backgroundColor: '#FEF3C7', color: '#D97706' };
    if (v === 'failed' || v === 'cancelled') return { backgroundColor: '#FEE2E2', color: '#DC2626' };
    if (v === 'picked_up') return { backgroundColor: '#E0E7FF', color: '#4338CA' };
  }
  if (type === 'priority') {
    if (v === 'urgent') return { backgroundColor: '#FEE2E2', color: '#DC2626' };
    if (v === 'high') return { backgroundColor: '#FFEDD5', color: '#EA580C' };
    if (v === 'medium') return { backgroundColor: '#FEF3C7', color: '#D97706' };
    if (v === 'low') return { backgroundColor: '#D1FAE5', color: '#059669' };
  }
  return { backgroundColor: '#F1F5F9', color: '#64748B' };
}

const ps = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' },
  title: { fontSize: '24px', fontWeight: '700', color: '#1E293B', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' },
  subtitle: { fontSize: '14px', color: '#64748B', marginTop: '4px' },
  addBtn: {
    display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px',
    backgroundColor: '#3B82F6', color: '#fff', border: 'none', borderRadius: '8px',
    fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
  },
  searchBar: { position: 'relative', marginBottom: '16px' },
  searchIcon: { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' },
  searchInput: {
    width: '100%', padding: '12px 40px 12px 42px', border: '1px solid #E2E8F0',
    borderRadius: '10px', fontSize: '14px', fontFamily: 'Inter, sans-serif',
    backgroundColor: '#fff', outline: 'none',
  },
  clearSearch: { position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' },
  loading: { textAlign: 'center', padding: '60px', color: '#64748B' },
  tableCard: { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #E2E8F0', overflow: 'hidden' },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '14px 16px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #E2E8F0', backgroundColor: '#F8FAFC' },
  td: { padding: '12px 16px', fontSize: '14px', color: '#334155', borderBottom: '1px solid #F1F5F9' },
  badge: { padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', textTransform: 'capitalize', display: 'inline-block' },
  actions: { display: 'flex', gap: '4px' },
  actionBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '6px', color: '#64748B', display: 'flex', alignItems: 'center' },
  detailGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' },
  detailField: { display: 'flex', flexDirection: 'column', gap: '4px' },
  detailLabel: { fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' },
  detailValue: { fontSize: '14px', color: '#1E293B', fontWeight: '500' },
  detailActions: { display: 'flex', gap: '12px', paddingTop: '16px', borderTop: '1px solid #E2E8F0' },
  editBtn: {
    display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px',
    backgroundColor: '#3B82F6', color: '#fff', border: 'none', borderRadius: '8px',
    fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
  },
  deleteBtn: {
    display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px',
    backgroundColor: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: '8px',
    fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
  },
  error: { backgroundColor: '#FEE2E2', color: '#DC2626', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  formLabel: { fontSize: '13px', fontWeight: '600', color: '#334155' },
  formInput: {
    padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '8px',
    fontSize: '14px', fontFamily: 'Inter, sans-serif', outline: 'none', width: '100%',
  },
  formActions: { display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px', borderTop: '1px solid #E2E8F0' },
  cancelBtn: {
    padding: '10px 20px', backgroundColor: '#F1F5F9', color: '#64748B',
    border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600',
    cursor: 'pointer', fontFamily: 'Inter, sans-serif',
  },
  saveBtn: {
    padding: '10px 24px', backgroundColor: '#3B82F6', color: '#fff',
    border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600',
    cursor: 'pointer', fontFamily: 'Inter, sans-serif',
  },
  pagination: { display: 'flex', alignItems: 'center', gap: '6px', marginTop: '16px', justifyContent: 'center' },
  pageBtn: { padding: '8px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', backgroundColor: '#fff', color: '#334155', fontSize: '14px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: '500' },
  pageActive: { backgroundColor: '#3B82F6', color: '#fff', borderColor: '#3B82F6' },
};

export default DeliveriesPage;
