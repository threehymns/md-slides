import { usePresentations } from '@/contexts/PresentationsContext';
import PresentationManager from '@/components/PresentationManager';

const Index = () => {
  const { getCurrentPresentation } = usePresentations();
  const currentPresentation = getCurrentPresentation();

  return (
    <div>
      {currentPresentation ? (
        <PresentationManager />
      ) : (
        <div className="min-h-[calc(100vh-61px)] flex items-center justify-center bg-background">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Welcome to Markdown Slideshow</h1>
            <p className="text-muted-foreground">Create a presentation and add slide decks to get started.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Drag and drop slide decks into presentations to organize your content.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
