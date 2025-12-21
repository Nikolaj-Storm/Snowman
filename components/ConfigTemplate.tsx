import React, { useState } from 'react';
import { EmailTemplate } from '../types';
import { generateEmailTemplate } from '../services/geminiService';
import { Edit3, Sparkles, MessageSquare, ArrowRight, ArrowLeft } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif font-medium text-brand-900 mb-3">Compose</h2>
        <p className="text-brand-600 font-light">Craft your message manually or invoke the AI assistant.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex gap-1 border-b border-brand-200 w-full">
            <button
              onClick={() => setActiveTab('initial')}
              className={`px-6 py-3 text-sm font-medium tracking-wide transition-all border-b-2 ${activeTab === 'initial' ? 'border-brand-800 text-brand-900' : 'border-transparent text-brand-400 hover:text-brand-600'}`}
            >
              Initial Email
            </button>
            <button
              onClick={() => setActiveTab('followup')}
              className={`px-6 py-3 text-sm font-medium tracking-wide transition-all border-b-2 ${activeTab === 'followup' ? 'border-brand-800 text-brand-900' : 'border-transparent text-brand-400 hover:text-brand-600'}`}
            >
              Follow-up
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-soft border border-brand-800/5 p-8 space-y-6">
            <div className="space-y-2">
              <input
                type="text"
                value={currentTemplate.subject}
                onChange={(e) => updateCurrent({ subject: e.target.value })}
                className="w-full px-0 py-3 text-xl font-serif text-brand-900 placeholder:text-brand-300 border-b border-brand-100 focus:border-brand-800 outline-none bg-transparent transition-colors"
                placeholder="Subject Line..."
              />
            </div>
            <div className="space-y-2">
              <textarea
                value={currentTemplate.body}
                onChange={(e) => updateCurrent({ body: e.target.value })}
                rows={16}
                className="w-full px-4 py-4 rounded bg-cream-50/50 border border-brand-100 focus:border-brand-400 focus:bg-white outline-none font-sans text-brand-800 leading-relaxed resize-none transition-all placeholder:text-brand-200"
                placeholder="Write your email content here... Use {name} and {company} as variables."
              />
              <div className="flex justify-end text-xs text-brand-400 font-medium uppercase tracking-wider">
                Variables: &#123;name&#125;, &#123;company&#125;
              </div>
            </div>
          </div>
        </div>

        {/* AI Assistant Column */}
        <div className="lg:col-span-4">
          <div className="bg-brand-900 text-cream-100 rounded-lg p-8 h-full shadow-soft flex flex-col relative overflow-hidden">
            {/* Decorative texture */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-800 rounded-full blur-3xl -mr-10 -mt-10 opacity-50"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6 text-gold-500">
                <Sparkles size={20} />
                <h3 className="font-serif text-xl italic">Gemini Assistant</h3>
              </div>
              
              <p className="text-sm text-brand-200 font-light mb-8 leading-relaxed">
                Describe the purpose of your email, and let our AI craft a professional draft tailored to your tone.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-3">
                    Prompt
                  </label>
                  <textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="w-full p-4 rounded bg-brand-950/50 border border-brand-700 text-cream-100 focus:border-gold-500/50 outline-none text-sm transition-colors placeholder:text-brand-700"
                    rows={6}
                    placeholder="e.g. Introduce our new design agency to potential startup clients..."
                  />
                </div>

                <button
                  onClick={handleAiGenerate}
                  disabled={isGenerating || !aiPrompt}
                  className="w-full py-3 bg-gold-500 hover:bg-gold-600 text-brand-950 font-bold rounded shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:grayscale"
                >
                  {isGenerating ? (
                    <span className="animate-pulse">Crafting...</span>
                  ) : (
                    <>
                      <Sparkles size={16} /> Generate Draft
                    </>
                  )}
                </button>
              </div>
              
              <div className="mt-12 pt-6 border-t border-brand-800">
                 <div className="flex gap-3">
                    <MessageSquare size={16} className="text-brand-400 mt-1 shrink-0" />
                    <p className="text-xs text-brand-300 leading-normal">
                        <span className="text-gold-500 font-bold uppercase text-[10px] tracking-widest block mb-1">Tip</span>
                        Be specific about the audience pain points for higher conversion rates.
                    </p>
                 </div>
              </div>
            </div>
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
          className="px-8 py-3 bg-brand-800 hover:bg-brand-900 text-cream-100 font-medium rounded shadow-soft transition-all flex items-center gap-3 group"
        >
          <span>Continue</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};