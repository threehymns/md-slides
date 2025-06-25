import React, { createContext, useContext, useState, useEffect } from "react";
import { SlideDeck, Presentation } from "@/types";

interface PresentationsContextType {
  presentations: Presentation[];
  slideDecks: SlideDeck[];
  currentPresentationId: string | null;
  currentSlideDeckId: string | null;

  // Presentation methods
  createPresentation: (title: string) => Presentation;
  updatePresentation: (
    id: string,
    updates: Partial<Omit<Presentation, "id" | "createdAt">>,
  ) => void;
  deletePresentation: (id: string) => void;
  setCurrentPresentation: (id: string | null) => void;
  getCurrentPresentation: () => Presentation | null;
  reorderPresentations: (newOrder: Presentation[]) => void;
  reorderSlideDecks: (newOrder: SlideDeck[]) => void;

  // Slide deck methods
  createSlideDeck: (title: string, content?: string) => SlideDeck;
  updateSlideDeck: (
    deckId: string,
    updates: Partial<Omit<SlideDeck, "id" | "createdAt">>,
  ) => void;
  deleteSlideDeck: (deckId: string) => void;
  setCurrentSlideDeck: (deckId: string | null) => void;
  getCurrentSlideDeck: () => SlideDeck | null;

  // Presentation-SlideDeck relationship methods
  addSlideDeckToPresentation: (
    presentationId: string,
    slideDeckId: string,
  ) => void;
  removeSlideDeckFromPresentation: (
    presentationId: string,
    slideDeckId: string,
  ) => void;
  reorderSlideDecksInPresentation: (
    presentationId: string,
    newDecks: SlideDeck[],
  ) => void;
  getPresentationSlideDecks: (presentationId: string) => SlideDeck[];
}

const PresentationsContext = createContext<
  PresentationsContextType | undefined
>(undefined);

export const usePresentations = () => {
  const context = useContext(PresentationsContext);
  if (!context) {
    throw new Error(
      "usePresentations must be used within a PresentationsProvider",
    );
  }
  return context;
};

