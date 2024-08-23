import React, { useState, ReactNode } from "react";
import Image from "next/image";
import ButtonOutline from "../common/ButtonOutline";
import { Modal } from "flowbite-react";
import close from "./close.svg";
import Button from "../common/Button";

interface RenameSurveyProps {
  onClose: () => void;
  openModal: boolean;
}

const RenameSurvey: React.FC<RenameSurveyProps> = ({ onClose, openModal }) => {
  const [surveyName, setSurveyName] = useState<string>("");

  return (
    <Modals title={""} openModal={openModal} modalSize="lg" onClose={onClose}>
      <div className=" flex flex-col items-center gap-2">
        <h2 className="text-[#54595E] font-[700]">Rename this survey</h2>
        <p className="text-center text-[#838383] text-[14px]">
          Please give this survey a new name
        </p>

        <input
          value={surveyName}
          onChange={(e) => setSurveyName(e.target.value)}
          type="text"
          placeholder="Please give this survey a new name"
          className="mt-3 border-[1px] w-full rounded-[6px] text-[#E0E0E0] px-[20px] py-[9px]"
        />
        <div className="mt-3 flex items-center justify-between w-full">
          <ButtonOutline label="No, cancel" />
          <Button label="Rename" />
        </div>
      </div>
    </Modals>
  );
};

export default RenameSurvey;

interface ModalsProps {
  title: string;
  openModal: boolean;
  modalSize: string;
  onClose: () => void;
  children: ReactNode;
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
      // backdropStyle={{ zIndex: 20 }}
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
        <div className="w-[450px] h-[266px] px-5">
          <div className="flex justify-between py-4">
            <p className="pl-8 text-[20px] font-bold font-Inter">{title}</p>
            <button
              className="bg-[#f9f9f9] rounded-full ring-0"
              onClick={onClose}
            >
              <Image src={close} alt="Close" width={24} height={24} />
            </button>
          </div>
          <>{children}</>
        </div>
      </Modal.Body>
    </Modal>
  );
};
