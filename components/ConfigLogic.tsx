import React from 'react';
import { CampaignLogic } from '../types';
import { GitBranch, Calendar, Clock, ArrowLeft, Play } from 'lucide-react';

interface ConfigLogicProps {
  logic: CampaignLogic;
  setLogic: (l: CampaignLogic) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ConfigLogic: React.FC<ConfigLogicProps> = ({ logic, setLogic, onNext, onBack }) => {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif font-medium text-brand-900 mb-3">Parameters</h2>
        <p className="text-brand-600 font-light">Define the rules and schedule for your campaign automation.</p>
      </div>

      <div className="bg-white rounded-lg shadow-soft border border-brand-800/5 overflow-hidden">
        <div className="p-10 border-b border-brand-50">
            <h3 className="text-xl font-serif text-brand-900 mb-6 flex items-center gap-3">
                <Clock size={20} className="text-gold-500" />
                Follow-up Rules
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="group">
                    <label className="block text-xs font-bold tracking-widest text-brand-400 uppercase mb-3 group-focus-within:text-brand-700 transition-colors">
                        Wait period (days)
                    </label>
                    <div className="relative">
                        <input 
                            type="number" 
                            min="1"
                            max="30"
                            value={logic.followUpDelayDays}
                            onChange={(e) => setLogic({...logic, followUpDelayDays: parseInt(e.target.value) || 1})}
                            className="w-full pl-0 pr-12 py-2 border-b border-brand-200 focus:border-brand-800 outline-none text-2xl font-serif text-brand-900 bg-transparent"
                        />
                        <span className="absolute right-0 bottom-3 text-brand-300 text-sm font-light">Days</span>
                    </div>
                    <p className="text-xs text-brand-400 mt-2 font-light">Delay before sending the follow-up email.</p>
                </div>

                <div className="group">
                    <label className="block text-xs font-bold tracking-widest text-brand-400 uppercase mb-3 group-focus-within:text-brand-700 transition-colors">
                        Max Follow-ups
                    </label>
                    <input 
                        type="number"
                        min="0"
                        max="5"
                        value={logic.maxFollowUps}
                        onChange={(e) => setLogic({...logic, maxFollowUps: parseInt(e.target.value) || 0})}
                        className="w-full px-0 py-2 border-b border-brand-200 focus:border-brand-800 outline-none text-2xl font-serif text-brand-900 bg-transparent"
                    />
                     <p className="text-xs text-brand-400 mt-2 font-light">Total retries per lead.</p>
                </div>
            </div>
            
            <div className="mt-8 flex items-center gap-3 pt-4">
                <input 
                    type="checkbox" 
                    id="stopOnReply"
                    checked={logic.stopOnReply}
                    onChange={(e) => setLogic({...logic, stopOnReply: e.target.checked})}
                    className="w-5 h-5 text-brand-800 rounded focus:ring-brand-500 border-brand-300 accent-brand-800"
                />
                <label htmlFor="stopOnReply" className="text-sm text-brand-800 select-none cursor-pointer">
                    Stop campaign automatically if lead replies
                </label>
            </div>
        </div>

        <div className="p-10 bg-cream-50">
             <h3 className="text-xl font-serif text-brand-900 mb-6 flex items-center gap-3">
                <Calendar size={20} className="text-gold-500" />
                Schedule
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="group">
                    <label className="block text-xs font-bold tracking-widest text-brand-400 uppercase mb-3">Start Date</label>
                    <input type="date" className="w-full px-0 py-2 border-b border-brand-200 focus:border-brand-800 bg-transparent outline-none text-brand-900" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
                 <div className="group">
                    <label className="block text-xs font-bold tracking-widest text-brand-400 uppercase mb-3">Start Time</label>
                    <input type="time" className="w-full px-0 py-2 border-b border-brand-200 focus:border-brand-800 bg-transparent outline-none text-brand-900" defaultValue="09:00" />
                </div>
            </div>
        </div>
      </div>

      <div className="mt-12 flex justify-between items-center">
        <button onClick={onBack} className="px-6 py-2 text-brand-500 font-medium hover:text-brand-800 flex items-center gap-2 group">
             <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>
        <button onClick={onNext} className="px-8 py-3 bg-brand-800 hover:bg-brand-900 text-cream-100 font-medium rounded shadow-soft transition-all flex items-center gap-3 group">
            <Play size={16} fill="currentColor" />
            <span>Launch Simulation</span>
        </button>
      </div>
    </div>
  );
};