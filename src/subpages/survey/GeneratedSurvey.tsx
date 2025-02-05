"use client";

import React, { Fragment, useEffect, useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { FiEdit2 } from "react-icons/fi";
import Image from "next/image";
import { stars } from "@/assets/images";
import CommentQuestion from "@/components/survey/CommentQuestion";
import MultiChoiceQuestion from "@/components/survey/MultiChoiceQuestion";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { useDispatch } from "react-redux";
import { setQuestionObject } from "@/redux/slices/questions.slice";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FaEye } from "react-icons/fa6";
// import PaginationControls from "@/components/common/PaginationControls";
import MatrixQuestion from "@/components/survey/MatrixQuestion";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { StrictModeDroppable } from "@/components/ui/StrictModeDroppable";
import { AnimatePresence, motion } from "framer-motion";
import SenseiMaster from "@/components/sensei-master/SenseiMaster";
import SingleChoiceQuestion from "@/components/survey/SingleChoiceQuestion";
import CheckboxQuestion from "@/components/survey/CheckboxQuestion";
import RatingScaleQuestion from "@/components/survey/RatingScaleQuestion";
import DropdownQuestion from "@/components/survey/DropdownQuestion";
import NumberQuestion from "@/components/survey/NumberQuestion";
import StarRatingQuestion from "@/components/survey/StarRatingQuestion";
import LikertScaleQuestion from "@/components/survey/LikertScaleQuestion";
import ShortTextQuestion from "@/components/survey/LongTextQuestion";
import SliderQuestion from "@/components/survey/SliderQuestion";
import BooleanQuestion from "@/components/survey/BooleanQuestion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

interface GeneratedSurveyProps {
  data: any;
  onClick: () => void;
}

