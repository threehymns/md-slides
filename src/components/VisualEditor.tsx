import React, { useState, useEffect, useRef } from "react";
import { Reorder } from "framer-motion";
import { Button } from "@/components/ui/button";
import TextareaAutosize from "react-textarea-autosize";
import { GripVertical, PlusCircleIcon, XIcon } from "lucide-react";

const DEFAULT_NEW_SLIDE_CONTENT = "";

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

// Helper function to remove exactly one leading/trailing newline sequence
const trimOneNewline = (str: string): string => {
  let result = str;
  // Check and remove leading newline sequence
  if (result.startsWith("\r\n")) {
    result = result.substring(2);
  } else if (result.startsWith("\n") || result.startsWith("\r")) {
    result = result.substring(1);
  }
  // Check and remove trailing newline sequence
  if (result.endsWith("\r\n")) {
    result = result.substring(0, result.length - 2);
  } else if (result.endsWith("\n") || result.endsWith("\r")) {
    result = result.substring(0, result.length - 1);
  }
  return result;
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
      // Split by '---' on its own line (standard markdown delimiter)
      // Then remove exactly one leading/trailing newline from each slide content
      return md.split(/\n---\n|\r\n---\r\n|\r---\r/).map((content) => ({
        id: generateUniqueId(),
        content: trimOneNewline(content),
      }));
    };
    setSlideItems(contentToSlides(markdownProp));
  }, [markdownProp]);

  const handleReorder = (newOrder: SlideItem[]) => {
    setSlideItems(newOrder);
    internalUpdateRef.current = true;
    // Join with extra newlines to restore standard markdown format on save
    onMarkdownChange(newOrder.map((item) => item.content).join("\n\n---\n\n"));
  };

  const handleTextChange = (id: string, newText: string) => {
    const slideIndex = slideItems.findIndex((item) => item.id === id);
    if (slideIndex === -1) {
      console.error(`Slide with id ${id} not found.`);
      return;
    }

    // Update the content of the specific slide being edited immediately
    const updatedItems = slideItems.map((item) =>
      item.id === id ? { ...item, content: newText } : item,
    );

    // Use a regex that matches --- surrounded by newlines
    const splitRegex = /\n---\n|\r\n---\r\n|\r---\r/;

    // Check if the new text now contains the split delimiter
    if (splitRegex.test(newText)) {
      // If delimiter is found, split the slide's content and update state
      const parts = newText.split(splitRegex);
      const newSlides: SlideItem[] = [];

      // The first part keeps the original slide's ID
      // Apply trimOneNewline to clean up parts
      newSlides.push({
        id: slideItems[slideIndex].id,
        content: trimOneNewline(parts[0] || DEFAULT_NEW_SLIDE_CONTENT),
      });

      // Subsequent parts become new slides with new IDs
      for (let i = 1; i < parts.length; i++) {
        newSlides.push({
          id: generateUniqueId(),
          content: trimOneNewline(parts[i] || DEFAULT_NEW_SLIDE_CONTENT),
        });
      }

      // Construct the new slideItems array by replacing the old slide with the new ones
      const newSlideItems = [
        ...slideItems.slice(0, slideIndex), // slides before the edited one
        ...newSlides, // the newly split slides
        ...slideItems.slice(slideIndex + 1), // slides after the edited one
      ];

      setSlideItems(newSlideItems);

      // Generate markdown from the potentially new structure
      const newMarkdown = newSlideItems
        .map((item) => item.content)
        .join("\n---\n");
      onMarkdownChange(newMarkdown);
    } else {
      // No split delimiter found, just update state with the content change
      setSlideItems(updatedItems);

      // Generate markdown from the updated items (single change)
      const newMarkdown = updatedItems
        .map((item) => item.content)
        .join("\n---\n");
      onMarkdownChange(newMarkdown);
    }

    internalUpdateRef.current = true; // Indicate internal update for the main useEffect
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
    onMarkdownChange(newItems.map((item) => item.content).join("\n\n---\n\n"));
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
    onMarkdownChange(newItems.map((item) => item.content).join("\n\n---\n\n"));
  };

  return (
    <Reorder.Group
      axis="y"
      values={slideItems}
      onReorder={handleReorder}
      className="w-full"
    >
      {" "}
      {slideItems.map((item) => (
        <React.Fragment key={item.id}>
          <div className="relative group">
            {" "}
            <Reorder.Item
              value={item}
              className="flex flex-row items-center py-2"
              animate={{ scale: 1 }}
              whileDrag={{ scale: 1.02 }}
            >
              {/* Drag handle */}
              <div className="cursor-grab text-muted-foreground/50 hover:text-muted-foreground transition-colors duration-150 p-2 opacity-0 group-hover:opacity-100">
                <GripVertical className="w-5 h-full" />
              </div>
              <TextareaAutosize
                value={item.content}
                onChange={(e) => handleTextChange(item.id, e.target.value)}
                className="w-full py-2 p-4 rounded-lg shadow focus:ring-2 focus:ring-border outline-none text-sm bg-card resize-none"
                minRows={3}
                placeholder="Write anything..."
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 -right-10 rounded-full text-muted-foreground hover:bg-destructive/20 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-20 w-8 h-8"
                onClick={() => handleDeleteSlide(item.id)}
                aria-label="Delete this slide"
              >
                <XIcon className="w-5 h-5" />{" "}
              </Button>
            </Reorder.Item>
            {/* Inter-slide adder */}
            <div className="absolute inset-x-0 bottom-[-16px] h-8 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-150 z-10">
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
          </div>
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
