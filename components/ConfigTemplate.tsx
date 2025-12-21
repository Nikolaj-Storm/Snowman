import React, { useState } from 'react';
import { EmailTemplate } from '../types';
import { generateEmailTemplate } from '../services/geminiService';
import { Edit3, Sparkles, MessageSquare } from 'lucide-react';

interface ConfigTemplateProps {
  template: EmailTemplate;
  setTemplate: (t: EmailTemplate) => void;
  followUpTemplate: EmailTemplate;
  setFollowUpTemplate: (t: EmailTemplate) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ConfigTemplate: React.FC<ConfigTemplateProps> = ({ 
  template, setTemplate, followUpTemplate, setFollowUpTemplate, onNext, onBack 
}) => {
  const [activeTab, setActiveTab] = useState<'initial' | 'followup'>('initial');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAiGenerate = async () => {
    if (!aiPrompt) return;
    setIsGenerating(true);
    try {
      const generated = await generateEmailTemplate(aiPrompt, "Business Professionals", "Professional yet friendly");
      if (activeTab === 'initial') {
        setTemplate(generated);
      } else {
        setFollowUpTemplate(generated);
      }
    } catch (error) {
      alert("Failed to generate template. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const currentTemplate = activeTab === 'initial' ? template : followUpTemplate;
  const updateCurrent = (updates: Partial<EmailTemplate>) => {
    if (activeTab === 'initial') {
      setTemplate({ ...template, ...updates });
    } else {
      setFollowUpTemplate({ ...followUpTemplate, ...updates });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-600">
          <Edit3 size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Design Email Templates</h2>
        <p className="text-slate-500">Create your initial outreach and follow-up emails manually or with AI.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex gap-2 bg-slate-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('initial')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'initial' ? 'bg-white shadow text-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Initial Email
            </button>
            <button
              onClick={() => setActiveTab('followup')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'followup' ? 'bg-white shadow text-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Follow-up Email
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Subject Line</label>
              <input
                type="text"
                value={currentTemplate.subject}
                onChange={(e) => updateCurrent({ subject: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                placeholder="e.g. Quick question about {company}"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex justify-between">
                <span>Email Body</span>
                <span className="text-xs text-slate-400">Supports &#123;name&#125;, &#123;company&#125;</span>
              </label>
              <textarea
                value={currentTemplate.body}
                onChange={(e) => updateCurrent({ body: e.target.value })}
                rows={12}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none font-mono text-sm"
                placeholder="Hi {name}, ..."
              />
            </div>
          </div>
        </div>

        {/* AI Assistant Column */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-6 h-full">
            <div className="flex items-center gap-2 mb-4 text-indigo-700 font-semibold">
              <Sparkles size={20} />
              <h3>Gemini Assistant</h3>
            </div>
            <p className="text-sm text-indigo-600/80 mb-6">
              Stuck on what to write? Let Gemini generate a high-converting email for you.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-indigo-800 uppercase tracking-wide mb-2">
                  What is this email about?
                </label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="w-full p-3 rounded-lg border border-indigo-200 bg-white focus:ring-2 focus:ring-indigo-400 outline-none text-sm"
                  rows={4}
                  placeholder="e.g. Offering web development services to startups..."
                />
              </div>

              <button
                onClick={handleAiGenerate}
                disabled={isGenerating || !aiPrompt}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <span className="animate-pulse">Generating...</span>
                ) : (
                  <>
                    <Sparkles size={18} /> Generate Draft
                  </>
                )}
              </button>
            </div>
            
            <div className="mt-8 pt-6 border-t border-indigo-200/50">
              <div className="flex items-start gap-3">
                 <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                    <MessageSquare size={16} />
                 </div>
                 <div>
                    <h4 className="text-sm font-semibold text-indigo-900">Pro Tip</h4>
                    <p className="text-xs text-indigo-700 mt-1">
                        Use specific details about the pain points of your target audience for better results.
                    </p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button onClick={onBack} className="px-6 py-2 text-slate-600 font-medium hover:text-slate-900">Back</button>
        <button onClick={onNext} className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg shadow-md transition-all">Continue</button>
      </div>
    </div>
  );
};