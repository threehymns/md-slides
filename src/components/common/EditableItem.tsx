import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, X } from 'lucide-react';

interface EditableTitleProps {
  initialTitle: string;
  onRename: (newTitle: string) => void;
  className?: string;
  inputClassName?: string;
  spanClassName?: string;
  autoFocus?: boolean;
}

export const EditableTitle: React.FC<EditableTitleProps> = ({
  initialTitle,
  onRename,
  className,
  inputClassName,
  spanClassName,
  autoFocus = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(initialTitle);

  useEffect(() => {
    setEditTitle(initialTitle);
  }, [initialTitle]);

  const handleRename = () => {
    if (editTitle.trim() && editTitle.trim() !== initialTitle) {
      onRename(editTitle.trim());
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setEditTitle(initialTitle);
      setIsEditing(false);
    }
  };

  return (
    <div className={`flex-1 min-w-0 ${className || ''}`}>
      {isEditing ? (
        <Input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={handleRename}
          onKeyDown={handleKeyPress}
          className={inputClassName}
          autoFocus={autoFocus}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span className={`truncate ${spanClassName || ''}`}>{initialTitle}</span>
      )}
    </div>
  );
};

interface ActionButtonsProps {
  onEdit: () => void;
  onDelete?: () => void;
  onRemove?: () => void;
  isStandalone?: boolean;
  buttonClassName?: string;
  iconClassName?: string;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onEdit,
  onDelete,
  onRemove,
  isStandalone = false,
  buttonClassName,
  iconClassName,
}) => {
  return (
    <div className="opacity-0 flex gap-1 group-hover/item:opacity-100">
      <Button
        variant="ghost"
        size="sm"
        className={buttonClassName}
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
      >
        <Edit className={iconClassName} />
      </Button>
      {isStandalone ? (
        <Button
          variant="ghost"
          size="sm"
          className={`${buttonClassName} text-destructive hover:text-destructive`}
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
        >
          <Trash2 className={iconClassName} />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          className={`${buttonClassName} text-destructive hover:text-destructive`}
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
        >
          <X className={iconClassName} />
        </Button>
      )}
    </div>
  );
};