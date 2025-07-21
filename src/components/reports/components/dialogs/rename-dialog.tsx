"use client";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/shadcn-input";

interface RenameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentName: string;
  onConfirm: (newName: string) => void;
  isLoading?: boolean;
}

export function RenameDialog({ open, onOpenChange, currentName, onConfirm, isLoading }: RenameDialogProps) {
  const [newName, setNewName] = useState("");

  const handleSubmit = () => {
    onConfirm(newName);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Rename Report</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-2">
          <div>
            <label className="text-sm font-medium">Current Name</label>
            <Input value={currentName} readOnly className="mt-1 text-black" />
          </div>
          <div>
            <label className="text-sm font-medium">New Name</label>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter new name"
              className="mt-1"
            />
          </div>
        </div>
        <DialogFooter className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="gradient" onClick={handleSubmit} disabled={isLoading || !newName.trim()} className="rounded-md">
            {isLoading ? "Renaming..." : "Rename"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}