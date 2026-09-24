import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Bot,
  Ticket as TicketIcon,
  BookOpen,
  User as UserIcon,
  BarChart3,
  Users,
  FolderTree,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Headphones,
  FileQuestion,
  Layers,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggleCollapse }) => {
  const { currentUser, activeTab, setActiveTab, tickets, closeTicketDetail, closeKnowledgeArticle } = useApp();

  if (!currentUser) return null;

  // Calculate badge counts
  const openEmployeeTickets = tickets.filter(t => t.createdBy === currentUser.id && (t.status === 'Open' || t.status === 'In Progress')).length;
  const queueCount = tickets.filter(t => t.status === 'Open').length;
  const agentMyTickets = tickets.filter(t => t.assignedTo === currentUser.id && t.status !== 'Closed').length;

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    closeTicketDetail();
    closeKnowledgeArticle();
  };

  // Build menu items based on role
  const getNavItems = () => {
    if (currentUser.role === 'employee') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'ai-helpdesk', label: 'AI Helpdesk', icon: Bot, highlight: true },
        { id: 'my-tickets', label: 'My Tickets', icon: TicketIcon, count: openEmployeeTickets },
        { id: 'knowledge-base', label: 'Knowledge Base', icon: BookOpen },
        { id: 'profile', label: 'Profile', icon: UserIcon },
      ];
    } else if (currentUser.role === 'agent') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'ticket-queue', label: 'Ticket Queue', icon: Layers, count: queueCount },
        { id: 'my-tickets', label: 'My Tickets', icon: TicketIcon, count: agentMyTickets },
        { id: 'knowledge-base', label: 'Knowledge Base', icon: BookOpen },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'profile', label: 'Profile', icon: UserIcon },
      ];
    } else {
      // admin
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'all-tickets', label: 'All Tickets', icon: TicketIcon, count: tickets.length },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'knowledge-base', label: 'Knowledge Base', icon: BookOpen },
        { id: 'categories', label: 'Categories', icon: FolderTree },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'settings', label: 'Settings', icon: Settings },
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside
      className={`relative bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-all duration-300 z-30 shrink-0 ${
        collapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Brand Zone */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
            PG
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-white tracking-tight text-sm truncate">
                AI Helpdesk Copilot
              </span>
              <span className="text-[11px] text-slate-400 font-mono tracking-wider truncate">
                SIH25195 · POWERGRID
              </span>
            </div>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          className="text-slate-400 hover:text-white p-1.5 rounded-md hover:bg-slate-800 transition-colors hidden md:block"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Role Pill Indicator in Sidebar */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-slate-800/50 bg-slate-950/40">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Workspace Role</span>
            <span
              className={`font-semibold uppercase tracking-wider px-2 py-0.5 rounded text-[10px] ${
                currentUser.role === 'admin'
                  ? 'bg-rose-950 text-rose-300 border border-rose-800/50'
                  : currentUser.role === 'agent'
                  ? 'bg-amber-950 text-amber-300 border border-amber-800/50'
                  : 'bg-blue-950 text-blue-300 border border-blue-800/50'
              }`}
            >
              {currentUser.role}
            </span>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              } ${item.highlight && !isActive ? 'border border-blue-500/30 bg-blue-950/30 text-blue-200' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : item.highlight ? 'text-blue-400' : 'text-slate-400'}`} />
              
              {!collapsed && (
                <span className="flex-1 text-left truncate">{item.label}</span>
              )}

              {!collapsed && typeof item.count === 'number' && item.count > 0 && (
                <span
                  className={`text-xs px-2 py-0.5 rounded font-mono tabular-nums font-semibold ${
                    isActive ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Self-Service Prompt / Helper Box */}
      {!collapsed && currentUser.role === 'employee' && (
        <div className="p-3 mx-3 mb-3 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs">
          <div className="flex items-center gap-2 text-blue-400 font-semibold mb-1">
            <Headphones className="w-3.5 h-3.5" />
            <span>24/7 IT Helpline</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Need urgent assistance? Dial <span className="text-white font-mono font-medium">ext. 4455</span> or start an AI diagnostic chat.
          </p>
        </div>
      )}

      {/* User Footer Profile */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-700 text-white font-semibold flex items-center justify-center text-xs shrink-0 border border-slate-600">
            {currentUser.name
              .split(' ')
              .map(n => n[0])
              .join('')}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{currentUser.name}</p>
              <p className="text-[11px] text-slate-400 truncate">{currentUser.department}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
