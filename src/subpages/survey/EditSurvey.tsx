import CommentQuestion from "@/components/survey/CommentQuestion";
import LikertScaleQuestion from "@/components/survey/LikertScaleQuestion";
import LinearScaleQuestion from "@/components/survey/LinearScaleQuestion";
import MultiChoiceQuestion from "@/components/survey/MultiChoiceQuestion";
import MultiChoiceQuestionEdit from "@/components/survey/MultiChoiceQuestionEdit";
import StarRatingQuestion from "@/components/survey/StarRatingQuestion";
import { addQuestion, deleteQuestion, updateQuestions,  addNewSection, setQuestionObject, } from "@/redux/slices/questions.slice";
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
import { useCreateSurveyMutation, useGenerateSingleSurveyMutation } from "@/services/survey.service";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import MatrixQuestionEdit from "@/components/survey/MatrixQuestionEdit";
import { VscLayersActive } from "react-icons/vsc";
import CreateNewSection from "./CreateNewSection";
import { useRouter } from "next/navigation";



const EditSurvey = () => {
  const question = useSelector((state: RootState) => state.question);
  const headerUrl = useSelector((state: RootState) => state?.themes?.headerUrl);
  const logoUrl = useSelector((state: RootState) => state?.themes?.logoUrl);
  const theme = useSelector((state: RootState) => state?.themes?.theme);
  const headerText = useSelector((state:RootState)=>state.themes.headerText)
  const questionText = useSelector((state:RootState)=>state.themes.questionText)
  const bodyText = useSelector((state:RootState)=>state.themes.bodyText)
  const colorTheme = useSelector((state:RootState)=>state.themes.colorTheme)
  const generateBy = useSelector((state:RootState)=>state.themes.generatedBy)
  const surveyTitle = useSelector((state: RootState) => state?.question?.title);
  const surveyDescription = useSelector((state: RootState) => state?.question?.description);
  const survey_type = useSelector((state: RootState) => state?.question?.survey_type);
  const section = useSelector((state: RootState) => state?.question?.section);
  const [isEdit, setIsEdit] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const [createSurvey, {isLoading, isSuccess, isError, error}] = useCreateSurveyMutation()
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isSidebar, setIsSidebarOpen] = useState(true);
  const [
    generateSingleSurvey,
    { data: newSingleSurvey, isLoading: generatingSingleSurvey, isSuccess: newQuestionGenerate},
  ] = useGenerateSingleSurveyMutation();
  const [isNewSection, setIsNewSection] = useState(true);


  const EditQuestion = (index: number) => {
    setEditIndex(index);
    setIsEdit(true);
    setIsSidebarOpen(false);
  };

  const handleSave = (
    updatedQuestion: string,
    updatedOptions: string[],
    updatedQuestionType: string
  ) => {
    const updatedQuestions = [...question.questions];
    if (editIndex !== null) {
      // @ts-ignore
      updatedQuestions[editIndex] = {...updatedQuestions[editIndex],
        Question: updatedQuestion,
        Options: updatedOptions,
        "Option type": updatedQuestionType,
      };
      dispatch(updateQuestions(updatedQuestions));
      setEditIndex(null);
      setIsEdit(false);
    }
    setIsSidebarOpen((prev) => !prev);
  };

  const handleDeleteQuestion = (index:number) => {
    dispatch(deleteQuestion(index));
  };

  const handleCancel = () => {
    setEditIndex(null);
    setIsEdit(false);
    setIsSidebarOpen((prev) => !prev);
  };

  const handleGenerateSingleQuestion = async () => {
    try {
      await generateSingleSurvey({
        conversation_id: question.conversation_id,
      });
      toast.success("Single survey added successfully");
    } catch (e) {
      toast.error("Failed to create survey");
      console.error(e);
    }
  };
  
  console.log(section)

  useEffect(() => {
    if (newQuestionGenerate && newSingleSurvey?.data?.response) {
      console.log(newSingleSurvey)
      const newQuestion = {
        Question: newSingleSurvey.data.response.Question,
        Options: newSingleSurvey.data.response.Options,
        "Option type": newSingleSurvey.data.response["Option type"],
      };
      dispatch(addQuestion(newQuestion));
    }
  }, [dispatch, newQuestionGenerate, newSingleSurvey]);
  
  const handleNewSection = () => {
    const currentQuestions = question.questions;
    
    if (currentQuestions.length > 0) {
      
      dispatch(addNewSection({ questions: currentQuestions }));

      // Reset the questions state
      dispatch(setQuestionObject({
        ...question,
        questions: [],
      }));
      toast.success("New section created successfully");
      setIsNewSection(false);
    } else {
      toast.warn("No questions to add to a new section");
    }
  };
  
  const handleSurveyCreation =async()=>{
    const surveyData = {
      survey_type: "quantitative",
      // survey_type: survey_type,
      topic:surveyTitle,
      theme:theme,
      description: surveyDescription,
      header_text: headerText,
      question_text:questionText,
      body_text: bodyText,
      color_theme: colorTheme,
      logo_url: logoUrl,
      header_url: headerUrl,
      generated_by: generateBy,
      // sections:question.section,
      sections:question.section.length === 0 ? ({questions:question.questions }): question.section,
    }
    try{
      console.log(surveyData)
      await createSurvey(
        surveyData
      );
    }catch(e){
      console.log(e)
    };
  }

  useEffect(()=>{
    if(isSuccess){
      toast.success("Survey created successfully")
      router.push('/surveys')
    }

    if(isError || error){
      toast.error("Failed to create survey")
    }
  }, [isSuccess, isError, error]);

