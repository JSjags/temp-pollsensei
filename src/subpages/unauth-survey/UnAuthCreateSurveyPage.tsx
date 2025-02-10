"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  chatbot,
  qualitative_survey,
  quantitative_qualitative_survey,
  Quantitative_survey,
  stars,
  tooltip_icon,
  User_Setting,
} from "@/assets/images";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Tooltip } from "flowbite-react";
import {
  useCreateAiSurveyMutation,
  useGenerateTopicsMutation,
} from "@/services/survey.service";
import { toast } from "react-toastify";
import IsLoadingModal from "@/components/modals/IsLoadingModal";
import GeneratedSurvey from "../survey/GeneratedSurvey";
import IsGenerating from "@/components/modals/IsGenerating";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  addSection,
  resetSurvey,
  saveGeneratedBy,
  updateConversationId,
  updateDescription,
  updateSurveyType,
  updateTopic,
} from "@/redux/slices/survey.slice";
import store from "@/redux/store";
import Milestones from "@/components/survey/Milestones";
import { AnimatePresence, motion } from "framer-motion";
import SenseiMaster from "@/components/sensei-master/SenseiMaster";
import { resetQuestion } from "@/redux/slices/questions.slice";
import InitialSelection from "@/components/survey/create/InitialSelection";
import SurveyTypeSelection from "@/components/survey/create/SurveyTypeSelection";
import PromptForm from "@/components/survey/create/PromptForm";
import TopicSelectionModal from "@/components/survey/create/TopicSelectionModal";

// Springy Animation Variants for the mascot
const mascotVariants = {
  hidden: { opacity: 0, scale: 0.3, y: 0 }, // Start small and slightly off-screen
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring", // Springy effect
      stiffness: 300, // Controls the "bounciness"
      damping: 20, // Controls how fast the spring comes to rest
      duration: 0.8, // Duration of the animation
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 0, // Exit with downward movement
    transition: {
      duration: 0.3, // Slightly faster exit
    },
  },
};

