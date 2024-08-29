import CommentQuestion from "@/components/survey/CommentQuestion";
import CommentQuestionEdit from "@/components/survey/CommentQuestionEdit";
import LikertScaleQuestion from "@/components/survey/LikertScaleQuestion";
import LinearScaleQuestion from "@/components/survey/LinearScaleQuestion";
import MultiChoiceQuestion from "@/components/survey/MultiChoiceQuestion";
import MultiChoiceQuestionEdit from "@/components/survey/MultiChoiceQuestionEdit";
import StarRatingQuestion from "@/components/survey/StarRatingQuestion";
import { updateQuestions } from "@/redux/slices/questions.slice";
import { RootState } from "@/redux/store";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import StyleEditor from "./StyleEditor";
import QuestionType from "./QuestionType";
import Image from 'next/image'
import { sparkly } from "@/assets/images";

const EditSurvey = () => {
  const question = useSelector((state: RootState) => state.question);
  const [isEdit, setIsEdit] = useState(false);
  const dispatch = useDispatch();
  const [addquestions, setAddQuestions] = useState({});
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isSidebar, setIsSidebarOpen] = useState(true)
  console.log(question);

  const EditQuestion = (index: number) => {
    setEditIndex(index);
    setIsEdit(true);
    setIsSidebarOpen((prev)=>!prev);
  };

  const handleSave = (updatedQuestion: string, updatedOptions: string[],   updatedQuestionType: string) => {
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
    setIsSidebarOpen((prev)=>!prev);
  };

  const handleCancel = () => {
    setEditIndex(null);
    setIsEdit(false);
    setIsSidebarOpen((prev)=>!prev);
  };

  // const EditQuestion = async (id: any) => {
  //   const questionIndex = question.questions?.findIndex(
  //     (_question: any, index: any) => index === id
  //   );
  //   setEditIndex(questionIndex);
  //   setIsEdit(true);
  //   console.log(question.questions[questionIndex]);
  // };

  return (
    <div className="bg-[#e5e5e5] flex flex-col gap-5 w-full pl-16">
      <div className="bg-[#e5e5e5] flex justify-between gap-10 w-full">
        <div className="w-2/3 flex flex-col">
          <div className="bg-[#9D50BB] rounded-full w-1/3 my-5 text-white py-3 flex items-center flex-col ">
            <p>LOGO GOES HERE</p>
          </div>

          <div className="bg-[#9D50BB] rounded-lg w-full my-4 text-white h-24 flex items-center flex-col ">
            <Image src={sparkly}alt="" className="w-full object-cover bg-no-repeat h-24 rounded-lg "  />
          </div>
          {question?.questions?.map((item: any, index: number) => (
            <div key={index} className="mb-4">
              {isEdit && editIndex === index ? (
                <MultiChoiceQuestionEdit
                  question={item.Question}
                  options={item.Options}
                  questionType={item["Option type"]}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />
              ) : item["Option type"] === "Multi-choice" ? (
                <MultiChoiceQuestion
                  question={item.Question}
                  options={item.Options}
                  questionType={item["Option type"]}
                  EditQuestion={() => EditQuestion(index)}
                  index={index + 1}
                />
              ) : item["Option type"] === "Comment" ? (
                <CommentQuestion 
                key={index} 
                index={index + 1}
                questionType={item["Option type"]}
                question={item.Question} 
                EditQuestion={() => EditQuestion(index)} />
              ) : item["Option type"] === "Linear Scale" ? (
                <LinearScaleQuestion
                  question={item.Question}
                  scaleStart={item.scaleStart}
                  scaleEnd={item.scaleEnd}
                  questionType={item["Option type"]}
                  EditQuestion={() => EditQuestion(index)}
                />
              ) : item["Option type"] === "Likert Scale" ? (
                <LikertScaleQuestion
                  question={item.Question}
                  options={item.Options}
                  questionType={item["Option type"]}
                  EditQuestion={() => EditQuestion(index)}
                />
              ) : item["Option type"] === "star_rating" ? (
                <StarRatingQuestion
                  question={item.Question}
                  maxRating={5}
                  questionType={item["Option type"]}
                  EditQuestion={() => EditQuestion(index)}
                />
              )
               : null}
            </div>
          ))}
          <div className="flex justify-between items-center pb-10">
            <div className="flex gap-2 items-center">
              <div className="bg-white rounded-full px-5 py-1">
                Add Question
              </div>
              <div className="bg-white rounded-full px-5 py-1">New Section</div>
            </div>
            <div>Pagination</div>
          </div>
        </div>
        <div className="w-1/3">
        {
          isSidebar ? (
            <StyleEditor />
          ) : (
            <QuestionType />
          )
        }
        </div>
      </div>
    </div>
  );
};

export default EditSurvey;
