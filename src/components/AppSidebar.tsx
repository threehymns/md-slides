import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircle, Trash2, FileText, PresentationIcon, ChevronDown, ChevronRight, GripVertical } from 'lucide-react';
import { usePresentations } from '@/contexts/PresentationsContext';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { cn } from '@/lib/utils'; // For conditional class names

export const AppSidebar = () => {
  const {
    presentations,
    createPresentation,
    deletePresentation,
    getPresentationSlideDecks,
    createSlideDeck,
    deleteSlideDeck,
    setCurrentPresentationId,
    currentPresentation,
    setCurrentSlideDeckId,
    currentSlideDeck,
    // moveSlideDeck, // Assuming drag-and-drop reordering is handled, not focus of this change
  } = usePresentations();
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSelectPresentation = (presentationId: string) => {
    setCurrentPresentationId(presentationId);
    // setCurrentSlideDeckId(null); // Clear current slide deck when changing presentation
    navigate(`/presentation/${presentationId}`); // Navigate to presentation manager page
  };

  const handleSelectSlideDeck = (deckId: string, presentationId: string) => {
    setCurrentPresentationId(presentationId); // Ensure parent presentation is active
    setCurrentSlideDeckId(deckId);
    navigate(`/editor/${deckId}`); // Navigate to editor page
  };

  const handleCreatePresentation = () => {
    const newPresentation = createPresentation({ title: 'New Presentation', slideDecks: [] });
    setCurrentPresentationId(newPresentation.id);
    // setCurrentSlideDeckId(null);
    navigate(`/presentation/${newPresentation.id}`); // Navigate to new presentation
  };

  const handleCreateSlideDeck = (presentationId: string) => {
    const newDeck = createSlideDeck(presentationId, { title: 'New Deck', content: '## New Slide Deck', background: '#FFFFFF' });
    setCurrentPresentationId(presentationId); // Ensure parent presentation is active
    setCurrentSlideDeckId(newDeck.id);
    navigate(`/editor/${newDeck.id}`); // Navigate to new deck in editor
  };

  // Note: deletePresentation and deleteSlideDeck might need to handle navigation
  // if the currently viewed item is deleted. For example, navigate to "/" or to the parent presentation.
  // This subtask focuses on positive navigation, deletion side-effects can be a refinement.

  return (
    <div className="w-64 border-r bg-background flex flex-col h-screen">
      <div className="p-2 border-b">
        <Button onClick={handleCreatePresentation} className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" /> New Presentation
        </Button>
      </div>
      <ScrollArea className="flex-1">
        {presentations.map((presentation) => {
          const slideDecks = getPresentationSlideDecks(presentation.id);
          return (
            <Collapsible key={presentation.id} defaultOpen={presentation.id === currentPresentation?.id}>
              <div className={cn(
                "flex items-center justify-between p-2 hover:bg-muted/50 cursor-pointer",
                presentation.id === currentPresentation?.id && "bg-muted"
              )}>
                <CollapsibleTrigger className="flex items-center flex-1 text-left">
                  {presentation.id === currentPresentation?.id ? <ChevronDown className="h-4 w-4 mr-2" /> : <ChevronRight className="h-4 w-4 mr-2" />}
                  <PresentationIcon className="mr-2 h-4 w-4" />
                  <span
                    className="flex-1 truncate"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent CollapsibleTrigger's own toggle if clicking text
                      handleSelectPresentation(presentation.id);
                    }}
                  >
                    {presentation.title}
                  </span>
                </CollapsibleTrigger>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deletePresentation(presentation.id)}
                  className="ml-2"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <CollapsibleContent className="ml-4 border-l pl-2">
                {slideDecks.map((deck) => (
                  <div
                    key={deck.id}
                    className={cn(
                      "flex items-center justify-between p-2 hover:bg-muted/50 cursor-pointer rounded-md",
                      deck.id === currentSlideDeck?.id && "bg-muted"
                    )}
                    onClick={() => handleSelectSlideDeck(deck.id, presentation.id)}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    <span className="flex-1 truncate">{deck.title || 'Untitled Deck'}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent click on parent div
                        deleteSlideDeck(deck.id, presentation.id);
                      }}
                      className="ml-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCreateSlideDeck(presentation.id)}
                  className="w-[calc(100%-0.5rem)] m-1" // Adjusted width and margin
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Slide Deck
                </Button>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </ScrollArea>
    </div>
  );
};
