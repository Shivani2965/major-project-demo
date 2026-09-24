import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge, PriorityBadge } from '../common/StatusBadge';
import { TicketStatus, TicketPriority } from '../../types';
import {
  Search,
  Filter,
  Plus,
  Ticket as TicketIcon,
  Clock,
  ArrowUpDown,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface TicketListViewProps {
  filterScope?: 'my-tickets' | 'all-tickets' | 'queue';
  title?: string;
  subtitle?: string;
}

export const TicketListView: React.FC<TicketListViewProps> = ({
  filterScope = 'my-tickets',
  title,
  subtitle,
}) => {
  const {
    currentUser,
    tickets,
    openTicketDetail,
    openCreateTicketModal,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Filter based on scope
  const baseTickets = useMemo(() => {
    if (filterScope === 'my-tickets') {
      if (currentUser?.role === 'agent') {
        return tickets.filter(t => t.assignedTo === currentUser.id);
      }
      return tickets.filter(t => t.createdBy === currentUser?.id);
    }
    if (filterScope === 'queue') {
      return tickets.filter(t => t.status === 'Open');
    }
    // all-tickets
    return tickets;
  }, [tickets, filterScope, currentUser]);

  // Apply search and filter
  const filteredTickets = useMemo(() => {
    return baseTickets.filter(ticket => {
      // Search
      const searchMatch =
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.createdByName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.assignedTeam.toLowerCase().includes(searchTerm.toLowerCase());

      // Status
      const statusMatch = selectedStatus === 'All' || ticket.status === selectedStatus;

      // Priority
      const priorityMatch = selectedPriority === 'All' || ticket.priority === selectedPriority;

      // Category
      const categoryMatch = selectedCategory === 'All' || ticket.category === selectedCategory;

      return searchMatch && statusMatch && priorityMatch && categoryMatch;
    });
  }, [baseTickets, searchTerm, selectedStatus, selectedPriority, selectedCategory]);

  const defaultTitle =
    filterScope === 'queue'
      ? 'Incoming Support Queue'
      : filterScope === 'all-tickets'
      ? 'Enterprise IT Tickets'
      : 'My Support Tickets';

  const defaultSubtitle =
    filterScope === 'queue'
      ? 'Unassigned tickets waiting for engineering triage'
      : filterScope === 'all-tickets'
      ? 'Master repository of all organization IT requests'
      : 'Review the current progress and response history of your tickets';

  const statusTabs: (string | TicketStatus)[] = ['All', 'Open', 'In Progress', 'Waiting for User', 'Resolved', 'Closed'];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            {title || defaultTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {subtitle || defaultSubtitle}
          </p>
        </div>

        {currentUser?.role === 'employee' && (
          <button
            onClick={() => openCreateTicketModal()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Ticket</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        {/* Top: Status Segmented Control */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {statusTabs.map(tab => {
            const count =
              tab === 'All'
                ? baseTickets.length
                : baseTickets.filter(t => t.status === tab).length;

            const isActive = selectedStatus === tab;

            return (
              <button
                key={tab}
                onClick={() => setSelectedStatus(tab)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`text-[11px] font-mono tabular-nums px-1.5 py-0.2 rounded ${
                    isActive ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bottom: Search Input + Category/Priority Selects */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by ticket ID (#IT-10482), title, employee, or team..."
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:bg-white focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Priority filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedPriority}
              onChange={e => setSelectedPriority(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-hidden focus:border-blue-500"
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
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-hidden focus:border-blue-500"
            >
              <option value="All">All Categories</option>
              <option value="VPN">VPN</option>
              <option value="Network">Network</option>
              <option value="Hardware">Hardware</option>
              <option value="Software">Software</option>
              <option value="Email">Email</option>
              <option value="Account & Password">Account & Password</option>
              <option value="Printer">Printer</option>
              <option value="Security">Security</option>
            </select>

            {(searchTerm || selectedStatus !== 'All' || selectedPriority !== 'All' || selectedCategory !== 'All') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedStatus('All');
                  setSelectedPriority('All');
                  setSelectedCategory('All');
                }}
                className="px-2.5 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Ticket Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredTickets.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <TicketIcon className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-800">No tickets found</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No tickets matched the current filter conditions or search query.
            </p>
            {currentUser?.role === 'employee' && (
              <button
                onClick={() => openCreateTicketModal()}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
              >
                Create a Ticket
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Ticket ID</th>
                  <th className="py-3.5 px-4 font-semibold">Issue Title</th>
                  <th className="py-3.5 px-4 font-semibold">Category</th>
                  <th className="py-3.5 px-4 font-semibold">Priority</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  {filterScope !== 'my-tickets' && (
                    <th className="py-3.5 px-4 font-semibold">Requester</th>
                  )}
                  <th className="py-3.5 px-4 font-semibold">Assigned</th>
                  <th className="py-3.5 px-4 font-semibold">Created</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTickets.map(ticket => (
                  <tr
                    key={ticket.id}
                    onClick={() => openTicketDetail(ticket.id)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600 tabular-nums">
                      #{ticket.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {ticket.title}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-sm">
                        {ticket.affectedService || ticket.assignedTeam}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {ticket.category}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <PriorityBadge priority={ticket.priority} />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={ticket.status} />
                    </td>
                    {filterScope !== 'my-tickets' && (
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="text-slate-800 font-medium">{ticket.createdByName}</div>
                        <div className="text-[10px] text-slate-400">{ticket.department}</div>
                      </td>
                    )}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-700">
                      {ticket.assignedToName ? (
                        <span className="font-medium">{ticket.assignedToName}</span>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono tabular-nums whitespace-nowrap text-xs">
                      {new Date(ticket.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <span className="text-xs font-semibold text-blue-600 group-hover:text-blue-800 flex items-center justify-end gap-1">
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
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
