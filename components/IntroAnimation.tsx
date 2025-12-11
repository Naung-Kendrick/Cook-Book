import React, { useEffect, useState } from 'react';
import { ChefHat } from 'lucide-react';

interface IntroAnimationProps {
  onComplete: () => void;
}

export const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'initial' | 'enter' | 'exit'>('initial');

  useEffect(() => {
    // Start animation immediately after mount
    const timer1 = setTimeout(() => setStage('enter'), 100);
    
    // Start exit phase (fade out)
    const timer2 = setTimeout(() => setStage('exit'), 2500);
    
    // Complete callback (unmount)
    const timer3 = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-white transition-opacity duration-1000 ease-in-out ${
        stage === 'exit' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center">
        {/* Icon Animation */}
        <div 
          className={`mb-6 transform transition-all duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1) ${
            stage === 'enter' || stage === 'exit' ? 'scale-100 opacity-100 translate-y-0' : 'scale-50 opacity-0 translate-y-10'
          }`}
        >
          <div className="p-4 rounded-full bg-orange-50 border border-orange-100 shadow-sm text-orange-600">
             <ChefHat size={48} strokeWidth={2} />
          </div>
        </div>

        {/* Text Animation */}
        <div 
          className={`text-center space-y-3 transform transition-all duration-1000 delay-300 ${
            stage === 'enter' || stage === 'exit' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h1 className="font-serif text-5xl font-bold text-stone-900 tracking-tight">
            Culina<span className="text-orange-500">.</span>
          </h1>
          
          {/* Divider */}
          <div className={`h-1 bg-orange-500 mx-auto transition-all duration-1000 delay-700 rounded-full ${
             stage === 'enter' || stage === 'exit' ? 'w-16 opacity-100' : 'w-0 opacity-0'
          }`} />

          <p className="font-serif text-stone-500 italic text-lg tracking-wide">
            Recipes for the soul
          </p>
        </div>
      </div>
    </div>
  );
};