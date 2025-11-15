import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

export interface Lead {
  id: string;
  name: string;
  age: number;
  email: string;
  phone: string;
  location: string;
  temperature: 'hot' | 'warm' | 'cold';
  tags: string[];
  productInterest: string[];
  premium: number;
  conversionProbability: number;
  lastInteractionSummary: string;
  lastInteractionDate: string;
}

export function useLeads(filter?: string, search?: string) {
  return useQuery({
    queryKey: ['leads', filter, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filter) params.append('filter', filter);
      if (search) params.append('search', search);
      
      const response = await api.get(`/leads?${params.toString()}`);
      return response.data;
    },
    staleTime: 30000, // 30 seconds
  });
}

export function useLead(leadId: string) {
  return useQuery({
    queryKey: ['lead', leadId],
    queryFn: async () => {
      const response = await api.get(`/leads/${leadId}`);
      return response.data;
    },
    enabled: !!leadId,
    staleTime: 30000,
  });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ leadId, fields, auditInfo }: any) => {
      const response = await api.patch(`/leads/${leadId}`, { fields, auditInfo });
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['lead', variables.leadId] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (leadData: any) => {
      const response = await api.post('/leads', leadData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}
