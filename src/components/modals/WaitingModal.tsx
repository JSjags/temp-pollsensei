import React, { useState, useEffect } from "react";
import { GridLoader } from "react-spinners";
import { Fade } from "react-awesome-reveal";
import { motion, AnimatePresence } from "framer-motion";

interface WaitingMessagesModalProps {
  intervalTime?: number;
  title?: string;
  otherPossibleCondition: boolean;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const messages = [
  "Hold on while we do the hard work for you.",
  "It's taking longer than we expected. Please bear with us.",
  "We understand waiting can be stressful. Hang in there!",
  "Still working on it. Thanks for your patience!",
  "We're doing our best to get your response. Thank you for waiting!",
  "Responses are taking a bit longer. We appreciate your patience!",
];

const WaitingMessagesModal: React.FC<WaitingMessagesModalProps> = ({
  intervalTime = 20000,
  title = "Generating for you",
  otherPossibleCondition,
  openModal,
  setOpenModal,
}) => {
  const [currentMessage, setCurrentMessage] = useState(messages[0]);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (otherPossibleCondition && openModal) {
      interval = setInterval(() => {
        setMessageIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % messages.length;
          setCurrentMessage(messages[nextIndex]);
          return nextIndex;
        });
      }, intervalTime);
    }

    return () => {
      clearInterval(interval);
    };
  }, [otherPossibleCondition, openModal, intervalTime]);

  return (
    <AnimatePresence>
      {openModal && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-[90vw] max-w-lg mx-4 bg-white rounded-xl shadow-2xl p-8"
          >
            <div className="flex flex-col items-center space-y-6">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <GridLoader
                  color="#5903b0"
                  loading
                  margin={4}
                  size={16}
                  speedMultiplier={0.5}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
              >
                <h2 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  {title}
                </h2>

                <Fade delay={1e3} cascade damping={1e-1}>
                  <p className="text-sm md:text-base text-gray-600">
                    {currentMessage}
                  </p>
                </Fade>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WaitingMessagesModal;
