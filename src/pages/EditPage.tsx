import React, { useState } from "react";
import MarkdownEditor from "@/components/MarkdownEditor";
import VisualEditor from "@/components/VisualEditor";
import { Button } from "@/components/ui/button";
import { usePresentations } from "@/contexts/PresentationsContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ImageIcon, VideoIcon, TextIcon, LayoutIcon } from "lucide-react";
import { type SlideDeck } from "@/types";
import { useAppSettings } from "../layouts/MainLayout";

const EditPage = () => {
  const {
    getCurrentSlideDeck,
    getCurrentPresentation,
    getPresentationSlideDecks,
    updateSlideDeck,
  } = usePresentations();

  const { showSlideNumbers } = useAppSettings();

  const currentDeck = getCurrentSlideDeck();
  const currentPresentation = getCurrentPresentation();
  const presentationSlideDecks = currentPresentation
    ? getPresentationSlideDecks(currentPresentation.id)
    : [];

  const markdown = currentDeck?.content || "";

  // State for editor mode: 'markdown' or 'visual'
  const [editorMode, setEditorMode] = useState<"markdown" | "visual">("visual");

  const handleMarkdownChange = (newContent: string) => {
    if (currentDeck) {
      updateSlideDeck(currentDeck.id, { content: newContent });
    }
  };

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

  const handleLoadSample = () => {
    if (currentDeck) {
      handleMarkdownChange(sampleMarkdown); // Use the existing handler to update the deck content
    }
  };

  if (!currentDeck) {
    return (
      <div className="min-h-full flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Slide Deck Selected</h1>
          <p className="text-muted-foreground">
            Please select a slide deck to edit.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-101px)] max-w-xl mx-auto p-4 space-y-4">
      {" "}
      {/* Adjusted container */}
      <div>
        {" "}
        {/* Title and presentation info */}
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
        {" "}
        {/* Background URL and media type */}
        <Label htmlFor="background-url" className="text-sm font-medium">
          Background URL
        </Label>
        <div className="flex gap-2">
          <Input
            id="background-url"
            type="url"
            placeholder="https://example.com/background.jpg"
            value={currentDeck?.background || ""}
            onChange={(e) => {
              if (currentDeck) {
                updateSlideDeck(currentDeck.id, { background: e.target.value });
              }
            }}
            disabled={!currentDeck}
            className="flex-1"
          />
          <ToggleGroup
            type="single"
            value={currentDeck?.mediaType || "image"}
            onValueChange={(value) => {
              // Only update if value is 'image' or 'video' and deck exists
              if (currentDeck && (value === "image" || value === "video")) {
                updateSlideDeck(currentDeck.id, { mediaType: value });
              } else if (currentDeck && value === "") {
                // Handle deselection if needed, though ToggleGroup with type="single" prevents this
                // updateSlideDeck(currentDeck.id, { mediaType: undefined });
              }
            }}
            disabled={!currentDeck}
          >
            <ToggleGroupItem value="image" aria-label="Image">
              <ImageIcon className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="video" aria-label="Video">
              <VideoIcon className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      <div className="flex items-center justify-between">
        {" "}
        {/* Editor Mode Switch and Sample Loader */}
        {/* Editor Mode Switch */}
        <ToggleGroup
          type="single"
          value={editorMode}
          onValueChange={(value: "markdown" | "visual") => {
            if (value) setEditorMode(value); // Only update if a value is selected
          }}
          aria-label="Editor mode toggle"
        >
          <ToggleGroupItem
            className="px-5"
            value="visual"
            aria-label="Visual Editor"
          >
            <LayoutIcon className="mr-2 h-4 w-4" /> Visual
          </ToggleGroupItem>
          <ToggleGroupItem
            className="px-5"
            value="markdown"
            aria-label="Markdown Editor"
          >
            <TextIcon className="mr-2 h-4 w-4" /> Raw
          </ToggleGroupItem>
        </ToggleGroup>
        {/* Sample Loader Button */}
        {markdown.trim() === "" && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleLoadSample}
            disabled={!currentDeck}
          >
            Load Sample
          </Button>
        )}
      </div>
      <div className="max-w-full">
        {" "}
        {/* Ensure editor takes available width */}
        {editorMode === "markdown" ? (
          <MarkdownEditor
            markdown={markdown}
            onMarkdownChange={handleMarkdownChange}
            currentDeck={currentDeck}
          />
        ) : (
          <VisualEditor
            markdown={markdown}
            onMarkdownChange={handleMarkdownChange}
            currentDeck={currentDeck}
            showSlideNumbers={showSlideNumbers}
          />
        )}
      </div>
      <div className="text-xs text-muted-foreground">
        {" "}
        {/* Added tip */}
        {editorMode === "markdown" ? (
          <>
            <strong>Tip:</strong> Use <code>---</code> to separate slides.
            Supports all standard markdown formatting.
          </>
        ) : (
          <>
            <strong>Tip:</strong> Slides are separated visually. Adding "---" in
            a slide will split it.
          </>
        )}
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

export default EditPage;
