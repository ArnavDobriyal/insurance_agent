import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

export function useAutoPilotSession(sessionId: string) {
  return useQuery({
    queryKey: ['autopilot', 'session', sessionId],
    queryFn: async () => {
      const response = await api.get(`/autopilot/status?sessionId=${sessionId}`);
      return response.data;
    },
    enabled: !!sessionId,
    refetchInterval: 3000, // Poll every 3 seconds
  });
}

export function useAutoPilotQueue(sessionId: string) {
  return useQuery({
    queryKey: ['autopilot', 'queue', sessionId],
    queryFn: async () => {
      const response = await api.get(`/autopilot/queue?sessionId=${sessionId}`);
      return response.data;
    },
    enabled: !!sessionId,
    refetchInterval: 3000,
  });
}

export function useStartAutoPilot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, settings, leads }: any) => {
      const response = await api.post('/autopilot/start', { userId, settings, leads });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['autopilot', 'session', data.sessionId], data.session);
    },
  });
}

export function usePauseAutoPilot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await api.post('/autopilot/pause', { sessionId });
      return response.data;
    },
    onSuccess: (data, sessionId) => {
      queryClient.invalidateQueries({ queryKey: ['autopilot', 'session', sessionId] });
    },
  });
}

export function useResumeAutoPilot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await api.post('/autopilot/resume', { sessionId });
      return response.data;
    },
    onSuccess: (data, sessionId) => {
      queryClient.invalidateQueries({ queryKey: ['autopilot', 'session', sessionId] });
    },
  });
}

export function useAbortAutoPilot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await api.post('/autopilot/abort', { sessionId });
      return response.data;
    },
    onSuccess: (data, sessionId) => {
      queryClient.invalidateQueries({ queryKey: ['autopilot', 'session', sessionId] });
    },
  });
}

export function useApplyAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ actionId, modifications }: any) => {
      const response = await api.post(`/autopilot/action/${actionId}/apply`, { modifications });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['autopilot', 'queue'] });
    },
  });
}

export function useSkipAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ actionId, reason }: any) => {
      const response = await api.post(`/autopilot/action/${actionId}/skip`, { reason });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['autopilot', 'queue'] });
    },
  });
}

export function useAuditLog(filters?: any) {
  return useQuery({
    queryKey: ['autopilot', 'audit', filters],
    queryFn: async () => {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/autopilot/audit?${params.toString()}`);
      return response.data;
    },
    staleTime: 30000,
  });
}
