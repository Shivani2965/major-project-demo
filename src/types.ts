/**
 * AI IT Helpdesk Copilot — Data Types
 * Enterprise Helpdesk & Smart Ticketing Solution
 */

export type UserRole = 'employee' | 'agent' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: 'active' | 'inactive';
  avatar?: string;
  phone?: string;
  location?: string;
  employeeId: string;
}

export type TicketStatus = 'Open' | 'In Progress' | 'Waiting for User' | 'Resolved' | 'Closed';

export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export type TicketCategory =
  | 'Network'
  | 'VPN'
  | 'Hardware'
  | 'Software'
  | 'Email'
  | 'Account & Password'
  | 'Printer'
  | 'Security'
  | 'Other';

export interface SimilarIssue {
  ticketId: string;
  title: string;
  similarity: number;
  resolution: string;
}

export interface TimelineEvent {
  id: string;
  type:
    | 'submission'
    | 'ai_summary'
    | 'assignment'
    | 'comment'
    | 'status_change'
    | 'priority_change'
    | 'category_change'
    | 'escalation'
    | 'resolution';
  title: string;
  description?: string;
  actor: string;
  actorRole?: string;
  timestamp: string;
}

export interface TicketComment {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  message: string;
  isInternal?: boolean;
  createdAt: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  createdBy: string;
  createdByName: string;
  createdByEmail: string;
  department: string;
  assignedTo?: string;
  assignedToName?: string;
  assignedTeam: string;
  affectedService?: string;
  troubleshootingAttempted?: string[];
  aiSummary: string;
  aiSuggestedCategory: TicketCategory;
  aiSuggestedPriority: TicketPriority;
  aiSuggestedResolution: string;
  aiConfidence: number;
  similarIssues: SimilarIssue[];
  timeline: TimelineEvent[];
  comments: TicketComment[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: TicketCategory;
  description: string;
  problem: string;
  possibleCauses: string[];
  troubleshootingSteps: string[];
  whenToContactIT: string;
  tags: string[];
  author: string;
  authorTeam: string;
  readTimeMinutes: number;
  helpfulCount: number;
  notHelpfulCount: number;
  status: 'published' | 'draft';
  updatedAt: string;
}

export interface CategoryMetadata {
  id: string;
  name: TicketCategory;
  description: string;
  assignedTeam: string;
  defaultSlaHours: number;
  activeTicketsCount: number;
  iconName: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
  detectedCategory?: TicketCategory;
  detectedPriority?: TicketPriority;
  troubleshootingSteps?: string[];
  isResolutionPrompt?: boolean;
  isTicketPreFillPrompt?: boolean;
  draftTicketData?: Partial<Ticket>;
}
