import React, { useState } from "react";
import { updateDescription, updateTopic } from "@/redux/slices/survey.slice";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import { Textarea } from "@/components/ui/shadcn-textarea";
import { Input } from "@/components/ui/shadcn-input";

const ManualSurveyCreatePrompt = () => {
  const [surveyPrompt, setSurveyPrompt] = useState("");
  const [manualSurveyTitle, setManualSurveyTitle] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const maxCharacters = 3000;

  const userToken = useSelector(
    (state: RootState) => state?.user?.access_token || state.user.token
  );
  const user = useSelector((state: RootState) => state?.user?.user);

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
            What's your survey about?
          </h1>
          <p className="text-base md:text-lg text-gray-600 mt-4">
            Provide a suitable title and description for the survey you want to
            create
          </p>
        </motion.div>

        <motion.form
          variants={itemVariants}
          className="flex flex-col w-full max-w-2xl text-start justify-start gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <label className="text-lg font-medium text-gray-700">
            Title
            <Input
              type="text"
              className="rounded-lg py-3 px-4 border-2 w-full !text-sm h-12 border-[#5B03B230] focus:border-[#5B03B2] focus:ring-2 focus:ring-[#5B03B230] transition-all duration-200 resize-none scroll-smooth"
              placeholder="Enter Title of Survey here"
              value={manualSurveyTitle}
              onChange={(e) => setManualSurveyTitle(e.target.value)}
            />
          </label>

          <label className="text-lg font-medium text-gray-700">
            Survey Summary
          </label>
          <div className="flex flex-col gap-2 relative">
            <Textarea
              value={surveyPrompt}
              placeholder="Provide a brief description of the survey"
              className="rounded-lg py-3 px-4 border-2 w-full !text-sm h-40 border-[#5B03B230] focus:border-[#5B03B2] focus:ring-2 focus:ring-[#5B03B230] transition-all duration-200 resize-none scroll-smooth"
              onChange={(e) => {
                if (e.target.value.length === maxCharacters) {
                  toast.warning("Prompt shouldn't exceed 3000 characters");
                }
                setSurveyPrompt(e.target.value);
              }}
              maxLength={maxCharacters}
            />
            <div className="text-sm text-gray-500 text-right">
              {surveyPrompt.length}/{maxCharacters}
            </div>
          </div>

          <Button
            disabled={!surveyPrompt || !manualSurveyTitle}
            className="w-full bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] text-white"
            onClick={() => {
              dispatch(updateTopic(manualSurveyTitle));
              dispatch(updateDescription(surveyPrompt));
              router.push(
                userToken && user
                  ? "/surveys/add-question-m"
                  : "/demo/add-question-m"
              );
            }}
          >
            Continue
          </Button>
        </motion.form>
      </motion.div>
    </AnimatePresence>
  );
};

export default ManualSurveyCreatePrompt;
