import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DeliveriesPage from './pages/DeliveriesPage';
import DriversPage from './pages/DriversPage';
import VehiclesPage from './pages/VehiclesPage';
import CustomersPage from './pages/CustomersPage';
import WarehousesPage from './pages/WarehousesPage';
import ZonesPage from './pages/ZonesPage';
import PackagesPage from './pages/PackagesPage';
import RoutesPage from './pages/RoutesPage';
import IncidentsPage from './pages/IncidentsPage';
import SLAsPage from './pages/SLAsPage';
import PerformancePage from './pages/PerformancePage';
import CostAnalysisPage from './pages/CostAnalysisPage';
import DemandForecastPage from './pages/DemandForecastPage';
import AIHubPage from './pages/AIHubPage';
import AIHistoryPage from './pages/AIHistoryPage';
import SLAPredictorPage from './pages/SLAPredictorPage';
import AIToolsPage from './pages/AIToolsPage';
import CustomViewsPage from './pages/CustomViewsPage';

import CodexCustomVizFeature from './pages/CodexCustomVizFeature';
import CodexOperationsFeature from './pages/CodexOperationsFeature';

// Apply pass 7: full backlog pages
import ProofOfDeliveryPage from './pages/ProofOfDeliveryPage';
import ReturnsPage from './pages/ReturnsPage';
import PublicTrackingPage from './pages/PublicTrackingPage';
import PorchPiracyRiskMap from './pages/PorchPiracyRiskMap';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  useEffect(() => {
    const stored = localStorage.getItem('token');
    if (stored !== token) setToken(stored);
  }, []);

  if (!token) {
    return (
      <Router>
        <LoginPage onLogin={handleLogin} />
      </Router>
    );
  }

  return (
    <Router>
      <div style={styles.layout}>
        <Sidebar onLogout={handleLogout} />
        <div style={styles.mainArea}>
          <header style={styles.header}>
            <h1 style={styles.headerTitle}>AI Last-Mile Delivery Optimizer</h1>
            <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
          </header>
          <main style={styles.content}>
            <Routes>
        <Route path="/codex/custom-viz" element={<CodexCustomVizFeature />} />
        <Route path="/codex/operations" element={<CodexOperationsFeature />} />

              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/deliveries" element={<DeliveriesPage />} />
              <Route path="/drivers" element={<DriversPage />} />
              <Route path="/vehicles" element={<VehiclesPage />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/warehouses" element={<WarehousesPage />} />
              <Route path="/zones" element={<ZonesPage />} />
              <Route path="/packages" element={<PackagesPage />} />
              <Route path="/routes" element={<RoutesPage />} />
              <Route path="/incidents" element={<IncidentsPage />} />
              <Route path="/slas" element={<SLAsPage />} />
              <Route path="/performance" element={<PerformancePage />} />
              <Route path="/cost-analysis" element={<CostAnalysisPage />} />
              <Route path="/demand-forecast" element={<DemandForecastPage />} />
              <Route path="/ai-hub" element={<AIHubPage />} />
              <Route path="/ai-history" element={<AIHistoryPage />} />
              <Route path="/sla-predictor" element={<SLAPredictorPage />} />
              <Route path="/ai-tools" element={<AIToolsPage />} />
              <Route path="/custom-views" element={<CustomViewsPage />} />
              {/* Apply pass 7: full backlog routes */}
              <Route path="/proof-of-delivery" element={<ProofOfDeliveryPage />} />
              <Route path="/returns" element={<ReturnsPage />} />
              <Route path="/track" element={<PublicTrackingPage />} />
              <Route path="/porch-piracy-risk-map" element={<PorchPiracyRiskMap />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

const styles = {
  layout: { display: 'flex', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
  mainArea: { flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#F1F5F9', minWidth: 0 },
  header: {
    backgroundColor: '#FFFFFF', padding: '14px 32px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 50,
  },
  headerTitle: { fontSize: '18px', fontWeight: '700', color: '#1E293B', margin: 0 },
  logoutBtn: {
    backgroundColor: '#FEE2E2', color: '#DC2626', border: 'none', padding: '8px 16px',
    borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
    fontFamily: 'Inter, sans-serif',
  },
  content: { flex: 1, padding: '24px 32px', overflowY: 'auto' },
};

export default App;
