
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { SettingsSectionProps } from './types';

const NavigationSettings: React.FC<Omit<SettingsSectionProps, 'onStyleChange'>> = ({ settings, onSettingChange }) => {
    return (
        <div className="space-y-6">
        <div className="flex items-center justify-between">
            <Label htmlFor="navigation-hint" className="text-sm font-medium">
            Show Navigation Hint
            </Label>
            <Switch
            id="navigation-hint"
            checked={settings.showNavigationHint}
            onCheckedChange={(checked) => onSettingChange('showNavigationHint', checked)}
            />
        </div>

        <div className="flex items-center justify-between">
            <Label htmlFor="auto-hide" className="text-sm font-medium">
            Auto-hide Controls
            </Label>
            <Switch
            id="auto-hide"
            checked={settings.autoHideControls}
            onCheckedChange={(checked) => onSettingChange('autoHideControls', checked)}
            />
        </div>
        </div>
    );
};

export default NavigationSettings;
