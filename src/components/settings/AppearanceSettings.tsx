import React from 'react';
import { SETTINGS_CONFIG, SettingConfig } from '@/settings';
import SettingItem from './SettingItem';

const AppearanceSettings: React.FC = () => {
  const appearanceSettings = SETTINGS_CONFIG.filter(
    (setting) => setting.category === 'appearance'
  );

  if (!appearanceSettings.length) {
    return <p>No appearance settings available.</p>;
  }

  return (
    <div className="space-y-4">
      {appearanceSettings.map((setting) => (
        <SettingItem key={setting.id} settingConfig={setting as SettingConfig} />
      ))}
    </div>
  );
};

export default AppearanceSettings;
