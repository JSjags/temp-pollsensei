"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/shadcn-input";
import { useState } from "react";
import { Copy } from "lucide-react";
import { toast } from "react-toastify";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportName: string;
  shareLink: string;
  onInvite?: (emails: string) => void;
}

export function ShareDialog({ open, onOpenChange, reportName, shareLink, onInvite }: ShareDialogProps) {
  const [emails, setEmails] = useState("");

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    toast.success("Link copied to clipboard!");
  };

  const handleInvite = () => {
    if (onInvite) {
      onInvite(emails);
      setEmails("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6 space-y-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Share &quot;{reportName}&quot;</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2">
          <Input
            placeholder="Emails, Comma Separated"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
          />
          <Button variant="gradient" onClick={handleInvite}>Invite</Button>
        </div>

        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
          <span className="truncate max-w-[70%] text-sm text-gray-600">{shareLink}</span>
          <button onClick={handleCopy} className="flex items-center gap-1 text-purple-600 font-medium">
            <Copy className="w-4 h-4" /> Copy Link
          </button>
        </div>

        <div className="space-y-4">
          <div className="border rounded-lg p-3 flex items-center justify-between cursor-pointer">
            <span>Anyone invited</span>
          </div>
          <div className="border rounded-lg p-3 flex items-center justify-between cursor-pointer">
            <span>Collaborators</span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-500 font-medium">Public Access</p>
          <div className="flex items-center gap-3">
            <select className="border p-2 rounded">
              <option>Anyone with link</option>
              <option>Restricted</option>
            </select>
            <select className="border p-2 rounded">
              <option>Read only</option>
              <option>Edit</option>
            </select>
          </div>
        </div>

        <DialogFooter className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
