import React, { useState } from 'react';
import { Truck, Mail, Lock, LogIn } from 'lucide-react';
import { login } from '../services/api';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(email, password);
      onLogin(res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail('admin@lastmile.com');
    setPassword('password123');
    setError('');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoArea}>
          <div style={styles.logoCircle}>
            <Truck size={32} color="#fff" />
          </div>
          <h1 style={styles.title}>AI Last-Mile Delivery</h1>
          <p style={styles.subtitle}>Optimize your delivery operations with AI</p>
        </div>

        {error && (
          <div style={styles.errorBox}>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} style={styles.inputIcon} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.inputIcon} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={styles.input}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} style={{ ...styles.loginBtn, opacity: loading ? 0.7 : 1 }}>
            <LogIn size={18} />
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <button onClick={fillDemo} style={styles.demoBtn}>
          Auto Fill Demo Credentials
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, #1E293B 0%, #334155 50%, #1E293B 100%)',
    padding: '20px', fontFamily: "'Inter', sans-serif",
  },
  card: {
    backgroundColor: '#fff', borderRadius: '16px', padding: '48px 40px',
    width: '100%', maxWidth: '420px',
    boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
  },
  logoArea: { textAlign: 'center', marginBottom: '32px' },
  logoCircle: {
    width: '64px', height: '64px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: '16px',
  },
  title: { fontSize: '22px', fontWeight: '700', color: '#1E293B', margin: '0 0 4px' },
  subtitle: { fontSize: '14px', color: '#64748B', margin: 0 },
  errorBox: {
    backgroundColor: '#FEE2E2', color: '#DC2626', padding: '12px 16px',
    borderRadius: '8px', fontSize: '14px', marginBottom: '20px',
    border: '1px solid #FECACA',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '14px', fontWeight: '600', color: '#334155' },
  inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  inputIcon: { position: 'absolute', left: '12px', color: '#94A3B8', pointerEvents: 'none' },
  input: {
    width: '100%', padding: '12px 12px 12px 42px',
    border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '14px',
    fontFamily: 'Inter, sans-serif', outline: 'none',
    transition: 'border-color 0.15s',
  },
  loginBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    padding: '12px', border: 'none', borderRadius: '8px',
    background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
    color: '#fff', fontSize: '15px', fontWeight: '600', cursor: 'pointer',
    fontFamily: 'Inter, sans-serif', marginTop: '4px',
  },
  demoBtn: {
    width: '100%', marginTop: '16px', padding: '10px',
    border: '2px dashed #CBD5E1', borderRadius: '8px',
    backgroundColor: '#F8FAFC', color: '#64748B', fontSize: '13px',
    fontWeight: '500', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
  },
};

export default LoginPage;
