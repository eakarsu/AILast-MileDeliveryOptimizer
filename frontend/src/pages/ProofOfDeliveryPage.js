import React, { useState, useEffect, useRef } from 'react';

// Apply pass 7: Real proof-of-delivery capture (signature + photo)
// Uses POST /api/proof-of-delivery
const API_BASE = '/api';

export default function ProofOfDeliveryPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [notes, setNotes] = useState('');
  const [photoData, setPhotoData] = useState(null);
  const [signatureData, setSignatureData] = useState(null);
  const [gpsLat, setGpsLat] = useState('');
  const [gpsLon, setGpsLon] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [records, setRecords] = useState([]);
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);

  useEffect(() => { loadRecords(); }, []);

  const loadRecords = async () => {
    try {
      const token = localStorage.getItem('token');
      const r = await fetch(`${API_BASE}/proof-of-delivery?limit=20`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!r.ok) return;
      const j = await r.json();
      setRecords(j.data || []);
    } catch (_) {}
  };

  // signature pad
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';

    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const t = e.touches ? e.touches[0] : e;
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    };
    const start = (e) => { drawingRef.current = true; const p = getPos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); };
    const move = (e) => { if (!drawingRef.current) return; const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); };
    const end = () => { drawingRef.current = false; setSignatureData(canvas.toDataURL('image/png')); };

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', move);
    canvas.addEventListener('mouseup', end);
    canvas.addEventListener('mouseleave', end);
    canvas.addEventListener('touchstart', start);
    canvas.addEventListener('touchmove', move);
    canvas.addEventListener('touchend', end);
    return () => {
      canvas.removeEventListener('mousedown', start);
      canvas.removeEventListener('mousemove', move);
      canvas.removeEventListener('mouseup', end);
      canvas.removeEventListener('mouseleave', end);
      canvas.removeEventListener('touchstart', start);
      canvas.removeEventListener('touchmove', move);
      canvas.removeEventListener('touchend', end);
    };
  }, []);

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setSignatureData(null);
  };

  const onPhotoChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoData(reader.result);
    reader.readAsDataURL(file);
  };

  const captureGps = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => { setGpsLat(String(pos.coords.latitude)); setGpsLon(String(pos.coords.longitude)); },
      () => {}
    );
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(null); setSuccess(null);
    if (!trackingNumber.trim()) return setError('Tracking number is required');
    if (!recipientName.trim()) return setError('Recipient name is required');
    if (!signatureData && !photoData) return setError('Capture a signature or photo');
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const r = await fetch(`${API_BASE}/proof-of-delivery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          trackingNumber: trackingNumber.trim(),
          recipientName: recipientName.trim(),
          signatureData,
          photoData,
          gpsLat: gpsLat ? Number(gpsLat) : null,
          gpsLon: gpsLon ? Number(gpsLon) : null,
          notes: notes.trim() || null,
        }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || `HTTP ${r.status}`);
      setSuccess(`POD #${j.id} recorded for ${j.trackingNumber}`);
      setTrackingNumber(''); setRecipientName(''); setNotes(''); setPhotoData(null);
      clearSignature();
      loadRecords();
    } catch (err) {
      setError(err.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, marginBottom: 6 }}>Proof of Delivery</h1>
      <p style={{ color: '#555', marginBottom: 20 }}>Capture signature and photo to confirm delivery completion.</p>

      <form onSubmit={submit} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 20, marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={lbl}>Tracking number</label>
            <input value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} style={inp} placeholder="TRK-1234" />
          </div>
          <div>
            <label style={lbl}>Recipient name</label>
            <input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} style={inp} placeholder="Jane Doe" />
          </div>
          <div>
            <label style={lbl}>Notes (optional)</label>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} style={inp} placeholder="Left at front porch" />
          </div>
          <div>
            <label style={lbl}>GPS</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={gpsLat} onChange={(e) => setGpsLat(e.target.value)} style={{ ...inp, flex: 1 }} placeholder="lat" />
              <input value={gpsLon} onChange={(e) => setGpsLon(e.target.value)} style={{ ...inp, flex: 1 }} placeholder="lon" />
              <button type="button" onClick={captureGps} style={btnSecondary}>Capture</button>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={lbl}>Signature</label>
            <canvas ref={canvasRef} width={400} height={140} style={{ border: '1px solid #d1d5db', borderRadius: 6, width: '100%', background: '#fff', touchAction: 'none' }} />
            <button type="button" onClick={clearSignature} style={{ ...btnSecondary, marginTop: 6 }}>Clear signature</button>
          </div>
          <div>
            <label style={lbl}>Photo</label>
            <input type="file" accept="image/*" onChange={onPhotoChange} />
            {photoData && (
              <div style={{ marginTop: 8 }}>
                <img src={photoData} alt="POD preview" style={{ maxWidth: '100%', maxHeight: 160, borderRadius: 6, border: '1px solid #e5e7eb' }} />
              </div>
            )}
          </div>
        </div>

        {error && <div style={{ marginTop: 12, color: '#991b1b', background: '#fef2f2', padding: 10, borderRadius: 6 }}>{error}</div>}
        {success && <div style={{ marginTop: 12, color: '#065f46', background: '#ecfdf5', padding: 10, borderRadius: 6 }}>{success}</div>}

        <div style={{ marginTop: 16 }}>
          <button type="submit" disabled={submitting} style={btnPrimary}>{submitting ? 'Submitting...' : 'Record Proof of Delivery'}</button>
        </div>
      </form>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 20 }}>
        <h3 style={{ marginTop: 0 }}>Recent POD records</h3>
        {records.length === 0 ? (
          <div style={{ color: '#6b7280' }}>No records yet.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
                <th style={th}>ID</th><th style={th}>Tracking</th><th style={th}>Recipient</th><th style={th}>Captured at</th><th style={th}>GPS</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={td}>{r.id}</td>
                  <td style={td}>{r.tracking_number}</td>
                  <td style={td}>{r.recipient_name}</td>
                  <td style={td}>{r.captured_at ? new Date(r.captured_at).toLocaleString() : '-'}</td>
                  <td style={td}>{r.gps_lat != null ? `${Number(r.gps_lat).toFixed(4)}, ${Number(r.gps_lon).toFixed(4)}` : '-'}</td>
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
const btnPrimary = { background: '#3B82F6', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 6, cursor: 'pointer', fontWeight: 600 };
const btnSecondary = { background: '#fff', color: '#374151', border: '1px solid #d1d5db', padding: '8px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 13 };
const th = { padding: '8px 6px', fontSize: 13, color: '#374151' };
const td = { padding: '8px 6px', fontSize: 13, color: '#111827' };
