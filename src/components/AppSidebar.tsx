
import React, { useState } from 'react';
import { Plus, FileText, GripVertical, Trash2, Edit, FolderOpen, Presentation } from 'lucide-react';
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
  index: number;
  isDragging: boolean;
  onDragStart: (index: number) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRename: (newTitle: string) => void;
}

interface DraggableSlideDeckProps {
  deck: any;
  index: number;
  presentationId: string;
  isDragging: boolean;
  onDragStart: (index: number) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRename: (newTitle: string) => void;
}

const DraggableSlideDeck: React.FC<DraggableSlideDeckProps> = ({
  deck,
  index,
  presentationId,
  isDragging,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
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

  return (
    <div
      className={`flex items-center gap-2 p-2 ml-4 rounded-md cursor-pointer transition-colors ${
        isSelected ? 'bg-sidebar-accent' : 'hover:bg-sidebar-accent/50'
      } ${isDragging ? 'opacity-50' : ''}`}
      draggable
      onDragStart={() => onDragStart(index)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
    >
      <GripVertical className="h-3 w-3 text-sidebar-foreground/50" />
      <FileText className="h-3 w-3 text-sidebar-foreground/70" />
      <div className="flex-1 min-w-0" onClick={onSelect}>
        {isEditing ? (
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleRename}
            onKeyDown={handleKeyPress}
            className="h-5 text-xs"
            autoFocus
          />
        ) : (
          <span className="text-xs truncate">{deck.title}</span>
        )}
      </div>
      <div className="flex gap-1">
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
  );
};

const DraggablePresentation: React.FC<DraggablePresentationProps> = ({
  presentation,
  index,
  isDragging,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  isSelected,
  onSelect,
  onDelete,
  onRename
}) => {
  const {
    currentSlideDeckId,
    createSlideDeck,
    deleteSlideDeck,
    setCurrentSlideDeck,
    updateSlideDeck,
    reorderSlideDecks
  } = usePresentations();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(presentation.title);
  const [isOpen, setIsOpen] = useState(isSelected);
  const [draggedDeckIndex, setDraggedDeckIndex] = useState<number | null>(null);

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

  const handleCreateSlideDeck = () => {
    const title = `Slide Deck ${presentation.slideDecks.length + 1}`;
    createSlideDeck(presentation.id, title);
  };

  const handleDeckDragStart = (index: number) => {
    setDraggedDeckIndex(index);
  };

  const handleDeckDragEnd = () => {
    setDraggedDeckIndex(null);
  };

  const handleDeckDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDeckDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedDeckIndex !== null && draggedDeckIndex !== dropIndex) {
      reorderSlideDecks(presentation.id, draggedDeckIndex, dropIndex);
    }
  };

  return (
    <SidebarMenuItem>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div
          className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${
            isSelected ? 'bg-sidebar-accent' : 'hover:bg-sidebar-accent/50'
          } ${isDragging ? 'opacity-50' : ''}`}
          draggable
          onDragStart={() => onDragStart(index)}
          onDragEnd={onDragEnd}
          onDragOver={(e) => onDragOver(e, index)}
          onDrop={(e) => onDrop(e, index)}
        >
          <GripVertical className="h-4 w-4 text-sidebar-foreground/50" />
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
              <FolderOpen className="h-4 w-4 text-sidebar-foreground/70" />
            </Button>
          </CollapsibleTrigger>
          <div className="flex-1 min-w-0" onClick={onSelect}>
            {isEditing ? (
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleRename}
                onKeyDown={handleKeyPress}
                className="h-6 text-xs"
                autoFocus
              />
            ) : (
              <span className="text-sm truncate">{presentation.title}</span>
            )}
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                handleCreateSlideDeck();
              }}
            >
              <Plus className="h-3 w-3" />
            </Button>
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
        <CollapsibleContent className="space-y-1">
          {presentation.slideDecks.map((deck: any, deckIndex: number) => (
            <DraggableSlideDeck
              key={deck.id}
              deck={deck}
              index={deckIndex}
              presentationId={presentation.id}
              isDragging={draggedDeckIndex === deckIndex}
              onDragStart={handleDeckDragStart}
              onDragEnd={handleDeckDragEnd}
              onDragOver={handleDeckDragOver}
              onDrop={handleDeckDrop}
              isSelected={currentSlideDeckId === deck.id}
              onSelect={() => setCurrentSlideDeck(deck.id)}
              onDelete={() => deleteSlideDeck(presentation.id, deck.id)}
              onRename={(newTitle) => updateSlideDeck(presentation.id, deck.id, { title: newTitle })}
            />
          ))}
          {presentation.slideDecks.length === 0 && (
            <div className="text-xs text-sidebar-foreground/60 p-2 ml-4 text-center">
              No slide decks yet
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
};

export function AppSidebar() {
  const {
    presentations,
    currentPresentationId,
    createPresentation,
    deletePresentation,
    setCurrentPresentation,
    updatePresentation,
    reorderPresentations
  } = usePresentations();
  
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleCreatePresentation = () => {
    const title = `Presentation ${presentations.length + 1}`;
    createPresentation(title);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      reorderPresentations(draggedIndex, dropIndex);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Presentations</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCreatePresentation}
            className="h-8 w-8 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>My Presentations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {presentations.map((presentation, index) => (
                <DraggablePresentation
                  key={presentation.id}
                  presentation={presentation}
                  index={index}
                  isDragging={draggedIndex === index}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  isSelected={currentPresentationId === presentation.id}
                  onSelect={() => setCurrentPresentation(presentation.id)}
                  onDelete={() => deletePresentation(presentation.id)}
                  onRename={(newTitle) => updatePresentation(presentation.id, { title: newTitle })}
                />
              ))}
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
      </SidebarContent>
    </Sidebar>
  );
}
