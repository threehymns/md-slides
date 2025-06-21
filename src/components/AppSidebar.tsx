import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, FileText, GripVertical, FolderOpen, Search } from "lucide-react";
import { AnimatePresence, Reorder, motion } from "framer-motion";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePresentations } from "@/contexts/PresentationsContext";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Presentation, SlideDeck } from "@/types";
import { EditableTitle, ActionButtons } from "@/components/common/EditableItem";

interface DraggablePresentationProps {
  presentation: Presentation;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRename: (newTitle: string) => void;
  updateSlideDeck: (id: string, data: { title: string }) => void;
}

interface SlideDeckItemProps {
  deck: SlideDeck;
  isSelected: boolean;
  onSelect: () => void;
  onRename: (newTitle: string) => void;
  onDelete?: () => void; // For standalone decks
  onRemove?: () => void; // For decks in presentations
  isStandalone?: boolean; // To differentiate behavior/UI
}

interface DraggedSlideDeckData {
  type: "slideDeck";
  deckId: string;
}

const SlideDeckItem: React.FC<SlideDeckItemProps> = ({
  deck,
  isSelected,
  onSelect,
  onRename,
  onDelete,
  onRemove,
  isStandalone = false,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    if (isStandalone) {
      e.dataTransfer.setData(
        "application/json",
        JSON.stringify({
          type: "slideDeck",
          deckId: deck.id,
        }),
      );
    }
  };

  return (
    <Reorder.Item
      value={deck}
      as="div"
      layout
      initial={{ opacity: 0, x: -10, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -10, transition: { duration: 0.15 } }}
      whileDrag={{ scale: 1.05, zIndex: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div
        className={`
          group/item flex items-center gap-2 p-2
          ${isStandalone ? "" : "ml-4"} rounded-md
          cursor-pointer transition-colors
          ${isSelected ? "bg-sidebar-accent" : "hover:bg-sidebar-accent/50"}
        `}
        draggable={isStandalone} // Only draggable if standalone
        onDragStart={handleDragStart}
        onClick={onSelect}
      >
        <GripVertical className="h-3 w-3 text-sidebar-foreground/20 group-hover/item:text-sidebar-foreground/80 cursor-grab transition-colors duration-150" />
        <FileText className="h-3 w-3 text-sidebar-foreground/70" />
        <EditableTitle
          initialTitle={deck.title}
          onRename={onRename}
          inputClassName="h-5 text-xs"
          spanClassName="text-xs"
          isEditingExternally={isEditingTitle}
          onStopEditing={() => setIsEditingTitle(false)}
        />
        <ActionButtons
          onEdit={() => setIsEditingTitle(true)}
          onDelete={onDelete}
          onRemove={onRemove}
          isEditing={isEditingTitle}
          isStandalone={isStandalone}
          buttonClassName="h-5 w-5 p-0"
          iconClassName="h-2 w-2"
        />
      </div>
    </Reorder.Item>
  );
};

const DraggablePresentation: React.FC<DraggablePresentationProps> = ({
  presentation,
  isSelected,
  onSelect,
  onDelete,
  onRename,
  updateSlideDeck,
}) => {
  const navigate = useNavigate();
  const {
    currentSlideDeckId,
    setCurrentSlideDeck,
    removeSlideDeckFromPresentation,
    reorderSlideDecksInPresentation,
    getPresentationSlideDecks,
    addSlideDeckToPresentation,
  } = usePresentations();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isOpen, setIsOpen] = useState(isSelected);

  const presentationSlideDecks = getPresentationSlideDecks(presentation.id);

  React.useEffect(() => {
    setIsOpen(isSelected);
  }, [isSelected]);

  const handleReorderDecks = (newDecks: SlideDeck[]) => {
    reorderSlideDecksInPresentation(presentation.id, newDecks);
  };

  const handlePresentationDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handlePresentationDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const data: DraggedSlideDeckData = JSON.parse(
        e.dataTransfer.getData("application/json"),
      );
      if (data.type === "slideDeck" && data.deckId) {
        addSlideDeckToPresentation(presentation.id, data.deckId);
      }
    } catch (error) {
      console.error("Error handling drop:", error);
    }
  };

  return (
    <Reorder.Item
      value={presentation}
      as="li"
      layout
      initial={{ opacity: 0, y: -10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}
      whileDrag={{ scale: 1.02, zIndex: 1 }}
      transition={{ type: "spring", stiffness: 250, damping: 20 }}
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className="group/menu-item relative"
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <motion.div
          className={`
            group/item flex items-center gap-2 p-2
            rounded-md cursor-pointer transition-colors
            ${isSelected ? "bg-sidebar-accent" : "hover:bg-sidebar-accent/50"}
          `}
          onClick={onSelect}
          layout
        >
          <GripVertical className="h-4 w-4 text-sidebar-foreground/20 group-hover/item:text-sidebar-foreground/80 cursor-grab transition-colors duration-150" />
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
              <FolderOpen className="h-4 w-4 text-sidebar-foreground/70" />
            </Button>
          </CollapsibleTrigger>
          <EditableTitle
            initialTitle={presentation.title}
            onRename={onRename}
            inputClassName="h-6 text-xs"
            spanClassName="text-sm"
            isEditingExternally={isEditingTitle}
            onStopEditing={() => setIsEditingTitle(false)}
          />
          <ActionButtons
            onEdit={() => setIsEditingTitle(true)}
            onDelete={onDelete}
            buttonClassName="h-6 w-6 p-0"
            isEditing={isEditingTitle}
            iconClassName="h-3 w-3"
            isStandalone={true} // Presentations are always standalone in this context for delete button
          />
        </motion.div>
        <CollapsibleContent
          onDragOver={handlePresentationDragOver}
          onDrop={handlePresentationDrop}
          className="overflow-hidden"
        >
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9, height: 0 }}
            animate={{ opacity: 1, scale: 1, height: "auto" }}
            transition={{ duration: 0.2 }}
          >
            <Reorder.Group
              axis="y"
              values={presentationSlideDecks}
              onReorder={handleReorderDecks}
              className="space-y-1 pt-1"
            >
              <AnimatePresence>
                {presentationSlideDecks.map((deck: SlideDeck) => (
                  <SlideDeckItem
                    key={deck.id}
                    deck={deck}
                    isSelected={currentSlideDeckId === deck.id}
                    onSelect={() => {
                      setCurrentSlideDeck(deck.id);
                      navigate(`/edit`);
                    }}
                    onRemove={() =>
                      removeSlideDeckFromPresentation(presentation.id, deck.id)
                    }
                    isStandalone={false}
                    onRename={(newTitle) =>
                      updateSlideDeck(deck.id, { title: newTitle })
                    }
                  />
                ))}
              </AnimatePresence>
            </Reorder.Group>
            {presentationSlideDecks.length === 0 && (
              <div
                className="
                text-xs text-sidebar-foreground/60
                p-2 ml-4 text-center
              "
              >
                Drop slide decks here
              </div>
            )}
          </motion.div>
        </CollapsibleContent>
      </Collapsible>
    </Reorder.Item>
  );
};

