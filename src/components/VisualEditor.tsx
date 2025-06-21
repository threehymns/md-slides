import React, { useState, useEffect, useRef } from "react";
import { Reorder } from "framer-motion";
import { Button } from "@/components/ui/button";
import TextareaAutosize from "react-textarea-autosize";
import { GripVertical, PlusCircleIcon, XIcon } from "lucide-react";
// Import necessary types from context
import { SlideDeck } from "@/types";

const DEFAULT_NEW_SLIDE_CONTENT = "";

interface SlideItem {
  id: string;
  content: string;
}

interface VisualEditorProps {
  markdown: string; // This prop is still needed for the initial state based on the deck content
  onMarkdownChange: (markdown: string) => void; // This prop is still needed to notify the parent of content changes
  // Only keep currentDeck for disabling elements within the editor
  currentDeck: SlideDeck | undefined;
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

const VisualEditor: React.FC<VisualEditorProps> = ({
  markdown: markdownProp,
  onMarkdownChange,
  // Destructure only required props
  currentDeck,
}) => {
  const [slideItems, setSlideItems] = useState<SlideItem[]>([]);
  const internalUpdateRef = useRef(false);
  // Ref to keep track of the textarea element for focusing
  const textareaRefs = useRef<{ [id: string]: HTMLTextAreaElement | null }>({});
  // State to manage focus and cursor position after actions like merging or arrow key navigation
  const [focusAfterAction, setFocusAfterAction] = useState<{
    id: string;
    position: number;
  } | null>(null);

  // Effect for initializing and handling external markdownProp changes
  useEffect(() => {
    if (internalUpdateRef.current) {
      internalUpdateRef.current = false;
      return;
    }

    // Only initialize or update slides if a deck is selected
    if (currentDeck) {
      setSlideItems(contentToSlides(markdownProp));
    } else {
      // Clear slides if no deck is selected
      setSlideItems([]);
    }
  }, [markdownProp, currentDeck]); // Depend on markdownProp and currentDeck

  // Effect to set focus and cursor position after a state update (e.g., merge or arrow key navigation)
  useEffect(() => {
    if (focusAfterAction) {
      const textarea = textareaRefs.current[focusAfterAction.id];
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(
          focusAfterAction.position,
          focusAfterAction.position,
        );
      }
      // Clear the state after setting focus
      setFocusAfterAction(null);
    }
  }, [focusAfterAction]);

  const handleReorder = (newOrder: SlideItem[]) => {
    if (!currentDeck) return; // Prevent reordering if no deck is selected
    setSlideItems(newOrder);
    internalUpdateRef.current = true;
    // Join with extra newlines to restore standard markdown format on save
    // The parent (EditPage) is responsible for calling updateSlideDeck
    onMarkdownChange(newOrder.map((item) => item.content).join("\n\n---\n\n"));
  };

  // Extracted slide‐splitting logic for clarity
  const splitSlideContent = (slideIndex: number, newText: string) => {
    const splitRegex = /\n---\n|\r\n---\r\n|\r---\r/;
    const parts = newText.split(splitRegex);
    const newSlides: SlideItem[] = [];

    // The first part keeps the original slide's ID
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

    // Reconstruct the full list, replacing the one slide with the split slides
    return [
      ...slideItems.slice(0, slideIndex),
      ...newSlides,
      ...slideItems.slice(slideIndex + 1),
    ];
  };

  const handleTextChange = (id: string, newText: string) => {
    if (!currentDeck) return; // Prevent changes if no deck is selected

    const slideIndex = slideItems.findIndex((item) => item.id === id);
    if (slideIndex === -1) {
      console.error(`Slide with id ${id} not found.`);
      return;
    }

    const splitRegex = /\n---\n|\r\n---\r\n|\r---\r/;

    if (splitRegex.test(newText)) {
      // Delegate splitting logic
      const newSlideItems = splitSlideContent(slideIndex, newText);
      setSlideItems(newSlideItems);
      onMarkdownChange(
        newSlideItems.map((item) => item.content).join("\n\n---\n\n"),
      );
    } else {
      // Regular text update
      const updatedItems = slideItems.map((item) =>
        item.id === id ? { ...item, content: newText } : item,
      );
      setSlideItems(updatedItems);
      const newMarkdown = updatedItems
        .map((item) => item.content)
        .join("\n---\n");
      onMarkdownChange(newMarkdown);
    }

    internalUpdateRef.current = true; // Indicate internal update for the main useEffect
  };

