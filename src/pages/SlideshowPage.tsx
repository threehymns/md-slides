import React, { useState, useEffect } from 'react';
import Slideshow from '@/components/Slideshow';
import { SlideInfo, AppSettings } from '@/types';
import { usePresentations } from '@/contexts/PresentationsContext'; // To get actual slides
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { marked } from 'marked'; // To parse markdown from decks
import { Button } from '@/components/ui/button'; // Import Button for fallback UI

const SlideshowPage = () => {
  const navigate = useNavigate();
  const {
    currentPresentation,
    getPresentationSlideDecks,
    // We need a way to get settings, assuming global or default for now
  } = usePresentations();

  // Placeholder for global/default settings until full integration
  const [settings, setSettings] = useState<AppSettings>({
    showProgressBar: false,
    showSlideCounter: true,
    showNavigationHint: true,
    autoHideControls: false,
    style: {
      fontFamily: 'system-ui, sans-serif',
      fontSize: 5,
      lineHeight: 1.6,
      textAlign: 'center',
    },
  });

  const slides = React.useMemo((): SlideInfo[] => {
    if (!currentPresentation) return [{ html: '<h1>No Presentation Selected</h1>', background: '#fff' }];
    const presentationSlideDecks = getPresentationSlideDecks(currentPresentation.id);
    if (!presentationSlideDecks || presentationSlideDecks.length === 0) {
        return [{ html: '<h1>Presentation has no slide decks or content.</h1>', background: '#fff' }];
    }

    return presentationSlideDecks.flatMap(deck => {
      if (!deck.content || !deck.content.trim()) {
        return [];
      }
      return deck.content
        .split(/\n---\n|\r\n---\r\n|\r---\r/) // Corrected regex for universal line endings
        .map(slide => slide.trim())
        .filter(slide => slide.length > 0)
        .map(slideContent => ({
          html: marked(slideContent) as string,
          background: deck.background,
        }));
    }).filter(slide => slide.html.trim().length > 0);
  }, [currentPresentation, getPresentationSlideDecks]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // Navigate back to the presentation manager for the current presentation,
        // or to home if no current presentation (though slideshow shouldn't start then)
        if (currentPresentation) {
          navigate(`/presentation/${currentPresentation.id}`);
        } else {
          navigate('/');
        }
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate, currentPresentation]);

  // The Slideshow component itself might have a settings button.
  // We need to pass a handler for that.
  const handleOpenSettings = () => {
    // Store current path to return to, or pass presentationId if needed
    navigate('/settings', { state: { from: `/slideshow` } });
  };

  // The onSettingsChange in Slideshow component will update local/context settings
  // For now, it updates local state.
  const handleSettingsChange = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    // Persist settings logic would go here
  };

  if (slides.length === 0) {
    // This case should ideally be prevented by disabling "Present" button if no slides
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground">
            <h1 className="text-2xl mb-4">No slides to present.</h1>
            <Button onClick={() => currentPresentation ? navigate(`/presentation/${currentPresentation.id}`) : navigate('/')}>
                Go Back
            </Button>
        </div>
    );
  }

  return (
    <Slideshow
      slides={slides}
      settings={settings}
      onSettingsChange={handleSettingsChange}
      onOpenSettings={handleOpenSettings} // Pass the handler
      // onExit is implicitly handled by Escape key for now
    />
  );
};

export default SlideshowPage;
