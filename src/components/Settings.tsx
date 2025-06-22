import React, { useEffect, useState, useMemo } from 'react';
import { X, SettingsIcon as SettingsDialogIcon, Layout, Palette, Compass, Keyboard, Icon as LucideIcon } from 'lucide-react'; // Renamed SettingsIcon to avoid conflict
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSettings } from '@/contexts/SettingsContext'; // Import useSettings
import { CATEGORIES_CONFIG } from '@/settings'; // Import CATEGORIES_CONFIG

import SettingsSidebar from './settings/SettingsSidebar';
import AppearanceSettings from './settings/AppearanceSettings';
import StyleSettings from './settings/StyleSettings';
import NavigationSettings from './settings/NavigationSettings';
import KeyboardSettings from './settings/KeyboardSettings'; // Stays as is, informational

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  // settings and onSettingsChange are no longer needed as props, will be accessed via context
}

// Map icon names from config to actual Lucide components
const iconMap: { [key: string]: LucideIcon } = {
  Layout,
  Palette,
  Compass,
  Keyboard,
};

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  // const { settings, updateSetting } = useSettings(); // Access settings and update function from context
  // We don't directly use 'settings' or 'updateSetting' here, child components will.

  const categories = useMemo(() => {
    return CATEGORIES_CONFIG.map(cat => ({
      ...cat,
      icon: iconMap[cat.iconName] || SettingsDialogIcon, // Fallback icon
    }));
  }, []);

  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || 'appearance');

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

  const renderSettings = () => {
    switch (selectedCategory) {
      case 'appearance':
        return <AppearanceSettings />; // Props no longer needed
      case 'style':
        return <StyleSettings />; // Props no longer needed
      case 'navigation':
        return <NavigationSettings />; // Props no longer needed
      case 'keyboard':
        return <KeyboardSettings />; // No changes needed for this one
      default:
        // Try to find if a category component exists even if not hardcoded
        const categoryComponent = categories.find(c => c.id === selectedCategory);
        if (categoryComponent) {
            // This part would require dynamic component loading or a more robust mapping
            // For now, returning null for unhandled dynamic categories.
            console.warn(`No specific component renderer for category: ${selectedCategory}`);
            return <div>Settings for {categoryComponent.name} (generic view not implemented)</div>;
        }
        return null;
    }
  };

  const currentCategoryDetails = categories.find(c => c.id === selectedCategory);
  const CurrentCategoryIcon = currentCategoryDetails?.icon || SettingsDialogIcon;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl mx-4 rounded-xl shadow-lg bg-card text-card-foreground flex flex-col h-[calc(100vh-4rem)] max-h-[700px] border">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <SettingsDialogIcon className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Settings</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          <SettingsSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          
          <ScrollArea className="flex-1">
            <div className="p-6">
              {currentCategoryDetails && (
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <CurrentCategoryIcon className="h-5 w-5" />
                  {currentCategoryDetails.name}
                </h3>
              )}
              {renderSettings()}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default Settings;
