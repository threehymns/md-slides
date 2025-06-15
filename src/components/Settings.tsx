import React, { useEffect, useState } from 'react';
import { X, Palette, Compass, Keyboard, SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  settings: {
    showProgressBar: boolean;
    showSlideCounter: boolean;
    showNavigationHint: boolean;
    autoHideControls: boolean;
  };
  onSettingsChange: (settings: any) => void;
}

// Define categories for settings with icons
const CATEGORIES = [
  { id: 'appearance', name: 'Appearance', icon: Palette },
  { id: 'navigation', name: 'Navigation', icon: Compass },
  { id: 'keyboard', name: 'Keyboard', icon: Keyboard },
];

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

  // Render settings based on selected category
  const renderSettings = () => {
    switch (selectedCategory) {
      case 'appearance':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="progress-bar" className="text-sm font-medium">
                Show Progress Bar
              </Label>
              <Switch
                id="progress-bar"
                checked={settings.showProgressBar}
                onCheckedChange={(checked) => handleSettingChange('showProgressBar', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="slide-counter" className="text-sm font-medium">
                Show Slide Counter
              </Label>
              <Switch
                id="slide-counter"
                checked={settings.showSlideCounter}
                onCheckedChange={(checked) => handleSettingChange('showSlideCounter', checked)}
              />
            </div>
          </div>
        );
      
      case 'navigation':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="navigation-hint" className="text-sm font-medium">
                Show Navigation Hint
              </Label>
              <Switch
                id="navigation-hint"
                checked={settings.showNavigationHint}
                onCheckedChange={(checked) => handleSettingChange('showNavigationHint', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="auto-hide" className="text-sm font-medium">
                Auto-hide Controls
              </Label>
              <Switch
                id="auto-hide"
                checked={settings.autoHideControls}
                onCheckedChange={(checked) => handleSettingChange('autoHideControls', checked)}
              />
            </div>
          </div>
        );
      
      case 'keyboard':
        return (
          <div className="space-y-4">
            <div className="text-sm">
              <p className="mb-2"><strong>Keyboard shortcuts:</strong></p>
              <ul className="space-y-1">
                <li>→ / Space: Next slide</li>
                <li>←: Previous slide</li>
                <li>D: Toggle dark mode</li>
                <li>S: Toggle settings</li>
                <li>Esc: Exit presentation</li>
              </ul>
            </div>
          </div>
        );
      
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
          {/* Sidebar with categories */}
          <div className="w-1/4 border-t border-border bg-muted/50 rounded-xl m-3 mt-0">
            <div className="p-4 space-y-1">
              {CATEGORIES.map(category => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    className={`w-full text-sm flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                      selectedCategory === category.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-accent'
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
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
