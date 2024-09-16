import React, { ReactNode } from "react";
import { Modal } from "flowbite-react";
import { FaTimes } from "react-icons/fa";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Fade, Slide } from "react-awesome-reveal";

interface ModalComponentProps {
  onClose?: () => void;
  openModal: boolean;
  children: ReactNode;
  title?: string;
  titleClassName?: string;
}

const ModalComponent: React.FC<ModalComponentProps> = ({
  onClose,
  openModal,
  children,
  title,
  titleClassName,
}) => {
  return (
    <Modals
      title={title}
      openModal={openModal}
      modalSize="lg"
      onClose={onClose}
      titleClassName={titleClassName}
    >
      <div className="flex flex-col items-center gap-2">{children}</div>
    </Modals>
  );
};

export default ModalComponent;

interface ModalsProps {
  title?: string;
  titleClassName?: string;
  openModal: boolean;
  modalSize: string;
  onClose?: () => void;
  children: ReactNode;
}

const Modals: React.FC<ModalsProps> = ({
  title,
  titleClassName,
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
        // background: "rgba(0, 0, 0, 0.2)",
        padding: "0",
        zIndex: "10000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      className="backdrop-blur-sm"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Fade duration={200}>
        <Modal.Body
          className="overflow-visible bg-transparent"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="w-[90vw] max-w-[28rem] h-fit px-2 sm:px-4 bg-white rounded-md">
            <div className="flex justify-between h-fit py-2 pb-4">
              <Slide duration={500}>
                <Fade duration={1000}>
                  <p
                    className={cn("pl-8 text-[20px] font-bold", titleClassName)}
                  >
                    {title}
                  </p>
                </Fade>
              </Slide>
            {
              onClose ?   <button
              className="hover:bg-[#f9f9f9] rounded-full ring-0"
              onClick={onClose}
            >
              <X />
            </button> : ''
            }
            </div>
            <>{children}</>
          </div>
        </Modal.Body>
      </Fade>
    </Modal>
  );
};
