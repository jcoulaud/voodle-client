import React from 'react';

interface StepIndicatorProps {
  steps: readonly string[];
  currentStep: string;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <nav aria-label='Progress'>
      <ol className='flex items-center'>
        {steps.map((step, index) => (
          <li key={step} className={index !== steps.length - 1 ? 'flex-1' : ''}>
            <div className='flex items-center'>
              <div
                className={`relative w-8 h-8 flex items-center justify-center rounded-full ${
                  step === currentStep
                    ? 'bg-primary text-white'
                    : index < steps.indexOf(currentStep)
                    ? 'bg-primary-hover text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}>
                {index + 1}
              </div>
              {index !== steps.length - 1 && (
                <div className='flex-1 h-0.5 mx-2 bg-gray-200'>
                  <div
                    className='h-0.5 bg-primary-hover'
                    style={{
                      width: `${
                        index < steps.indexOf(currentStep)
                          ? '100%'
                          : index === steps.indexOf(currentStep)
                          ? '50%'
                          : '0%'
                      }`,
                    }}
                  />
                </div>
              )}
            </div>
            <div className='mt-2 text-sm font-medium text-center'>{step}</div>
          </li>
        ))}
      </ol>
    </nav>
  );
};
