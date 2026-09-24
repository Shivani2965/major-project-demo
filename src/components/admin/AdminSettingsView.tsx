import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Sparkles,
  Shield,
  Bell,
  RefreshCw,
  Sliders,
  CheckCircle2,
  Database,
  Info,
} from 'lucide-react';

export const AdminSettingsView: React.FC = () => {
  const { resetDemoData, showToast } = useApp();

  const [aiClassification, setAiClassification] = useState(true);
  const [autoRouting, setAutoRouting] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState(80);
  const [slaAlerts, setSlaAlerts] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);

  const handleSaveSettings = () => {
    showToast('System configuration saved successfully', 'success');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Helpdesk Configuration & Settings
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Adjust AI classification thresholds, SLA monitoring alerts, and enterprise data resets.
        </p>
      </div>

      {/* AI Engine Settings */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">AI Copilot & Automation Engine</h3>
            <p className="text-xs text-slate-500">SIH25195 Smart Classification & Vector Matching Engine</p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-800">Automated Semantic Issue Classification</p>
              <p className="text-xs text-slate-500">
                Analyze ticket descriptions and predict category and priority taxonomy.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={aiClassification}
                onChange={e => setAiClassification(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-800">Auto-Routing by Assigned Team SLA</p>
              <p className="text-xs text-slate-500">
                Instantly route incoming tickets directly to the specialist queue.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoRouting}
                onChange={e => setAutoRouting(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="pt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-slate-800">AI Confidence Routing Threshold</span>
              <span className="font-mono tabular-nums font-semibold text-blue-600">{confidenceThreshold}%</span>
            </div>
            <input
              type="range"
              min={50}
              max={95}
              step={5}
              value={confidenceThreshold}
              onChange={e => setConfidenceThreshold(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Tickets with confidence score above {confidenceThreshold}% are automatically tagged and routed without manual review.
            </p>
          </div>
        </div>
      </div>

      {/* SLA & Notifications */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">SLA & Breach Notifications</h3>
            <p className="text-xs text-slate-500">Automated paging and incident alerting</p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-800">SLA Breach Escalation Warnings</p>
              <p className="text-xs text-slate-500">Notify shift supervisor when a ticket is within 1 hour of breach.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={slaAlerts}
                onChange={e => setSlaAlerts(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSaveSettings}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs"
          >
            Save Configuration
          </button>
        </div>
      </div>

      {/* Problem Statement Context / Hackathon Info */}
      <div className="bg-slate-900 text-slate-300 rounded-2xl border border-slate-800 p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <Info className="w-4 h-4 text-blue-400" />
          <span>About Smart Helpdesk Solution · SIH25195</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Developed for <strong className="text-white">POWERGRID Corporation of India Limited, Ministry of Power</strong> to eliminate fragmented IT reporting, streamline manual ticket classification and routing, and deliver instant self-service support.
        </p>
        <div className="pt-1 flex flex-wrap gap-2 text-[11px] font-mono text-slate-400">
          <span className="bg-slate-800 px-2 py-1 rounded">Smart India Hackathon</span>
          <span className="bg-slate-800 px-2 py-1 rounded">Enterprise IT Support</span>
          <span className="bg-slate-800 px-2 py-1 rounded">MVP v1.0.0</span>
        </div>
      </div>

      {/* Danger Zone / Reset Demo Data */}
      <div className="bg-white rounded-2xl border border-rose-200 p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-rose-900 text-sm">Demo Data Management</h3>
            <p className="text-xs text-slate-500">
              Reset all tickets, knowledge ratings, and users back to pristine factory demo state.
            </p>
          </div>
          <button
            onClick={resetDemoData}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
