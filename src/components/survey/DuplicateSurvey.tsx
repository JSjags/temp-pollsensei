import React from "react";
import Image from "next/image";
import ButtonOutline from "../common/ButtonOutline";
import { Modal } from "flowbite-react";
import close from "./close.svg";
import Button from "../common/Button";

interface DuplicateSurveyProps {
  openModal: boolean;
  onClose: () => void;
  isDuplicating?: boolean;
  onDuplicatingSurvey?:()=>void;
}

const DuplicateSurvey: React.FC<DuplicateSurveyProps> = ({
  openModal,
  onClose,
  isDuplicating,
  onDuplicatingSurvey 
}) => {
  return (
    <Modals title="" openModal={openModal} modalSize="lg" onClose={onClose}>
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-[#54595E] font-[700]">Duplicate survey?</h2>
        <p className="text-center text-[#838383] text-[14px]">
          Are you sure you want to duplicate this survey? A new copy of will be
          created.
        </p>
        <div className="mt-3 flex items-center justify-between w-full">
          <ButtonOutline onclick={onClose} label="No, cancel" />
          <Button label={isDuplicating ? "Duplicating..." : "Duplicate"} onClick={onDuplicatingSurvey} />
        </div>
      </div>
    </Modals>
  );
};

export default DuplicateSurvey;

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
        background: "#f1f1f1",
        padding: "0",
        zIndex: "100",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Modal.Body>
        <div className="w-[450px] h-[225px] px-5">
          <div className="flex justify-between py-4">
            <p className="pl-8 text-[20px] font-bold font-Inter">{title}</p>
            <button
              className="bg-[#f9f9f9] rounded-full ring-0"
              onClick={onClose}
            >
              <Image src={close} alt="Close" width={24} height={24} />
            </button>
          </div>
          {children}
        </div>
      </Modal.Body>
    </Modal>
  );
};
