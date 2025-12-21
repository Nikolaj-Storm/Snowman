import React, { useEffect, useState, useRef } from 'react';
import { CampaignState, Lead } from '../types';
import { analyzeCampaignPerformance } from '../services/geminiService';
import { Play, Pause, RefreshCw, Mail, CheckCircle, XCircle, Send, MessageCircle, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface SimulationDashboardProps {
  state: CampaignState;
  onReset: () => void;
}

export const SimulationDashboard: React.FC<SimulationDashboardProps> = ({ state, onReset }) => {
  const [leads, setLeads] = useState<Lead[]>(state.leads);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<string>('');
  const [simDay, setSimDay] = useState(1);
  
  const intervalRef = useRef<any>(null);

  const addLog = (msg: string) => {
    setLogs(prev => [`[Day ${simDay}] ${msg}`, ...prev].slice(0, 50));
  };

  // Simulation Logic Tick
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSimDay(d => d + 1);
        
        setLeads(prevLeads => {
          const newLeads = [...prevLeads];
          let activityCount = 0;

          newLeads.forEach(lead => {
            // Random chance generator (0 to 100)
            const roll = Math.random() * 100;

            if (lead.status === 'pending') {
              // Send initial email
              lead.status = 'sent';
              addLog(`Sent initial email to ${lead.email}`);
              lead.history.push({ timestamp: new Date(), event: 'Initial Email Sent' });
              activityCount++;
            } else if (lead.status === 'sent') {
              // Chance to open (30%)
              if (roll < 30) {
                lead.status = 'opened';
                addLog(`${lead.email} opened the email`);
                lead.history.push({ timestamp: new Date(), event: 'Email Opened' });
              } else if (roll > 90) {
                 // Bounce (10%)
                 lead.status = 'bounced';
                 addLog(`Email to ${lead.email} bounced`);
              } else {
                 // Check if we need to schedule follow up based on wait days logic (simplified for sim)
                 // In this fast-forward sim, we assume enough time passes every tick
                 lead.status = 'waiting_followup';
              }
            } else if (lead.status === 'waiting_followup') {
              // Send follow up
              lead.status = 'followup_sent';
              addLog(`Sent follow-up to ${lead.email}`);
              lead.history.push({ timestamp: new Date(), event: 'Follow-up Sent' });
            } else if (lead.status === 'followup_sent') {
               // Higher chance to open followup (40%)
               if (roll < 40) {
                 lead.status = 'opened';
                 addLog(`${lead.email} opened the follow-up`);
               } else if (roll > 95) {
                 lead.status = 'bounced';
               }
            } else if (lead.status === 'opened') {
              // Chance to reply (20%)
              if (roll < 20) {
                lead.status = 'replied';
                addLog(`Reply received from ${lead.email}!`);
                lead.history.push({ timestamp: new Date(), event: 'Replied' });
              } else {
                lead.status = 'completed'; // Opened but no reply, end of flow for sim
              }
            }
          });

          // Auto-pause if all complete
          const active = newLeads.filter(l => ['pending', 'sent', 'waiting_followup', 'followup_sent', 'opened'].includes(l.status));
          if (active.length === 0 && activityCount === 0) {
            setIsRunning(false);
            addLog("Campaign Simulation Finished.");
            generateAnalysis(newLeads);
          }

          return newLeads;
        });

      }, 1500); // 1.5 seconds per "Day"
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, simDay]);

  const generateAnalysis = async (finalLeads: Lead[]) => {
      const stats = {
          sent: finalLeads.filter(l => l.status !== 'pending').length,
          opened: finalLeads.filter(l => ['opened', 'replied', 'completed'].includes(l.status)).length,
          replied: finalLeads.filter(l => l.status === 'replied').length,
          bounced: finalLeads.filter(l => l.status === 'bounced').length
      };
      setAnalysis("Analyzing results with Gemini...");
      const result = await analyzeCampaignPerformance(stats);
      setAnalysis(result);
  }

  const stats = {
    total: leads.length,
    sent: leads.filter(l => l.status !== 'pending').length,
    opened: leads.filter(l => ['opened', 'replied', 'completed'].includes(l.status)).length,
    replied: leads.filter(l => l.status === 'replied').length,
    bounced: leads.filter(l => l.status === 'bounced').length
  };

  const chartData = [
    { name: 'Sent', value: stats.sent, color: '#3b82f6' },
    { name: 'Opened', value: stats.opened, color: '#f59e0b' },
    { name: 'Replied', value: stats.replied, color: '#10b981' },
    { name: 'Bounced', value: stats.bounced, color: '#ef4444' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
        {/* Header Controls */}
        <div className="flex justify-between items-center mb-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Campaign Dashboard</h2>
                <p className="text-slate-500">Live simulation of your workflow.</p>
            </div>
            <div className="flex gap-4">
                 <button 
                    onClick={() => setIsRunning(!isRunning)}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium text-white transition-all ${isRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-600 hover:bg-green-700'}`}
                >
                    {isRunning ? <><Pause size={20}/> Pause</> : <><Play size={20}/> {simDay > 1 ? 'Resume' : 'Start Campaign'}</>}
                </button>
                 <button 
                    onClick={onReset}
                    className="flex items-center gap-2 px-6 py-2 bg-white border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50"
                >
                    <RefreshCw size={20}/> Reset
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* KPI Cards */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                <div>
                    <p className="text-slate-500 text-sm font-medium uppercase">Emails Sent</p>
                    <h3 className="text-3xl font-bold text-slate-800">{stats.sent}</h3>
                </div>
                <div className="p-3 bg-blue-100 rounded-full text-blue-600"><Send size={24} /></div>
            </div>
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                <div>
                    <p className="text-slate-500 text-sm font-medium uppercase">Open Rate</p>
                    <h3 className="text-3xl font-bold text-slate-800">
                        {stats.sent > 0 ? Math.round((stats.opened / stats.sent) * 100) : 0}%
                    </h3>
                </div>
                <div className="p-3 bg-amber-100 rounded-full text-amber-600"><Mail size={24} /></div>
            </div>
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                <div>
                    <p className="text-slate-500 text-sm font-medium uppercase">Reply Rate</p>
                    <h3 className="text-3xl font-bold text-slate-800">
                         {stats.sent > 0 ? Math.round((stats.replied / stats.sent) * 100) : 0}%
                    </h3>
                </div>
                <div className="p-3 bg-green-100 rounded-full text-green-600"><MessageCircle size={24} /></div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
            {/* Live Visual Graph */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2"><BarChart2 size={18}/> Performance Overview</h3>
                    <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">Day {simDay}</span>
                </div>
                
                <div className="flex-1 w-full min-h-[300px]">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip 
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                cursor={{fill: 'transparent'}}
                            />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* AI Analysis Box */}
                <div className="mt-4 p-4 bg-gradient-to-r from-violet-50 to-fuchsia-50 rounded-lg border border-violet-100">
                    <h4 className="text-sm font-semibold text-violet-800 mb-1">Gemini Insight</h4>
                    <p className="text-sm text-slate-700 italic">
                        {analysis || "Waiting for campaign data to generate insights..."}
                    </p>
                </div>
            </div>

            {/* Live Logs */}
            <div className="lg:col-span-1 bg-slate-900 text-slate-200 p-6 rounded-xl shadow-sm border border-slate-800 flex flex-col overflow-hidden">
                <h3 className="font-mono text-sm uppercase tracking-wider text-slate-500 mb-4">System Activity</h3>
                <div className="flex-1 overflow-y-auto font-mono text-xs space-y-2 pr-2">
                    {logs.length === 0 && <span className="text-slate-600">Waiting to start...</span>}
                    {logs.map((log, i) => (
                        <div key={i} className="flex gap-2">
                            <span className="text-slate-500">&gt;</span>
                            <span className={log.includes('bounced') ? 'text-red-400' : log.includes('opened') ? 'text-amber-400' : log.includes('Reply') ? 'text-green-400' : 'text-blue-300'}>
                                {log}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Lead Table Status */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-100 font-semibold text-slate-700">Lead Status Tracking</div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                     <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                        <tr>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Last Event</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leads.slice(0, 10).map(lead => (
                            <tr key={lead.id} className="border-b border-slate-100">
                                <td className="px-6 py-3 text-slate-900 font-medium">{lead.email}</td>
                                <td className="px-6 py-3">
                                    <span className={`px-2 py-1 rounded text-xs uppercase font-bold
                                        ${lead.status === 'replied' ? 'bg-green-100 text-green-700' : 
                                          lead.status === 'bounced' ? 'bg-red-100 text-red-700' : 
                                          lead.status === 'opened' ? 'bg-amber-100 text-amber-700' : 
                                          'bg-slate-100 text-slate-600'}`}>
                                        {lead.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-3 text-slate-500">
                                    {lead.history.length > 0 ? lead.history[lead.history.length - 1].event : '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {leads.length > 10 && <div className="p-3 text-center text-xs text-slate-500 bg-slate-50">Showing 10 of {leads.length} leads</div>}
        </div>
    </div>
  );
};