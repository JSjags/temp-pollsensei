import React from "react";
import Image from "next/image";
import ButtonOutline from "../common/ButtonOutline";
import ButtonDelete from "../common/ButtonDelete";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import close from "./close.svg";

interface DeleteFaqProps {
  onClose: () => void;
  openModal: boolean;
  isLoading: boolean;
  onDelete?: () => void;
}

const DeleteFaq: React.FC<DeleteFaqProps> = ({
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
          <h2 className="text-[#54595E] font-[700]">Delete?</h2>
          <p className="text-center text-[#838383] text-[14px]">
            Are you sure you want to delete this? Note that this cannot be
            undone.
          </p>
          <div className="mt-3 flex items-center justify-between w-full">
            <ButtonOutline label="No, cancel" onclick={onClose} />
            <ButtonDelete
              label={isLoading ? "Deleting" : "Delete"}
              onclick={onDelete}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteFaq;
