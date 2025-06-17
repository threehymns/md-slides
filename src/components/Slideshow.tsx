import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Settings from './Settings';
import { useTheme } from '@/components/ThemeProvider';
import { usePresentations } from '@/contexts/PresentationsContext';
import { AppSettings, SlideInfo } from '@/types';
import { marked } from 'marked';

const Slideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const {
    getCurrentPresentation,
    getPresentationSlideDecks
  } = usePresentations();

  const currentPresentation = getCurrentPresentation();
  const presentationSlideDecks = currentPresentation ?
    getPresentationSlideDecks(currentPresentation.id) : [];

  const slides = useMemo((): SlideInfo[] => {
    if (!currentPresentation) return [];

    return presentationSlideDecks.flatMap(deck => {
      if (!deck.content || !deck.content.trim()) {
        return [];
      }
      return deck.content
        .split(/\n---\n|\r\n---\r\n|\r---\r/)
        .map(slide => slide.trim())
        .filter(slide => slide.length > 0)
        .map(slideContent => {
          return {
            html: marked(slideContent) as string,
            background: deck.background,
            mediaType: deck.mediaType,
          };
        });
    });
  }, [currentPresentation, presentationSlideDecks]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleCloseSettings = useCallback(() => {
    setIsSettingsOpen(false);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowRight':
        case ' ':
        case 'ArrowDown':
          event.preventDefault();
          if (!isSettingsOpen) {
            setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1));
          }
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          if (!isSettingsOpen) {
            setCurrentSlide(prev => Math.max(prev - 1, 0));
          }
          break;
        case 'Home':
          event.preventDefault();
          if (!isSettingsOpen) {
            setCurrentSlide(0);
          }
          break;
        case 'End':
          event.preventDefault();
          if (!isSettingsOpen) {
            setCurrentSlide(slides.length - 1);
          }
          break;
        case 'd':
        case 'D':
          event.preventDefault();
          if (!isSettingsOpen) {
            toggleTheme();
          }
          break;
        case 's':
        case 'S':
          event.preventDefault();
          setIsSettingsOpen(prev => !prev);
          break;
        case 'Escape':
          if (isSettingsOpen) {
            event.preventDefault();
            event.stopImmediatePropagation();
            setIsSettingsOpen(false);
            return;
          } else {
            navigate(-1);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [slides.length, isSettingsOpen, theme, setTheme, navigate]);

  const currentBackground = slides[currentSlide]?.background;

  if (slides.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Slides to Present</h1>
          <p className="text-muted-foreground">
            Please add content to your slide decks.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="w-full min-h-screen flex flex-col relative overflow-hidden bg-background text-foreground"
        style={{
          ...(!slides[currentSlide]?.background && { backgroundColor: settings.style.backgroundColor }),
          ...(slides[currentSlide]?.background && slides[currentSlide].mediaType === 'image' && { backgroundImage: `url(${slides[currentSlide].background})` }),
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {slides[currentSlide]?.background && slides[currentSlide].mediaType === 'video' && (
          <div className="absolute inset-0 z-0">
             <video autoPlay loop muted playsInline className="w-full h-full object-cover">
               <source src={currentBackground} />
             </video>
             <div className="absolute inset-0 bg-black/20" />
           </div>
        )}
        {/* Slide Content */}
        <div className="flex-1 flex items-center justify-center overflow-hidden relative z-10 p-8">
          <div
            className="prose dark:prose-invert max-w-none w-full h-full flex flex-col justify-center overflow-hidden"
            style={{
              fontFamily: settings.style.fontFamily,
              fontSize: `${settings.style.fontSize}vw`,
              lineHeight: settings.style.lineHeight,
              textAlign: settings.style.textAlign,
              ...((settings.style.textColor) && {
                '--tw-prose-body': settings.style.textColor,
                '--tw-prose-headings': settings.style.textColor,
                '--tw-prose-lead': settings.style.textColor,
                '--tw-prose-links': settings.style.textColor,
                '--tw-prose-bold': settings.style.textColor,
                '--tw-prose-counters': settings.style.textColor,
                '--tw-prose-bullets': settings.style.textColor,
                '--tw-prose-hr': `color-mix(in srgb, ${settings.style.textColor} 50%, transparent)`,
                '--tw-prose-quotes': settings.style.textColor,
                '--tw-prose-quote-borders': `color-mix(in srgb, ${settings.style.textColor} 20%, transparent)`,
                '--tw-prose-captions': `color-mix(in srgb, ${settings.style.textColor} 70%, transparent)`,
                '--tw-prose-code': settings.style.textColor,
                '--tw-prose-pre-code': settings.style.textColor,
                '--tw-prose-pre-bg': `color-mix(in srgb, ${settings.style.textColor} 10%, transparent)`,
                '--tw-prose-th-borders': `color-mix(in srgb, ${settings.style.textColor} 30%, transparent)`,
                '--tw-prose-td-borders': `color-mix(in srgb, ${settings.style.textColor} 20%, transparent)`,
                '--tw-prose-invert-body': settings.style.textColor,
                '--tw-prose-invert-headings': settings.style.textColor,
                '--tw-prose-invert-lead': settings.style.textColor,
                '--tw-prose-invert-links': settings.style.textColor,
                '--tw-prose-invert-bold': settings.style.textColor,
                '--tw-prose-invert-counters': settings.style.textColor,
                '--tw-prose-invert-bullets': settings.style.textColor,
                '--tw-prose-invert-hr': `color-mix(in srgb, ${settings.style.textColor} 50%, transparent)`,
                '--tw-prose-invert-quotes': settings.style.textColor,
                '--tw-prose-invert-quote-borders': `color-mix(in srgb, ${settings.style.textColor} 20%, transparent)`,
                '--tw-prose-invert-captions': `color-mix(in srgb, ${settings.style.textColor} 70%, transparent)`,
                '--tw-prose-invert-code': settings.style.textColor,
                '--tw-prose-invert-pre-code': settings.style.textColor,
                '--tw-prose-invert-pre-bg': `color-mix(in srgb, ${settings.style.textColor} 10%, transparent)`,
                '--tw-prose-invert-th-borders': `color-mix(in srgb, ${settings.style.textColor} 30%, transparent)`,
                '--tw-prose-invert-td-borders': `color-mix(in srgb, ${settings.style.textColor} 20%, transparent)`,
              }),
            } as React.CSSProperties}
            dangerouslySetInnerHTML={{ __html: slides[currentSlide].html }}
          />
        </div>

        {/* Slide Counter */}
        {settings.showSlideCounter && (
          <div className={`absolute bottom-4 right-4 text-sm font-mono transition-opacity duration-300 ${
            settings.autoHideControls ? 'opacity-30 hover:opacity-100' : ''
          } text-muted-foreground`}>
            {currentSlide + 1} / {slides.length}
          </div>
        )}

        {/* Progress Bar */}
        {settings.showProgressBar && (
          <div className={`absolute bottom-0 left-0 w-full h-1 transition-opacity duration-300 ${
            settings.autoHideControls ? 'opacity-30 hover:opacity-100' : ''
          } bg-muted`}>
            <div
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
            />
          </div>
        )}

        {/* Navigation Hint */}
        {settings.showNavigationHint && currentSlide === 0 && slides.length > 1 && (
          <div className={`absolute bottom-4 left-4 text-xs transition-opacity duration-300 ${
            settings.autoHideControls ? 'opacity-30 hover:opacity-100' : ''
          } text-muted-foreground`}>
            Use arrow keys, spacebar to navigate • Press 'd' for dark mode • Press 's' for settings
          </div>
        )}
      </div>
      <Settings
        isOpen={isSettingsOpen}
        onClose={handleCloseSettings}
        settings={settings}
        onSettingsChange={setSettings}
      />
    </>
  );
};

export default Slideshow;
