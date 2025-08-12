"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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

export function ShareDialog({
  open,
  onOpenChange,
  reportName,
  shareLink,
  onInvite,
}: ShareDialogProps) {
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
      <DialogContent showXBtn={false} className="max-w-[600px] w-full pr-6 space-y-6">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              Share &quot;{reportName}&quot;
            </DialogTitle>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-purple-600 font-medium"
            >
              <LinkIcon /> Copy Link
            </button>
          </div>
        </DialogHeader>

        <div className="flex items-center gap-2">
          <Input
            placeholder="Emails, Comma Separated"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            className="w-[80%]"
          />
          <Button variant="gradient" disabled={!emails} onClick={handleInvite} className="rounded-md flex-1 h-10">
            Invite
          </Button>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.22172 19.7777C4.68559 20.2423 5.23669 20.6106 5.84334 20.8615C6.44999 21.1123 7.10023 21.2409 7.75672 21.2397C8.41335 21.2409 9.06374 21.1123 9.67054 20.8614C10.2774 20.6105 10.8286 20.2422 11.2927 19.7777L14.1207 16.9487L12.7067 15.5347L9.87872 18.3637C9.31519 18.9247 8.55239 19.2397 7.75722 19.2397C6.96205 19.2397 6.19925 18.9247 5.63572 18.3637C5.07422 17.8004 4.75892 17.0375 4.75892 16.2422C4.75892 15.4469 5.07422 14.684 5.63572 14.1207L8.46472 11.2927L7.05072 9.87872L4.22172 12.7067C3.28552 13.6452 2.75977 14.9166 2.75977 16.2422C2.75977 17.5678 3.28552 18.8393 4.22172 19.7777ZM19.7777 11.2927C20.7134 10.354 21.2388 9.08264 21.2388 7.75722C21.2388 6.4318 20.7134 5.16043 19.7777 4.22172C18.8393 3.28552 17.5678 2.75977 16.2422 2.75977C14.9166 2.75977 13.6452 3.28552 12.7067 4.22172L9.87872 7.05072L11.2927 8.46472L14.1207 5.63572C14.6842 5.07471 15.447 4.75975 16.2422 4.75975C17.0374 4.75975 17.8002 5.07471 18.3637 5.63572C18.9252 6.19899 19.2405 6.96189 19.2405 7.75722C19.2405 8.55255 18.9252 9.31545 18.3637 9.87872L15.5347 12.7067L16.9487 14.1207L19.7777 11.2927Z"
        fill="currentColor"
      />
      <path
        d="M8.46383 16.9508L7.04883 15.5368L15.5358 7.05078L16.9498 8.46578L8.46383 16.9508Z"
        fill="currentColor"
      />
    </svg>
  );
}
