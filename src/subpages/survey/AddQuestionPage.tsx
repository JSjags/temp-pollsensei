import Image from "next/image";
import { pollsensei_new_logo, sparkly, } from "@/assets/images";
import { HiOutlinePlus } from "react-icons/hi";
import { IoDocumentOutline } from "react-icons/io5";
import { VscLayersActive } from "react-icons/vsc";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useDispatch } from "react-redux";
import {
  updateSectionTopic,
  updateSectionDescription,
  addQuestion,
  resetQuestion,
  deleteQuestion,
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
import { addSection, resetSurvey } from "@/redux/slices/survey.slice";
import { useRouter } from "next/navigation";
import LikertScaleQuestion from "@/components/survey/LikertScaleQuestion";
import StarRatingQuestion from "@/components/survey/StarRatingQuestion";
import { useCreateSurveyMutation, useSaveProgressMutation } from "@/services/survey.service";
import store from '@/redux/store';
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import MatrixQuestionEdit from "@/components/survey/MatrixQuestionEdit";
import MultiChoiceQuestionEdit from "../milestone/Test";


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
  const questions = useSelector((state: RootState) => state?.question?.questions);
  const logoUrl = useSelector((state: RootState) => state?.survey?.logo_url);
  const [sectionTitle, setSectionTitle] = useState(sectionTopic || "");
  const [sDescription, setsDescription] = useState(sectionDescription || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(0);
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
  };

  console.log(survey)


  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    dispatch(addQuestion(items))
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
    if (logoUrl === '' || headerUrl === '') {
      toast.warning("Header image and logo cannot be empty");
      return null;
    }
  
    const sectionExists = survey.sections.some((section) => 
      section.section_topic === sectionTitle &&
      section.section_description === sDescription &&
      JSON.stringify(section.questions) === JSON.stringify(questions)
    );
  
    if (!sectionExists) {
      if (survey.sections.length === 0) {
        dispatch(addSection({
          questions: questions
        }));
      } else {
        dispatch(addSection({
          section_topic: sectionTitle,
          section_description: sDescription,
          questions: questions
        }));
      }
    }
  
    try {
      const updatedSurvey = store.getState().survey;
      await createSurvey(updatedSurvey);
    } catch (e) {
      console.log(e);
    }
  };
  

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


  const handleCancel = () => {
    // setEditIndex(null);
    setIsEdit(false);
    setIsSidebarOpen((prev) => !prev);
  };


  const handleDeleteQuestion = (id:number) => {
    const questionIndex = questions?.findIndex(
      (_question: any, index: any) => index === id
    );
    setEditIndex(questionIndex);
    dispatch(deleteQuestion({ questions, editIndex }));
  };


  console.log(questions)
  return (
    <div className={`${theme} flex flex-col gap-5 w-full px-5 lg:pl-16`}>
      <div className={`${theme} flex justify-between gap-10 w-full`}>
        <div className="w-full lg:w-2/3 flex flex-col overflow-y-auto max-h-screen custom-scrollbar">
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
          )}       <div className="bg-[#9D50BB] rounded-lg w-full my-4 text-white h-24 flex items-center flex-col ">
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

          {isEditing && (
            <div className="bg-white rounded-lg w-full my-4 flex gap-2 px-11 py-4 flex-col ">
              <AutosizeTextarea
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
                placeholder="Untitled Section"
                className="border-b-2 border-[#5B03B2]"
              ></AutosizeTextarea>
              <AutosizeTextarea
                value={sDescription}
                onChange={(e) => setsDescription(e.target.value)}
                placeholder="Describe section (optional)"
                className="border-b-2 border-[#D9D9D9]"
              ></AutosizeTextarea>

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

          <button type="reset" onClick={()=>{
            dispatch(resetQuestion());
            dispatch(resetSurvey());
          }}>
            Reset
          </button> 

          {/* <DragDropContext onDragEnd={handleDragEnd}>
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
                            isEdit && editIndex === index && item.question_type === "matrix_checkbox" ? (
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
                            ) :
                          item.question_type === "multiple_choice" ? (
                            <MultiChoiceQuestion
                              index={index + 1}
                              question={item.question}
                              options={item.options}
                              questionType={item.question_type}
                              EditQuestion={() => EditQuestion(index)}
                              DeleteQuestion={()=>{}}
                            />
                          ) : item.question_type === "long_text" ? (
                            <CommentQuestion
                              key={index}
                              index={index + 1}
                              question={item.question}
                              questionType={item.question_type}
                              EditQuestion={() => EditQuestion(index)}
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
                              DeleteQuestion={()=>handleDeleteQuestion(index)}
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
          </DragDropContext> */}

<DragDropContext onDragEnd={handleDragEnd}>
  <StrictModeDroppable droppableId="questions">
    {(provided) => (
      <div {...provided.droppableProps} ref={provided.innerRef}>
        {questions?.map((item: any, index: any) => (
          <Draggable
            key={index}  // Using the index as key to map questions
            draggableId={index.toString()}  // Draggable identifier based on index
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
                  item.question_type === "multiple_choice" ? (
                    <MultiChoiceQuestion
                      index={index + 1}  // Ensure question number starts from 1
                      question={item.question}
                      options={item.options}
                      questionType={item.question_type}
                      EditQuestion={() => EditQuestion(index)}
                      DeleteQuestion={() => handleDeleteQuestion(index)}
                    />
                  ) : item.question_type === "long_text" ? (
                    <CommentQuestion
                      key={index}
                      index={index + 1}  // Ensure question number starts from 1
                      question={item.question}
                      questionType={item.question_type}
                      EditQuestion={() => EditQuestion(index)}
                    />
                  ) : item.question_type === "likert_Scale" ? (
                    <LikertScaleQuestion
                      question={item.question}
                      options={item.options}
                      questionType={item.question_type}
                      EditQuestion={() => EditQuestion(index)}
                    />
                  ) : item.question_type === "star_rating" ? (
                    <StarRatingQuestion
                      question={item.question}
                      maxRating={5}
                      questionType={item.question_type}
                      EditQuestion={() => EditQuestion(index)}
                      DeleteQuestion={() => handleDeleteQuestion(index)}
                    />
                  ) : item.question_type === "matrix_checkbox" ? (
                    <MatrixQuestion
                      key={index}
                      index={index + 1}  // Ensure question number starts from 1
                      options={item.options}
                      question={item.question}
                      questionType={item.question_type}
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
                  dispatch(addQuestion(newQuestion))
                  setAddQuestions((prev) => !prev);
                }}
              />
          )}

          <div className="md:flex justify-between items-center pb-10">
            <div className="flex-col md:flex-row flex w-full gap-2 items-center">
              <button className="bg-white inline-block rounded-full px-5 py-1" onClick={()=>setAddQuestions((prev) => !prev)}>
                    <HiOutlinePlus className="inline-block mr-2" /> Add Question
              </button>
              <button className="bg-white inline-block rounded-full px-5 py-1" onClick={()=>{
                dispatch(addSection({questions: questions}))
                dispatch(resetQuestion())
                router.push('/surveys/add-new-section')
              }}>
                <IoDocumentOutline className="inline-block mr-2" />
                New Section
              </button>
              <button disabled={isLoading} className="bg-white inline-block rounded-full px-5 py-1" onClick={handleSurveyCreation}>
                <VscLayersActive className="inline-block mr-2" />
                Publish Survey
              </button>
            </div>
            {
              survey.sections.length > 0 && (
                <div>Pagination</div>
              )
            }
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

export default AddQuestionPage;
