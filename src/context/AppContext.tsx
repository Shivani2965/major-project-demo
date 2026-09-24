import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Ticket,
  TicketStatus,
  TicketPriority,
  TicketCategory,
  KnowledgeArticle,
  CategoryMetadata,
  TimelineEvent,
  TicketComment,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_CATEGORIES,
  INITIAL_KNOWLEDGE_ARTICLES,
  INITIAL_TICKETS,
} from '../data/mockData';
import { aiService } from '../services/aiService';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  currentUser: User | null;
  users: User[];
  tickets: Ticket[];
  categories: CategoryMetadata[];
  knowledgeArticles: KnowledgeArticle[];
  activeTab: string;
  selectedTicketId: string | null;
  selectedArticleId: string | null;
  isTicketCreateModalOpen: boolean;
  preFilledTicketData: Partial<Ticket> | null;
  isTicketConfirmedModalOpen: boolean;
  confirmedTicket: Ticket | null;
  toasts: ToastMessage[];

  // User Actions
  loginAs: (user: User) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;

  // Navigation
  setActiveTab: (tab: string) => void;
  openTicketDetail: (ticketId: string) => void;
  closeTicketDetail: () => void;
  openKnowledgeArticle: (articleId: string) => void;
  closeKnowledgeArticle: () => void;

  // Ticket Operations
  openCreateTicketModal: (preFill?: Partial<Ticket>) => void;
  closeCreateTicketModal: () => void;
  closeConfirmModal: () => void;
  createTicket: (data: {
    title: string;
    description: string;
    category: TicketCategory;
    priority: TicketPriority;
    affectedService?: string;
    troubleshootingAttempted?: string[];
  }) => Ticket;
  updateTicketStatus: (ticketId: string, status: TicketStatus) => void;
  updateTicketPriority: (ticketId: string, priority: TicketPriority) => void;
  updateTicketCategory: (ticketId: string, category: TicketCategory) => void;
  assignTicket: (ticketId: string, agentId: string, agentName: string, team?: string) => void;
  addComment: (ticketId: string, message: string, isInternal?: boolean) => void;
  acceptAiSuggestions: (ticketId: string) => void;

  // Knowledge Base Operations
  rateArticle: (articleId: string, helpful: boolean) => void;
  addKnowledgeArticle: (article: Omit<KnowledgeArticle, 'id' | 'helpfulCount' | 'notHelpfulCount' | 'updatedAt'>) => void;
  updateKnowledgeArticle: (articleId: string, updates: Partial<KnowledgeArticle>) => void;
  deleteKnowledgeArticle: (articleId: string) => void;

  // Admin Operations
  addCategory: (category: Omit<CategoryMetadata, 'id' | 'activeTicketsCount'>) => void;
  updateCategory: (id: string, updates: Partial<CategoryMetadata>) => void;
  deleteCategory: (id: string) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  toggleUserStatus: (userId: string) => void;
  resetDemoData: () => void;

  // Notifications
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER: 'it_helpdesk_current_user',
  USERS: 'it_helpdesk_users',
  TICKETS: 'it_helpdesk_tickets',
  CATEGORIES: 'it_helpdesk_categories',
  KB: 'it_helpdesk_kb',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial data with localStorage fallback
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    // Default logged in user: Employee Priya Sharma
    return INITIAL_USERS[0];
  });

  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_USERS;
  });

  const [tickets, setTickets] = useState<Ticket[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TICKETS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_TICKETS;
  });

  const [categories, setCategories] = useState<CategoryMetadata[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_CATEGORIES;
  });

  const [knowledgeArticles, setKnowledgeArticles] = useState<KnowledgeArticle[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.KB);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_KNOWLEDGE_ARTICLES;
  });

  // UI state
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [isTicketCreateModalOpen, setIsTicketCreateModalOpen] = useState(false);
  const [preFilledTicketData, setPreFilledTicketData] = useState<Partial<Ticket> | null>(null);
  const [isTicketConfirmedModalOpen, setIsTicketConfirmedModalOpen] = useState(false);
  const [confirmedTicket, setConfirmedTicket] = useState<Ticket | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync state to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.KB, JSON.stringify(knowledgeArticles));
  }, [knowledgeArticles]);

  // Toast handler
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Auth
  const loginAs = (user: User) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
    setSelectedTicketId(null);
    setSelectedArticleId(null);
    showToast(`Signed in as ${user.name} (${user.role.toUpperCase()})`, 'success');
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveTab('dashboard');
    setSelectedTicketId(null);
    setSelectedArticleId(null);
    showToast('Signed out of Helpdesk Copilot', 'info');
  };

  const switchRole = (role: UserRole) => {
    const targetUser = users.find(u => u.role === role) || INITIAL_USERS.find(u => u.role === role);
    if (targetUser) {
      loginAs(targetUser);
    }
  };

  // Navigation helpers
  const openTicketDetail = (ticketId: string) => {
    setSelectedTicketId(ticketId);
  };

  const closeTicketDetail = () => {
    setSelectedTicketId(null);
  };

  const openKnowledgeArticle = (articleId: string) => {
    setSelectedArticleId(articleId);
  };

  const closeKnowledgeArticle = () => {
    setSelectedArticleId(null);
  };

  const openCreateTicketModal = (preFill?: Partial<Ticket>) => {
    setPreFilledTicketData(preFill || null);
    setIsTicketCreateModalOpen(true);
  };

  const closeCreateTicketModal = () => {
    setIsTicketCreateModalOpen(false);
    setPreFilledTicketData(null);
  };

  const closeConfirmModal = () => {
    setIsTicketConfirmedModalOpen(false);
  };

  // Ticket Operations
  const createTicket = (data: {
    title: string;
    description: string;
    category: TicketCategory;
    priority: TicketPriority;
    affectedService?: string;
    troubleshootingAttempted?: string[];
  }): Ticket => {
    const randomNum = Math.floor(10485 + Math.random() * 500);
    const newId = `IT-${randomNum}`;
    const now = new Date().toISOString();

    // Map Category to Assigned Team
    const matchedCategory = categories.find(c => c.name === data.category);
    const assignedTeam = matchedCategory ? matchedCategory.assignedTeam : 'General IT Support';

    // Run AI analysis
    const aiAnalysis = aiService.analyzeTicket({
      id: newId,
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      status: 'Open',
      createdBy: currentUser ? currentUser.id : 'emp-01',
      createdByName: currentUser ? currentUser.name : 'Priya Sharma',
      createdByEmail: currentUser ? currentUser.email : 'priya.sharma@example.com',
      department: currentUser ? currentUser.department : 'General Staff',
      assignedTeam,
      affectedService: data.affectedService || `${data.category} Service`,
      troubleshootingAttempted: data.troubleshootingAttempted || [],
      aiSummary: '',
      aiSuggestedCategory: data.category,
      aiSuggestedPriority: data.priority,
      aiSuggestedResolution: '',
      aiConfidence: 0.94,
      similarIssues: [],
      timeline: [],
      comments: [],
      createdAt: now,
      updatedAt: now,
    });

    const initialTimeline: TimelineEvent[] = [
      {
        id: `tl-${Date.now()}-1`,
        type: 'submission',
        title: 'Ticket submitted via AI Helpdesk',
        description: 'Structured ticket generated and submitted with troubleshooting history.',
        actor: currentUser ? currentUser.name : 'Employee',
        actorRole: 'Employee',
        timestamp: now,
      },
      {
        id: `tl-${Date.now()}-2`,
        type: 'ai_summary',
        title: 'AI Intelligence Enriched',
        description: `Classified as ${aiAnalysis.category} (${Math.round(aiAnalysis.confidence * 100)}% confidence). Priority: ${aiAnalysis.priority}.`,
        actor: 'AI Copilot Engine',
        actorRole: 'System',
        timestamp: now,
      },
      {
        id: `tl-${Date.now()}-3`,
        type: 'assignment',
        title: `Routed to ${assignedTeam}`,
        description: 'Auto-routed based on category taxonomy and SLA profile.',
        actor: 'Auto-Routing Engine',
        actorRole: 'System',
        timestamp: now,
      },
    ];

    const newTicket: Ticket = {
      id: newId,
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      status: 'Open',
      createdBy: currentUser ? currentUser.id : 'emp-01',
      createdByName: currentUser ? currentUser.name : 'Priya Sharma',
      createdByEmail: currentUser ? currentUser.email : 'priya.sharma@example.com',
      department: currentUser ? currentUser.department : 'General Staff',
      assignedTeam,
      affectedService: data.affectedService || `${data.category} Service`,
      troubleshootingAttempted: data.troubleshootingAttempted || [],
      aiSummary: aiAnalysis.summary,
      aiSuggestedCategory: aiAnalysis.category,
      aiSuggestedPriority: aiAnalysis.priority,
      aiSuggestedResolution: aiAnalysis.suggestedResolution,
      aiConfidence: aiAnalysis.confidence,
      similarIssues: aiAnalysis.similarIssues,
      timeline: initialTimeline,
      comments: [],
      createdAt: now,
      updatedAt: now,
    };

    setTickets(prev => [newTicket, ...prev]);
    setConfirmedTicket(newTicket);
    setIsTicketConfirmedModalOpen(true);
    closeCreateTicketModal();
    showToast(`Ticket #${newId} created successfully`, 'success');
    return newTicket;
  };

  const updateTicketStatus = (ticketId: string, status: TicketStatus) => {
    const now = new Date().toISOString();
    setTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId) {
          const event: TimelineEvent = {
            id: `tl-${Date.now()}`,
            type: 'status_change',
            title: `Status changed to ${status}`,
            actor: currentUser ? currentUser.name : 'IT Agent',
            actorRole: currentUser?.role === 'agent' ? 'IT Support Agent' : 'User',
            timestamp: now,
          };
          return {
            ...t,
            status,
            updatedAt: now,
            resolvedAt: status === 'Resolved' || status === 'Closed' ? now : t.resolvedAt,
            timeline: [...t.timeline, event],
          };
        }
        return t;
      })
    );
    showToast(`Ticket ${ticketId} status updated to ${status}`, 'success');
  };

  const updateTicketPriority = (ticketId: string, priority: TicketPriority) => {
    const now = new Date().toISOString();
    setTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId) {
          const event: TimelineEvent = {
            id: `tl-${Date.now()}`,
            type: 'priority_change',
            title: `Priority updated to ${priority}`,
            actor: currentUser ? currentUser.name : 'IT Agent',
            actorRole: 'IT Support Agent',
            timestamp: now,
          };
          return {
            ...t,
            priority,
            updatedAt: now,
            timeline: [...t.timeline, event],
          };
        }
        return t;
      })
    );
    showToast(`Ticket ${ticketId} priority set to ${priority}`, 'info');
  };

  const updateTicketCategory = (ticketId: string, category: TicketCategory) => {
    const now = new Date().toISOString();
    const matchedCategory = categories.find(c => c.name === category);
    const assignedTeam = matchedCategory ? matchedCategory.assignedTeam : 'General IT Support';

    setTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId) {
          const event: TimelineEvent = {
            id: `tl-${Date.now()}`,
            type: 'category_change',
            title: `Category changed to ${category}`,
            description: `Reassigned team to ${assignedTeam}`,
            actor: currentUser ? currentUser.name : 'IT Agent',
            actorRole: 'IT Support Agent',
            timestamp: now,
          };
          return {
            ...t,
            category,
            assignedTeam,
            updatedAt: now,
            timeline: [...t.timeline, event],
          };
        }
        return t;
      })
    );
    showToast(`Ticket ${ticketId} category updated to ${category}`, 'info');
  };

  const assignTicket = (ticketId: string, agentId: string, agentName: string, team?: string) => {
    const now = new Date().toISOString();
    setTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId) {
          const event: TimelineEvent = {
            id: `tl-${Date.now()}`,
            type: 'assignment',
            title: `Assigned to ${agentName}`,
            description: team ? `Assigned to team ${team}` : undefined,
            actor: currentUser ? currentUser.name : 'System',
            actorRole: currentUser?.role === 'admin' ? 'Administrator' : 'IT Support Agent',
            timestamp: now,
          };
          return {
            ...t,
            assignedTo: agentId,
            assignedToName: agentName,
            assignedTeam: team || t.assignedTeam,
            status: t.status === 'Open' ? 'In Progress' : t.status,
            updatedAt: now,
            timeline: [...t.timeline, event],
          };
        }
        return t;
      })
    );
    showToast(`Ticket ${ticketId} assigned to ${agentName}`, 'success');
  };

  const addComment = (ticketId: string, message: string, isInternal = false) => {
    const now = new Date().toISOString();
    const newComment: TicketComment = {
      id: `cm-${Date.now()}`,
      ticketId,
      userId: currentUser ? currentUser.id : 'unknown',
      userName: currentUser ? currentUser.name : 'IT Staff',
      userRole: currentUser ? currentUser.role : 'agent',
      message,
      isInternal,
      createdAt: now,
    };

    const event: TimelineEvent = {
      id: `tl-${Date.now()}`,
      type: 'comment',
      title: isInternal ? 'Internal agent note added' : 'Comment added',
      actor: currentUser ? currentUser.name : 'IT Staff',
      actorRole: currentUser?.role === 'agent' ? 'IT Support Agent' : currentUser?.role === 'admin' ? 'Administrator' : 'Employee',
      timestamp: now,
    };

    setTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId) {
          return {
            ...t,
            comments: [...t.comments, newComment],
            updatedAt: now,
            timeline: [...t.timeline, event],
          };
        }
        return t;
      })
    );
    showToast('Comment posted', 'info');
  };

  const acceptAiSuggestions = (ticketId: string) => {
    const now = new Date().toISOString();
    setTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId) {
          const matchedCategory = categories.find(c => c.name === t.aiSuggestedCategory);
          const assignedTeam = matchedCategory ? matchedCategory.assignedTeam : t.assignedTeam;

          const event: TimelineEvent = {
            id: `tl-${Date.now()}`,
            type: 'category_change',
            title: 'Accepted AI Suggestions',
            description: `Applied category ${t.aiSuggestedCategory} and priority ${t.aiSuggestedPriority}.`,
            actor: currentUser ? currentUser.name : 'IT Agent',
            actorRole: 'IT Support Agent',
            timestamp: now,
          };

          return {
            ...t,
            category: t.aiSuggestedCategory,
            priority: t.aiSuggestedPriority,
            assignedTeam,
            updatedAt: now,
            timeline: [...t.timeline, event],
          };
        }
        return t;
      })
    );
    showToast('AI category and priority applied to ticket', 'success');
  };

  // Knowledge Base
  const rateArticle = (articleId: string, helpful: boolean) => {
    setKnowledgeArticles(prev =>
      prev.map(a => {
        if (a.id === articleId) {
          return {
            ...a,
            helpfulCount: helpful ? a.helpfulCount + 1 : a.helpfulCount,
            notHelpfulCount: !helpful ? a.notHelpfulCount + 1 : a.notHelpfulCount,
          };
        }
        return a;
      })
    );
    showToast(helpful ? 'Thank you! Marked as helpful.' : 'Feedback recorded. IT team will update this article.', 'info');
  };

  const addKnowledgeArticle = (article: Omit<KnowledgeArticle, 'id' | 'helpfulCount' | 'notHelpfulCount' | 'updatedAt'>) => {
    const newArticle: KnowledgeArticle = {
      ...article,
      id: `kb-${Math.floor(100 + Math.random() * 900)}`,
      helpfulCount: 0,
      notHelpfulCount: 0,
      updatedAt: new Date().toISOString(),
    };
    setKnowledgeArticles(prev => [newArticle, ...prev]);
    showToast('Knowledge article created', 'success');
  };

  const updateKnowledgeArticle = (articleId: string, updates: Partial<KnowledgeArticle>) => {
    setKnowledgeArticles(prev =>
      prev.map(a => (a.id === articleId ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a))
    );
    showToast('Knowledge article updated', 'success');
  };

  const deleteKnowledgeArticle = (articleId: string) => {
    setKnowledgeArticles(prev => prev.filter(a => a.id !== articleId));
    if (selectedArticleId === articleId) {
      setSelectedArticleId(null);
    }
    showToast('Knowledge article removed', 'info');
  };

  // Category
  const addCategory = (category: Omit<CategoryMetadata, 'id' | 'activeTicketsCount'>) => {
    const newCat: CategoryMetadata = {
      ...category,
      id: `cat-${category.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      activeTicketsCount: 0,
    };
    setCategories(prev => [...prev, newCat]);
    showToast(`Category "${category.name}" added`, 'success');
  };

  const updateCategory = (id: string, updates: Partial<CategoryMetadata>) => {
    setCategories(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
    showToast('Category updated', 'success');
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    showToast('Category deleted', 'info');
  };

  // Users
  const updateUser = (userId: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => (u.id === userId ? { ...u, ...updates } : u)));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => (prev ? { ...prev, ...updates } : null));
    }
    showToast('User record updated', 'success');
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const newStatus = u.status === 'active' ? 'inactive' : 'active';
          showToast(`User ${u.name} set to ${newStatus}`, 'info');
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.TICKETS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.KB);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);

    setUsers(INITIAL_USERS);
    setTickets(INITIAL_TICKETS);
    setCategories(INITIAL_CATEGORIES);
    setKnowledgeArticles(INITIAL_KNOWLEDGE_ARTICLES);
    setCurrentUser(INITIAL_USERS[0]);
    setSelectedTicketId(null);
    setSelectedArticleId(null);
    setActiveTab('dashboard');
    showToast('Demo data restored to initial state', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        tickets,
        categories,
        knowledgeArticles,
        activeTab,
        selectedTicketId,
        selectedArticleId,
        isTicketCreateModalOpen,
        preFilledTicketData,
        isTicketConfirmedModalOpen,
        confirmedTicket,
        toasts,
        loginAs,
        logout,
        switchRole,
        setActiveTab,
        openTicketDetail,
        closeTicketDetail,
        openKnowledgeArticle,
        closeKnowledgeArticle,
        openCreateTicketModal,
        closeCreateTicketModal,
        closeConfirmModal,
        createTicket,
        updateTicketStatus,
        updateTicketPriority,
        updateTicketCategory,
        assignTicket,
        addComment,
        acceptAiSuggestions,
        rateArticle,
        addKnowledgeArticle,
        updateKnowledgeArticle,
        deleteKnowledgeArticle,
        addCategory,
        updateCategory,
        deleteCategory,
        updateUser,
        toggleUserStatus,
        resetDemoData,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
