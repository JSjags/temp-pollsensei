import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Collaborator } from "./CollaboratorDetailsDialog";

interface RemoveCollaboratorDialogProps {
  collaborator: Collaborator | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function RemoveCollaboratorDialog({
  collaborator,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: RemoveCollaboratorDialogProps) {
  if (!collaborator) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[425px] z-[100000]"
        overlayClassName="z-[100000]"
      >
        <DialogHeader>
          <DialogTitle>Remove Collaborator</DialogTitle>
          <DialogDescription className="pt-2">
            Are you sure you want to remove{" "}
            <span className="font-medium text-foreground">
              {collaborator.name}
            </span>{" "}
            as a collaborator? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Removing...
              </>
            ) : (
              "Remove Collaborator"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default RemoveCollaboratorDialog;
