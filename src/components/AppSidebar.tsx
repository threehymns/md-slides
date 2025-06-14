
import React, { useState } from 'react';
import { Plus, FileText, GripVertical, Trash2, Edit } from 'lucide-react';
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
import { useSlideDecks } from '@/contexts/SlideDecksContext';

interface DraggableItemProps {
  deck: any;
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

const DraggableItem: React.FC<DraggableItemProps> = ({
  deck,
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
    <SidebarMenuItem>
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
        <FileText className="h-4 w-4 text-sidebar-foreground/70" />
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
            <span className="text-sm truncate">{deck.title}</span>
          )}
        </div>
        <div className="flex gap-1">
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
    </SidebarMenuItem>
  );
};

export function AppSidebar() {
  const { decks, currentDeckId, createDeck, deleteDeck, setCurrentDeck, updateDeck, reorderDecks } = useSlideDecks();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleCreateDeck = () => {
    const title = `Presentation ${decks.length + 1}`;
    createDeck(title);
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
      reorderDecks(draggedIndex, dropIndex);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Slide Decks</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCreateDeck}
            className="h-8 w-8 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Presentations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {decks.map((deck, index) => (
                <DraggableItem
                  key={deck.id}
                  deck={deck}
                  index={index}
                  isDragging={draggedIndex === index}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  isSelected={currentDeckId === deck.id}
                  onSelect={() => setCurrentDeck(deck.id)}
                  onDelete={() => deleteDeck(deck.id)}
                  onRename={(newTitle) => updateDeck(deck.id, { title: newTitle })}
                />
              ))}
              {decks.length === 0 && (
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
