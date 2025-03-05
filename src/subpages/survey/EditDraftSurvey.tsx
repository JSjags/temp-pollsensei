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
  useGenerateSingleSurveyMutation,
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
import { Button } from "@/components/ui/button";
import { PencilIcon, Send, Sparkles } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogContent } from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/shadcn-input";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ClipLoader } from "react-spinners";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { HiOutlinePlus } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { updateSection } from "@/redux/slices/survey.slice";
import { useQueryClient } from "@tanstack/react-query";

interface Question {
  question: string;
  description?: string;
  question_type: string;
  options?: string[];
  rows?: string[];
  columns?: string[];
  is_required?: boolean;
}

interface Section {
  questions: Question[];
  section_topic?: string;
  section_description?: string;
  _id?: string;
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

const EditDraftSurvey = () => {
  const params = useParams();
  const router = useRouter();
  const {
    data,
    isLoading,
    refetch,
    isSuccess: isSurveySuccess,
  } = useQuery({
    queryKey: ["draft", params.id],
    queryFn: () => axiosInstance.get(`/progress/${params.id}`),
  });
  const [
    generateSingleSurvey,
    {
      data: newSingleSurvey,
      isLoading: generatingSingleSurvey,
      isSuccess: newQuestionGenerate,
    },
  ] = useGenerateSingleSurveyMutation();
  const [isEdit, setIsEdit] = useState(false);
  const [isEditHeader, setIsEditHeader] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editSurvey, { isSuccess, isError, error, isLoading: isEditLoading }] =
    useEditSurveyMutation();
  const [isSidebar, setIsSidebarOpen] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);
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
  const [addMoreQuestion, setAddMoreQuestion] = useState(false);
  const [question_count, setQuestionCount] = useState<number>(0);
  const [openModal, setOpenModal] = useState(false);
  const questions = surveyData?.sections;
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

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

    const newData = {
      header_text:
        data?.data?.header_text?.name?.toLowerCase() === "helvetica"
          ? { ...data?.data?.header_text, name: "DM Sans" }
          : data?.data?.header_text ?? defaultFontSettings.header,
      question_text:
        data?.data?.question_text?.name?.toLowerCase() === "helvetica"
          ? { ...data?.data?.question_text, name: "DM Sans" }
          : data?.data?.question_text ?? defaultFontSettings.question,
      body_text:
        data?.data?.body_text?.name?.toLowerCase() === "helvetica"
          ? { ...data?.data?.body_text, name: "DM Sans" }
          : data?.data?.body_text ?? defaultFontSettings.body,
      topic: data?.data?.topic ?? "",
      description: data?.data?.description ?? "",
      theme: data?.data?.theme ?? "Default",
      sections: processedSections,
      color_theme: data?.data?.color_theme ?? "#ffffff",
      logo_url: data?.data?.logo_url ?? "",
      header_url: data?.data?.header_url ?? "",
    };

    setSurveyData(newData);
  }, [data, isSurveySuccess]);

  // console.log(surveyData);

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

  const handleGenerateSingleQuestion = async () => {
    try {
      await generateSingleSurvey({
        conversation_id: params.id,
        question_count: question_count,
      }).unwrap();
      toast.success("Single survey added successfully");
      setOpenModal(false);
    } catch (e) {
      toast.error("Failed to generate more survey questions");
      setOpenModal(false);
      console.error(e);
    }
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

  // Update the createSurvey mutation
  const { mutate: createSurvey, isPending: isPublishing } = useMutation({
    mutationFn: async (data: any) => {
      return await axiosInstance.post("survey/create", data);
    },
    onSuccess: async () => {
      try {
        await axiosInstance.delete(`/progress/${params.id}`);
        toast.success("Survey published successfully");
        queryClient.invalidateQueries({ queryKey: ["get-drafts"] });
        router.push("/surveys/survey-list");
      } catch (error) {
        router.push("/surveys/survey-list");
      }
    },
    onError: () => {
      toast.error("Failed to publish survey");
    },
  });

  console.log(data?.data);

  // Move this function up, before any JSX that uses it
  const saveSurvey = async () => {
    const processedSurvey = {
      survey_type: "Quantitative",
      topic: surveyData.topic,
      description: surveyData.description,
      generated_by: "manually",
      sections: surveyData.sections.map((section) => ({
        section_topic: section.section_topic,
        section_description: section.section_description,
        questions: section.questions.map((question) => ({
          question: question.question,
          description: question.description,
          question_type: question.question_type,
          is_required: question.is_required || false,
          options: question.options || [],
          rows: question.rows || [],
          columns: question.columns || [],
        })),
      })),
      theme: surveyData.theme || "Default",
      header_text: {
        name: surveyData.header_text?.name || "Times New Roman",
        size: surveyData.header_text?.size || 24,
      },
      question_text: {
        name: surveyData.question_text?.name || "Times New Roman",
        size: surveyData.question_text?.size || 18,
      },
      body_text: {
        name: surveyData.body_text?.name || "Times New Roman",
        size: surveyData.body_text?.size || 16,
      },
      color_theme: surveyData.color_theme || "#eee",
      logo_url: surveyData.logo_url?.startsWith("#") ? "" : surveyData.logo_url,
      header_url: surveyData.header_url?.startsWith("#")
        ? ""
        : surveyData.header_url,
    };

    createSurvey(processedSurvey);
  };

  // Add this mutation hook near your other hooks
  const { mutate: updateDraft, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await axiosInstance.patch(`/progress/${id}`, data);
    },
    onSuccess: () => {
      toast.success("Draft updated successfully");
    },
    onError: () => {
      toast.error("Failed to update draft");
    },
  });

  // Add this function to handle draft update
  const handleUpdateDraft = () => {
    const payload = {
      sections: surveyData.sections.map((section) => ({
        section_topic: section.section_topic,
        section_description: section.section_description,
        questions: section.questions.map((question) => ({
          question: question.question,
          description: question.description,
          question_type: question.question_type,
          is_required: question.is_required,
          options: question.options || [],
          rows: question.rows || [],
          columns: question.columns || [],
        })),
      })),
    };

    updateDraft({ id: params.id as string, data: payload });
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
              <Button
                variant="outline"
                className="px-0 relative rounded-full min-w-20 transition-all duration-200 border-none overflow-hidden"
                // onClick={() => setAddMoreQuestion((prev) => !prev)}
                disabled={generatingSingleSurvey}
              >
                {generatingSingleSurvey ? (
                  <ClipLoader size={24} />
                ) : (
                  <div className="flex gap-2 items-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="group relative rounded-full transition-all duration-200 border-none overflow-hidden"
                        >
                          <HiOutlinePlus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
                          <span className="group-hover:tracking-wide transition-all duration-200">
                            Add Question
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] opacity-0 hover:opacity-10 transition-opacity duration-200" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        collisionPadding={{ bottom: 40 }}
                        className="w-56"
                      >
                        <DropdownMenuItem
                          onClick={() => {
                            const newQuestion = {
                              question: "New Question",
                              description: "Question description",
                              question_type: "short_text",
                              is_required: false,
                              options: [],
                            };

                            const updatedSections = [...questions];
                            const currentSectionData =
                              updatedSections[currentSection];

                            const updatedSection = {
                              ...currentSectionData,
                              questions: [
                                ...currentSectionData.questions,
                                newQuestion,
                              ],
                            };

                            setSurveyData((prevData) => {
                              const updatedSections = [...prevData.sections];
                              updatedSections[currentSection] = updatedSection;
                              return {
                                ...prevData,
                                sections: updatedSections,
                              };
                            });
                            setEditIndex(currentSectionData.questions.length);
                            setIsEdit(true);
                          }}
                          className="gap-2"
                        >
                          <PencilIcon className="h-4 w-4" />
                          <span>Add Manually</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setAddMoreQuestion(true)}
                          className="gap-2"
                        >
                          <Sparkles className="h-4 w-4" />
                          <span>Generate with AI</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </Button>
            </div>

            <div className="flex items-center gap-4 justify-end px-4 py-3 border-t border-tr">
              <Button
                onClick={handleUpdateDraft}
                variant="outline"
                className="flex items-center gap-2"
                disabled={isUpdating}
              >
                <PencilIcon className="w-4 h-4" />
                {isUpdating ? "Updating..." : "Update Draft"}
              </Button>

              <Button
                onClick={saveSurvey}
                className="flex items-center gap-2 bg-gradient-to-r from-[#5b03b2] to-[#9d50bb] text-white"
                disabled={isPublishing}
              >
                {isPublishing ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Publish Survey</span>
                  </>
                )}
              </Button>
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
        <Dialog
          open={addMoreQuestion}
          onOpenChange={() => setAddMoreQuestion(false)}
        >
          <DialogContent
            className="sm:max-w-md z-[100000]"
            overlayClassName="z-[100000]"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-center">
                  Let the Sensei assist you
                </DialogTitle>
                <DialogDescription className="text-center">
                  How many additional questions would you like the AI Sensei to
                  generate for your survey?
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col space-y-6 py-6">
                <div className="space-y-2">
                  <Label htmlFor="question-count">Number of questions</Label>
                  <Input
                    id="question-count"
                    type="number"
                    min={1}
                    max={5}
                    placeholder="Enter a number (1-5)"
                    className="w-full"
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                  />
                  <p className="text-sm text-muted-foreground">
                    Choose between 1 to 5 questions
                  </p>
                </div>

                <Button
                  disabled={!(question_count >= 1 && question_count <= 5)}
                  onClick={() => {
                    setAddMoreQuestion(false);
                    handleGenerateSingleQuestion();
                  }}
                  className="w-full group relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#5B03B2] to-[#9D50BB]"
                    initial={false}
                    animate={{
                      scale:
                        question_count >= 1 && question_count <= 5
                          ? [1, 1.1, 1]
                          : 1,
                    }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  />
                  <span className="relative z-10 group-hover:tracking-wider transition-all duration-200">
                    Generate Questions
                  </span>
                </Button>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
};

export default EditDraftSurvey;
