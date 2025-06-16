import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Settings as SettingsIcon, Play } from 'lucide-react';
import { usePresentations } from '@/contexts/PresentationsContext';

const MainLayout = () => {
  const {
    getCurrentPresentation, // Function to get the actual presentation object
    updatePresentation,
    getPresentationSlideDecks, // Needed for canStartPresentation
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
      }
    }
  };

  const handlePresentationTitleChange = (newTitle: string) => {
    if (actualCurrentPresentation) {
      updatePresentation(actualCurrentPresentation.id, { title: newTitle });
    }
  };

  const handleShowSettings = () => {
    navigate('/settings');
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
        <div className="flex-grow overflow-y-auto bg-card/10">
          <Outlet />
        </div>
      </SidebarInset>
    </>
  );
};

export default MainLayout;
