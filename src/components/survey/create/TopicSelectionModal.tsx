import React from "react";
import Image from "next/image";
import { stars } from "@/assets/images";
import { useDispatch } from "react-redux";
import { updateTopic } from "@/redux/slices/survey.slice";
import { motion, AnimatePresence } from "framer-motion";
import { Fade } from "react-awesome-reveal";
import { Input } from "@/components/ui/shadcn-input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface TopicSelectionModalProps {
  topics: any;
  isSelected: number | null;
  setIsSelected: (index: number) => void;
  manualTopic: string;
  setManualTopic: (topic: string) => void;
  surveyPrompt: string;
  surveyType: string;
  isLoading: boolean;
  handleGenerateQuestion: () => void;
  updateURLParams: (params: Record<string, string>) => void;
}

const TopicSelectionModal: React.FC<TopicSelectionModalProps> = ({
  topics,
  isSelected,
  setIsSelected,
  manualTopic,
  setManualTopic,
  surveyPrompt,
  surveyType,
  isLoading,
  handleGenerateQuestion,
  updateURLParams,
}) => {
  const dispatch = useDispatch();

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-[90vw] max-w-xl mx-4 rounded-xl bg-white shadow-2xl"
      >
        <div className="flex flex-col gap-6 p-6 md:p-8">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-center space-y-2"
          >
            <Fade cascade damping={0.1}>
              <h2 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] bg-clip-text text-transparent">
                Set Survey Topic and Continue
              </h2>
              <p className="text-sm md:text-base text-gray-600">
                We have recommended suitable topics for your survey based on
                your entered prompt
              </p>
            </Fade>
          </motion.div>

          <ScrollArea className="h-[40vh] w-full rounded-md overflow-y-auto">
            <div className="space-y-3 pr-4 pt-4">
              <AnimatePresence>
                {topics?.data.topics.map((topic: string[], index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => {
                      dispatch(updateTopic(topic.toString()));
                      setIsSelected(index);
                    }}
                    className={`flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 relative bg-white h-full ${
                      isSelected === index
                        ? "border-[#5B03B2] bg-purple-50 shadow-lg transform scale-[1.02]"
                        : "border-purple-100"
                    }`}
                  >
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: isSelected === index ? 1 : 0,
                        opacity: isSelected === index ? 1 : 0,
                      }}
                      transition={{
                        duration: 0.3,
                        type: "spring",
                        damping: 20,
                      }}
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
                    <p className="text-base md:text-base text-gray-600">
                      {topic}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateURLParams({ isTopicModal: "false" });
              handleGenerateQuestion();
            }}
            className="space-y-4 mt-2"
          >
            <div className="space-y-2">
              <label
                htmlFor="manual-topic"
                className="text-sm font-medium text-gray-700"
              >
                Or manually enter your preferred topic:
              </label>
              <Input
                id="manual-topic"
                value={manualTopic}
                onChange={(e) => setManualTopic(e.target.value)}
                type="text"
                placeholder="Input your survey topic"
                className="w-full px-4 py-3 h-12 border-2 border-[#5B03B230] rounded-lg focus:ring-2 focus:ring-[#5B03B230] focus:border-[#5B03B2] transition duration-200 ease-in-out"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!surveyPrompt && !surveyType}
              className={`
                group relative w-full flex items-center justify-center gap-2 
                px-6 py-3 rounded-lg text-base font-medium
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                ${!surveyPrompt && !surveyType ? "opacity-50" : ""}
              `}
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
              <div className="absolute inset-0 w-full h-full border-2 border-[#5B03B2] rounded-lg"></div>
              <span className="relative z-10 text-[#5B03B2] group-hover:text-white transition-colors duration-300">
                {isLoading ? "Generating..." : "Generate Survey"}
              </span>
              <Image
                src={stars}
                alt="stars"
                className="w-5 h-5 relative z-10 brightness-0 group-hover:brightness-200 transition-all duration-300"
              />
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default TopicSelectionModal;
