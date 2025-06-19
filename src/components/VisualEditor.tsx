import React, { useState, useEffect, useRef } from 'react';
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

const VisualEditor: React.FC<VisualEditorProps> = ({ markdown: markdownProp, onMarkdownChange }) => {
  const [slideItems, setSlideItems] = useState<SlideItem[]>([]);
  const internalUpdateRef = useRef(false);

  // Effect for initializing and handling external markdownProp changes
  useEffect(() => {
    if (internalUpdateRef.current) {
      internalUpdateRef.current = false;
      return;
    }

    const contentToSlides = (md: string): SlideItem[] => {
      if (md.trim() === "") {
        // If markdownProp is empty, always initialize with one default slide
        return [{ id: generateUniqueId(), content: DEFAULT_NEW_SLIDE_CONTENT }];
      }
      return md.split('\n---\n').map(content => ({
        id: generateUniqueId(),
        content,
      }));
    };
    setSlideItems(contentToSlides(markdownProp));
  }, [markdownProp]);


  const handleReorder = (newOrder: SlideItem[]) => {
    setSlideItems(newOrder);
    internalUpdateRef.current = true;
    onMarkdownChange(newOrder.map(item => item.content).join('\n---\n'));
  };

  const handleTextChange = (id: string, newText: string) => {
    const newItems = slideItems.map(item =>
      item.id === id ? { ...item, content: newText } : item
    );
    setSlideItems(newItems);
    internalUpdateRef.current = true;
    onMarkdownChange(newItems.map(item => item.content).join('\n---\n'));
  };

  const handleAddSlide = (afterId: string | null) => {
    const newSlide: SlideItem = { id: generateUniqueId(), content: DEFAULT_NEW_SLIDE_CONTENT };
    let newItems = [...slideItems];

    if (afterId === null || slideItems.length === 0) {
        // If afterId is null (e.g. "Add First Slide" button) or if slideItems is somehow empty
        newItems = [newSlide, ...newItems.filter(item => item.content !== DEFAULT_NEW_SLIDE_CONTENT || newItems.length > 1 )];
         // Filter out initial default slide if it exists and we're adding a new one, unless it was the only one.
        if (newItems.length > 1 && newItems[1]?.content === DEFAULT_NEW_SLIDE_CONTENT && newItems[1]?.id !== newSlide.id) {
             if(slideItems.length === 1 && slideItems[0].content === DEFAULT_NEW_SLIDE_CONTENT){
                newItems.shift(); // Remove the original default slide if it was the only one and now we add a new one
             }
        }
        // If the list was truly empty and we add one, ensure it's just the new slide.
        if (slideItems.length === 0) newItems = [newSlide];


    } else {
        const insertAtIndex = newItems.findIndex(item => item.id === afterId);
        if (insertAtIndex !== -1) {
            newItems.splice(insertAtIndex + 1, 0, newSlide);
        } else {
            newItems.push(newSlide); // Fallback: add to end
        }
    }
    setSlideItems(newItems);
    internalUpdateRef.current = true;
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

    let newItems = slideItems.filter(item => item.id !== idToDelete);

    if (newItems.length === 0) {
      newItems = [{ id: generateUniqueId(), content: DEFAULT_NEW_SLIDE_CONTENT }];
    }
    setSlideItems(newItems);
    internalUpdateRef.current = true;
    onMarkdownChange(newItems.map(item => item.content).join('\n---\n'));
  };

  // Removed the second useEffect that was causing confusion.
  // The main useEffect depending on [markdownProp] is now the single source of truth for external changes.

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
