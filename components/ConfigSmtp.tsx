import React from 'react';
import { SmtpConfig } from '../types';
import { Server, Lock, User, Globe } from 'lucide-react';

interface ConfigSmtpProps {
  config: SmtpConfig;
  updateConfig: (config: SmtpConfig) => void;
  onNext: () => void;
}

export const ConfigSmtp: React.FC<ConfigSmtpProps> = ({ config, updateConfig, onNext }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateConfig({ ...config, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-600">
          <Server size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Connect Email SMTP</h2>
        <p className="text-slate-500">Configure your outgoing mail server to start sending campaigns.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Globe size={16} /> Host
            </label>
            <input
              type="text"
              name="host"
              value={config.host}
              onChange={handleChange}
              placeholder="smtp.gmail.com"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Server size={16} /> Port
            </label>
            <input
              type="text"
              name="port"
              value={config.port}
              onChange={handleChange}
              placeholder="587"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <User size={16} /> Username
            </label>
            <input
              type="text"
              name="user"
              value={config.user}
              onChange={handleChange}
              placeholder="you@company.com"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Lock size={16} /> Password
            </label>
            <input
              type="password"
              name="pass"
              value={config.pass}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            onClick={onNext}
            className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg shadow-md transition-all transform hover:translate-y-[-1px]"
          >
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  );
};