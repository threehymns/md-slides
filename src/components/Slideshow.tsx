
import React, { useState, useEffect, useMemo } from 'react';
import { marked } from 'marked';

interface SlideshowProps {
  markdown: string;
  isDarkMode: boolean;
  onDarkModeToggle: () => void;
}

const Slideshow: React.FC<SlideshowProps> = ({ markdown, isDarkMode, onDarkModeToggle }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Parse markdown and split into slides
  const slides = useMemo(() => {
    const slideTexts = markdown.split('---').map(slide => slide.trim()).filter(slide => slide.length > 0);
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
          setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1));
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          setCurrentSlide(prev => Math.max(prev - 1, 0));
          break;
        case 'Home':
          event.preventDefault();
          setCurrentSlide(0);
          break;
        case 'End':
          event.preventDefault();
          setCurrentSlide(slides.length - 1);
          break;
        case 'd':
        case 'D':
          event.preventDefault();
          onDarkModeToggle();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [slides.length, onDarkModeToggle]);

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
          style={{ fontSize: '12vh', lineHeight: '1.2' }}
          dangerouslySetInnerHTML={{ __html: slides[currentSlide] }}
        />
      </div>

      {/* Slide Counter */}
      <div className={`absolute bottom-4 right-4 text-sm font-mono ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>
        {currentSlide + 1} / {slides.length}
      </div>

      {/* Progress Bar */}
      <div className={`absolute bottom-0 left-0 w-full h-1 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div 
          className="h-full bg-blue-500 transition-all duration-300 ease-out"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>

      {/* Navigation Hint */}
      {currentSlide === 0 && slides.length > 1 && (
        <div className={`absolute bottom-4 left-4 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>
          Use arrow keys, spacebar to navigate • Press 'd' for dark mode
        </div>
      )}
    </div>
  );
};

export default Slideshow;
