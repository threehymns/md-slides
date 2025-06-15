
import React, { createContext, useContext, useState, useEffect } from 'react';
import { SlideDeck } from '@/types';

interface SlideDecksContextType {
  decks: SlideDeck[];
  currentDeckId: string | null;
  createDeck: (title: string, content?: string) => SlideDeck;
  updateDeck: (id: string, updates: Partial<Omit<SlideDeck, 'id' | 'createdAt'>>) => void;
  deleteDeck: (id: string) => void;
  setCurrentDeck: (id: string | null) => void;
  getCurrentDeck: () => SlideDeck | null;
  reorderDecks: (fromIndex: number, toIndex: number) => void;
}

const SlideDecksContext = createContext<SlideDecksContextType | undefined>(undefined);

export const useSlideDecks = () => {
  const context = useContext(SlideDecksContext);
  if (!context) {
    throw new Error('useSlideDecks must be used within a SlideDecksProvider');
  }
  return context;
};

export const SlideDecksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [decks, setDecks] = useState<SlideDeck[]>([]);
  const [currentDeckId, setCurrentDeckId] = useState<string | null>(null);

  // Load decks from localStorage on mount
  useEffect(() => {
    const savedDecks = localStorage.getItem('slideDecks');
    const savedCurrentId = localStorage.getItem('currentDeckId');
    
    if (savedDecks) {
      const parsedDecks = JSON.parse(savedDecks).map((deck: any) => ({
        ...deck,
        createdAt: new Date(deck.createdAt),
        updatedAt: new Date(deck.updatedAt)
      }));
      setDecks(parsedDecks);
    }
    
    if (savedCurrentId) {
      setCurrentDeckId(savedCurrentId);
    }
  }, []);

  // Save decks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('slideDecks', JSON.stringify(decks));
  }, [decks]);

  // Save current deck ID to localStorage
  useEffect(() => {
    if (currentDeckId) {
      localStorage.setItem('currentDeckId', currentDeckId);
    } else {
      localStorage.removeItem('currentDeckId');
    }
  }, [currentDeckId]);

  const createDeck = (title: string, content: string = '') => {
    const newDeck: SlideDeck = {
      id: Date.now().toString(),
      title,
      content,
      background: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setDecks(prev => [...prev, newDeck]);
    setCurrentDeckId(newDeck.id);
    return newDeck;
  };

  const updateDeck = (id: string, updates: Partial<Omit<SlideDeck, 'id' | 'createdAt'>>) => {
    setDecks(prev => prev.map(deck => 
      deck.id === id 
        ? { ...deck, ...updates, updatedAt: new Date() }
        : deck
    ));
  };

  const deleteDeck = (id: string) => {
    setDecks(prev => prev.filter(deck => deck.id !== id));
    if (currentDeckId === id) {
      setCurrentDeckId(null);
    }
  };

  const setCurrentDeck = (id: string | null) => {
    setCurrentDeckId(id);
  };

  const getCurrentDeck = () => {
    return decks.find(deck => deck.id === currentDeckId) || null;
  };

  const reorderDecks = (fromIndex: number, toIndex: number) => {
    setDecks(prev => {
      const result = [...prev];
      const [removed] = result.splice(fromIndex, 1);
      result.splice(toIndex, 0, removed);
      return result;
    });
  };

  return (
    <SlideDecksContext.Provider value={{
      decks,
      currentDeckId,
      createDeck,
      updateDeck,
      deleteDeck,
      setCurrentDeck,
      getCurrentDeck,
      reorderDecks
    }}>
      {children}
    </SlideDecksContext.Provider>
  );
};
