import Image from "next/image";
import { pollsensei_new_logo, sparkly } from "@/assets/images";
import { HiOutlinePlus } from "react-icons/hi";
import { VscLayersActive } from "react-icons/vsc";
import { Fragment, useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useDispatch } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { GiCardDiscard } from "react-icons/gi";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  updateSectionTopic,
  updateSectionDescription,
  addQuestion,
  resetQuestion,
  deleteQuestion,
  updateQuestions,
  updateQuestion,
} from "@/redux/slices/questions.slice";
import { toast } from "react-toastify";
import CommentQuestion from "@/components/survey/CommentQuestion";
import MultiChoiceQuestion from "@/components/survey/MultiChoiceQuestion";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable } from "@/components/ui/StrictModeDroppable";
import MatrixQuestion from "@/components/survey/MatrixQuestion";
import QuestionType from "./QuestionType";
import StyleEditor from "./StyleEditor";
import AddQuestion from "./AddQuestion";
import {
  addSection,
  deleteQuestionFromSection,
  resetSurvey,
  deleteSection,
} from "@/redux/slices/survey.slice";
import { useRouter, usePathname } from "next/navigation";
import LikertScaleQuestion from "@/components/survey/LikertScaleQuestion";
import StarRatingQuestion from "@/components/survey/StarRatingQuestion";
import {
  useCreateSurveyMutation,
  useSaveProgressMutation,
} from "@/services/survey.service";
import store from "@/redux/store";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import MatrixQuestionEdit from "@/components/survey/MatrixQuestionEdit";

import BooleanQuestion from "@/components/survey/BooleanQuestion";
import ShortTextQuestion from "@/components/survey/LongTextQuestion";
import SingleChoiceQuestion from "@/components/survey/SingleChoiceQuestion";
import SliderQuestion from "@/components/survey/SliderQuestion";
import NumberQuestion from "@/components/survey/NumberQuestion";
import DropdownQuestion from "@/components/survey/DropdownQuestion";
import CheckboxQuestion from "@/components/survey/CheckboxQuestion";
import RatingScaleQuestion from "@/components/survey/RatingScaleQuestion";
import ReviewModal from "@/components/modals/ReviewModal";
import MediaQuestion from "@/components/survey/MediaQuestion";
import MultiChoiceQuestionEdit from "@/components/survey/MultiChoiceQuestionEdit";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IoDocumentOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/shadcn-textarea";
import { Edit, Save, Trash2, Pencil } from "lucide-react";
import { X } from "lucide-react";
import { SurveyData } from "./EditSubmittedSurvey";
import { cn } from "@/lib/utils";
import WatermarkBanner from "@/components/common/WatermarkBanner";
import { RxCardStack } from "react-icons/rx";
import { Spinner } from "@/components/loaders/page-loaders/AnalysisPageLoader";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Question } from "@/types/survey";
import ExitSurveyDialog from "@/components/dialogs/ExitSurveyDialog";

const AddQuestionPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const sectionTopic = useSelector((state: RootState) => state?.survey?.topic);
  const theme = useSelector((state: RootState) => state?.survey?.theme);
  const sectionDescription = useSelector(
    (state: RootState) => state?.survey?.description
  );
  const selectedSurveyType = useSelector(
    (state: RootState) => state?.survey?.survey_type
  );
  const qq = useSelector((state: RootState) => state?.question);
  const [sections, setSections] = useState<any[][]>([[]]); // Initialize with one empty section
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<number | null>(null);
  const [hoveredQuestionIndex, setHoveredQuestionIndex] = useState<
    number | null
  >(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<
    (() => void) | null
  >(null);

  useEffect(() => {
    // Check if device supports touch
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  const questions = useSelector(
    (state: RootState) => state?.question?.questions
  );

  const userToken = useSelector(
    (state: RootState) => state?.user?.access_token || state.user.token
  );
  const user = useSelector((state: RootState) => state?.user?.user);

  const logoUrl = useSelector((state: RootState) => state?.survey?.logo_url);
  const [sectionTitle, setSectionTitle] = useState(sectionTopic || "");
  const [sDescription, setsDescription] = useState(sectionDescription || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [review, setReview] = useState(false);
  const [survey_id, setSurvey_id] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [
    createSurvey,
    { data: createdSurveyData, isLoading, isSuccess, isError, error },
  ] = useCreateSurveyMutation();
  const [
    saveprogress,
    {
      isSuccess: progressSuccess,
      isError: progressIsError,
      error: progressError,
    },
  ] = useSaveProgressMutation();
  const survey = useSelector((state: RootState) => state?.survey);
  const [isSidebar, setIsSidebarOpen] = useState(true);
  const [addQuestions, setAddQuestions] = useState(false);
  const headerUrl = useSelector((state: RootState) => state.survey.header_url);
  const headerText = useSelector(
    (state: RootState) => state.survey.header_text
  );
  const bodyText = useSelector((state: RootState) => state.survey.body_text);

  const pageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      rotateY: direction > 0 ? 90 : -90,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      rotateY: 0,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      rotateY: direction < 0 ? 90 : -90,
    }),
  };

  const pageTransition = {
    type: "spring",
    damping: 20,
    stiffness: 100,
    timing: {
      duration: 0.5,
      ease: "easeInOut",
    },
  };

  const handleAddSection = () => {
    setSections([...sections, []]);
    setCurrentSectionIndex(sections.length);
  };

  const handleDeleteSection = (index: number) => {
    setSectionToDelete(index);
    setShowDeleteModal(true);
  };

  const confirmDeleteSection = () => {
    if (sectionToDelete !== null) {
      const newSections = sections.filter((_, i) => i !== sectionToDelete);
      setSections(newSections);
      if (currentSectionIndex >= newSections.length) {
        setCurrentSectionIndex(Math.max(0, newSections.length - 1));
      }
      dispatch(deleteSection(sectionToDelete));
      setShowDeleteModal(false);
    }
  };

  const handleDiscard = () => {
    setShowDiscardModal(true);
  };

  const confirmDiscard = () => {
    dispatch(resetQuestion());
    dispatch(resetSurvey());
    if (!userToken || !user) {
      router.push("/demo/create-survey");
    } else {
      router.push("/surveys/survey-list");
    }
  };

  // Default survey data state
  const [surveyData, setSurveyData] = useState<SurveyData>({
    topic: sectionTopic || "Untitled Survey",
    description: sectionDescription || "",
    sections: [],
    theme: theme || "default",
    header_text: headerText
      ? {
          name: headerText.name,
          size: Number(headerText.size),
        }
      : {
          name: "DM Sans",
          size: 24,
        },
    question_text: {
      name: "DM Sans",
      size: 18,
    },
    body_text: bodyText
      ? {
          name: bodyText.name,
          size: Number(bodyText.size),
        }
      : {
          name: "DM Sans",
          size: 16,
        },
    color_theme: "#000000",
    logo_url:
      typeof logoUrl === "string" && logoUrl.startsWith("#")
        ? ""
        : (logoUrl as string),
    header_url:
      typeof headerUrl === "string" && headerUrl.startsWith("#")
        ? ""
        : (headerUrl as string),
  });

  const handleSave = () => {
    dispatch(updateSectionTopic(sectionTitle));
    dispatch(updateSectionDescription(sDescription));
    setSurveyData((prev) => ({
      ...prev,
      topic: sectionTitle,
      description: sDescription,
    }));
    setIsEditing(false);
  };

  const handleSaveEdittedQuestion = (
    updatedQuestion: string,
    updatedOptions: string[],
    updatedQuestionType: string,
    isRequired: boolean
  ) => {
    // Ensure `editIndex` is valid
    if (editIndex === null || editIndex < 0 || editIndex >= questions.length) {
      console.error("Invalid edit index.");
      return;
    }

    // Create the updated question object with default options for boolean type
    const updatedQuestionData = {
      question: updatedQuestion,
      options:
        updatedQuestionType === "boolean" ? ["Yes", "No"] : updatedOptions,
      question_type: updatedQuestionType,
      is_required: isRequired,
    };

    console.log(updatedQuestionData);

    // Update the question in the store
    dispatch(
      updateQuestion({ index: editIndex, updatedQuestion: updatedQuestionData })
    );

    // Reset editing state
    setEditIndex(null);
    setIsEdit(false);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    // Create a new array from the questions
    const items = Array.from(questions);

    // Remove the dragged item from its original position
    const [reorderedItem] = items.splice(result.source.index, 1);

    // Insert the dragged item at its new position
    items.splice(result.destination.index, 0, reorderedItem);

    // Update the questions array in the store with the new order
    dispatch(updateQuestions(items));
  };

  const EditQuestion = async (id: any) => {
    const questionIndex = questions?.findIndex(
      (_question: any, index: any) => index === id
    );
    setEditIndex(questionIndex);
    setIsEdit(true);
    console.log(questions[questionIndex]);
    setIsSidebarOpen(false);
  };

  const handleSurveyCreation = async () => {
    if (!userToken || !user) {
      setShowAuthModal(true);
      return;
    }

    try {
      // Get current survey state
      const updatedSurvey = { ...survey }; // Create a copy to avoid direct mutation

      // Create a section with current questions if no sections exist
      // or if the current questions aren't already in a section
      const currentSection = {
        section_topic: sectionTitle,
        section_description: sDescription,
        questions: questions.map((question: Question) => {
          // Base question structure with required fields
          const baseQuestion = {
            question: question.question,
            description: question.description || question.question,
            question_type: question.question_type,
            is_required: question.is_required || false,
          };

          // Process question based on type with exact structure
          switch (question.question_type) {
            case "checkbox":
            case "multiple_choice":
            case "single_choice":
            case "drop_down":
            case "likert_scale":
            case "rating_scale":
            case "star_rating":
              return {
                ...baseQuestion,
                options: Array.isArray(question.options)
                  ? question.options
                  : [],
              };

            case "boolean":
              return {
                ...baseQuestion,
                options: ["Yes", "No"],
              };

            case "matrix_multiple_choice":
            case "matrix_checkbox":
              return {
                ...baseQuestion,
                rows: Array.isArray(question.rows) ? question.rows : [],
                columns: Array.isArray(question.columns)
                  ? question.columns
                  : [],
              };

            case "slider":
              return {
                ...baseQuestion,
                min: typeof question.min === "number" ? question.min : 1,
                max: typeof question.max === "number" ? question.max : 10,
                step: 1,
              };

            case "number":
              return {
                ...baseQuestion,
                min: typeof question.min === "number" ? question.min : 0,
                max:
                  typeof question.max === "number"
                    ? question.max
                    : Number.MAX_SAFE_INTEGER,
              };

            case "long_text":
              return {
                ...baseQuestion,
                can_accept_media: Boolean(question.can_accept_media),
              };

            case "media":
            case "short_text":
              return baseQuestion;

            default:
              return baseQuestion;
          }
        }),
      };

      // If no sections exist or if current section is different from last section
      if (
        !updatedSurvey.sections.length ||
        JSON.stringify(
          updatedSurvey.sections[updatedSurvey.sections.length - 1]
        ) !== JSON.stringify(currentSection)
      ) {
        // Create new array instead of pushing
        updatedSurvey.sections = [currentSection];
      }

      console.log(updatedSurvey.sections.length);

      // Process the final survey data
      const processedSurvey = {
        ...updatedSurvey,
        header_text: {
          ...updatedSurvey.header_text,
          size: updatedSurvey.header_text?.size || 24,
        },
        body_text: {
          ...updatedSurvey.body_text,
          size: updatedSurvey.body_text?.size || 16,
        },
        question_text: {
          ...updatedSurvey.question_text,
          size: updatedSurvey.question_text?.size || 16,
        },
        header_url:
          typeof headerUrl === "string" && headerUrl.startsWith("#")
            ? ""
            : headerUrl,
        logo_url:
          typeof logoUrl === "string" && logoUrl.startsWith("#") ? "" : logoUrl,
      };

      await createSurvey(processedSurvey).unwrap();
      setSurvey_id(createdSurveyData.data._id);
      setReview(true);
    } catch (e) {
      console.error("Survey creation error:", e);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setReview((prev) => !prev);
      dispatch(resetSurvey());
      setSurvey_id(createdSurveyData.data._id);
      setReview(true);
      // router.push("/surveys/survey-list");
    }

    if (isError || error) {
      const SaveProgress = async () => {
        try {
          await saveprogress(survey);
        } catch (e) {
          console.error(e);
        }
      };
      SaveProgress();
      toast.error(
        "Failed to create survey, Don't panic, your progress was saved"
      );
    }
  }, [isSuccess, isError, error, dispatch, router, saveprogress, survey]);

  useEffect(() => {
    if (progressSuccess) {
      router.push("/surveys/survey-list");
    }
    if (progressIsError || progressError) {
      toast.error("Failed to save progress, please try again later");
    }
  }, [progressError, progressIsError, progressSuccess]);

  const handleCancel = () => {
    // setEditIndex(null);
    setIsEdit(false);
    setIsSidebarOpen((prev) => !prev);
  };

  const handleDeleteQuestion = (id: number) => {
    const questionIndex = questions?.findIndex(
      (_question: any, index: any) => index === id
    );
    setEditIndex(questionIndex);
    dispatch(deleteQuestion({ questions, editIndex }));
  };

  const renderQuestionActions = (index: number) => {
    const showActions = isTouchDevice || hoveredQuestionIndex === index;

    if (!showActions) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute top-2 right-2 flex gap-2"
      >
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
          onClick={() => EditQuestion(index)}
        >
          <Pencil className="h-4 w-4 text-gray-500" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-red-100 rounded-full"
          onClick={() => handleDeleteQuestion(index)}
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </motion.div>
    );
  };

  const handleSaveDraft = async () => {
    try {
      await saveprogress(survey);
      toast.success("Survey saved as draft");
      if (pendingNavigation) {
        pendingNavigation();
      }
      setShowExitDialog(false);
    } catch (error) {
      toast.error("Failed to save draft");
    }
  };

  const handleRouterPush = useCallback(
    (url: string) => {
      if (questions.length > 0) {
        setShowExitDialog(true);
        setPendingNavigation(() => () => router.push(url));
        return;
      }
      router.push(url);
    },
    [survey.sections.length, router]
  );

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (questions.length > 0) {
        e.preventDefault();
        window.history.pushState(null, "", pathname);
        setShowExitDialog(true);
        setPendingNavigation(() => () => window.history.back());
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [survey.sections.length, pathname]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (questions?.length > 0) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [questions]);

  // Add this effect to intercept clicks on links
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");
      if (link) {
        const targetPath = link.getAttribute("href");
        if (targetPath && targetPath !== pathname) {
          e.preventDefault();
          handleRouterPush(targetPath);
        }
      }
    };

    document.addEventListener("click", handleClick, true); // Use capture phase
    return () => document.removeEventListener("click", handleClick, true);
  }, [handleRouterPush, pathname]);

  return (
    <div className={`${theme} flex flex-col gap-5 w-full`}>
      <div className={`flex flex-1 justify-between gap-10 w-full`}>
        <motion.div className="w-full lg:w-2/3 flex flex-col overflow-y-auto max-h-screen custom-scrollbar px-5 pr-0 lg:pl-10">
          {/* ... existing content ... */}
          <motion.div className="h-fit">
            {surveyData?.logo_url &&
              typeof surveyData.logo_url === "string" &&
              surveyData.logo_url.trim() !== "" &&
              !surveyData.logo_url.match(
                /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
              ) && (
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  className="bg-gradient-to-r rounded-lg w-16 my-5 text-white flex items-center flex-col shadow-lg hover:shadow-xl transform"
                >
                  <Image
                    src={
                      (surveyData as any)?.logo_url instanceof File
                        ? URL.createObjectURL((surveyData as any)?.logo_url)
                        : typeof surveyData?.logo_url === "string"
                        ? surveyData?.logo_url
                        : sparkly
                    }
                    alt=""
                    className="w-full object-cover rounded-lg bg-no-repeat h-16 transition-transform duration-300"
                    width={100}
                    height={200}
                  />
                </motion.div>
              )}

            {surveyData?.header_url &&
              typeof surveyData.header_url === "string" &&
              surveyData.header_url.trim() !== "" &&
              !surveyData.header_url.match(
                /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
              ) && (
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gradient-to-r rounded-lg w-full my-4 text-white h-24 flex items-center flex-col shadow-lg overflow-hidden"
                >
                  <Image
                    src={
                      (surveyData as any)?.header_url instanceof File
                        ? URL.createObjectURL((surveyData as any)?.header_url)
                        : typeof (surveyData as any)?.header_url === "string"
                        ? (surveyData as any)?.header_url
                        : sparkly
                    }
                    alt=""
                    className="w-full object-cover bg-no-repeat h-24 rounded-lg transition-transform duration-300 hover:scale-105"
                    width={100}
                    height={200}
                  />
                </motion.div>
              )}
          </motion.div>
          <AnimatePresence mode="wait">
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="w-full my-4 border-none">
                  <CardContent className="flex flex-col gap-2 px-11 py-4">
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 20, opacity: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Textarea
                        value={sectionTitle}
                        onChange={(e) => {
                          setSectionTitle(e.target.value);
                          dispatch(updateSectionTopic(e.target.value));
                        }}
                        placeholder="Untitled Section"
                        className={cn(
                          "resize-none",
                          `font-${surveyData?.header_text?.name
                            .split(" ")
                            .join("-")
                            .toLowerCase()}`
                        )}
                        style={{
                          fontSize: `${surveyData?.header_text?.size}px`,
                          // fontFamily: `${headerText?.name}`,
                        }}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 20, opacity: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Textarea
                        value={sDescription}
                        onChange={(e) => {
                          setsDescription(e.target.value);
                          dispatch(updateSectionDescription(e.target.value));
                        }}
                        placeholder="Describe section (optional)"
                        className={cn(
                          "resize-none",
                          `font-${surveyData?.body_text?.name
                            .split(" ")
                            .join("-")
                            .toLowerCase()}`
                        )}
                        style={{
                          fontSize: `${surveyData?.body_text?.size}px`,
                          // fontFamily: `${bodyText?.name}`,
                        }}
                      />
                    </motion.div>

                    <motion.div
                      className="flex justify-end gap-5 mt-4"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Button
                        variant="outline"
                        className="rounded-full flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-md hover:bg-gray-50"
                        onClick={() => setIsEditing(false)}
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                      <Button
                        className="rounded-full bg-gradient-to-r from-[#5b03b2] to-[#9d50bb] flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:brightness-110"
                        onClick={handleSave}
                        disabled={!sectionTitle.trim()}
                      >
                        <Save className="h-4 w-4" />
                        Save
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {!isEditing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg w-full my-4 flex gap-2 px-4 md:px-6 py-6 flex-col shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className={cn(
                    "text-[1.5rem] font-normal font-lexend bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] bg-clip-text text-transparent",
                    `font-${surveyData?.header_text?.name
                      .split(" ")
                      .join("-")
                      .toLowerCase()}`
                  )}
                  style={{
                    fontSize: `${surveyData?.header_text?.size}px`,
                    // fontFamily: `${surveyData?.header_text?.name}`,
                  }}
                >
                  {sectionTitle}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className={cn(
                    "text-gray-600 leading-relaxed",
                    `font-${surveyData?.body_text?.name
                      .split(" ")
                      .join("-")
                      .toLowerCase()}`
                  )}
                  style={{
                    fontSize: `${surveyData?.body_text?.size}px`,
                    // fontFamily: `${surveyData?.body_text?.name}`,
                  }}
                >
                  {sDescription}
                </motion.p>
                <motion.div
                  className="flex justify-end"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <Button
                    variant="outline"
                    className="rounded-full px-5 py-1 hover:scale-105 transition-all duration-300 hover:bg-gray-50 hover:shadow-md flex items-center gap-2"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="popLayout" custom={currentSectionIndex}>
            <motion.div
              key={currentSectionIndex}
              custom={currentSectionIndex}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={pageTransition}
            >
              <DragDropContext onDragEnd={handleDragEnd}>
                <StrictModeDroppable droppableId="questions">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {questions?.map((item: any, index: any) => (
                        <Draggable
                          key={index}
                          draggableId={index.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="mb-4 relative"
                              onMouseEnter={() =>
                                !isTouchDevice && setHoveredQuestionIndex(index)
                              }
                              onMouseLeave={() =>
                                !isTouchDevice && setHoveredQuestionIndex(null)
                              }
                              onTouchStart={() =>
                                isTouchDevice && setHoveredQuestionIndex(index)
                              }
                            >
                              {renderQuestionActions(index)}
                              {
                                // Conditionally render based on question type
                                isEdit &&
                                editIndex === index &&
                                item.question_type === "matrix_checkbox" ? (
                                  <MatrixQuestionEdit
                                    question={item.question}
                                    options={item.options}
                                    is_required={item.is_required}
                                    questionType={item.question_type}
                                    onSave={handleSaveEdittedQuestion}
                                    onCancel={handleCancel}
                                  />
                                ) : isEdit && editIndex === index ? (
                                  <MultiChoiceQuestionEdit
                                    // index={index + 1}
                                    question={item.question}
                                    options={item.options}
                                    questionType={item.question_type}
                                    is_required={item.is_required}
                                    onSave={handleSaveEdittedQuestion}
                                    onCancel={handleCancel}
                                    surveyData={surveyData}
                                  />
                                ) : item.question_type === "multiple_choice" ? (
                                  <MultiChoiceQuestion
                                    key={index}
                                    index={index + 1}
                                    question={item.question}
                                    options={item.options}
                                    questionType={item.question_type}
                                    EditQuestion={() => EditQuestion(index)}
                                    DeleteQuestion={() =>
                                      handleDeleteQuestion(index)
                                    }
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
                                    DeleteQuestion={() =>
                                      handleDeleteQuestion(index)
                                    }
                                    surveyData={surveyData}
                                  />
                                ) : item.question_type === "checkbox" ? (
                                  <CheckboxQuestion
                                    key={index}
                                    index={index + 1}
                                    question={item.question}
                                    options={item.options}
                                    questionType={item.question_type}
                                    EditQuestion={() => EditQuestion(index)}
                                    DeleteQuestion={() =>
                                      handleDeleteQuestion(index)
                                    }
                                    surveyData={surveyData}
                                  />
                                ) : item.question_type === "rating_scale" ? (
                                  <RatingScaleQuestion
                                    key={index}
                                    index={index + 1}
                                    question={item.question}
                                    options={item.options}
                                    questionType={item.question_type}
                                    EditQuestion={() => EditQuestion(index)}
                                    DeleteQuestion={() =>
                                      handleDeleteQuestion(index)
                                    }
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
                                    DeleteQuestion={() =>
                                      handleDeleteQuestion(index)
                                    }
                                    surveyData={surveyData}
                                  />
                                ) : item.question_type === "number" ? (
                                  <NumberQuestion
                                    key={index}
                                    index={index + 1}
                                    question={item.question}
                                    questionType={item.question_type}
                                    EditQuestion={() => EditQuestion(index)}
                                    surveyData={surveyData}
                                  />
                                ) : item.question_type === "long_text" ? (
                                  <CommentQuestion
                                    key={index}
                                    index={index + 1}
                                    question={item.question}
                                    questionType={item.question_type}
                                    EditQuestion={() => EditQuestion(index)}
                                    surveyData={surveyData}
                                  />
                                ) : item.question_type === "media" ? (
                                  <MediaQuestion
                                    key={index}
                                    index={index + 1}
                                    question={item.question}
                                    questionType={item.question_type}
                                    EditQuestion={() => EditQuestion(index)}
                                  />
                                ) : item.question_type === "short_text" ? (
                                  <ShortTextQuestion
                                    key={index}
                                    index={index + 1}
                                    question={item.question}
                                    questionType={item.question_type}
                                    EditQuestion={() => EditQuestion(index)}
                                    surveyData={surveyData}
                                  />
                                ) : item.question_type === "likert_scale" ? (
                                  <LikertScaleQuestion
                                    key={index}
                                    index={index + 1}
                                    question={item.question}
                                    options={item.options}
                                    questionType={item.question_type}
                                    EditQuestion={() => EditQuestion(index)}
                                    surveyData={surveyData}
                                  />
                                ) : item.question_type === "star_rating" ? (
                                  <StarRatingQuestion
                                    question={item.question}
                                    // maxRating={5}
                                    index={index + 1}
                                    questionType={item.question_type}
                                    EditQuestion={() => EditQuestion(index)}
                                    DeleteQuestion={() =>
                                      handleDeleteQuestion(index)
                                    }
                                    surveyData={surveyData}
                                  />
                                ) : item.question_type === "matrix_checkbox" ? (
                                  <MatrixQuestion
                                    key={index}
                                    index={index + 1}
                                    // options={item.options}
                                    rows={item.rows}
                                    columns={item.columns}
                                    question={item.question}
                                    is_required={item.is_required}
                                    questionType={item.question_type}
                                    DeleteQuestion={() =>
                                      handleDeleteQuestion(index)
                                    }
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
                                    DeleteQuestion={() =>
                                      handleDeleteQuestion(index)
                                    }
                                    surveyData={surveyData}
                                  />
                                ) : item.question_type === "slider" ? (
                                  <SliderQuestion
                                    question={item.question}
                                    options={item.options}
                                    // step={item.options.length}
                                    questionType={item.question_type}
                                    index={index + 1}
                                    is_required={item.is_required}
                                    surveyData={surveyData}
                                  />
                                ) : null
                              }
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </StrictModeDroppable>
              </DragDropContext>
              {addQuestions && (
                <AddQuestion
                  onCancel={() => setAddQuestions((prev) => !prev)}
                  onSave={(
                    question,
                    options,
                    questionType,
                    is_required,
                    min,
                    max,
                    rows,
                    columns,
                    can_accept_media
                  ) => {
                    if (questionType === "number") {
                      const newQuestion = {
                        question: question,
                        question_type: questionType,
                        options: options,
                        is_required: is_required,
                        min: min,
                        max: max,
                      };
                      console.log(newQuestion);
                      dispatch(addQuestion(newQuestion));
                      setAddQuestions((prev) => !prev);
                    } else if (questionType === "matrix_checkbox") {
                      const newQuestion = {
                        question: question,
                        question_type: questionType,
                        options: options,
                        is_required: is_required,
                        rows: rows,
                        columns: columns,
                      };
                      console.log(newQuestion);
                      dispatch(addQuestion(newQuestion));
                      setAddQuestions((prev) => !prev);
                    } else if (questionType === "long_text") {
                      const newQuestion = {
                        question: question,
                        question_type: questionType,
                        options: options,
                        is_required: is_required,
                        can_accept_media: can_accept_media,
                      };
                      console.log(newQuestion);
                      dispatch(addQuestion(newQuestion));
                      setAddQuestions((prev) => !prev);
                    } else {
                      const newQuestion = {
                        question: question,
                        question_type: questionType,
                        options: options,
                        is_required: is_required,
                      };
                      console.log(newQuestion);
                      dispatch(addQuestion(newQuestion));
                      setAddQuestions((prev) => !prev);
                    }
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-col space-y-6 pb-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="group transition-all duration-300 scale-95 hover:scale-100 hover:shadow rounded-full flex gap-2 items-center justify-center"
                  onClick={() => setAddQuestions((prev) => !prev)}
                >
                  <HiOutlinePlus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
                  Add Question
                </Button>

                {/* <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!questions || questions.length === 0}
                      className="group transition-all duration-300 scale-95 hover:scale-100 hover:shadow rounded-full"
                      onClick={handleAddSection}
                    >
                      <RxCardStack className="mr-2 h-4 w-4 group-hover:translate-y-[-2px]" />
                      Add Section
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {!questions || questions.length === 0
                      ? "Add at least one question before creating a new section"
                      : "Create a new section with your current questions"}
                  </TooltipContent>
                </Tooltip>

                {sections.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="group transition-all duration-300 scale-95 hover:scale-100 hover:shadow rounded-full hover:bg-red-50 hover:text-red-500 "
                    onClick={() => handleDeleteSection(currentSectionIndex)}
                  >
                    <RiDeleteBin6Line className="mr-2 h-4 w-4 group-hover:text-red-500" />
                    Delete Section
                  </Button>
                )} */}

                <Button
                  variant="outline"
                  size="sm"
                  className="group transition-all duration-300 scale-95 hover:scale-100 hover:shadow rounded-full"
                  onClick={handleDiscard}
                >
                  <GiCardDiscard className="mr-2 h-4 w-4 group-hover:rotate-12" />
                  Discard
                </Button>
              </div>

              <div className="flex items-center gap-2">
                {sections.map((_, index) => (
                  <Fragment key={index}>
                    {sections.length > 1 && (
                      <Button
                        key={index}
                        variant={
                          index === currentSectionIndex ? "default" : "outline"
                        }
                        size="sm"
                        className={`size-6 rounded-full transition-all duration-300 scale-95 hover:scale-100 hover:shadow-md ${
                          index === currentSectionIndex
                            ? "bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] text-white"
                            : "hover:bg-gradient-to-r hover:from-[#5B03B2]/10 hover:to-[#9D50BB]/10"
                        }`}
                        onClick={() => setCurrentSectionIndex(index)}
                      >
                        {index + 1}
                      </Button>
                    )}
                  </Fragment>
                ))}
              </div>
            </div>

            <Button
              disabled={
                isLoading ||
                !Boolean(sectionTopic.trim().length) ||
                !Boolean(sectionDescription?.trim().length) ||
                !questions.length
              }
              size="lg"
              className="w-full md:w-auto md:self-end bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] text-white hover:opacity-90 transition-all duration-300 scale-95 hover:scale-100 hover:shadow-lg rounded-xl"
              onClick={handleSurveyCreation}
            >
              {isLoading ? (
                <div className="flex gap-2 items-center">
                  <div className="h-4 w-4 border-2 border-white rounded-full border-t-transparent animate-spin" />
                  Publishing...
                </div>
              ) : (
                <div className="flex gap-2 items-center justify-center">
                  <VscLayersActive className="mr-2 h-5 w-5 animate-pulse" />
                  Publish Survey
                </div>
              )}
            </Button>
          </div>
          <WatermarkBanner />
        </motion.div>
        <div
          className={`hidden lg:flex lg:w-1/3 overflow-y-auto max-h-screen custom-scrollbar bg-white`}
        >
          {/* {isSidebar ? <StyleEditor /> : <QuestionType />} */}
          <StyleEditor surveyData={surveyData} setSurveyData={setSurveyData} />
        </div>
      </div>

      {/* Delete Section Confirmation Modal */}
      <Dialog
        open={showDeleteModal}
        onOpenChange={() => setShowDeleteModal(false)}
      >
        <DialogContent className="z-[100000]" overlayClassName="z-[100000]">
          <DialogHeader>
            <DialogTitle>Delete Section</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this section? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteSection}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Discard Survey Confirmation Modal */}
      <Dialog
        open={showDiscardModal}
        onOpenChange={() => setShowDiscardModal(false)}
      >
        <DialogContent className="z-[100000]" overlayClassName="z-[100000]">
          <DialogHeader>
            <DialogTitle>Discard Survey</DialogTitle>
            <DialogDescription>
              Are you sure you want to discard this survey? All progress will be
              lost.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowDiscardModal(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDiscard}>
              Discard
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ... rest of your existing modals ... */}
      {review && (
        <ReviewModal
          survey_id={survey_id}
          openModal={review}
          onClose={() => {
            setReview((prev) => !prev);
            router.push("/surveys/survey-list");
          }}
        />
      )}
      <Dialog
        open={(!userToken || !user) && showAuthModal}
        onOpenChange={() => setShowAuthModal(false)}
      >
        <DialogContent
          className="max-w-md z-[100000]"
          overlayClassName="z-[100000]"
        >
          <DialogHeader>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <IoDocumentOutline className="w-8 h-8 text-purple-600" />
              </div>
              <DialogTitle className="text-2xl font-semibold text-gray-900">
                Authentication Required
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                To continue creating your survey and access all features, please
                log in to your account or sign up if you&apos;re new here.
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="flex flex-col w-full gap-3 pt-2">
            <Button
              onClick={() => router.push("/login?ed=3")}
              className="w-full bg-gradient-to-r from-[#5b03b2] to-[#9d50bb] text-white hover:opacity-90 transition-opacity"
            >
              Log In
            </Button>

            <Button
              onClick={() => router.push("/register?ed=3")}
              variant="outline"
              className="w-full border border-purple-600 text-purple-600 hover:bg-purple-50 transition-colors"
            >
              Sign Up
            </Button>
          </div>

          <p className="text-sm text-gray-500 text-center pt-4">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </DialogContent>
      </Dialog>
      <ExitSurveyDialog
        isLoading={isLoading}
        isOpen={showExitDialog}
        onClose={() => {
          setShowExitDialog(false);
          setPendingNavigation(null);
        }}
        onSave={handleSaveDraft}
        onClear={handleDiscard}
      />
    </div>
  );
};

export default AddQuestionPage;
