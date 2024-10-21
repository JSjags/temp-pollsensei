"use client";

import React, { useState } from "react";
import AnswerMultiChoiceQuestion from "./AnswerMuiltipleChoice";
import CommentQuestion from "./CommentQuestion";
import LinearScaleQuestion from "./LinearScaleQuestion";
import LikertScaleQuestion from "./LikertScaleQuestion";
import MatrixQuestion from "./MatrixQuestion";
import StarRatingQuestion from "./StarRatingQuestion";
import PaginationBtn from "../common/PaginationBtn";

interface Answer {
  question?: string;
  question_type?: string;
  options?: string[];
  selected_options?: string[];
}

interface UserResponseProps {
  data?: {
    answers: Answer[];
  };
  index: number;
  isLoading?:boolean;
}


const UserResponses: React.FC<UserResponseProps> = ({ data, index, isLoading }) => {
  console.log(data);
  console.log(index);
  const [currentSection, setCurrentSection] = useState(0);

  const navigatePage = (direction: any) => {
    setCurrentSection((prevIndex) => {
      if (data && data.answers) {
        if (direction === "next") {
          return prevIndex < data.answers.length - 1
            ? prevIndex + 1
            : prevIndex;
        } else {
          return prevIndex > 0 ? prevIndex - 1 : prevIndex;
        }
      }
      return prevIndex;
    });
  };

  const handleQuestionChange = (index: number, selectedOptions: string[]) => {
    console.log(`Question ${index} selected options:`, selectedOptions);
  };

  if(isLoading){
    return         <div className="w-full h-100 flex justify-center items-center">
    <div className="spinner-border text-primary" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  </div>
  }

  return (
    <div className={`flex flex-col gap-5 w-full relative mt-4`}>
     {
      isLoading ? (
        <div className="w-full h-100 flex justify-center items-center">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <div className={`flex  flex-col justify-between gap-10 w-full`}>
        {data?.answers?.map((item: any, index: number) => (
          <div key={index} className="mb-4">
            {item.question_type === "multiple_choice" ||
            item.question_type === "multi_choice" ? (
              <AnswerMultiChoiceQuestion
                key={index}
                question={item.question}
                options={item.options}
                questionType={item.question_type}
                selectedOptions={item.selected_options}
                onChange={(selected) => {
                  // handleQuestionChange(index, selected)
                }}
                index={index + 1}
                status={item?.validation_result?.status}
              />
            ) : item.question_type === "comment" ||
              item.question_type === "long_text" ? (
              <CommentQuestion
                key={index}
                index={index + 1}
                questionType={item.question_type}
                question={item.question}
                response={item.text}
                status={item?.validation_result?.status}
                // EditQuestion={() => EditQuestion(index)}
                // DeleteQuestion={()=>handleDeleteQuestion(index)}
              />
            ) : item.question_type === "linear_Scale" ? (
              <LinearScaleQuestion
                question={item.question}
                scaleStart={item.scaleStart}
                scaleEnd={item.scaleEnd}
                questionType={item.question_type}
                // EditQuestion={() => EditQuestion(index)}
                // DeleteQuestion={()=>handleDeleteQuestion(index)}
              />
            ) : item.question_type === "likert_Scale" ? (
              <LikertScaleQuestion
                question={item.question}
                options={item.options}
                questionType={item.question_type}
                // EditQuestion={() => EditQuestion(index)}
                // DeleteQuestion={()=>handleDeleteQuestion(index)}
              />
            ) : item.question_type === "star_rating" ? (
              <StarRatingQuestion
                question={item.question}
                maxRating={5}
                questionType={item.question_type}
                // EditQuestion={() => EditQuestion(index)}
                // DeleteQuestion={()=>handleDeleteQuestion(index)}
              />
            ) : item.question_type === "matrix_checkbox" ? (
              <MatrixQuestion
                key={index}
                index={index + 1}
                options={item.options}
                questionType={item.question_type}
                question={item.question}
                // EditQuestion={() => EditQuestion(index)}
                // DeleteQuestion={()=>handleDeleteQuestion(index)}
              />
            ) : null}
          </div>
        ))}
      </div>
      )
     }
    </div>
  );
};

export default UserResponses;
