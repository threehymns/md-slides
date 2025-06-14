
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Moon, Sun, Settings as SettingsIcon } from 'lucide-react';
import Settings from './Settings';
import { useSlideDecks } from '@/contexts/SlideDecksContext';

interface MarkdownEditorProps {
  markdown: string;
  onMarkdownChange: (markdown: string) => void;
  onStartPresentation: () => void;
  isDarkMode: boolean;
  onDarkModeToggle: () => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  markdown,
  onMarkdownChange,
  onStartPresentation,
  isDarkMode,
  onDarkModeToggle
}) => {
  const { getCurrentDeck } = useSlideDecks();
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    showProgressBar: false,
    showSlideCounter: true,
    showNavigationHint: true,
    autoHideControls: false
  });

  const currentDeck = getCurrentDeck();

  const sampleMarkdown = `# Welcome to Markdown Slideshow

This is your first slide. Write your content here using standard markdown.

---

## Features

- **Simple**: Just write markdown
- **Clean**: Minimal interface
- **Fast**: Keyboard navigation
- **Responsive**: Works on any screen

---

## Navigation

Use these keys to navigate:

- **→ / Space**: Next slide
- **← / ↑**: Previous slide  
- **Home**: First slide
- **End**: Last slide

---

## Code Support

\`\`\`javascript
function hello(name) {
  console.log(\`Hello, \${name}!\`);
}

hello('World');
\`\`\`

---

## Lists and More

1. Ordered lists work great
2. So do bullet points
3. And everything else you'd expect

> Blockquotes look nice too!

---

# Ready to Present?

Click "Start Presentation" or replace this content with your own markdown!

Separate slides with \`---\``;

  return (
    <div className={`min-h-screen p-4 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto">
        <div className={`rounded-lg shadow-sm border p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {currentDeck?.title || 'Markdown Slideshow'}
              </h1>
              <p className={`mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Create beautiful presentations from markdown</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Sun className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={onDarkModeToggle}
                />
                <Moon className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </div>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(true)}
                className={isDarkMode ? 'border-gray-600 hover:bg-gray-700' : ''}
              >
                <SettingsIcon className="h-4 w-4" />
              </Button>
              <Button 
                onClick={onStartPresentation}
                disabled={!markdown.trim()}
                size="lg"
              >
                Start Presentation
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="markdown-input" className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Markdown Content
              </label>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onMarkdownChange(sampleMarkdown)}
                className={isDarkMode ? 'border-gray-600 hover:bg-gray-700 text-gray-200' : ''}
              >
                Load Sample
              </Button>
            </div>
            
            <Textarea
              id="markdown-input"
              value={markdown}
              onChange={(e) => onMarkdownChange(e.target.value)}
              placeholder="Enter your markdown here... Use --- to separate slides"
              className={`min-h-[500px] font-mono text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : ''}`}
            />
            
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <strong>Tip:</strong> Use <code>---</code> to separate slides. Supports all standard markdown formatting.
            </div>
          </div>
        </div>
      </div>

      <Settings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={setSettings}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default MarkdownEditor;
