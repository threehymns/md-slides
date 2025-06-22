export interface SettingOption {
  value: string | number;
  label: string;
}

export type SettingComponentType =
  | 'Switch'
  | 'Input'
  | 'Slider'
  | 'Select'
  | 'ColorPicker'
  | 'ToggleGroup';

export interface BaseSetting<T> {
  id: string; // Dot notation for nesting, e.g., "appearance.showProgressBar" or "style.fontSize"
  label: string;
  category: string; // To group settings in UI, e.g., "appearance", "style"
  component: SettingComponentType;
  defaultValue: T;
  description?: string; // Optional description for the setting
}

export interface BooleanSetting extends BaseSetting<boolean> {
  type: 'boolean';
  component: 'Switch';
}

export interface StringSetting extends BaseSetting<string> {
  type: 'string';
  component: 'Input' | 'ColorPicker'; // ColorPicker will also use string for hex color
}

export interface NumberSetting extends BaseSetting<number> {
  type: 'number';
  component: 'Input' | 'Slider';
  props?: {
    min?: number;
    max?: number;
    step?: number;
    units?: string; // e.g., "px", "vw", "%"
  };
}

export interface EnumSetting<T extends string | number> extends BaseSetting<T> {
  type: 'enum';
  component: 'Select' | 'ToggleGroup';
  options: SettingOption[];
}

export type SettingConfig = BooleanSetting | StringSetting | NumberSetting | EnumSetting<any>;

// This will be the structure of the actual settings object used in the app
// It will be derived from the SETTINGS_CONFIG
export type AppSettings = {
  appearance: {
    showProgressBar: boolean;
    showSlideCounter: boolean;
    showSlideNumbers: boolean; // Assuming this was intended from AppearanceSettings.tsx
  };
  navigation: {
    showNavigationHint: boolean;
    autoHideControls: boolean;
  };
  style: {
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
    textAlign: 'left' | 'center' | 'right' | 'justify';
    textColor?: string;
    backgroundColor?: string;
  };
  // Keyboard settings are currently informational, so not included here as configurable items.
};

// To help build the AppSettings type from SETTINGS_CONFIG dynamically
// For now, AppSettings is manually defined for clarity, but a dynamic approach is possible
// e.g., type DeepIndex<T, K extends string> = ...
// type SettingsObjectFromConfig<C extends readonly SettingConfig[]> = ...


// Represents the structure of the settings configuration array
export type SettingsConfigArray = readonly SettingConfig[];
