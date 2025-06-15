
import { AppSettings } from '@/types';

export interface SettingsSectionProps {
  settings: AppSettings;
  onSettingChange: (key: string, value: any) => void;
  onStyleChange: (key: string, value: any) => void;
}
