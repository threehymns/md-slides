import React from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Settings as SettingsIcon, Play } from 'lucide-react';
import { usePresentations } from '@/contexts/PresentationsContext';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const {
    getCurrentPresentation,
    updatePresentation,
    getPresentationSlideDecks,
  } = usePresentations();
  const navigate = useNavigate();

  const actualCurrentPresentation = getCurrentPresentation();

  const handleStartPresentation = () => {
    if (actualCurrentPresentation) {
      const presentationSlideDecks = getPresentationSlideDecks(actualCurrentPresentation.id);
      const canStart = presentationSlideDecks.some(deck => deck.content && deck.content.trim());
      if (canStart) {
        navigate('/slideshow');
      } else {
        console.warn("Presentation has no content to present.");
        // Optionally, navigate to the presentation manager to add content
        // navigate(`/presentation/${actualCurrentPresentation.id}`);
      }
    } else {
      // No presentation selected, perhaps navigate to create one or show a message
      console.warn("No presentation selected to present.");
    }
  };

  const handlePresentationTitleChange = (newTitle: string) => {
    if (actualCurrentPresentation) {
      updatePresentation(actualCurrentPresentation.id, { title: newTitle });
    }
  };

  const handleShowSettings = () => {
    navigate('/settings', { state: { from: '/' } });
  };

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
                disabled={!(actualCurrentPresentation && getPresentationSlideDecks(actualCurrentPresentation.id).some(deck => deck.content && deck.content.trim()))}
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
            onClick={handleShowSettings}
            className={actualCurrentPresentation ? "" : "ml-auto"}
          >
            <SettingsIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-grow overflow-y-auto bg-card/10 p-4"> {/* Added padding here */}
          {/* Welcome Content */}
          <div className="min-h-full flex items-center justify-center"> {/* Ensure welcome message is centered if page is short */}
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-6">Welcome to Markdown Slideshow</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Create a new presentation or select an existing one from the sidebar to get started.
              </p>
              <p className="text-md text-muted-foreground">
                Use the sidebar to manage your presentations and slide decks.
              </p>
            </div>
          </div>
        </div>
      </SidebarInset>
    </>
  );
};

export default Index;