  const handleAddSlide = (afterId: string | null) => {
    if (!currentDeck) return; // Prevent adding if no deck is selected

    const newSlide: SlideItem = {
      id: generateUniqueId(),
      content: DEFAULT_NEW_SLIDE_CONTENT,
    };
    let newItems = [...slideItems];

    if (afterId === null || slideItems.length === 0) {
      // Add to beginning
      if (slideItems.length === 0) {
        newItems = [newSlide];
      } else if (
        slideItems.length === 1 &&
        slideItems[0].content === DEFAULT_NEW_SLIDE_CONTENT
      ) {
        // Replace the default empty slide
        newItems = [newSlide];
      } else {
        // Add to beginning of existing slides
        newItems = [newSlide, ...slideItems];
      }
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
    // Notify parent of the change
    onMarkdownChange(newItems.map((item) => item.content).join("\n\n---\n\n"));
    return newSlide.id; // Return the ID of the newly added slide
  };

  const handleDeleteSlide = (idToDelete: string) => {
    if (!currentDeck) return; // Prevent deletion if no deck is selected

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
    // Notify parent of the change
    onMarkdownChange(newItems.map((item) => item.content).join("\n\n---\n\n"));
  };

  const handleBackspaceAtBeginning = (slideIndex: number) => {
    if (slideIndex === 0) return false;

    const previousSlide = slideItems[slideIndex - 1];
    const currentSlide = slideItems[slideIndex];
    const mergedContent = previousSlide.content + "\n" + currentSlide.content;

    const newSlideItems = slideItems
      .map((item, index) => {
        if (index === slideIndex - 1) {
          return { ...item, content: mergedContent };
        }
        return index !== slideIndex ? item : null;
      })
      .filter((item) => item !== null) as SlideItem[];

    const cursorPosition = previousSlide.content.length + 1;

    setSlideItems(newSlideItems);
    internalUpdateRef.current = true;
    onMarkdownChange(
      newSlideItems.map((item) => item.content).join("\n\n---\n\n"),
    );

    setFocusAfterAction({
      id: previousSlide.id,
      position: cursorPosition,
    });

    return true;
  };

  const handleArrowNavigation = (
    key: string,
    slideIndex: number,
    isAtBeginning: boolean,
    isAtEnd: boolean,
  ) => {
    if (
      (key === "ArrowUp" || key === "ArrowLeft") &&
      isAtBeginning &&
      slideIndex > 0
    ) {
      const previousSlide = slideItems[slideIndex - 1];
      setFocusAfterAction({
        id: previousSlide.id,
        position: previousSlide.content.length,
      });
      return true;
    }

    if (
      (key === "ArrowDown" || key === "ArrowRight") &&
      isAtEnd &&
      slideIndex < slideItems.length - 1
    ) {
      const nextSlide = slideItems[slideIndex + 1];
      setFocusAfterAction({
        id: nextSlide.id,
        position: 0,
      });
      return true;
    }

    return false;
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    id: string,
  ) => {
    if (!currentDeck) return; // Prevent actions if no deck is selected

    const textarea = e.currentTarget;
    const isAtBeginning =
      textarea.selectionStart === 0 && textarea.selectionEnd === 0;
    const isAtEnd =
      textarea.selectionStart === textarea.value.length &&
      textarea.selectionEnd === textarea.value.length;
    const cursorPosition = textarea.selectionStart;

    const slideIndex = slideItems.findIndex((item) => item.id === id);

    if (e.key === "Backspace" && isAtBeginning) {
      if (handleBackspaceAtBeginning(slideIndex)) {
        e.preventDefault();
      }
    } else if (
      ["ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight"].includes(e.key)
    ) {
      if (handleArrowNavigation(e.key, slideIndex, isAtBeginning, isAtEnd)) {
        e.preventDefault();
      }
    }

    // Handle Ctrl/Cmd + Enter for splitting slide
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent default behavior (new line)

      const currentSlide = slideItems[slideIndex];
      const content = currentSlide.content;
      let contentBeforeCursor = content.substring(0, cursorPosition);
      let contentAfterCursor = content.substring(cursorPosition);

      // Trim trailing newline from the first part if the split point was just after a newline
      if (cursorPosition > 0 && content[cursorPosition - 1] === "\n") {
        contentBeforeCursor = contentBeforeCursor.slice(0, -1);
      }

      // Trim leading newline from the second part if the split point was just before a newline
      if (cursorPosition < content.length && content[cursorPosition] === "\n") {
        contentAfterCursor = contentAfterCursor.slice(1);
      }

      // Update current slide content
      const updatedCurrentSlide = {
        ...currentSlide,
        content: contentBeforeCursor,
      };

      // Create new slide for content after cursor
      const newSlide: SlideItem = {
        id: generateUniqueId(),
        content: contentAfterCursor || DEFAULT_NEW_SLIDE_CONTENT, // Use default content if splitting at the very end
      };

      // Insert the new slide after the current one
      const newSlideItems = [
        ...slideItems.slice(0, slideIndex),
        updatedCurrentSlide,
        newSlide,
        ...slideItems.slice(slideIndex + 1),
      ];

      setSlideItems(newSlideItems);
      internalUpdateRef.current = true;
      onMarkdownChange(
        newSlideItems.map((item) => item.content).join("\n\n---\n\n"),
      );

      // Set focus to the new slide at the beginning
      setFocusAfterAction({
        id: newSlide.id,
        position: 0,
      });
    }

    // Handle Ctrl/Cmd + Shift + Enter for inserting new slide
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && e.shiftKey) {
      e.preventDefault(); // Prevent default behavior

      const newSlideId = handleAddSlide(id); // Use the existing add slide function

      // Set focus to the newly added slide at the beginning
      if (newSlideId) {
        setFocusAfterAction({
          id: newSlideId,
          position: 0,
        });
      }
    }
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
              // Disable dragging if no deck is selected
              dragConstraints={currentDeck ? {} : false}
            >
              {/* Drag handle */}
              <div
                className={`cursor-grab text-muted-foreground/50 hover:text-muted-foreground transition-colors duration-150 p-4 absolute -left-12 top-0 bottom-0 ${currentDeck ? "opacity-0 group-hover:opacity-100" : "opacity-0"}`}
              >
                <GripVertical className="w-5 h-full" />
              </div>
              <TextareaAutosize
                ref={(el) => (textareaRefs.current[item.id] = el)} // Assign ref
                value={item.content}
                onChange={(e) => handleTextChange(item.id, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, item.id)} // Add key down handler
                className="w-full py-2 p-4 rounded-lg shadow focus:ring-2 focus:ring-border outline-none text-sm bg-card resize-none"
                minRows={3}
                placeholder={
                  currentDeck
                    ? "Write anything..."
                    : "Select a slide deck to edit"
                }
                disabled={!currentDeck} // Disable if no deck is selected
              />
              <Button
                variant="ghost"
                size="icon"
                className={`absolute top-4 -right-10 rounded-full text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition-opacity duration-150 z-20 w-8 h-8 ${currentDeck ? "opacity-0 group-hover:opacity-100" : "opacity-0"}`}
                onClick={() => handleDeleteSlide(item.id)}
                aria-label="Delete this slide"
                disabled={!currentDeck} // Disable if no deck is selected
              >
                <XIcon className="w-5 h-5" />{" "}
              </Button>
            </Reorder.Item>
            {/* Inter-slide adder */}
            <div
              className={`absolute inset-x-0 bottom-[-16px] h-8 flex items-center justify-center transition-opacity duration-150 z-10 ${currentDeck ? "opacity-0 hover:opacity-100" : "opacity-0"}`}
            >
              <Button
                variant="ghost"
                aria-label="Add new slide after this"
                size="icon"
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 w-8 h-8"
                onClick={() => handleAddSlide(item.id)}
                disabled={!currentDeck} // Disable if no deck is selected
              >
                <PlusCircleIcon className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </React.Fragment>
      ))}
      {/* Show "Add First Slide" button only if a deck is selected AND slideItems is empty */}
      {currentDeck && slideItems.length === 0 && (
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
      {/* Show "Select a slide deck" message if no deck is selected */}
      {!currentDeck && (
        <div className="text-center py-10">
          <p className="mb-4 text-muted-foreground">
            Select a slide deck to start editing.
          </p>
        </div>
      )}
    </Reorder.Group>
  );
};

export default VisualEditor;
