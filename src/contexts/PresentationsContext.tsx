
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
  slideDecks: SlideDeck[];
  createdAt: Date;
  updatedAt: Date;
}

interface PresentationsContextType {
  presentations: Presentation[];
  currentPresentationId: string | null;
  currentSlideDeckId: string | null;
  createPresentation: (title: string) => Presentation;
  updatePresentation: (id: string, updates: Partial<Omit<Presentation, 'id' | 'createdAt'>>) => void;
  deletePresentation: (id: string) => void;
  setCurrentPresentation: (id: string | null) => void;
  getCurrentPresentation: () => Presentation | null;
  reorderPresentations: (fromIndex: number, toIndex: number) => void;
  createSlideDeck: (presentationId: string, title: string, content?: string) => SlideDeck;
  updateSlideDeck: (presentationId: string, deckId: string, updates: Partial<Omit<SlideDeck, 'id' | 'createdAt'>>) => void;
  deleteSlideDeck: (presentationId: string, deckId: string) => void;
  setCurrentSlideDeck: (deckId: string | null) => void;
  getCurrentSlideDeck: () => SlideDeck | null;
  reorderSlideDecks: (presentationId: string, fromIndex: number, toIndex: number) => void;
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
  const [currentPresentationId, setCurrentPresentationId] = useState<string | null>(null);
  const [currentSlideDeckId, setCurrentSlideDeckId] = useState<string | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedPresentations = localStorage.getItem('presentations');
    const savedCurrentPresentationId = localStorage.getItem('currentPresentationId');
    const savedCurrentSlideDeckId = localStorage.getItem('currentSlideDeckId');
    
    if (savedPresentations) {
      const parsedPresentations = JSON.parse(savedPresentations).map((presentation: any) => ({
        ...presentation,
        createdAt: new Date(presentation.createdAt),
        updatedAt: new Date(presentation.updatedAt),
        slideDecks: presentation.slideDecks.map((deck: any) => ({
          ...deck,
          createdAt: new Date(deck.createdAt),
          updatedAt: new Date(deck.updatedAt)
        }))
      }));
      setPresentations(parsedPresentations);
    }
    
    if (savedCurrentPresentationId) {
      setCurrentPresentationId(savedCurrentPresentationId);
    }
    
    if (savedCurrentSlideDeckId) {
      setCurrentSlideDeckId(savedCurrentSlideDeckId);
    }
  }, []);

  // Save presentations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('presentations', JSON.stringify(presentations));
  }, [presentations]);

  // Save current IDs to localStorage
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

  const createPresentation = (title: string) => {
    const newPresentation: Presentation = {
      id: Date.now().toString(),
      title,
      slideDecks: [],
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
    setCurrentSlideDeckId(null); // Reset slide deck when changing presentation
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

  const createSlideDeck = (presentationId: string, title: string, content: string = '') => {
    const newDeck: SlideDeck = {
      id: Date.now().toString(),
      title,
      content,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setPresentations(prev => prev.map(presentation => 
      presentation.id === presentationId
        ? { 
            ...presentation, 
            slideDecks: [...presentation.slideDecks, newDeck],
            updatedAt: new Date()
          }
        : presentation
    ));
    
    setCurrentSlideDeckId(newDeck.id);
    return newDeck;
  };

  const updateSlideDeck = (presentationId: string, deckId: string, updates: Partial<Omit<SlideDeck, 'id' | 'createdAt'>>) => {
    setPresentations(prev => prev.map(presentation => 
      presentation.id === presentationId
        ? {
            ...presentation,
            slideDecks: presentation.slideDecks.map(deck =>
              deck.id === deckId
                ? { ...deck, ...updates, updatedAt: new Date() }
                : deck
            ),
            updatedAt: new Date()
          }
        : presentation
    ));
  };

  const deleteSlideDeck = (presentationId: string, deckId: string) => {
    setPresentations(prev => prev.map(presentation => 
      presentation.id === presentationId
        ? {
            ...presentation,
            slideDecks: presentation.slideDecks.filter(deck => deck.id !== deckId),
            updatedAt: new Date()
          }
        : presentation
    ));
    
    if (currentSlideDeckId === deckId) {
      setCurrentSlideDeckId(null);
    }
  };

  const setCurrentSlideDeck = (deckId: string | null) => {
    setCurrentSlideDeckId(deckId);
  };

  const getCurrentSlideDeck = () => {
    const currentPresentation = getCurrentPresentation();
    if (!currentPresentation || !currentSlideDeckId) return null;
    
    return currentPresentation.slideDecks.find(deck => deck.id === currentSlideDeckId) || null;
  };

  const reorderSlideDecks = (presentationId: string, fromIndex: number, toIndex: number) => {
    setPresentations(prev => prev.map(presentation => 
      presentation.id === presentationId
        ? {
            ...presentation,
            slideDecks: (() => {
              const result = [...presentation.slideDecks];
              const [removed] = result.splice(fromIndex, 1);
              result.splice(toIndex, 0, removed);
              return result;
            })(),
            updatedAt: new Date()
          }
        : presentation
    ));
  };

  return (
    <PresentationsContext.Provider value={{
      presentations,
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
      reorderSlideDecks
    }}>
      {children}
    </PresentationsContext.Provider>
  );
};
