import React from 'react';
import {
  SettingConfig,
  BooleanSetting,
  StringSetting,
  NumberSetting,
  EnumSetting,
} from '@/settings';
import { useSettings } from '@/contexts/SettingsContext';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import _ from 'lodash';

// Dynamically import Lucide icons for ToggleGroup items if needed
// For simplicity, assuming text labels for ToggleGroupItems based on options for now.
// If icons are strictly needed for specific ToggleGroup settings, this component might need adjustment
// or the calling component (category settings) can pass icon components.

interface SettingItemProps {
  settingConfig: SettingConfig;
}

const SettingItem: React.FC<SettingItemProps> = ({ settingConfig }) => {
  const { settings, updateSetting } = useSettings();
  const currentValue = _.get(settings, settingConfig.id);

  const handleValueChange = (value: any) => {
    updateSetting(settingConfig.id, value);
  };

  const renderSettingControl = () => {
    switch (settingConfig.component) {
      case 'Switch': {
        const config = settingConfig as BooleanSetting;
        return (
          <Switch
            id={config.id}
            checked={currentValue as boolean}
            onCheckedChange={handleValueChange}
          />
        );
      }
      case 'Input': {
        const config = settingConfig as StringSetting | NumberSetting;
        return (
          <Input
            id={config.id}
            type={config.type === 'number' ? 'number' : 'text'}
            value={currentValue as string | number}
            onChange={(e) =>
              handleValueChange(
                config.type === 'number'
                  ? parseFloat(e.target.value) || 0
                  : e.target.value
              )
            }
            min={config.type === 'number' ? (config.props as NumberSetting['props'])?.min : undefined}
            max={config.type === 'number' ? (config.props as NumberSetting['props'])?.max : undefined}
            step={config.type === 'number' ? (config.props as NumberSetting['props'])?.step : undefined}
          />
        );
      }
      case 'ColorPicker': {
        // Combines a color input with a text input for hex code
        const config = settingConfig as StringSetting;
        return (
          <div className="flex items-center gap-2">
            <input
              type="color"
              id={`${config.id}-color`}
              value={(currentValue as string) || config.defaultValue}
              onChange={(e) => handleValueChange(e.target.value)}
              className="p-1 h-10 w-10 block bg-card border border-input rounded-md cursor-pointer"
              title={`Select ${config.label.toLowerCase()}`}
            />
            <Input
              id={config.id}
              value={(currentValue as string) || ''}
              onChange={(e) => handleValueChange(e.target.value)}
              placeholder="e.g. #1a2b3c"
              className="flex-1"
            />
            <Button variant="ghost" size="sm" onClick={() => handleValueChange(config.defaultValue)}>
              Reset
            </Button>
          </div>
        );
      }
      case 'Slider': {
        const config = settingConfig as NumberSetting;
        const props = config.props || {};
        return (
          <div className="flex items-center gap-2">
            <Slider
              id={config.id}
              min={props.min ?? 0}
              max={props.max ?? 100}
              step={props.step ?? 1}
              value={[currentValue as number]}
              onValueChange={([value]) => handleValueChange(value)}
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground w-16 text-right">
              {(currentValue as number).toFixed(props.step && props.step < 1 ? 1 : 0)}
              {props.units}
            </span>
          </div>
        );
      }
      case 'Select': {
        const config = settingConfig as EnumSetting<string | number>;
        return (
          <Select
            value={currentValue as string}
            onValueChange={handleValueChange}
          >
            <SelectTrigger id={config.id}>
              <SelectValue placeholder={`Select ${config.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {config.options.map((option) => (
                <SelectItem key={option.value.toString()} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }
      case 'ToggleGroup': {
        const config = settingConfig as EnumSetting<string>; // Assuming string values for ToggleGroup
        return (
          <ToggleGroup
            type="single"
            value={currentValue as string}
            onValueChange={(value) => {
              if (value) handleValueChange(value); // Ensure value is not empty
            }}
            className="justify-start"
          >
            {config.options.map((option) => (
              <ToggleGroupItem key={option.value} value={option.value} aria-label={option.label}>
                {/* This part might need to be more flexible if icons are needed, e.g. map option.value to an Icon component */}
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        );
      }
      default:
        return <p>Unsupported setting component type: {settingConfig.component}</p>;
    }
  };

  // For Switch type, label is typically on the left, control on the right.
  // For others, label is often above the control.
  if (settingConfig.component === 'Switch') {
    return (
      <div className="flex items-center justify-between py-2">
        <Label htmlFor={settingConfig.id} className="text-sm font-medium">
          {settingConfig.label}
          {settingConfig.description && (
            <p className="text-xs text-muted-foreground mt-1">{settingConfig.description}</p>
          )}
        </Label>
        {renderSettingControl()}
      </div>
    );
  }

  return (
    <div className="space-y-2 py-2">
      <Label htmlFor={settingConfig.id} className="text-sm font-medium block">
        {settingConfig.label}
      </Label>
      {settingConfig.description && (
        <p className="text-xs text-muted-foreground mb-1">{settingConfig.description}</p>
      )}
      {renderSettingControl()}
    </div>
  );
};

export default SettingItem;
