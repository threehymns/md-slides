
import React, { useState, useEffect, useMemo } from 'react';
import { marked } from 'marked';
import Settings from './Settings';

interface SlideshowProps {
  markdown: string;
  isDarkMode: boolean;
  onDarkModeToggle: () => void;
}

const Slideshow: React.FC<SlideshowProps> = ({ markdown, isDarkMode, onDarkModeToggle }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    showProgressBar: false,
    showSlideCounter: true,
    showNavigationHint: true,
    autoHideControls: false
  });

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
            onDarkModeToggle();
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
            setShowSettings(false);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [slides.length, onDarkModeToggle, showSettings]);

  if (slides.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <h2 className={`text-2xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-500'}`}>No slides found</h2>
          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-500'}>Add some markdown content separated by "---" to create slides</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col relative ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      {/* Slide Content */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16 overflow-hidden">
        <div 
          className="prose max-w-none w-full h-full flex flex-col justify-center text-center overflow-hidden"
          style={{ fontSize: '10vh', lineHeight: '1.2' }}
          dangerouslySetInnerHTML={{ __html: slides[currentSlide] }}
        />
      </div>

      {/* Slide Counter */}
      {settings.showSlideCounter && (
        <div className={`absolute bottom-4 right-4 text-sm font-mono transition-opacity duration-300 ${
          settings.autoHideControls ? 'opacity-30 hover:opacity-100' : ''
        } ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>
          {currentSlide + 1} / {slides.length}
        </div>
      )}

      {/* Progress Bar */}
      {settings.showProgressBar && (
        <div className={`absolute bottom-0 left-0 w-full h-1 transition-opacity duration-300 ${
          settings.autoHideControls ? 'opacity-30 hover:opacity-100' : ''
        } ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <div 
            className="h-full bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
          />
        </div>
      )}

      {/* Navigation Hint */}
      {settings.showNavigationHint && currentSlide === 0 && slides.length > 1 && (
        <div className={`absolute bottom-4 left-4 text-xs transition-opacity duration-300 ${
          settings.autoHideControls ? 'opacity-30 hover:opacity-100' : ''
        } ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>
          Use arrow keys, spacebar to navigate • Press 'd' for dark mode • Press 's' for settings
        </div>
      )}

      {/* Settings Modal */}
      <Settings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={setSettings}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default Slideshow;
