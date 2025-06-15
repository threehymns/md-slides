
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { SettingsSectionProps } from './types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const StyleSettings: React.FC<Omit<SettingsSectionProps, 'onSettingChange'>> = ({ settings, onStyleChange }) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Label className="text-sm font-medium mb-2 block">
            Text Color
          </Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={settings.style.textColor || '#000000'}
              onChange={(e) => onStyleChange('textColor', e.target.value)}
              className="p-1 h-10 w-10 block bg-card border border-input rounded-md cursor-pointer"
              title="Select text color"
            />
            <Input
              value={settings.style.textColor || ''}
              onChange={(e) => onStyleChange('textColor', e.target.value)}
              placeholder="e.g. #1a2b3c"
              className="flex-1"
            />
            <Button variant="ghost" size="sm" onClick={() => onStyleChange('textColor', undefined)}>
              Reset
            </Button>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block">
            Background Color
          </Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={settings.style.backgroundColor || '#ffffff'}
              onChange={(e) => onStyleChange('backgroundColor', e.target.value)}
              className="p-1 h-10 w-10 block bg-card border border-input rounded-md cursor-pointer"
              title="Select background color"
            />
            <Input
              value={settings.style.backgroundColor || ''}
              onChange={(e) => onStyleChange('backgroundColor', e.target.value)}
              placeholder="e.g. #ffffff"
              className="flex-1"
            />
            <Button variant="ghost" size="sm" onClick={() => onStyleChange('backgroundColor', undefined)}>
              Reset
            </Button>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="font-family" className="text-sm font-medium mb-2 block">
          Font Family
        </Label>
        <Select
          value={settings.style.fontFamily}
          onValueChange={(value) => onStyleChange('fontFamily', value)}
        >
          <SelectTrigger id="font-family">
            <SelectValue placeholder="Select a font" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="system-ui, sans-serif">System UI</SelectItem>
            <SelectItem value="serif">Serif</SelectItem>
            <SelectItem value="monospace">Monospace</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="font-size" className="text-sm font-medium mb-2 block">
          Font Size ({settings.style.fontSize.toFixed(1)}vw)
        </Label>
        <Slider
          id="font-size"
          min={1}
          max={10}
          step={0.1}
          value={[settings.style.fontSize]}
          onValueChange={([value]) => onStyleChange('fontSize', value)}
        />
      </div>
      
      <div>
        <Label htmlFor="line-height" className="text-sm font-medium mb-2 block">
          Line Height ({settings.style.lineHeight.toFixed(1)})
        </Label>
        <Slider
          id="line-height"
          min={1}
          max={3}
          step={0.1}
          value={[settings.style.lineHeight]}
          onValueChange={([value]) => onStyleChange('lineHeight', value)}
        />
      </div>

      <div>
        <Label className="text-sm font-medium mb-2 block">
          Text Alignment
        </Label>
        <ToggleGroup
          type="single"
          value={settings.style.textAlign}
          onValueChange={(value) => value && onStyleChange('textAlign', value)}
          className="justify-start"
        >
          <ToggleGroupItem value="left" aria-label="Align left">
            <AlignLeft className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" aria-label="Align center">
            <AlignCenter className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Align right">
            <AlignRight className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="justify" aria-label="Align justify">
            <AlignJustify className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};

export default StyleSettings;
