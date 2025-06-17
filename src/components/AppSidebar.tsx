import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, GripVertical, Trash2, Edit, FolderOpen, Search, X } from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePresentations } from '@/contexts/PresentationsContext';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface DraggablePresentationProps {
  presentation: any;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRename: (newTitle: string) => void;
}

interface DraggableSlideDeckInPresentationProps {
  deck: any;
  presentationId: string;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

interface DraggableSlideDeckProps {
  deck: any;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRename: (newTitle: string) => void;
}

const DraggableSlideDeckInPresentation: React.FC<DraggableSlideDeckInPresentationProps> = ({
  deck,
  isSelected,
  onSelect,
  onRemove
}) => {
  return (
    <Reorder.Item
      value={deck}
      as="div"
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={`group/item flex items-center gap-2 p-2 ml-4 rounded-md cursor-pointer transition-colors ${
          isSelected ? 'bg-sidebar-accent' : 'hover:bg-sidebar-accent/50'
        }`}
        onClick={onSelect}
      >
        <GripVertical className="h-3 w-3 text-sidebar-foreground/10 group-hover/item:text-sidebar-foreground/50 cursor-grab" />
        <FileText className="h-3 w-3 text-sidebar-foreground/70" />
        <div className="flex-1 min-w-0">
          <span className="text-xs truncate">{deck.title}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0 text-destructive hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <X className="h-2 w-2 opacity-0 group-hover/item:opacity-100" />
        </Button>
      </div>
    </Reorder.Item>
  );
};

const DraggableSlideDeck: React.FC<DraggableSlideDeckProps> = ({
  deck,
  isSelected,
  onSelect,
  onDelete,
  onRename
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(deck.title);

  const handleRename = () => {
    if (editTitle.trim()) {
      onRename(editTitle.trim());
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setEditTitle(deck.title);
      setIsEditing(false);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: 'slideDeck',
      deckId: deck.id
    }));
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={`group/item flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${
          isSelected ? 'bg-sidebar-accent' : 'hover:bg-sidebar-accent/50'
        }`}
        draggable
        onDragStart={handleDragStart}
        onClick={onSelect}
      >
        <GripVertical className="h-3 w-3 text-sidebar-foreground/10 group-hover/item:text-sidebar-foreground/50" />
        <FileText className="h-3 w-3 text-sidebar-foreground/70" />
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleRename}
              onKeyDown={handleKeyPress}
              className="h-5 text-xs"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="text-xs truncate">{deck.title}</span>
          )}
        </div>
        <div className="opacity-0 flex gap-1 group-hover/item:opacity-100">
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
          >
            <Edit className="h-2 w-2" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0 text-destructive hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="h-2 w-2" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const DraggablePresentation: React.FC<DraggablePresentationProps> = ({
  presentation,
  isSelected,
  onSelect,
  onDelete,
  onRename
}: DraggablePresentationProps) => {
  const navigate = useNavigate();
  const {
    currentSlideDeckId,
    setCurrentSlideDeck,
    removeSlideDeckFromPresentation,
    reorderSlideDecksInPresentation,
    getPresentationSlideDecks,
    addSlideDeckToPresentation
  } = usePresentations();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(presentation.title);
  const [isOpen, setIsOpen] = useState(isSelected);

  const presentationSlideDecks = getPresentationSlideDecks(presentation.id);

  React.useEffect(() => {
    setIsOpen(isSelected);
  }, [isSelected]);

  const handleRename = () => {
    if (editTitle.trim()) {
      onRename(editTitle.trim());
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setEditTitle(presentation.title);
      setIsEditing(false);
    }
  };

  const handleReorderDecks = (newDecks: any[]) => {
    reorderSlideDecksInPresentation(presentation.id, newDecks);
  };

  const handlePresentationDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handlePresentationDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data.type === 'slideDeck' && data.deckId) {
        addSlideDeckToPresentation(presentation.id, data.deckId);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  return (
    <Reorder.Item
      value={presentation}
      as="li"
      layout
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className="group/menu-item relative"
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div
          className={`group/item flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${
            isSelected ? 'bg-sidebar-accent' : 'hover:bg-sidebar-accent/50'
          }`}
          onClick={onSelect}
        >
          <GripVertical className="h-4 w-4 text-sidebar-foreground/10 group-hover/item:text-sidebar-foreground/50 cursor-grab" />
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
              <FolderOpen className="h-4 w-4 text-sidebar-foreground/70" />
            </Button>
          </CollapsibleTrigger>
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleRename}
                onKeyDown={handleKeyPress}
                className="h-6 text-xs"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="text-sm truncate">{presentation.title}</span>
            )}
          </div>
          <div className="opacity-0 flex gap-1 group-hover/item:opacity-100">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <CollapsibleContent 
          className="space-y-1"
          onDragOver={handlePresentationDragOver}
          onDrop={handlePresentationDrop}
        >
          <Reorder.Group axis="y" values={presentationSlideDecks} onReorder={handleReorderDecks}>
            <AnimatePresence>
              {presentationSlideDecks.map((deck: any) => (
                <DraggableSlideDeckInPresentation
                  key={deck.id}
                  deck={deck}
                  presentationId={presentation.id}
                  isSelected={currentSlideDeckId === deck.id}
                  onSelect={() => {
                    setCurrentSlideDeck(deck.id);
                    navigate(`/edit`);
                  }}
                  onRemove={() => removeSlideDeckFromPresentation(presentation.id, deck.id)}
                />
              ))}
            </AnimatePresence>
          </Reorder.Group>
          {presentationSlideDecks.length === 0 && (
            <div className="text-xs text-sidebar-foreground/60 p-2 ml-4 text-center">
              Drop slide decks here
            </div>
          )}
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
    createSlideDeck,
    deleteSlideDeck,
    setCurrentSlideDeck,
    updateSlideDeck
  } = usePresentations();
  
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSlideDecks = slideDecks.filter(deck => 
    deck.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreatePresentation = () => {
    const title = `Presentation ${presentations.length + 1}`;
    createPresentation(title);
  };

  const handleCreateSlideDeck = () => {
    const title = `Slide Deck ${slideDecks.length + 1}`;
    createSlideDeck(title);
  };

  const handleReorderPresentations = (newOrder: any[]) => {
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
              <Reorder.Group axis="y" values={presentations} onReorder={handleReorderPresentations}>
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
                      onRename={(newTitle) => updatePresentation(presentation.id, { title: newTitle })}
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
            <div className="space-y-1 max-h-64 overflow-y-auto">
              <AnimatePresence>
                {filteredSlideDecks.map((deck) => (
                  <DraggableSlideDeck
                    key={deck.id}
                    deck={deck}
                    isSelected={currentSlideDeckId === deck.id}
                    onSelect={() => handleSlideDeckSelect(deck.id)}
                    onDelete={() => deleteSlideDeck(deck.id)}
                    onRename={(newTitle) => updateSlideDeck(deck.id, { title: newTitle })}
                  />
                ))}
              </AnimatePresence>
              {filteredSlideDecks.length === 0 && slideDecks.length > 0 && (
                <div className="text-xs text-sidebar-foreground/60 p-2 text-center">
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
