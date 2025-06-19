import React, { useState, useEffect } from 'react';
import { Reorder } from 'framer-motion';
import { Button } from '@/components/ui/button';

const DEFAULT_NEW_SLIDE_CONTENT = "# New Slide\n\nEdit this content.";

interface SlideItem {
  id: string;
  content: string;
}

interface VisualEditorProps {
  markdown: string;
  onMarkdownChange: (markdown: string) => void;
}

const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const VisualEditor: React.FC<VisualEditorProps> = ({ markdown, onMarkdownChange }) => {
  const [slideItems, setSlideItems] = useState<SlideItem[]>([]);

  useEffect(() => {
    const contentToSlides = (md: string): SlideItem[] => {
      if (md.trim() === "") {
        return [{ id: generateUniqueId(), content: DEFAULT_NEW_SLIDE_CONTENT }];
      }
      return md.split('\n---\n').map(content => ({
        id: generateUniqueId(),
        content,
      }));
    };
    setSlideItems(contentToSlides(markdown));
  }, [markdown]);

  const handleReorder = (newOrder: SlideItem[]) => {
    setSlideItems(newOrder);
    onMarkdownChange(newOrder.map(item => item.content).join('\n---\n'));
  };

  const handleTextChange = (id: string, newText: string) => {
    const newItems = slideItems.map(item =>
      item.id === id ? { ...item, content: newText } : item
    );
    setSlideItems(newItems);
    onMarkdownChange(newItems.map(item => item.content).join('\n---\n'));
  };

  const handleAddSlide = (afterId: string | null) => {
    const newSlide: SlideItem = { id: generateUniqueId(), content: DEFAULT_NEW_SLIDE_CONTENT };
    let newItems = [...slideItems];

    if (afterId === null) { // Add to beginning if editor was empty
        newItems = [newSlide];
    } else {
        const insertAtIndex = newItems.findIndex(item => item.id === afterId);
        if (insertAtIndex !== -1) {
            newItems.splice(insertAtIndex + 1, 0, newSlide);
        } else {
             // Should not happen if an ID is provided, but as a fallback, add to end
            newItems.push(newSlide);
        }
    }
    setSlideItems(newItems);
    onMarkdownChange(newItems.map(item => item.content).join('\n---\n'));
  };

  const handleDeleteSlide = (idToDelete: string) => {
    const itemToDelete = slideItems.find(item => item.id === idToDelete);
    if (!itemToDelete) return;

    if (slideItems.length === 1 && !window.confirm("This is the last slide. Are you sure you want to delete it? This will result in an empty editor.")) {
      return;
    }
    if (slideItems.length > 1 && !window.confirm("Are you sure you want to delete this slide?")) {
      return;
    }

    const newItems = slideItems.filter(item => item.id !== idToDelete);

    if (newItems.length === 0) {
      // If all slides are deleted, create a new default slide
      const defaultSlide: SlideItem = { id: generateUniqueId(), content: DEFAULT_NEW_SLIDE_CONTENT };
      setSlideItems([defaultSlide]);
      onMarkdownChange(defaultSlide.content); // Call with the content of the single default slide
    } else {
      setSlideItems(newItems);
      onMarkdownChange(newItems.map(item => item.content).join('\n---\n'));
    }
  };

  // This effect ensures that if the parent markdown becomes truly empty
  // (e.g. parent explicitly sets it to ""), we reflect that by showing one default slide.
  // And if it's populated from empty, it creates new IDs.
  useEffect(() => {
    if (markdown.trim() === "" && (slideItems.length > 1 || (slideItems.length === 1 && slideItems[0].content !== DEFAULT_NEW_SLIDE_CONTENT))) {
      const newDefaultSlide = { id: generateUniqueId(), content: DEFAULT_NEW_SLIDE_CONTENT };
      setSlideItems([newDefaultSlide]);
      // Do not call onMarkdownChange here to avoid loops if parent is also reacting
    } else if (markdown.trim() !== "" && slideItems.map(s => s.content).join("\n---\n") !== markdown) {
      // This condition handles cases where markdown prop changes externally
      // and is not just a reflection of internal state changes.
      // It re-initializes slide IDs.
       setSlideItems(markdown.split('\n---\n').map(content => ({
        id: generateUniqueId(),
        content,
      })));
    }
  // Intentionally limit dependencies: only react to external `markdown` prop changes that are not caused by this component itself.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markdown]);


  return (
    <Reorder.Group axis="y" values={slideItems} onReorder={handleReorder} className="space-y-4">
      {slideItems.map((item) => (
        <Reorder.Item
          key={item.id}
          value={item}
          className="bg-card p-4 rounded-lg shadow border flex flex-col"
        >
          <div className="flex justify-end space-x-2 mb-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddSlide(item.id)}
            >
              Add New Slide Here
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDeleteSlide(item.id)}
            >
              Delete This Slide
            </Button>
          </div>
          <textarea
            value={item.content}
            onChange={(e) => handleTextChange(item.id, e.target.value)}
            rows={8}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary grow"
          />
          {slideItems.length > 1 && item.id !== slideItems[slideItems.length -1].id && ( // Show separator if not the last slide
            <hr className="my-4 border-border" />
          )}
        </Reorder.Item>
      ))}
       {slideItems.length === 0 && ( // Should ideally not be reached if we always ensure one slide
        <div className="text-center py-10">
          <p className="mb-4 text-muted-foreground">The editor is currently empty.</p>
          <Button
            onClick={() => handleAddSlide(null)} // Add a first slide
          >
            Add First Slide
          </Button>
        </div>
      )}
    </Reorder.Group>
  );
};

export default VisualEditor;
