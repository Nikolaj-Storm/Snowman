import React, { useRef } from 'react';
import { Lead } from '../types';
import { MOCK_LEADS } from '../constants';
import { Users, Upload, Trash2, Plus, ArrowRight, ArrowLeft } from 'lucide-react';

interface ConfigLeadsProps {
  leads: Lead[];
  setLeads: (leads: Lead[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ConfigLeads: React.FC<ConfigLeadsProps> = ({ leads, setLeads, onNext, onBack }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUseMockData = () => {
    setLeads([...MOCK_LEADS]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setTimeout(() => {
        setLeads([...MOCK_LEADS, ...MOCK_LEADS.map(l => ({ ...l, id: `imported_${l.id}_${Date.now()}` }))]);
      }, 500);
    }
  };

  const clearLeads = () => setLeads([]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif font-medium text-brand-900 mb-3">Audience</h2>
        <p className="text-brand-600 font-light">Import your contact list or use sample data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Upload Area */}
        <div className="md:col-span-4 space-y-4">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border border-dashed border-brand-300 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-brand-600 hover:bg-white transition-all h-64 group bg-cream-50"
          >
            <div className="p-4 bg-brand-100/50 rounded-full mb-4 text-brand-600 group-hover:bg-brand-800 group-hover:text-cream-100 transition-colors">
              <Upload size={24} strokeWidth={1.5} />
            </div>
            <span className="text-sm font-medium text-brand-900">Upload CSV</span>
            <span className="text-xs text-brand-400 mt-2 font-light">Drag & drop or click to browse</span>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".csv,.xlsx" 
              onChange={handleFileUpload}
            />
          </div>

          <div className="flex gap-2">
            <button 
                onClick={handleUseMockData}
                className="flex-1 py-3 bg-white border border-brand-200 text-brand-700 text-sm font-medium rounded hover:border-brand-400 hover:bg-cream-50 transition-colors flex items-center justify-center gap-2"
            >
                <Plus size={14} /> Sample Data
            </button>
            <button 
                onClick={clearLeads}
                disabled={leads.length === 0}
                className="px-4 py-3 bg-white border border-brand-200 text-brand-700 hover:text-red-700 hover:border-red-200 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
            >
                <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Lead List */}
        <div className="md:col-span-8 bg-white rounded-lg shadow-soft border border-brand-800/5 overflow-hidden flex flex-col h-[500px]">
          <div className="p-6 border-b border-brand-100 bg-white flex justify-between items-center sticky top-0 z-10">
            <h3 className="font-serif font-medium text-brand-900 text-lg">Contact List <span className="text-brand-400 font-sans text-sm ml-2">({leads.length})</span></h3>
          </div>
          <div className="overflow-y-auto flex-1 p-0 scrollbar-thin">
            {leads.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-brand-200">
                <Users size={48} strokeWidth={1} className="mb-4 opacity-50" />
                <p className="font-light">No leads imported</p>
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-brand-500 uppercase tracking-wider bg-cream-50 font-medium border-b border-brand-100 sticky top-0">
                  <tr>
                    <th className="px-6 py-4 font-normal">Name</th>
                    <th className="px-6 py-4 font-normal">Email</th>
                    <th className="px-6 py-4 font-normal">Company</th>
                    <th className="px-6 py-4 font-normal text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-50">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-cream-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-brand-900">{lead.name}</td>
                      <td className="px-6 py-4 text-brand-600 font-light">{lead.email}</td>
                      <td className="px-6 py-4 text-brand-600 font-light">{lead.company}</td>
                      <td className="px-6 py-4 text-right">
                        <span className="px-2 py-1 bg-brand-50 text-brand-700 rounded text-[10px] tracking-widest uppercase">{lead.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <div className="mt-12 flex justify-between items-center">
        <button
          onClick={onBack}
          className="px-6 py-2 text-brand-500 font-medium hover:text-brand-800 flex items-center gap-2 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>
        <button
          onClick={onNext}
          disabled={leads.length === 0}
          className="px-8 py-3 bg-brand-800 hover:bg-brand-900 text-cream-100 font-medium rounded shadow-soft disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-3 group"
        >
          <span>Continue</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};