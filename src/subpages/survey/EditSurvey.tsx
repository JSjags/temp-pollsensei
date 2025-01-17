import CommentQuestion from "@/components/survey/CommentQuestion";
import LikertScaleQuestion from "@/components/survey/LikertScaleQuestion";
import LinearScaleQuestion from "@/components/survey/LinearScaleQuestion";
import MultiChoiceQuestion from "@/components/survey/MultiChoiceQuestion";
import MultiChoiceQuestionEdit from "@/components/survey/MultiChoiceQuestionEdit";
import StarRatingQuestion from "@/components/survey/StarRatingQuestion";
import { RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import StyleEditor from "./StyleEditor";
import QuestionType from "./QuestionType";
import Image from "next/image";
import { pollsensei_new_logo, sparkly, stars } from "@/assets/images";
import { HiOutlinePlus } from "react-icons/hi";
import { IoDocumentOutline } from "react-icons/io5";
import MatrixQuestion from "@/components/survey/MatrixQuestion";
import {
  useCreateSurveyMutation,
  useGenerateSingleSurveyMutation,
  useSaveProgressMutation,
} from "@/services/survey.service";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import MatrixQuestionEdit from "@/components/survey/MatrixQuestionEdit";
import { VscLayersActive } from "react-icons/vsc";
import CreateNewSection from "./CreateNewSection";
import { useRouter } from "next/navigation";
import {
  deleteQuestionFromSection,
  resetSurvey,
  updateSection,
} from "@/redux/slices/survey.slice";
import store from "@/redux/store";
import Sensei from "@/components/ui/Sensei";
import PaginationBtn from "@/components/common/PaginationBtn";
import { AnimatePresence, motion } from "framer-motion";
import SenseiMaster from "@/components/sensei-master/SenseiMaster";
import ModalComponent from "@/components/ui/ModalComponent";
import WaitingMessagesModal from "@/components/modals/WaitingModal";
import SingleChoiceQuestion from "@/components/survey/SingleChoiceQuestion";
import CheckboxQuestion from "@/components/survey/CheckboxQuestion";
import RatingScaleQuestion from "@/components/survey/RatingScaleQuestion";
import DropdownQuestion from "@/components/survey/DropdownQuestion";
import NumberQuestion from "@/components/survey/NumberQuestion";
import ShortTextQuestion from "@/components/survey/LongTextQuestion";
import BooleanQuestion from "@/components/survey/BooleanQuestion";
import SliderQuestion from "@/components/survey/SliderQuestion";
import ReviewModal from "@/components/modals/ReviewModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import QuestionRenderer from "@/components/survey/QuestionRenderer";
import SurveyHeader from "@/components/survey/SurveyHeader";
import {
  handleRequiredToggle,
  processNewSurveyQuestions,
} from "@/utils/surveyUtils";
import { ArrowRight, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/shadcn-input";

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
  const [aiChatbot, setAiChatbot] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
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

  const EditQuestion = (index: any) => {
    setEditIndex(index);
    setIsEdit(true);
    setIsSidebarOpen(false);
    setAiChatbot(true);
    console.log(index);
    setSelectIndex(index);
  };

  const navigatePage = (direction: any) => {
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
      Array.isArray((newSingleSurvey as any)?.data?.response)
    ) {
      const newQuestions = processNewSurveyQuestions(
        (newSingleSurvey as any).data.response
      );

      const updatedSections = [...questions];
      const currentSectionData = updatedSections[currentSection];

      const updatedQuestions = [
        ...currentSectionData.questions,
        ...newQuestions,
      ];
      const updatedSection = {
        ...currentSectionData,
        questions: updatedQuestions,
      };

      dispatch(
        updateSection({ index: currentSection, newSection: updatedSection })
      );
    }
  }, [dispatch, newQuestionGenerate, newSingleSurvey, currentSection]);

  const handleSurveyCreation = async () => {
    if (!userToken || !user) {
      setShowAuthModal(true);
      return;
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
  }, [progressError, progressIsError]);

  console.log(survey);
  console.log(survey_id);
  console.log(questions[currentSection]?.questions);
  console.log(logoUrl);
  console.log(createdSurveyData);

  return (
    <div
      className={`${theme} flex flex-col gap-5 w-full px-0 lg:pl-16 relative`}
    >
      <div className={`${theme} flex justify-between gap-10 w-full`}>
        <div className="lg:w-2/3 flex flex-col overflow-y-auto max-h-screen custom-scrollbar">
          {isNewSection ? (
            <>
              <SurveyHeader
                logoUrl={logoUrl}
                headerUrl={headerUrl}
                survey={survey}
                headerText={headerText}
                bodyText={bodyText}
              />

              {questions[currentSection]?.questions.map(
                (item: any, index: number) => (
                  <div key={index} className="mb-4">
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
                      handleDeleteQuestion={handleDeleteQuestion}
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
                )
              )}

              <div className="flex flex-col gap-4 md:flex-row justify-between items-center">
                <div className="flex gap-2 items-center">
                  <Button
                    variant="outline"
                    className="group relative rounded-full transition-all duration-200 border-none overflow-hidden"
                    onClick={() => setAddMoreQuestion((prev) => !prev)}
                    disabled={generatingSingleSurvey}
                  >
                    {generatingSingleSurvey ? (
                      <ClipLoader size={24} />
                    ) : (
                      <>
                        <HiOutlinePlus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
                        <span className="group-hover:tracking-wide transition-all duration-200">
                          Add Question
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] opacity-0 hover:opacity-10 transition-opacity duration-200" />
                      </>
                    )}
                  </Button>
                  {/* <div className="bg-white rounded-full px-5 py-1" 
              // onClick={handleNewSection}
              >
                <IoDocumentOutline className="inline-block mr-2" />
                New Section
              </div> */}
                </div>
                {questions?.length > 1 && (
                  <div className="flex w-full md:w-auto md:justify-end items-center">
                    <PaginationBtn
                      currentSection={currentSection}
                      totalSections={questions.length}
                      onNavigate={navigatePage}
                    />
                  </div>
                )}
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
              {/* {aiChatbot && (
                <Sensei
                  isOpen={aiChatbot}
                  setIsOpen={() => setAiChatbot(!aiChatbot)}
                  currentSection={currentSection}
                  questionIndex={selectIndex}
                />
              )} */}

              <div className="rounded-md flex flex-col justify-center w-full md:w-[16rem] overflow-visible py-5 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Button
                    onClick={handleSurveyCreation}
                    className="group relative py-3 px-8 rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-200 overflow-hidden active:scale-[0.98] bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] text-white hover:opacity-90 w-full"
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
              <div className="bg-[#5B03B21A] rounded-md flex flex-col justify-center items-center mb-10 py-5 text-center relative">
                <div className="flex flex-col">
                  <p>Form created by</p>
                  <Image src={pollsensei_new_logo} alt="Logo" />
                </div>
                <span className="absolute bottom-2 right-4 text-[#828282]">
                  Remove watermark
                </span>
              </div>
            </>
          ) : (
            <CreateNewSection />
          )}
        </div>
        <div
          className={`hidden lg:flex lg:w-1/3 overflow-y-auto max-h-screen custom-scrollbar bg-white`}
        >
          {isSidebar ? <StyleEditor /> : <QuestionType />}
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
            type="generation"
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
              onClick={() => router.push("/login?ed=2")}
              className="w-full bg-gradient-to-r from-[#5b03b2] to-[#9d50bb] text-white hover:opacity-90 transition-opacity"
            >
              Log In
            </Button>

            <Button
              onClick={() => router.push("/register?ed=2")}
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

export default EditSurvey;
