import React, { useState, useEffect } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Settings as SettingsIcon, Play } from 'lucide-react';
import MarkdownEditor from '@/components/MarkdownEditor';
import { usePresentations } from '@/contexts/PresentationsContext';
import { useParams, useNavigate, useLocation } // Added useLocation
  from 'react-router-dom';

const EditorPage = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const location = useLocation(); // Initialize useLocation
  const {
    getSlideDeck,
    updateSlideDeck,
    getCurrentPresentation,
    updatePresentation,
    getPresentationSlideDecks,
    setCurrentSlideDeckId,
  } = usePresentations();

  const actualCurrentPresentation = getCurrentPresentation();

  useEffect(() => {
    if (deckId) {
      setCurrentSlideDeckId(deckId);
    }
  }, [deckId, setCurrentSlideDeckId]);

  const currentDeck = deckId ? getSlideDeck(deckId) : null;

  const handleMarkdownChange = (newContent: string) => {
    if (deckId) {
      updateSlideDeck(deckId, { content: newContent });
    }
  };

  const handleStartPresentation = () => {
    if (actualCurrentPresentation) {
      const presentationSlideDecks = getPresentationSlideDecks(actualCurrentPresentation.id);
      const canStart = presentationSlideDecks.some(deck => deck.content && deck.content.trim());
      if (canStart) {
        navigate('/slideshow');
      } else {
        console.warn("Presentation has no content to present.");
      }
    } else {
      console.warn("No active presentation to present.");
    }
  };

  const handlePresentationTitleChange = (newTitle: string) => {
    if (actualCurrentPresentation) {
      updatePresentation(actualCurrentPresentation.id, { title: newTitle });
    }
  };

  const handleShowSettings = () => {
    navigate('/settings', { state: { from: location.pathname } }); // Use location.pathname
  };

  if (!deckId || !currentDeck) {
    return (
      <>
        <AppSidebar />
        <SidebarInset className="overflow-hidden flex flex-col h-screen">
            <div className="px-2 py-1 border-b flex items-center gap-2 flex-shrink-0">
                <SidebarTrigger />
                 <Button
                   variant="outline"
                   size="icon"
                   onClick={() => navigate('/settings', { state: { from: location.pathname }})} // Use location.pathname
                   className="ml-auto"
                 >
                   <SettingsIcon className="h-4 w-4" />
                 </Button>
            </div>
            <div className="flex-grow overflow-y-auto bg-card/10 p-4 flex items-center justify-center">
                <h1 className="text-xl">Deck not found or ID missing.</h1>
            </div>
        </SidebarInset>
      </>
    );
  }

  return (
    <>
      <AppSidebar />
      <SidebarInset className="overflow-hidden flex flex-col h-screen">
        <div className="px-2 py-1 border-b flex items-center gap-2 flex-shrink-0">
          <SidebarTrigger />
          {actualCurrentPresentation && (
            <div className="flex items-center gap-2 flex-1">
              <input
                value={actualCurrentPresentation.title}
                onChange={(e) => handlePresentationTitleChange(e.target.value)}
                className="px-2 rounded w-full text-lg font-semibold bg-transparent focus:outline-none focus-visible:ring-1 focus-visible:ring-ring/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                placeholder="Presentation title..."
              />
              <Button
                onClick={handleStartPresentation}
                disabled={!(actualCurrentPresentation && getPresentationSlideDecks(actualCurrentPresentation.id).some(sDeck => sDeck.content && sDeck.content.trim()))}
                size="sm"
                className="ml-auto"
              >
                <Play className="mr-2 h-4 w-4" />
                Present
              </Button>
            </div>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={handleShowSettings} // This now correctly uses location.pathname
            className={actualCurrentPresentation ? "" : "ml-auto"}
          >
            <SettingsIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-grow overflow-y-auto bg-card/10 h-full">
          <MarkdownEditor
            key={deckId}
            markdown={currentDeck.content}
            onMarkdownChange={handleMarkdownChange}
          />
        </div>
      </SidebarInset>
    </>
  );
};

export default EditorPage;
