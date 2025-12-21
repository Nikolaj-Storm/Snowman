import React from 'react';
import { STEPS } from '../constants';
import { Check, Circle } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, onStepClick }) => {
  return (
    <div className="w-full py-6 px-4 bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between relative">
          {/* Connecting Line */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-slate-100 -z-0" />
          
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
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 
                    ${isActive ? 'bg-brand-600 border-brand-600 text-white shadow-lg scale-110' : 
                      isCompleted ? 'bg-green-500 border-green-500 text-white' : 
                      'bg-white border-slate-300 text-slate-400'}`}
                >
                  {isCompleted ? <Check size={20} /> : <span>{step.id}</span>}
                </div>
                <div className="mt-2 text-xs font-medium text-slate-600 hidden sm:block bg-white px-1">
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