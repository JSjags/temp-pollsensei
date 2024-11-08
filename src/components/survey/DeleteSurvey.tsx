import React from "react";
import Image from "next/image";
import ButtonOutline from "../common/ButtonOutline";
import ButtonDelete from "../common/ButtonDelete";
import { Modal } from "flowbite-react";
import close from "./close.svg";

interface DeleteSurveyProps {
  onClose: () => void;
  openModal: boolean;
  onDelete?:()=>void;
}

const DeleteSurvey: React.FC<DeleteSurveyProps> = ({ onClose, openModal, onDelete }) => {
  return (
    <Modals title="" openModal={openModal} modalSize="lg" onClose={onClose}>
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-[#54595E] font-[700]">Delete survey?</h2>
        <p className="text-center text-[#838383] text-[14px]">
          Are you sure you want to delete this response? Note that this cannot
          be undone.
        </p>
        <div className="mt-3 flex items-center justify-between w-full">
          <ButtonOutline label="No, cancel" onclick={onClose} />
          <ButtonDelete label="Delete" onclick={onDelete}/>
        </div>
      </div>
    </Modals>
  );
};

export default DeleteSurvey;

interface ModalsProps {
  title: string;
  openModal: boolean;
  modalSize: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Modals: React.FC<ModalsProps> = ({
  title,
  openModal,
  modalSize,
  onClose,
  children,
}) => {
  return (
    <Modal
      show={openModal}
      size={modalSize}
      onClose={onClose}
      style={{
        borderRadius: "5.489px",
        // background: "rgba(0, 0, 0, 0.5)",
        padding: "0",
        zIndex: "100",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Modal.Body>
        <div className="w-[450px] h-[225px] px-5 bg-white rounded">
          <div className="flex justify-between py-4">
            <p className="pl-8 text-[20px] font-bold font-Inter">{title}</p>
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
          </div>
          {children}
        </div>
      </Modal.Body>
    </Modal>
  );
};
