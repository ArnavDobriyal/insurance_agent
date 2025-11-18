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

// AI Services - Root Agent with all tools
export const aiService = {
  // Main agent endpoint - handles all AI requests through Root Agent
  sendMessage: async (message: string, context?: any) => {
    const response = await apiClient.post('/agent', { message, context });
    return response.data;
  },
  
  // Streaming endpoint for real-time responses
  sendMessageStream: async (message: string, context?: any) => {
    const response = await apiClient.post('/agent/stream', { message, context });
    return response.data;
  },
};

// Lead Management Services - All lead tools
export const leadService = {
  // Basic lead operations
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

  // Advanced lead filtering (via AI agent)
  getHotLeads: async () => {
    return aiService.sendMessage("Show me all hot leads");
  },

  getRenewalLeads: async () => {
    return aiService.sendMessage("Show me leads with renewals due");
  },

  getFollowupLeads: async () => {
    return aiService.sendMessage("Show me leads needing follow-up");
  },

  getHighValueLeads: async () => {
    return aiService.sendMessage("Show me high-value leads");
  },

  getLeadsByLocation: async (location: string) => {
    return aiService.sendMessage(`Show me leads in ${location}`);
  },

  getLeadsWithPolicy: async () => {
    return aiService.sendMessage("Show me leads with existing policies");
  },

  // Lead interactions
  getInteractions: async (leadId: string) => {
    return aiService.sendMessage(`Get interactions for lead ${leadId}`);
  },

  addInteraction: async (leadId: string, interaction: any) => {
    return aiService.sendMessage(`Add interaction for lead ${leadId}: ${JSON.stringify(interaction)}`);
  },

  analyzeSentiment: async (leadId: string) => {
    return aiService.sendMessage(`Analyze sentiment for lead ${leadId}`);
  },

  // Policy operations
  uploadPolicyDocument: async (leadId: string, document: any) => {
    return aiService.sendMessage(`Upload policy document for lead ${leadId}: ${JSON.stringify(document)}`);
  },

  getPolicies: async (leadId: string) => {
    return aiService.sendMessage(`Get policies for lead ${leadId}`);
  },
};

// Task Management Services - All task tools
export const taskService = {
  getAll: async (status?: string, priority?: string) => {
    let query = "Show me all tasks";
    if (status) query += ` with status ${status}`;
    if (priority) query += ` with priority ${priority}`;
    return aiService.sendMessage(query);
  },

  getById: async (taskId: string) => {
    return aiService.sendMessage(`Get task ${taskId}`);
  },

  getByLead: async (leadId: string) => {
    return aiService.sendMessage(`Get tasks for lead ${leadId}`);
  },

  getDueToday: async () => {
    return aiService.sendMessage("Show me tasks due today");
  },

  getOverdue: async () => {
    return aiService.sendMessage("Show me overdue tasks");
  },

  getUrgent: async () => {
    return aiService.sendMessage("Show me urgent tasks");
  },

  create: async (taskData: any) => {
    return aiService.sendMessage(`Create task: ${JSON.stringify(taskData)}`);
  },

  createFromActionItems: async () => {
    return aiService.sendMessage("Create tasks from action items");
  },

  search: async (searchTerm: string) => {
    return aiService.sendMessage(`Search tasks for: ${searchTerm}`);
  },
};

// Communication Services - All communication tools
export const communicationService = {
  sendMessage: async (leadId: string, messageType: string, content?: string) => {
    let query = `Send ${messageType} to lead ${leadId}`;
    if (content) query += ` with content: ${content}`;
    return aiService.sendMessage(query);
  },

  confirmSendMessage: async (leadId: string, messageType: string) => {
    return aiService.sendMessage(`Confirm send ${messageType} to lead ${leadId}`);
  },

  callLead: async (leadId: string) => {
    return aiService.sendMessage(`Call lead ${leadId}`);
  },

  scheduleMeeting: async (leadId: string, date?: string) => {
    let query = `Schedule meeting with lead ${leadId}`;
    if (date) query += ` on ${date}`;
    return aiService.sendMessage(query);
  },

  sendTemplate: async (leadId: string, templateId: string) => {
    return aiService.sendMessage(`Send template ${templateId} to lead ${leadId}`);
  },

  openMaps: async (leadId: string) => {
    return aiService.sendMessage(`Show location for lead ${leadId}`);
  },
};

