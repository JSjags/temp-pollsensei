import React, { useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { FiEdit2 } from "react-icons/fi";
import Image from "next/image";
import { stars } from "@/assets/images";
import CommentQuestion from "@/components/survey/CommentQuestion";
import MultiChoiceQuestion from "@/components/survey/MultiChoiceQuestion";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import SurveySettings from "./SurveySettings";
import IsLoadingModal from "@/components/modals/IsLoadingModal";
import MultiChoiceQuestionEdit from "@/components/survey/MultiChoiceQuestionEdit";
import { useDispatch } from "react-redux";
import { setQuestionObject } from "@/redux/slices/questions.slice";
import { useRouter } from "next/navigation";
import { FaEye } from "react-icons/fa6";
import PaginationControls from "@/components/common/PaginationControls";
import MatrixQuestion from "@/components/survey/MatrixQuestion";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface GeneratedSurveyProps {
  data: any;
  onClick: () => void;
}

const GeneratedSurvey: React.FC<GeneratedSurveyProps> = ({ data, onClick }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(0);
  const [questions, setQuestions] = useState(data?.data?.response || []);
  const router = useRouter();
  const dispatch = useDispatch();
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const surveyTitle = useSelector((state:RootState)=>state?.question?.title)
  const surveyDescription = useSelector((state:RootState)=>state?.question?.description)

  const currentResult = questions?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
const totalPages = Math.ceil(questions.length / itemsPerPage);

  console.log(data?.data);
  console.log(questions);
  console.log(currentResult);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setQuestions(items);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
        description:surveyDescription,
      })
    );
    router.push("/surveys/edit-survey");
  };

  return (
    <div className="py-10 px-2 w-full">
      <div className="flex justify-between items-center">
        <div className="flex flex-col text-start">
          <h2 className="text-[1.5rem] font-normal">
            <IoArrowBackOutline className="inline-block" /> Generated Survey
          </h2>
          <p className="font-normal">
            Here’s your survey. You can choose to continue or use another prompt
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="button-primary" onClick={handleEdit}>
            <FiEdit2 className="inline-block" /> Edit Survey
          </button>
          <button
            className="gradient-border gradient-text px-6 py-2 rounded-lg flex items-center space-x-2"
            onClick={onClick}
          >
            Use another prompt
            <Image src={stars} alt="stars" className={`inline-block`} />
          </button>
        </div>
      </div>
      <hr />
      <div className="py-10 w-full flex gap-10 ">
        <div className="pb-10 w-2/3 flex flex-col">
          <div className="text-start pb-5">
            <p className="font-bold text-[#7A8699]">Survey Topic</p>
            <h2 className="text-[1.5rem] font-normal">{surveyTitle}</h2>
          </div>
          <div className="text-start">
            <p className="font-bold text-[#7A8699]">Survey description</p>
            <h2>{surveyDescription}</h2>
          </div>
          <div className="flex justify-between items-center pt-8 pb-5">
            <p className="text-sm">Question</p>
            <p className="text-sm">Question Type</p>
          </div>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="questions">
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
                          ) :
                          item["Option type"] === "Comment" ? (
                            <MatrixQuestion
                              key={index}
                              index={index + 1}
                              options={item.Options}
                              question={item.Question}
                              questionType={item["Option type"]}
                            />
                          ) :
                           null}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <div className="flex justify-between items-center pt-5 pb-10">
            <div className="">
            <button
        className="bg-gradient-to-r from-[#5b03b2] to-[#9d50bb] rounded-lg px-8 py-2 text-white text-[16px] font-medium leading-6 text-center font-inter justify-center"
        type="button"
        onClick={handleEdit}
      >
        <FaEye className="inline-block mr-2" />
         Preview
      </button>
            </div>
            <div className="mt-6 sm:mt-8">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            setItemsPerPage={setItemsPerPage}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
          />
        </div>
          </div>
        </div>

        {/* <div
          className={`w-1/3 ${
            isSidebarOpen ? "flex flex-col" : "hidden"
          } gap-4`}
        >
          {isSidebarOpen && (
            <SurveySettings
              isSidebarOpen={isSidebarOpen}
              onClick={toggleSidebar}
            />
          )}
          {isEdit && (
            <IsLoadingModal openModal={isEdit} modalSize={"lg"}>
              <MultiChoiceQuestionEdit
                question={questions[editIndex].Question}
                options={questions[editIndex].Options}
                questionType={questions[editIndex]["Option type"]}
                onSave={(updatedQuestion, updatedOptions) => {
                  const updatedQuestions = [...questions];

                  updatedQuestions[editIndex] = {
                    ...updatedQuestions[editIndex],
                    Question: updatedQuestion,
                    Options: updatedOptions,
                  };

                  setQuestions(updatedQuestions);

                  setIsEdit(false);
                }}
                onCancel={() => setIsEdit(false)}
              />
            </IsLoadingModal>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default GeneratedSurvey;
