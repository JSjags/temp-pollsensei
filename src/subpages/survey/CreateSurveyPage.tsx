"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { stars } from "@/assets/images";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  useCreateAiSurveyMutation,
  useGenerateTopicsMutation,
} from "@/services/survey.service";
import { toast } from "react-toastify";
import IsLoadingModal from "@/components/modals/IsLoadingModal";
import GeneratedSurvey from "./GeneratedSurvey";
import IsGenerating from "@/components/modals/IsGenerating";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  addSection,
  resetSurvey,
  updateConversationId,
  updateDescription,
  updateTopic,
} from "@/redux/slices/survey.slice";
import store from "@/redux/store";
import { resetQuestion } from "@/redux/slices/questions.slice";
import InitialSelection from "@/components/survey/create/InitialSelection";
import SurveyTypeSelection from "@/components/survey/create/SurveyTypeSelection";
import PromptForm from "@/components/survey/create/PromptForm";
import { AnimatePresence } from "framer-motion";
import TopicSelectionModal from "@/components/survey/create/TopicSelectionModal";

// Springy Animation Variants for the mascot
const mascotVariants = {
  hidden: { opacity: 0, scale: 0.3, y: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
      duration: 0.8,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
};

const CreateSurveyPage: React.FC = () => {
  const [selectedDiv, setSelectedDiv] = useState<string | null>(null);
  const [selectedSurveyType, setSelectedSurveyType] = useState("");
  const [isSelected, setIsSelected] = useState<number | null>(null);
  const [manualTopic, setManualTopic] = useState("");

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const generated_by = useSelector(
    (state: RootState) => state.survey.generated_by
  );

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

  // Get states from URL with fallbacks to previous states
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

  const [createAiSurvey, { data, isLoading, isSuccess }] =
    useCreateAiSurveyMutation();
  const [
    generateTopics,
    {
      data: topics,
      isLoading: isLoadingTopics,
      isSuccess: isTopicSuccess,
      isError: isTpoicError,
      error: topicError,
    },
  ] = useGenerateTopicsMutation();

  const maxCharacters = 3000;

  const handleDivClick = (userType: string) => {
    setSelectedDiv(userType);
  };

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

  useEffect(() => {
    if (isTopicSuccess) {
      toast.success("Survey topic created successfully");
      updateURLParams({
        isTopicModal: "true",
        promptForm: "false",
      });
    }
    if (isTpoicError || topicError) {
      toast.error("Failed to generate survey topic");
    }
  }, [isTopicSuccess, isTpoicError, topicError]);

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

  useEffect(() => {
    dispatch(resetQuestion());
    dispatch(resetSurvey());
  }, []);

  const survey = store.getState().survey;

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

export default CreateSurveyPage;
