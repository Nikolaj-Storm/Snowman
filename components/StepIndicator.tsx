import React from 'react';
import { STEPS } from '../constants';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, onStepClick }) => {
  return (
    <div className="w-full py-8 px-4 bg-cream-100 border-b border-brand-800/5">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between relative">
          {/* Connecting Line */}
          <div className="absolute left-0 top-[18px] transform w-full h-[1px] bg-brand-800/10 -z-0" />
          
          {STEPS.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;

            return (
              <div 
                key={step.id} 
                className="relative z-10 flex flex-col items-center group cursor-pointer"
                onClick={() => isCompleted && onStepClick(step.id)}
              >
                <div 
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 border
                    ${isActive ? 'bg-brand-800 border-brand-800 text-cream-100 shadow-soft scale-110' : 
                      isCompleted ? 'bg-cream-100 border-brand-800 text-brand-800 hover:bg-brand-50' : 
                      'bg-cream-100 border-brand-800/20 text-brand-800/30'}`}
                >
                  {isCompleted ? <Check size={14} strokeWidth={3} /> : <span className="font-serif text-sm pt-0.5">{step.id}</span>}
                </div>
                <div className={`mt-3 text-xs font-medium tracking-wide uppercase transition-colors duration-300 bg-cream-100 px-2
                  ${isActive ? 'text-brand-900 font-bold' : 'text-brand-800/40'}`}>
                  {step.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};