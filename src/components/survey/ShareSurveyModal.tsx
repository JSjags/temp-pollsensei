import React from "react";
import Image from "next/image";
import ButtonOutline from "../common/ButtonOutline";
import ButtonDelete from "../common/ButtonDelete";
import { Modal } from "flowbite-react";
import close from "./close.svg";
import ShareSurvey from "./ShareSurvey";
import ModalComponent from "../ui/ModalComponent";

interface ShareSurveyModalProps {
  onClose: () => void;
  openModal: boolean;
  _id: string;
}

const ShareSurveyModal: React.FC<ShareSurveyModalProps> = ({ onClose, openModal, _id }) => {
  return (
    <ModalComponent titleClassName={"p-0"} openModal={openModal} onClose={onClose}>
      <ShareSurvey _id={_id}  />
    </ModalComponent>
  );
};

export default ShareSurveyModal;

