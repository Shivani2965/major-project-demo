import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Mail,
  Building,
  Shield,
  Ticket as TicketIcon,
  CheckCircle2,
  Clock,
  Phone,
  MapPin,
  Calendar,
} from 'lucide-react';

export const UserProfileView: React.FC = () => {
  const { currentUser, tickets } = useApp();

  if (!currentUser) return null;

  const userTickets = tickets.filter(t => t.createdBy === currentUser.id);
  const assignedTickets = tickets.filter(t => t.assignedTo === currentUser.id);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-20 h-20 rounded-2xl bg-blue-600 text-white font-bold text-2xl flex items-center justify-center shadow-md shrink-0">
          {currentUser.name
            .split(' ')
            .map(n => n[0])
            .join('')}
        </div>

        <div className="space-y-2 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              {currentUser.name}
            </h2>
            <span
              className={`text-xs font-semibold uppercase px-2.5 py-0.5 rounded-full ${
                currentUser.role === 'admin'
                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                  : currentUser.role === 'agent'
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-blue-100 text-blue-800 border border-blue-200'
              }`}
            >
              {currentUser.role}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-500">{currentUser.department}</p>

          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentUser.email}</span>
            </span>
            <span className="flex items-center gap-1.5 font-mono">
              <Shield className="w-3.5 h-3.5 text-slate-400" />
              <span>ID: {currentUser.employeeId}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Corporate HQ / Regional Substation</span>
            </span>
          </div>
        </div>
      </div>

      {/* Activity Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {currentUser.role === 'agent' ? 'Tickets Handled' : 'Tickets Submitted'}
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
            {currentUser.role === 'agent' ? assignedTickets.length : userTickets.length}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Active / In Progress
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
            {currentUser.role === 'agent'
              ? assignedTickets.filter(t => t.status === 'In Progress').length
              : userTickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Resolved / Closed
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
            {currentUser.role === 'agent'
              ? assignedTickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length
              : userTickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length}
          </p>
        </div>
      </div>

      {/* Organizational IT Details */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">Assigned IT Assets & Privileges</h3>

        <div className="space-y-3 text-xs sm:text-sm divide-y divide-slate-100">
          <div className="pt-2 flex justify-between">
            <span className="text-slate-500">Domain Controller</span>
            <span className="font-mono text-slate-800">POWERGRID.INTERNAL / DC-NR-02</span>
          </div>

          <div className="pt-3 flex justify-between">
            <span className="text-slate-500">VPN Access Profile</span>
            <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Active (SSL-VPN-ENGINEERING)
            </span>
          </div>

          <div className="pt-3 flex justify-between">
            <span className="text-slate-500">Primary Workstation Hostname</span>
            <span className="font-mono text-slate-800">PG-WRK-99214.int</span>
          </div>

          <div className="pt-3 flex justify-between">
            <span className="text-slate-500">2-Factor Authentication</span>
            <span className="font-medium text-blue-700">Enforced via TOTP / Corporate Card</span>
          </div>
        </div>
      </div>
    </div>
  );
};
