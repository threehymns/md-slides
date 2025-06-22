import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppSettings, SettingConfig, SETTINGS_CONFIG, DEFAULT_SETTINGS } from '@/settings';
import _ from 'lodash'; // Using lodash for deep set and get

interface SettingsContextType {
  settings: AppSettings;
  updateSetting: (id: string, value: any) => void;
  resetSettings: () => void;
  getSettingConfig: (id: string) => SettingConfig | undefined;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'appSettings';

// Helper to initialize settings from config
const initializeSettings = (): AppSettings => {
  // Start with default settings
  const initialSettings = _.cloneDeep(DEFAULT_SETTINGS);

  // Potentially, in a more dynamic setup, one might build this object
  // from SETTINGS_CONFIG directly, but DEFAULT_SETTINGS already provides the structure.
  // This ensures all keys from AppSettings type are present.
  return initialSettings;
};


export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const storedSettings = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedSettings) {
        // Deep merge stored settings with defaults to ensure all keys are present
        // and new settings get their default values if not in local storage.
        return _.merge({}, initializeSettings(), JSON.parse(storedSettings));
      }
    } catch (error) {
      console.error("Error loading settings from local storage:", error);
      // Fallback to default settings if localStorage is corrupted or unavailable
    }
    return initializeSettings();
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("Error saving settings to local storage:", error);
    }
  }, [settings]);

  const updateSetting = useCallback((id: string, value: any) => {
    setSettings(prevSettings => {
      const newSettings = _.cloneDeep(prevSettings);
      _.set(newSettings, id, value); // id is like 'appearance.showProgressBar'
      return newSettings;
    });
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(initializeSettings());
  }, []);

  const getSettingConfig = useCallback((id: string): SettingConfig | undefined => {
    return SETTINGS_CONFIG.find(conf => conf.id === id);
  }, []);


  return (
    <SettingsContext.Provider value={{ settings, updateSetting, resetSettings, getSettingConfig }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
