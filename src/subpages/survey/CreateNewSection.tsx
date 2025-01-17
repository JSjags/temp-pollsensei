import Image from "next/image";
import { pollsensei_new_logo } from "@/assets/images";
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
} from "@/redux/slices/questions.slice";
import { toast } from "react-toastify";
import CommentQuestion from "@/components/survey/CommentQuestion";
import MultiChoiceQuestion from "@/components/survey/MultiChoiceQuestion";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable } from "@/components/ui/StrictModeDroppable";
import { FaEye } from "react-icons/fa6";
import MatrixQuestion from "@/components/survey/MatrixQuestion";
import StyleEditor from "./StyleEditor";
import QuestionType from "./QuestionType";
import LikertScaleQuestion from "@/components/survey/LikertScaleQuestion";
import StarRatingQuestion from "@/components/survey/StarRatingQuestion";
import AddQuestion from "./AddQuestion";
import { addSection, resetSurvey } from "@/redux/slices/survey.slice";
import {
  useCreateSurveyMutation,
  useSaveProgressMutation,
} from "@/services/survey.service";
import { useRouter } from "next/navigation";
import store from "@/redux/store";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { GiCardDiscard } from "react-icons/gi";
import { Button } from "@/components/ui/button";

const CreateNewSection = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const newSectionTopic = useSelector(
    (state: RootState) => state.question.sectionTopic
  );
  const newSectionDesc = useSelector(
    (state: RootState) => state.question.sectionDescription
  );
  const [sectionTitle, setSectionTitle] = useState("");
  const [sDescription, setsDescription] = useState("");
  const [isEditing, setIsEditing] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(0);
  const questions = useSelector(
    (state: RootState) => state?.question?.questions
  );
  const theme = useSelector((state: RootState) => state?.survey?.theme);
  const [createSurvey, { isLoading, isSuccess, isError, error }] =
    useCreateSurveyMutation();
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
  const [addquestions, setAddQuestions] = useState(false);
  const logoUrl = useSelector((state: RootState) => state.survey.logo_url);
  const headerUrl = useSelector((state: RootState) => state.survey.header_url);

  const handleSave = () => {
    dispatch(updateSectionTopic(sectionTitle));
    dispatch(updateSectionDescription(sDescription));
    setIsEditing((prev) => !prev);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    dispatch(addQuestion(items));
    // setQuestions(items);
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
    if (logoUrl === "" || headerUrl === "") {
      toast.warning("Header image and logo cannot be empty");
      return null;
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
        console.log({ questions: questions });
      } else {
        dispatch(
          addSection({
            section_topic: newSectionTopic,
            section_description: newSectionDesc,
            questions: questions,
          })
        );
        console.log({
          section_topic: newSectionTopic,
          section_description: newSectionDesc,
          questions: questions,
        });
      }
    }

    const updatedSurvey = store.getState().survey;
    console.log(updatedSurvey.sections);

    try {
      const updatedSurvey = store.getState().survey;
      await createSurvey(updatedSurvey);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Survey created successfully");
      dispatch(resetSurvey());
      router.push("/surveys/survey-list");
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

  console.log(questions);
  console.log(survey);

  return (
    <div className={`${theme} flex flex-col gap-5 w-full pl-16`}>
      <div className={`${theme} flex justify-between gap-10 w-full`}>
        <div className="w-2/3 flex flex-col overflow-y-auto max-h-screen custom-scrollbar relative">
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
              <h2 className="text-[1.5rem] font-normal">
                {newSectionTopic || sectionTitle}
              </h2>
              <p>{newSectionDesc || sDescription}</p>
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
                  {questions.map((item: any, index: any) => (
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
                          ) : item.question_type === "likert_scale" ? (
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
                              // maxRating={5}
                              questionType={item.question_type}
                              EditQuestion={() => EditQuestion(index)}
                              // DeleteQuestion={()=>handleDeleteQuestion(index)}
                            />
                          ) : item.question_type === "long_text" ? (
                            <MatrixQuestion
                              key={index}
                              index={index + 1}
                              columns={item.columns}
                              rows={item.rows}
                              // options={item.options}
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
                dispatch(addQuestion(newQuestion));
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
              <Button
                variant="outline"
                className="group relative rounded-full transition-all duration-200 hover:scale-105"
                onClick={() => setAddQuestions((prev) => !prev)}
              >
                <HiOutlinePlus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
                <span className="group-hover:tracking-wide transition-all duration-200">
                  Add Questions
                </span>
              </Button>
              {/* <div className="bg-white rounded-full px-5 py-1" 
              onClick={()=>{
                dispatch(addSection({
                  section_topic:sectionTitle,
                  section_description:sDescription,
                  questions:questions
                }))
                dispatch(resetQuestion())
              }}
               >
                <IoDocumentOutline className="inline-block mr-2" />
                New Section
              </div> */}
              <Button
                variant="outline"
                disabled={isLoading}
                className="group relative rounded-full transition-all duration-200 hover:scale-105 hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => {
                  dispatch(resetQuestion());
                  dispatch(resetSurvey());
                  router.push("/surveys/create-survey");
                }}
              >
                <GiCardDiscard className="mr-2 h-4 w-4 group-hover:-translate-y-0.5 transition-transform duration-200" />
                <span className="group-hover:tracking-wide transition-all duration-200">
                  Discard
                </span>
              </Button>
              <Button
                variant="outline"
                disabled={isLoading}
                className="group relative rounded-full transition-all duration-200 hover:scale-105 hover:bg-primary hover:text-primary-foreground"
                onClick={handleSurveyCreation}
              >
                <VscLayersActive className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                <span className="group-hover:tracking-wide transition-all duration-200">
                  Publish Survey
                </span>
              </Button>
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

export default CreateNewSection;
