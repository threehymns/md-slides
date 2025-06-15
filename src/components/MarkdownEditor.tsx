
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { usePresentations } from "@/contexts/PresentationsContext";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface MarkdownEditorProps {
  markdown: string;
  onMarkdownChange: (markdown: string) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  markdown,
  onMarkdownChange,
}) => {
  const {
    getCurrentSlideDeck,
    getCurrentPresentation,
    getPresentationSlideDecks,
    updateSlideDeck,
  } = usePresentations();

  const currentDeck = getCurrentSlideDeck();
  const currentPresentation = getCurrentPresentation();
  const presentationSlideDecks = currentPresentation
    ? getPresentationSlideDecks(currentPresentation.id)
    : [];

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
    <div className="min-h-[calc(100vh-61px)] max-w-6xl mx-auto p-4 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold mb-2 text-foreground">
          {currentDeck?.title}
        </h1>
        {currentPresentation && (
          <p className="text-sm text-muted-foreground">
            Presentation contains {presentationSlideDecks.length} slide deck
            {presentationSlideDecks.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="background-url" className="text-sm font-medium">
          Background URL (Image or Video)
        </Label>
        <Input
          id="background-url"
          type="url"
          placeholder="https://example.com/background.jpg or .mp4"
          value={currentDeck?.background || ''}
          onChange={(e) => {
            if (currentDeck) {
              updateSlideDeck(currentDeck.id, { background: e.target.value });
            }
          }}
          disabled={!currentDeck}
        />
      </div>

      <div className="flex items-center justify-between">
        <label
          htmlFor="markdown-input"
          className="text-sm font-medium text-foreground"
        >
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
        placeholder={
          currentDeck
            ? "Enter your markdown here... Use --- to separate slides"
            : "Select a slide deck to edit"
        }
        className="min-h-[500px] font-mono text-sm"
        disabled={!currentDeck}
      />
      <div className="text-xs text-muted-foreground">
        <strong>Tip:</strong> Use <code>---</code> to separate slides. Supports
        all standard markdown formatting.
        {currentPresentation && (
          <p className="mt-1">
            When you start the presentation, all slide decks in "
            {currentPresentation.title}" will be combined and presented in
            order.
          </p>
        )}
      </div>
    </div>
  );
};

export default MarkdownEditor;
