import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge, PriorityBadge } from '../common/StatusBadge';
import { CheckCircle2, Ticket as TicketIcon, ArrowRight, X, Clock, ShieldCheck } from 'lucide-react';

export const TicketConfirmModal: React.FC = () => {
  const {
    isTicketConfirmedModalOpen,
    confirmedTicket,
    closeConfirmModal,
    openTicketDetail,
  } = useApp();

  if (!isTicketConfirmedModalOpen || !confirmedTicket) return null;

  const handleTrackTicket = () => {
    closeConfirmModal();
    openTicketDetail(confirmedTicket.id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Success Banner */}
        <div className="bg-emerald-600 p-6 text-white text-center relative">
          <button
            onClick={closeConfirmModal}
            className="absolute top-4 right-4 text-emerald-100 hover:text-white p-1 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-full bg-white/20 text-white flex items-center justify-center mx-auto mb-3 shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold tracking-tight">Ticket Created Successfully</h3>
          <p className="text-emerald-100 text-xs mt-1">
            Your request has been registered in the POWERGRID IT Service Desk.
          </p>
        </div>

        {/* Details Card */}
        <div className="p-6 space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 divide-y divide-slate-200/80">
            <div className="pb-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ticket ID</span>
              <span className="font-mono text-base font-bold text-blue-600 tabular-nums">
                #{confirmedTicket.id}
              </span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">Status</span>
              <StatusBadge status={confirmedTicket.status} />
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">Priority</span>
              <PriorityBadge priority={confirmedTicket.priority} />
            </div>

            <div className="pt-2.5 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">Assigned Team</span>
              <span className="text-xs font-semibold text-slate-800">{confirmedTicket.assignedTeam}</span>
            </div>
          </div>

          <div className="text-xs text-slate-500 leading-relaxed bg-blue-50/50 p-3 rounded-xl border border-blue-100">
            <p className="font-medium text-blue-900 mb-0.5">Automated AI Routing</p>
            An IT support specialist from <span className="font-semibold text-slate-800">{confirmedTicket.assignedTeam}</span> will review your ticket and begin diagnostic triage shortly.
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={closeConfirmModal}
              className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs rounded-xl transition-colors"
            >
              Done
            </button>
            <button
              onClick={handleTrackTicket}
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Track Ticket</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
