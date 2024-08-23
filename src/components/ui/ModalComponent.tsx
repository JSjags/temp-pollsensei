import React, { ReactNode } from "react";
import { Modal } from "flowbite-react";
import { FaTimes } from "react-icons/fa";

interface ModalComponentProps {
  onClose: () => void;
  openModal: boolean;
  children: ReactNode;
  title?: string;
}

const ModalComponent: React.FC<ModalComponentProps> = ({
  onClose,
  openModal,
  children,
  title,
}) => {
  return (
    <Modals
      title={title}
      openModal={openModal}
      modalSize="lg"
      onClose={onClose}
    >
      <div className="flex flex-col items-center gap-2">{children}</div>
    </Modals>
  );
};

export default ModalComponent;

interface ModalsProps {
  title?: string;
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
      style={{
        borderRadius: "5.489px",
        background: "rgba(0, 0, 0, 0.5)",
        padding: "0",
        zIndex: "100",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Modal.Body>
        <div className="w-[28rem] h-[32rem] px-5 bg-white rounded-md">
          <div className="flex justify-between h-fit py-4">
            <p className="pl-8 text-[20px] font-bold font-Inter">{title}</p>
            <button
              className="bg-[#f9f9f9] rounded-full ring-0"
              onClick={onClose}
            >
              <FaTimes />
            </button>
          </div>
          <>{children}</>
        </div>
      </Modal.Body>
    </Modal>
  );
};
