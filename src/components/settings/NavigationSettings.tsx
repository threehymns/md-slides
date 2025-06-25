import React from 'react';
import { SETTINGS_CONFIG } from '@/settings/config';
import SettingItem from './SettingItem';

const NavigationSettings: React.FC = () => {
  const navigationSettings = SETTINGS_CONFIG.filter(
    (setting) => setting.category === 'navigation'
  );

  if (!navigationSettings.length) {
    return <p>No navigation settings available.</p>;
  }

  return (
    <div className="space-y-4">
      {navigationSettings.map((setting) => (
        <SettingItem key={setting.id} settingConfig={setting} />
      ))}
    </div>
  );
};

export default NavigationSettings;
