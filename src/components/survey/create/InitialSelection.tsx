import React from "react";
import Image from "next/image";
import { chatbot, User_Setting } from "@/assets/images";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { saveGeneratedBy, updateSurveyType } from "@/redux/slices/survey.slice";
import { motion, AnimatePresence } from "framer-motion";
import store, { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

interface InitialSelectionProps {
  selectedDiv: string | null;
  handleDivClick: (userType: string) => void;
  handlePathClick: () => void;
}

const InitialSelection: React.FC<InitialSelectionProps> = ({
  selectedDiv,
  handleDivClick,
  handlePathClick,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.user);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.4,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  const cardHoverVariants = {
    initial: {
      scale: 1,
      boxShadow: "0px 0px 0px rgba(0,0,0,0)",
      transition: {
        type: "spring",
        duration: 0.3,
      },
    },
    hover: {
      scale: 1.02,
      boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="flex flex-col justify-center items-center gap-6 sm:gap-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white pb-10 sm:pb-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        key="initial-selection"
      >
        <motion.h1
          variants={itemVariants}
          className="text-2xl sm:text-3xl md:text-4xl mt-6 sm:mt-10 font-bold bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] bg-clip-text text-transparent text-center px-4"
        >
          Hello, there! What do you want to do?
        </motion.h1>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full max-w-4xl"
        >
          {[
            {
              icon: chatbot,
              title: "Generate with AI",
              description:
                "Give us a prompt and our AI will do the hard work for you. We will create a survey tailored for your needs",
              onClick: () => {
                handleDivClick("1");
                dispatch(saveGeneratedBy("ai"));
              },
              buttonAction: handlePathClick,
              isSelected: selectedDiv === "1",
            },
            {
              icon: User_Setting,
              title: "Create Manually",
              description:
                "Create your own survey on a blank canvas and customize it according to your taste.",
              onClick: () => {
                handleDivClick("2");
                dispatch(saveGeneratedBy("manually"));
                dispatch(updateSurveyType("Both"));
              },
              buttonAction: () =>
                router.push(
                  user ? "/surveys/create-manual" : "/demo/create-manual"
                ),
              isSelected: selectedDiv === "2",
            },
          ].map((card, index) => (
            <motion.div
              key={index}
              variants={cardHoverVariants}
              initial="initial"
              whileHover="hover"
              className={`flex flex-col items-center p-4 sm:p-8 rounded-xl border-2 cursor-pointer transition-all duration-300 relative bg-white h-full ${
                card.isSelected
                  ? "border-[#5B03B2] bg-purple-50 shadow-lg transform scale-[1.02]"
                  : "border-purple-100"
              }`}
              onClick={card.onClick}
            >
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: card.isSelected ? 1 : 0,
                  opacity: card.isSelected ? 1 : 0,
                }}
                transition={{ duration: 0.3, type: "spring", damping: 20 }}
                className="absolute -top-2 -right-2 bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] rounded-full p-2"
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>
              <Image
                src={card.icon}
                alt={card.title}
                className="h-12 sm:h-16 w-auto mb-4 sm:mb-6"
              />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 text-center">
                {card.title}
              </h2>
              <p className="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6 flex-grow">
                {card.description}
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className={`group relative py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-300 w-full ${
                  card.isSelected ? "visible" : "invisible"
                }`}
                onClick={card.buttonAction}
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] rounded-lg opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 text-white text-sm sm:text-base">
                  Proceed
                </span>
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InitialSelection;
