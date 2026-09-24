import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge, PriorityBadge } from '../common/StatusBadge';
import { TicketStatus, TicketPriority, TicketCategory } from '../../types';
import {
  ArrowLeft,
  Sparkles,
  Clock,
  User as UserIcon,
  Shield,
  Send,
  CheckCircle2,
  AlertTriangle,
  Layers,
  MessageSquare,
  Activity,
  Check,
  ChevronDown,
  Building,
  Calendar,
  Lock,
} from 'lucide-react';

export const TicketDetailView: React.FC = () => {
  const {
    currentUser,
    tickets,
    selectedTicketId,
    closeTicketDetail,
    updateTicketStatus,
    updateTicketPriority,
    updateTicketCategory,
    assignTicket,
    addComment,
    acceptAiSuggestions,
    users,
    categories,
    openTicketDetail,
  } = useApp();

  const [commentText, setCommentText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState('');

  const ticket = tickets.find(t => t.id === selectedTicketId);

  if (!ticket) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center">
        <p className="text-slate-600">Ticket not found or has been moved.</p>
        <button
          onClick={closeTicketDetail}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
        >
          Return to list
        </button>
      </div>
    );
  }

  const itAgents = users.filter(u => u.role === 'agent');
  const isAgentOrAdmin = currentUser?.role === 'agent' || currentUser?.role === 'admin';

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    addComment(ticket.id, commentText.trim(), isInternalNote);
    setCommentText('');
    setIsInternalNote(false);
  };

  const handleAssignSubmit = () => {
    const agent = itAgents.find(a => a.id === selectedAgentId);
    if (agent) {
      assignTicket(ticket.id, agent.id, agent.name, agent.department);
      setIsAssigning(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={closeTicketDetail}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Ticket Queue</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Quick status button for Agent */}
          {isAgentOrAdmin && ticket.status !== 'Resolved' && ticket.status !== 'Closed' && (
            <button
              onClick={() => updateTicketStatus(ticket.id, 'Resolved')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Resolve Ticket</span>
            </button>
          )}
        </div>
      </div>

      {/* Ticket Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-base font-bold text-blue-600 tabular-nums">
                #{ticket.id}
              </span>
              <PriorityBadge priority={ticket.priority} size="md" />
              <StatusBadge status={ticket.status} size="md" />
              <span className="text-xs text-slate-400 font-medium">·</span>
              <span className="text-xs text-slate-500 font-medium">{ticket.category}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              {ticket.title}
            </h2>
          </div>

          {/* Quick Agent Actions Dropdown / Bar */}
          {isAgentOrAdmin && (
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {/* Assign to me */}
              {ticket.assignedTo !== currentUser?.id && (
                <button
                  onClick={() =>
                    assignTicket(
                      ticket.id,
                      currentUser ? currentUser.id : 'agent-01',
                      currentUser ? currentUser.name : 'Rajesh Kumar',
                      currentUser?.department
                    )
                  }
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
                >
                  Assign to Me
                </button>
              )}

              {/* Status Select */}
              <div className="relative">
                <select
                  value={ticket.status}
                  onChange={e => updateTicketStatus(ticket.id, e.target.value as TicketStatus)}
                  aria-label="Update ticket status"
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-blue-500 cursor-pointer"
                >
                  <option value="Open">Status: Open</option>
                  <option value="In Progress">Status: In Progress</option>
                  <option value="Waiting for User">Status: Waiting for User</option>
                  <option value="Resolved">Status: Resolved</option>
                  <option value="Closed">Status: Closed</option>
                </select>
              </div>

              {/* Priority Select */}
              <div className="relative">
                <select
                  value={ticket.priority}
                  onChange={e => updateTicketPriority(ticket.id, e.target.value as TicketPriority)}
                  aria-label="Update ticket priority"
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-blue-500 cursor-pointer"
                >
                  <option value="Low">Priority: Low</option>
                  <option value="Medium">Priority: Medium</option>
                  <option value="High">Priority: High</option>
                  <option value="Critical">Priority: Critical</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Primary Description */}
        <div className="pt-2 text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <p className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-1">
            Issue Description
          </p>
          {ticket.description}
        </div>

        {/* Previous Troubleshooting Attempted */}
        {ticket.troubleshootingAttempted && ticket.troubleshootingAttempted.length > 0 && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs">
            <p className="font-semibold text-slate-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-600" />
              <span>Troubleshooting Attempted Prior to Escalation</span>
            </p>
            <ul className="space-y-1 list-disc list-inside text-slate-600">
              {ticket.troubleshootingAttempted.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Main Grid: Left Timeline/Comments, Right AI Intelligence & Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Timeline & Comments (2 cols on large screen) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Conversation / Timeline Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Ticket Lifecycle & Audit Timeline</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono tabular-nums">
                {ticket.timeline.length} Events Logged
              </span>
            </div>

            <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {ticket.timeline.map((event, i) => (
                <div key={event.id} className="relative group">
                  {/* Dot */}
                  <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-white border-2 border-blue-600 shadow-xs"></div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <p className="text-xs font-semibold text-slate-800">{event.title}</p>
                      <span className="text-[11px] text-slate-400 font-mono tabular-nums">
                        {new Date(event.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        · {new Date(event.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    {event.description && (
                      <p className="text-xs text-slate-600 leading-relaxed">{event.description}</p>
                    )}

                    <div className="text-[11px] text-slate-400">
                      Actor: <span className="font-medium text-slate-700">{event.actor}</span>{' '}
                      {event.actorRole && <span>({event.actorRole})</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comments Thread */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span>Comments & Discussion Thread</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono tabular-nums">
                {ticket.comments.length} Comments
              </span>
            </div>

            {/* Comments List */}
            {ticket.comments.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">No comments posted yet.</p>
            ) : (
              <div className="space-y-3">
                {ticket.comments.map(c => {
                  const isStaff = c.userRole === 'agent' || c.userRole === 'admin';
                  return (
                    <div
                      key={c.id}
                      className={`p-4 rounded-xl border text-xs sm:text-sm space-y-1.5 ${
                        c.isInternal
                          ? 'bg-amber-50/60 border-amber-200/80 text-amber-950'
                          : isStaff
                          ? 'bg-blue-50/40 border-blue-100 text-slate-800'
                          : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 text-xs">{c.userName}</span>
                          <span
                            className={`text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded ${
                              c.userRole === 'agent'
                                ? 'bg-blue-100 text-blue-800'
                                : c.userRole === 'admin'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {c.userRole}
                          </span>
                          {c.isInternal && (
                            <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-200">
                              Internal Staff Note
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono tabular-nums">
                          {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ·{' '}
                          {new Date(c.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="leading-relaxed whitespace-pre-line text-xs sm:text-sm">{c.message}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Comment Composer */}
            <form onSubmit={handlePostComment} className="pt-3 border-t border-slate-100 space-y-2.5">
              <textarea
                rows={3}
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Write an update, question, or diagnostic note..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:bg-white focus:border-blue-500 transition-colors"
              />

              <div className="flex items-center justify-between gap-2">
                {isAgentOrAdmin ? (
                  <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isInternalNote}
                      onChange={e => setIsInternalNote(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Post as Internal Staff Note (hidden from employee)</span>
                  </label>
                ) : (
                  <div />
                )}

                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Comment</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: AI Ticket Intelligence + Metadata Info */}
        <div className="space-y-6">
          {/* AI Ticket Intelligence Box */}
          <div className="bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-white rounded-2xl border border-blue-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-blue-100 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">AI Ticket Intelligence</h3>
              </div>
              <span className="text-[11px] font-semibold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-full border border-blue-200">
                ✨ AI Suggested
              </span>
            </div>

            {/* AI Summary */}
            <div className="space-y-1">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                AI Summary
              </p>
              <p className="text-xs text-slate-800 leading-relaxed bg-white/80 p-3 rounded-xl border border-blue-100">
                {ticket.aiSummary || 'Automated AI analysis completed for incoming ticket submission.'}
              </p>
            </div>

            {/* Suggested Category & Priority */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/80 p-2.5 rounded-xl border border-blue-100">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Suggested Category
                </span>
                <span className="font-semibold text-xs text-slate-900">{ticket.aiSuggestedCategory}</span>
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-blue-100">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Suggested Priority
                </span>
                <PriorityBadge priority={ticket.aiSuggestedPriority} />
              </div>
            </div>

            {/* Suggested Resolution */}
            {ticket.aiSuggestedResolution && (
              <div className="space-y-1">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Suggested Resolution
                </p>
                <div className="text-xs text-slate-800 bg-white/80 p-3 rounded-xl border border-blue-100 leading-relaxed">
                  {ticket.aiSuggestedResolution}
                </div>
              </div>
            )}

            {/* Similar Issues */}
            {ticket.similarIssues && ticket.similarIssues.length > 0 && (
              <div className="space-y-2 pt-1 border-t border-blue-100">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Similar Historical Issues
                </p>
                <div className="space-y-1.5">
                  {ticket.similarIssues.map(sim => (
                    <div
                      key={sim.ticketId}
                      className="p-2.5 bg-white/90 rounded-xl border border-blue-100 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-blue-700">#{sim.ticketId}</span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {Math.round(sim.similarity * 100)}% match
                        </span>
                      </div>
                      <p className="font-medium text-slate-800 line-clamp-1">{sim.title}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-2">{sim.resolution}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Agent Button to Accept Suggestions */}
            {isAgentOrAdmin && (
              <button
                onClick={() => acceptAiSuggestions(ticket.id)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Accept AI Suggestion</span>
              </button>
            )}
          </div>

          {/* Ticket Information Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2.5">
              Ticket Information
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Requester</span>
                <span className="font-medium text-slate-800">{ticket.createdByName}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">Department</span>
                <span className="font-medium text-slate-800">{ticket.department}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">Assigned Team</span>
                <span className="font-medium text-slate-800">{ticket.assignedTeam}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">Assigned Engineer</span>
                <span className="font-medium text-slate-800">
                  {ticket.assignedToName || <span className="text-slate-400 italic">Unassigned</span>}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">Created Date</span>
                <span className="font-mono tabular-nums text-slate-700">
                  {new Date(ticket.createdAt).toLocaleString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">Last Updated</span>
                <span className="font-mono tabular-nums text-slate-700">
                  {new Date(ticket.updatedAt).toLocaleString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              {ticket.resolvedAt && (
                <div className="flex justify-between items-center text-emerald-700">
                  <span className="font-medium">Resolved Date</span>
                  <span className="font-mono tabular-nums">
                    {new Date(ticket.resolvedAt).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              )}
            </div>

            {/* Reassign Modal Trigger for Agents */}
            {isAgentOrAdmin && (
              <div className="pt-2 border-t border-slate-100">
                {!isAssigning ? (
                  <button
                    onClick={() => setIsAssigning(true)}
                    className="w-full py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                  >
                    Reassign Ticket
                  </button>
                ) : (
                  <div className="space-y-2 pt-1">
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase">
                      Select IT Agent
                    </label>
                    <select
                      value={selectedAgentId}
                      onChange={e => setSelectedAgentId(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    >
                      <option value="">Choose an agent...</option>
                      {itAgents.map(a => (
                        <option key={a.id} value={a.id}>
                          {a.name} ({a.department.split('&')[0]})
                        </option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={handleAssignSubmit}
                        disabled={!selectedAgentId}
                        className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white rounded-lg text-xs font-semibold"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setIsAssigning(false)}
                        className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
