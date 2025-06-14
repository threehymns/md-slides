
import React, { useState, useEffect } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Settings as SettingsIcon } from 'lucide-react';
import { AppSidebar } from '@/components/AppSidebar';
import MarkdownEditor from '@/components/MarkdownEditor';
import Slideshow from '@/components/Slideshow';
import Settings from '@/components/Settings';
import { usePresentations } from '@/contexts/PresentationsContext';

const Index = () => {
  const { getCurrentSlideDeck, updateSlideDeck, currentSlideDeckId, getCurrentPresentation, getPresentationSlideDecks } = usePresentations();
  const [isPresenting, setIsPresenting] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    showProgressBar: false,
    showSlideCounter: true,
    showNavigationHint: true,
    autoHideControls: false
  });

  const currentDeck = getCurrentSlideDeck();
  const currentPresentation = getCurrentPresentation();
  const markdown = currentDeck?.content || '';

  // Get combined markdown from all slide decks in the current presentation
  const getPresentationMarkdown = () => {
    if (!currentPresentation) return '';
    
    const slideDecks = getPresentationSlideDecks(currentPresentation.id);
    return slideDecks
      .map(deck => deck.content)
      .filter(content => content.trim())
      .join('\n\n---\n\n');
  };

  const handleMarkdownChange = (newContent: string) => {
    if (currentDeck) {
      updateSlideDeck(currentDeck.id, { content: newContent });
    }
  };

  const handleStartPresentation = () => {
    const presentationMarkdown = getPresentationMarkdown();
    if (presentationMarkdown.trim()) {
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
    return <Slideshow markdown={getPresentationMarkdown()} />;
  }

  return (
    <>
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <div className="p-2 border-b flex items-center gap-2">
          <SidebarTrigger />
          <Button 
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(true)}
          >
            <SettingsIcon className="h-4 w-4" />
          </Button>
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
                <p className="text-muted-foreground">Create a presentation and add slide decks to get started.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Drag and drop slide decks into presentations to organize your content.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Settings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />
    </>
  );
};

export default Index;
