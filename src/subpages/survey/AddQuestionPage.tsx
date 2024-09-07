import Image from "next/image";
import { pollsensei_new_logo, sparkly, stars } from "@/assets/images";
import { HiOutlinePlus } from "react-icons/hi";
import { HiOutlineMinusSmall } from "react-icons/hi2";
import { IoDocumentOutline } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import { ClipLoader } from "react-spinners";
import { VscLayersActive } from "react-icons/vsc";
import { useEffect, useState } from "react";
import { LiaTimesSolid } from "react-icons/lia";
import { BsFillPinAngleFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useDispatch } from "react-redux";
import {
  updateSectionTopic,
  updateSectionDescription,
} from "@/redux/slices/questions.slice";
import { useCreateAiSurveyMutation } from "@/services/survey.service";
import { toast } from "react-toastify";
import CommentQuestion from "@/components/survey/CommentQuestion";
import MultiChoiceQuestion from "@/components/survey/MultiChoiceQuestion";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable } from "@/components/ui/StrictModeDroppable";
import { FaEye } from "react-icons/fa6";
import MatrixQuestion from "@/components/survey/MatrixQuestion";
import QuestionType from "./QuestionType";
import StyleEditor from "./StyleEditor";
import IsLoadingModal from "@/components/modals/IsLoadingModal";
import AddQuestion from "./AddQuestion";
import { addSection, resetSurvey } from "@/redux/slices/survey.slice";
import { useRouter } from "next/navigation";
import LikertScaleQuestion from "@/components/survey/LikertScaleQuestion";
import StarRatingQuestion from "@/components/survey/StarRatingQuestion";
import { useCreateSurveyMutation, useSaveProgressMutation } from "@/services/survey.service";
import store from '@/redux/store';


