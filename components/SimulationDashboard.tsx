import React, { useEffect, useState, useRef } from 'react';
import { CampaignState, Lead } from '../types';
import { analyzeCampaignPerformance } from '../services/geminiService';
import { Play, Pause, RefreshCw, Mail, Send, MessageCircle, BarChart2, Terminal } from 'lucide-react';
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
    { name: 'Sent', value: stats.sent, color: '#30664e' },    // Brand 600
    { name: 'Opened', value: stats.opened, color: '#c5a059' }, // Gold 500
    { name: 'Replied', value: stats.replied, color: '#1a4231' }, // Brand 800
    { name: 'Bounced', value: stats.bounced, color: '#9f1239' }, // Red (custom deep)
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
        {/* Header Controls */}
        <div className="flex justify-between items-center mb-10">
            <div>
                <h2 className="text-3xl font-serif font-medium text-brand-900">Live Dashboard</h2>
                <p className="text-brand-600 font-light mt-1">Monitoring active campaign performance.</p>
            </div>
            <div className="flex gap-4">
                 <button 
                    onClick={() => setIsRunning(!isRunning)}
                    className={`flex items-center gap-2 px-6 py-2 rounded font-medium text-cream-100 transition-all shadow-soft ${isRunning ? 'bg-gold-600 hover:bg-gold-700' : 'bg-brand-800 hover:bg-brand-900'}`}
                >
                    {isRunning ? <><Pause size={18} fill="currentColor"/> Pause</> : <><Play size={18} fill="currentColor"/> {simDay > 1 ? 'Resume' : 'Start Campaign'}</>}
                </button>
                 <button 
                    onClick={onReset}
                    className="flex items-center gap-2 px-6 py-2 bg-white border border-brand-200 rounded font-medium text-brand-700 hover:bg-cream-50"
                >
                    <RefreshCw size={18}/> Reset
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* KPI Cards */}
            <div className="bg-white p-6 rounded shadow-soft border border-brand-800/5 flex items-center justify-between group hover:border-brand-200 transition-all">
                <div>
                    <p className="text-brand-400 text-xs font-bold tracking-widest uppercase">Emails Sent</p>
                    <h3 className="text-4xl font-serif text-brand-900 mt-2">{stats.sent}</h3>
                </div>
                <div className="p-4 bg-cream-50 rounded-full text-brand-600 group-hover:bg-brand-800 group-hover:text-cream-100 transition-colors"><Send size={20} /></div>
            </div>
             <div className="bg-white p-6 rounded shadow-soft border border-brand-800/5 flex items-center justify-between group hover:border-brand-200 transition-all">
                <div>
                    <p className="text-brand-400 text-xs font-bold tracking-widest uppercase">Open Rate</p>
                    <h3 className="text-4xl font-serif text-brand-900 mt-2">
                        {stats.sent > 0 ? Math.round((stats.opened / stats.sent) * 100) : 0}%
                    </h3>
                </div>
                <div className="p-4 bg-cream-50 rounded-full text-brand-600 group-hover:bg-gold-500 group-hover:text-white transition-colors"><Mail size={20} /></div>
            </div>
             <div className="bg-white p-6 rounded shadow-soft border border-brand-800/5 flex items-center justify-between group hover:border-brand-200 transition-all">
                <div>
                    <p className="text-brand-400 text-xs font-bold tracking-widest uppercase">Reply Rate</p>
                    <h3 className="text-4xl font-serif text-brand-900 mt-2">
                         {stats.sent > 0 ? Math.round((stats.replied / stats.sent) * 100) : 0}%
                    </h3>
                </div>
                <div className="p-4 bg-cream-50 rounded-full text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors"><MessageCircle size={20} /></div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
            {/* Live Visual Graph */}
            <div className="lg:col-span-2 bg-white p-8 rounded shadow-soft border border-brand-800/5 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-serif text-xl text-brand-900 flex items-center gap-2"><BarChart2 size={20} className="text-gold-500"/> Performance</h3>
                    <span className="text-xs font-bold tracking-widest uppercase bg-brand-50 text-brand-600 px-3 py-1 rounded-full">Day {simDay}</span>
                </div>
                
                <div className="flex-1 w-full min-h-[300px]">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" stroke="#94a3b8" tick={{fontFamily: 'sans-serif', fontSize: 12}} />
                            <YAxis stroke="#94a3b8" tick={{fontFamily: 'sans-serif', fontSize: 12}} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '4px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontFamily: 'serif' }}
                                cursor={{fill: 'transparent'}}
                            />
                            <Bar dataKey="value" radius={[2, 2, 0, 0]} barSize={60}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* AI Analysis Box */}
                <div className="mt-6 p-5 bg-brand-50 rounded border border-brand-100">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-brand-800 mb-2">Gemini Insight</h4>
                    <p className="text-sm text-brand-700 italic font-serif leading-relaxed">
                        {analysis || "Gathering data for performance analysis..."}
                    </p>
                </div>
            </div>

            {/* Live Logs - Terminal Style */}
            <div className="lg:col-span-1 bg-brand-950 text-brand-100 p-6 rounded shadow-soft border border-brand-900 flex flex-col overflow-hidden relative">
                <div className="flex items-center gap-2 mb-4 border-b border-brand-800 pb-4">
                    <Terminal size={16} className="text-gold-500" />
                    <h3 className="font-mono text-xs uppercase tracking-widest text-brand-400">System Activity</h3>
                </div>
                
                <div className="flex-1 overflow-y-auto font-mono text-xs space-y-3 pr-2 scrollbar-thin scrollbar-thumb-brand-800">
                    {logs.length === 0 && <span className="text-brand-700 italic">Waiting for command...</span>}
                    {logs.map((log, i) => (
                        <div key={i} className="flex gap-3 leading-relaxed opacity-0 animate-[fadeIn_0.3s_ease-out_forwards]">
                            <span className="text-brand-600 shrink-0">&gt;</span>
                            <span className={
                                log.includes('bounced') ? 'text-red-400' : 
                                log.includes('opened') ? 'text-gold-400' : 
                                log.includes('Reply') ? 'text-emerald-400' : 
                                'text-brand-100'
                            }>
                                {log}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Lead Table Status */}
        <div className="mt-8 bg-white rounded shadow-soft border border-brand-800/5 overflow-hidden">
            <div className="p-6 bg-cream-50 border-b border-brand-100 font-serif font-medium text-brand-900">Live Status Tracking</div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                     <thead className="text-xs text-brand-400 uppercase tracking-widest bg-white font-bold">
                        <tr>
                            <th className="px-6 py-4 font-normal">Email</th>
                            <th className="px-6 py-4 font-normal">Current Status</th>
                            <th className="px-6 py-4 font-normal">Last Event</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-50">
                        {leads.slice(0, 10).map(lead => (
                            <tr key={lead.id} className="hover:bg-cream-50 transition-colors">
                                <td className="px-6 py-4 text-brand-900 font-medium">{lead.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-[10px] uppercase tracking-widest font-bold
                                        ${lead.status === 'replied' ? 'bg-emerald-50 text-emerald-800' : 
                                          lead.status === 'bounced' ? 'bg-red-50 text-red-800' : 
                                          lead.status === 'opened' ? 'bg-gold-50 text-gold-700' : 
                                          'bg-brand-50 text-brand-600'}`}>
                                        {lead.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-brand-500 font-light">
                                    {lead.history.length > 0 ? lead.history[lead.history.length - 1].event : '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {leads.length > 10 && <div className="p-4 text-center text-xs text-brand-400 bg-white border-t border-brand-50 uppercase tracking-widest">Showing 10 of {leads.length} leads</div>}
        </div>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateX(-5px); }
            to { opacity: 1; transform: translateX(0); }
          }
        `}</style>
    </div>
  );
};