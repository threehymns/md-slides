import React from 'react';
import { usePresentations } from '@/contexts/PresentationsContext';
import { SlideDeck } from '@/types';
import { Reorder, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { GripVertical, X, Edit } from 'lucide-react';

export const PresentationManager = () => {
  const {
    getCurrentPresentation,
    getPresentationSlideDecks,
    updatePresentation,
    setCurrentSlideDeck,
    removeSlideDeckFromPresentation,
    addSlideDeckToPresentation,
  } = usePresentations();

  const presentation = getCurrentPresentation();

  if (!presentation) {
    return (
      <div className="min-h-[calc(100vh-61px)] flex items-center justify-center bg-background">
        <div className="text-center p-4">
          <h1 className="text-2xl font-bold mb-4">No presentation selected</h1>
          <p className="text-muted-foreground">Select a presentation from the sidebar to manage its slide decks.</p>
        </div>
      </div>
    );
  }

  const slideDecks = getPresentationSlideDecks(presentation.id);

  const handleReorder = (newOrder: SlideDeck[]) => {
    updatePresentation(presentation.id, { slideDeckIds: newOrder.map(deck => deck.id) });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data.type === 'slideDeck' && data.deckId) {
        addSlideDeckToPresentation(presentation.id, data.deckId);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  return (
    <div
      className="min-h-[calc(100vh-61px)] max-w-4xl mx-auto p-4 sm:p-6 md:p-8 space-y-6"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Manage "{presentation.title}"
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Drag and drop to reorder slide decks. Select a deck to edit its content.
        </p>
      </div>

      {slideDecks.length > 0 ? (
        <Reorder.Group as="div" axis="y" values={slideDecks} onReorder={handleReorder} className="space-y-3">
          <AnimatePresence>
            {slideDecks.map((deck, index) => (
              <Reorder.Item
                key={deck.id}
                value={deck}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.2, delay: index * 0.05 } }}
                exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                className="bg-card rounded-lg shadow-sm list-none"
                whileDrag={{ scale: 1.02, boxShadow: "0px 5px 15px rgba(0,0,0,0.1)" }}
              >
                <div className="flex items-center px-4 py-2.5">
                  <GripVertical className="h-5 w-5 text-muted-foreground mr-4 cursor-grab flex-shrink-0" />
                  <div className="flex-1 font-medium truncate" title={deck.title}>{deck.title}</div>
                  <div className="flex items-center ml-4">
                    <Button variant="ghost" size="icon" onClick={() => setCurrentSlideDeck(deck.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:text-destructive dark:hover:bg-destructive/10 hover:bg-destructive/10" onClick={() => removeSlideDeckFromPresentation(presentation.id, deck.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h2 className="text-xl font-semibold">This presentation is empty</h2>
          <p className="text-muted-foreground mt-2">
            Drag slide decks from the library in the sidebar and drop them onto this presentation.
          </p>
        </div>
      )}
    </div>
  );
};

export default PresentationManager;
