
import React, { useState } from 'react';
import MarkdownEditor from '@/components/MarkdownEditor';
import Slideshow from '@/components/Slideshow';

const Index = () => {
  const [markdown, setMarkdown] = useState('');
  const [isPresenting, setIsPresenting] = useState(false);

  const handleStartPresentation = () => {
    if (markdown.trim()) {
      setIsPresenting(true);
    }
  };

  const handleExitPresentation = () => {
    setIsPresenting(false);
  };

  // Handle escape key to exit presentation
  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isPresenting) {
        handleExitPresentation();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPresenting]);

  if (isPresenting) {
    return <Slideshow markdown={markdown} />;
  }

  return (
    <MarkdownEditor
      markdown={markdown}
      onMarkdownChange={setMarkdown}
      onStartPresentation={handleStartPresentation}
    />
  );
};

export default Index;
