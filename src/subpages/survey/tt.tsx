import Image from "next/image";
import { pollsensei_new_logo, sparkly } from "@/assets/images";
import { HiOutlinePlus } from "react-icons/hi";
import { VscLayersActive } from "react-icons/vsc";
import { Fragment, useEffect, useState } from "react";
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
import { useRouter } from "next/navigation";
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

const AddQuestionPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const sectionTopic = useSelector((state: RootState) => state?.survey?.topic);
  const theme = useSelector((state: RootState) => state?.survey?.theme);
  const sectionDescription = useSelector(
    (state: RootState) => state?.survey?.description
  );
  const selectedSurveyType = useSelector(
    (state: RootState) => state?.survey?.survey_type
  );
  const [sections, setSections] = useState<any[][]>([[]]); // Initialize with one empty section
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<number | null>(null);
  const [hoveredQuestionIndex, setHoveredQuestionIndex] = useState<
    number | null
  >(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

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

  // ... rest of your existing code ...

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
      (logoUrl instanceof File ? URL.createObjectURL(logoUrl) : logoUrl) ||
      "#ffffff",
    header_url:
      (headerUrl instanceof File
        ? URL.createObjectURL(headerUrl)
        : headerUrl) || "#ffffff",
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

  console.log(sectionTopic);
  console.log(sectionDescription);

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

    // Create the updated question object
    const updatedQuestionData = {
      question: updatedQuestion,
      options: updatedOptions,
      question_type: updatedQuestionType,
      is_required: isRequired,
    };

    // Dispatch the `updateQuestion` action
    dispatch(
      updateQuestion({ index: editIndex, updatedQuestion: updatedQuestionData })
    );

    // Reset editing state
    setEditIndex(null);
    setIsEdit(false);
  };

  console.log(survey);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    dispatch(addQuestion(items));
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

    const sectionExists = survey.sections.some(
      (section) =>
        section.section_topic === sectionTitle &&
        section.section_description === sDescription &&
        JSON.stringify(section.questions) === JSON.stringify(questions)
    );

    if (!sectionExists) {
      if (survey.sections.length === 0) {
        dispatch(
          addSection({
            questions: questions,
          })
        );
      } else {
        dispatch(
          addSection({
            section_topic: sectionTitle,
            section_description: sDescription,
            questions: questions,
          })
        );
      }
    }

    console.log(store.getState().survey);

    // try {
    //   const updatedSurvey = store.getState().survey;
    //   await createSurvey(updatedSurvey).unwrap();
    //   setSurvey_id(createdSurveyData.data._id);
    //   setReview(true);
    // } catch (e) {
    //   console.log(e);
    // }
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

  return (
    <div className={`${theme} flex flex-col gap-5 w-full px-5 pr-0 lg:pl-10`}>
      <div className={`flex flex-1 justify-between gap-10 w-full`}>
        <motion.div className="w-full lg:w-2/3 flex flex-col overflow-y-auto max-h-screen custom-scrollbar">
          {/* ... existing content ... */}
          {logoUrl && (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="bg-gradient-to-r from-[#9D50BB] to-[#6E48AA] rounded-lg w-16 my-5 text-white flex items-center flex-col shadow-lg hover:shadow-xl transform"
            >
              <Image
                src={
                  logoUrl instanceof File
                    ? URL.createObjectURL(logoUrl)
                    : typeof logoUrl === "string"
                    ? logoUrl
                    : sparkly
                }
                alt=""
                className="w-full object-cover rounded-lg bg-no-repeat h-16 transition-transform duration-300"
                width={100}
                height={200}
              />
            </motion.div>
          )}

          {headerUrl && (
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-r from-[#9D50BB] to-[#6E48AA] rounded-lg w-full my-4 text-white h-24 flex items-center flex-col shadow-lg overflow-hidden"
            >
              <Image
                src={
                  headerUrl instanceof File
                    ? URL.createObjectURL(headerUrl)
                    : typeof headerUrl === "string"
                    ? headerUrl
                    : sparkly
                }
                alt=""
                className="w-full object-cover bg-no-repeat h-24 rounded-lg transition-transform duration-300 hover:scale-105"
                width={100}
                height={200}
              />
            </motion.div>
          )}
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
                        onChange={(e) => setSectionTitle(e.target.value)}
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
                        onChange={(e) => setsDescription(e.target.value)}
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
                    columns
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
                  className="group transition-all duration-300 scale-95 hover:scale-100 hover:shadow rounded-full"
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
                )}

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
                <>
                  <div className="h-4 w-4 border-2 border-white rounded-full border-t-transparent animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <VscLayersActive className="mr-2 h-5 w-5 animate-pulse" />
                  Publish Survey
                </>
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
                log in to your account or sign up if you're new here.
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
    </div>
  );
};

export default AddQuestionPage;
