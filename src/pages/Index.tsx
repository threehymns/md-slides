
import React, { useState, useEffect } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import MarkdownEditor from '@/components/MarkdownEditor';
import Slideshow from '@/components/Slideshow';
import { useSlideDecks } from '@/contexts/SlideDecksContext';

const Index = () => {
  const { getCurrentDeck, updateDeck, currentDeckId } = useSlideDecks();
  const [isPresenting, setIsPresenting] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const currentDeck = getCurrentDeck();
  const markdown = currentDeck?.content || '';

  const handleMarkdownChange = (newContent: string) => {
    if (currentDeck) {
      updateDeck(currentDeck.id, { content: newContent });
    }
  };

  const handleStartPresentation = () => {
    if (markdown.trim()) {
      setIsPresenting(true);
    }
  };

  const handleExitPresentation = () => {
    setIsPresenting(false);
  };

  const handleDarkModeToggle = () => {
    setIsDarkMode(!isDarkMode);
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
    return <Slideshow markdown={markdown} isDarkMode={isDarkMode} onDarkModeToggle={handleDarkModeToggle} />;
  }

  return (
    <>
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <div className="p-2 border-b">
          <SidebarTrigger />
        </div>
        <div className="flex-1">
          {currentDeck ? (
            <MarkdownEditor
              markdown={markdown}
              onMarkdownChange={handleMarkdownChange}
              onStartPresentation={handleStartPresentation}
              isDarkMode={isDarkMode}
              onDarkModeToggle={handleDarkModeToggle}
            />
          ) : (
            <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50'}`}>
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Welcome to Markdown Slideshow</h1>
                <p className="text-gray-600 dark:text-gray-400">Select a presentation from the sidebar or create a new one to get started.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Index;
