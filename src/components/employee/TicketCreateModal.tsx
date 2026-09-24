import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TicketCategory, TicketPriority } from '../../types';
import { X, Sparkles, AlertCircle, CheckCircle2, Send, Info } from 'lucide-react';

export const TicketCreateModal: React.FC = () => {
  const {
    currentUser,
    isTicketCreateModalOpen,
    preFilledTicketData,
    closeCreateTicketModal,
    createTicket,
    categories,
  } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TicketCategory>('Network');
  const [priority, setPriority] = useState<TicketPriority>('Medium');
  const [affectedService, setAffectedService] = useState('');
  const [troubleshootingText, setTroubleshootingText] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (preFilledTicketData) {
      setTitle(preFilledTicketData.title || '');
      setDescription(preFilledTicketData.description || '');
      if (preFilledTicketData.category) setCategory(preFilledTicketData.category);
      if (preFilledTicketData.priority) setPriority(preFilledTicketData.priority);
      setAffectedService(preFilledTicketData.affectedService || '');

      if (preFilledTicketData.troubleshootingAttempted && preFilledTicketData.troubleshootingAttempted.length > 0) {
        setTroubleshootingText(preFilledTicketData.troubleshootingAttempted.join('\n'));
      } else {
        setTroubleshootingText('1. Self-service guided diagnostics followed via AI Helpdesk\n2. Checked local network connectivity and application state');
      }
    } else {
      setTitle('');
      setDescription('');
      setCategory('Network');
      setPriority('Medium');
      setAffectedService('');
      setTroubleshootingText('');
    }
    setErrors({});
  }, [preFilledTicketData, isTicketCreateModalOpen]);

  if (!isTicketCreateModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Issue description is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const troubleshootingAttempted = troubleshootingText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    createTicket({
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      affectedService: affectedService.trim() || `${category} Service`,
      troubleshootingAttempted,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">Create IT Support Ticket</h3>
              {preFilledTicketData && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3 text-blue-600" />
                  <span>Pre-filled from AI Copilot</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Review and submit your structured support ticket to the IT engineering team.
            </p>
          </div>
          <button
            onClick={closeCreateTicketModal}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Employee Contact Info (Read-only banner) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-slate-400 font-medium">Employee: </span>
              <span className="font-semibold text-slate-800">{currentUser?.name}</span>
              <span className="text-slate-400 ml-2">({currentUser?.department})</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium">ID: </span>
              <span className="font-mono text-slate-700 font-medium">{currentUser?.employeeId}</span>
              <span className="text-slate-400 ml-2">Email: </span>
              <span className="text-slate-700">{currentUser?.email}</span>
            </div>
          </div>

          {/* Issue Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Issue Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Unable to connect to corporate VPN from remote home network"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-hidden transition-colors ${
                errors.title ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 focus:border-blue-500'
              }`}
            />
            {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
          </div>

          {/* Category & Priority Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as TicketCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-hidden focus:border-blue-500"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as TicketPriority)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-hidden focus:border-blue-500"
              >
                <option value="Low">Low - Minor question or inquiry</option>
                <option value="Medium">Medium - Standard workflow disruption</option>
                <option value="High">High - Impairing daily operations</option>
                <option value="Critical">Critical - Urgent / Grid / Executive halt</option>
              </select>
            </div>
          </div>

          {/* Affected Service */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Affected Service or Device
            </label>
            <input
              type="text"
              value={affectedService}
              onChange={e => setAffectedService(e.target.value)}
              placeholder="e.g., Corporate SSL-VPN, Dell Docking Station, SAP GUI"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Issue Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Provide specific details of what happened, error codes, and symptoms..."
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-hidden transition-colors ${
                errors.description ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 focus:border-blue-500'
              }`}
            />
            {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description}</p>}
          </div>

          {/* Previous Troubleshooting Attempted */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Previous Troubleshooting Attempted
            </label>
            <textarea
              rows={3}
              value={troubleshootingText}
              onChange={e => setTroubleshootingText(e.target.value)}
              placeholder="List any troubleshooting steps you already tried (e.g., restarted router, flushed DNS)..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-blue-500 font-mono text-xs leading-relaxed"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Sharing previous steps helps engineers resolve your ticket significantly faster without repeating questions.
            </p>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeCreateTicketModal}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Ticket</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
