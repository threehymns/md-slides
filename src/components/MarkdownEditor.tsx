
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Settings as SettingsIcon } from 'lucide-react';
import Settings from './Settings';
import { usePresentations } from '@/contexts/PresentationsContext';

interface MarkdownEditorProps {
  markdown: string;
  onMarkdownChange: (markdown: string) => void;
  onStartPresentation: () => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  markdown,
  onMarkdownChange,
  onStartPresentation
}) => {
  const { getCurrentSlideDeck, getCurrentPresentation, getPresentationSlideDecks } = usePresentations();
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    showProgressBar: false,
    showSlideCounter: true,
    showNavigationHint: true,
    autoHideControls: false
  });

  const currentDeck = getCurrentSlideDeck();
  const currentPresentation = getCurrentPresentation();
  const presentationSlideDecks = currentPresentation ? getPresentationSlideDecks(currentPresentation.id) : [];
  
  // Check if presentation has content to present
  const canStartPresentation = presentationSlideDecks.some(deck => deck.content.trim());

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
    <div className="min-h-screen p-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-lg shadow-sm border p-6 bg-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {currentPresentation?.title || 'Markdown Slideshow'}
              </h1>
              <p className="mt-1 text-muted-foreground">
                {currentDeck ? `Editing: ${currentDeck.title}` : 'Create beautiful presentations from markdown'}
              </p>
              {currentPresentation && (
                <p className="text-sm text-muted-foreground">
                  Presentation contains {presentationSlideDecks.length} slide deck{presentationSlideDecks.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(true)}
              >
                <SettingsIcon className="h-4 w-4" />
              </Button>
              <Button 
                onClick={onStartPresentation}
                disabled={!canStartPresentation}
                size="lg"
              >
                Start Presentation
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="markdown-input" className="text-sm font-medium text-foreground">
                Markdown Content
              </label>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onMarkdownChange(sampleMarkdown)}
                disabled={!currentDeck}
              >
                Load Sample
              </Button>
            </div>
            
            <Textarea
              id="markdown-input"
              value={markdown}
              onChange={(e) => onMarkdownChange(e.target.value)}
              placeholder={currentDeck ? "Enter your markdown here... Use --- to separate slides" : "Select a slide deck to edit"}
              className="min-h-[500px] font-mono text-sm"
              disabled={!currentDeck}
            />
            
            <div className="text-xs text-muted-foreground">
              <strong>Tip:</strong> Use <code>---</code> to separate slides. Supports all standard markdown formatting.
              {currentPresentation && (
                <span className="block mt-1">
                  When you start the presentation, all slide decks in "{currentPresentation.title}" will be combined and presented in order.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <Settings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />
    </div>
  );
};

export default MarkdownEditor;
