// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'agent' | 'manager' | 'admin';
  phone: string;
  createdAt: string;
}

// Lead Types
export type LeadTemperature = 'hot' | 'warm' | 'cold';

export interface Lead {
  id: string;
  name: string;
  age: number;
  email: string;
  phone: string;
  location: string;
  address: string;
  temperature: LeadTemperature;
  tags: string[];
  productInterest: string[];
  premium: number;
  policyNumber?: string;
  conversionProbability: number;
  lastInteractionSummary: string;
  lastInteractionDate: string;
  assignedTo: string;
  lat: number;
  lng: number;
  avatarUrl?: string;
}

export interface LeadSummary {
  id: string;
  name: string;
  temperature: LeadTemperature;
  lastInteraction: string;
}

export interface LeadLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  temperature: LeadTemperature;
}

// Interaction Types
export type InteractionType = 'call' | 'message' | 'meeting' | 'email';

export interface Interaction {
  id: string;
  leadId: string;
  userId: string;
  type: InteractionType;
  summary: string;
  transcript: string | null;
  sentiment: number;
  duration: number | null;
  createdAt: string;
}

export interface SentimentDataPoint {
  date: string;
  score: number; // -1 to 1
  label: string;
}

// Template Types
export type TemplateChannel = 'whatsapp' | 'sms' | 'email';

export interface MessageTemplate {
  id: string;
  name: string;
  category: string;
  content: string;
  channel: TemplateChannel;
  dynamicFields: string[];
  isApproved: boolean;
}

// AI Types
export type ActionDifficulty = 'easy' | 'medium' | 'hard';

export interface NextBestAction {
  id: string;
  title: string;
  steps: string[];
  reasoning: string;
  confidence: number;
  difficulty: ActionDifficulty;
  signals: string[];
}

export interface PredictedObjection {
  id: string;
  text: string;
  probability: number;
  safeResponse: string;
  signals: string[];
}

// Compliance Types
export type ComplianceSeverity = 'error' | 'warning';

export interface ComplianceViolation {
  phrase: string;
  rule: string;
  severity: ComplianceSeverity;
  suggestion: string;
}

// AutoPilot Types
export type QueuedActionType = 'crm_update' | 'message' | 'reminder' | 'tag';
export type ComplianceStatus = 'safe' | 'flagged' | 'blocked';

export interface QueuedAction {
  id: string;
  leadId: string;
  leadName: string;
  type: QueuedActionType;
  description: string;
  changes: Record<string, any>;
  confidence: number;
  complianceStatus: ComplianceStatus;
  requiresApproval: boolean;
  timestamp: string;
}

export interface AutoPilotSettings {
  autoApplyCRMUpdates: boolean;
  autoSendMessages: boolean;
  autoOpenProfiles: boolean;
  timeboxMinutes: number;
  confidenceThreshold: number;
}

// Audit Types
export type AuditActionType = 'update_lead' | 'send_message' | 'create_lead';
export type AuditEntityType = 'lead' | 'interaction' | 'template';
export type AuditSource = 'manual' | 'autopilot' | 'ai';
export type UserDecision = 'applied' | 'edited' | 'skipped';

export interface AuditLog {
  id: string;
  userId: string;
  actionType: AuditActionType;
  entityType: AuditEntityType;
  entityId: string;
  changes: Record<string, any>;
  source: AuditSource;
  aiConfidence: number | null;
  aiReasoning: string | null;
  userDecision: UserDecision;
  complianceStatus: ComplianceStatus;
  createdAt: string;
}

// Briefing Types
export type BriefingPriority = 'high' | 'medium' | 'low';

export interface BriefingItem {
  id: string;
  text: string;
  priority: BriefingPriority;
  action: () => void;
}

// Command Types
export type CommandCategory = 'navigation' | 'action' | 'search';

export interface CommandSuggestion {
  id: string;
  text: string;
  icon: string;
  action: () => void;
  category: CommandCategory;
}

// Context Panel Types
export type ContextSectionType = 'nextAction' | 'objections' | 'templates' | 'compliance' | 'documents';

export interface ContextSection {
  type: ContextSectionType;
  data: any;
  isLoading: boolean;
}

// Maps Types
export interface MapFilter {
  nearMe: boolean;
  radius: number; // in minutes
  followUpPending: boolean;
  highValue: boolean;
}

export interface Cluster {
  lat: number;
  lng: number;
  count: number;
  leadIds: string[];
}

export interface Waypoint {
  leadId: string;
  leadName: string;
  order: number;
  estimatedArrival: string;
}

export interface OptimizedRoute {
  waypoints: Waypoint[];
  totalDistance: number;
  totalTime: number;
  path: any[]; // google.maps.LatLng[] in actual implementation
}

// Voice Assistant Types
export type VoiceLanguage = 'en' | 'hi' | 'mr' | 'ta';

// Lead Action Types
export type LeadActionType = 'call' | 'whatsapp' | 'message' | 'update';

export interface LeadAction {
  type: LeadActionType;
  payload: any;
}
