import React from 'react';
import { TicketStatus, TicketPriority } from '../../types';

interface StatusBadgeProps {
  status: TicketStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  switch (status) {
    case 'Open':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-blue-50 text-blue-700 border border-blue-200/80 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
          <span>Open</span>
        </span>
      );
    case 'In Progress':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-amber-50 text-amber-700 border border-amber-200/80 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
          <span>In Progress</span>
        </span>
      );
    case 'Waiting for User':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-purple-50 text-purple-700 border border-purple-200/80 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
          <span>Waiting for User</span>
        </span>
      );
    case 'Resolved':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
          <span>Resolved</span>
        </span>
      );
    case 'Closed':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-slate-100 text-slate-600 border border-slate-200 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
          <span>Closed</span>
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses}`}>
          <span>{status}</span>
        </span>
      );
  }
};

interface PriorityBadgeProps {
  priority: TicketPriority;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  switch (priority) {
    case 'Critical':
      return (
        <span className={`inline-flex items-center gap-1 font-semibold rounded-md bg-rose-50 text-rose-700 border border-rose-200 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
          <span>Critical</span>
        </span>
      );
    case 'High':
      return (
        <span className={`inline-flex items-center gap-1 font-medium rounded-md bg-orange-50 text-orange-700 border border-orange-200 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
          <span>High</span>
        </span>
      );
    case 'Medium':
      return (
        <span className={`inline-flex items-center gap-1 font-medium rounded-md bg-amber-50 text-amber-700 border border-amber-200 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          <span>Medium</span>
        </span>
      );
    case 'Low':
      return (
        <span className={`inline-flex items-center gap-1 font-medium rounded-md bg-slate-100 text-slate-600 border border-slate-200 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
          <span>Low</span>
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center gap-1 font-medium rounded-md bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses}`}>
          <span>{priority}</span>
        </span>
      );
  }
};
