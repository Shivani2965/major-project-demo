import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  Ticket as TicketIcon,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Layers,
  ShieldCheck,
  Users,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { tickets, categories, users, setActiveTab } = useApp();

  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length;
  const resolvedTickets = tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;
  const avgResolutionHours = '3.8 Hours';

  // Category counts
  const categoryCounts = categories.map(cat => ({
    name: cat.name,
    count: tickets.filter(t => t.category === cat.name).length,
  }));

  const maxCategoryCount = Math.max(...categoryCounts.map(c => c.count), 1);

  // Status counts
  const statusCounts = [
    { label: 'Open', count: tickets.filter(t => t.status === 'Open').length, color: 'bg-blue-600' },
    { label: 'In Progress', count: tickets.filter(t => t.status === 'In Progress').length, color: 'bg-amber-500' },
    { label: 'Waiting for User', count: tickets.filter(t => t.status === 'Waiting for User').length, color: 'bg-purple-500' },
    { label: 'Resolved', count: tickets.filter(t => t.status === 'Resolved').length, color: 'bg-emerald-600' },
    { label: 'Closed', count: tickets.filter(t => t.status === 'Closed').length, color: 'bg-slate-400' },
  ];

  // Priority counts
  const priorityCounts = [
    { label: 'Critical', count: tickets.filter(t => t.priority === 'Critical').length, color: 'bg-rose-600' },
    { label: 'High', count: tickets.filter(t => t.priority === 'High').length, color: 'bg-orange-500' },
    { label: 'Medium', count: tickets.filter(t => t.priority === 'Medium').length, color: 'bg-amber-500' },
    { label: 'Low', count: tickets.filter(t => t.priority === 'Low').length, color: 'bg-slate-400' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            System Administration & Analytics
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Enterprise IT health metrics, SLA compliance, and cross-department service volumes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('users')}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors shadow-2xs"
          >
            Manage Users
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-2xs"
          >
            Manage Categories
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Tickets</span>
            <TicketIcon className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-2 font-mono tabular-nums">{totalTickets}</p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium mt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>100% telemetry captured</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Open Tickets</span>
            <AlertCircle className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-2 font-mono tabular-nums">{openTickets}</p>
          <p className="text-xs text-slate-400 mt-1">Awaiting or in active resolution</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Resolved Tickets</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-2 font-mono tabular-nums">{resolvedTickets}</p>
          <div className="text-xs text-slate-400 mt-1 font-mono tabular-nums">
            {Math.round((resolvedTickets / totalTickets) * 100)}% resolution rate
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Resolution Time</span>
            <Clock className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-2 font-mono tabular-nums">{avgResolutionHours}</p>
          <p className="text-xs text-emerald-600 font-medium mt-1">Within SLA target of &lt; 6.0h</p>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets by Category (Horizontal Bar Chart) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Tickets by Category</h3>
              <p className="text-xs text-slate-500">Distribution across technical IT domains</p>
            </div>
            <span className="text-xs text-slate-400 font-mono">Live Sync</span>
          </div>

          <div className="space-y-3 pt-2">
            {categoryCounts.map(cat => {
              const percentage = Math.round((cat.count / maxCategoryCount) * 100);
              return (
                <div key={cat.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{cat.name}</span>
                    <span className="font-mono text-slate-500 tabular-nums">
                      {cat.count} tickets
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority & Status Breakdown */}
        <div className="space-y-6">
          {/* Tickets by Priority */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Ticket Priority Distribution</h3>
            <div className="space-y-2.5 pt-1">
              {priorityCounts.map(p => {
                const pct = Math.round((p.count / totalTickets) * 100);
                return (
                  <div key={p.label} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${p.color}`} />
                      <span className="text-slate-700 font-medium">{p.label}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono tabular-nums">
                      <span className="font-semibold text-slate-900">{p.count}</span>
                      <span className="text-slate-400 text-[11px]">({pct}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tickets by Status */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Tickets by Status</h3>
            <div className="space-y-2.5 pt-1">
              {statusCounts.map(s => {
                const pct = Math.round((s.count / totalTickets) * 100);
                return (
                  <div key={s.label} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                      <span className="text-slate-700 font-medium">{s.label}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono tabular-nums">
                      <span className="font-semibold text-slate-900">{s.count}</span>
                      <span className="text-slate-400 text-[11px]">({pct}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
