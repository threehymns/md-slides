import React, { useState, useEffect } from 'react';
import Settings from '@/components/Settings';
import { AppSettings } from '@/types';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation

// Placeholder for global/default settings until full integration
// In a real app, this would come from context or a settings store
const initialSettingsData: AppSettings = {
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
};

const SettingsPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); // To get state for return path
  // Settings state - ideally this would be from a global context/store
  const [settings, setSettings] = useState<AppSettings>(initialSettingsData);

  // Simulate loading global settings
  useEffect(() => {
    // const globalSettings = loadGlobalSettings(); // e.g., from localStorage or context
    // setSettings(globalSettings);
  }, []);

  const handleSettingsChange = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    // saveGlobalSettings({ ...settings, ...newSettings }); // Persist settings
  };

  const handleClose = () => {
    // Navigate back to the 'from' path if available, otherwise to home
    const fromPath = location.state?.from || '/';
    navigate(fromPath);
  };

  return (
    <Settings
      isOpen={true} // Settings page is always "open" when routed to
      onClose={handleClose} // Use the new handleClose for navigation
      settings={settings}
      onSettingsChange={handleSettingsChange}
    />
  );
};

export default SettingsPage;
