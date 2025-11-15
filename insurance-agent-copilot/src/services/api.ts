import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// AI Services - Single Agent
export const aiService = {
  // Main agent endpoint - handles all AI requests
  sendMessage: async (message: string, context?: any) => {
    const response = await apiClient.post('/agent', { message, context });
    return response.data;
  },
};

// Compliance Services
export const complianceService = {
  validate: async (content: string, type: string, context?: any) => {
    const response = await apiClient.post('/compliance/validate', { content, type, context });
    return response.data;
  },
};

// Lead Services
export const leadService = {
  getAll: async (filter?: string, search?: string, limit?: number, offset?: number) => {
    const response = await apiClient.get('/leads', {
      params: { filter, search, limit, offset },
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/leads/${id}`);
    return response.data;
  },

  update: async (id: string, fields: any, auditInfo: any) => {
    const response = await apiClient.patch(`/leads/${id}`, { fields, auditInfo });
    return response.data;
  },

  create: async (data: any) => {
    const response = await apiClient.post('/leads', data);
    return response.data;
  },
};

// Template Services
export const templateService = {
  getAll: async () => {
    const response = await apiClient.get('/templates');
    return response.data;
  },
};

// Interaction Services
export const interactionService = {
  getAll: async (leadId?: string) => {
    const response = await apiClient.get('/interactions', {
      params: { leadId },
    });
    return response.data;
  },
};

export default apiClient;
