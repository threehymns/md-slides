import { SettingsConfigArray, AppSettings } from "./types";

export const DEFAULT_SETTINGS: AppSettings = {
  appearance: {
    showProgressBar: false,
    showSlideCounter: true,
    showSlideNumbers: true, // Added based on AppearanceSettings.tsx
  },
  navigation: {
    showNavigationHint: true,
    autoHideControls: false,
  },
  style: {
    fontFamily: "system-ui, sans-serif",
    fontSize: 5, // Assuming vw as per StyleSettings.tsx
    lineHeight: 1.6,
    textAlign: "center",
    textColor: "#ffffff", // Default from StyleSettings
    backgroundColor: "#000000", // Default from StyleSettings
  },
};

export const SETTINGS_CONFIG: SettingsConfigArray = [
  // Appearance Settings
  {
    id: "appearance.showProgressBar",
    label: "Show Progress Bar",
    category: "appearance",
    type: "boolean",
    component: "Switch",
    defaultValue: DEFAULT_SETTINGS.appearance.showProgressBar,
  },
  {
    id: "appearance.showSlideCounter",
    label: "Show Slide Counter",
    category: "appearance",
    type: "boolean",
    component: "Switch",
    defaultValue: DEFAULT_SETTINGS.appearance.showSlideCounter,
  },
  {
    id: "appearance.showSlideNumbers",
    label: "Show Slide Numbers",
    category: "appearance",
    type: "boolean",
    component: "Switch",
    defaultValue: DEFAULT_SETTINGS.appearance.showSlideNumbers,
  },
  // Navigation Settings
  {
    id: "navigation.showNavigationHint",
    label: "Show Navigation Hint",
    category: "navigation",
    type: "boolean",
    component: "Switch",
    defaultValue: DEFAULT_SETTINGS.navigation.showNavigationHint,
  },
  {
    id: "navigation.autoHideControls",
    label: "Auto-hide Controls",
    category: "navigation",
    type: "boolean",
    component: "Switch",
    defaultValue: DEFAULT_SETTINGS.navigation.autoHideControls,
  },
  // Style Settings
  {
    id: "style.textColor",
    label: "Text Color",
    category: "style",
    type: "string",
    component: "ColorPicker",
    defaultValue: DEFAULT_SETTINGS.style.textColor!,
  },
  {
    id: "style.backgroundColor",
    label: "Background Color",
    category: "style",
    type: "string",
    component: "ColorPicker",
    defaultValue: DEFAULT_SETTINGS.style.backgroundColor!,
  },
  {
    id: "style.fontFamily",
    label: "Font Family",
    category: "style",
    type: "enum",
    component: "Select",
    defaultValue: DEFAULT_SETTINGS.style.fontFamily,
    options: [
      { value: "system-ui, sans-serif", label: "System UI" },
      { value: "serif", label: "Serif" },
      { value: "monospace", label: "Monospace" },
    ],
  },
  {
    id: "style.fontSize",
    label: "Font Size",
    category: "style",
    type: "number",
    component: "Slider",
    defaultValue: DEFAULT_SETTINGS.style.fontSize,
    props: { min: 1, max: 10, step: 0.1, units: "vw" },
  },
  {
    id: "style.lineHeight",
    label: "Line Height",
    category: "style",
    type: "number",
    component: "Slider",
    defaultValue: DEFAULT_SETTINGS.style.lineHeight,
    props: { min: 1, max: 3, step: 0.1 },
  },
  {
    id: "style.textAlign",
    label: "Text Alignment",
    category: "style",
    type: "enum",
    component: "ToggleGroup",
    defaultValue: DEFAULT_SETTINGS.style.textAlign,
    options: [
      { value: "left", label: "Align left" },
      { value: "center", label: "Align center" },
      { value: "right", label: "Align right" },
      { value: "justify", label: "Align justify" },
    ],
  },
];

export const CATEGORIES_CONFIG = [
  { id: "appearance", name: "Appearance", iconName: "Layout" }, // Assuming Lucide icon names
  { id: "style", name: "Style", iconName: "Palette" },
  { id: "navigation", name: "Navigation", iconName: "Compass" },
  { id: "keyboard", name: "Keyboard", iconName: "Keyboard" },
];
// Note: Lucide icons will be dynamically imported in the component where they are used.
// Adding icon components directly to this config makes it non-serializable if we were to load it from JSON.
// Storing iconName (string) is a better approach.
