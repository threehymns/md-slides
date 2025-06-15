import React, { useEffect, useState } from 'react';
import { X, SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppSettings } from '@/types';
import { CATEGORIES } from './settings/constants';
import SettingsSidebar from './settings/SettingsSidebar';
import AppearanceSettings from './settings/AppearanceSettings';
import StyleSettings from './settings/StyleSettings';
import NavigationSettings from './settings/NavigationSettings';
import KeyboardSettings from './settings/KeyboardSettings';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange
}) => {
  const [selectedCategory, setSelectedCategory] = useState('appearance');

  // Handle escape key to close settings modal
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyPress, true);
      return () => window.removeEventListener('keydown', handleKeyPress, true);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSettingChange = (key: string, value: boolean) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  const handleStyleChange = (key: string, value: any) => {
    onSettingsChange({
      ...settings,
      style: {
        ...settings.style,
        [key]: value,
      },
    });
  };

  // Render settings based on selected category
  const renderSettings = () => {
    switch (selectedCategory) {
      case 'appearance':
        return <AppearanceSettings settings={settings} onSettingChange={handleSettingChange} />;
      case 'style':
        return <StyleSettings settings={settings} onStyleChange={handleStyleChange} />;
      case 'navigation':
        return <NavigationSettings settings={settings} onSettingChange={handleSettingChange} />;
      case 'keyboard':
        return <KeyboardSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-3xl mx-4 rounded-xl shadow-lg bg-card text-card-foreground flex flex-col h-[500px] border-t border-border">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2 ml-1">
            <SettingsIcon className="h-4 w-4" />
            <h2 className="text-sm font-semibold">Settings</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex flex-1">
          <SettingsSidebar selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
          
          {/* Main content area */}
          <div className="flex-1 p-6 overflow-auto">
            <h3 className="text-lg font-medium mb-6 capitalize flex items-center gap-2">
              {(() => {
                const category = CATEGORIES.find(c => c.id === selectedCategory);
                const Icon = category?.icon;
                return (
                  <>
                    {Icon && <Icon className="h-5 w-5" />}
                    {category?.name} Settings
                  </>
                );
              })()}
            </h3>
            {renderSettings()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
