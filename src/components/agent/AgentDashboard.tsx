import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge, PriorityBadge } from '../common/StatusBadge';
import {
  Inbox,
  UserCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Sparkles,
  Search,
  Filter,
  ArrowUpDown,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const AgentDashboard: React.FC = () => {
  const {
    currentUser,
    tickets,
    openTicketDetail,
    setActiveTab,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Compute Metrics
  const openTickets = tickets.filter(t => t.status === 'Open').length;
  const myTickets = tickets.filter(t => t.assignedTo === currentUser?.id && t.status !== 'Closed').length;
  const highPriority = tickets.filter(t => (t.priority === 'High' || t.priority === 'Critical') && t.status !== 'Resolved' && t.status !== 'Closed').length;
  
  // Overdue check (mock logic: created more than 24h ago and not resolved)
  const overdueCount = tickets.filter(t => {
    if (t.status === 'Resolved' || t.status === 'Closed') return false;
    const createdTime = new Date(t.createdAt).getTime();
    const hoursAgo = (Date.now() - createdTime) / (1000 * 60 * 60);
    return hoursAgo > 24;
  }).length;

  const resolvedToday = tickets.filter(t => {
    if (!t.resolvedAt) return false;
    const resolvedDate = new Date(t.resolvedAt).toDateString();
    return resolvedDate === new Date().toDateString();
  }).length;

  // Filter queue
  const filteredQueue = useMemo(() => {
    return tickets.filter(t => {
      const matchesSearch =
        searchTerm === '' ||
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.createdByName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.assignedTeam.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = selectedStatus === 'All' || t.status === selectedStatus;
      const matchesPriority = selectedPriority === 'All' || t.priority === selectedPriority;
      const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;

      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });
  }, [tickets, searchTerm, selectedStatus, selectedPriority, selectedCategory]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          IT Support Dashboard
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Monitor and resolve incoming IT requests across transmission systems and regional corporate networks.
        </p>
      </div>

      {/* 5 Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Open Tickets</span>
            <Inbox className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1.5 font-mono tabular-nums">{openTickets}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Awaiting assignment</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">My Tickets</span>
            <UserCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1.5 font-mono tabular-nums">{myTickets}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Assigned to you</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">High Priority</span>
            <AlertTriangle className="w-4 h-4 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1.5 font-mono tabular-nums">{highPriority}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Critical & High SLA</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overdue</span>
            <Clock className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1.5 font-mono tabular-nums">{overdueCount}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">&gt; 24h unresolved</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Resolved Today</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1.5 font-mono tabular-nums">{resolvedToday}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Met target SLA</p>
        </div>
      </div>

      {/* Ticket Queue Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">Support Ticket Queue</h3>
            <p className="text-xs text-slate-500">Live feed enriched with AI classification and similarity metrics</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('ticket-queue')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Full queue view →
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search queue by ID, problem, employee, team..."
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:bg-white focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Waiting for User">Waiting for User</option>
              <option value="Resolved">Resolved</option>
            </select>

            <select
              value={selectedPriority}
              onChange={e => setSelectedPriority(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
            >
              <option value="All">All Categories</option>
              <option value="VPN">VPN</option>
              <option value="Network">Network</option>
              <option value="Hardware">Hardware</option>
              <option value="Software">Software</option>
              <option value="Email">Email</option>
              <option value="Account & Password">Account & Password</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto -mx-5 -mb-5">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold text-[11px] border-y border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Ticket ID</th>
                <th className="py-3 px-4 font-semibold">Issue</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Priority</th>
                <th className="py-3 px-4 font-semibold">AI Confidence</th>
                <th className="py-3 px-4 font-semibold">Assigned To</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Created</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredQueue.map(ticket => (
                <tr
                  key={ticket.id}
                  onClick={() => openTicketDetail(ticket.id)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600 tabular-nums">
                    #{ticket.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 max-w-xs">
                      {ticket.title}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {ticket.createdByName} · {ticket.department}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                    {ticket.category}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <PriorityBadge priority={ticket.priority} />
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono tabular-nums font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded">
                      <Sparkles className="w-2.5 h-2.5 text-indigo-600" />
                      <span>{Math.round(ticket.aiConfidence * 100)}%</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {ticket.assignedToName ? (
                      <span className="text-slate-800 font-medium">{ticket.assignedToName}</span>
                    ) : (
                      <span className="text-slate-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono tabular-nums whitespace-nowrap text-xs">
                    {new Date(ticket.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <span className="text-xs font-semibold text-blue-600 group-hover:text-blue-800">
                      Triage →
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
