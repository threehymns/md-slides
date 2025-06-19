import React, { useState, useEffect } from 'react';
import { Reorder } from 'framer-motion';
import { Button } from '@/components/ui/button'; // Assuming Button component is available

const DEFAULT_NEW_SLIDE_CONTENT = "# New Slide\n\nEdit this content.";

interface VisualEditorProps {
  markdown: string;
  onMarkdownChange: (markdown: string) => void;
}

const VisualEditor: React.FC<VisualEditorProps> = ({ markdown, onMarkdownChange }) => {
  const [slideSections, setSlideSections] = useState<string[]>([]);

  useEffect(() => {
    // Initialize with a default slide if markdown is empty
    if (markdown.trim() === "") {
      setSlideSections([DEFAULT_NEW_SLIDE_CONTENT]);
    } else {
      setSlideSections(markdown.split('\n---\n'));
    }
  }, [markdown]);

  const handleReorder = (newOrder: string[]) => {
    setSlideSections(newOrder);
    onMarkdownChange(newOrder.join('\n---\n'));
  };

  const handleTextChange = (index: number, newText: string) => {
    const newSlides = [...slideSections];
    newSlides[index] = newText;
    setSlideSections(newSlides);
    onMarkdownChange(newSlides.join('\n---\n'));
  };

  const handleAddSlide = (index: number) => {
    const newSlides = [...slideSections];
    newSlides.splice(index + 1, 0, DEFAULT_NEW_SLIDE_CONTENT);
    setSlideSections(newSlides);
    onMarkdownChange(newSlides.join('\n---\n'));
  };

  const handleDeleteSlide = (index: number) => {
    if (slideSections.length === 1 && !window.confirm("This is the last slide. Are you sure you want to delete it? This will result in an empty editor.")) {
      return;
    }
    if (slideSections.length > 1 && !window.confirm("Are you sure you want to delete this slide?")) {
      return;
    }

    const newSlides = [...slideSections];
    newSlides.splice(index, 1);

    // If all slides are deleted, ensure onMarkdownChange is called with empty string
    if (newSlides.length === 0) {
      setSlideSections([]); // Keep state consistent if needed, though it might be immediately overwritten by parent
      onMarkdownChange("");
    } else {
      setSlideSections(newSlides);
      onMarkdownChange(newSlides.join('\n---\n'));
    }
  };

  return (
    <Reorder.Group axis="y" values={slideSections} onReorder={handleReorder} className="space-y-4">
      {slideSections.map((slide, index) => (
        <Reorder.Item
          key={slide + index} // Consider more robust key if slide content can be identical
          value={slide}
          className="bg-card p-4 rounded-lg shadow border" // Using card-like styling from shadcn
        >
          <textarea
            value={slide}
            onChange={(e) => handleTextChange(index, e.target.value)}
            rows={8} // Reduced rows for better display with buttons
            className="w-full p-2 border rounded-md mb-2 focus:ring-2 focus:ring-primary"
          />
          <div className="flex justify-between items-center mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddSlide(index)}
            >
              Add New Slide Here
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDeleteSlide(index)}
            >
              Delete This Slide
            </Button>
          </div>
          {index < slideSections.length - 1 && (
            <hr className="my-4 border-border" /> // Styled hr
          )}
        </Reorder.Item>
      ))}
       {/* Add a button to add a slide if the editor is empty */}
       {slideSections.length === 0 && (
        <div className="text-center py-10">
          <p className="mb-4 text-muted-foreground">The editor is currently empty.</p>
          <Button
            onClick={() => handleAddSlide(-1)} // Adds to the beginning
          >
            Add First Slide
          </Button>
        </div>
      )}
    </Reorder.Group>
  );
};

export default VisualEditor;
