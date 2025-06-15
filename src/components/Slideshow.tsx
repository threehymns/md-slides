import React, { useState, useEffect, useMemo } from 'react';
import { marked } from 'marked';
import Settings from './Settings';
import { useTheme } from '@/components/ThemeProvider';
import { AppSettings } from '@/types';

interface SlideshowProps {
  markdown: string;
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
}

const Slideshow: React.FC<SlideshowProps> = ({ markdown, settings, onSettingsChange }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Parse markdown and split into slides - only split on --- that are on their own line
  const slides = useMemo(() => {
    const slideTexts = markdown
      .split(/\n---\n|\r\n---\r\n|\r---\r/)
      .map(slide => slide.trim())
      .filter(slide => slide.length > 0);
    return slideTexts.map(slideText => marked(slideText));
  }, [markdown]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowRight':
        case ' ':
        case 'ArrowDown':
          event.preventDefault();
          if (!showSettings) {
            setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1));
          }
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          if (!showSettings) {
            setCurrentSlide(prev => Math.max(prev - 1, 0));
          }
          break;
        case 'Home':
          event.preventDefault();
          if (!showSettings) {
            setCurrentSlide(0);
          }
          break;
        case 'End':
          event.preventDefault();
          if (!showSettings) {
            setCurrentSlide(slides.length - 1);
          }
          break;
        case 'd':
        case 'D':
          event.preventDefault();
          if (!showSettings) {
            toggleTheme();
          }
          break;
        case 's':
        case 'S':
          event.preventDefault();
          setShowSettings(!showSettings);
          break;
        case 'Escape':
          event.preventDefault();
          if (showSettings) {
            setShowSettings(false)
          } else {
            window.history.back();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [slides.length, showSettings, theme, setTheme]);

  if (slides.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2 text-foreground">No slides found</h2>
          <p className="text-muted-foreground">Add some markdown content separated by "---" to create slides</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="w-full min-h-screen flex flex-col relative overflow-hidden bg-background text-foreground"
      style={{ backgroundColor: settings.style.backgroundColor }}
    >
      {/* Slide Content */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
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
          dangerouslySetInnerHTML={{ __html: slides[currentSlide] }}
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

      {/* Settings Modal */}
      <Settings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={onSettingsChange}
      />
    </div>
  );
};

export default Slideshow;
