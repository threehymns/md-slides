import React, { useState, useEffect } from 'react';
import MarkdownEditor from '@/components/MarkdownEditor';
import { usePresentations } from '@/contexts/PresentationsContext'; // To get deck content
import { useParams } from 'react-router-dom'; // To get deckId from URL

const EditorPage = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const { getSlideDeck, updateSlideDeck } = usePresentations();
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    if (deckId) {
      const deck = getSlideDeck(deckId);
      if (deck) {
        setMarkdown(deck.content);
      } else {
        // Handle deck not found, maybe navigate to NotFound page or show an error
        setMarkdown('## Deck not found');
      }
    }
  }, [deckId, getSlideDeck]);

  const handleMarkdownChange = (newContent: string) => {
    if (deckId) {
      updateSlideDeck(deckId, { content: newContent });
      setMarkdown(newContent); // Keep local state in sync
    }
  };

  if (!deckId) {
    return <div>Error: No deck ID provided.</div>;
  }

  return (
    <div className="h-full w-full"> {/* Ensure editor takes full space */}
      <MarkdownEditor
        markdown={markdown}
        onMarkdownChange={handleMarkdownChange}
      />
    </div>
  );
};

export default EditorPage;
