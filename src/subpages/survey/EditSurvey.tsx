"use client";

import { RootState } from "@/redux/store";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import StyleEditor from "./StyleEditor";
import QuestionType from "./QuestionType";
import { HiOutlinePlus } from "react-icons/hi";
import { IoDocumentOutline } from "react-icons/io5";
import {
  useCreateSurveyMutation,
  useGenerateSingleSurveyMutation,
  useSaveProgressMutation,
} from "@/services/survey.service";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import CreateNewSection from "./CreateNewSection";
import { useRouter, usePathname } from "next/navigation";
import {
  deleteQuestionFromSection,
  resetSurvey,
  updateSection,
  updateSurvey,
  addSection,
  deleteSection,
  setSkipLogic,
} from "@/redux/slices/survey.slice";
import store from "@/redux/store";
import PaginationBtn from "@/components/common/PaginationBtn";
import { AnimatePresence, motion } from "framer-motion";
import SenseiMaster from "@/components/sensei-master/SenseiMaster";
import WaitingMessagesModal from "@/components/modals/WaitingModal";
import ReviewModal from "@/components/modals/ReviewModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import QuestionRenderer from "@/components/survey/QuestionRenderer";
import SurveyHeader from "@/components/survey/SurveyHeader";
import {
  handleRequiredToggle,
  processNewSurveyQuestions,
} from "@/utils/surveyUtils";
import {
  ArrowRight,
  Loader2,
  PencilIcon,
  Sheet,
  Sparkles,
  TableRowsSplit,
  Trash2,
  Wand2,
  Scissors,
  MoveRight,
  MoreVertical,
  SquareMenu,
  BringToFront,
  Paintbrush,
  AlignVerticalSpaceAround,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/shadcn-input";
import WatermarkBanner from "@/components/common/WatermarkBanner";
import type { Question } from "@/types/survey";
import { SurveyData } from "./EditSubmittedSurvey";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import ExitSurveyDialog from "@/components/dialogs/ExitSurveyDialog";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable } from "@/components/ui/StrictModeDroppable";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SkipLogicEditor, { SkipLogicRule } from "./SkipLogicEditor";

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

// Define Section type locally since it's not exported from the slice
interface Section {
  section_topic?: string;
  section_description?: string;
  questions: any[];
  header_text?: { name: string; size: number };
  body_text?: { name: string; size: number };
}

