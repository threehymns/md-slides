
import React, { useState, useEffect } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import MarkdownEditor from '@/components/MarkdownEditor';
import Slideshow from '@/components/Slideshow';
import { usePresentations } from '@/contexts/PresentationsContext';

const Index = () => {
  const { getCurrentSlideDeck, updateSlideDeck, currentSlideDeckId, getCurrentPresentation } = usePresentations();
  const [isPresenting, setIsPresenting] = useState(false);

  const currentDeck = getCurrentSlideDeck();
  const currentPresentation = getCurrentPresentation();
  const markdown = currentDeck?.content || '';

  const handleMarkdownChange = (newContent: string) => {
    if (currentDeck && currentPresentation) {
      updateSlideDeck(currentPresentation.id, currentDeck.id, { content: newContent });
    }
  };

  const handleStartPresentation = () => {
    if (markdown.trim()) {
      setIsPresenting(true);
    }
  };

  const handleExitPresentation = () => {
    setIsPresenting(false);
  };

  // Handle escape key to exit presentation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isPresenting) {
        handleExitPresentation();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPresenting]);

  if (isPresenting) {
    return <Slideshow markdown={markdown} />;
  }

  return (
    <>
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <div className="p-2 border-b">
          <SidebarTrigger />
        </div>
        <div className="flex-1">
          {currentDeck ? (
            <MarkdownEditor
              markdown={markdown}
              onMarkdownChange={handleMarkdownChange}
              onStartPresentation={handleStartPresentation}
            />
          ) : (
            <div className="min-h-screen flex items-center justify-center bg-background">
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Welcome to Markdown Slideshow</h1>
                <p className="text-muted-foreground">Select a slide deck from the sidebar or create a new presentation to get started.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Index;
