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
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-indigo-600">AutoFlow</h1>
           </div>
           {state.step < 5 && <div className="text-sm text-slate-500">Draft saved</div>}
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
      <main className="mt-8">
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
    </div>
  );
}

export default App;