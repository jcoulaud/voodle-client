import { Switch } from '@headlessui/react';

interface ToggleProps {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  label?: string;
}

export const Toggle = ({ enabled, setEnabled, label }: ToggleProps) => {
  return (
    <div className='flex items-center'>
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={`${
          enabled ? 'bg-primary' : 'bg-gray-200'
        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}>
        <span
          className={`${
            enabled ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
        />
      </Switch>
      {label && <span className='ml-2 text-sm text-text-body'>{label}</span>}
    </div>
  );
};
