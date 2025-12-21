import React from 'react';
import { CampaignLogic } from '../types';
import { GitBranch, Calendar, Clock } from 'lucide-react';

interface ConfigLogicProps {
  logic: CampaignLogic;
  setLogic: (l: CampaignLogic) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ConfigLogic: React.FC<ConfigLogicProps> = ({ logic, setLogic, onNext, onBack }) => {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-600">
          <GitBranch size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Campaign Logic & Schedule</h2>
        <p className="text-slate-500">Define how the automation should behave.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Clock size={20} className="text-slate-400" />
                Follow-up Rules
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Wait period (days)
                    </label>
                    <div className="relative">
                        <input 
                            type="number" 
                            min="1"
                            max="30"
                            value={logic.followUpDelayDays}
                            onChange={(e) => setLogic({...logic, followUpDelayDays: parseInt(e.target.value) || 1})}
                            className="w-full pl-4 pr-12 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                        />
                        <span className="absolute right-4 top-2 text-slate-400 text-sm">Days</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Time to wait before sending follow-up if not opened.</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Max Follow-ups
                    </label>
                    <input 
                        type="number"
                        min="0"
                        max="5"
                        value={logic.maxFollowUps}
                        onChange={(e) => setLogic({...logic, maxFollowUps: parseInt(e.target.value) || 0})}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                     <p className="text-xs text-slate-400 mt-1">Number of retry attempts.</p>
                </div>
            </div>
            
            <div className="mt-6 flex items-center gap-3">
                <input 
                    type="checkbox" 
                    id="stopOnReply"
                    checked={logic.stopOnReply}
                    onChange={(e) => setLogic({...logic, stopOnReply: e.target.checked})}
                    className="w-5 h-5 text-brand-600 rounded focus:ring-brand-500 border-gray-300"
                />
                <label htmlFor="stopOnReply" className="text-sm text-slate-700 select-none">
                    Stop campaign automatically if lead replies
                </label>
            </div>
        </div>

        <div className="p-6 bg-slate-50/50">
             <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-slate-400" />
                Schedule
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
                    <input type="date" className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Start Time</label>
                    <input type="time" className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white" defaultValue="09:00" />
                </div>
            </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button onClick={onBack} className="px-6 py-2 text-slate-600 font-medium hover:text-slate-900">Back</button>
        <button onClick={onNext} className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg shadow-md transition-all">Start Simulation</button>
      </div>
    </div>
  );
};