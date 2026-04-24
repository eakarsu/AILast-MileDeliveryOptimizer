import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, width = '600px' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={{ ...styles.modal, maxWidth: width }} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>{title}</h2>
          <button style={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div style={styles.body}>{children}</div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    padding: '20px', backdropFilter: 'blur(4px)',
  },
  modal: {
    background: '#fff', borderRadius: '12px', width: '100%',
    maxHeight: '90vh', display: 'flex', flexDirection: 'column',
    boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '20px 24px', borderBottom: '1px solid #E2E8F0',
  },
  title: { fontSize: '18px', fontWeight: '600', color: '#1E293B', margin: 0 },
  closeBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    color: '#64748B', padding: '4px', borderRadius: '6px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  body: { padding: '24px', overflowY: 'auto', flex: 1 },
};

export default Modal;
