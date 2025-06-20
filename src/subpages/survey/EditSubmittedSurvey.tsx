import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import StyleEditor from "./StyleEditor";
import QuestionType from "./QuestionType";
import Image from "next/image";
import { pollsensei_new_logo, sparkly } from "@/assets/images";

// import MultiChoiceQuestionEdit from "../milestone/Test";
import MatrixQuestionEdit from "@/components/survey/MatrixQuestionEdit";
import {
  useEditSurveyMutation,
  useFetchASurveyQuery,
} from "@/services/survey.service";
import MultiChoiceQuestion from "@/components/survey/MultiChoiceQuestion";
import CommentQuestion from "@/components/survey/CommentQuestion";
import LinearScaleQuestion from "@/components/survey/LinearScaleQuestion";
import LikertScaleQuestion from "@/components/survey/LikertScaleQuestion";
import StarRatingQuestion from "@/components/survey/StarRatingQuestion";
import MatrixQuestion from "@/components/survey/MatrixQuestion";
import SingleChoiceQuestion from "@/components/survey/SingleChoiceQuestion";
import CheckboxQuestion from "@/components/survey/CheckboxQuestion";
import RatingScaleQuestion from "@/components/survey/RatingScaleQuestion";
import DropdownQuestion from "@/components/survey/DropdownQuestion";
import NumberQuestion from "@/components/survey/NumberQuestion";
import ShortTextQuestion from "@/components/survey/LongTextQuestion";
import BooleanQuestion from "@/components/survey/BooleanQuestion";
import SliderQuestion from "@/components/survey/SliderQuestion";
import MultiChoiceQuestionEdit from "@/components/survey/MultiChoiceQuestionEdit";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import WatermarkBanner from "@/components/common/WatermarkBanner";
import { BsExclamation } from "react-icons/bs";
import { cn, extractMongoId } from "@/lib/utils";
import axiosInstance from "@/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { getSurveyResponses } from "@/services/analysis";
import { Plus, Sheet, TableRowsSplit } from "lucide-react";
import PaginationBtn from "@/components/common/PaginationBtn";
import { RxCardStack } from "react-icons/rx";
import { Trash2 } from "lucide-react";
import SurveyHeader from "@/components/survey/SurveyHeader";

interface Question {
  question: string;
  question_type: string;
  options?: string[];
  rows?: string[];
  columns?: string[];
  is_required?: boolean;
}

interface Section {
  section_topic?: string;
  section_description?: string;
  questions: Question[];
  header_text?: { name: string; size: number };
  body_text?: { name: string; size: number };
}

export interface SurveyData {
  topic: string;
  description: string;
  sections: Section[];
  theme: string;
  header_text: { name: string; size: number };
  question_text: { name: string; size: number };
  body_text: { name: string; size: number };
  color_theme: string;
  logo_url: string;
  header_url: string;
}

// Animation variants for direction-aware slide
const sectionVariants = {
  enter: (direction: number) => ({
    x: direction === 1 ? 100 : -100,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction === 1 ? -100 : 100,
    opacity: 0,
  }),
};

