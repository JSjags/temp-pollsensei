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
        className="inline-flex items-center px-4 py-2 border border-purple-300 text-sm font-medium rounded-full text-purple-700 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors gap-1"
      >
        <Pencil className="w-3 h-3" />
        Edit
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onDelete}
        className="inline-flex items-center px-4 py-2 border text-sm font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors gap-1 text-red-500 border-red-500 hover:bg-red-50 hover:text-red-500"
      >
        <Trash2 className="w-3 h-3" />
        Delete
      </Button>
    </div>
  );
};

export default ActionButtons;
