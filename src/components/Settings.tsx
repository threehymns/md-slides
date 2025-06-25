import React, { useEffect, useState, useMemo } from 'react';
import { X, SettingsIcon as SettingsDialogIcon, Layout, Palette, Compass, Keyboard, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CATEGORIES_CONFIG } from '@/settings/config';

import SettingsSidebar from './settings/SettingsSidebar';
import AppearanceSettings from './settings/AppearanceSettings';
import StyleSettings from './settings/StyleSettings';
import NavigationSettings from './settings/NavigationSettings';
import KeyboardSettings from './settings/KeyboardSettings';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

// Map icon names from config to actual Lucide components
const iconMap: Record<string, LucideIcon> = {
  Layout: Layout,
  Palette: Palette,
  Compass: Compass,
  Keyboard: Keyboard,
};

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  const categories = useMemo(() => {
    return CATEGORIES_CONFIG.map(cat => ({
      id: cat.id,
      name: cat.name,
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
        return <AppearanceSettings />;
      case 'style':
        return <StyleSettings />;
      case 'navigation':
        return <NavigationSettings />;
      case 'keyboard':
        return <KeyboardSettings />;
      default: {
        const categoryComponent = categories.find(c => c.id === selectedCategory);
        if (categoryComponent) {
          console.warn(`No specific component renderer for category: ${selectedCategory}`);
          return <div>Settings for {categoryComponent.name} (generic view not implemented)</div>;
        }
        return null;
      }
    }
  };

  const currentCategoryDetails = categories.find(c => c.id === selectedCategory);
  const CurrentCategoryIcon = currentCategoryDetails?.icon || SettingsDialogIcon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl mx-4 rounded-xl shadow-lg bg-card text-card-foreground flex flex-col h-[calc(100vh-4rem)] max-h-[500px] border">
        <div className="flex flex-1 overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 absolute top-1 right-1 z-50"
          >
            <X className="h-4 w-4" />
          </Button>
        
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

