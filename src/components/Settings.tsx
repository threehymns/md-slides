
import React, { useEffect } from 'react';
import { X } from 'lucide-react';
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
  isDarkMode: boolean;
}

const Settings: React.FC<SettingsProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
  isDarkMode
}) => {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className={`relative w-full max-w-md mx-4 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">Presentation Settings</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-6 space-y-6">
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

        <div className={`p-4 border-t text-xs ${isDarkMode ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'}`}>
          <p><strong>Keyboard shortcuts:</strong></p>
          <p>Arrow keys / Space: Navigate • D: Dark mode • S: Settings • Esc: Exit</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
