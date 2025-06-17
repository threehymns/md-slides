import React from 'react';
import Settings from '@/components/Settings';
import { AppSettings } from '@/types';

const SettingsPage = () => {
  const [settings, setSettings] = React.useState<AppSettings>({
    showProgressBar: false,
    showSlideCounter: true,
    showNavigationHint: true,
    autoHideControls: false,
    style: {
      fontFamily: 'system-ui, sans-serif',
      fontSize: 5,
      lineHeight: 1.6,
      textAlign: 'center',
    },
  });

  return (
    <div className="p-4 h-full">
      <Settings
        isOpen={true}
        onClose={() => { /* Closing handled by MainLayout */ }}
        settings={settings}
        onSettingsChange={setSettings}
      />
    </div>
  );
};

export default SettingsPage;