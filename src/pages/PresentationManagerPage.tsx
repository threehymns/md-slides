import React, { useEffect } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Settings as SettingsIcon, Play } from 'lucide-react';
import PresentationManager from '@/components/PresentationManager';
import { usePresentations } from '@/contexts/PresentationsContext';
import { useParams, useNavigate, useLocation } from 'react-router-dom'; // Added useLocation

const PresentationManagerPage = () => {
  const { presentationId } = useParams<{ presentationId: string }>();
  const navigate = useNavigate();
  const location = useLocation(); // Added for settings navigation
  const {
    setCurrentPresentationId,
    getCurrentPresentation,
    updatePresentation,
    getPresentationSlideDecks
  } = usePresentations();

  useEffect(() => {
    if (presentationId) {
      setCurrentPresentationId(presentationId);
    }
  }, [presentationId, setCurrentPresentationId]);

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
    navigate('/settings', { state: { from: `/presentation/${presentationId}` } });
  };

  if (!presentationId || !actualCurrentPresentation) { // Check both presentationId from URL and if context has it
    return (
      <>
        <AppSidebar />
        <SidebarInset className="overflow-hidden flex flex-col h-screen">
           <div className="px-2 py-1 border-b flex items-center gap-2 flex-shrink-0">
                <SidebarTrigger />
                <Button variant="outline" size="icon" onClick={() => navigate('/settings', { state: { from: location.pathname }})} className="ml-auto"><SettingsIcon className="h-4 w-4" /></Button>
            </div>
            <div className="flex-grow overflow-y-auto bg-card/10 p-4 flex items-center justify-center">
              <h1 className="text-xl">Presentation not found or ID missing.</h1>
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
          { actualCurrentPresentation ? <PresentationManager key={actualCurrentPresentation.id} /> : <div>Loading Presentation...</div> }
        </div>
      </SidebarInset>
    </>
  );
};

export default PresentationManagerPage;
