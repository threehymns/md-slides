
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { SettingsSectionProps } from './types';

const AppearanceSettings: React.FC<Omit<SettingsSectionProps, 'onStyleChange'>> = ({ settings, onSettingChange }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label htmlFor="progress-bar" className="text-sm font-medium">
          Show Progress Bar
        </Label>
        <Switch
          id="progress-bar"
          checked={settings.showProgressBar}
          onCheckedChange={(checked) => onSettingChange('showProgressBar', checked)}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="slide-counter" className="text-sm font-medium">
          Show Slide Counter
        </Label>
        <Switch
          id="slide-counter"
          checked={settings.showSlideCounter}
          onCheckedChange={(checked) => onSettingChange('showSlideCounter', checked)}
        />
      </div>
    </div>
  );
};

export default AppearanceSettings;
