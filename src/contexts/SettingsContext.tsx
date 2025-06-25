import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import _ from 'lodash';
import { AppSettings, SettingConfig } from '@/settings/types';
import { DEFAULT_SETTINGS, SETTINGS_CONFIG } from "@/settings/config"

const LOCAL_STORAGE_KEY = 'md-slides-settings';

interface SettingsContextType {
  settings: AppSettings;
  updateSetting: (id: string, value: any) => void;
  resetSettings: () => void;
  getSettingConfig: (id: string) => SettingConfig | undefined;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

type SafeObject = any; // Simplified type for the safe object

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Function to reset settings to defaults and clear corrupted data
  const resetToDefaults = (): AppSettings => {
    const defaultSettings = DEFAULT_SETTINGS;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultSettings));
    } catch (error) {
      console.error('Failed to save default settings:', error);
    }
    return defaultSettings;
  };

  // Function to safely load and validate settings
  const loadSettings = (): AppSettings => {
    const defaultSettings = DEFAULT_SETTINGS;
    
    try {
      // Test if localStorage is available
      try {
        const testKey = '__test__';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
      } catch (error) {
        console.error('LocalStorage is not available:', error);
        return defaultSettings;
      }
      
      const storedSettings = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!storedSettings) {
        return defaultSettings;
      }
      
      // First, try to parse the settings
      let parsedSettings;
      try {
        parsedSettings = JSON.parse(storedSettings);
        console.log('[Settings] Successfully parsed settings:', parsedSettings);
      } catch (parseError) {
        console.error('[Settings] Failed to parse settings, resetting to defaults:', parseError);
        return resetToDefaults();
      }
      
      // Validate the parsed settings structure
      if (typeof parsedSettings !== 'object' || parsedSettings === null) {
        console.error('Invalid settings format, resetting to defaults');
        return resetToDefaults();
      }
      
      // Create a deep clone of default settings to start with
      const mergedSettings = _.cloneDeep(defaultSettings);
      
      // Safe merge function that handles invalid data
      const safeMerge = (target: any, source: any, path: string[] = []): any => {
        // If source is not an object or is null, return target as is
        if (typeof source !== 'object' || source === null) {
          return target;
        }
        
        // Handle arrays - only if both are arrays
        if (Array.isArray(target) && Array.isArray(source)) {
          // For arrays, we'll just take the source as is if it's an array
          return source.slice();
        }
        
        // Handle plain objects
        Object.keys(target).forEach(key => {
          const currentPath = [...path, key];
          const pathString = currentPath.join('.');
          
          // Skip if source doesn't have this key
          if (!(key in source)) {
            return;
          }
          
          const targetValue = target[key];
          const sourceValue = source[key];
          
          // Skip if source value is undefined or null
          if (sourceValue === undefined || sourceValue === null) {
            return;
          }
          
          // Handle nested objects
          if (targetValue !== null && 
              typeof targetValue === 'object' && 
              !Array.isArray(targetValue) &&
              typeof sourceValue === 'object' &&
              !Array.isArray(sourceValue)) {
            // Recursively merge nested objects
            target[key] = safeMerge(targetValue, sourceValue, currentPath);
          } 
          // Handle primitive values - only if types match
          else if (typeof targetValue === typeof sourceValue) {
            target[key] = sourceValue;
          } else if (process.env.NODE_ENV !== 'production') {
            console.warn(`Type mismatch for setting '${pathString}': expected ${typeof targetValue}, got ${typeof sourceValue}`);
          }
        });
        
        return target;
      };
      
      // Perform the safe merge
      return safeMerge(mergedSettings, parsedSettings);
      
    } catch (error) {
      console.error('Error loading settings, resetting to defaults:', error);
      return resetToDefaults();
    }
  };
  
  // Initialize state with loaded settings
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  
  // Function to update a setting
  const updateSetting = useCallback((id: string, value: any) => {
    setSettings(prevSettings => {
      const newSettings = _.cloneDeep(prevSettings);
      _.set(newSettings, id, value);
      return newSettings;
    });
  }, []);
  
  // Function to reset settings to defaults
  const resetSettings = useCallback(() => {
    const defaultSettings = resetToDefaults();
    setSettings(defaultSettings);
  }, []);
  
  // Get setting configuration by ID
  const getSettingConfig = useCallback((id: string): SettingConfig | undefined => {
    return SETTINGS_CONFIG.find(conf => conf.id === id);
  }, []);
  
  // Create a safe object for serialization
  const getSafeObject = useCallback((obj: any, seen = new WeakSet()): SafeObject => {
    // Handle non-objects and null
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    
    // Handle Date
    if (obj instanceof Date) {
      return obj.toISOString();
    }
    
    // Handle circular references
    if (seen.has(obj)) {
      return '[Circular]';
    }
    seen.add(obj);
    
    // Handle arrays
    if (Array.isArray(obj)) {
      return obj.map(item => getSafeObject(item, seen));
    }
    
    // Handle plain objects
    const safeObj: Record<string, any> = {};
    Object.keys(obj).forEach(key => {
      safeObj[key] = getSafeObject(obj[key], seen);
    });
    return safeObj;
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      // Test if localStorage is available and writable
      const testKey = '__test__';
      try {
        localStorage.setItem(testKey, testKey);
        if (localStorage.getItem(testKey) !== testKey) {
          throw new Error('LocalStorage write test failed');
        }
        localStorage.removeItem(testKey);
      } catch (error) {
        console.error('LocalStorage is not writable:', error);
        return;
      }
      
      const safeSettings = getSafeObject(settings);
      const serialized = JSON.stringify(safeSettings);
      
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, serialized);
      } catch (error) {
        console.error('Error saving settings:', error);
      }
    } catch (error) {
      console.error('Error in settings effect:', error);
    }
  }, [settings, getSafeObject]);
  
  // Handle storage events to sync settings across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_KEY && e.newValue) {
        try {
          const newSettings = JSON.parse(e.newValue);
          setSettings(prev => ({
            ...prev,
            ...newSettings
          }));
        } catch (error) {
          console.error('Error parsing settings from storage event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Create the context value
  const contextValue: SettingsContextType = {
    settings,
    updateSetting,
    resetSettings,
    getSettingConfig,
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};