export const PresentationsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Initialize state with saved data from localStorage
  const [presentations, setPresentations] = useState<Presentation[]>(() => {
    try {
      const saved = localStorage.getItem("presentations");
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed)
          ? parsed.map((p: Presentation) => ({
              ...p,
              createdAt: new Date(p.createdAt),
              updatedAt: new Date(p.updatedAt),
            }))
          : [];
      }
    } catch (error) {}
    return [];
  });

  const [slideDecks, setSlideDecks] = useState<SlideDeck[]>(() => {
    try {
      const saved = localStorage.getItem("slideDecks");
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed)
          ? parsed.map((d: SlideDeck) => ({
              ...d,
              createdAt: new Date(d.createdAt),
              updatedAt: new Date(d.updatedAt),
            }))
          : [];
      }
    } catch (error) {}
    return [];
  });

  const [currentPresentationId, setCurrentPresentationId] = useState<
    string | null
  >(() => {
    return localStorage.getItem("currentPresentationId");
  });

  const [currentSlideDeckId, setCurrentSlideDeckId] = useState<string | null>(
    () => {
      return localStorage.getItem("currentSlideDeckId");
    },
  );

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        // Load presentations
        const savedPresentations = localStorage.getItem("presentations");
        if (savedPresentations) {
          try {
            const parsedPresentations = JSON.parse(savedPresentations).map(
              (presentation: Presentation) => ({
                ...presentation,
                createdAt: new Date(presentation.createdAt),
                updatedAt: new Date(presentation.updatedAt),
              }),
            );
            setPresentations(parsedPresentations);
          } catch (error) {
            console.error(
              "[Presentations] Error parsing presentations:",
              error,
            );
            // Reset to empty array if corrupted
            setPresentations([]);
          }
        }

        // Load slide decks
        const savedSlideDecks = localStorage.getItem("slideDecks");
        if (savedSlideDecks) {
          try {
            const parsedSlideDecks = JSON.parse(savedSlideDecks).map(
              (deck: SlideDeck) => ({
                ...deck,
                createdAt: new Date(deck.createdAt),
                updatedAt: new Date(deck.updatedAt),
              }),
            );
            setSlideDecks(parsedSlideDecks);
          } catch (error) {
            console.error("[Presentations] Error parsing slide decks:", error);
            // Reset to empty array if corrupted
            setSlideDecks([]);
          }
        }

        // Load current IDs
        const savedCurrentPresentationId = localStorage.getItem(
          "currentPresentationId",
        );
        const savedCurrentSlideDeckId =
          localStorage.getItem("currentSlideDeckId");

        if (savedCurrentPresentationId) {
          setCurrentPresentationId(savedCurrentPresentationId);
        }

        if (savedCurrentSlideDeckId) {
          setCurrentSlideDeckId(savedCurrentSlideDeckId);
        }
      } catch (error) {
        console.error(
          "[Presentations] Error loading data from localStorage:",
          error,
        );
      }
    };

    loadData();
  }, []);

  // Save data to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("presentations", JSON.stringify(presentations));
    } catch (error) {
      console.error("Error saving presentations:", error);
    }
  }, [presentations]);

  useEffect(() => {
    try {
      localStorage.setItem("slideDecks", JSON.stringify(slideDecks));
    } catch (error) {
      console.error("Error saving slide decks:", error);
    }
  }, [slideDecks]);

  useEffect(() => {
    try {
      if (currentPresentationId) {
        localStorage.setItem("currentPresentationId", currentPresentationId);
      } else {
        localStorage.removeItem("currentPresentationId");
      }
    } catch (error) {
      console.error("Error saving current presentation ID:", error);
    }
  }, [currentPresentationId]);

  useEffect(() => {
    try {
      if (currentSlideDeckId) {
        localStorage.setItem("currentSlideDeckId", currentSlideDeckId);
      } else {
        localStorage.removeItem("currentSlideDeckId");
      }
    } catch (error) {
      console.error("Error saving current slide deck ID:", error);
    }
  }, [currentSlideDeckId]);

  // Presentation methods
  const createPresentation = (title: string) => {
    const newPresentation: Presentation = {
      id: Date.now().toString(),
      title,
      slideDeckIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setPresentations((prev) => [...prev, newPresentation]);
    setCurrentPresentationId(newPresentation.id);
    return newPresentation;
  };

  const updatePresentation = (
    id: string,
    updates: Partial<Omit<Presentation, "id" | "createdAt">>,
  ) => {
    setPresentations((prev) =>
      prev.map((presentation) =>
        presentation.id === id
          ? { ...presentation, ...updates, updatedAt: new Date() }
          : presentation,
      ),
    );
  };

  const deletePresentation = (id: string) => {
    setPresentations((prev) =>
      prev.filter((presentation) => presentation.id !== id),
    );
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
    return (
      presentations.find(
        (presentation) => presentation.id === currentPresentationId,
      ) || null
    );
  };

  const reorderPresentations = (newOrder: Presentation[]) => {
    setPresentations(newOrder);
  };

  const reorderSlideDecks = (newOrder: SlideDeck[]) => {
    setSlideDecks(newOrder);
  };

  // Slide deck methods
  const createSlideDeck = (title: string, content: string = "") => {
    const newDeck: SlideDeck = {
      id: Date.now().toString(),
      title,
      content,
      background: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setSlideDecks((prev) => [...prev, newDeck]);
    setCurrentSlideDeckId(newDeck.id);
    return newDeck;
  };

  const updateSlideDeck = (
    deckId: string,
    updates: Partial<Omit<SlideDeck, "id" | "createdAt">>,
  ) => {
    setSlideDecks((prev) =>
      prev.map((deck) =>
        deck.id === deckId
          ? { ...deck, ...updates, updatedAt: new Date() }
          : deck,
      ),
    );
  };

  const deleteSlideDeck = (deckId: string) => {
    // Remove from all presentations first
    setPresentations((prev) =>
      prev.map((presentation) => ({
        ...presentation,
        slideDeckIds: presentation.slideDeckIds.filter((id) => id !== deckId),
        updatedAt: new Date(),
      })),
    );

    // Then remove the slide deck
    setSlideDecks((prev) => prev.filter((deck) => deck.id !== deckId));

    if (currentSlideDeckId === deckId) {
      setCurrentSlideDeckId(null);
    }
  };

  const setCurrentSlideDeck = (deckId: string | null) => {
    setCurrentSlideDeckId(deckId);
  };

  const getCurrentSlideDeck = () => {
    if (!currentSlideDeckId) return null;
    return slideDecks.find((deck) => deck.id === currentSlideDeckId) || null;
  };

  // Presentation-SlideDeck relationship methods
  const addSlideDeckToPresentation = (
    presentationId: string,
    slideDeckId: string,
  ) => {
    setPresentations((prev) =>
      prev.map((presentation) =>
        presentation.id === presentationId
          ? {
              ...presentation,
              slideDeckIds: [...presentation.slideDeckIds, slideDeckId],
              updatedAt: new Date(),
            }
          : presentation,
      ),
    );
  };

  const removeSlideDeckFromPresentation = (
    presentationId: string,
    slideDeckId: string,
  ) => {
    setPresentations((prev) =>
      prev.map((presentation) =>
        presentation.id === presentationId
          ? {
              ...presentation,
              slideDeckIds: presentation.slideDeckIds.filter(
                (id) => id !== slideDeckId,
              ),
              updatedAt: new Date(),
            }
          : presentation,
      ),
    );
  };

  const reorderSlideDecksInPresentation = (
    presentationId: string,
    newDecks: SlideDeck[],
  ) => {
    setPresentations((prev) =>
      prev.map((presentation) =>
        presentation.id === presentationId
          ? {
              ...presentation,
              slideDeckIds: newDecks.map((deck) => deck.id),
              updatedAt: new Date(),
            }
          : presentation,
      ),
    );
  };

  const getPresentationSlideDecks = (presentationId: string) => {
    const presentation = presentations.find((p) => p.id === presentationId);
    if (!presentation) return [];

    return presentation.slideDeckIds
      .map((id) => slideDecks.find((deck) => deck.id === id))
      .filter(Boolean) as SlideDeck[];
  };

  return (
    <PresentationsContext.Provider
      value={{
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
        reorderSlideDecks,
        createSlideDeck,
        updateSlideDeck,
        deleteSlideDeck,
        setCurrentSlideDeck,
        getCurrentSlideDeck,
        addSlideDeckToPresentation,
        removeSlideDeckFromPresentation,
        reorderSlideDecksInPresentation,
        getPresentationSlideDecks,
      }}
    >
      {children}
    </PresentationsContext.Provider>
  );
};
