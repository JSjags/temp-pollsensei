import React from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion"; // Added AnimatePresence
import { CheckCircle2 } from "lucide-react";
import {
  qualitative_survey,
  quantitative_qualitative_survey,
  Quantitative_survey,
  tooltip_icon,
} from "@/assets/images";
import { updateSurveyType } from "@/redux/slices/survey.slice";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SurveyTypeSelectionProps {
  selectedDiv: number | null;
  handleSurveyType: (userType: string, prompt: string) => void;
  generated_by: string;
  updateURLParams: (updates: Record<string, string>) => void;
}

const SurveyTypeSelection: React.FC<SurveyTypeSelectionProps> = ({
  selectedDiv,
  handleSurveyType,
  generated_by,
  updateURLParams,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const surveyTypes = searchParams.get("surveyType")?.split(",") || [];

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

  const cardHoverVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.02 },
  };

  const handleProceed = (surveyType: string) => {
    const updatedTypes = surveyTypes.includes(surveyType)
      ? surveyTypes.filter((type) => type !== surveyType)
      : [...surveyTypes, surveyType];

    dispatch(updateSurveyType(updatedTypes.join(",")));
    updateURLParams({
      whatDoYouWant: "false",
      oneMoreThing: "false",
      promptForm: generated_by === "ai" ? "true" : "false",
      surveyType: updatedTypes.join(","),
    });
    if (generated_by !== "ai") {
      router.push("/surveys/create-manual");
    }
  };

  const isSelected = (type: string) => {
    return surveyTypes.includes(type);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="flex flex-col justify-center items-center gap-4 md:gap-6 lg:gap-10 w-full max-w-7xl mx-0 px-0 md:px-4 lg:px-8 bg-white pb-6 md:pb-10 lg:pb-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        key="survey-type-selection"
      >
        <motion.div
          variants={containerVariants}
          className="text-center w-full px-3 md:px-4 mt-4 md:mt-6 lg:mt-10"
        >
          <h1 className="text-xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] bg-clip-text text-transparent">
            Okay! One more thing.
          </h1>
          <p className="text-sm md:text-lg lg:text-xl text-gray-600 mt-2 font-normal">
            Tell us the type of survey you want to create
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full px-0 md:px-4"
        >
          {[
            {
              type: "Qualitative",
              id: 3,
              icon: qualitative_survey,
              iconSize: "h-12 md:h-16 lg:h-20",
              description:
                "Focus on open-ended questions to gather detailed insights and rich feedback from your respondents",
              tooltip:
                "Perfect for open-ended questions and gathering detailed feedback. Ideal for customer interviews, user research, and understanding the 'why' behind responses.",
            },
            {
              type: "Both",
              id: 5,
              icon: quantitative_qualitative_survey,
              iconSize: "h-12 md:h-16 lg:h-20", // Added iconSize to match others
              description:
                "Combine numerical data with detailed insights for a comprehensive understanding of your research topic",
              badge: "Not sure ?",
              tooltip:
                "Get the best of both worlds - collect numerical data while also gathering detailed insights. Great for comprehensive research studies and in-depth market analysis.",
            },
            {
              type: "Quantitative",
              id: 4,
              icon: Quantitative_survey,
              iconSize: "h-12 md:h-16 lg:h-20",
              description:
                "Collect numerical data through structured questions like ratings, scales, and multiple choice",
              tooltip:
                "Best for collecting numerical data and statistics. Perfect for satisfaction scores, ratings, and measuring specific metrics.",
            },
          ].map((item) => (
            <motion.div
              key={item.id}
              variants={cardHoverVariants}
              initial="initial"
              whileHover="hover"
              className={cn(
                "flex flex-col items-center p-3 md:p-4 lg:p-8 rounded-xl border-2 cursor-pointer transition-all duration-300 relative bg-white min-h-[200px] md:min-h-[450px] lg:min-h-[400px]",
                isSelected(item.type)
                  ? "border-[#5B03B2] bg-purple-50 shadow-lg transform scale-[1.02]"
                  : "border-purple-100"
              )}
              onClick={() => handleSurveyType(item.id.toString(), item.type)}
            >
              {item.badge && (
                <div className="bg-[#F70A0A] text-white py-1 md:py-2 absolute -top-2 -left-2 rounded-lg px-2 md:px-4 shadow-lg transform -rotate-3 text-sm md:text-base lg:text-lg">
                  {item.badge}
                </div>
              )}

              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: isSelected(item.type) ? 1 : 0,
                  opacity: isSelected(item.type) ? 1 : 0,
                }}
                transition={{ duration: 0.3, type: "spring", damping: 20 }}
                className="absolute -top-2 -right-2 bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] rounded-full p-1.5 md:p-2"
              >
                <CheckCircle2
                  className="w-3 h-3 md:w-4 md:h-4 text-white"
                  strokeWidth={2.5}
                />
              </motion.div>

              <Image
                src={item.icon}
                alt={`${item.type} Icon`}
                className={`${item.iconSize} w-auto mb-3 md:mb-4 lg:mb-6`}
              />
              <h2 className="text-base md:text-lg lg:text-xl font-semibold text-gray-800 mb-2 md:mb-3 text-center">
                {item.type}
              </h2>
              <p className="text-xs md:text-sm lg:text-base text-gray-600 text-center mb-3 md:mb-4 lg:mb-6 flex-grow">
                {item.description}
              </p>

              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex justify-center items-center mb-2">
                      <Image
                        src={tooltip_icon}
                        alt="Info"
                        className={cn(
                          "h-6 md:h-8 w-auto transition-all duration-300 cursor-pointer hover:brightness-110 invert",
                          isSelected(item.type)
                            ? "opacity-100"
                            : "opacity-0 hidden"
                        )}
                        style={{
                          filter:
                            "drop-shadow(0 4px 6px rgba(91, 3, 178, 0.2))",
                        }}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="w-[16rem] md:w-[20rem] bg-white p-2 md:p-3 shadow-lg rounded-lg border border-gray-200"
                  >
                    <p className="text-xs md:text-sm text-gray-700">
                      {item.tooltip}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className={`group relative py-2 md:py-2.5 lg:py-3 px-3 md:px-4 lg:px-6 rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-300 w-full mt-auto ${
                  isSelected(item.type) ? "visible" : "invisible"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleProceed(item.type);
                }}
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] rounded-lg opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 text-white text-xs md:text-sm lg:text-base">
                  {surveyTypes.includes(item.type) ? "Proceed" : "Proceed"}
                </span>
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SurveyTypeSelection;