const EditSubmittedSurvey = () => {
  const path = usePathname();
  const params = useParams();
  const router = useRouter();
  const {
    data,
    isLoading,
    refetch,
    isSuccess: isSurveySuccess,
  } = useQuery({
    queryKey: ["survey", params.id],
    queryFn: () => axiosInstance.get(`/survey/${params.id}`),
  });
  const [isEdit, setIsEdit] = useState(false);
  const [isEditHeader, setIsEditHeader] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editSurvey, { isSuccess, isError, error, isLoading: isEditLoading }] =
    useEditSurveyMutation();
  const [isSidebar, setIsSidebarOpen] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);
  const [isHeaderEditing, setIsHeaderEditing] = useState(false);
  const [direction, setDirection] = useState(0);

  console.log(data);
  console.log(params.id);
  const [surveyData, setSurveyData] = useState<SurveyData>({
    topic: "",
    description: "",
    sections: [],
    theme: "",
    header_text: { name: "", size: 24 },
    question_text: { name: "", size: 18 },
    body_text: { name: "", size: 16 },
    color_theme: "#000000",
    logo_url: "#ffffff",
    header_url: "#ffffff",
  });
  const questions = surveyData?.sections;
  console.log(questions);
  console.log(surveyData);

  const EditQuestion = (index: any) => {
    setEditIndex(index);
    setIsEdit(true);
    // setIsSidebarOpen(false);
    // setAiChatbot(true);
    console.log(index);
    // setSelectIndex(index);
  };

  const surveyId = extractMongoId(path);

  // Initialize useQuery hook unconditionally
  const surveyResponses = useQuery({
    queryKey: [`get-survey-responses-${surveyId}`],
    queryFn: () => getSurveyResponses({ surveyId: surveyId! }),
    enabled: surveyId !== undefined,
  });

  console.log(surveyResponses.data);

  const handleDeleteQuestion = (questionIndex: number) => {
    setSurveyData((prevData) => {
      // Create deep copies to avoid mutating the state directly
      const updatedSections = prevData.sections.map((section, idx) => {
        if (idx === currentSection) {
          return {
            ...section,
            questions: section.questions.filter(
              (_, qIdx) => qIdx !== questionIndex
            ),
          };
        }
        return section;
      });

      return { ...prevData, sections: updatedSections };
    });
  };

  const handleCancel = () => {
    setEditIndex(null);
    setIsEdit(false);
    setIsSidebarOpen((prev) => !prev);
    setSurveyData((prevData) => {
      // Create deep copies to avoid mutating the state directly
      const updatedSections = prevData.sections.map((section, idx) => {
        if (idx === currentSection) {
          return {
            ...section,
            questions: section.questions.filter(
              (_, qIdx) => qIdx !== section.questions.length - 1
            ),
          };
        }
        return section;
      });

      return { ...prevData, sections: updatedSections };
    });
    // setAiChatbot(false);
  };

  // Populate the form fields when the data is fetched successfully
  useEffect(() => {
    if (!data) return;

    const defaultFontSettings = {
      header: { name: "DM Sans", size: 18 },
      question: { name: "DM Sans", size: 14 },
      body: { name: "DM Sans", size: 12 },
    };

    const processedSections =
      data?.data?.sections?.map((section: any) => ({
        ...section,
        questions: section.questions.map((question: any) => ({
          ...question,
          options: question.options || [],
          rows: question.rows || [],
          columns: question.columns || [],
          min_value: question.min_value || 0,
          max_value: question.max_value || 100,
          is_required: Boolean(question.is_required),
        })),
      })) ?? [];

    console.log(data?.data?.question_text);

    setSurveyData({
      header_text: data?.data?.header_text ?? defaultFontSettings.header,
      question_text: data?.data?.question_text ?? defaultFontSettings.question,
      body_text: data?.data?.body_text ?? defaultFontSettings.body,
      topic: data?.data?.topic ?? "",
      description: data?.data?.description ?? "",
      theme: data?.data?.theme ?? "Default",
      sections: processedSections,
      color_theme: data?.data?.color_theme ?? "#ffffff",
      logo_url: data?.data?.logo_url ?? "",
      header_url: data?.data?.header_url ?? "",
    });
  }, [data, isSurveySuccess]);

  console.log(data);
  console.log(surveyData.topic);
  console.log(data?.data?.question_text);
  console.log(surveyData.question_text);

  // Add effect to refetch data on mount
  useEffect(() => {
    refetch();
  }, [refetch]);

  const navigatePage = (directionParam: any) => {
    setCurrentSection((prevIndex) => {
      let newIndex = prevIndex;
      if (directionParam === "next") {
        setDirection(1);
        newIndex =
          prevIndex < surveyData?.sections?.length - 1
            ? prevIndex + 1
            : prevIndex;
      } else {
        setDirection(-1);
        newIndex = prevIndex > 0 ? prevIndex - 1 : prevIndex;
      }
      return newIndex;
    });
  };

  const handleSave = (
    updatedQuestionText: string,
    updatedOptions: string[],
    updatedQuestionType: string,
    isRequired: boolean,
    minValue?: number,
    maxValue?: number,
    matrixRows?: string[],
    matrixColumns?: string[]
  ) => {
    if (editIndex === null) return;

    console.log(minValue, maxValue);

    setSurveyData((prevData) => {
      const updatedSections = [...prevData.sections];
      const currentSectionData = updatedSections[currentSection];

      if (currentSectionData) {
        const updatedQuestions = currentSectionData.questions.map(
          (question, idx) => {
            if (idx === editIndex) {
              // Create base question object
              const baseQuestion = {
                question: updatedQuestionText,
                question_type: updatedQuestionType,
                is_required: isRequired,
              };

              // Add type-specific properties
              switch (updatedQuestionType) {
                case "slider":
                  return {
                    ...baseQuestion,
                    // options: updatedOptions,
                    description: baseQuestion.question,
                    min: minValue,
                    max: maxValue,
                    step: 1,
                  };

                case "matrix_multiple_choice":
                case "matrix_checkbox":
                  return {
                    ...baseQuestion,
                    rows: matrixRows || [],
                    columns: matrixColumns || [],
                  };

                case "likert_scale":
                case "multiple_choice":
                case "single_choice":
                case "checkbox":
                case "drop_down":
                case "rating_scale":
                case "boolean":
                  return {
                    ...baseQuestion,
                    options: updatedOptions,
                  };

                default:
                  return baseQuestion;
              }
            }
            return question;
          }
        );

        updatedSections[currentSection] = {
          ...currentSectionData,
          questions: updatedQuestions,
          ...{
            min: minValue,
            max: maxValue,
            min_value: minValue,
            max_value: maxValue,
            minValue,
            maxValue,
          },
        };
      }

      return {
        ...prevData,
        sections: updatedSections,
      };
    });

    setEditIndex(null);
    setIsEdit(false);
  };

  const saveSurvey = async () => {
    console.log({ id: params.id, surveyData });
    try {
      await editSurvey({ id: params.id, body: surveyData }).unwrap();
      toast.success("Survey updated successfully!");
      router.push("/surveys/survey-list");
    } catch (error) {
      console.error("Error updating survey:", error);
      toast.error("Failed to update survey.");
    }
  };

  console.log("---------------------------------------------");

  console.log(surveyData?.sections[currentSection]?.questions);
  // Loading skeleton state
  if (isLoading) {
    return (
      <div className="flex gap-6">
        <div className="flex flex-col gap-5 w-full px-0 lg:pl-6 animate-pulse">
          {/* Logo skeleton */}
          <div className="w-16 h-16 bg-gray-200 rounded my-5" />

          {/* Header image skeleton */}
          <div className="w-full h-24 bg-gray-200 rounded-lg" />

          {/* Title skeleton */}
          <div className="h-8 bg-gray-200 rounded w-1/2" />

          {/* Description skeleton */}
          <div className="h-4 bg-gray-200 rounded w-3/4" />

          {/* Questions skeleton */}
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* StyleEditor skeleton */}
        <div className="hidden lg:block w-1/3 animate-pulse h-screen">
          <div className="bg-white h-full flex flex-col">
            <div className="border-b py-4">
              <div className="h-6 bg-gray-200 rounded w-1/2 mx-10" />
            </div>

            <div className="px-10 border-b py-5">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
              <div className="space-y-4">
                <div className="h-10 bg-gray-200 rounded" />
                <div className="h-10 bg-gray-200 rounded" />
              </div>
            </div>

            <div className="text-style px-10 border-b py-5">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
              <div className="space-y-4">
                <div className="h-10 bg-gray-200 rounded" />
                <div className="h-10 bg-gray-200 rounded" />
                <div className="h-10 bg-gray-200 rounded" />
              </div>
            </div>

            <div className="px-10 border-b py-5">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
              <div className="pt-5">
                <div className="h-10 bg-gray-200 rounded" />
              </div>
            </div>

            <div className="px-10 border-b py-5">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
              <div className="h-24 bg-gray-200 rounded" />
            </div>

            <div className="px-10 py-5">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
              <div className="h-24 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
        <div className="bg-red-50 rounded-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <BsExclamation className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-red-700 mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-red-600 mb-6">
            We encountered an error while loading your survey. Please try again
            later.
          </p>
          <button
            onClick={() => router.push("/surveys/survey-list")}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors font-medium"
          >
            Return to Survey List
          </button>
        </div>
      </div>
    );
  }

  if (data && isSurveySuccess) {
    // Wait for survey responses to be fetched before rendering the form
    if (surveyResponses.isLoading) {
      return (
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="flex gap-6">
            <div className="flex flex-col gap-5 w-full px-0 lg:pl-6 animate-pulse">
              {/* Logo skeleton */}
              <div className="w-16 h-16 bg-gray-200 rounded my-5" />

              {/* Header image skeleton */}
              <div className="w-full h-24 bg-gray-200 rounded-lg" />

              {/* Title skeleton */}
              <div className="h-8 bg-gray-200 rounded w-1/2" />

              {/* Description skeleton */}
              <div className="h-4 bg-gray-200 rounded w-3/4" />

              {/* Questions skeleton */}
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="h-3 bg-gray-200 rounded w-2/3" />
                      <div className="h-3 bg-gray-200 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* StyleEditor skeleton */}
            <div className="hidden lg:block w-1/3 animate-pulse h-screen">
              <div className="bg-white h-full flex flex-col">
                <div className="border-b py-4">
                  <div className="h-6 bg-gray-200 rounded w-1/2 mx-10" />
                </div>

                <div className="px-10 border-b py-5">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                  <div className="space-y-4">
                    <div className="h-10 bg-gray-200 rounded" />
                    <div className="h-10 bg-gray-200 rounded" />
                  </div>
                </div>

                <div className="text-style px-10 border-b py-5">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                  <div className="space-y-4">
                    <div className="h-10 bg-gray-200 rounded" />
                    <div className="h-10 bg-gray-200 rounded" />
                    <div className="h-10 bg-gray-200 rounded" />
                  </div>
                </div>

                <div className="px-10 border-b py-5">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                  <div className="pt-5">
                    <div className="h-10 bg-gray-200 rounded" />
                  </div>
                </div>

                <div className="px-10 border-b py-5">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                  <div className="h-24 bg-gray-200 rounded" />
                </div>

                <div className="px-10 py-5">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                  <div className="h-24 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        className={`${surveyData?.theme} flex flex-col gap-5 w-full px-0 lg:pl-6 relative`}
      >
        <div className={`flex justify-between gap-6 w-full`}>
          <div className="lg:w-2/3 flex flex-col overflow-y-auto max-h-screen custom-scrollbar">
            {surveyData?.logo_url && (
              <div className="bg-white rounded w-16 my-5 text-white flex items-center flex-col ">
                <Image
                  src={surveyData?.logo_url}
                  alt=""
                  className="w-full object-cover rounded  bg-no-repeat h-16 "
                  width={"100"}
                  height={"200"}
                />
              </div>
            )}

            {surveyData?.header_url && (
              <div className="bg-white rounded-lg w-full my-4 text-white h-24 flex items-center flex-col ">
                <Image
                  src={surveyData?.header_url}
                  alt=""
                  className="w-full object-cover bg-no-repeat h-24 rounded-lg"
                  width={"100"}
                  height={"200"}
                />
              </div>
            )}

            <div className="flex flex-col">
              <AnimatePresence
                mode="popLayout"
                initial={false}
                custom={direction as number}
              >
                <motion.div
                  key={currentSection}
                  custom={direction as number}
                  variants={sectionVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "tween", duration: 0.4 }}
                >
                  {/* Section header, matching SurveyHeader usage in EditSurvey */}
                  <div className="flex items-center justify-between">
                    <SurveyHeader
                      logoUrl={surveyData.logo_url}
                      headerUrl={surveyData.header_url}
                      survey={{
                        ...surveyData,
                        topic:
                          currentSection === 0
                            ? surveyData.topic
                            : surveyData.sections[currentSection]
                                ?.section_topic ?? surveyData.topic,
                        description:
                          currentSection === 0
                            ? surveyData.description
                            : surveyData.sections[currentSection]
                                ?.section_description ?? surveyData.description,
                      }}
                      headerText={
                        surveyData.sections[currentSection]?.header_text ||
                        surveyData.header_text
                      }
                      bodyText={
                        surveyData.sections[currentSection]?.body_text ||
                        surveyData.body_text
                      }
                      canEdit={surveyResponses.data?.data?.length <= 0}
                      isEdit={isHeaderEditing}
                      onSave={(localHeaderText, localBodyText) => {
                        setSurveyData((prev) => {
                          const updatedSections = [...prev.sections];
                          if (currentSection === 0) {
                            // Update survey-level topic/description
                            return {
                              ...prev,
                              topic: localHeaderText?.value ?? prev.topic,
                              description:
                                localBodyText?.value ?? prev.description,
                              header_text: localHeaderText,
                              body_text: localBodyText,
                            };
                          } else {
                            updatedSections[currentSection] = {
                              ...updatedSections[currentSection],
                              section_topic:
                                localHeaderText?.value ??
                                prev.sections[currentSection]?.section_topic ??
                                prev.topic,
                              section_description:
                                localBodyText?.value ??
                                prev.sections[currentSection]
                                  ?.section_description ??
                                prev.description,
                              header_text: localHeaderText,
                              body_text: localBodyText,
                            };
                            return {
                              ...prev,
                              sections: updatedSections,
                            };
                          }
                        });
                        setIsHeaderEditing(false);
                      }}
                    />
                  </div>

                  {/* @ts-ignore */}
                  {surveyData?.sections[currentSection]?.questions?.map(
                    (item: any, index: number) => (
                      <div
                        key={index}
                        className={cn(
                          "text-gray-600 mb-4",
                          surveyData?.question_text?.name &&
                            `!font-${surveyData.question_text.name
                              .split(" ")
                              .join("-")
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`
                        )}
                        style={{
                          fontSize: `${surveyData?.question_text?.size}px !important`,
                        }}
                      >
                        {isEdit && editIndex === index ? (
                          <MultiChoiceQuestionEdit
                            question={item.question}
                            options={item.options}
                            questionType={item.question_type}
                            is_required={item.is_required}
                            onSave={handleSave}
                            onCancel={handleCancel}
                            minValue={item.min_value}
                            maxValue={item.max_value}
                            surveyData={surveyData}
                            item={item}
                            matrixColumns={item.columns}
                            matrixRows={item.rows}
                          />
                        ) : item.question_type === "multiple_choice" ||
                          item.question_type === "multi_choice" ? (
                          <MultiChoiceQuestion
                            question={item.question}
                            options={item.options}
                            is_required={item.is_required}
                            setIsRequired={() => {
                              const updatedSections = [...questions];
                              const updatedSection = {
                                ...updatedSections[currentSection],
                              };
                              const updatedQuestions = [
                                ...updatedSection.questions,
                              ];

                              updatedQuestions[index] = {
                                ...updatedQuestions[index],
                                is_required: !item.is_required,
                              };

                              updatedSection.questions = updatedQuestions;
                              updatedSections[currentSection] = updatedSection;
                            }}
                            questionType={item.question_type}
                            EditQuestion={() => EditQuestion(index)}
                            index={index + 1}
                            DeleteQuestion={() => handleDeleteQuestion(index)}
                            setEditId={setEditIndex}
                            surveyData={surveyData}
                          />
                        ) : item.question_type === "comment" ||
                          item.question_type === "long_text" ? (
                          <CommentQuestion
                            key={index}
                            index={index + 1}
                            questionType={item.question_type}
                            question={item.question}
                            is_required={item.is_requied}
                            setIsRequired={() => {
                              const updatedSections = [...questions];
                              const updatedSection = {
                                ...updatedSections[currentSection],
                              };
                              const updatedQuestions = [
                                ...updatedSection.questions,
                              ];

                              updatedQuestions[index] = {
                                ...updatedQuestions[index],
                                is_required: !item.is_required,
                              };

                              updatedSection.questions = updatedQuestions;
                              updatedSections[currentSection] = updatedSection;
                            }}
                            EditQuestion={() => EditQuestion(index)}
                            DeleteQuestion={() => handleDeleteQuestion(index)}
                            surveyData={surveyData}
                          />
                        ) : item.question_type === "linear_Scale" ? (
                          <LinearScaleQuestion
                            question={item.question}
                            scaleStart={item.scaleStart}
                            scaleEnd={item.scaleEnd}
                            questionType={item.question_type}
                            EditQuestion={() => EditQuestion(index)}
                            DeleteQuestion={() => handleDeleteQuestion(index)}
                            index={index + 1}
                            surveyData={surveyData}
                          />
                        ) : item.question_type === "likert_scale" ? (
                          <LikertScaleQuestion
                            question={item.question}
                            options={item.options}
                            questionType={item.question_type}
                            EditQuestion={() => EditQuestion(index)}
                            DeleteQuestion={() => handleDeleteQuestion(index)}
                            index={index + 1}
                            is_required={item.is_requied}
                            surveyData={surveyData}
                            setIsRequired={() => {
                              const updatedSections = [...questions];
                              const updatedSection = {
                                ...updatedSections[currentSection],
                              };
                              const updatedQuestions = [
                                ...updatedSection.questions,
                              ];

                              updatedQuestions[index] = {
                                ...updatedQuestions[index],
                                is_required: !item.is_required,
                              };

                              updatedSection.questions = updatedQuestions;
                              updatedSections[currentSection] = updatedSection;
                            }}
                          />
                        ) : item.question_type === "star_rating" ? (
                          <StarRatingQuestion
                            question={item.question}
                            questionType={item.question_type}
                            EditQuestion={() => EditQuestion(index)}
                            DeleteQuestion={() => handleDeleteQuestion(index)}
                            index={index + 1}
                            is_required={item.is_requied}
                            surveyData={surveyData}
                            setIsRequired={() => {
                              const updatedSections = [...questions];
                              const updatedSection = {
                                ...updatedSections[currentSection],
                              };
                              const updatedQuestions = [
                                ...updatedSection.questions,
                              ];

                              updatedQuestions[index] = {
                                ...updatedQuestions[index],
                                is_required: !item.is_required,
                              };

                              updatedSection.questions = updatedQuestions;
                              updatedSections[currentSection] = updatedSection;
                            }}
                          />
                        ) : item.question_type === "matrix_multiple_choice" ||
                          item.question_type === "matrix_checkbox" ? (
                          <MatrixQuestion
                            key={index}
                            index={index + 1}
                            rows={item.rows}
                            columns={item.columns}
                            questionType={item.question_type}
                            question={item.question}
                            EditQuestion={() => EditQuestion(index)}
                            DeleteQuestion={() => handleDeleteQuestion(index)}
                            is_required={item.is_requied}
                            setIsRequired={() => {
                              const updatedSections = [...questions];
                              const updatedSection = {
                                ...updatedSections[currentSection],
                              };
                              const updatedQuestions = [
                                ...updatedSection.questions,
                              ];

                              updatedQuestions[index] = {
                                ...updatedQuestions[index],
                                is_required: !item.is_required,
                              };

                              updatedSection.questions = updatedQuestions;
                              updatedSections[currentSection] = updatedSection;
                            }}
                            surveyData={surveyData}
                          />
                        ) : item.question_type === "single_choice" ? (
                          <SingleChoiceQuestion
                            index={index + 1}
                            key={index}
                            question={item.question}
                            options={item.options}
                            questionType={item.question_type}
                            EditQuestion={() => EditQuestion(index)}
                            DeleteQuestion={() => handleDeleteQuestion(index)}
                            is_required={item.is_requied}
                            surveyData={surveyData}
                            setIsRequired={() => {
                              const updatedSections = [...questions];
                              const updatedSection = {
                                ...updatedSections[currentSection],
                              };
                              const updatedQuestions = [
                                ...updatedSection.questions,
                              ];

                              updatedQuestions[index] = {
                                ...updatedQuestions[index],
                                is_required: !item.is_required,
                              };

                              updatedSection.questions = updatedQuestions;
                              updatedSections[currentSection] = updatedSection;
                            }}
                          />
                        ) : item.question_type === "checkbox" ? (
                          <CheckboxQuestion
                            key={index}
                            index={index + 1}
                            question={item.question}
                            options={item.options}
                            questionType={item.question_type}
                            EditQuestion={() => EditQuestion(index)}
                            DeleteQuestion={() => handleDeleteQuestion(index)}
                            is_required={item.is_requied}
                            surveyData={surveyData}
                            setIsRequired={() => {
                              const updatedSections = [...questions];
                              const updatedSection = {
                                ...updatedSections[currentSection],
                              };
                              const updatedQuestions = [
                                ...updatedSection.questions,
                              ];

                              updatedQuestions[index] = {
                                ...updatedQuestions[index],
                                is_required: !item.is_required,
                              };

                              updatedSection.questions = updatedQuestions;
                              updatedSections[currentSection] = updatedSection;
                            }}
                          />
                        ) : item.question_type === "rating_scale" ? (
                          <RatingScaleQuestion
                            key={index}
                            index={index + 1}
                            question={item.question}
                            options={item.options}
                            questionType={item.question_type}
                            EditQuestion={() => EditQuestion(index)}
                            DeleteQuestion={() => handleDeleteQuestion(index)}
                            is_required={item.is_requied}
                            setIsRequired={() => {
                              const updatedSections = [...questions];
                              const updatedSection = {
                                ...updatedSections[currentSection],
                              };
                              const updatedQuestions = [
                                ...updatedSection.questions,
                              ];

                              updatedQuestions[index] = {
                                ...updatedQuestions[index],
                                is_required: !item.is_required,
                              };

                              updatedSection.questions = updatedQuestions;
                              updatedSections[currentSection] = updatedSection;
                            }}
                            surveyData={surveyData}
                          />
                        ) : item.question_type === "drop_down" ? (
                          <DropdownQuestion
                            index={index + 1}
                            key={index}
                            question={item.question}
                            options={item.options}
                            questionType={item.question_type}
                            EditQuestion={() => EditQuestion(index)}
                            DeleteQuestion={() => handleDeleteQuestion(index)}
                            is_required={item.is_requied}
                            setIsRequired={() => {
                              const updatedSections = [...questions];
                              const updatedSection = {
                                ...updatedSections[currentSection],
                              };
                              const updatedQuestions = [
                                ...updatedSection.questions,
                              ];

                              updatedQuestions[index] = {
                                ...updatedQuestions[index],
                                is_required: !item.is_required,
                              };

                              updatedSection.questions = updatedQuestions;
                              updatedSections[currentSection] = updatedSection;
                            }}
                            surveyData={surveyData}
                          />
                        ) : item.question_type === "number" ? (
                          <NumberQuestion
                            key={index}
                            index={index + 1}
                            question={item.question}
                            questionType={item.question_type}
                            EditQuestion={() => EditQuestion(index)}
                            DeleteQuestion={() => handleDeleteQuestion(index)}
                            is_required={item.is_requied}
                            setIsRequired={() => {
                              const updatedSections = [...questions];
                              const updatedSection = {
                                ...updatedSections[currentSection],
                              };
                              const updatedQuestions = [
                                ...updatedSection.questions,
                              ];

                              updatedQuestions[index] = {
                                ...updatedQuestions[index],
                                is_required: !item.is_required,
                              };

                              updatedSection.questions = updatedQuestions;
                              updatedSections[currentSection] = updatedSection;
                            }}
                            surveyData={surveyData}
                          />
                        ) : item.question_type === "short_text" ? (
                          <ShortTextQuestion
                            key={index}
                            index={index + 1}
                            question={item.question}
                            questionType={item.question_type}
                            EditQuestion={() => EditQuestion(index)}
                            DeleteQuestion={() => handleDeleteQuestion(index)}
                            is_required={item.is_requied}
                            setIsRequired={() => {
                              const updatedSections = [...questions];
                              const updatedSection = {
                                ...updatedSections[currentSection],
                              };
                              const updatedQuestions = [
                                ...updatedSection.questions,
                              ];

                              updatedQuestions[index] = {
                                ...updatedQuestions[index],
                                is_required: !item.is_required,
                              };

                              updatedSection.questions = updatedQuestions;
                              updatedSections[currentSection] = updatedSection;
                            }}
                            surveyData={surveyData}
                          />
                        ) : item.question_type === "boolean" ? (
                          <BooleanQuestion
                            key={index}
                            index={index + 1}
                            question={item.question}
                            options={item.options}
                            questionType={item.question_type}
                            EditQuestion={() => EditQuestion(index)}
                            DeleteQuestion={() => handleDeleteQuestion(index)}
                            is_required={item.is_requied}
                            setIsRequired={() => {
                              const updatedSections = [...questions];
                              const updatedSection = {
                                ...updatedSections[currentSection],
                              };
                              const updatedQuestions = [
                                ...updatedSection.questions,
                              ];

                              updatedQuestions[index] = {
                                ...updatedQuestions[index],
                                is_required: !item.is_required,
                              };

                              updatedSection.questions = updatedQuestions;
                              updatedSections[currentSection] = updatedSection;
                            }}
                            surveyData={surveyData}
                          />
                        ) : item.question_type === "slider" ? (
                          <>
                            <SliderQuestion
                              question={item.question}
                              options={item.options}
                              questionType={item.question_type}
                              index={index + 1}
                              min={item.min_value || item.min_value}
                              max={item.max_value || item.max_value}
                              is_required={item.is_required}
                              EditQuestion={() => EditQuestion(index)}
                              DeleteQuestion={() => handleDeleteQuestion(index)}
                              onSave={(
                                updatedQuestion,
                                updatedMin,
                                updatedMax
                              ) =>
                                handleSave(
                                  updatedQuestion,
                                  [],
                                  "slider",
                                  item.is_required,
                                  updatedMin,
                                  updatedMax
                                )
                              }
                              setIsRequired={() => {
                                const updatedSections = [...questions];
                                const updatedSection = {
                                  ...updatedSections[currentSection],
                                };
                                const updatedQuestions = [
                                  ...updatedSection.questions,
                                ];

                                updatedQuestions[index] = {
                                  ...updatedQuestions[index],
                                  is_required: !item.is_required,
                                };

                                updatedSection.questions = updatedQuestions;
                                updatedSections[currentSection] =
                                  updatedSection;
                              }}
                              surveyData={surveyData}
                              item={item}
                            />
                          </>
                        ) : (
                          <>{item?.question_type}</>
                        )}
                      </div>
                    )
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Section Paginator */}
            {surveyData.sections.length > 1 && (
              <div className="flex w-full md:w-auto md:justify-end items-center mb-6 sticky bottom-10 z-10">
                <PaginationBtn
                  currentSection={currentSection}
                  totalSections={surveyData.sections.length}
                  onNavigate={(direction) => {
                    setCurrentSection((prev) => {
                      if (direction === "next") {
                        return prev < surveyData.sections.length - 1
                          ? prev + 1
                          : prev;
                      } else {
                        return prev > 0 ? prev - 1 : prev;
                      }
                    });
                  }}
                />
              </div>
            )}

            {/* Add Question Button or Info Message */}
            {surveyResponses.data?.data?.length <= 0 ? (
              <>
                {/* Add Question Button */}
                <div className="flex flex-col gap-4 md:flex-row justify-between items-center mb-6">
                  <Button
                    variant="outline"
                    className="relative rounded-full transition-all duration-200 border-none overflow-hidden px-4"
                    onClick={() => {
                      EditQuestion(
                        surveyData?.sections[currentSection]?.questions.length
                      );
                      setSurveyData((prevData) => {
                        const updatedSections = [...prevData.sections];
                        if (!updatedSections[currentSection]) return prevData;
                        updatedSections[currentSection] = {
                          ...updatedSections[currentSection],
                          questions: [
                            ...updatedSections[currentSection].questions,
                            {
                              question: "",
                              question_type: "multiple_choice",
                              options: [],
                              is_required: false,
                            },
                          ],
                        };
                        return { ...prevData, sections: updatedSections };
                      });
                    }}
                  >
                    <div className="flex gap-2 items-center">
                      <svg
                        className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      <span className="group-hover:tracking-wide transition-all duration-200">
                        Add Question
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] opacity-0 hover:opacity-10 transition-opacity duration-200" />
                    </div>
                  </Button>
                  <div className="flex gap-4 flex-wrap">
                    <Button
                      variant="outline"
                      className="group relative rounded-full transition-all duration-200 border-green-200 text-green-600 hover:!text-green-700 overflow-hidden"
                      onClick={() => {
                        setSurveyData((prevData) => {
                          const newSection = { questions: [] };
                          return {
                            ...prevData,
                            sections: [
                              ...prevData.sections.slice(0, currentSection + 1),
                              newSection,
                              ...prevData.sections.slice(currentSection + 1),
                            ],
                          };
                        });
                        setCurrentSection((prev) => prev + 1);
                      }}
                    >
                      <Sheet className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
                      <span className="group-hover:tracking-wide transition-all duration-200">
                        Add New Section
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-green-200 to-green-400 opacity-0 group-hover:opacity-10 transition-opacity duration-200" />
                    </Button>
                    {surveyData.sections.length > 1 && (
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setSurveyData((prevData) => {
                            const updatedSections = prevData.sections.filter(
                              (_, idx) => idx !== currentSection
                            );
                            let newCurrent = currentSection;
                            if (currentSection >= updatedSections.length) {
                              newCurrent = updatedSections.length - 1;
                            }
                            setCurrentSection(newCurrent);
                            return {
                              ...prevData,
                              sections: updatedSections,
                            };
                          });
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-red-200 text-red-600 hover:text-white rounded-full shadow-sm hover:bg-red-500"
                        title="Remove Current Section"
                      >
                        <TableRowsSplit className="w-5 h-5" />
                        Remove Current Section
                      </Button>
                    )}
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex flex-col gap-4 md:flex-row justify-between items-center mb-10 mt-10">
                  <Button
                    className="w-full relative overflow-hidden bg-gradient-to-r h-12 rounded-full from-[#5B03B2] to-[#9D50BB] text-white
                    transform transition-all duration-300 ease-in-out
                    hover:scale-100 hover:shadow-lg hover:shadow-purple-500/30
                    active:scale-95
                    before:absolute before:top-0 before:left-0 before:w-full before:h-full 
                    before:bg-gradient-to-r before:from-purple-600 before:to-fuchsia-600
                    before:opacity-0 before:transition-opacity before:duration-300
                    hover:before:opacity-100
                    disabled:opacity-70 disabled:cursor-not-allowed
                    group"
                    onClick={saveSurvey}
                    disabled={isEditLoading}
                  >
                    <span className="relative flex items-center justify-center gap-2">
                      {isEditLoading ? (
                        <>
                          <svg
                            className="w-5 h-5 animate-bounce"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                            />
                          </svg>
                          Saving changes
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5 animate-pulse"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                            />
                          </svg>
                          Save changes
                        </>
                      )}
                    </span>
                  </Button>
                </div>
              </>
            ) : (
              <div className="my-4 p-4 bg-yellow-100 text-yellow-800 rounded mb-20">
                You can't edit or add new questions because this survey has
                already started accepting responses.
              </div>
            )}

            <WatermarkBanner className="mb-10" />
          </div>
          <div
            className={`hidden lg:flex lg:w-1/3 overflow-y-auto max-h-screen custom-scrollbar bg-white`}
          >
            {/* {isSidebar ? <StyleEditor /> : <QuestionType />} */}
            <StyleEditor
              surveyData={surveyData}
              setSurveyData={setSurveyData}
            />
          </div>
        </div>
      </div>
    );
  }
};

export default EditSubmittedSurvey;