// Template Services - All template tools
export const templateService = {
  getAll: async () => {
    const response = await apiClient.get('/templates');
    return response.data;
  },

  getById: async (templateId: string) => {
    return aiService.sendMessage(`Get template ${templateId}`);
  },

  search: async (category?: string, keyword?: string) => {
    let query = "Search templates";
    if (category) query += ` in category ${category}`;
    if (keyword) query += ` for keyword ${keyword}`;
    return aiService.sendMessage(query);
  },
};

// Analytics Services - All analytics tools
export const analyticsService = {
  getConversionStats: async () => {
    return aiService.sendMessage("Show conversion statistics");
  },

  getRevenueForecast: async () => {
    return aiService.sendMessage("Generate revenue forecast");
  },

  getLeadDistribution: async () => {
    return aiService.sendMessage("Show lead distribution");
  },

  getTopLeads: async (limit?: number) => {
    let query = "Show top leads";
    if (limit) query += ` limit ${limit}`;
    return aiService.sendMessage(query);
  },

  getPerformanceMetrics: async () => {
    return aiService.sendMessage("Show performance metrics");
  },

  getDailySummary: async () => {
    return aiService.sendMessage("Generate daily summary");
  },

  getTodaysBriefing: async () => {
    return aiService.sendMessage("Give me today's briefing");
  },
};

// Notification Services - All notification tools
export const notificationService = {
  getAll: async (filterType?: string) => {
    let query = "Show me notifications";
    if (filterType) query += ` filtered by ${filterType}`;
    return aiService.sendMessage(query);
  },

  getUnread: async () => {
    return aiService.sendMessage("Show me unread notifications");
  },

  getUnreadCount: async () => {
    return aiService.sendMessage("Get unread notification count");
  },

  getHighPriority: async () => {
    return aiService.sendMessage("Show me high priority notifications");
  },
};

// Compliance Services - All compliance tools
export const complianceService = {
  validate: async (content: string, type?: string, context?: any) => {
    const response = await apiClient.post('/compliance/validate', { content, type, context });
    return response.data;
  },

  checkCompliance: async (content: string) => {
    return aiService.sendMessage(`Check if this is compliant: ${content}`);
  },

  getSafeAlternative: async (content: string) => {
    return aiService.sendMessage(`Get safe alternative for: ${content}`);
  },
};

// Audit Services - All audit tools
export const auditService = {
  getAllLogs: async (limit?: number) => {
    let query = "Show audit logs";
    if (limit) query += ` limit ${limit}`;
    return aiService.sendMessage(query);
  },

  getLogsByLead: async (leadId: string) => {
    return aiService.sendMessage(`Show audit logs for lead ${leadId}`);
  },

  getLogsByAction: async (actionType: string) => {
    return aiService.sendMessage(`Show audit logs for action ${actionType}`);
  },
};

// Utility Services - All utility tools
export const utilityService = {
  formatData: async (data: any, formatType?: string) => {
    return aiService.sendMessage(`Format this data: ${JSON.stringify(data)} as ${formatType || 'auto'}`);
  },

  summarizeContent: async (content: string, summaryType?: string) => {
    return aiService.sendMessage(`Summarize this content as ${summaryType || 'brief'}: ${content}`);
  },
};

// UI Action Services - All UI helper tools
export const uiService = {
  showCreateLeadForm: async (prefilledData?: any) => {
    let query = "Show create lead form";
    if (prefilledData) query += ` with data: ${JSON.stringify(prefilledData)}`;
    return aiService.sendMessage(query);
  },

  showCreateTaskForm: async (leadId?: string, leadName?: string) => {
    let query = "Show create task form";
    if (leadId) query += ` for lead ${leadId}`;
    if (leadName) query += ` (${leadName})`;
    return aiService.sendMessage(query);
  },

  showEditLeadForm: async (leadId: string, leadData: any) => {
    return aiService.sendMessage(`Show edit form for lead ${leadId} with data: ${JSON.stringify(leadData)}`);
  },

  openLeadProfile: async (leadId: string) => {
    return aiService.sendMessage(`Open profile for lead ${leadId}`);
  },
};

export default apiClient;
