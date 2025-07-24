import React from "react";
import Image from "next/image";
import ButtonOutline from "../common/ButtonOutline";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import close from "./close.svg";

interface PublishFaqProps {
  onClose: () => void;
  openModal: boolean;
  isLoading: boolean;
  onDelete?: () => void;
}

const PublishFaq: React.FC<PublishFaqProps> = ({
  onClose,
  openModal,
  onDelete,
  isLoading,
}) => {
  return (
    <Dialog open={openModal} onOpenChange={onClose}>
      <DialogContent className="w-[450px] p-5">
        <DialogHeader className="flex flex-row justify-between items-center">
          <DialogTitle className="pl-8 text-[20px] font-bold font-Inter"></DialogTitle>
          <button
            className="bg-[#f9f9f9] rounded-full ring-0"
            onClick={onClose}
          >
            <Image
              src={close}
              alt="Close"
              width={24}
              height={24}
              className="bg-white"
            />
          </button>
        </DialogHeader>
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-[#54595E] font-[700]">Publish</h2>
          <p className="text-center text-[#838383] text-[14px]">
            Are you sure you want to publish this?
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

export default PublishFaq;
