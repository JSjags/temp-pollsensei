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

const CreateNewSection = () => {
  const dispatch = useDispatch();
  const sectionTopic = useSelector(
    (state: RootState) => state?.question?.sectionTopic
  );
  const sectionDescription = useSelector(
    (state: RootState) => state?.question?.sectionDescription
  );
  const selectedSurveyType = useSelector(
    (state: RootState) => state?.question?.survey_type
  );
  const [sectionTitle, setSectionTitle] = useState(sectionTopic || "");
  const [sDescription, setsDescription] = useState(sectionDescription || "");
  const [isEditing, setIsEditing] = useState(false);
  const [aiChatbot, setAiChatbot] = useState(false);
  const [createAiSurvey, { data, isLoading, isSuccess, isError, error }] =
    useCreateAiSurveyMutation();
  const [surveyPrompt, setSurveyPrompt] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(0);
  const [questions, setQuestions] = useState(data?.data?.response || []);

  const handleSave = () => {
    dispatch(updateSectionTopic(sectionTitle));
    dispatch(updateSectionDescription(sDescription));
    setIsEditing(false);
    setAiChatbot(true);
  };

  const handleGenerateQuestion = async () => {
    console.log({
      user_query: surveyPrompt,
      survey_type: 'quantittaive',
      // survey_type: selectedSurveyType,
    });
    try {
      await createAiSurvey({
        user_query: surveyPrompt,
        survey_type: 'quantittaive',
      });
    } catch (e) {
      console.error(e);
    }
  };

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


  useEffect(() => {
    if (isSuccess) {
      toast.success("Survey new section created successfully");
      setQuestions(data?.data?.response);
    }
    if(error || isError){
      toast.error("Failed: Something went wrong");
    }
  }, [isSuccess]);

  const handleEdit = () => {
    // dispatch(
    //   setQuestionObject({
    //     title: surveyTitle,
    //     conversation_id: data?.data?.conversation_id,
    //     questions: questions,
    //     description:surveyDescription,
    //   })
    // );
    // router.push("/surveys/edit-survey");
  };

  console.log(questions)
  console.log(data?.data)

  return (
    <div className="w-full relative">
      {isEditing ? (
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
      ) : (
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
                      {item["Option type"] === "Multi-choice" ? (
                        <MultiChoiceQuestion
                          index={index + 1}
                          question={item.Question}
                          options={item.Options}
                          questionType={item["Option type"]}
                          EditQuestion={() => EditQuestion(index)}
                        />
                      ) : item["Option type"] === "Comment" ? (
                        <CommentQuestion
                          key={index}
                          index={index + 1}
                          question={item.Question}
                          questionType={item["Option type"]}
                        />
                      ) : item["Option type"] === "Comment" ? (
                        <MatrixQuestion
                          key={index}
                          index={index + 1}
                          options={item.Options}
                          question={item.Question}
                          questionType={item["Option type"]}
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
          <button className="bg-white rounded-full px-5 py-1">
            {"generatingSingleSurvey" ? (
              <ClipLoader size={24} />
            ) : (
              <>
                <HiOutlinePlus className="inline-block mr-2" /> Add Question
              </>
            )}
          </button>
          <div className="bg-white rounded-full px-5 py-1">
            <IoDocumentOutline className="inline-block mr-2" />
            New Section
          </div>
          <div className="bg-white rounded-full px-5 py-1">
            <VscLayersActive className="inline-block mr-2" />
            Publish Survey
          </div>
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

      {aiChatbot && (
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
      )}
    </div>
  );
};

export default CreateNewSection;
