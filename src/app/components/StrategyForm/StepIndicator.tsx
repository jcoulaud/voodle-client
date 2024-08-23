interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <nav aria-label='Progress'>
      <ol role='list' className='flex items-center'>
        {steps.map((step, index) => (
          <li key={step} className={index !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}>
            <div className='relative flex items-center'>
              <span className='absolute flex h-5 w-5 p-px' aria-hidden='true'>
                <span
                  className={`h-full w-full rounded-full ${
                    index < currentStep ? 'bg-primary' : 'bg-border'
                  }`}
                />
              </span>
              <span
                className={`ml-4 text-sm font-medium ${
                  index <= currentStep ? 'text-primary' : 'text-text-secondary'
                }`}>
                {step}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};
