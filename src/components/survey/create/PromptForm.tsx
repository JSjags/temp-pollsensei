import React, { useState, useCallback } from "react";
import Image from "next/image";
import { stars } from "@/assets/images";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateTopic } from "@/redux/slices/survey.slice";
import { motion, AnimatePresence } from "framer-motion";
import TextArea from "@/components/ui/TextArea";
import { Textarea } from "@/components/ui/shadcn-textarea";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { debounce } from "lodash";

interface PromptFormProps {
  surveyPrompt: string;
  handlePromptChange: (value: string) => void;
  handleGenerateTopics: () => Promise<void>;
  manualTopic: string;
  setManualTopic: (value: string) => void;
}

const PromptForm: React.FC<PromptFormProps> = ({
  surveyPrompt,
  handlePromptChange,
  handleGenerateTopics,
  manualTopic,
  setManualTopic,
}) => {
  const dispatch = useDispatch();
  const maxCharacters = 3000;
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [localPrompt, setLocalPrompt] = useState(surveyPrompt);

  // Debounced handler for prompt changes
  const debouncedHandlePromptChange = useCallback(
    debounce((value: string) => {
      handlePromptChange(value);
    }, 300),
    []
  );

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length === maxCharacters) {
      toast.warning("Prompt shouldn't exceed 3000 characters");
    }
    setLocalPrompt(value);
    debouncedHandlePromptChange(value);
  };

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
    hover: {
      scale: 1.02,
      boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
      transition: {
        type: "spring",
        stiffness: 300,
      },
    },
  };

  const handleCardClick = (index: number, prompt: string) => {
    if (selectedCard === index) {
      setSelectedCard(null);
      setLocalPrompt("");
      handlePromptChange("");
    } else {
      setSelectedCard(index);
      setLocalPrompt(prompt);
      handlePromptChange(prompt);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="flex flex-col justify-center items-center gap-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white pb-20 scroll-smooth"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div variants={itemVariants} className="text-center">
          <h1 className="text-3xl md:text-4xl mt-10 md:mt-10 font-bold bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] bg-clip-text text-transparent">
            Write a prompt. we'll do the rest for you
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mt-4">
            Tell us the survey you want to make? We will create it for you
          </p>
        </motion.div>

        <motion.form
          variants={itemVariants}
          className="flex flex-col w-full max-w-2xl text-start justify-start gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (manualTopic.trim()) {
              dispatch(updateTopic(manualTopic));
            }
            handleGenerateTopics();
          }}
        >
          <label
            className="text-lg font-medium text-gray-700"
            htmlFor="Your Prompt"
          >
            Your Prompt
          </label>
          <div className="flex flex-col gap-2 relative">
            <Textarea
              value={localPrompt}
              placeholder="Write your prompt"
              className="rounded-lg py-3 px-4 border-2 w-full !text-sm h-40 border-[#5B03B230] focus:border-[#5B03B2] focus:ring-2 focus:ring-[#5B03B230] transition-all duration-200 resize-none scroll-smooth"
              onChange={handleTextAreaChange}
              maxLength={maxCharacters}
            />
            <div className="text-sm text-gray-500 text-right">
              {localPrompt.length}/{maxCharacters}
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`group relative py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-200 overflow-hidden w-full ${
              !localPrompt ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!localPrompt}
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 w-full h-full border-2 border-[#5B03B2] rounded-lg"></div>
            <span className="relative z-10 text-[#5B03B2] group-hover:text-white transition-colors duration-300">
              Generate
            </span>
            <Image
              src={stars}
              alt="stars"
              className="w-5 h-5 relative z-10 brightness-0 group-hover:brightness-200 transition-all duration-300"
            />
          </motion.button>
        </motion.form>

        <motion.div variants={itemVariants} className="text-center w-full">
          <h2 className="text-2xl font-bold text-gray-800 mt-10">
            Try our Sample prompts
          </h2>
          <p className="text-gray-600">
            Select one of our Pre-generated AI surveys
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[
              {
                title: "Student Satisfaction Survey",
                description:
                  "Assess learning experiences, teaching quality, and academic support, helping educational institutions improve student outcomes.",
                prompt:
                  "I am working on a survey to evaluate student satisfaction within our school. The survey should cover areas like teaching quality, course content, learning resources, academic support services, campus facilities, and overall student experience. We want to understand what's working well and identify areas for improvement. Please include questions about classroom engagement, faculty accessibility, quality of study materials, availability of academic resources, and suggestions for enhancing the learning environment. The feedback will help us make data-driven decisions to enhance educational quality.",
              },
              {
                title: "Employee Engagement Survey",
                description:
                  "Measure staff satisfaction, motivation, and workplace culture, helping organizations improve internal dynamics.",
                prompt:
                  "Our organisation is conducting a survey to evaluate employee engagement and workplace satisfaction. We need comprehensive feedback on work-life balance, career development opportunities, leadership effectiveness, team collaboration, and company culture. Include questions about job satisfaction, professional growth, relationship with managers, workplace communication, recognition programs, and overall organizational alignment. The insights will help us create a more positive and productive work environment.",
              },
              {
                title: "Event Feedback Survey",
                description:
                  "Evaluate the success of events, conferences, or meetings, gathering input on content, organization, and overall experience.",
                prompt:
                  "This survey aims to gather feedback across several key aspects of our recent event, including session content quality, speaker effectiveness, event organization, venue facilities, and networking opportunities. We want to understand attendee satisfaction with the registration process, schedule management, technical arrangements, catering services, and overall event value. Please include questions about presentation relevance, interaction opportunities, venue accessibility, and suggestions for future improvements.",
              },
            ].map((card, index) => (
              <motion.div
                key={index}
                variants={cardHoverVariants}
                whileHover="hover"
                className={cn(
                  "bg-white p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 relative",
                  selectedCard === index
                    ? "border-[#5B03B2] bg-purple-50 shadow-lg transform scale-[1.02]"
                    : "border-purple-100 hover:border-purple-200"
                )}
                onClick={() => handleCardClick(index, card.prompt)}
              >
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: selectedCard === index ? 1 : 0,
                    opacity: selectedCard === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, type: "spring" }}
                  className="absolute -top-2 -right-2  bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] rounded-full p-2"
                >
                  <CheckCircle2
                    className="w-4 h-4 text-white"
                    strokeWidth={2.5}
                  />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {card.title}
                </h3>
                <p className="text-gray-600 text-sm">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PromptForm;