const UnAuthCreateSurveyPage = () => {
  const [selectedDiv, setSelectedDiv] = useState<string | null>(null);
  const [selectedSurveyType, setSelectedSurveyType] = useState("");
  const [isSelected, setIsSelected] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [manualTopic, setManualTopic] = useState("");
  const generated_by = useSelector(
    (state: RootState) => state.survey.generated_by
  );
  const dispatch = useDispatch();
  const [createAiSurvey, { data, isLoading, isSuccess }] =
    useCreateAiSurveyMutation();
  const [
    generateTopics,
    {
      data: topics,
      isLoading: isLoadingTopics,
      isSuccess: isTopicSuccess,
      isError: isTopicError,
      error: topicError,
    },
  ] = useGenerateTopicsMutation();

  // Get all URL params
  const params = new URLSearchParams(searchParams.toString());

  // Helper function to update URL params
  const updateURLParams = (updates: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    router.push(`${pathname}?${newParams.toString()}`);
  };

  // Get states from URL with fallbacks
  const whatDoYouWant =
    params.get("whatDoYouWant") === "true" ||
    (!params.has("oneMoreThing") &&
      !params.has("promptForm") &&
      !params.has("isTopicModal"));
  const oneMoreThing = params.get("oneMoreThing") === "true" || false;
  const promptForm = params.get("promptForm") === "true" || false;
  const isTopicModal = params.get("isTopicModal") === "true" || false;
  const generated = params.get("generated") === "true" || false;
  const surveyType = params.get("surveyType") || "";
  const surveyPrompt = params.get("surveyPrompt") || "";

  const handleDivClick = (userType: string) => {
    setSelectedDiv(userType);
  };

  const maxCharacters = 3000;
  console.log(data);

  const handleSurveyType = (userType: string, prompt: string) => {
    setSelectedDiv(userType);
    setSelectedSurveyType(prompt);
    updateURLParams({ surveyType: prompt });
  };

  const handlePathClick = () => {
    if (selectedDiv) {
      updateURLParams({
        whatDoYouWant: "false",
        oneMoreThing: "true",
      });
    }
  };

  const handleGenerateTopics = async () => {
    try {
      await generateTopics({
        user_query: surveyPrompt,
      });
      updateURLParams({ isTopicModal: "true", promptForm: "false" });
    } catch (e) {
      toast.error("Failed to create survey");
      console.error(e);
    }
  };

  const handleGenerateQuestion = async () => {
    try {
      if (manualTopic) {
        dispatch(updateTopic(manualTopic));
      }

      await createAiSurvey({
        user_query: surveyPrompt,
        survey_type: selectedSurveyType,
      });
    } catch (e) {
      toast.error("Failed to create survey");
      console.error(e);
    }
  };

  const handlePromptChange = (value: string) => {
    if (value.length === maxCharacters) {
      toast.warning("Prompt shouldn't exceed 3000 characters");
    }
    updateURLParams({ surveyPrompt: value });
  };

  const UseAnotherPrompt = () => {
    updateURLParams({
      generated: "false",
      promptForm: "true",
    });
  };

  const survey = store.getState().survey;
  console.log(survey);
  console.log(data);
  console.log(survey.sections);

  useEffect(() => {
    dispatch(resetQuestion());
    dispatch(resetSurvey());
  }, []);

  useEffect(() => {
    if (isTopicSuccess) {
      toast.success("Survey topic created successfully");
      updateURLParams({
        isTopicModal: "true",
        promptForm: "false",
      });
    }
    if (isTopicError || topicError) {
      toast.error("Failed to generate survey topic");
    }
  }, [isTopicSuccess, isTopicError, topicError]);

  useEffect(() => {
    if (isSuccess) {
      const refactoredQuestions = (data as any)?.data?.response?.map(
        (question: any) => {
          const optionType = question["Option type"]?.trim();
          if (optionType === "matrix_multiple_choice") {
            return {
              question: question.Question,
              rows: question.Options.Rows,
              columns: question.Options.Columns,
              question_type: optionType === null ? optionType : "",
              is_required: true,
              description: "",
            };
          }
          if (optionType === "long_text" || optionType === "short_text") {
            return {
              question: question.Question,
              options: "",
              question_type: optionType || "",
              is_required: true,
              description: "",
            };
          }
          if (optionType === "boolean") {
            return {
              question: question.Question,
              options: ["Yes", "No"],
              question_type: optionType || "",
              is_required: true,
              description: "",
            };
          }
          if (optionType === "number") {
            return {
              question: question.Question,
              options: "",
              min: 1,
              max: 10000000,
              question_type: optionType || "",
              is_required: true,
              description: "",
            };
          }
          if (optionType === "slider") {
            return {
              question: question.Question,
              options: "",
              min: question.Options.Min,
              max: question.Options.Max,
              step: question.Options.Step,
              question_type: optionType || "",
              is_required: true,
              description: "",
            };
          }
          return {
            question: question.Question,
            options: question.Options,
            question_type: optionType || "",
            is_required: true,
            description: "",
          };
        }
      );
      dispatch(addSection({ questions: refactoredQuestions }));
      dispatch(updateConversationId((data as any)?.data?.conversation_id));
      dispatch(
        updateDescription((data as any)?.data?.description || surveyPrompt)
      );
      toast.success("Survey created successfully");
      updateURLParams({
        generated: "true",
        promptForm: "false",
      });
    }
  }, [data, isSuccess, surveyPrompt, dispatch]);

  return (
    <div className="flex flex-col justify-center items-center min-h-[80vh] px-5 text-center bg-white">
      <AnimatePresence mode="wait">
        {whatDoYouWant && (
          <InitialSelection
            selectedDiv={selectedDiv}
            handleDivClick={handleDivClick}
            handlePathClick={handlePathClick}
          />
        )}

        {oneMoreThing && (
          <SurveyTypeSelection
            selectedDiv={Number(selectedDiv)}
            handleSurveyType={(userType: string, prompt: string) =>
              handleSurveyType(userType, prompt)
            }
            generated_by={generated_by || ""}
            updateURLParams={updateURLParams}
          />
        )}

        {promptForm && (
          <PromptForm
            surveyPrompt={surveyPrompt}
            handlePromptChange={handlePromptChange}
            handleGenerateTopics={handleGenerateTopics}
            manualTopic={manualTopic}
            setManualTopic={setManualTopic}
          />
        )}

        {isTopicModal && (
          <TopicSelectionModal
            topics={topics}
            isSelected={isSelected}
            setIsSelected={setIsSelected}
            manualTopic={manualTopic}
            setManualTopic={setManualTopic}
            surveyPrompt={surveyPrompt}
            surveyType={surveyType}
            isLoading={isLoading}
            handleGenerateQuestion={handleGenerateQuestion}
            updateURLParams={updateURLParams}
          />
        )}

        {isLoadingTopics && (
          <IsGenerating
            isGeneratingSurveyLoading={isLoadingTopics}
            what="Topics"
          />
        )}

        {isLoading && (
          <IsGenerating
            isGeneratingSurveyLoading={isLoading}
            what="Questions"
          />
        )}

        {generated && (
          <GeneratedSurvey data={survey?.sections} onClick={UseAnotherPrompt} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default UnAuthCreateSurveyPage;

// optionType === "Multi-choice"
//   ? "multiple_choice"
//   :
// optionType === "Dropdown"
// ? "drop_down"
// :
// optionType === "likert_scale"
// ? "likert_scale"
// :
// optionType === "Slider"
// ? "slider"
// :
// optionType === "Star Rating"
// ? "star_rating"
// :
// optionType === "Multiple Choice"
// ? "multiple_choice"
// :
// optionType === "Single Choice"
// ? "single_choice"
// :
// optionType === "Checkbox"
// ? "checkbox"
// :
// optionType === "Rating Scale"
// ? "rating_scale"
// :
// optionType === "Comment"
// ? "long_text"
// :
// optionType === "Boolean"
// ? "boolean"
// :
// optionType === "Matrix"
// ? "matrix_checkbox"
// : "matrix_checkbox"
// ,
