import React, { useRef } from 'react';
import { Lead } from '../types';
import { MOCK_LEADS } from '../constants';
import { Users, Upload, Trash2, Plus } from 'lucide-react';

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
    // In a real app, parse CSV here. For now, just adding mock data to simulate upload success.
    if (e.target.files && e.target.files.length > 0) {
      setTimeout(() => {
        setLeads([...MOCK_LEADS, ...MOCK_LEADS.map(l => ({ ...l, id: `imported_${l.id}_${Date.now()}` }))]);
      }, 500);
    }
  };

  const clearLeads = () => setLeads([]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-600">
          <Users size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Upload Leads</h2>
        <p className="text-slate-500">Import your contact list via CSV or use sample data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upload Area */}
        <div className="md:col-span-1 space-y-4">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-brand-500 hover:bg-brand-50 transition-all h-48"
          >
            <Upload className="text-slate-400 mb-2" size={32} />
            <span className="text-sm font-medium text-slate-600">Click to upload CSV</span>
            <span className="text-xs text-slate-400 mt-1">or drag and drop</span>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".csv,.xlsx" 
              onChange={handleFileUpload}
            />
          </div>

          <button 
            onClick={handleUseMockData}
            className="w-full py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Use Sample Data
          </button>
           <button 
            onClick={clearLeads}
            disabled={leads.length === 0}
            className="w-full py-2 bg-red-50 border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Trash2 size={16} /> Clear List
          </button>
        </div>

        {/* Lead List */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[500px]">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="font-semibold text-slate-700">Imported Leads ({leads.length})</h3>
            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Ready</span>
          </div>
          <div className="overflow-y-auto flex-1 p-0">
            {leads.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Users size={48} className="mb-4 opacity-20" />
                <p>No leads imported yet</p>
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Company</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-6 py-3 font-medium text-slate-900">{lead.name}</td>
                      <td className="px-6 py-3 text-slate-500">{lead.email}</td>
                      <td className="px-6 py-3 text-slate-500">{lead.company}</td>
                      <td className="px-6 py-3">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs capitalize">{lead.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-2 text-slate-600 font-medium hover:text-slate-900"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={leads.length === 0}
          className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Continue
        </button>
      </div>
    </div>
  );
};