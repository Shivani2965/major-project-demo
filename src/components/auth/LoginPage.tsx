import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DEMO_PRESET_ACCOUNTS } from '../../data/mockData';
import { UserRole } from '../../types';
import {
  Lock,
  Mail,
  Shield,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { loginAs, users } = useApp();

  const [email, setEmail] = useState('priya.sharma@example.com');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (matchedUser) {
      loginAs(matchedUser);
    } else {
      setErrorMsg('User not found. Please try one of the demo preset accounts below.');
    }
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    const matchedUser = users.find(u => u.role === role);
    if (matchedUser) {
      loginAs(matchedUser);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Logo and branding */}
        <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl mx-auto shadow-md">
          PG
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
          POWERGRID IT Helpdesk
        </h1>
        <p className="mt-1 text-xs text-slate-500 font-mono tracking-wider">
          AI-POWERED IT SERVICES COPILOT · SIH25195
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-200">
          <form onSubmit={handleManualLogin} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Corporate Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:bg-white focus:border-blue-500 transition-colors"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:bg-white focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => alert('For this demo, please select one of the Quick Demo Login accounts below.')}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors mt-2"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Accounts Selection */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 text-center">
              Quick Demo Access
            </p>

            <div className="space-y-2">
              {DEMO_PRESET_ACCOUNTS.map(acc => (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => handleQuickDemoLogin(acc.role as UserRole)}
                  className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        acc.role === 'admin'
                          ? 'bg-rose-100 text-rose-700'
                          : acc.role === 'agent'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {acc.role[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {acc.name}
                      </p>
                      <p className="text-[11px] text-slate-500">{acc.roleTitle}</p>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                    Sign in as {acc.role}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          SIH25195 MVP Demo · POWERGRID Corporation of India Limited
        </p>
      </div>
    </div>
  );
};
