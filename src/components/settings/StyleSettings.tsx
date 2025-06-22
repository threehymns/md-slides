import React from 'react';
import { SETTINGS_CONFIG, SettingConfig, EnumSetting } from '@/settings';
import SettingItem from './SettingItem';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify, LucideIcon } from 'lucide-react'; // Import icons

// Helper to get Lucide icons for text alignment
const getTextAlignIcon = (value: string): LucideIcon | undefined => {
  switch (value) {
    case 'left': return AlignLeft;
    case 'center': return AlignCenter;
    case 'right': return AlignRight;
    case 'justify': return AlignJustify;
    default: return undefined;
  }
};

const StyleSettings: React.FC = () => {
  const styleSettings = SETTINGS_CONFIG.filter(
    (setting) => setting.category === 'style'
  );

  if (!styleSettings.length) {
    return <p>No style settings available.</p>;
  }

  return (
    <div className="space-y-6"> {/* Adjusted spacing from space-y-8 to space-y-6 to be closer to SettingItem's py-2 */}
      {styleSettings.map((setting) => {
        // Special handling for ToggleGroup with icons if needed
        if (setting.id === 'style.textAlign' && setting.component === 'ToggleGroup') {
          const enumSetting = setting as EnumSetting<string>;
          const optionsWithIcons = enumSetting.options.map(opt => {
            const Icon = getTextAlignIcon(opt.value as string);
            return {
              ...opt,
              // Pass the icon component if SettingItem is adapted to use it,
              // or render ToggleGroup directly here if more complex customization is needed.
              // For now, SettingItem uses text labels. If icons are a must,
              // SettingItem's ToggleGroup case needs to be enhanced.
              // Let's assume SettingItem's current ToggleGroup is sufficient for now.
              // If not, we'd customize here or enhance SettingItem.
              // For demonstration, if SettingItem could take an icon prop for options:
              // icon: Icon
            };
          });
          // If we were to render a custom ToggleGroup here:
          // return <CustomTextAlignToggleGroup key={setting.id} settingConfig={setting} options={optionsWithIcons} />
          // But for now, we rely on SettingItem.
        }
        return <SettingItem key={setting.id} settingConfig={setting as SettingConfig} />;
      })}
    </div>
  );
};

export default StyleSettings;
