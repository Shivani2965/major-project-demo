import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge, PriorityBadge } from '../common/StatusBadge';
import {
  Sparkles,
  Ticket as TicketIcon,
  Clock,
  CheckCircle2,
  ArrowRight,
  Bot,
  Plus,
  BookOpen,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export const EmployeeDashboard: React.FC = () => {
  const {
    currentUser,
    tickets,
    setActiveTab,
    openTicketDetail,
    openCreateTicketModal,
  } = useApp();

  if (!currentUser) return null;

  // Filter employee's own tickets
  const myTickets = tickets.filter(t => t.createdBy === currentUser.id);
  const openCount = myTickets.filter(t => t.status === 'Open').length;
  const pendingCount = myTickets.filter(t => t.status === 'In Progress' || t.status === 'Waiting for User').length;
  const resolvedCount = myTickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;

  const recentTickets = myTickets.slice(0, 5);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner / Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>POWERGRID Corporate IT Support</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {getGreeting()}, {currentUser.name.split(' ')[0]}
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              How can we help you today? Report issues, run guided diagnostics, or request enterprise hardware and access.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('ai-helpdesk')}
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md transition-all transform hover:-translate-y-0.5 focus:outline-hidden focus:ring-2 focus:ring-blue-400"
            >
              <Bot className="w-5 h-5 text-blue-200" />
              <span>Get IT Help</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Open Tickets</p>
            <p className="text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">{openCount}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Awaiting initial engineering triage</p>
          </div>
          <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <TicketIcon className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pending Tickets</p>
            <p className="text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">{pendingCount}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">In progress with specialist teams</p>
          </div>
          <div className="w-11 h-11 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Resolved Tickets</p>
            <p className="text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">{resolvedCount}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Successfully closed or fulfilled</p>
          </div>
          <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveTab('ai-helpdesk')}
            className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-xs transition-all text-left flex items-start gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                Ask AI Helpdesk
              </p>
              <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                Troubleshoot VPN, network, or account errors with guided steps.
              </p>
            </div>
          </button>

          <button
            onClick={() => openCreateTicketModal()}
            className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-xs transition-all text-left flex items-start gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                Create Ticket
              </p>
              <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                Submit an IT support ticket directly to designated engineers.
              </p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('my-tickets')}
            className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-xs transition-all text-left flex items-start gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <TicketIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 group-hover:text-purple-600 transition-colors">
                My Tickets
              </p>
              <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                Track status updates, timelines, and engineer comments.
              </p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('knowledge-base')}
            className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-xs transition-all text-left flex items-start gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">
                Knowledge Base
              </p>
              <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                Browse verified self-service manuals and setup guides.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Tickets Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">Recent Support Requests</h3>
            <p className="text-xs text-slate-500 mt-0.5">Tickets created by you in the IT Helpdesk system</p>
          </div>
          <button
            onClick={() => setActiveTab('my-tickets')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
          >
            <span>View all tickets</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentTickets.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <TicketIcon className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-700">No tickets found</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              You haven't reported any IT issues yet. If you need assistance, try our AI Helpdesk or create a ticket.
            </p>
            <button
              onClick={() => openCreateTicketModal()}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              Create a Ticket
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Ticket ID</th>
                  <th className="py-3 px-4 font-semibold">Issue</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Priority</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Created Date</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentTickets.map(ticket => (
                  <tr
                    key={ticket.id}
                    onClick={() => openTicketDetail(ticket.id)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-medium text-blue-600 tabular-nums">
                      #{ticket.id}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900 max-w-xs truncate">
                      {ticket.title}
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {ticket.category}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <PriorityBadge priority={ticket.priority} />
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge status={ticket.status} />
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono tabular-nums whitespace-nowrap">
                      {new Date(ticket.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-xs font-medium text-blue-600 hover:text-blue-800">
                        View Details →
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
