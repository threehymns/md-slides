import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, X } from "lucide-react";

interface EditableTitleProps {
  initialTitle: string;
  onRename: (newTitle: string) => void;
  className?: string;
  inputClassName?: string;
  spanClassName?: string;
  autoFocus?: boolean;
  // New props for external control
  isEditingExternally: boolean;
  onStopEditing: () => void;
}

export const EditableTitle: React.FC<EditableTitleProps> = ({
  initialTitle,
  onRename,
  className,
  inputClassName,
  spanClassName,
  autoFocus = false,
  isEditingExternally, // Use external state
  onStopEditing, // Callback to stop editing
}) => {
  // Removed internal isEditing state
  const [editTitle, setEditTitle] = useState(initialTitle);

  useEffect(() => {
    // Reset editTitle when initialTitle changes
    setEditTitle(initialTitle);
  }, [initialTitle]);

  useEffect(() => {
    // Sync editTitle when switching *to* editing mode
    if (isEditingExternally) {
      setEditTitle(initialTitle);
    }
  }, [isEditingExternally, initialTitle]);

  const handleRename = () => {
    if (editTitle.trim() && editTitle.trim() !== initialTitle) {
      onRename(editTitle.trim());
    }
    // Use external callback to stop editing
    onStopEditing();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRename();
    } else if (e.key === "Escape") {
      setEditTitle(initialTitle);
      // Use external callback to stop editing
      onStopEditing();
    }
  };

  return (
    <div className={`flex-1 min-w-0 ${className || ""}`}>
      {isEditingExternally ? ( // Use external state
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
        <span
          className={`truncate ${spanClassName || ""}`}
          onClick={() => onStopEditing() /* Allow clicking to start editing */}
        >
          {initialTitle}
        </span>
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
  isEditing?: boolean; // Add isEditing prop
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onEdit,
  onDelete,
  onRemove,
  isStandalone = false,
  buttonClassName,
  iconClassName,
  isEditing = false, // Accept and default the isEditing prop
}) => {
  return (
    <div className="opacity-0 flex gap-1 group-hover/item:opacity-100">
      {/* Only show edit button when not editing */}
      {!isEditing && (
        <Button
          variant="ghost"
          size="sm"
          size="sm"
          className={buttonClassName}
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          <Edit className={iconClassName} />
        </Button>
      )}
      {/* Hide delete/remove buttons when editing */}
      {!isEditing &&
        (isStandalone ? (
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
        ))}
    </div>
  );
};
