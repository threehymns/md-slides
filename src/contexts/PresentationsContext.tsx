
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SlideDeck {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Presentation {
  id: string;
  title: string;
  slideDeckIds: string[]; // References to slide deck IDs instead of embedded decks
  createdAt: Date;
  updatedAt: Date;
}

interface PresentationsContextType {
  presentations: Presentation[];
  slideDecks: SlideDeck[];
  currentPresentationId: string | null;
  currentSlideDeckId: string | null;
  
  // Presentation methods
  createPresentation: (title: string) => Presentation;
  updatePresentation: (id: string, updates: Partial<Omit<Presentation, 'id' | 'createdAt'>>) => void;
  deletePresentation: (id: string) => void;
  setCurrentPresentation: (id: string | null) => void;
  getCurrentPresentation: () => Presentation | null;
  reorderPresentations: (fromIndex: number, toIndex: number) => void;
  
  // Slide deck methods
  createSlideDeck: (title: string, content?: string) => SlideDeck;
  updateSlideDeck: (deckId: string, updates: Partial<Omit<SlideDeck, 'id' | 'createdAt'>>) => void;
  deleteSlideDeck: (deckId: string) => void;
  setCurrentSlideDeck: (deckId: string | null) => void;
  getCurrentSlideDeck: () => SlideDeck | null;
  
  // Presentation-SlideDeck relationship methods
  addSlideDeckToPresentation: (presentationId: string, slideDeckId: string) => void;
  removeSlideDeckFromPresentation: (presentationId: string, slideDeckId: string) => void;
  reorderSlideDecksInPresentation: (presentationId: string, fromIndex: number, toIndex: number) => void;
  getPresentationSlideDecks: (presentationId: string) => SlideDeck[];
}

const PresentationsContext = createContext<PresentationsContextType | undefined>(undefined);

export const usePresentations = () => {
  const context = useContext(PresentationsContext);
  if (!context) {
    throw new Error('usePresentations must be used within a PresentationsProvider');
  }
  return context;
};

export const PresentationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [slideDecks, setSlideDecks] = useState<SlideDeck[]>([]);
  const [currentPresentationId, setCurrentPresentationId] = useState<string | null>(null);
  const [currentSlideDeckId, setCurrentSlideDeckId] = useState<string | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedPresentations = localStorage.getItem('presentations');
    const savedSlideDecks = localStorage.getItem('slideDecks');
    const savedCurrentPresentationId = localStorage.getItem('currentPresentationId');
    const savedCurrentSlideDeckId = localStorage.getItem('currentSlideDeckId');
    
    if (savedPresentations) {
      const parsedPresentations = JSON.parse(savedPresentations).map((presentation: any) => ({
        ...presentation,
        createdAt: new Date(presentation.createdAt),
        updatedAt: new Date(presentation.updatedAt)
      }));
      setPresentations(parsedPresentations);
    }
    
    if (savedSlideDecks) {
      const parsedSlideDecks = JSON.parse(savedSlideDecks).map((deck: any) => ({
        ...deck,
        createdAt: new Date(deck.createdAt),
        updatedAt: new Date(deck.updatedAt)
      }));
      setSlideDecks(parsedSlideDecks);
    }
    
    if (savedCurrentPresentationId) {
      setCurrentPresentationId(savedCurrentPresentationId);
    }
    
    if (savedCurrentSlideDeckId) {
      setCurrentSlideDeckId(savedCurrentSlideDeckId);
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('presentations', JSON.stringify(presentations));
  }, [presentations]);

  useEffect(() => {
    localStorage.setItem('slideDecks', JSON.stringify(slideDecks));
  }, [slideDecks]);

  useEffect(() => {
    if (currentPresentationId) {
      localStorage.setItem('currentPresentationId', currentPresentationId);
    } else {
      localStorage.removeItem('currentPresentationId');
    }
  }, [currentPresentationId]);

  useEffect(() => {
    if (currentSlideDeckId) {
      localStorage.setItem('currentSlideDeckId', currentSlideDeckId);
    } else {
      localStorage.removeItem('currentSlideDeckId');
    }
  }, [currentSlideDeckId]);

  // Presentation methods
  const createPresentation = (title: string) => {
    const newPresentation: Presentation = {
      id: Date.now().toString(),
      title,
      slideDeckIds: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setPresentations(prev => [...prev, newPresentation]);
    setCurrentPresentationId(newPresentation.id);
    return newPresentation;
  };

  const updatePresentation = (id: string, updates: Partial<Omit<Presentation, 'id' | 'createdAt'>>) => {
    setPresentations(prev => prev.map(presentation => 
      presentation.id === id 
        ? { ...presentation, ...updates, updatedAt: new Date() }
        : presentation
    ));
  };

  const deletePresentation = (id: string) => {
    setPresentations(prev => prev.filter(presentation => presentation.id !== id));
    if (currentPresentationId === id) {
      setCurrentPresentationId(null);
      setCurrentSlideDeckId(null);
    }
  };

  const setCurrentPresentation = (id: string | null) => {
    setCurrentPresentationId(id);
    setCurrentSlideDeckId(null);
  };

  const getCurrentPresentation = () => {
    return presentations.find(presentation => presentation.id === currentPresentationId) || null;
  };

  const reorderPresentations = (fromIndex: number, toIndex: number) => {
    setPresentations(prev => {
      const result = [...prev];
      const [removed] = result.splice(fromIndex, 1);
      result.splice(toIndex, 0, removed);
      return result;
    });
  };

  // Slide deck methods
  const createSlideDeck = (title: string, content: string = '') => {
    const newDeck: SlideDeck = {
      id: Date.now().toString(),
      title,
      content,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setSlideDecks(prev => [...prev, newDeck]);
    setCurrentSlideDeckId(newDeck.id);
    return newDeck;
  };

  const updateSlideDeck = (deckId: string, updates: Partial<Omit<SlideDeck, 'id' | 'createdAt'>>) => {
    setSlideDecks(prev => prev.map(deck =>
      deck.id === deckId
        ? { ...deck, ...updates, updatedAt: new Date() }
        : deck
    ));
  };

  const deleteSlideDeck = (deckId: string) => {
    // Remove from all presentations first
    setPresentations(prev => prev.map(presentation => ({
      ...presentation,
      slideDeckIds: presentation.slideDeckIds.filter(id => id !== deckId),
      updatedAt: new Date()
    })));
    
    // Then remove the slide deck
    setSlideDecks(prev => prev.filter(deck => deck.id !== deckId));
    
    if (currentSlideDeckId === deckId) {
      setCurrentSlideDeckId(null);
    }
  };

  const setCurrentSlideDeck = (deckId: string | null) => {
    setCurrentSlideDeckId(deckId);
  };

  const getCurrentSlideDeck = () => {
    if (!currentSlideDeckId) return null;
    return slideDecks.find(deck => deck.id === currentSlideDeckId) || null;
  };

  // Presentation-SlideDeck relationship methods
  const addSlideDeckToPresentation = (presentationId: string, slideDeckId: string) => {
    setPresentations(prev => prev.map(presentation =>
      presentation.id === presentationId
        ? {
            ...presentation,
            slideDeckIds: [...presentation.slideDeckIds, slideDeckId],
            updatedAt: new Date()
          }
        : presentation
    ));
  };

  const removeSlideDeckFromPresentation = (presentationId: string, slideDeckId: string) => {
    setPresentations(prev => prev.map(presentation =>
      presentation.id === presentationId
        ? {
            ...presentation,
            slideDeckIds: presentation.slideDeckIds.filter(id => id !== slideDeckId),
            updatedAt: new Date()
          }
        : presentation
    ));
  };

  const reorderSlideDecksInPresentation = (presentationId: string, fromIndex: number, toIndex: number) => {
    setPresentations(prev => prev.map(presentation =>
      presentation.id === presentationId
        ? {
            ...presentation,
            slideDeckIds: (() => {
              const result = [...presentation.slideDeckIds];
              const [removed] = result.splice(fromIndex, 1);
              result.splice(toIndex, 0, removed);
              return result;
            })(),
            updatedAt: new Date()
          }
        : presentation
    ));
  };

  const getPresentationSlideDecks = (presentationId: string) => {
    const presentation = presentations.find(p => p.id === presentationId);
    if (!presentation) return [];
    
    return presentation.slideDeckIds
      .map(id => slideDecks.find(deck => deck.id === id))
      .filter(Boolean) as SlideDeck[];
  };

  return (
    <PresentationsContext.Provider value={{
      presentations,
      slideDecks,
      currentPresentationId,
      currentSlideDeckId,
      createPresentation,
      updatePresentation,
      deletePresentation,
      setCurrentPresentation,
      getCurrentPresentation,
      reorderPresentations,
      createSlideDeck,
      updateSlideDeck,
      deleteSlideDeck,
      setCurrentSlideDeck,
      getCurrentSlideDeck,
      addSlideDeckToPresentation,
      removeSlideDeckFromPresentation,
      reorderSlideDecksInPresentation,
      getPresentationSlideDecks
    }}>
      {children}
    </PresentationsContext.Provider>
  );
};
