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
import { useCreateSurveyMutation, useGenerateSingleSurveyMutation, useSaveProgressMutation } from "@/services/survey.service";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import MatrixQuestionEdit from "@/components/survey/MatrixQuestionEdit";
import { VscLayersActive } from "react-icons/vsc";
import CreateNewSection from "./CreateNewSection";
import { useRouter } from "next/navigation";
import { deleteQuestionFromSection, resetSurvey, updateSection } from "@/redux/slices/survey.slice";
import store from '@/redux/store';
import Sensei from "@/components/ui/Sensei";
import PaginationBtn from "@/components/common/PaginationBtn";
import { resetQuestion } from "@/redux/slices/questions.slice";




const EditSurvey = () => {
  // const question = useSelector((state: RootState) => state.question);
  const survey = useSelector((state: RootState) => state.survey);
  const questions = useSelector((state: RootState) => state?.survey?.sections);
  const headerUrl = useSelector((state: RootState) => state?.survey?.header_url);
  const logoUrl = useSelector((state: RootState) => state?.survey?.logo_url);
  const theme = useSelector((state: RootState) => state?.survey?.theme);
  const headerText = useSelector((state:RootState)=>state.survey.header_text)
  const bodyText = useSelector((state:RootState)=>state.survey.body_text);
  const [isEdit, setIsEdit] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const [aiChatbot, setAiChatbot] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [createSurvey, {isLoading, isSuccess, isError, error}] = useCreateSurveyMutation();
  const [saveprogress, { isSuccess:progressSuccess, isError:progressIsError, error:progressError}] = useSaveProgressMutation();
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isSidebar, setIsSidebarOpen] = useState(true);
  const [
    generateSingleSurvey,
    { data: newSingleSurvey, isLoading: generatingSingleSurvey, isSuccess: newQuestionGenerate},
  ] = useGenerateSingleSurveyMutation();
  const [isNewSection, setIsNewSection] = useState(true);
  const [selectIndex, setSelectIndex] = useState<number | null >(null);


  const EditQuestion = (index: any) => {
    setEditIndex(index);
    setIsEdit(true);
    setIsSidebarOpen(false);
    setAiChatbot(true);
    console.log(index)
    setSelectIndex(index)
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
    updatedQuestionType: string
  ) => {
    const updatedSections = [...questions];
      const currentSectionData = updatedSections[currentSection];
  
    if (editIndex !== null && currentSectionData) {
      const updatedQuestionData = {
        ...currentSectionData.questions[editIndex],
        question: updatedQuestion,
        options: updatedOptions,
        question_type: updatedQuestionType,
        is_required: currentSectionData.questions[editIndex].is_required || false, 
      };
        const updatedSection = {
        ...currentSectionData,
        questions: currentSectionData.questions.map((q, idx) =>
          idx === editIndex ? updatedQuestionData : q
        ),
      };
        dispatch(updateSection({ index: currentSection, newSection: updatedSection }));
        setEditIndex(null);
      setIsEdit(false);
    }
      setIsSidebarOpen((prev) => !prev);
      setAiChatbot((prev) => !prev);
  };
  

  const handleDeleteQuestion = (index:number) => {
    dispatch(deleteQuestionFromSection({ sectionIndex: currentSection, questionIndex: index }));
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
      });
      toast.success("Single survey added successfully");
    } catch (e) {
      toast.error("Failed to create survey");
      console.error(e);
    }
  };
  


    // const updatedSections = [...questions];
    // const currentSectionData = updatedSections[currentSection];
    // console.log(currentSectionData.questions[0])


  // useEffect(() => {
  //   if (newQuestionGenerate && newSingleSurvey?.data?.response) {
  //     console.log(newSingleSurvey)
  //     const updatedSections = [...questions];
  //     const currentSectionData = updatedSections[currentSection];
  //     const optionType = newSingleSurvey.data.response["Option type"]?.trim();

  //     const newQuestion = {
  //       question: newSingleSurvey.data.response.Question,
  //       options: newSingleSurvey.data.response.Options,
  //       question_type: optionType === "Multi-choice"
  //       ? "multiple_choice"
  //       : optionType === "Comment"
  //       ? "long_text"
  //       : "matrix_checkbox",
  //       is_required: false,
  //     };
  //     const updatedQuestions = [...currentSectionData.questions, newQuestion];
  //     const updatedSection = {
  //       ...currentSectionData,  
  //       questions: updatedQuestions
  //     };

  //     dispatch(updateSection({ index: currentSection, newSection: updatedSection }));
  //   }
  // }, [dispatch, newQuestionGenerate, newSingleSurvey?.data?.response, questions[currentSection]?.questions]);
  
  useEffect(() => {
    if (newQuestionGenerate && newSingleSurvey?.data?.response) {
      console.log(newSingleSurvey);
      const updatedSections = [...questions];
      const currentSectionData = updatedSections[currentSection];
      const optionType = newSingleSurvey.data.response["Option type"]?.trim();
      const newQuestion = {
        question: newSingleSurvey.data.response.Question,
        options: newSingleSurvey.data.response.Options,
        question_type: optionType === "Multi-choice"
          ? "multiple_choice"
          : optionType === "Comment"
          ? "long_text"
          : "matrix_checkbox",
        is_required: false,
      };
  
      const updatedQuestions = [...currentSectionData.questions, newQuestion];
      const updatedSection = {
        ...currentSectionData,
        questions: updatedQuestions,
      };
  
      dispatch(updateSection({ index: currentSection, newSection: updatedSection }));
    }
  }, [dispatch, newQuestionGenerate, newSingleSurvey?.data?.response, currentSection]);
  
  
  const handleSurveyCreation =async()=>{
    if(logoUrl === '' || headerUrl === ''){
      toast.warning("Header image and logo can not be empty")
      return null
    }
    try{
      console.log(survey)
      const updatedSurvey = store.getState().survey;
      await createSurvey(
        updatedSurvey
      );
    }catch(e){
      console.log(e)
    };
  }



  useEffect(()=>{
    if(isSuccess){
      toast.success("Survey created successfully")
      dispatch(resetSurvey())
      router.push('/surveys/survey-list')
    }

    if(isError || error){
      const SaveProgress=async()=>{
        try{
          await saveprogress(survey);
        }catch(e){
          console.error(e)
        }
      }
      SaveProgress()
      toast.error("Failed to create survey, Don't panic, your progress was saved")
    }
  }, [isSuccess, isError, error, dispatch, router, saveprogress, survey]);

  useEffect(()=>{
    if(progressSuccess){
      router.push('/surveys')
    }
    if(progressIsError || progressError){
      toast.error("Failed to save progress, please try again later")
      dispatch(resetSurvey())
      dispatch(resetQuestion());
      router.push('/surveys')
    }
  }, [progressError, progressIsError])

  console.log(survey)
  console.log(questions[currentSection]?.questions)

  return (
    <div className={`${theme} flex flex-col gap-5 w-full px-5 lg:pl-16 relative`}>
      <div className={`${theme} flex justify-between gap-10 w-full`}>
        <div className="lg:w-2/3 flex flex-col overflow-y-auto max-h-screen custom-scrollbar">
       {isNewSection ? <>
          {logoUrl ? (
            <div className="bg-[#9D50BB]  w-1/3 my-5 text-white flex items-center flex-col ">
              <Image
                src={
                  logoUrl instanceof File
                    ? URL.createObjectURL(logoUrl)
                    : typeof logoUrl === "string"
                    ? logoUrl
                    : sparkly
                }
                alt=""
                className="w-full object-cover bg-no-repeat h-16 "
                width={"100"}
                height={"200"}
              />
            </div>
          ) : (
            <div className="bg-[#9D50BB] rounded-full w-1/3 my-5 text-white py-3 flex items-center flex-col ">
              <p>LOGO GOES HERE</p>
            </div>
          )}
            {/* <button type="reset" onClick={()=>{
              dispatch(resetSurvey())
              router.push('/surveys')
            }}>
              Reset
            </button> */}
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

          <div className="bg-white rounded-lg w-full my-4 flex gap-2 px-11 py-4 flex-col ">
          <h2 className="text-[1.5rem] font-normal" style={{fontSize:`${headerText?.size}px`, fontFamily:`${headerText?.name}` }}>{survey?.topic}</h2>
          <p style={{fontSize:`${bodyText?.size}px`, fontFamily:`${bodyText?.name}` }}>{survey?.description}</p>
          <div className="flex justify-end">
            {/* <button className="rounded-full border px-5 py-1" >Edit</button> */}
          </div>
          </div>
          {questions[currentSection]?.questions.map((item: any, index: number) => (
            <div key={index} className="mb-4">
              {isEdit && editIndex === index && item.question_type === "matrix_checkbox" ? (
                <MatrixQuestionEdit
                  question={item.question}
                  options={item.options}
                  questionType={item.question_type}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />
              ) :
              isEdit && editIndex === index ? (
                <MultiChoiceQuestionEdit
                  question={item.question}
                  options={item.options}
                  questionType={item.question_type}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />
              )
               : item.question_type === "multiple_choice" || item.question_type === "multi_choice" ? (
                <MultiChoiceQuestion
                  question={item.question}
                  options={item.options}
                  questionType={item.question_type}
                  EditQuestion={() => EditQuestion(index)}
                  index={index + 1}
                  DeleteQuestion={()=>handleDeleteQuestion(index)}
                />
              ) : item.question_type === "comment" || item.question_type === "long_text" ? (
                <CommentQuestion
                  key={index}
                  index={index + 1}
                  questionType={item.question_type}
                  question={item.question}
                  EditQuestion={() => EditQuestion(index)}
                  DeleteQuestion={()=>handleDeleteQuestion(index)}
                />
              ) : item.question_type === "linear_Scale" ? (
                <LinearScaleQuestion
                  question={item.question}
                  scaleStart={item.scaleStart}
                  scaleEnd={item.scaleEnd}
                  questionType={item.question_type}
                  EditQuestion={() => EditQuestion(index)}
                  DeleteQuestion={()=>handleDeleteQuestion(index)}
                />
              ) : item.question_type === "likert_Scale" ? (
                <LikertScaleQuestion
                  question={item.question}
                  options={item.options}
                  questionType={item.question_type}
                  EditQuestion={() => EditQuestion(index)}
                  DeleteQuestion={()=>handleDeleteQuestion(index)}
                />
              ) : item.question_type === "star_rating" ? (
                <StarRatingQuestion
                  question={item.question}
                  maxRating={5}
                  questionType={item.question_type}
                  EditQuestion={() => EditQuestion(index)}
                  DeleteQuestion={()=>handleDeleteQuestion(index)}
                />
              ) : item.question_type === "matrix_checkbox" ? (
                <MatrixQuestion
                  key={index}
                  index={index + 1}
                  options={item.options}
                  questionType={item.question_type}
                  question={item.question}
                  EditQuestion={() => EditQuestion(index)}
                  DeleteQuestion={()=>handleDeleteQuestion(index)}
                />
              ) : null}
            </div>
          ))}
          <div className="flex flex-col gap-4 md:flex-row justify-between items-center">
            <div className="flex gap-2 items-center">
              <button
                className="bg-white rounded-full px-5 py-1"
                onClick={handleGenerateSingleQuestion}
                disabled={generatingSingleSurvey}
              >
                {
                  generatingSingleSurvey ? (
                    <ClipLoader size={24} />
                  ) : (

                   <>
                    <HiOutlinePlus className="inline-block mr-2" /> Add Question
                   </>
                  )
                }
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
          {aiChatbot && (
            <Sensei isOpen={aiChatbot} setIsOpen={()=>setAiChatbot(!aiChatbot)} currentSection={currentSection} questionIndex={selectIndex} />
          )}
   
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
          </> : <CreateNewSection /> }
        </div>
        <div
          className={`hidden lg:flex lg:w-1/3 overflow-y-auto max-h-screen custom-scrollbar bg-white`}
        >
          {isSidebar ? <StyleEditor /> : <QuestionType />}
        </div>
      </div>

    </div>
  );
};

export default EditSurvey;