const AddQuestionPage = () => {
  const dispatch = useDispatch();
  const router  = useRouter();
  const sectionTopic = useSelector((state: RootState) => state?.survey?.topic);
  const theme = useSelector((state: RootState) => state?.survey?.theme);
  const sectionDescription = useSelector(
    (state: RootState) => state?.survey?.description
  );
  const selectedSurveyType = useSelector(
    (state: RootState) => state?.survey?.survey_type
  );
  const logoUrl = useSelector((state: RootState) => state?.survey?.logo_url);
  const [sectionTitle, setSectionTitle] = useState(sectionTopic || "");
  const [sDescription, setsDescription] = useState(sectionDescription || "");
  const [isEditing, setIsEditing] = useState(false);
  const [aiChatbot, setAiChatbot] = useState(false);
  const [surveyPrompt, setSurveyPrompt] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [sections, setSections] = useState([]);
  const [createSurvey, {isLoading, isSuccess, isError, error}] = useCreateSurveyMutation();
  const [saveprogress, { isSuccess:progressSuccess, isError:progressIsError, error:progressError}] = useSaveProgressMutation();
  const survey = useSelector((state: RootState) => state?.survey);
  const [isSidebar, setIsSidebarOpen] = useState(true);
  const [addquestions, setAddQuestions] = useState(false);
  const headerUrl = useSelector((state:RootState)=>state.survey.header_url)

  const handleSave = () => {
    dispatch(updateSectionTopic(sectionTitle));
    dispatch(updateSectionDescription(sDescription));
    setIsEditing(false);
    setAiChatbot(true);
  };

  // const handleGenerateQuestion = async () => {
  //   console.log({
  //     user_query: surveyPrompt,
  //     survey_type: selectedSurveyType,
  //   });
  //   try {
  //     await createAiSurvey({
  //       user_query: surveyPrompt,
  //       survey_type: 'quantittaive',
  //     });
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };


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
    setIsSidebarOpen(false);
  };


  const handleSurveyCreation =async()=>{
    if(logoUrl === '' || headerUrl === ''){
      toast.warning("Header image and logo can not be empty")
      return null
    }
    if(survey.sections.length === 0){
      dispatch(addSection({
        questions:questions
      }))
    }else{
      dispatch(addSection({
        section_topic:sectionTitle,
        section_description:sDescription,
        questions:questions
      }))
    }
    try{
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
      router.push('/surveys')
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
    }
  }, [progressError, progressIsError])

  // useEffect(() => {
  //   if (isSuccess) {
  //     toast.success("Survey new section created successfully");
  //     setQuestions(data?.data?.response);
  //   }
  //   if(error || isError){
  //     toast.error("Failed: Something went wrong");
  //   }
  // }, [isSuccess]);
  console.log(questions)
  return (
    <div className={`${theme} flex flex-col gap-5 w-full pl-16`}>
      <div className={`${theme} flex justify-between gap-10 w-full`}>
        <div className="w-2/3 flex flex-col overflow-y-auto max-h-screen custom-scrollbar">
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

          {isEditing && (
            <div className="bg-white rounded-lg w-full my-4 flex gap-2 px-11 py-4 flex-col ">
              <textarea
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
                placeholder="Untitled Section"
                className="border-b-2 border-[#5B03B2]"
              ></textarea>
              <textarea
                value={sDescription}
                onChange={(e) => setsDescription(e.target.value)}
                placeholder="Describe section (optional)"
                className="border-b-2 border-[#D9D9D9]"
              ></textarea>

              <div className="flex justify-end gap-5 mt-creat">
                <button
                  className="rounded-full border px-5 py-1"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button
                  className="rounded-full border px-5 py-1 bg-gradient-to-r from-[#5b03b2] to-[#9d50bb] text-white text-[16px] font-medium leading-6 text-center font-inter justify-center"
                  onClick={handleSave}
                  disabled={!sectionTitle.trim()}
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {!isEditing && (
            <div className="bg-white rounded-lg w-full my-4 flex gap-2 px-11 py-4 flex-col ">
              <h2 className="text-[1.5rem] font-normal">{sectionTopic}</h2>
              <p>{sectionDescription}</p>
              <div className="flex justify-end">
                <button
                  className="rounded-full border px-5 py-1"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
              </div>
            </div>
          )}

          <DragDropContext onDragEnd={handleDragEnd}>
            <StrictModeDroppable droppableId="questions">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {questions?.map((item: any, index: any) => (
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
                          className="mb-4"
                          // key={index}
                        >
                          {item.question_type === "multiple_choice" ? (
                            <MultiChoiceQuestion
                              index={index + 1}
                              question={item.question}
                              options={item.options}
                              questionType={item.question_type}
                              EditQuestion={() => EditQuestion(index)}
                            />
                          ) : item.question_type === "long_text" ? (
                            <CommentQuestion
                              key={index}
                              index={index + 1}
                              question={item.question}
                              questionType={item.question_type}
                            />
                          )
                          : item.question_type === "likert_Scale" ? (
                            <LikertScaleQuestion
                              question={item.question}
                              options={item.options}
                              questionType={item.question_type}
                              EditQuestion={() => EditQuestion(index)}
                              // DeleteQuestion={()=>handleDeleteQuestion(index)}
                            />
                          ) : item.question_type === "star_rating" ? (
                            <StarRatingQuestion
                              question={item.question}
                              maxRating={5}
                              questionType={item.question_type}
                              EditQuestion={() => EditQuestion(index)}
                              // DeleteQuestion={()=>handleDeleteQuestion(index)}
                            />
                          )
                           : item.question_type === "long_text" ? (
                            <MatrixQuestion
                              key={index}
                              index={index + 1}
                              options={item.objectptions}
                              question={item.question}
                              questionType={item.question_type}
                            />
                          ) : null}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </StrictModeDroppable>
          </DragDropContext>

          {addquestions && (
              <AddQuestion
                onCancel={() => setAddQuestions((prev) => !prev)}
                onSave={(question, options, questionType, is_required) => {
                  const newQuestion = {
                    question: question,
                    question_type: questionType,
                    options: options,
                    is_required: is_required,
                  };
                   console.log(newQuestion);
                  questions.push(newQuestion)
                  setAddQuestions((prev) => !prev);
                }}
              />
          )}

          <div className="flex justify-between items-center pt-5 pb-10">
            <div className="">
              <button
                className="bg-gradient-to-r from-[#5b03b2] to-[#9d50bb] rounded-lg px-8 py-2 text-white text-[16px] font-medium leading-6 text-center font-inter justify-center"
                type="button"
                // onClick={handleEdit}
              >
                <FaEye className="inline-block mr-2" />
                Preview
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center pb-10">
            <div className="flex gap-2 items-center">
              <button className="bg-white rounded-full px-5 py-1" onClick={()=>setAddQuestions((prev) => !prev)}>
                    <HiOutlinePlus className="inline-block mr-2" /> Add Question
              </button>
              <button className="bg-white rounded-full px-5 py-1" onClick={()=>{
                dispatch(addSection({questions: questions}))
                router.push('/surveys/add-new-section')
              }}>
                <IoDocumentOutline className="inline-block mr-2" />
                New Section
              </button>
              <button disabled={isLoading} className="bg-white rounded-full px-5 py-1" onClick={handleSurveyCreation}>
                <VscLayersActive className="inline-block mr-2" />
                Publish Survey
              </button>
            </div>
            <div>Pagination</div>
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



          {/* Poll master chatbot */}

          {/* {aiChatbot && (
        <div
          className="w-[20rem] rounded-md flex flex-col absolute top-14 right-0 z-50"
          data-aos="fade-left"
          data-aos-offset="300"
          data-aos-easing="ease-in-sine"
        >
          <div className=" bg-gradient-to-r from-[#5b03b2] px-4 py-2 rounded-t-md to-[#9d50bb]  text-white ">
            <div className="flex justify-end gap-2">
              <HiOutlineMinusSmall />
              <BsFillPinAngleFill />
              <LiaTimesSolid className="" onClick={() => setAiChatbot(false)} />
            </div>
            <h2 className=" text-white ">Sensei</h2>
          </div>
          <div className="flex flex-col ">
            <div className="flex border py-2 px-3 bg-[#FAFAFA] ">
              <input
                value={surveyPrompt}
                type="text"
                onChange={(e) => setSurveyPrompt(e.target.value)}
                placeholder="Enter prompt here."
                className="border-none focus:border-none outline-none focus:outline-none active:border-0 ring-0 w-[90%]"
              />
              <button
                disabled={!surveyPrompt}
                className="rounded-full flex flex-col items-center justify-center bg-[#5b03b2] w-[10%] "
                onClick={handleGenerateQuestion}
              >
                <IoIosArrowForward />
              </button>
            </div>
          </div>
        </div>
      )} */}
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

export default AddQuestionPage;
