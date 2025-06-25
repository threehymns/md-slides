import React from 'react';
import { SETTINGS_CONFIG } from '@/settings/config';
import SettingItem from './SettingItem';
import { SettingConfig } from '@/settings/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Type, LayoutGrid } from 'lucide-react'; // Icons for card headers

interface SettingsGroup {
  title: string;
  icon: React.ElementType;
  settings: SettingConfig[];
}

const StyleSettings: React.FC = () => {
  const styleSettings = SETTINGS_CONFIG.filter(
    (setting) => setting.category === 'style'
  );

  if (!styleSettings.length) {
    return <p>No style settings available.</p>;
  }

  // Group settings into logical sections
  const settingGroups: SettingsGroup[] = [
    {
      title: 'Colors',
      icon: Palette,
      settings: styleSettings.filter(s => ['style.textColor', 'style.backgroundColor'].includes(s.id)),
    },
    {
      title: 'Typography',
      icon: Type,
      settings: styleSettings.filter(s => ['style.fontFamily', 'style.fontSize', 'style.lineHeight'].includes(s.id)),
    },
    {
      title: 'Layout',
      icon: LayoutGrid,
      settings: styleSettings.filter(s => ['style.textAlign'].includes(s.id)),
    },
  ];

  return (
    <div className="space-y-6">
      {settingGroups.map((group) => (
        <Card key={group.title}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <group.icon className="h-5 w-5" />
              {group.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            {group.settings.map((setting) => (
              <SettingItem key={setting.id} settingConfig={setting} />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StyleSettings;
