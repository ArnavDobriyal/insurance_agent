import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../services/api';

export function useNextAction(leadId: string, context: any) {
  return useQuery({
    queryKey: ['nextAction', leadId, context],
    queryFn: async () => {
      const response = await api.post('/agent', { 
        message: `What is the next best action for lead ${leadId}? Provide a specific, actionable recommendation.`,
        context: { leadId, ...context }
      });
      return { action: response.data.response, priority: 'high', confidence: 0.85 };
    },
    enabled: !!leadId,
    staleTime: 60000, // 1 minute
  });
}

export function useObjections(leadId: string, productType: string) {
  return useQuery({
    queryKey: ['objections', leadId, productType],
    queryFn: async () => {
      const response = await api.post('/agent', { 
        message: `For lead ${leadId} interested in ${productType}, predict 3 likely objections they might have and provide responses for each.`,
        context: { leadId, productType }
      });
      return { objections: response.data.response, productType };
    },
    enabled: !!leadId && !!productType,
    staleTime: 60000,
  });
}

export function useTemplates() {
  return useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      const response = await api.get('/templates');
      return response.data;
    },
    staleTime: 300000, // 5 minutes
  });
}

export function useFillTemplate() {
  return useMutation({
    mutationFn: async ({ templateId, leadData }: any) => {
      const response = await api.post('/agent', { 
        message: `Fill template ${templateId} with this lead data. Return only the filled template content.`,
        context: { templateId, leadData }
      });
      return { filledContent: response.data.response, templateId };
    },
  });
}

export function useIntentDetection() {
  return useMutation({
    mutationFn: async ({ text, context }: any) => {
      const response = await api.post('/agent', { 
        message: `Extract the intent from this text and return a JSON with 'intent', 'action', and 'entities': "${text}"`,
        context
      });
      return { intent: response.data.response, confidence: 0.9 };
    },
  });
}

export function useSummarize() {
  return useMutation({
    mutationFn: async ({ type, content, leadId, period }: any) => {
      let message = `Summarize this ${type}: ${content}`;
      if (leadId) message += ` for lead ${leadId}`;
      if (period) message += ` for period ${period}`;
      
      const response = await api.post('/agent', { 
        message,
        context: { type, leadId, period }
      });
      return { summary: response.data.response };
    },
  });
}

export function useValidateCompliance() {
  return useMutation({
    mutationFn: async ({ content, type, context }: any) => {
      const response = await api.post('/compliance/validate', { content, type, context });
      return response.data;
    },
  });
}
