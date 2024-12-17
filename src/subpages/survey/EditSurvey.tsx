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
  const headerText = useSelector(
    (state: RootState) => state.survey.header_text
  );
  const bodyText = useSelector((state: RootState) => state.survey.body_text);
  const [isEdit, setIsEdit] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const [aiChatbot, setAiChatbot] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [createSurvey, { data:createdSurveyData, isLoading, isSuccess, isError, error }] =
    useCreateSurveyMutation();
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
  const [survey_id,setSurvey_id] = useState("")

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
    if (newQuestionGenerate && Array.isArray(newSingleSurvey?.data?.response)) {
      console.log(newSingleSurvey);
      const updatedSections = [...questions];
      const currentSectionData = updatedSections[currentSection];

      // Iterate over each question in the array and add it to the current section
      const newQuestions = newSingleSurvey.data.response.map((question: any) => {
        const optionType = question["Option type"]?.trim();
        if(optionType ==="matrix_multiple_choice"){
          return {
            question: question.Question,
            rows: question.Options.Rows,
            columns: question.Options.Columns,
            question_type:optionType === null ? optionType : "",
            is_required: true,
            description: "",
          }
        }
        if(optionType ==="long_text" || optionType ==="short_text"){
          return {
            question: question.Question,
            options: "",
            question_type:optionType || "",
            is_required: true,
            description: "",
          }
        }
        if(optionType ==="boolean"){
          return {
            question: question.Question,
            options: ["Yes", "No"],
            question_type:optionType || "",
            is_required: true,
            description: "",
          }
        }
        if(optionType ==="number"){
          return {
            question: question.Question,
            options: "",
            min:1,
            max:10000000,
            question_type:optionType || "",
            is_required: true,
            description: "",
          }
        }
        if(optionType ==="slider"){
          return {
            question: question.Question,
            options: "",
            min: question.Options.Min,
            max:question.Options.Max,
            step:question.Options.Step,
            question_type:optionType || "",
            is_required: true,
            description: "",
          }
        }
        return {
          question: question.Question,
          options: question.Options,
          question_type:optionType || "",
          is_required: true,
          description: "",
        };
      });
  
      // Append new questions to the current section
      const updatedQuestions = [
        ...currentSectionData.questions,
        ...newQuestions,
      ];
      const updatedSection = {
        ...currentSectionData,
        questions: updatedQuestions,
      };

      // Dispatch the updated section
      dispatch(
        updateSection({ index: currentSection, newSection: updatedSection })
      );

      console.log(updatedQuestions);
    }
  }, [
    dispatch,
    newQuestionGenerate,
    newSingleSurvey?.data?.response,
    currentSection,
  ]);

  const handleSurveyCreation = async () => {
    // if(logoUrl === '' || headerUrl === ''){
    //   toast.warning("Header image and logo can not be empty")
    //   return null
    // }
    try {
      console.log(survey);
      const updatedSurvey = store.getState().survey;
      await createSurvey(updatedSurvey).unwrap();
      setSurvey_id(createdSurveyData.data._id);
      setReview(true)
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setReview((prev)=>!prev)
      toast.success("Survey created successfully");
      dispatch(resetSurvey());
      setSurvey_id(createdSurveyData.data._id);
      setReview(true)
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
      className={`${theme} flex flex-col gap-5 w-full px-5 lg:pl-16 relative`}
    >
      <div className={`${theme} flex justify-between gap-10 w-full`}>
        <div className="lg:w-2/3 flex flex-col overflow-y-auto max-h-screen custom-scrollbar">
          {isNewSection ? (
            <>
              {logoUrl && (
                <div className="bg-[#9D50BB] rounded w-16 my-5 text-white flex items-center flex-col ">
                  <Image
                    src={
                      logoUrl instanceof File
                        ? URL.createObjectURL(logoUrl)
                        : typeof logoUrl === "string"
                        ? logoUrl
                        : sparkly
                    }
                    alt=""
                    className="w-full object-cover rounded  bg-no-repeat h-16 "
                    width={"100"}
                    height={"200"}
                  />
                </div>
              )}
              {/* <button type="reset" onClick={()=>{
              dispatch(resetSurvey())
            }}>
              Reset
            </button> */}

              {headerUrl && (
                <div className="bg-[#9D50BB] rounded-lg w-full my-4 text-white h-24 flex items-center flex-col ">
                  <Image
                    src={
                      headerUrl instanceof File
                        ? URL.createObjectURL(headerUrl)
                        : typeof headerUrl === "string"
                        ? headerUrl
                        : sparkly
                    }
                    alt=""
                    className="w-full object-cover bg-no-repeat h-24 rounded-lg"
                    width={"100"}
                    height={"200"}
                  />
                </div>
              )}

              <div className="bg-white rounded-lg w-full my-4 flex gap-2 px-11 py-4 flex-col ">
                <h2
                  className="text-[1.5rem] font-normal"
                  style={{
                    fontSize: `${headerText?.size}px`,
                    fontFamily: `${headerText?.name}`,
                  }}
                >
                  {survey?.topic}
                </h2>
                <p
                  style={{
                    fontSize: `${bodyText?.size}px`,
                    fontFamily: `${bodyText?.name}`,
                  }}
                >
                  {survey?.description}
                </p>
                <div className="flex justify-end">
                  {/* <button className="rounded-full border px-5 py-1" >Edit</button> */}
                </div>
              </div>
              {questions[currentSection]?.questions.map(
                (item: any, index: number) => (
                  <div key={index} className="mb-4">
                    {isEdit &&
                    editIndex === index &&
                    item.question_type === "matrix_multiple_choice" ? (
                      <MatrixQuestionEdit
                        question={item.question}
                        options={item.options}
                        is_required={item.is_required}
                        questionType={item.question_type}
                        onSave={handleSave}
                        onCancel={handleCancel}
                      />
                    ) : isEdit && editIndex === index ? (
                      <MultiChoiceQuestionEdit
                        index={index + 1}
                        question={item.question}
                        options={item.options}
                        questionType={item.question_type}
                        is_required={item.is_required}
                        onSave={handleSave}
                        onCancel={handleCancel}
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
                          dispatch(
                            updateSection({
                              index: currentSection,
                              newSection: updatedSection,
                            })
                          );
                        }}
                        questionType={item.question_type}
                        EditQuestion={() => EditQuestion(index)}
                        index={index + 1}
                        DeleteQuestion={() => handleDeleteQuestion(index)}
                        setEditId={setEditIndex}
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
                          dispatch(
                            updateSection({
                              index: currentSection,
                              newSection: updatedSection,
                            })
                          );
                        }}
                        EditQuestion={() => EditQuestion(index)}
                        DeleteQuestion={() => handleDeleteQuestion(index)}
                        onSave={handleAISave}
                      />
                    ) : item.question_type === "linear_Scale" ? (
                      <LinearScaleQuestion
                        question={item.question}
                        scaleStart={item.scaleStart}
                        scaleEnd={item.scaleEnd}
                        questionType={item.question_type}
                        EditQuestion={() => EditQuestion(index)}
                        DeleteQuestion={() => handleDeleteQuestion(index)}
                        onSave={handleAISave}
                        index={index + 1}
                      />
                    ) : item.question_type === "likert_scale" ? (
                      <LikertScaleQuestion
                        question={item.question}
                        options={item.options}
                        questionType={item.question_type}
                        EditQuestion={() => EditQuestion(index)}
                        DeleteQuestion={() => handleDeleteQuestion(index)}
                        onSave={handleAISave}
                        index={index + 1}
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
                          dispatch(
                            updateSection({
                              index: currentSection,
                              newSection: updatedSection,
                            })
                          );
                        }}
                      />
                    ) : item.question_type === "star_rating" ? (
                      <StarRatingQuestion
                        question={item.question}
                        // maxRating={5}
                        questionType={item.question_type}
                        EditQuestion={() => EditQuestion(index)}
                        DeleteQuestion={() => handleDeleteQuestion(index)}
                        onSave={handleAISave}
                        index={index + 1}
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
                          dispatch(
                            updateSection({
                              index: currentSection,
                              newSection: updatedSection,
                            })
                          );
                        }}
                      />
                    ) : item.question_type === "matrix_multiple_choice" ? (
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
                        onSave={handleAISave}
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
                          dispatch(
                            updateSection({
                              index: currentSection,
                              newSection: updatedSection,
                            })
                          );
                        }}
                      />
                    ) :  item.question_type === "single_choice" ? (
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
                        onSave={handleAISave}
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
                          dispatch(
                            updateSection({
                              index: currentSection,
                              newSection: updatedSection,
                            })
                          );
                        }}
                      />
                    ) :  item.question_type === "checkbox" ? (
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
                      onSave={handleAISave}
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
                        dispatch(
                          updateSection({
                            index: currentSection,
                            newSection: updatedSection,
                          })
                        );
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
                        DeleteQuestion={() =>
                          handleDeleteQuestion(index)
                        }
                        onSave={handleAISave}
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
                          dispatch(
                            updateSection({
                              index: currentSection,
                              newSection: updatedSection,
                            })
                          );
                        }}
                      />
                    )
                    :  item.question_type === "drop_down" ? (
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
                        onSave={handleAISave}
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
                          dispatch(
                            updateSection({
                              index: currentSection,
                              newSection: updatedSection,
                            })
                          );
                        }}
                      />
                    )
                     : item.question_type === "number" ? (
                      <NumberQuestion
                        key={index}
                        index={index + 1}
                        question={item.question}
                        questionType={item.question_type}
                        EditQuestion={() => EditQuestion(index)}
                        DeleteQuestion={() =>
                          handleDeleteQuestion(index)
                        }
                        onSave={handleAISave}
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
                          dispatch(
                            updateSection({
                              index: currentSection,
                              newSection: updatedSection,
                            })
                          );
                        }}
                      />
                    ) : item.question_type === "short_text" ? (
                      <ShortTextQuestion
                        key={index}
                        index={index + 1}
                        question={item.question}
                        questionType={item.question_type}
                        EditQuestion={() => EditQuestion(index)}
                        DeleteQuestion={() =>
                          handleDeleteQuestion(index)
                        }
                        onSave={handleAISave}
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
                          dispatch(
                            updateSection({
                              index: currentSection,
                              newSection: updatedSection,
                            })
                          );
                        }}
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
                        onSave={handleAISave}
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
                          dispatch(
                            updateSection({
                              index: currentSection,
                              newSection: updatedSection,
                            })
                          );
                        }}
                      />
                    )  : item.question_type === "slider" ? (
                      <SliderQuestion
                      question={item.question}
                      options={item.options}
                      // step={item.options.length}
                      questionType={item.question_type}
                      index={index + 1}
                      is_required={item.is_required}
                      EditQuestion={() => EditQuestion(index)}
                        DeleteQuestion={() =>
                          handleDeleteQuestion(index)
                        }
                        // @ts-expect-error expect here
                        onSave={handleAISave}
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
                          dispatch(
                            updateSection({
                              index: currentSection,
                              newSection: updatedSection,
                            })
                          );
                        }}
                      />
                    ) 
                    : null}
                  </div>
                )
              )}
              <div className="flex flex-col gap-4 md:flex-row justify-between items-center">
                <div className="flex gap-2 items-center">
                  <button
                    className="bg-white rounded-full px-5 py-1"
                    onClick={() => setAddMoreQuestion((prev) => !prev)}
                    disabled={generatingSingleSurvey}
                  >
                    {generatingSingleSurvey ? (
                      <ClipLoader size={24} />
                    ) : (
                      <>
                        <HiOutlinePlus className="inline-block mr-2" /> Add
                        Question
                      </>
                    )}
                  </button>
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

              <div className=" rounded-md flex flex-col justify-center w-full md:w-[16rem] py-5 text-center">
                <button
                  className="bg-gradient-to-r from-[#5b03b2] to-[#9d50bb] rounded-lg px-8 py-2 text-white text-[16px] font-medium leading-6 text-center font-inter justify-center"
                  type="button"
                  onClick={handleSurveyCreation}
                >
                  {isLoading ? "Submitting" : "Continue"}
                </button>
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

      <ModalComponent
        title="How many more question would you like the Sensei to add?"
        openModal={addMoreQuestion}
        // onClose={() => setAddMoreQuestion((prev)=> !prev)}
      >
        <div className="flex flex-col w-full gap-4 px-4">
          <label>Enter a number between 1 and 5</label>
          <input
            type="number"
            min="1"
            max="5"
            placeholder="Enter a number between 1 and 5"
            className="w-full py-1 px-2 my-1"
            onChange={(e) => setQuestionCount(Number(e.target.value))}
          />

          <button
            className={`w-full border py-2 rounded ${
              question_count >= 1 && question_count <= 5
                ? "bg-gradient-to-r from-[#5b03b2] to-[#9d50bb] rounded-lg px-8 py-2 text-white text-[16px] font-medium leading-6 text-center font-inter justify-center"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
            disabled={!(question_count >= 1 && question_count <= 5)}
            onClick={() => {
              setAddMoreQuestion((prev) => !prev);
              handleGenerateSingleQuestion();
            }}
          >
            Add
          </button>
        </div>
      </ModalComponent>

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
      {
         review &&   <ReviewModal
                survey_id={survey_id}
                openModal={review}
                onClose={() =>{ 
                  setReview((prev) => !prev)
                router.push("/surveys/survey-list");

                }}
              />
      }
    </div>
  );
};

export default EditSurvey;
