import Image from "next/image";
import { pollsensei_new_logo, sparkly } from "@/assets/images";
import { HiOutlinePlus } from "react-icons/hi";
import { VscLayersActive } from "react-icons/vsc";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useDispatch } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { GiCardDiscard } from "react-icons/gi";
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
import { Edit, Save } from "lucide-react";
import { X } from "lucide-react";
import { SurveyData } from "./EditSubmittedSurvey";
import { cn } from "@/lib/utils";
import WatermarkBanner from "@/components/common/WatermarkBanner";

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

    try {
      const updatedSurvey = store.getState().survey;
      await createSurvey(updatedSurvey).unwrap();
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

  console.log(questions);

  console.log(surveyData);

  return (
    <div className={`${theme} flex flex-col gap-5 w-full px-5 lg:pl-10`}>
      <div className={`${theme} flex justify-between gap-10 w-full`}>
        <div className="w-full lg:w-2/3 flex flex-col overflow-y-auto max-h-screen custom-scrollbar">
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
                  {surveyData.topic}
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
                  {surveyData.description}
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
                          className="mb-4"
                        >
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
                              />
                            ) : item.question_type === "number" ? (
                              <NumberQuestion
                                key={index}
                                index={index + 1}
                                question={item.question}
                                questionType={item.question_type}
                                EditQuestion={() => EditQuestion(index)}
                              />
                            ) : item.question_type === "long_text" ? (
                              <CommentQuestion
                                key={index}
                                index={index + 1}
                                question={item.question}
                                questionType={item.question_type}
                                EditQuestion={() => EditQuestion(index)}
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
                              />
                            ) : item.question_type === "likert_scale" ? (
                              <LikertScaleQuestion
                                key={index}
                                index={index + 1}
                                question={item.question}
                                options={item.options}
                                questionType={item.question_type}
                                EditQuestion={() => EditQuestion(index)}
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
                              />
                            ) : item.question_type === "slider" ? (
                              <SliderQuestion
                                question={item.question}
                                options={item.options}
                                // step={item.options.length}
                                questionType={item.question_type}
                                index={index + 1}
                                is_required={item.is_required}
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
          <div className="md:flex justify-between items-center pb-10">
            <div className="flex-col md:flex-row flex w-full gap-2 items-center">
              <button
                className="bg-white inline-block rounded-full px-5 py-1"
                onClick={() => setAddQuestions((prev) => !prev)}
              >
                <HiOutlinePlus className="inline-block mr-2" /> Add Question
              </button>
              {/* <button
                className="bg-white inline-block rounded-full px-5 py-1"
                onClick={() => {
                  dispatch(addSection({ questions: questions }));
                  dispatch(resetQuestion());
                  router.push("/surveys/add-new-section");
                }}
              >
                <IoDocumentOutline className="inline-block mr-2" />
                New Section
              </button> */}
              <button
                disabled={isLoading}
                className="bg-white inline-block rounded-full px-5 py-1"
                onClick={() => {
                  dispatch(resetQuestion());
                  dispatch(resetSurvey());
                  if (!userToken || !user) {
                    router.push("/demo/create-survey");
                  } else {
                    router.push("/surveys/survey-list");
                  }
                }}
              >
                <GiCardDiscard className="inline-block mr-2" />
                Discard
              </button>

              <button
                disabled={isLoading}
                className="bg-white inline-block rounded-full px-5 py-1"
                onClick={handleSurveyCreation}
              >
                <VscLayersActive className="inline-block mr-2" />
                Publish Survey
              </button>
            </div>
            {survey.sections.length > 0 && <div>Pagination</div>}
          </div>
          <WatermarkBanner />
        </div>
        <div
          className={`hidden lg:flex lg:w-1/3 overflow-y-auto max-h-screen custom-scrollbar bg-white`}
        >
          {/* {isSidebar ? <StyleEditor /> : <QuestionType />} */}
          <StyleEditor surveyData={surveyData} setSurveyData={setSurveyData} />
        </div>
      </div>
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
        <DialogContent className="max-w-md">
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
