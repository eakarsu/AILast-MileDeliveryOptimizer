import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3601/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = (email, password) => api.post('/auth/login', { email, password });
export const register = (data) => api.post('/auth/register', data);

// Dashboard
export const getDashboard = () => api.get('/dashboard');

// Generic CRUD factory
const createCRUD = (resource) => ({
  getAll: (params) => api.get(`/${resource}`, { params }),
  getById: (id) => api.get(`/${resource}/${id}`),
  create: (data) => api.post(`/${resource}`, data),
  update: (id, data) => api.put(`/${resource}/${id}`, data),
  delete: (id) => api.delete(`/${resource}/${id}`),
});

// Entity APIs
export const deliveriesAPI = createCRUD('deliveries');
export const driversAPI = createCRUD('drivers');
export const vehiclesAPI = createCRUD('vehicles');
export const customersAPI = createCRUD('customers');
export const warehousesAPI = createCRUD('warehouses');
export const zonesAPI = createCRUD('zones');
export const packagesAPI = createCRUD('packages');
export const routesAPI = createCRUD('routes');
export const incidentsAPI = createCRUD('incidents');
export const slasAPI = createCRUD('slas');
export const performanceAPI = createCRUD('performance');
export const costAnalysisAPI = createCRUD('cost-analysis');
export const demandForecastAPI = createCRUD('demand-forecasts');

// AI APIs
export const optimizeRoute = (data) => api.post('/ai/optimize-route', data);
export const predictDeliveryTime = (data) => api.post('/ai/predict-delivery-time', data);
export const forecastDemand = (data) => api.post('/ai/forecast-demand', data);
export const analyzeCosts = (data) => api.post('/ai/analyze-costs', data);
export const suggestImprovements = (data) => api.post('/ai/suggest-improvements', data);
export const analyzeIncident = (data) => api.post('/ai/analyze-incident', data);
export const optimizeFleet = (data) => api.post('/ai/optimize-fleet', data);
export const predictPerformance = (data) => api.post('/ai/predict-performance', data);
export const predictSLABreach = (data) => api.post('/ai/sla-breach-predictor', data);
export const matchDriverRoute = (data) => api.post('/ai/driver-route-match', data);

export default api;