// Animated divider component for cutting sections
const CutSectionDivider = ({ onCut }: { onCut: () => void }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <motion.div
      className="relative flex items-center z-[1000] justify-center w-full"
      initial={false}
      animate={hovered ? "hovered" : "initial"}
      variants={{
        initial: { height: 24 },
        hovered: {
          height: 48,
          transition: { type: "spring", stiffness: 200, damping: 18 },
        },
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ minHeight: 12 }}
    >
      {/* Reveal divider only on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            key="divider"
            initial={{ scaleX: 0, opacity: 0, y: 10 }}
            animate={{
              scaleX: 1,
              opacity: 1,
              y: 0,
              transition: { type: "spring", stiffness: 300, damping: 18 },
            }}
            exit={{
              scaleX: 0,
              opacity: 0,
              y: -10,
              transition: { duration: 0.3, ease: "easeInOut" },
            }}
            className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-pink-200 via-purple-400 to-pink-200 rounded-full shadow-lg z-0"
            style={{ pointerEvents: "none" }}
          />
        )}
      </AnimatePresence>
      {/* Reveal button only on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.button
            key="scissors"
            initial={{ scale: 0.5, opacity: 0, rotate: -30, y: 20 }}
            animate={{
              scale: 1,
              opacity: 1,
              rotate: 0,
              y: 0,
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 18,
                delay: 0.08,
              },
            }}
            exit={{
              scale: 0.5,
              opacity: 0,
              rotate: 30,
              y: -20,
              transition: { duration: 0.25, ease: "circIn" },
            }}
            className="absolute -top-7 mx-auto bg-white border border-pink-300 shadow-lg rounded-full p-2 z-10 hover:bg-pink-100 active:scale-95 focus:outline-none focus:ring-2 focus:ring-pink-400"
            onClick={onCut}
            aria-label="Cut and create new section"
            whileTap={{ scale: 0.85, rotate: -10 }}
          >
            <Scissors className="w-6 h-6 text-pink-600" />
          </motion.button>
        )}
      </AnimatePresence>
      {/* Tooltip on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            key="tooltip"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }}
            exit={{ opacity: 0, y: 10, transition: { duration: 0.18 } }}
            className="absolute mx-auto w-fit top-10 bg-white px-3 py-1 rounded shadow text-xs text-pink-700 font-medium border border-pink-200"
          >
            Cut here & create new section
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const EditSurvey = () => {
  // const question = useSelector((state: RootState) => state.question);
  const survey = useSelector((state: RootState) => state.survey);
  const questions = useSelector((state: RootState) => state?.survey?.sections);
  const headerUrl = useSelector(
    (state: RootState) => state?.survey?.header_url
  );
  const logoUrl = useSelector((state: RootState) => state?.survey?.logo_url);
  const theme = useSelector((state: RootState) => state?.survey?.theme);
  const user = useSelector((state: RootState) => state?.user?.user);
  const userToken = useSelector(
    (state: RootState) => state?.user?.access_token || state?.user.token
  );
  const headerText = useSelector(
    (state: RootState) => state.survey.header_text
  );
  const bodyText = useSelector((state: RootState) => state.survey.body_text);
  const [isEdit, setIsEdit] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [aiChatbot, setAiChatbot] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [
    createSurvey,
    { data: createdSurveyData, isLoading, isSuccess, isError, error },
  ] = useCreateSurveyMutation();
  const [
    saveprogress,
    {
      isLoading: isSavingProgress,
      isSuccess: progressSuccess,
      isError: progressIsError,
      error: progressError,
    },
  ] = useSaveProgressMutation();
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isSidebar, setIsSidebarOpen] = useState(true);
  const [
    generateSingleSurvey,
    {
      data: newSingleSurvey,
      isLoading: generatingSingleSurvey,
      isSuccess: newQuestionGenerate,
    },
  ] = useGenerateSingleSurveyMutation();
  const [isNewSection, setIsNewSection] = useState(true);
  const [selectIndex, setSelectIndex] = useState<number | null>(null);
  const [question_count, setQuestionCount] = useState<number>(0);
  const [addMoreQuestion, setAddMoreQuestion] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [review, setReview] = useState(false);
  const [survey_id, setSurvey_id] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<
    (() => void) | null
  >(null);

  const [surveyData, setSurveyData] = useState<SurveyData>({
    topic: "",
    description: "",
    sections: [],
    theme: "",
    header_text: { name: "", size: 24 },
    question_text: { name: "", size: 18 },
    body_text: { name: "", size: 16 },
    color_theme: "#5B03B2",
    logo_url: "",
    header_url: "",
  });

  // Add state to store the current edit values
  const [editQuestionValue, setEditQuestionValue] = useState<string>("");
  const [editOptionsValue, setEditOptionsValue] = useState<string[]>([]);
  const [editQuestionTypeValue, setEditQuestionTypeValue] =
    useState<string>("");
  const [editIsRequiredValue, setEditIsRequiredValue] =
    useState<boolean>(false);

  // Add state to track header edit mode and values
  const [isHeaderEditing, setIsHeaderEditing] = useState(false);
  const [headerEditValue, setHeaderEditValue] = useState<any>(null);
  const [bodyEditValue, setBodyEditValue] = useState<any>(null);

  // Add this state near other useState declarations
  const [aiTargetSectionIndex, setAiTargetSectionIndex] = useState<
    number | null
  >(null);

  const [slideDirection, setSlideDirection] = useState<"left" | "right">(
    "right"
  );

  const skipLogic = useSelector((state: RootState) => state.survey.skipLogic);

  const handleClearSurvey = () => {
    dispatch(resetSurvey());
    setShowClearDialog(false);
    setShowExitDialog(false);
    toast.success("Survey cleared successfully", {
      position: "bottom-right",
    });
    if (pendingNavigation) {
      pendingNavigation();
    }
    router.push("/surveys/survey-list");
  };

  const EditQuestion = (index: any) => {
    setEditIndex(index);
    setIsEdit(true);
    setIsSidebarOpen(false);
    setAiChatbot(true);
    setSelectIndex(index);
    // Set current edit values
    const currentQ = questions[currentSection]?.questions[index];
    if (currentQ) {
      setEditQuestionValue(currentQ.question);
      setEditOptionsValue(currentQ.options || []);
      setEditQuestionTypeValue(currentQ.question_type);
      setEditIsRequiredValue(currentQ.is_required);
    }
  };

  const navigatePage = (direction: any) => {
    if (isEdit && editIndex !== null) {
      handleSave(
        editQuestionValue,
        editOptionsValue,
        editQuestionTypeValue,
        editIsRequiredValue,
        editIndex
      );
    }
    saveHeaderIfEditing();
    setSlideDirection(direction === "next" ? "right" : "left");
    setCurrentSection((prevIndex) => {
      if (direction === "next") {
        return prevIndex < questions.length - 1 ? prevIndex + 1 : prevIndex;
      } else {
        return prevIndex > 0 ? prevIndex - 1 : prevIndex;
      }
    });
  };

  const handleSave = (
    updatedQuestion: string,
    updatedOptions: string[],
    updatedQuestionType: string,
    isRequired: boolean,
    aiEditIndex?: number
  ) => {
    const updatedSections = [...questions];
    const currentSectionData = updatedSections[currentSection];

    if (editIndex !== null && currentSectionData) {
      console.log(editIndex);

      const updatedQuestionData = {
        ...currentSectionData.questions[editIndex],
        question: updatedQuestion,
        options: updatedOptions,
        question_type: updatedQuestionType,
        is_required: isRequired,
      };
      const updatedSection = {
        ...currentSectionData,
        questions: currentSectionData.questions.map((q, idx) =>
          idx === editIndex ? updatedQuestionData : q
        ),
      };
      dispatch(
        updateSection({ index: currentSection, newSection: updatedSection })
      );
      setEditIndex(null);
      setIsEdit(false);
    }

    if (editIndex && currentSectionData) {
      console.log(currentSectionData);

      const updatedQuestionData = {
        ...currentSectionData.questions[editIndex],
        question: updatedQuestion,
        options: updatedOptions,
        question_type: updatedQuestionType,
        is_required: isRequired,
      };

      const updatedSection = {
        ...currentSectionData,
        questions: currentSectionData.questions.map((q, idx) =>
          idx === editIndex ? updatedQuestionData : q
        ),
      };
      dispatch(
        updateSection({ index: currentSection, newSection: updatedSection })
      );
      setEditIndex(null);
      setIsEdit(false);
    }

    setIsSidebarOpen((prev) => !prev);
    setAiChatbot((prev) => !prev);
    // Reset edit values
    setEditQuestionValue("");
    setEditOptionsValue([]);
    setEditQuestionTypeValue("");
    setEditIsRequiredValue(false);
  };

  const handleAISave = (
    updatedQuestion: string,
    updatedOptions: string[],
    updatedQuestionType: string,
    aiEditIndex?: number
  ) => {
    const updatedSections = [...questions];
    const currentSectionData = updatedSections[currentSection];

    if (aiEditIndex !== null && currentSectionData) {
      console.log(aiEditIndex);

      const updatedQuestionData = {
        ...currentSectionData.questions[aiEditIndex!],
        question: updatedQuestion,
        options: updatedOptions,
        question_type: updatedQuestionType,
        is_required:
          currentSectionData.questions[aiEditIndex!]?.is_required || false,
      };
      const updatedSection = {
        ...currentSectionData,
        questions: currentSectionData.questions.map((q, idx) =>
          idx === aiEditIndex ? updatedQuestionData : q
        ),
      };
      dispatch(
        updateSection({ index: currentSection, newSection: updatedSection })
      );
      setIsEdit(false);
    }

    if (aiEditIndex && currentSectionData) {
      console.log(currentSectionData);

      const updatedQuestionData = {
        ...currentSectionData.questions[aiEditIndex],
        question: updatedQuestion,
        options: updatedOptions,
        question_type: updatedQuestionType,
        is_required:
          currentSectionData.questions[aiEditIndex]?.is_required || false,
      };

      const updatedSection = {
        ...currentSectionData,
        questions: currentSectionData.questions.map((q, idx) =>
          idx === aiEditIndex ? updatedQuestionData : q
        ),
      };
      dispatch(
        updateSection({ index: currentSection, newSection: updatedSection })
      );
      setIsEdit(false);
    }

    setIsSidebarOpen((prev) => !prev);
    setAiChatbot((prev) => !prev);
  };

  const handleDeleteQuestion = (index: number) => {
    dispatch(
      deleteQuestionFromSection({
        sectionIndex: currentSection,
        questionIndex: index,
      })
    );
  };

  const handleCancel = () => {
    setEditIndex(null);
    setIsEdit(false);
    setIsSidebarOpen((prev) => !prev);
    setAiChatbot(false);
  };

  const handleGenerateSingleQuestion = async () => {
    try {
      // aiTargetSectionIndex should already be set when opening the dialog
      await generateSingleSurvey({
        conversation_id: survey.conversation_id,
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

  useEffect(() => {
    if (
      newQuestionGenerate &&
      Array.isArray((newSingleSurvey as any)?.data?.response) &&
      aiTargetSectionIndex !== null
    ) {
      const newQuestions = processNewSurveyQuestions(
        (newSingleSurvey as any).data.response
      );

      const updatedSections = [...questions];
      const targetSectionData = updatedSections[aiTargetSectionIndex];

      const updatedQuestions = [
        ...targetSectionData.questions,
        ...newQuestions,
      ];
      const updatedSection = {
        ...targetSectionData,
        questions: updatedQuestions,
      };

      dispatch(
        updateSection({
          index: aiTargetSectionIndex,
          newSection: updatedSection,
        })
      );
      setAiTargetSectionIndex(null); // Reset after use
    }
  }, [dispatch, newQuestionGenerate, newSingleSurvey]);

  const handleSurveyCreation = async () => {
    // Check if all sections have at least one question
    const hasEmptySection = questions.some(
      (section: Section) => !section.questions || section.questions.length === 0
    );
    if (hasEmptySection) {
      toast.error(
        "All sections must have at least one question before submitting."
      );
      return;
    }

    if (!userToken || !user) {
      setShowAuthModal(true);
      return;
    }

    try {
      // Get base survey state
      const updatedSurvey = store.getState().survey;

      // Process survey to ensure questions match their type structure
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
          typeof surveyData.header_url === "string" &&
          surveyData.header_url.startsWith("#")
            ? ""
            : surveyData.header_url,
        logo_url:
          typeof surveyData.logo_url === "string" &&
          surveyData.logo_url.startsWith("#")
            ? ""
            : surveyData.logo_url,
        sections: updatedSurvey.sections.map((section, idx) => {
          // For the first section, do not include section_topic/section_description
          const baseSection = {
            questions: section.questions.map((question: Question) => {
              // Check if empty question type but has matrix structure
              if (
                !question.question_type &&
                question.rows?.length &&
                question.columns?.length
              ) {
                return {
                  ...question,
                  question_type: "matrix_multiple_choice",
                  description: question.description || "Matrix Question",
                } as Question;
              }
              const baseQuestion = {
                question: question.question,
                description: question?.description || question.question,
                question_type: question.question_type,
                is_required: question.is_required,
              } as Question;
              switch (question.question_type) {
                case "slider":
                  const extractRange = (questionText: string) => {
                    const numberWords: { [key: string]: number } = {
                      one: 1,
                      two: 2,
                      three: 3,
                      four: 4,
                      five: 5,
                      six: 6,
                      seven: 7,
                      eight: 8,
                      nine: 9,
                      ten: 10,
                    };
                    let processedText = questionText.toLowerCase();
                    Object.entries(numberWords).forEach(([word, num]) => {
                      processedText = processedText.replace(
                        new RegExp(word, "g"),
                        num.toString()
                      );
                    });
                    const match = processedText.match(
                      /(\d+)\s*(?:-|to|\.\.|points?\s*=.*?\/\s*|points?\s*=.*?)\s*(\d+)/i
                    );
                    return match
                      ? {
                          min: parseInt(match[1]),
                          max: parseInt(match[2]),
                        }
                      : { min: 0, max: 10 };
                  };
                  const range = extractRange(question.question);
                  return {
                    ...baseQuestion,
                    min: range.min,
                    max: range.max,
                    step: 1,
                  } as Question;
                case "checkbox":
                case "multiple_choice":
                case "single_choice":
                case "drop_down":
                case "likert_scale":
                case "rating_scale":
                case "star_rating":
                case "boolean":
                  return {
                    ...baseQuestion,
                    options: question.options,
                  } as Question;
                case "matrix_multiple_choice":
                case "matrix_checkbox":
                  return {
                    ...baseQuestion,
                    description: question.description || "Matrix Question",
                    rows:
                      question.rows ||
                      (question as any)?.Rows ||
                      (question?.options as any)?.Rows,
                    columns:
                      question.columns ||
                      (question as any)?.Columns ||
                      (question?.options as any)?.Columns,
                  } as Question;
                case "number":
                  return {
                    ...baseQuestion,
                    min: (question as Question).min,
                    max: question.max,
                  } as Question;
                case "long_text":
                  return {
                    ...baseQuestion,
                    can_accept_media:
                      (question as Question).can_accept_media || false,
                  } as Question;
                case "short_text":
                case "media":
                default:
                  return baseQuestion;
              }
            }),
          };
          if (idx === 0) {
            // First section: do not include section_topic/section_description
            return baseSection;
          } else {
            // Other sections: include section_topic/section_description
            return {
              section_topic: section.section_topic,
              section_description: section.section_description,
              ...baseSection,
            };
          }
        }),
      };
      console.log(processedSurvey);
      await createSurvey(processedSurvey).unwrap();
      handleClearSurvey();
      setSurvey_id(createdSurveyData.data._id);
      setReview(true);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setReview((prev) => !prev);
      toast.success("Survey created successfully");
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
  }, [progressError, progressIsError]);

  // Update the handleNavigation function
  const handleNavigation = useCallback(
    (targetPath: string, e?: any) => {
      if (survey.sections.length > 0) {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        setShowExitDialog(true);
        setPendingNavigation(() => () => router.push(targetPath));
        return false;
      }
      return true;
    },
    [survey.sections.length]
  );

  // Update the click handler
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");
      if (link) {
        const targetPath = link.getAttribute("href");
        if (targetPath && targetPath !== pathname) {
          handleNavigation(targetPath, e);
        }
      }
    };

    document.addEventListener("click", handleClick, true); // Add capture phase
    return () => document.removeEventListener("click", handleClick, true);
  }, [handleNavigation, pathname]);

  // Update the popstate handler
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (survey.sections.length > 0) {
        e.preventDefault();
        window.history.pushState(null, "", pathname); // Push current path back
        setShowExitDialog(true);
        // setPendingNavigation(() => () => window.history.back());
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [survey.sections.length, pathname]);

  // Keep the beforeunload handler for tab/window closing
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (survey.sections.length > 0) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [survey]);

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

  // Add this middleware pattern
  const handleRouterPush = (url: string) => {
    if (survey.sections.length > 0) {
      setShowExitDialog(true);
      setPendingNavigation(() => () => router.push(url));
      return;
    }
    router.push(url);
  };

  const handleRemoveSection = () => {
    if (questions.length > 1) {
      dispatch(deleteSection(currentSection));
      // Move to previous section if not first, else stay at 0
      setCurrentSection((prev) => (prev > 0 ? prev - 1 : 0));
    }
  };

  // Add a function to save the header if editing
  const saveHeaderIfEditing = () => {
    if (isHeaderEditing) {
      if (currentSection === 0) {
        setSurveyData((prev) => ({
          ...prev,
          header_text: headerEditValue || prev.header_text,
          body_text: bodyEditValue || prev.body_text,
        }));
      } else {
        const section = questions[currentSection];
        dispatch(
          updateSection({
            index: currentSection,
            newSection: {
              ...section,
              ...{
                header_text: headerEditValue || (section as any).header_text,
                body_text: bodyEditValue || (section as any).body_text,
              },
            },
          })
        );
      }
      setIsHeaderEditing(false);
    }
  };

  // In safeSetCurrentSection and navigatePage, call saveHeaderIfEditing before switching
  const safeSetCurrentSection = (newSection: number) => {
    if (isEdit && editIndex !== null) {
      handleSave(
        editQuestionValue,
        editOptionsValue,
        editQuestionTypeValue,
        editIsRequiredValue,
        editIndex
      );
    }
    saveHeaderIfEditing();
    setCurrentSection(newSection);
  };

  // Drag and drop handler for reordering questions
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const section = questions[currentSection];
    const items = Array.from(section.questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    const updatedSection = { ...section, questions: items };
    dispatch(
      updateSection({ index: currentSection, newSection: updatedSection })
    );
  };

  // Utility: validate skipLogic rules against current questions
  useEffect(() => {
    if (!Array.isArray(skipLogic) || skipLogic.length === 0) return;
    const isValid = skipLogic.every((rule) => {
      // Check from section/question
      const fromSection = questions[rule.from.sectionIndex];
      if (!fromSection) return false;
      const fromQuestion = fromSection.questions[rule.from.questionIndex];
      if (!fromQuestion) return false;
      // Check answer
      const options =
        Array.isArray(fromQuestion.options) && fromQuestion.options.length > 0
          ? fromQuestion.options
          : fromQuestion.question_type === "boolean"
          ? ["Yes", "No"]
          : ["Any answer"];
      if (!options.includes(rule.from.answer)) return false;
      // Check target
      if ("end" in rule.to) return true;
      const toSection = questions[rule.to.sectionIndex];
      if (!toSection) return false;
      const toQuestion = toSection.questions[rule.to.questionIndex ?? 0];
      if (!toQuestion) return false;
      return true;
    });
    if (!isValid) {
      dispatch(setSkipLogic([]));
    }
  }, [questions, skipLogic, dispatch]);

  return (
    <div className={`${theme} flex flex-col gap-5 w-full relative`}>
      <div className={`${theme} flex justify-between gap-6 w-full`}>
        <div className="lg:w-2/3 flex flex-col overflow-y-auto max-h-screen custom-scrollbar px-4 sm:px- lg:pl-6">
          {/* {isNewSection ? ( */}
          <motion.div
            key={currentSection}
            initial={
              slideDirection === "right"
                ? { x: 100, opacity: 0 }
                : { x: -100, opacity: 0 }
            }
            animate={{ x: 0, opacity: 1 }}
            exit={
              slideDirection === "right"
                ? { x: -100, opacity: 0 }
                : { x: 100, opacity: 0 }
            }
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="w-full">
              <DragDropContext onDragEnd={handleDragEnd}>
                <StrictModeDroppable droppableId="questions">
                  {(provided: any) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {(() => {
                        if (currentSection === 0) {
                          return (
                            <div className="flex items-center justify-between">
                              <SurveyHeader
                                logoUrl={surveyData.logo_url}
                                headerUrl={surveyData.header_url}
                                survey={survey}
                                headerText={survey.header_text}
                                bodyText={survey.body_text}
                                canEdit={true}
                                onSave={(localHeaderText, localBodyText) => {
                                  setSurveyData((prev) => ({
                                    ...prev,
                                    header_text: localHeaderText,
                                    body_text: localBodyText,
                                  }));
                                }}
                                isEdit={isHeaderEditing}
                              />
                            </div>
                          );
                        } else {
                          const section = questions[currentSection];
                          return (
                            <div className="flex items-center justify-between">
                              <SurveyHeader
                                logoUrl={surveyData.logo_url}
                                headerUrl={surveyData.header_url}
                                survey={{
                                  ...survey,
                                  topic: section?.section_topic,
                                  description: section?.section_description,
                                }}
                                headerText={
                                  "header_text" in section
                                    ? section.header_text
                                    : survey?.header_text
                                }
                                bodyText={
                                  "body_text" in section
                                    ? section.body_text
                                    : survey?.body_text
                                }
                                canEdit={true}
                                onSave={(_localHeaderText, _localBodyText) => {
                                  dispatch(
                                    updateSection({
                                      index: currentSection,
                                      newSection: {
                                        ...section,
                                        section_topic:
                                          _localHeaderText?.value ||
                                          section.section_topic,
                                        section_description:
                                          _localBodyText?.value ||
                                          section.section_description,
                                        ...({
                                          header_text: _localHeaderText,
                                          body_text: _localBodyText,
                                        } as any),
                                      },
                                    })
                                  );
                                }}
                                isEdit={isHeaderEditing}
                              />
                            </div>
                          );
                        }
                      })()}
                      {questions[currentSection]?.questions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200 my-6">
                          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 mb-4">
                            <HiOutlinePlus className="w-8 h-8 text-purple-600" />
                          </div>
                          <h3 className="text-xl font-semibold mb-2 text-gray-800">
                            No questions yet
                          </h3>
                          <p className="text-gray-500 mb-6 max-w-xs mx-auto">
                            Click the{" "}
                            <span className="font-semibold text-purple-700">
                              Add Question
                            </span>{" "}
                            button below to start building your survey section.
                          </p>
                          <Button
                            variant="outline"
                            className="px-0 relative rounded-full transition-all duration-200 border-none overflow-hidden"
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
                                      id="add-question-btn"
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

                                        dispatch(
                                          updateSection({
                                            index: currentSection,
                                            newSection: updatedSection,
                                          })
                                        );
                                        setEditIndex(
                                          currentSectionData.questions.length
                                        );
                                        setIsEdit(true);
                                      }}
                                      className="gap-2"
                                    >
                                      <PencilIcon className="h-4 w-4" />
                                      <span>Add Manually</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setAiTargetSectionIndex(currentSection);
                                        setAddMoreQuestion(true);
                                      }}
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
                      ) : (
                        questions[currentSection]?.questions.map(
                          (item: any, index: number) => (
                            <Draggable
                              key={index}
                              draggableId={index.toString()}
                              index={index}
                              isDragDisabled={isEdit} // Disable drag when editing
                            >
                              {(provided, snapshot) => (
                                <React.Fragment key={index}>
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className={`relative ${
                                      snapshot.isDragging ? "" : ""
                                    }`}
                                  >
                                    <div className="flex items-start group">
                                      <div className="flex flex-col">
                                        {/* Drag handle */}
                                        <div
                                          {...provided.dragHandleProps}
                                          className="mr-2 cursor-grab group-hover:scale-110 transition-transform duration-200"
                                          title="Drag to reorder"
                                        >
                                          <svg
                                            width="18"
                                            height="18"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                          >
                                            <circle
                                              cx="5"
                                              cy="6"
                                              r="1.5"
                                              fill="#a78bfa"
                                            />
                                            <circle
                                              cx="5"
                                              cy="12"
                                              r="1.5"
                                              fill="#a78bfa"
                                            />
                                            <circle
                                              cx="5"
                                              cy="18"
                                              r="1.5"
                                              fill="#a78bfa"
                                            />
                                            <circle
                                              cx="12"
                                              cy="6"
                                              r="1.5"
                                              fill="#a78bfa"
                                            />
                                            <circle
                                              cx="12"
                                              cy="12"
                                              r="1.5"
                                              fill="#a78bfa"
                                            />
                                            <circle
                                              cx="12"
                                              cy="18"
                                              r="1.5"
                                              fill="#a78bfa"
                                            />
                                            <circle
                                              cx="19"
                                              cy="6"
                                              r="1.5"
                                              fill="#a78bfa"
                                            />
                                            <circle
                                              cx="19"
                                              cy="12"
                                              r="1.5"
                                              fill="#a78bfa"
                                            />
                                            <circle
                                              cx="19"
                                              cy="18"
                                              r="1.5"
                                              fill="#a78bfa"
                                            />
                                          </svg>
                                        </div>
                                        {/* Actions button under drag handle */}
                                        {questions.length > 1 && (
                                          <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                              <Button
                                                className="mt-2 mr-2 h-6 bg-transparent p-1 rounded-full px-0 hover:bg-gray-100 text-gray-600 transition-all duration-150 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus:ring-transparent focus-visible:ring-transparent focus-within:outline-none focus-within:ring-0 focus-within:ring-transparent"
                                                title="More actions"
                                              >
                                                <BringToFront
                                                  strokeWidth={1.5}
                                                  className="size-[18px] text-[#a78bfa]"
                                                />
                                              </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                              align="start"
                                              className="z-[10000] min-w-[180px]"
                                            >
                                              <DropdownMenuSub>
                                                <DropdownMenuSubTrigger className="flex items-center gap-2">
                                                  <MoveRight className="w-4 h-4 text-[#a78bfa]" />
                                                  <span>Move to section</span>
                                                </DropdownMenuSubTrigger>
                                                <DropdownMenuSubContent className="z-[10000] min-w-[180px]">
                                                  {questions.map(
                                                    (section, secIdx) =>
                                                      secIdx !==
                                                      currentSection ? (
                                                        <DropdownMenuItem
                                                          key={secIdx}
                                                          onClick={() => {
                                                            // Remove from current section
                                                            const sectionList =
                                                              [...questions];
                                                            const fromSection =
                                                              sectionList[
                                                                currentSection
                                                              ];
                                                            const toSection =
                                                              sectionList[
                                                                secIdx
                                                              ];
                                                            const movingQuestion =
                                                              fromSection
                                                                .questions[
                                                                index
                                                              ];
                                                            // Remove from current
                                                            const newFromQuestions =
                                                              fromSection.questions.filter(
                                                                (_, i) =>
                                                                  i !== index
                                                              );
                                                            // Add to end of target
                                                            const newToQuestions =
                                                              [
                                                                ...toSection.questions,
                                                                movingQuestion,
                                                              ];
                                                            // Update sections
                                                            dispatch(
                                                              updateSection({
                                                                index:
                                                                  currentSection,
                                                                newSection: {
                                                                  ...fromSection,
                                                                  questions:
                                                                    newFromQuestions,
                                                                },
                                                              })
                                                            );
                                                            dispatch(
                                                              updateSection({
                                                                index: secIdx,
                                                                newSection: {
                                                                  ...toSection,
                                                                  questions:
                                                                    newToQuestions,
                                                                },
                                                              })
                                                            );
                                                          }}
                                                          className="flex items-center gap-2"
                                                        >
                                                          <span className="font-medium">
                                                            Section {secIdx + 1}
                                                          </span>
                                                          {section.section_topic && (
                                                            <span className="text-xs text-muted-foreground ml-2">
                                                              {
                                                                section.section_topic
                                                              }
                                                            </span>
                                                          )}
                                                        </DropdownMenuItem>
                                                      ) : null
                                                  )}
                                                </DropdownMenuSubContent>
                                              </DropdownMenuSub>
                                            </DropdownMenuContent>
                                          </DropdownMenu>
                                        )}
                                      </div>
                                      <div
                                        className={cn(
                                          `flex-1`,
                                          snapshot.isDragging &&
                                            "z-50 shadow-2xl scale-[1.02] rounded-xl"
                                        )}
                                      >
                                        <QuestionRenderer
                                          item={item}
                                          index={index}
                                          isEdit={isEdit}
                                          editIndex={editIndex}
                                          currentSection={currentSection}
                                          handleSave={handleSave}
                                          handleCancel={handleCancel}
                                          handleAISave={handleAISave}
                                          EditQuestion={EditQuestion}
                                          handleDeleteQuestion={
                                            handleDeleteQuestion
                                          }
                                          handleRequiredToggle={(index) =>
                                            handleRequiredToggle(
                                              index,
                                              currentSection,
                                              questions,
                                              dispatch
                                            )
                                          }
                                        />
                                      </div>
                                    </div>
                                    {/* Animated cut-to-section hover area (not after last question) */}
                                    {index <
                                      questions[currentSection].questions
                                        .length -
                                        1 && (
                                      <CutSectionDivider
                                        key={`divider-${index}`}
                                        onCut={() => {
                                          // Split section logic
                                          const section =
                                            questions[currentSection];
                                          const before =
                                            section.questions.slice(
                                              0,
                                              index + 1
                                            );
                                          const after = section.questions.slice(
                                            index + 1
                                          );
                                          if (after.length === 0) return; // Don't cut if nothing after
                                          // Create new section with 'after' questions
                                          const newSection = {
                                            section_topic:
                                              section.section_topic ||
                                              `Section ${questions.length + 1}`,
                                            section_description:
                                              section.section_description || "",
                                            questions: after,
                                            header_text:
                                              "header_text" in section
                                                ? section.header_text
                                                : survey?.header_text,
                                            body_text:
                                              "body_text" in section
                                                ? section.body_text
                                                : survey?.body_text,
                                          };
                                          // Update current section to only have 'before' questions
                                          const updatedSection = {
                                            ...section,
                                            questions: before,
                                          };
                                          dispatch(
                                            updateSection({
                                              index: currentSection,
                                              newSection: updatedSection,
                                            })
                                          );
                                          dispatch(addSection(newSection));
                                          safeSetCurrentSection(
                                            questions.length
                                          ); // Go to new section
                                        }}
                                      />
                                    )}
                                  </div>
                                </React.Fragment>
                              )}
                            </Draggable>
                          )
                        )
                      )}
                    </div>
                  )}
                </StrictModeDroppable>
              </DragDropContext>

              {questions?.length > 1 && (
                <div className="flex mt-6 w-full md:w-auto md:justify-end items-center sticky bottom-10">
                  <PaginationBtn
                    currentSection={currentSection}
                    totalSections={questions.length}
                    onNavigate={navigatePage}
                  />
                </div>
              )}

              <div className="flex flex-col gap-4 md:flex-row justify-between items-center mt-6">
                <div className="flex flex-wrap gap-2 items-center">
                  <Button
                    variant="outline"
                    className="px-0 relative rounded-full transition-all duration-200 border-none overflow-hidden"
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
                              id="add-question-btn"
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

                                dispatch(
                                  updateSection({
                                    index: currentSection,
                                    newSection: updatedSection,
                                  })
                                );
                                setEditIndex(
                                  currentSectionData.questions.length
                                );
                                setIsEdit(true);
                              }}
                              className="gap-2"
                            >
                              <PencilIcon className="h-4 w-4" />
                              <span>Add Manually</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setAiTargetSectionIndex(currentSection);
                                setAddMoreQuestion(true);
                              }}
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

                  <Button
                    variant="outline"
                    className="group relative rounded-full transition-all duration-200 border-red-200 text-red-500 hover:!text-red-600 overflow-hidden"
                    onClick={() => setShowClearDialog(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform duration-200" />
                    <span className="group-hover:tracking-wide group-hover:text-red-600 transition-all duration-200">
                      Clear Survey
                    </span>
                    <div className="absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-10 transition-opacity duration-200" />
                  </Button>
                </div>
                <div className="flex gap-4 flex-wrap">
                  <Button
                    variant="outline"
                    className="group relative rounded-full transition-all duration-200 border-green-200 text-green-600 hover:!text-green-700 overflow-hidden"
                    onClick={() => {
                      let prevSection = questions[questions.length - 1];
                      const newSection: Section = {
                        section_topic:
                          prevSection?.section_topic ||
                          survey.topic ||
                          `Section ${questions.length + 1}`,
                        section_description:
                          prevSection?.section_description ||
                          survey.description ||
                          "",
                        questions: [],
                        header_text:
                          (prevSection as any)?.header_text ||
                          survey.header_text,
                        body_text:
                          (prevSection as any)?.body_text || survey.body_text,
                      };
                      dispatch(addSection(newSection));
                      safeSetCurrentSection(questions.length); // Go to the new section
                    }}
                  >
                    <Sheet className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
                    <span className="group-hover:tracking-wide transition-all duration-200">
                      Add New Section
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-200 to-green-400 opacity-0 group-hover:opacity-10 transition-opacity duration-200" />
                  </Button>
                  {questions.length > 1 && (
                    <Button
                      variant="destructive"
                      onClick={handleRemoveSection}
                      className="flex items-center gap-2 px-4 py-2 bg-red-200 text-red-600 hover:text-white rounded-full shadow-sm hover:bg-red-500"
                      title="Remove Current Section"
                    >
                      <TableRowsSplit className="w-5 h-5" />
                      Remove Current Section
                    </Button>
                  )}
                </div>
              </div>

              <WaitingMessagesModal
                otherPossibleCondition={generatingSingleSurvey}
                openModal={openModal}
                setOpenModal={
                  generatingSingleSurvey === false
                    ? () => setOpenModal(false)
                    : () => setOpenModal(true)
                }
              />

              <div className="rounded-md flex flex-col justify-center w-full overflow-visible py-5 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Button
                    onClick={handleSurveyCreation}
                    className="group relative h-12 mt-10 !w-full py-3 px-8 rounded-xl flex items-center justify-center gap-2 font-medium transition-all duration-200 overflow-hidden active:scale-[0.98] bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] text-white hover:opacity-90"
                    disabled={isLoading}
                  >
                    <span className="group-hover:tracking-wider transition-all duration-200">
                      {isLoading ? "Submitting" : "Continue"}
                    </span>
                    {!isLoading && (
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="flex items-center"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </motion.div>
                    )}
                    {isLoading && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="flex items-center"
                      >
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </motion.div>
                    )}
                    <motion.div
                      className="absolute inset-0 bg-white"
                      initial={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1, opacity: 0.1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </Button>
                </motion.div>
              </div>
              <WatermarkBanner className="mb-10" />
            </div>
          </motion.div>
          {/* ) : (
            <CreateNewSection />
          )} */}
        </div>
        <div
          className={`hidden lg:flex lg:w-1/3 overflow-y-auto max-h-screen custom-scrollbar bg-white`}
        >
          <Tabs defaultValue="style" className="w-full">
            <TabsList className="w-full flex bg-gray-50 border-b p-0 sticky top-0 z-[100000] !pb-0">
              <TabsTrigger
                value="style"
                className="flex-1 font-semibold text-gray-700 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-purple-600 rounded-none"
              >
                <span className="inline-flex items-center gap-2">
                  <Paintbrush size={16} />
                  Style Editor
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="skip"
                className="flex-1 font-semibold text-gray-700 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-purple-600 rounded-none"
              >
                <span className="inline-flex items-center gap-2">
                  <AlignVerticalSpaceAround size={16} />
                  Logic
                </span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="style" className="w-full">
              <StyleEditor
                surveyData={survey as SurveyData}
                setSurveyData={setSurveyData}
              />
            </TabsContent>
            <TabsContent value="skip" className="w-full">
              <Tabs defaultValue="skip-logic" className="w-full">
                <TabsList className="w-full flex bg-gray-50 border-b p-0 sticky top-0 z-[100000] !pb-0">
                  <TabsTrigger
                    value="skip-logic"
                    className="flex-1 font-semibold text-gray-700 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-purple-600 rounded-none"
                  >
                    Skip Logic
                  </TabsTrigger>
                  <TabsTrigger
                    value="display-logic"
                    className="flex-1 font-semibold text-gray-700 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-purple-600 rounded-none"
                  >
                    Display Logic
                  </TabsTrigger>
                  <TabsTrigger
                    value="display-options"
                    className="flex-1 font-semibold text-gray-700 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-purple-600 rounded-none"
                  >
                    Display Options
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="skip-logic" className="w-full">
                  <SkipLogicEditor
                    sections={questions}
                    skipLogic={skipLogic}
                    onChange={(rules) => dispatch(setSkipLogic(rules))}
                  />
                </TabsContent>
                <TabsContent value="display-logic" className="w-full">
                  <div className="p-8 text-center text-gray-500">
                    <h2 className="text-lg font-semibold mb-2">
                      Display Logic
                    </h2>
                    <p>Display Logic configuration coming soon.</p>
                  </div>
                </TabsContent>
                <TabsContent value="display-options" className="w-full">
                  <div className="p-8 text-center text-gray-500">
                    <h2 className="text-lg font-semibold mb-2">
                      Display Options Logic
                    </h2>
                    <p>Display Options Logic configuration coming soon.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
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

      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent
          className="sm:max-w-md z-[100000]"
          overlayClassName="z-[100000]"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-center">
                Clear Survey
              </DialogTitle>
              <DialogDescription className="text-center">
                Are you sure you want to clear all questions? This action cannot
                be undone.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="flex gap-2 justify-center mt-6">
              <Button
                variant="outline"
                onClick={() => setShowClearDialog(false)}
                className="w-full"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleClearSurvey}
                className="w-full bg-red-500 hover:bg-red-600"
              >
                Clear Survey
              </Button>
            </DialogFooter>
          </motion.div>
        </DialogContent>
      </Dialog>

      {/* Sensei Master */}
      <AnimatePresence>
        <motion.div
          key="senseiMaster"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={mascotVariants}
          className="bg-blue-500 z-[1000000] fixed top-0 left-0"
        >
          <SenseiMaster
            type="analysis"
            onSave={handleSave}
            setEditId={setEditIndex}
            aiSave={handleAISave}
          />
        </motion.div>
      </AnimatePresence>
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
        <DialogContent className="max-w-md bg-white rounded-2xl shadow-xl">
          <DialogHeader>
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center shadow-inner transform hover:scale-105 transition-transform duration-200">
                <IoDocumentOutline className="w-10 h-10 text-purple-600" />
              </div>
              <DialogTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900">
                Authentication Required
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-lg leading-relaxed max-w-sm">
                To continue creating your survey and access all features, please
                log in to your account or sign up if you're new here.
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="flex flex-col w-full gap-4 pt-6">
            <Button
              onClick={() => router.push("/login?ed=2")}
              className="w-full h-12 bg-gradient-to-r from-[#5b03b2] to-[#9d50bb] text-white text-lg font-medium rounded-xl hover:opacity-90 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg"
            >
              Log In
            </Button>

            <Button
              onClick={() => router.push("/register?ed=2")}
              variant="outline"
              className="w-full h-12 border-2 border-purple-600 text-purple-600 text-lg font-medium rounded-xl hover:bg-purple-50 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-md"
            >
              Sign Up
            </Button>
          </div>

          <p className="text-sm text-gray-500 text-center pt-6 px-4 leading-relaxed">
            By continuing, you agree to our{" "}
            <span className="text-purple-600 hover:text-purple-700 cursor-pointer">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="text-purple-600 hover:text-purple-700 cursor-pointer">
              Privacy Policy
            </span>
            .
          </p>
        </DialogContent>
      </Dialog>

      <ExitSurveyDialog
        isLoading={isSavingProgress}
        isOpen={showExitDialog}
        onClose={() => {
          setShowExitDialog(false);
          setPendingNavigation(null);
        }}
        onSave={handleSaveDraft}
        onClear={handleClearSurvey}
      />
    </div>
  );
};

export default EditSurvey;
