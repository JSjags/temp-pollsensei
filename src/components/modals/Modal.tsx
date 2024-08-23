import React, { ReactNode } from "react";
import { Modal } from "flowbite-react";
import Image from "next/image";
import close from "./close.svg";
import "./style.css";

interface ModalsProps {
  title?: string;
  openModal: boolean;
  modalSize: string;
  onClose: () => void;
  btnText?: string;
  children: ReactNode;
}

function Modals({
  title,
  openModal,
  modalSize,
  onClose,
  btnText,
  children,
}: ModalsProps) {
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
      <div className="flex justify-between mr-6 py-4">
        <p className="pl-8 text-[20px] font-bold font-Inter">{title}</p>
        <button className="modal-close rounded-full ring-1" onClick={onClose}>
          <Image src={close} alt="Close" width={24} height={24} />
        </button>
      </div>

      <Modal.Body>
        <div className="pb-5 p-2">{children}</div>

        {btnText && ( // Check if btnText is provided
          <div className="flex justify-center pb-10 p-3">
            <button className="modal-btn w-full">{btnText}</button>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default Modals;