console.log(question)

  return (
    <div className={`${theme} flex flex-col gap-5 w-full pl-16`}>
      <div className={`${theme} flex justify-between gap-10 w-full`}>
        <div className="w-2/3 flex flex-col overflow-y-auto max-h-screen custom-scrollbar">
       {isNewSection ? <>
          {logoUrl ? (
            <div className="bg-[#9D50BB] rounded-full w-1/3 my-5 text-white flex items-center flex-col ">
              <Image
                src={
                  logoUrl instanceof File
                    ? URL.createObjectURL(logoUrl)
                    : typeof logoUrl === "string"
                    ? logoUrl
                    : sparkly
                }
                alt=""
                className="w-full object-cover bg-no-repeat h-16 rounded-full"
                width={"100"}
                height={"200"}
              />
            </div>
          ) : (
            <div className="bg-[#9D50BB] rounded-full w-1/3 my-5 text-white py-3 flex items-center flex-col ">
              <p>LOGO GOES HERE</p>
            </div>
          )}

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
          <h2 className="text-[1.5rem] font-normal" style={{fontSize:`${headerText?.size}px`, fontFamily:`${headerText?.name}` }}>{surveyTitle}</h2>
          <p style={{fontSize:`${bodyText?.size}px`, fontFamily:`${bodyText?.name}` }}>{surveyDescription}</p>
          <div className="flex justify-end">
            {/* <button className="rounded-full border px-5 py-1" >Edit</button> */}
          </div>
          </div>
          {question?.questions?.map((item: any, index: number) => (
            <div key={index} className="mb-4">
              {isEdit && editIndex === index && item["Option type"] === "Matrix" ? (
                <MatrixQuestionEdit
                  question={item.Question}
                  options={item.Options}
                  questionType={item["Option type"]}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />
              ) :
              isEdit && editIndex === index ? (
                <MultiChoiceQuestionEdit
                  question={item.Question}
                  options={item.Options}
                  questionType={item["Option type"]}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />
              )
               : item["Option type"] === "Multi-choice" ? (
                <MultiChoiceQuestion
                  question={item.Question}
                  options={item.Options}
                  questionType={item["Option type"]}
                  EditQuestion={() => EditQuestion(index)}
                  index={index + 1}
                  DeleteQuestion={()=>handleDeleteQuestion(index)}
                />
              ) : item["Option type"] === "Comment" ? (
                <CommentQuestion
                  key={index}
                  index={index + 1}
                  questionType={item["Option type"]}
                  question={item.Question}
                  EditQuestion={() => EditQuestion(index)}
                  DeleteQuestion={()=>handleDeleteQuestion(index)}
                />
              ) : item["Option type"] === "Linear Scale" ? (
                <LinearScaleQuestion
                  question={item.Question}
                  scaleStart={item.scaleStart}
                  scaleEnd={item.scaleEnd}
                  questionType={item["Option type"]}
                  EditQuestion={() => EditQuestion(index)}
                  DeleteQuestion={()=>handleDeleteQuestion(index)}
                />
              ) : item["Option type"] === "Likert Scale" ? (
                <LikertScaleQuestion
                  question={item.Question}
                  options={item.Options}
                  questionType={item["Option type"]}
                  EditQuestion={() => EditQuestion(index)}
                  DeleteQuestion={()=>handleDeleteQuestion(index)}
                />
              ) : item["Option type"] === "star_rating" ? (
                <StarRatingQuestion
                  question={item.Question}
                  maxRating={5}
                  questionType={item["Option type"]}
                  EditQuestion={() => EditQuestion(index)}
                  DeleteQuestion={()=>handleDeleteQuestion(index)}
                />
              ) : item["Option type"] === "Matrix" ? (
                <MatrixQuestion
                  key={index}
                  index={index + 1}
                  options={item.Options}
                  questionType={item["Option type"]}
                  question={item.Question}
                  EditQuestion={() => EditQuestion(index)}
                  DeleteQuestion={()=>handleDeleteQuestion(index)}
                />
              ) : null}
            </div>
          ))}
          <div className="flex justify-between items-center">
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
              <div className="bg-white rounded-full px-5 py-1" onClick={handleNewSection}>
                <IoDocumentOutline className="inline-block mr-2" />
                New Section
              </div>
              {/* <div className="bg-white rounded-full px-5 py-1" onClick={handleSurveyCreation}>
                <VscLayersActive className="inline-block mr-2" />
                Publish Survey
              </div> */}
            </div>
            <div>Pagination</div>
          </div>
   
          <div className=" rounded-md flex flex-col justify-center w-[16rem] py-5 text-center">
          <button
            className="bg-gradient-to-r from-[#5b03b2] to-[#9d50bb] rounded-lg px-8 py-2 text-white text-[16px] font-medium leading-6 text-center font-inter justify-center"
            type="button"
            onClick={handleSurveyCreation}
          >
            Continue
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
          className={`w-1/3 overflow-y-auto max-h-screen custom-scrollbar bg-white`}
        >
          {isSidebar ? <StyleEditor /> : <QuestionType />}
        </div>
      </div>
    </div>
  );
};

export default EditSurvey;