export function AppSidebar() {
  const navigate = useNavigate();
  const {
    presentations,
    slideDecks,
    currentPresentationId,
    currentSlideDeckId,
    createPresentation,
    deletePresentation,
    setCurrentPresentation,
    updatePresentation,
    reorderPresentations,
    reorderSlideDecks,
    reorderSlideDecksInPresentation,
    createSlideDeck,
    deleteSlideDeck,
    setCurrentSlideDeck,
    updateSlideDeck,
  } = usePresentations();

  const [searchTerm, setSearchTerm] = useState("");

  const filteredSlideDecks = slideDecks.filter((deck) =>
    deck.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreatePresentation = () => {
    const title = `Presentation ${presentations.length + 1}`;
    createPresentation(title);
  };

  const handleCreateSlideDeck = () => {
    const title = `Slide Deck ${slideDecks.length + 1}`;
    createSlideDeck(title);
  };

  const handleReorderPresentations = (newOrder: Presentation[]) => {
    reorderPresentations(newOrder);
  };

  const handleSlideDeckSelect = (deckId: string) => {
    setCurrentPresentation(null); // Deactivate current presentation
    setCurrentSlideDeck(deckId);
    navigate(`/edit`);
  };

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Slideshow Manager</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between">
            <SidebarGroupLabel>Presentations</SidebarGroupLabel>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCreatePresentation}
              className="h-6 w-6 p-0"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              <Reorder.Group
                axis="y"
                values={presentations}
                onReorder={handleReorderPresentations}
              >
                <AnimatePresence>
                  {presentations.map((presentation) => (
                    <DraggablePresentation
                      key={presentation.id}
                      presentation={presentation}
                      isSelected={currentPresentationId === presentation.id}
                      onSelect={() => {
                        setCurrentPresentation(presentation.id);
                        navigate(`/`);
                      }}
                      onDelete={() => deletePresentation(presentation.id)}
                      onRename={(newTitle) =>
                        updatePresentation(presentation.id, { title: newTitle })
                      }
                      updateSlideDeck={updateSlideDeck}
                    />
                  ))}
                </AnimatePresence>
              </Reorder.Group>
              {presentations.length === 0 && (
                <SidebarMenuItem>
                  <div className="text-sm text-sidebar-foreground/60 p-2 text-center">
                    No presentations yet. Click + to create one.
                  </div>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <div className="flex items-center justify-between">
            <SidebarGroupLabel>Slide Decks</SidebarGroupLabel>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCreateSlideDeck}
              className="h-6 w-6 p-0"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <SidebarGroupContent>
            <div className="relative mb-2">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-sidebar-foreground/50" />
              <Input
                placeholder="Search slide decks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-7 h-7 text-xs"
              />
            </div>
            <div className="max-h-64 overflow-y-auto">
              <Reorder.Group
                className="space-y-1"
                axis="y"
                values={filteredSlideDecks}
                onReorder={(newOrder: SlideDeck[]) => {
                  if (currentPresentationId) {
                    reorderSlideDecksInPresentation(
                      currentPresentationId,
                      newOrder,
                    );
                  } else {
                    reorderSlideDecks(newOrder);
                  }
                }}
              >
                <AnimatePresence>
                  {filteredSlideDecks.map((deck) => (
                    <SlideDeckItem
                      key={deck.id}
                      deck={deck}
                      isSelected={currentSlideDeckId === deck.id}
                      onSelect={() => handleSlideDeckSelect(deck.id)}
                      onDelete={() => deleteSlideDeck(deck.id)}
                      onRename={(newTitle) =>
                        updateSlideDeck(deck.id, { title: newTitle })
                      }
                      isStandalone={true}
                    />
                  ))}
                </AnimatePresence>
              </Reorder.Group>
              {filteredSlideDecks.length === 0 && slideDecks.length > 0 && (
                <div
                  className="
                  text-xs text-sidebar-foreground/60
                  p-2 text-center
                "
                >
                  No matching slide decks
                </div>
              )}
              {slideDecks.length === 0 && (
                <div className="text-xs text-sidebar-foreground/60 p-2 text-center">
                  No slide decks yet. Click + to create one.
                </div>
              )}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
