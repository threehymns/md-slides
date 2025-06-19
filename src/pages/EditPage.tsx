import { useState } from 'react';
import MarkdownEditor from '@/components/MarkdownEditor';
import VisualEditor from '@/components/VisualEditor'; // Import VisualEditor
import { Button } from '@/components/ui/button'; // Import Button
import { usePresentations } from '@/contexts/PresentationsContext';

const EditPage = () => {
  const { 
    getCurrentSlideDeck, 
    updateSlideDeck 
  } = usePresentations();

  const currentDeck = getCurrentSlideDeck();
  const markdown = currentDeck?.content || '';

  const [isVisualMode, setIsVisualMode] = useState(false); // State for editor mode

  const handleMarkdownChange = (newContent: string) => {
    if (currentDeck) {
      updateSlideDeck(currentDeck.id, { content: newContent });
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
    <div className="p-4">
      <div className="mb-4">
        <Button onClick={() => setIsVisualMode(!isVisualMode)}>
          {isVisualMode ? 'Switch to Markdown Editor' : 'Switch to Visual Editor'}
        </Button>
      </div>
      <div className="max-w-6xl mx-auto p-4">
        {isVisualMode ? (
          <VisualEditor
            markdown={markdown}
            onMarkdownChange={handleMarkdownChange}
          />
        ) : (
          <MarkdownEditor
            markdown={markdown}
            onMarkdownChange={handleMarkdownChange}
          />
        )}
      </div>
    </div>
  );
};

export default EditPage;