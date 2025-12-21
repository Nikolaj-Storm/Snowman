import React, { useState } from 'react';
import { CampaignState } from './types';
import { StepIndicator } from './components/StepIndicator';
import { ConfigSmtp } from './components/ConfigSmtp';
import { ConfigLeads } from './components/ConfigLeads';
import { ConfigTemplate } from './components/ConfigTemplate';
import { ConfigLogic } from './components/ConfigLogic';
import { SimulationDashboard } from './components/SimulationDashboard';

const INITIAL_STATE: CampaignState = {
  step: 1,
  smtp: { host: '', port: '', user: '', pass: '' },
  leads: [],
  template: { subject: '', body: '' },
  followUpTemplate: { subject: '', body: '' },
  logic: { followUpDelayDays: 2, maxFollowUps: 1, stopOnReply: true },
  isRunning: false,
  startDate: new Date().toISOString()
};

function App() {
  const [state, setState] = useState<CampaignState>(INITIAL_STATE);

  const updateState = (updates: Partial<CampaignState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => updateState({ step: state.step + 1 });
  const prevStep = () => updateState({ step: state.step - 1 });
  
  const resetApp = () => {
    if (confirm("Are you sure you want to reset the campaign configuration?")) {
        setState(INITIAL_STATE);
    }
  };

  return (
    <div className="min-h-screen bg-cream-100 text-brand-900 pb-20 font-sans">
      {/* Top Navigation */}
      <header className="bg-cream-100/80 backdrop-blur-sm border-b border-brand-800/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
           <div className="flex items-center gap-3 group cursor-default">
              <div className="w-10 h-10 bg-brand-800 rounded-lg shadow-soft flex items-center justify-center text-cream-100 font-serif font-bold text-xl group-hover:bg-brand-900 transition-colors">A</div>
              <h1 className="text-2xl font-serif font-bold text-brand-900 tracking-tight">AutoFlow</h1>
           </div>
           {state.step < 5 && <div className="text-xs font-medium tracking-widest uppercase text-brand-400">Draft Mode</div>}
        </div>
      </header>

      {/* Step Progress */}
      {state.step < 5 && (
        <StepIndicator 
          currentStep={state.step} 
          onStepClick={(step) => updateState({ step })} 
        />
      )}

      {/* Main Content Area */}
      <main className="mt-12 opacity-0 animate-[fadeIn_0.6s_ease-out_forwards]">
        {state.step === 1 && (
          <ConfigSmtp 
            config={state.smtp} 
            updateConfig={(smtp) => updateState({ smtp })} 
            onNext={nextStep} 
          />
        )}
        {state.step === 2 && (
          <ConfigLeads 
            leads={state.leads}
            setLeads={(leads) => updateState({ leads })}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
        {state.step === 3 && (
          <ConfigTemplate
            template={state.template}
            setTemplate={(template) => updateState({ template })}
            followUpTemplate={state.followUpTemplate}
            setFollowUpTemplate={(followUpTemplate) => updateState({ followUpTemplate })}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
        {state.step === 4 && (
          <ConfigLogic
            logic={state.logic}
            setLogic={(logic) => updateState({ logic })}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
        {state.step === 5 && (
          <SimulationDashboard 
            state={state}
            onReset={resetApp}
          />
        )}
      </main>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default App;