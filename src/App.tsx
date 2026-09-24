/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginPage } from './components/auth/LoginPage';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ToastContainer } from './components/common/ToastContainer';
import { EmployeeDashboard } from './components/employee/EmployeeDashboard';
import { AIHelpdeskChat } from './components/employee/AIHelpdeskChat';
import { TicketCreateModal } from './components/employee/TicketCreateModal';
import { TicketConfirmModal } from './components/employee/TicketConfirmModal';
import { TicketListView } from './components/tickets/TicketListView';
import { TicketDetailView } from './components/tickets/TicketDetailView';
import { KnowledgeBaseView } from './components/knowledge/KnowledgeBaseView';
import { KnowledgeArticleDetail } from './components/knowledge/KnowledgeArticleDetail';
import { AgentDashboard } from './components/agent/AgentDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminUsersView } from './components/admin/AdminUsersView';
import { AdminCategoriesView } from './components/admin/AdminCategoriesView';
import { AdminSettingsView } from './components/admin/AdminSettingsView';
import { UserProfileView } from './components/profile/UserProfileView';

const MainLayout: React.FC = () => {
  const { currentUser, activeTab, selectedTicketId, selectedArticleId } = useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!currentUser) {
    return <LoginPage />;
  }

  // Render view router
  const renderContent = () => {
    // Priority: Detailed views first
    if (selectedTicketId) {
      return <TicketDetailView />;
    }

    if (selectedArticleId) {
      return <KnowledgeArticleDetail />;
    }

    // Role-dependent dashboard
    if (activeTab === 'dashboard') {
      if (currentUser.role === 'agent') return <AgentDashboard />;
      if (currentUser.role === 'admin') return <AdminDashboard />;
      return <EmployeeDashboard />;
    }

    switch (activeTab) {
      case 'ai-helpdesk':
        return <AIHelpdeskChat />;
      case 'my-tickets':
        return (
          <TicketListView
            filterScope="my-tickets"
            title={currentUser.role === 'agent' ? 'Tickets Assigned to Me' : 'My Support Tickets'}
          />
        );
      case 'ticket-queue':
        return <TicketListView filterScope="queue" title="Incoming Engineering Queue" />;
      case 'all-tickets':
        return <TicketListView filterScope="all-tickets" title="Master Organization Tickets" />;
      case 'knowledge-base':
        return <KnowledgeBaseView />;
      case 'analytics':
        return <AdminDashboard />;
      case 'users':
        return <AdminUsersView />;
      case 'categories':
        return <AdminCategoriesView />;
      case 'settings':
        return <AdminSettingsView />;
      case 'profile':
        return <UserProfileView />;
      default:
        return <EmployeeDashboard />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans antialiased text-slate-800">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-64 h-full bg-slate-900">
            <Sidebar
              collapsed={false}
              onToggleCollapse={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onToggleMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="flex-1 overflow-y-auto bg-slate-50">
          {renderContent()}
        </main>
      </div>

      {/* Modals & Global Overlays */}
      <TicketCreateModal />
      <TicketConfirmModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
