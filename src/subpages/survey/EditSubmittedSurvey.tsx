import { useParams, useRouter } from "next/navigation";
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
import { motion } from "framer-motion";
import WatermarkBanner from "@/components/common/WatermarkBanner";
import { BsExclamation } from "react-icons/bs";
import { cn } from "@/lib/utils";
import axiosInstance from "@/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";

interface Question {
  question: string;
  question_type: string;
  options?: string[];
  rows?: string[];
  columns?: string[];
  is_required?: boolean;
}

interface Section {
  questions: Question[];
}

export interface SurveyData {
  topic: string;
  description: string;
  sections: Section[];
  theme: string;
  header_text?: any;
  question_text?: any;
  body_text?: any;
  color_theme: string;
  logo_url: string;
  header_url: string;
}

const EditSubmittedSurvey = () => {
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

  console.log(data);
  console.log(params.id);
  const [surveyData, setSurveyData] = useState<SurveyData>({
    topic: "",
    description: "",
    sections: [],
    theme: "",
    color_theme: "#ffffff",
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
    // setAiChatbot(false);
  };

  // Populate the form fields when the data is fetched successfully
  useEffect(() => {
    if (!data) return;

    const defaultFontSettings = {
      header: { name: "Times New Roman", size: 18 },
      question: { name: "Times New Roman", size: 14 },
      body: { name: "Times New Roman", size: 12 },
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

    alert("data");
  }, [data, isSurveySuccess]);

  console.log(data);
  console.log(surveyData.question_text);

  // Add effect to refetch data on mount
  useEffect(() => {
    refetch();
  }, [refetch]);

  const navigatePage = (direction: any) => {
    setCurrentSection((prevIndex) => {
      if (direction === "next") {
        return prevIndex < surveyData?.sections?.length - 1
          ? prevIndex + 1
          : prevIndex;
      } else {
        return prevIndex > 0 ? prevIndex - 1 : prevIndex;
      }
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
    return (
      <div
        className={`${surveyData?.theme} flex flex-col gap-5 w-full px-0 lg:pl-6 relative`}
      >
        <div className={`flex justify-between gap-6 w-full`}>
          <div className="lg:w-2/3 flex flex-col overflow-y-auto max-h-screen custom-scrollbar">
            {surveyData?.logo_url && (
              <div className="bg-[#9D50BB] rounded w-16 my-5 text-white flex items-center flex-col ">
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
              <div className="bg-[#9D50BB] rounded-lg w-full my-4 text-white h-24 flex items-center flex-col ">
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
              {isEditHeader ? (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="mb-6 bg-white rounded-lg w-full my-4 p-6 shadow-lg"
                >
                  <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.div
                      className="space-y-2"
                      initial={{ x: -20 }}
                      animate={{ x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label className="text-sm font-medium text-gray-700">
                        Survey Topic
                      </label>
                      <input
                        type="text"
                        value={surveyData.topic}
                        onChange={(e) =>
                          setSurveyData({
                            ...surveyData,
                            topic: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                      />
                    </motion.div>

                    <motion.div
                      className="space-y-2"
                      initial={{ x: -20 }}
                      animate={{ x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <label className="text-sm font-medium text-gray-700">
                        Survey Description
                      </label>
                      <textarea
                        rows={4}
                        value={surveyData.description}
                        onChange={(e) =>
                          setSurveyData({
                            ...surveyData,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 resize-none"
                      />
                    </motion.div>

                    <motion.button
                      whileHover={{
                        scale: 1.02,
                        boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                      }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="inline-flex items-center justify-center px-4 py-2 w-auto bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-md shadow-sm hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300"
                      onClick={() => setIsEditHeader((prev) => !prev)}
                    >
                      Save Changes
                    </motion.button>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="bg-white rounded-lg w-full my-4 p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.h2
                      initial={{ x: -20 }}
                      animate={{ x: 0 }}
                      transition={{ delay: 0.3 }}
                      className={cn("font-normal", {
                        [`font-${surveyData?.header_text?.name
                          ?.split(" ")
                          .join("-")
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`]:
                          surveyData?.header_text?.name,
                      })}
                      style={{
                        fontSize: `${surveyData?.header_text?.size}px`,
                      }}
                    >
                      {surveyData?.topic}
                    </motion.h2>
                    <motion.p
                      initial={{ x: -20 }}
                      animate={{ x: 0 }}
                      transition={{ delay: 0.4 }}
                      className={cn("text-gray-600", {
                        [`font-${surveyData?.body_text?.name
                          ?.split(" ")
                          .join("-")
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`]: surveyData?.body_text?.name,
                      })}
                      style={{
                        fontSize: `${surveyData?.body_text?.size}px`,
                      }}
                    >
                      {surveyData?.description}
                    </motion.p>
                    <motion.div
                      className="flex justify-end"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <motion.button
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center px-4 h-10 border border-purple-300 text-sm font-medium rounded-full text-purple-700 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300"
                        onClick={() => setIsEditHeader((prev) => !prev)}
                      >
                        <motion.svg
                          whileHover={{ rotate: 180 }}
                          transition={{ duration: 0.3 }}
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </motion.svg>
                        Edit
                      </motion.button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </div>

            {/* {console.log(surveyData?.sections[currentSection]?.questions)} */}
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
                  {
                    // isEdit &&
                    // editIndex === index &&
                    // item.question_type === "matrix_checkbox" ? (
                    //   <MatrixQuestionEdit
                    //     question={item.question}
                    //     options={item.options}
                    //     is_required={item.is_required}
                    //     questionType={item.question_type}
                    //     onSave={handleSave}
                    //     onCancel={handleCancel}
                    //   />
                    // ) :
                    isEdit && editIndex === index ? (
                      <MultiChoiceQuestionEdit
                        // index={index + 1}
                        question={item.question}
                        options={item.options}
                        questionType={item.question_type}
                        is_required={item.is_required}
                        onSave={handleSave}
                        onCancel={handleCancel}
                        minValue={item.min_value}
                        maxValue={item.max_value}
                        surveyData={surveyData}
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
                        // maxRating={5}
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
                        // options={item.options}
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
                        // onSave={handleAISave}
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
                        // onSave={handleAISave}
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
                        // onSave={handleAISave}
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
                        // onSave={handleAISave}
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
                        // onSave={handleAISave}
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
                          // step={item.options.length}
                          questionType={item.question_type}
                          index={index + 1}
                          min={item.min || item.min_value}
                          max={item.max || item.max_value}
                          is_required={item.is_required}
                          EditQuestion={() => EditQuestion(index)}
                          DeleteQuestion={() => handleDeleteQuestion(index)}
                          // @ts-expect-error expect here
                          onSave={handleSave}
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
                      </>
                    ) : (
                      <>{item?.question_type}</>
                    )
                  }
                </div>
              )
            )}

            <div className="flex flex-col gap-4 md:flex-row justify-between items-center mb-10">
              <button
                className="auth-btn text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={saveSurvey}
              >
                {isEditLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>

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
