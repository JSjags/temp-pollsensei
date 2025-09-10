"use client";
import Image from "next/image";
import { pollsensei_new_logo, sparkly } from "@/assets/images";
import { HiOutlinePlus } from "react-icons/hi";
import { VscLayersActive } from "react-icons/vsc";
import { Fragment, useEffect, useState, useCallback, useMemo } from "react";
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
  updateSection,
  updateTopic,
  updateDescription,
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
// import ReviewModal from "@/components/modals/ReviewModal";
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
import { Edit, Save, Trash2, Pencil, Scissors } from "lucide-react";
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
import PaginationBtn from "@/components/common/PaginationBtn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import {
  Sparkles,
  PencilIcon,
  MoveRight,
  MoreVertical,
  BringToFront,
  Paintbrush,
  AlignVerticalSpaceAround,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SkipLogicEditor, {
  SkipLogicRule,
  SkipLogicRuleV2,
  transformSurveySkipLogic,
} from "./SkipLogicEditor";
import { setSkipLogic } from "@/redux/slices/survey.slice";
import BuyQuickSurveyRespondent from "@/components/survey/BuyQuickSurveyRespondent";
import { startQuickSurveyFlow } from "@/redux/slices/quickSurveySlice";

// Define Section type at the top (after imports)
type Section = {
  title: string;
  description: string;
  questions: any[]; // Replace 'any' with 'Question' if you have a type for questions
};

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
  const [sections, setSections] = useState<Section[]>([
    {
      title: sectionTopic || "Untitled Section",
      description: sectionDescription || "",
      questions: [],
    },
  ]);
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

  const questions = useMemo(
    () => sections[currentSectionIndex]?.questions || [],
    [sections, currentSectionIndex]
  );

  const userToken = useSelector(
    (state: RootState) => state?.user?.access_token || state.user.token
  );
  const user = useSelector((state: RootState) => state?.user?.user);

  const logoUrl = useSelector((state: RootState) => state?.survey?.logo_url);
  const sectionTitle = sections[currentSectionIndex]?.title || "";
  const sDescription = sections[currentSectionIndex]?.description || "";
  const [isEditing, setIsEditing] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [currentSection, setCurrentSection] = useState(0);
  // const [review, setReview] = useState(false);
  const [survey_id, setSurvey_id] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Skip Logic State
  const [skipLogic, setSkipLogicState] = useState<
    (SkipLogicRule | SkipLogicRuleV2)[]
  >([]);
  const surveySkipLogic = useSelector(
    (state: RootState) => state?.survey?.skipLogic || []
  );
  const [activeTab, setActiveTab] = useState("questions");

  const { showQuickSurveyFlow } = useSelector(
    (state: RootState) => state.quickSurvey
  );

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
    const prevSection = sections[sections.length - 1];
    setSections([
      ...sections,
      {
        title: prevSection?.title || "Untitled Section",
        description: prevSection?.description || "",
        questions: [],
      },
    ]);
    setCurrentSectionIndex(sections.length);
    setIsEditing(false);
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
    // dispatch(
    //   updateSectionTopic({ index: currentSectionIndex, data: sectionTitle })
    // );
    // dispatch(
    //   updateSectionDescription({
    //     index: currentSectionIndex,
    //     data: sDescription,
    //   })
    // );
    setSurveyData((prev) => ({
      ...prev,
      topic: sectionTitle,
      description: sDescription,
    }));
    console.log("Exiting edit mode: setIsEditing(false) called in handleSave");
    setIsEditing(false);
  };

  const handleSaveEdittedQuestion = (
    updatedQuestion: string,
    updatedOptions: string[],
    updatedQuestionType: string,
    isRequired: boolean,
    minValue?: number,
    maxValue?: number,
    matrixRows?: string[],
    matrixColumns?: string[],
    canAcceptAudio?: boolean
  ) => {
    if (editIndex === null || editIndex < 0 || editIndex >= questions.length) {
      console.error("Invalid edit index.");
      return;
    }

    const updatedQuestionData = {
      question: updatedQuestion,
      options:
        updatedQuestionType === "boolean"
          ? ["Yes", "No"]
          : updatedQuestionType === "star_rating"
          ? ["1", "2", "3", "4", "5"]
          : updatedOptions,
      question_type: updatedQuestionType,
      is_required: isRequired,
      minValue,
      maxValue,
      matrixRows,
      matrixColumns,
      canAcceptAudio,
    };
    setSections((sections) =>
      sections.map((section, idx) =>
        idx === currentSectionIndex
          ? {
              ...section,
              questions: section.questions.map((q, i) =>
                i === editIndex ? updatedQuestionData : q
              ),
            }
          : section
      )
    );
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
    setSections((sections) =>
      sections.map((section, idx) =>
        idx === currentSectionIndex ? { ...section, questions: items } : section
      )
    );
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
    // Check if all sections have at least one question
    const hasEmptySection = sections.some(
      (section) => !section.questions || section.questions.length === 0
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
      const processedSurvey = {
        ...survey,
        header_text: {
          ...survey.header_text,
          size: survey.header_text?.size || 24,
        },
        body_text: {
          ...survey.body_text,
          size: survey.body_text?.size || 16,
        },
        question_text: {
          ...survey.question_text,
          size: survey.question_text?.size || 16,
        },
        header_url:
          typeof headerUrl === "string" && headerUrl.startsWith("#")
            ? ""
            : headerUrl,
        logo_url:
          typeof logoUrl === "string" && logoUrl.startsWith("#") ? "" : logoUrl,
        sections: sections.map((section, sectionIdx) => {
          const baseSection = {
            questions: section.questions.map(
              (question: any, questionIdx: any) => {
                const baseQuestion = {
                  question: question.question,
                  description: question.description || question.question,
                  question_type: question.question_type,
                  is_required: question.is_required,
                };

                // Add skip logic if available for this question
                const globalQuestionIndex = getGlobalQuestionIndex(
                  sectionIdx,
                  questionIdx
                );
                const questionId = `Question${globalQuestionIndex + 1}`;
                const processedSkipLogic = transformSkipLogic();
                const questionSkipLogic = processedSkipLogic
                  .filter((logic) => logic.questionId === questionId)
                  .map((logic) => logic.skipLogic);

                const questionWithSkipLogic = {
                  ...baseQuestion,
                  ...(questionSkipLogic.length > 0 && {
                    skip_logic: questionSkipLogic,
                  }),
                };

                switch (question.question_type) {
                  case "slider":
                    return {
                      ...questionWithSkipLogic,
                      min: question.min,
                      max: question.max,
                      step: question.step || 1,
                    };
                  case "checkbox":
                  case "multiple_choice":
                  case "single_choice":
                  case "drop_down":
                  case "likert_scale":
                  case "rating_scale":
                  case "star_rating":
                  case "boolean":
                    return {
                      ...questionWithSkipLogic,
                      options: question.options,
                    };
                  case "matrix_multiple_choice":
                  case "matrix_checkbox":
                    return {
                      ...questionWithSkipLogic,
                      description: question.description || "Matrix Question",
                      rows: question.rows,
                      columns: question.columns,
                    };
                  case "number":
                    return {
                      ...questionWithSkipLogic,
                      min: question.min,
                      max: question.max,
                    };
                  case "long_text":
                    return {
                      ...questionWithSkipLogic,
                      can_accept_media: question.can_accept_media || false,
                    };
                  case "short_text":
                  case "media":
                  default:
                    return questionWithSkipLogic;
                }
              }
            ),
          };

          // Handle section headers like in EditSurvey
          if (sectionIdx === 0) {
            return baseSection;
          } else {
            return {
              section_topic: section.title,
              section_description: section.description,
              ...baseSection,
            };
          }
        }),
      };
      await createSurvey(processedSurvey).unwrap();
      // Removed setSurvey_id and setReview calls to prevent infinite loop
      // These are now handled only in the useEffect when isSuccess becomes true
    } catch (e) {
      console.error("Survey creation error:", e);
    }
  };

  console.log(sections);

  useEffect(() => {
    if (isSuccess) {
      dispatch(resetSurvey());
      setSurvey_id(createdSurveyData.data._id);
      dispatch(startQuickSurveyFlow());
      // dispatch(resetQuestion());
      // dispatch(resetSurvey());
      // setReview(true);
      // router.push("/surveys/survey-list");
    }

    if (isError || error) {
      const SaveProgress = async () => {
        try {
          await saveprogress({
            ...survey,
            sections: sections.map((section) => ({
              section_topic: section.title,
              section_description: section.description,
              questions: section.questions,
            })),
            header_text: {
              ...survey.header_text,
              size: survey.header_text?.size || 24,
            },
            body_text: {
              ...survey.body_text,
              size: survey.body_text?.size || 16,
            },
            question_text: {
              ...survey.question_text,
              size: survey.question_text?.size || 16,
            },
            header_url:
              typeof headerUrl === "string" && headerUrl.startsWith("#")
                ? ""
                : headerUrl,
            logo_url:
              typeof logoUrl === "string" && logoUrl.startsWith("#")
                ? ""
                : logoUrl,
          });
        } catch (e) {
          console.error(e);
        }
      };
      SaveProgress();
      toast.error(
        "Failed to create survey, Don't panic, your progress was saved"
      );
    }
  }, [
    isSuccess,
    isError,
    error,
    dispatch,
    router,
    saveprogress,
    createdSurveyData,
    sections,
    headerUrl,
    logoUrl,
  ]);

  useEffect(() => {
    // Don't redirect on progressSuccess - that just means draft was saved
    // Only redirect on actual survey creation success (handled in the main useEffect)
    if (progressIsError || progressError) {
      toast.error("Failed to save progress, please try again later");
    }
  }, [progressError, progressIsError]);

  // Skip Logic synchronization with Redux
  useEffect(() => {
    if (surveySkipLogic.length > 0) {
      setSkipLogicState(surveySkipLogic);
    }
  }, [surveySkipLogic]);

  // Handle skip logic updates
  const handleSkipLogicUpdate = useCallback(
    (newSkipLogic: (SkipLogicRule | SkipLogicRuleV2)[]) => {
      setSkipLogicState(newSkipLogic);
      dispatch(setSkipLogic(newSkipLogic));
    },
    [dispatch]
  );

  // Sync sections with Redux for persistence
  const syncSectionsWithRedux = useCallback(() => {
    // Clear existing sections in Redux
    const currentReduxSections = survey.sections;

    // Remove all existing sections
    for (let i = currentReduxSections.length - 1; i >= 0; i--) {
      dispatch(deleteSection(i));
    }

    // Add current sections to Redux
    sections.forEach((section, index) => {
      const reduxSection = {
        section_topic: section.title,
        section_description: section.description,
        questions: section.questions,
      };

      if (index === 0) {
        // First section doesn't need section_topic/description in Redux
        dispatch(addSection({ questions: section.questions }));
      } else {
        dispatch(addSection(reduxSection));
      }
    });

    // Also update survey topic and description from first section
    if (sections.length > 0) {
      dispatch(updateTopic(sections[0].title || ""));
      dispatch(updateDescription(sections[0].description || ""));
    }
  }, [sections, survey.sections, dispatch]);

  // Restore sections from Redux on component mount
  useEffect(() => {
    if (survey.sections.length > 0) {
      const restoredSections = survey.sections.map((section, index) => ({
        title:
          index === 0
            ? survey.topic || "Untitled Section"
            : section.section_topic || "Untitled Section",
        description:
          index === 0
            ? survey.description || ""
            : section.section_description || "",
        questions: section.questions || [],
      }));

      setSections(restoredSections);
      console.log("Restored sections from Redux:", restoredSections);
    }
  }, []); // Only run on mount

  // Sync sections with Redux when sections change (with debounce to prevent excessive updates)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      syncSectionsWithRedux();
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [sections]); // Removed syncSectionsWithRedux from dependencies to prevent infinite loop

  // Helper function to get global question index across all sections
  const getGlobalQuestionIndex = (
    sectionIndex: number,
    questionIndex: number
  ): number => {
    let globalIndex = 0;
    for (let s = 0; s < sections.length; s++) {
      if (s < sectionIndex) {
        globalIndex += sections[s].questions.length;
      } else if (s === sectionIndex) {
        globalIndex += questionIndex;
        break;
      }
    }
    return globalIndex;
  };

  // Transform skip logic to API format
  const transformSkipLogic = useCallback(() => {
    const processedLogic: any[] = [];

    skipLogic.forEach((rule) => {
      if ("conditions" in rule && "action" in rule) {
        // New rule format (SkipLogicRuleV2)
        const {
          conditions,
          logicalOperator,
          action,
          target,
          mainQuestionSection,
          mainQuestionIndex,
        } = rule;

        // Determine which question this logic applies to
        let targetQuestionId = null;

        if (action === "end_survey") {
          if (conditions.length > 0) {
            const firstCondition = conditions[0];
            const questionIndex = firstCondition.questionIndex;
            const sectionIndex = firstCondition.sectionIndex;
            if (questionIndex !== null && sectionIndex !== null) {
              const globalQuestionIndex = getGlobalQuestionIndex(
                sectionIndex,
                questionIndex
              );
              targetQuestionId = `Question${globalQuestionIndex + 1}`;
            }
          } else {
            if (mainQuestionIndex !== null && mainQuestionSection !== null) {
              const globalQuestionIndex = getGlobalQuestionIndex(
                mainQuestionSection,
                mainQuestionIndex
              );
              targetQuestionId = `Question${globalQuestionIndex + 1}`;
            }
          }
        } else {
          if (mainQuestionIndex !== null && mainQuestionSection !== null) {
            const globalQuestionIndex = getGlobalQuestionIndex(
              mainQuestionSection,
              mainQuestionIndex
            );
            targetQuestionId = `Question${globalQuestionIndex + 1}`;
          }
        }

        if (targetQuestionId) {
          const rules = conditions
            .map((cond: any) => {
              const sourceQuestionIndex = cond.questionIndex;
              const sourceSectionIndex = cond.sectionIndex;
              if (sourceQuestionIndex === null || sourceSectionIndex === null)
                return null;

              // For end_survey actions, use flattened question index
              let questionId;
              if (action === "end_survey") {
                const globalQuestionIndex = getGlobalQuestionIndex(
                  sourceSectionIndex,
                  sourceQuestionIndex
                );
                questionId = `Question${globalQuestionIndex + 1}`;
              } else {
                const globalQuestionIndex = getGlobalQuestionIndex(
                  sourceSectionIndex,
                  sourceQuestionIndex
                );
                questionId = `Question${globalQuestionIndex + 1}`;
              }

              const rule = {
                source_id: questionId,
                operator: cond.operator,
                value: cond.value,
              };

              return rule;
            })
            .filter(Boolean);

          let actionType = action;
          let targetType = "question";
          let targetId = "Question1";

          if (action === "end_survey") {
            actionType = "end_survey";
            targetType = "question";
            // For end_survey, use the question that has the logic (from conditions or main question)
            if (conditions.length > 0) {
              const firstCondition = conditions[0];
              const questionIndex = firstCondition.questionIndex;
              if (questionIndex !== null) {
                const globalQuestionIndex = getGlobalQuestionIndex(
                  firstCondition.sectionIndex,
                  questionIndex
                );
                targetId = `Question${globalQuestionIndex + 1}`;
              } else {
                const globalQuestionIndex = getGlobalQuestionIndex(
                  mainQuestionSection,
                  mainQuestionIndex
                );
                targetId = `Question${globalQuestionIndex + 1}`;
              }
            } else {
              const globalQuestionIndex = getGlobalQuestionIndex(
                mainQuestionSection,
                mainQuestionIndex
              );
              targetId = `Question${globalQuestionIndex + 1}`;
            }
          } else if (action === "jump_to") {
            actionType = "jump_to";
            if (
              target.type === "question" &&
              target.questionIndex !== undefined &&
              target.questionIndex !== null &&
              target.sectionIndex !== undefined &&
              target.sectionIndex !== null
            ) {
              // Use flattened question index for jump_to questions
              const globalQuestionIndex = getGlobalQuestionIndex(
                target.sectionIndex,
                target.questionIndex
              );
              targetId = `Question${globalQuestionIndex + 1}`;
            } else if (
              target.type === "section" &&
              target.sectionIndex !== undefined &&
              target.sectionIndex !== null
            ) {
              targetType = "section";
              targetId = `Section${target.sectionIndex + 1}`;
            }
          } else {
            // hide/show actions
            if (
              target.type === "question" &&
              target.questionIndex !== undefined &&
              target.questionIndex !== null
            ) {
              targetId = `Question${target.questionIndex + 1}`;
            } else if (
              target.type === "section" &&
              target.sectionIndex !== undefined &&
              target.sectionIndex !== null
            ) {
              targetType = "section";
              targetId = `Section${target.sectionIndex + 1}`;
            }
          }

          // Determine logic_type based on action
          let logicType = "skip_logic"; // default
          if (action === "hide" || action === "show") {
            logicType = "display_logic";
          } else if (action === "jump_to") {
            logicType = "skip_logic";
          } else if (action === "end_survey") {
            logicType = "skip_logic";
          }

          const skipLogicEntry = {
            logic_type: logicType,
            condition: {
              logical_operator: logicalOperator,
              rules: rules,
              action: {
                type: actionType,
                target_type: targetType,
                target_id: targetId,
              },
            },
          };

          processedLogic.push({
            questionId: targetQuestionId,
            skipLogic: skipLogicEntry,
          });
        }
      }
    });

    return processedLogic;
  }, [skipLogic, sections]);

  const handleCancel = () => {
    // setEditIndex(null);
    setIsEdit(false);
    setIsSidebarOpen((prev) => !prev);
  };

  const handleDeleteQuestion = (id: number) => {
    setSections((sections) =>
      sections.map((section, idx) =>
        idx === currentSectionIndex
          ? {
              ...section,
              questions: section.questions.filter((_, i) => i !== id),
            }
          : section
      )
    );
    setEditIndex(null);
    setIsEdit(false);
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
      // Ensure sections are synced with Redux before saving
      syncSectionsWithRedux();

      // Use the Redux survey state for saving (which now includes our sections)
      const updatedSurvey = store.getState().survey;
      await saveprogress(updatedSurvey);

      toast.success("Survey saved as draft");
      if (pendingNavigation) {
        pendingNavigation();
      }
      setShowExitDialog(false);
    } catch (error) {
      toast.error("Failed to save draft");
    }
  };

  // Manual save progress function for immediate persistence
  const handleSaveProgress = async () => {
    try {
      // Ensure sections are synced with Redux before saving
      syncSectionsWithRedux();

      // Use the Redux survey state for saving (which now includes our sections)
      const updatedSurvey = store.getState().survey;
      await saveprogress(updatedSurvey);

      toast.success("Progress saved successfully");
    } catch (error) {
      toast.error("Failed to save progress");
    }
  };

  const handleRouterPush = useCallback(
    (url: string) => {
      if (questions?.length > 0) {
        setShowExitDialog(true);
        setPendingNavigation(() => () => router.push(url));
        return;
      }
      router.push(url);
    },
    [questions, router]
  );

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (questions?.length > 0) {
        e.preventDefault();
        window.history.pushState(null, "", pathname);
        setShowExitDialog(true);
        setPendingNavigation(() => () => window.history.back());
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [questions, pathname]);

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

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");
      if (link && !link.hasAttribute("download")) {
        const href = link.getAttribute("href");
        if (
          href &&
          !href.startsWith("#") &&
          !href.startsWith("http") &&
          href !== pathname
        ) {
          e.preventDefault();
          handleRouterPush(href);
        }
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [handleRouterPush, pathname]);

  const handleSectionTitleChange = (value: string) => {
    setSections((sections) =>
      sections.map((section, idx) =>
        idx === currentSectionIndex ? { ...section, title: value } : section
      )
    );
  };

  const handleSectionDescriptionChange = (value: string) => {
    setSections((sections) =>
      sections.map((section, idx) =>
        idx === currentSectionIndex
          ? { ...section, description: value }
          : section
      )
    );
  };

  const handleAddQuestion = (newQuestion: any) => {
    setSections((sections) =>
      sections.map((section, idx) =>
        idx === currentSectionIndex
          ? { ...section, questions: [...section.questions, newQuestion] }
          : section
      )
    );
  };

  // Animated divider component for cutting sections
  const CutSectionDivider = ({ onCut }: { onCut: () => void }) => {
    const [hovered, setHovered] = useState(false);
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
                          handleSectionTitleChange(e.target.value);
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
                          handleSectionDescriptionChange(e.target.value);
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
                      {questions.length === 0 && !addQuestions ? (
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
                            className="relative rounded-full transition-all duration-200 border-none overflow-hidden px-4"
                            onClick={() => setAddQuestions(true)}
                          >
                            <div className="flex gap-2 items-center">
                              <HiOutlinePlus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
                              <span className="group-hover:tracking-wide transition-all duration-200">
                                Add Question
                              </span>
                              <div className="absolute inset-0 bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] opacity-0 hover:opacity-10 transition-opacity duration-200" />
                            </div>
                          </Button>
                        </div>
                      ) : (
                        questions?.map((item: any, index: any) => (
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
                                className="relative"
                                onMouseEnter={() =>
                                  !isTouchDevice &&
                                  setHoveredQuestionIndex(index)
                                }
                                onMouseLeave={() =>
                                  !isTouchDevice &&
                                  setHoveredQuestionIndex(null)
                                }
                                onTouchStart={() =>
                                  isTouchDevice &&
                                  setHoveredQuestionIndex(index)
                                }
                              >
                                <div className="flex items-start group">
                                  <div className="flex flex-col">
                                    {/* Drag handle */}
                                    <div
                                      {...provided.draggableProps}
                                      className="cursor-grab group-hover:scale-110 transition-transform duration-200 mr-2"
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
                                    {sections.length > 1 && (
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
                                              {sections.map((section, secIdx) =>
                                                secIdx !==
                                                currentSectionIndex ? (
                                                  <DropdownMenuItem
                                                    key={secIdx}
                                                    onClick={() => {
                                                      // Remove from current section
                                                      const sectionList = [
                                                        ...sections,
                                                      ];
                                                      const fromSection =
                                                        sectionList[
                                                          currentSectionIndex
                                                        ];
                                                      const toSection =
                                                        sectionList[secIdx];
                                                      const movingQuestion =
                                                        fromSection.questions[
                                                          index
                                                        ];
                                                      // Remove from current
                                                      const newFromQuestions =
                                                        fromSection.questions.filter(
                                                          (_, i) => i !== index
                                                        );
                                                      // Add to end of target
                                                      const newToQuestions = [
                                                        ...toSection.questions,
                                                        movingQuestion,
                                                      ];
                                                      // Update sections
                                                      setSections((sections) =>
                                                        sections.map((s, i) =>
                                                          i ===
                                                          currentSectionIndex
                                                            ? {
                                                                ...fromSection,
                                                                questions:
                                                                  newFromQuestions,
                                                              }
                                                            : i === secIdx
                                                            ? {
                                                                ...toSection,
                                                                questions:
                                                                  newToQuestions,
                                                              }
                                                            : s
                                                        )
                                                      );
                                                    }}
                                                    className="flex items-center gap-2"
                                                  >
                                                    <span className="font-medium">
                                                      Section {secIdx + 1}
                                                    </span>
                                                    {section.title && (
                                                      <span className="text-xs text-muted-foreground ml-2">
                                                        {section.title}
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
                                  <div className="flex-1">
                                    {/* ... existing question rendering ... */}
                                    {renderQuestionActions(index)}
                                    {
                                      // Conditionally render based on question type
                                      isEdit &&
                                      editIndex === index &&
                                      item.question_type ===
                                        "matrix_checkbox" ? (
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
                                          can_accept_audio={item.canAcceptAudio}
                                        />
                                      ) : item.question_type ===
                                        "multiple_choice" ? (
                                        <MultiChoiceQuestion
                                          key={index}
                                          index={index + 1}
                                          question={item.question}
                                          options={item.options}
                                          questionType={item.question_type}
                                          EditQuestion={() =>
                                            EditQuestion(index)
                                          }
                                          DeleteQuestion={() =>
                                            handleDeleteQuestion(index)
                                          }
                                          surveyData={surveyData}
                                        />
                                      ) : item.question_type ===
                                        "single_choice" ? (
                                        <SingleChoiceQuestion
                                          index={index + 1}
                                          key={index}
                                          question={item.question}
                                          options={item.options}
                                          questionType={item.question_type}
                                          EditQuestion={() =>
                                            EditQuestion(index)
                                          }
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
                                          EditQuestion={() =>
                                            EditQuestion(index)
                                          }
                                          DeleteQuestion={() =>
                                            handleDeleteQuestion(index)
                                          }
                                          surveyData={surveyData}
                                        />
                                      ) : item.question_type ===
                                        "rating_scale" ? (
                                        <RatingScaleQuestion
                                          key={index}
                                          index={index + 1}
                                          question={item.question}
                                          options={item.options}
                                          questionType={item.question_type}
                                          EditQuestion={() =>
                                            EditQuestion(index)
                                          }
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
                                          EditQuestion={() =>
                                            EditQuestion(index)
                                          }
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
                                          EditQuestion={() =>
                                            EditQuestion(index)
                                          }
                                          surveyData={surveyData}
                                        />
                                      ) : item.question_type === "long_text" ? (
                                        <CommentQuestion
                                          key={index}
                                          index={index + 1}
                                          question={item.question}
                                          questionType={item.question_type}
                                          EditQuestion={() =>
                                            EditQuestion(index)
                                          }
                                          surveyData={surveyData}
                                        />
                                      ) : item.question_type === "media" ? (
                                        <MediaQuestion
                                          key={index}
                                          index={index + 1}
                                          question={item.question}
                                          questionType={item.question_type}
                                          EditQuestion={() =>
                                            EditQuestion(index)
                                          }
                                        />
                                      ) : item.question_type ===
                                        "short_text" ? (
                                        <ShortTextQuestion
                                          key={index}
                                          index={index + 1}
                                          question={item.question}
                                          questionType={item.question_type}
                                          EditQuestion={() =>
                                            EditQuestion(index)
                                          }
                                          surveyData={surveyData}
                                        />
                                      ) : item.question_type ===
                                        "likert_scale" ? (
                                        <LikertScaleQuestion
                                          key={index}
                                          index={index + 1}
                                          question={item.question}
                                          options={item.options}
                                          questionType={item.question_type}
                                          EditQuestion={() =>
                                            EditQuestion(index)
                                          }
                                          surveyData={surveyData}
                                        />
                                      ) : item.question_type ===
                                        "star_rating" ? (
                                        <StarRatingQuestion
                                          question={item.question}
                                          // maxRating={5}
                                          index={index + 1}
                                          questionType={item.question_type}
                                          EditQuestion={() =>
                                            EditQuestion(index)
                                          }
                                          DeleteQuestion={() =>
                                            handleDeleteQuestion(index)
                                          }
                                          surveyData={surveyData}
                                        />
                                      ) : item.question_type ===
                                          "matrix_checkbox" ||
                                        item.question_type ===
                                          "matrix_multiple_choice" ? (
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
                                          EditQuestion={() =>
                                            EditQuestion(index)
                                          }
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
                                          item={item}
                                        />
                                      ) : null
                                    }
                                    {/* Animated cut-to-section hover area (not after last question) */}
                                    {index < questions.length - 1 && (
                                      <CutSectionDivider
                                        onCut={() => {
                                          // Split section logic
                                          const section =
                                            sections[currentSectionIndex];
                                          const before =
                                            section.questions.slice(
                                              0,
                                              index + 1
                                            );
                                          const after = section.questions.slice(
                                            index + 1
                                          );
                                          if (after.length === 0) return;
                                          // Create new section with 'after' questions
                                          setSections((sections) => {
                                            const newSection = {
                                              title:
                                                section.title ||
                                                `Section ${
                                                  sections.length + 1
                                                }`,
                                              description:
                                                section.description || "",
                                              questions: after,
                                            };
                                            const updatedSections =
                                              sections.map((s, i) =>
                                                i === currentSectionIndex
                                                  ? {
                                                      ...section,
                                                      questions: before,
                                                    }
                                                  : s
                                              );
                                            return [
                                              ...updatedSections.slice(
                                                0,
                                                currentSectionIndex + 1
                                              ),
                                              newSection,
                                              ...updatedSections.slice(
                                                currentSectionIndex + 1
                                              ),
                                            ];
                                          });
                                          setCurrentSectionIndex(
                                            currentSectionIndex + 1
                                          );
                                        }}
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
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
                    handleAddQuestion({
                      question,
                      question_type: questionType,
                      options,
                      is_required,
                      min,
                      max,
                      rows,
                      columns,
                      can_accept_media,
                    });
                    setAddQuestions(false);
                  }}
                />
              )}

              {/* New bottom section design from EditSurvey */}
              {sections.length > 1 && (
                <div className="flex w-full md:w-auto md:justify-end items-center mt-6 mb-6 sticky bottom-10 z-10">
                  <PaginationBtn
                    currentSection={currentSectionIndex}
                    totalSections={sections.length}
                    onNavigate={(direction) => {
                      if (
                        direction === "next" &&
                        currentSectionIndex < sections.length - 1
                      ) {
                        setCurrentSectionIndex((i) => i + 1);
                        setIsEditing(false);
                      } else if (
                        direction === "prev" &&
                        currentSectionIndex > 0
                      ) {
                        setCurrentSectionIndex((i) => i - 1);
                        setIsEditing(false);
                      }
                    }}
                  />
                </div>
              )}

              <div className="flex flex-col gap-4 md:flex-row justify-between items-center mt-6">
                <div className="flex flex-wrap gap-2 items-center">
                  <Button
                    variant="outline"
                    className="relative rounded-full transition-all duration-200 border-none overflow-hidden px-4"
                    onClick={() => setAddQuestions((prev) => !prev)}
                  >
                    <div className="flex gap-2 items-center">
                      <HiOutlinePlus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
                      <span className="group-hover:tracking-wide transition-all duration-200">
                        Add Question
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] opacity-0 hover:opacity-10 transition-opacity duration-200" />
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="group relative rounded-full transition-all duration-200 border-red-200 text-red-500 hover:!text-red-600 overflow-hidden"
                    onClick={handleDiscard}
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
                    onClick={handleAddSection}
                  >
                    <RxCardStack className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
                    <span className="group-hover:tracking-wide transition-all duration-200">
                      Add New Section
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-200 to-green-400 opacity-0 group-hover:opacity-10 transition-opacity duration-200" />
                  </Button>
                  {sections.length > 1 && (
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteSection(currentSectionIndex)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-200 text-red-600 hover:text-white rounded-full shadow-sm hover:bg-red-500"
                      title="Remove Current Section"
                    >
                      <Trash2 className="w-5 h-5" />
                      Remove Current Section
                    </Button>
                  )}
                </div>
              </div>
              {/* End new bottom section design */}
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-col space-y-6 pb-10 mt-10 px-0">
            {/* <div className="flex flex-col md:flex-row items-center justify-between gap-4">
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

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      // disabled={!questions || questions.length === 0}
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
            </div> */}

            <Button
              disabled={
                isLoading ||
                !Boolean(sectionTopic.trim().length) ||
                !Boolean(sectionDescription?.trim().length) ||
                !questions?.length
              }
              size="lg"
              className="w-full h-12 bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] text-white hover:opacity-90 transition-all duration-300 scale-95 hover:scale-100 hover:shadow-lg rounded-xl"
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
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="questions"
                className="flex items-center gap-2"
              >
                <Paintbrush className="h-4 w-4" />
                Style
              </TabsTrigger>
              <TabsTrigger
                value="skip-logic"
                className="flex items-center gap-2"
              >
                <AlignVerticalSpaceAround className="h-4 w-4" />
                Skip Logic
              </TabsTrigger>
            </TabsList>

            <TabsContent value="questions" className="h-full">
              <StyleEditor
                surveyData={surveyData}
                setSurveyData={setSurveyData}
              />
            </TabsContent>

            <TabsContent value="skip-logic" className="h-full">
              <SkipLogicEditor
                sections={sections.map((section) => ({
                  section_topic: section.title,
                  section_description: section.description,
                  questions: section.questions,
                }))}
                skipLogic={skipLogic}
                onChange={handleSkipLogicUpdate}
              />
            </TabsContent>
          </Tabs>
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
      {/* {review && (
        <ReviewModal
          survey_id={survey_id}
          openModal={review}
          onClose={() => {
            setReview((prev) => !prev);
            router.push("/surveys/survey-list");
          }}
        /> 
        )} */}

      {showQuickSurveyFlow && survey_id && (
        <BuyQuickSurveyRespondent surveyId={survey_id} />
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
