import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { type SlideDeck } from "@/types";

interface MarkdownEditorProps {
  markdown: string;
  onMarkdownChange: (markdown: string) => void;
  currentDeck: SlideDeck | undefined;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  markdown,
  onMarkdownChange,
  currentDeck,
}) => {
  return (
    <div className="space-y-4">
      {" "}
      {/* Adjusted container for consistent spacing */}
      {/* Removed: Title and presentation info */}
      {/* Removed: Background URL and media type */}
      <div className="flex items-center justify-between">
        {/* Sample loader button removed from here */}
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
      {/* Removed: Tip */}
    </div>
  );
};

export default MarkdownEditor;
