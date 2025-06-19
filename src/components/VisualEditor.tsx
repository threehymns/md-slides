import React, { useState, useEffect, useRef } from "react";
import { Reorder } from "framer-motion";
import { Button } from "@/components/ui/button";
import TextareaAutosize from "react-textarea-autosize";
import { PlusCircleIcon, XIcon } from "lucide-react"; // Import XIcon

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

const VisualEditor: React.FC<VisualEditorProps> = ({
  markdown: markdownProp,
  onMarkdownChange,
}) => {
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
      return md.split("\n---\n").map((content) => ({
        id: generateUniqueId(),
        content,
      }));
    };
    setSlideItems(contentToSlides(markdownProp));
  }, [markdownProp]);

  const handleReorder = (newOrder: SlideItem[]) => {
    setSlideItems(newOrder);
    internalUpdateRef.current = true;
    onMarkdownChange(newOrder.map((item) => item.content).join("\n---\n"));
  };

  const handleTextChange = (id: string, newText: string) => {
    const newItems = slideItems.map((item) =>
      item.id === id ? { ...item, content: newText } : item,
    );
    setSlideItems(newItems);
    internalUpdateRef.current = true;
    onMarkdownChange(newItems.map((item) => item.content).join("\n---\n"));
  };

  const handleAddSlide = (afterId: string | null) => {
    const newSlide: SlideItem = {
      id: generateUniqueId(),
      content: DEFAULT_NEW_SLIDE_CONTENT,
    };
    let newItems = [...slideItems];

    if (afterId === null || slideItems.length === 0) {
      // If afterId is null (e.g. "Add First Slide" button) or if slideItems is somehow empty
      newItems = [
        newSlide,
        ...newItems.filter(
          (item) =>
            item.content !== DEFAULT_NEW_SLIDE_CONTENT || newItems.length > 1,
        ),
      ];
      // Filter out initial default slide if it exists and we're adding a new one, unless it was the only one.
      if (
        newItems.length > 1 &&
        newItems[1]?.content === DEFAULT_NEW_SLIDE_CONTENT &&
        newItems[1]?.id !== newSlide.id
      ) {
        if (
          slideItems.length === 1 &&
          slideItems[0].content === DEFAULT_NEW_SLIDE_CONTENT
        ) {
          newItems.shift(); // Remove the original default slide if it was the only one and now we add a new one
        }
      }
      // If the list was truly empty and we add one, ensure it's just the new slide.
      if (slideItems.length === 0) newItems = [newSlide];
    } else {
      const insertAtIndex = newItems.findIndex((item) => item.id === afterId);
      if (insertAtIndex !== -1) {
        newItems.splice(insertAtIndex + 1, 0, newSlide);
      } else {
        newItems.push(newSlide); // Fallback: add to end
      }
    }
    setSlideItems(newItems);
    internalUpdateRef.current = true;
    onMarkdownChange(newItems.map((item) => item.content).join("\n---\n"));
  };

  const handleDeleteSlide = (idToDelete: string) => {
    const itemToDelete = slideItems.find((item) => item.id === idToDelete);
    if (!itemToDelete) return;

    if (
      slideItems.length === 1 &&
      !window.confirm(
        "This is the last slide. Are you sure you want to delete it? This will result in an empty editor.",
      )
    ) {
      return;
    }
    if (
      slideItems.length > 1 &&
      !window.confirm("Are you sure you want to delete this slide?")
    ) {
      return;
    }

    let newItems = slideItems.filter((item) => item.id !== idToDelete);

    if (newItems.length === 0) {
      newItems = [
        { id: generateUniqueId(), content: DEFAULT_NEW_SLIDE_CONTENT },
      ];
    }
    setSlideItems(newItems);
    internalUpdateRef.current = true;
    onMarkdownChange(newItems.map((item) => item.content).join("\n---\n"));
  };

  // Removed the second useEffect that was causing confusion.
  // The main useEffect depending on [markdownProp] is now the single source of truth for external changes.

  return (
    <Reorder.Group
      axis="y"
      values={slideItems}
      onReorder={handleReorder}
      className="w-full"
    >
      {" "}
      {/* Removed space-y-4 for more precise control with adder */}
      {slideItems.map((item) => (
        <React.Fragment key={item.id}>
          <div className="relative group">
            {" "}
            {/* Wrapper for Reorder.Item and its specific adder button */}
            <Reorder.Item
              value={item}
              className="flex flex-col py-2 bg-transparent pt-10" // Adjusted pt-10 for new delete button size/pos
            >
              {/* The old actions bar div that contained the delete button is now removed */}
              <TextareaAutosize
                value={item.content}
                onChange={(e) => handleTextChange(item.id, e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary text-sm bg-background"
                minRows={3}
              />
              {/* Separator is part of the item, but only if not the last one conceptually (though adders are between) */}
              {/* This hr might be redundant if adders provide enough visual separation or if we add it inside the adder div */}
            </Reorder.Item>
            {/* Inter-slide adder: appears on hover of the Reorder.Item wrapper (group) */}
            <div className="absolute inset-x-0 bottom-[-16px] h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10">
              <Button
                variant="ghost"
                aria-label="Add new slide after this"
                size="icon"
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 w-8 h-8"
                onClick={() => handleAddSlide(item.id)}
              >
                <PlusCircleIcon className="w-5 h-5" />
              </Button>
            </div>
            {/* New Delete Button: top-right, appears on hover of the Reorder.Item wrapper (group) */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 rounded-full hover:bg-destructive/20 text-destructive opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-20 w-8 h-8" // Made consistent: w-8 h-8, top-2 right-2
              onClick={() => handleDeleteSlide(item.id)}
              aria-label="Delete this slide"
            >
              <XIcon className="w-5 h-5" />{" "}
              {/* Icon size made consistent with PlusCircleIcon */}
            </Button>
          </div>
          {/* Separator between items */}
          {item.id !== slideItems[slideItems.length - 1].id && (
            <hr className="my-4 border-border" />
          )}
        </React.Fragment>
      ))}
      {slideItems.length === 0 && (
        <div className="text-center py-10">
          <p className="mb-4 text-muted-foreground">
            The editor is currently empty.
          </p>
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
