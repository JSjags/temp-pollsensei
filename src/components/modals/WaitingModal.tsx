import React, { useState, useEffect } from "react";
import ModalComponent from "../ui/ModalComponent";
import { Fade } from "react-awesome-reveal";
import { GridLoader } from "react-spinners";

interface WaitingMessagesModalProps {
  intervalTime?: number; // Time interval in milliseconds
  title?: string; // Title of the modal
  otherPossibleCondition: boolean; // Additional condition to trigger the modal
  openModal: boolean; // State to control the modal open/close
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>; // Function to control modal state
}

const messages = [
  "It's taking longer than we expected. Please bear with us.",
  "We understand waiting can be stressful. Hang in there!",
  "Still working on it. Thanks for your patience!",
  "We’re doing our best to get your response. Thank you for waiting!",
  "Responses are taking a bit longer. We appreciate your patience!",
];

const WaitingMessagesModal: React.FC<WaitingMessagesModalProps> = ({
  intervalTime = 30000, 
  title = "",
  otherPossibleCondition, 
  openModal, 
  setOpenModal, 
}) => {
  const [currentMessage, setCurrentMessage] = useState(messages[0]);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (otherPossibleCondition) {
      const interval = setInterval(() => {
        setOpenModal(true);
       
        setCurrentMessage(messages[messageIndex]);
        setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length); 
      }, intervalTime); 

      return () => clearInterval(interval);
    }
  }, [messageIndex, messages, intervalTime, otherPossibleCondition]);

  return (
    <>
      {openModal && (
        <ModalComponent title={title} openModal={openModal}>
          <div className="flex flex-col w-full gap-4 px-4">
            <div className="text-center">
              <GridLoader
                color="#5903b0"
                loading
                margin={4}
                size={20}
                speedMultiplier={1}
                className=" mx-auto"
              />
            </div>
            <Fade delay={1e3} cascade damping={1e-1}>
              {currentMessage}
            </Fade>

            <button
              className="bg-gradient-to-r from-[#5b03b2] to-[#9d50bb] rounded-lg px-8 py-2 text-white text-[16px] font-medium leading-6 text-center font-inter justify-center border-none"
              onClick={() => setOpenModal(false)} // Close modal button
            >
              Close
            </button>
          </div>
        </ModalComponent>
      )}
    </>
  );
};

export default WaitingMessagesModal;
