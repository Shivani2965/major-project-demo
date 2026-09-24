import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { DEMO_PRESET_ACCOUNTS } from '../../data/mockData';
import {
  Menu,
  Plus,
  LogOut,
  ChevronDown,
  UserCheck,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

interface HeaderProps {
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const {
    currentUser,
    activeTab,
    selectedTicketId,
    selectedArticleId,
    switchRole,
    logout,
    openCreateTicketModal,
    resetDemoData,
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  // Compute breadcrumb title
  const getContextTitle = () => {
    if (selectedTicketId) return `Ticket #${selectedTicketId}`;
    if (selectedArticleId) return 'Knowledge Guide';

    switch (activeTab) {
      case 'dashboard':
        return currentUser?.role === 'agent'
          ? 'Support Agent Dashboard'
          : currentUser?.role === 'admin'
          ? 'System Operations Overview'
          : 'Employee IT Workspace';
      case 'ai-helpdesk':
        return 'AI Helpdesk Copilot';
      case 'my-tickets':
        return 'My Tickets';
      case 'ticket-queue':
        return 'Support Ticket Queue';
      case 'all-tickets':
        return 'All Enterprise Tickets';
      case 'knowledge-base':
        return 'Knowledge Base';
      case 'analytics':
        return 'Service Analytics & SLA';
      case 'users':
        return 'User & Identity Directory';
      case 'categories':
        return 'Category & Routing Rules';
      case 'settings':
        return 'Helpdesk Configuration';
      case 'profile':
        return 'User Profile';
      default:
        return 'Overview';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between z-20 shrink-0">
      {/* Zone 1 & 2: Mobile toggle + Breadcrumb Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden text-slate-600 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-sm text-slate-500 min-w-0">
          <span className="font-semibold text-slate-900 hidden sm:inline whitespace-nowrap">
            POWERGRID IT
          </span>
          <span className="text-slate-300 hidden sm:inline" aria-hidden="true">/</span>
          <h1 className="font-medium text-slate-700 truncate text-sm sm:text-base">
            {getContextTitle()}
          </h1>
        </div>
      </div>

      {/* Zone 3: Primary Actions + Role Switcher */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Action: New Ticket (for employees) */}
        {currentUser?.role === 'employee' && (
          <button
            onClick={() => openCreateTicketModal()}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Create Ticket</span>
          </button>
        )}

        {/* Interactive Demo Role Switcher Segmented Control */}
        <div className="relative">
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 transition-colors"
            title="Switch Demo Role"
            aria-expanded={isRoleDropdownOpen}
          >
            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline text-slate-500">Demo Role:</span>
            <span className="capitalize font-semibold text-slate-900">{currentUser?.role}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isRoleDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsRoleDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50 text-xs">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Active Role (Demo)
                </div>
                {DEMO_PRESET_ACCOUNTS.map(account => (
                  <button
                    key={account.role}
                    onClick={() => {
                      switchRole(account.role as UserRole);
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 flex items-start gap-2.5 hover:bg-slate-50 transition-colors ${
                      currentUser?.role === account.role ? 'bg-blue-50/60 font-semibold' : ''
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 ${
                        account.role === 'admin'
                          ? 'bg-rose-500'
                          : account.role === 'agent'
                          ? 'bg-amber-500'
                          : 'bg-blue-500'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-slate-900 font-medium flex items-center justify-between">
                        <span>{account.name}</span>
                        <span className="capitalize text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                          {account.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{account.roleTitle}</p>
                    </div>
                  </button>
                ))}

                <div className="my-1 border-t border-slate-100" />

                <div className="px-2 pt-1 flex items-center justify-between gap-1">
                  <button
                    onClick={() => {
                      resetDemoData();
                      setIsRoleDropdownOpen(false);
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded text-xs transition-colors"
                  >
                    <RefreshCw className="w-3 h-3 text-slate-400" />
                    <span>Reset Demo Data</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsRoleDropdownOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 rounded text-xs transition-colors font-medium"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