const GeneratedSurvey: React.FC<GeneratedSurveyProps> = ({ data, onClick }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isEdit, setIsEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(0);
  const [questions, setQuestions] = useState(data);
  const [showDialog, setShowDialog] = useState(false);
  const dispatch = useDispatch();
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const surveyTitle = useSelector((state: RootState) => state?.survey.topic);
  const userToken = useSelector(
    (state: RootState) => state?.user?.access_token || state.user.token
  );
  const user = useSelector((state: RootState) => state?.user?.user);
  const headerText = useSelector(
    (state: RootState) => state?.survey?.header_text
  );
  const surveyDescription = useSelector(
    (state: RootState) => state?.survey?.description
  );
  const survey = useSelector((state: RootState) => state?.survey);
  const totalPages = questions.length;

  useEffect(() => {
    if (!surveyTitle || !surveyDescription || !questions) {
      const redirectPath = userToken && user ? "/surveys" : "/demo";
      const returnTo = searchParams.get("returnTo");
      if (returnTo) {
        router.push(returnTo);
      } else {
        router.push(redirectPath);
      }
    }
  }, [
    surveyTitle,
    surveyDescription,
    questions,
    router,
    searchParams,
    userToken,
    user,
  ]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setQuestions(items);
  };

  const EditQuestion = async (id: any) => {
    const questionIndex = questions?.findIndex(
      (_question: any, index: any) => index === id
    );
    setEditIndex(questionIndex);
    setIsEdit(true);
    console.log(questions[questionIndex]);
  };

  const handleEdit = () => {
    dispatch(
      setQuestionObject({
        title: surveyTitle,
        conversation_id: data?.data?.conversation_id,
        questions: questions,
        description: surveyDescription,
      })
    );
    router.push(
      userToken && user ? "/surveys/edit-survey" : "/demo/edit-survey"
    );
  };

  return (
    <div className="w-full">
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent
          className="sm:max-w-md md:max-w-lg z-[100000] p-6 rounded-2xl shadow-2xl"
          overlayClassName="z-[100000] backdrop-blur-sm"
        >
          <DialogHeader className="space-y-4">
            <DialogTitle className="text-center text-xl md:text-2xl font-bold bg-gradient-to-r from-[#5B03B2] via-[#7928CA] to-[#9D50BB] bg-clip-text text-transparent animate-gradient">
              Ready to Customize Your Survey?
            </DialogTitle>
            <div className="flex justify-center">
              <motion.img
                src="/assets/illustrations/editor.svg"
                alt="Survey Editor Illustration"
                className="w-48 h-48 md:w-56 md:h-56"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 10,
                  delay: 0.2,
                }}
              />
            </div>
            <DialogDescription className="text-center md:text-base text-gray-600 leading-relaxed max-w-md mx-auto">
              You're about to enter the survey editor where you can refine and
              perfect every detail of your survey. Let's make something amazing
              together!
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-8">
            <Button
              onClick={handleEdit}
              className="group relative overflow-hidden bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] text-white px-10 py-3 rounded-xl font-medium text-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <span className="relative text-base z-10 flex items-center gap-2 group-hover:tracking-wider transition-all duration-300">
                Continue to Editor
                <motion.svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{
                    x: [0, 5, 0],
                    opacity: [1, 0.7, 1],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </motion.svg>
              </span>
              <div className="absolute inset-0 bg-white mix-blend-overlay opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-xl" />
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="py-10 px-16 w-full">
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col text-start"
          >
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[1.5rem] font-medium bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] bg-clip-text text-transparent"
            >
              Generated Survey
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="font-normal text-gray-600"
            >
              Here's your survey. You can choose to continue or use another
              prompt
            </motion.p>
          </motion.div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="group relative py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-200 hover:bg-purple-50"
              onClick={() => setShowDialog(true)}
            >
              <FiEdit2 className="size-4 transition-transform group-hover:scale-110 group-hover:text-purple-700" />
              <span className="relative z-10 group-hover:text-purple-700">
                Edit Survey
              </span>
            </Button>
            <Button
              onClick={onClick}
              className="group relative py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-200 overflow-hidden w-full hover:scale-[1.02] active:scale-[0.98] border-2 border-[#5B03B2] bg-transparent hover:bg-gradient-to-r from-[#5B03B2] to-[#9D50BB]"
            >
              <span className="relative z-10 text-[#5B03B2] group-hover:text-white transition-colors duration-300 text-sm">
                Use another prompt
              </span>
              <Image
                src={stars}
                alt="stars"
                className="w-5 h-5 relative z-10 brightness-0 group-hover:brightness-200 transition-all duration-300"
              />
            </Button>
          </div>
        </div>
        <hr />
        <div className="py-10 w-full flex gap-10 ">
          <div className="pb-10 w-2/3 flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-start pb-5"
            >
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="font-bold text-[#7A8699] mb-2"
              >
                Survey Topic
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="text-[1.5rem] font-normal bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] bg-clip-text text-transparent"
                style={{
                  fontSize: `${headerText?.size}px`,
                  fontFamily: `${headerText?.name}`,
                }}
              >
                {surveyTitle}
              </motion.h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-start"
            >
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="font-bold text-[#7A8699] mb-2"
              >
                Survey description
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="text-gray-700 leading-relaxed"
              >
                {surveyDescription}
              </motion.h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex justify-between items-center pt-8 pb-5"
            >
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="text-sm font-medium text-[#5B03B2]"
              >
                Question
              </motion.p>
              <motion.p
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="text-sm font-medium text-[#9D50BB]"
              >
                Question Type
              </motion.p>
            </motion.div>
            <DragDropContext onDragEnd={handleDragEnd}>
              <StrictModeDroppable droppableId="questions">
                {(provided) => (
                  <motion.div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <AnimatePresence>
                      {questions[0]?.questions.map((item: any, index: any) => (
                        <Draggable
                          key={index + 1}
                          draggableId={index.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="mb-4 rounded-lg"
                            >
                              {item.question_type === "multiple_choice" ||
                              item.question_type === "multi_choice" ? (
                                <MultiChoiceQuestion
                                  index={index + 1}
                                  question={item.question}
                                  options={item.options}
                                  questionType={item.question_type}
                                  EditQuestion={() => EditQuestion(index)}
                                  canUseAI={true}
                                />
                              ) : item.question_type === "single_choice" ? (
                                <SingleChoiceQuestion
                                  index={index + 1}
                                  key={index}
                                  question={item.question}
                                  options={item.options}
                                  questionType={item.question_type}
                                />
                              ) : item.question_type === "comment" ||
                                item.question_type === "long_text" ? (
                                <CommentQuestion
                                  key={index}
                                  index={index + 1}
                                  question={item.question}
                                  questionType={item.question_type}
                                />
                              ) : item.question_type ===
                                "matrix_multiple_choice" ? (
                                <MatrixQuestion
                                  key={index}
                                  index={index + 1}
                                  rows={item.rows}
                                  columns={item.columns}
                                  question={item.question}
                                  questionType={item.question_type}
                                />
                              ) : item.question_type === "checkbox" ? (
                                <CheckboxQuestion
                                  key={index}
                                  index={index + 1}
                                  question={item.question}
                                  options={item.options}
                                  questionType={item.question_type}
                                />
                              ) : item.question_type === "matrix_checkbox" ? (
                                <MatrixQuestion
                                  key={index}
                                  index={index + 1}
                                  question={item.question}
                                  rows={item.rows}
                                  columns={item.columns}
                                  questionType={item.question_type}
                                />
                              ) : item.question_type === "rating_scale" ? (
                                <RatingScaleQuestion
                                  key={index}
                                  index={index + 1}
                                  question={item.question}
                                  options={item.options}
                                  questionType={item.question_type}
                                />
                              ) : item.question_type === "drop_down" ? (
                                <DropdownQuestion
                                  index={index + 1}
                                  key={index}
                                  question={item.question}
                                  options={item.options}
                                  questionType={item.question_type}
                                />
                              ) : item.question_type === "number" ? (
                                <NumberQuestion
                                  key={index}
                                  index={index + 1}
                                  question={item.question}
                                  questionType={item.question_type}
                                />
                              ) : item.question_type === "short_text" ? (
                                <ShortTextQuestion
                                  key={index}
                                  index={index + 1}
                                  question={item.question}
                                  questionType={item.question_type}
                                />
                              ) : item.question_type === "likert_scale" ? (
                                <LikertScaleQuestion
                                  key={index}
                                  index={index + 1}
                                  question={item.question}
                                  options={item.options}
                                  questionType={item.question_type}
                                />
                              ) : item.question_type === "star_rating" ? (
                                <StarRatingQuestion
                                  question={item.question}
                                  index={index + 1}
                                  questionType={item.question_type}
                                />
                              ) : item.question_type === "boolean" ? (
                                <BooleanQuestion
                                  key={index}
                                  index={index + 1}
                                  question={item.question}
                                  options={item.options}
                                  questionType={item.question_type}
                                />
                              ) : item.question_type === "slider" ? (
                                <SliderQuestion
                                  question={item.question}
                                  options={item.options}
                                  questionType={item.question_type}
                                  index={index + 1}
                                  is_required={item.is_required}
                                />
                              ) : null}
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </AnimatePresence>
                    {provided.placeholder}
                  </motion.div>
                )}
              </StrictModeDroppable>
            </DragDropContext>

            <div className="flex justify-between items-center pt-5 pb-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Button
                  onClick={() => setShowDialog(true)}
                  className="group relative py-3 px-8 rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-200 overflow-hidden hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] text-white hover:opacity-90"
                >
                  <span className="group-hover:tracking-wider transition-all duration-200">
                    Continue
                  </span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="flex items-center"
                  >
                    <IoArrowBackOutline className="text-lg rotate-180" />
                  </motion.div>
                  <motion.div
                    className="absolute inset-0 bg-white"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 0.1 }}
                    transition={{ duration: 0.2 }}
                  />
                </Button>
              </motion.div>
              {/* <div className="mt-6 sm:mt-8">
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setItemsPerPage={setItemsPerPage}
                  onPageChange={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratedSurvey;
