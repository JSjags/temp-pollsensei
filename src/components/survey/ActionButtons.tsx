import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface ActionButtonsProps {
  onEdit: (() => void) | undefined;
  onDelete: (() => void) | undefined;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onEdit, onDelete }) => {
  return (
    <div className="flex justify-end gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={onEdit}
        className="flex items-center gap-1"
      >
        <Pencil className="w-3 h-3" />
        Edit
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onDelete}
        className="flex items-center gap-1 text-red-500 border-red-500 hover:bg-red-50 hover:text-red-500"
      >
        <Trash2 className="w-3 h-3" />
        Delete
      </Button>
    </div>
  );
};

export default ActionButtons;
