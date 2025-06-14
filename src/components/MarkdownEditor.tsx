
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface MarkdownEditorProps {
  markdown: string;
  onMarkdownChange: (markdown: string) -> void;
  onStartPresentation: () => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  markdown,
  onMarkdownChange,
  onStartPresentation
}) => {
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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Markdown Slideshow</h1>
              <p className="text-gray-600 mt-1">Create beautiful presentations from markdown</p>
            </div>
            <Button 
              onClick={onStartPresentation}
              disabled={!markdown.trim()}
              size="lg"
            >
              Start Presentation
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="markdown-input" className="text-sm font-medium text-gray-700">
                Markdown Content
              </label>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onMarkdownChange(sampleMarkdown)}
              >
                Load Sample
              </Button>
            </div>
            
            <Textarea
              id="markdown-input"
              value={markdown}
              onChange={(e) => onMarkdownChange(e.target.value)}
              placeholder="Enter your markdown here... Use --- to separate slides"
              className="min-h-[500px] font-mono text-sm"
            />
            
            <div className="text-xs text-gray-500">
              <strong>Tip:</strong> Use <code>---</code> to separate slides. Supports all standard markdown formatting.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;
