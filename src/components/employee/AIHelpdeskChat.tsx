import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { aiService } from '../../services/aiService';
import { ChatMessage, TicketCategory, TicketPriority } from '../../types';
import {
  Bot,
  User as UserIcon,
  Send,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  RotateCcw,
  Headphones,
  Check,
  X,
  ArrowRight,
  ShieldCheck,
  Lightbulb,
} from 'lucide-react';

const SAMPLE_ISSUES = [
  'My laptop connects to Wi-Fi but I cannot access the VPN.',
  'Outlook displays Disconnected and emails are stuck in Outbox.',
  'External dual-monitor flickers black every few minutes on Dell dock.',
  'My domain account is locked out after changing password yesterday.',
];

export const AIHelpdeskChat: React.FC = () => {
  const {
    currentUser,
    tickets,
    openCreateTicketModal,
    showToast,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: `Hello ${currentUser?.name ? currentUser.name.split(' ')[0] : 'there'}! I am your AI IT Helpdesk Copilot for POWERGRID.\n\nDescribe your IT issue and I'll help you troubleshoot it, or guide you through self-service resolution.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        'VPN connection issue',
        'Office Wi-Fi 802.1X error',
        'Outlook email disconnected',
        'Domain account locked',
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Call modular AI service
    setTimeout(() => {
      const response = aiService.processUserMessage(
        text,
        messages.map(m => ({ sender: m.sender, text: m.text })),
        tickets
      );

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: response.suggestedActions,
        detectedCategory: response.detectedCategory,
        detectedPriority: response.detectedPriority,
        troubleshootingSteps: response.troubleshootingSteps,
        isResolutionPrompt: response.isResolutionPrompt,
        draftTicketData: response.draftTicketData,
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleActionClick = (action: string, msg: ChatMessage) => {
    if (action === '✓ Yes, issue resolved') {
      const resolvedMsg: ChatMessage = {
        id: `sys-${Date.now()}`,
        sender: 'system',
        text: 'Great news! Your issue has been marked as resolved via self-service troubleshooting. No support ticket was needed.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, resolvedMsg]);
      showToast('Glad your issue was resolved!', 'success');
      return;
    }

    if (action === '✕ No, create a ticket' || action === 'Create Support Ticket') {
      // Find latest draft ticket data or construct from message
      const draft = msg.draftTicketData || {
        title: msg.detectedCategory ? `${msg.detectedCategory} Support Request` : 'IT Assistance Request',
        description: `Troubleshooting attempted via AI Helpdesk Copilot:\n${
          msg.troubleshootingSteps ? msg.troubleshootingSteps.map(s => `- ${s}`).join('\n') : '- Standard self-service diagnostic steps followed'
        }`,
        category: msg.detectedCategory || 'Other',
        priority: msg.detectedPriority || 'Medium',
        affectedService: `${msg.detectedCategory || 'General'} IT Service`,
        troubleshootingAttempted: msg.troubleshootingSteps || ['Guided AI Helpdesk troubleshooting completed'],
      };

      openCreateTicketModal(draft);
      return;
    }

    // Otherwise, simulate user sending this action as a prompt
    handleSendMessage(action);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        text: `Chat reset. Describe your IT issue and I'll help you troubleshoot it step-by-step.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          'VPN connection issue',
          'Office Wi-Fi 802.1X error',
          'Outlook email disconnected',
          'Domain account locked',
        ],
      },
    ]);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="bg-white rounded-t-2xl border border-slate-200 border-b-0 p-4 sm:p-5 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">AI Helpdesk Copilot</h2>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 text-blue-600" />
                <span>AI Guided</span>
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Describe your IT issue and I'll help you troubleshoot it.
            </p>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          className="text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors"
          title="Reset conversation"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">New Conversation</span>
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 bg-slate-50 border border-slate-200 overflow-y-auto p-4 sm:p-6 space-y-4">
        {/* Sample Prompt Starters if only 1 message */}
        {messages.length === 1 && (
          <div className="mb-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Common Issues & Prompt Suggestions</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SAMPLE_ISSUES.map((issue, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(issue)}
                  className="text-left text-xs p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-slate-700 transition-all font-medium flex items-center justify-between group"
                >
                  <span className="truncate">{issue}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 shrink-0 ml-1 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => {
          if (msg.sender === 'system') {
            return (
              <div key={msg.id} className="flex justify-center my-3">
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-2 rounded-xl flex items-center gap-2 font-medium shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{msg.text}</span>
                </div>
              </div>
            );
          }

          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold shrink-0 shadow-xs ${
                  isUser
                    ? 'bg-slate-800 text-white'
                    : 'bg-blue-600 text-white'
                }`}
              >
                {isUser ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-xl space-y-2.5 ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-xs shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs shadow-xs'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.text}</div>

                  {/* AI Metadata tag if detected */}
                  {!isUser && msg.detectedCategory && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">Detected Category:</span>
                      <span className="font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                        {msg.detectedCategory}
                      </span>
                      {msg.detectedPriority && (
                        <>
                          <span className="text-slate-300" aria-hidden="true">·</span>
                          <span className="font-semibold text-slate-700">Suggested Priority:</span>
                          <span className="font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {msg.detectedPriority}
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Suggested Action Chips */}
                {!isUser && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.suggestedActions.map((action, i) => {
                      const isResolve = action.includes('Yes, issue resolved');
                      const isEscalate = action.includes('create a ticket') || action.includes('Create Support Ticket');

                      return (
                        <button
                          key={i}
                          onClick={() => handleActionClick(action, msg)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-xs flex items-center gap-1.5 ${
                            isResolve
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white font-semibold'
                              : isEscalate
                              ? 'bg-blue-600 hover:bg-blue-700 text-white font-semibold'
                              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {isResolve && <Check className="w-3.5 h-3.5" />}
                          {isEscalate && <FileText className="w-3.5 h-3.5" />}
                          <span>{action}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className={`text-[10px] text-slate-400 ${isUser ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs shrink-0 shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 p-3.5 rounded-2xl rounded-tl-xs text-xs text-slate-500 flex items-center gap-2 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse delay-75"></span>
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse delay-150"></span>
              <span className="text-slate-500 font-medium ml-1">Analyzing issue and retrieving knowledge guides...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="bg-white border border-slate-200 border-t-0 rounded-b-2xl p-4 shadow-xs">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            placeholder="Type your IT issue (e.g., Cannot connect to VPN, Outlook sync error)..."
            className="flex-1 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:outline-hidden text-sm px-4 py-2.5 rounded-xl transition-all"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isTyping}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[11px] text-slate-400 text-center mt-2">
          AI IT Helpdesk Copilot MVP · Powered by POWERGRID Enterprise IT Knowledge Engine
        </p>
      </div>
    </div>
  );
};
