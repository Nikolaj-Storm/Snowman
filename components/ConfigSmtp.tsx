import React from 'react';
import { SmtpConfig } from '../types';
import { Server, Lock, User, Globe, ArrowRight } from 'lucide-react';

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
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif font-medium text-brand-900 mb-3">Connect Server</h2>
        <p className="text-brand-600 font-light">Configure your outgoing mail server settings.</p>
      </div>

      <div className="bg-white rounded-lg shadow-soft border border-brand-800/5 p-10 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
          <div className="space-y-1 group">
            <label className="text-xs font-bold tracking-widest text-brand-400 uppercase flex items-center gap-2 mb-2 group-focus-within:text-brand-700 transition-colors">
              <Globe size={14} /> Host
            </label>
            <input
              type="text"
              name="host"
              value={config.host}
              onChange={handleChange}
              placeholder="smtp.gmail.com"
              className="w-full pb-2 bg-transparent border-b border-brand-200 focus:border-brand-800 outline-none transition-all placeholder:text-brand-200 text-brand-900"
            />
          </div>
          <div className="space-y-1 group">
            <label className="text-xs font-bold tracking-widest text-brand-400 uppercase flex items-center gap-2 mb-2 group-focus-within:text-brand-700 transition-colors">
              <Server size={14} /> Port
            </label>
            <input
              type="text"
              name="port"
              value={config.port}
              onChange={handleChange}
              placeholder="587"
              className="w-full pb-2 bg-transparent border-b border-brand-200 focus:border-brand-800 outline-none transition-all placeholder:text-brand-200 text-brand-900"
            />
          </div>
          <div className="space-y-1 group">
            <label className="text-xs font-bold tracking-widest text-brand-400 uppercase flex items-center gap-2 mb-2 group-focus-within:text-brand-700 transition-colors">
              <User size={14} /> Username
            </label>
            <input
              type="text"
              name="user"
              value={config.user}
              onChange={handleChange}
              placeholder="you@company.com"
              className="w-full pb-2 bg-transparent border-b border-brand-200 focus:border-brand-800 outline-none transition-all placeholder:text-brand-200 text-brand-900"
            />
          </div>
          <div className="space-y-1 group">
            <label className="text-xs font-bold tracking-widest text-brand-400 uppercase flex items-center gap-2 mb-2 group-focus-within:text-brand-700 transition-colors">
              <Lock size={14} /> Password
            </label>
            <input
              type="password"
              name="pass"
              value={config.pass}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full pb-2 bg-transparent border-b border-brand-200 focus:border-brand-800 outline-none transition-all placeholder:text-brand-200 text-brand-900"
            />
          </div>
        </div>

        <div className="pt-8 flex justify-end">
          <button
            onClick={onNext}
            className="group px-8 py-3 bg-brand-800 hover:bg-brand-900 text-cream-100 font-medium rounded shadow-soft transition-all transform flex items-center gap-3"
          >
            <span>Save & Continue</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};