import React from "react";
import ButtonOutline from "../common/ButtonOutline";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

interface UnpublishFaqProps {
  onClose: () => void;
  openModal: boolean;
  isLoading: boolean;
  onDelete?: () => void;
}

const UnpublishFaq: React.FC<UnpublishFaqProps> = ({
  onClose,
  openModal,
  onDelete,
  isLoading,
}) => {
  return (
    <Dialog open={openModal} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="pl-8 text-[20px] font-bold font-Inter">
              {" "}
            </DialogTitle>
            <button
              className="rounded-full p-2 hover:bg-gray-100"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </DialogHeader>

        <div className="flex flex-col items-center gap-2">
          <h2 className="text-[#54595E] font-[700]">Unpublish</h2>
          <p className="text-center text-[#838383] text-[14px]">
            Are you sure you want to unpublish this?
          </p>
          <div className="mt-3 flex items-center justify-between w-full">
            <ButtonOutline label="No, cancel" onclick={onClose} />
            <ButtonOutline
              label={isLoading ? "Waiting..." : "Continue"}
              onclick={onDelete}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UnpublishFaq;
