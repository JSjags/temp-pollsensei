"use client";

import React, { useState } from "react";
import AnswerMultiChoiceQuestion from "./AnswerMuiltipleChoice";
import CommentQuestion from "./CommentQuestion";
import LinearScaleQuestion from "./LinearScaleQuestion";
import LikertScaleQuestion from "./LikertScaleQuestion";
import MatrixQuestion from "./MatrixQuestion";
// import StarRatingQuestion from "./StarRatingQuestion";
import PaginationBtn from "../common/PaginationBtn";
import ShortTextQuestion from "./LongTextQuestion";
// import BooleanQuestion from "./BooleanQuestion";
import SingleChoiceQuestion from "./SingleChoiceQuestion";
import NumberQuestion from "./NumberQuestion";
import CheckboxQuestion from "./CheckboxQuestion";
import RatingScaleQuestion from "./RatingScaleQuestion";
// import DropdownQuestion from "./DropdownQuestion";
import MediaQuestion from "./MediaQuestion";
import StarRatingQuestion from "./AnswerStarRating";
import BooleanQuestion from "./AnswerBoolean";
import DropdownQuestion from "./AnswerDropdownQuestion";

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
  isLoading?: boolean;
  error?: boolean;
  isSuccess?: boolean;
}

const UserResponses: React.FC<UserResponseProps> = ({
  data,
  index,
  isLoading,
  error,
  isSuccess,
}) => {
  console.log(data);
  console.log(isLoading);
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

  if (isLoading) {
    return (
      <div className="w-full h-100 flex justify-center items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-5 w-full relative mt-4`}>
      <div className={`flex  flex-col justify-between gap-10 w-full`}>
        {isLoading ? (
          <div className="w-full h-100 flex justify-center items-center">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : isSuccess ? (
          data?.answers?.map((item: any, index: number) => (
            <div key={index} className="mb-4">
              {
              item.question_type === "multiple_choice" ||
              item.question_type === "checkbox" ||
              item.question_type === "single_choice" ? (
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
              ) : 
              item.question_type === "comment" ||
               item.question_type === "short_text" ||
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
              ) :
                 
               item.question_type === "number" ? (
               <CommentQuestion
                 key={index}
                 index={index + 1}
                 questionType={item.question_type}
                 question={item.question}
                 response={item.num}
                 status={item?.validation_result?.status}
                 // EditQuestion={() => EditQuestion(index)}
                 // DeleteQuestion={()=>handleDeleteQuestion(index)}
               />
             ) 
              : item.question_type === "media"  ? (
              <MediaQuestion
                key={index}
                index={index + 1}
                questionType={item.question_type}
                question={item.question}
                response={item?.media?.text}
                status={item?.validation_result?.status}
                audio={item?.media?.url}
                onTranscribe={()=>{
                  console.log("You clicked me" + index)
                  console.log(item?.media?.url)
                  console.log(item?.media)
                  console.log(item?.question)
                  console.log(item)
                }}
                
                // EditQuestion={() => EditQuestion(index)}
                // DeleteQuestion={()=>handleDeleteQuestion(index)}
              />
            )
               : item.question_type === "linear_Scale" ? (
                <LinearScaleQuestion
                  question={item.question}
                  scaleStart={item.scaleStart}
                  scaleEnd={item.scaleEnd}
                  questionType={item.question_type}
                  // EditQuestion={() => EditQuestion(index)}
                  // DeleteQuestion={()=>handleDeleteQuestion(index)}
                />
              ) : item.question_type === "likert_scale" ? (
                <LikertScaleQuestion
                  question={item.question}
                  options={item.options}
                  questionType={item.question_type}
                />
              )
               : item.question_type === "star_rating" ? (
                <StarRatingQuestion
                  question={item.question}
                  questionType={item.question_type}
                  scale_value={item.scale_value}
                  onRate={(value) => console.log("Rated:", value)}
                />
              ) 
              : item.question_type === "matrix_checkbox" ? (
                <MatrixQuestion
                  key={index}
                  index={index + 1}
                  // options={item.options}
                  rows={item.rows}
                  columns={item.columns}
                  questionType={item.question_type}
                  question={item.question}
                />
              ) : item.question_type === "short_text" ? (
                <ShortTextQuestion
                  key={index}
                  index={index + 1}
                  question={item.question}
                  questionType={item.question_type}
                  is_required={item.is_required}
                />
              ) : item.question_type === "boolean" ? (
                <BooleanQuestion
                  key={index}
                  index={index + 1}
                  question={item.question}
                  options={item.options}
                  boolean_value={item?.boolean_value}
                  questionType={item.question_type}
                 status={item?.validation_result?.status}

                />
              )
              //  : item.question_type === "single_choice" ? (
              //   <SingleChoiceQuestion
              //     index={index + 1}
              //     key={index}
              //     question={item.question}
              //     options={item.options}
              //     questionType={item.question_type}
              //     // selectedOptions={item.selected_options}
              //   />
              // ) 

              // : item.question_type === "number" ? (
              //   <NumberQuestion
              //     key={index}
              //     index={index + 1}
              //     question={item.question}
              //     questionType={item.question_type}
              //     // EditQuestion={() => EditQuestion(index)}
              //   />
              // )
               : item.question_type === "checkbox" ? (
                <CheckboxQuestion
                  key={index}
                  index={index + 1}
                  question={item.question}
                  options={item.options}
                  questionType={item.question_type}
                 status={item?.validation_result?.status}

                />
              ) : item.question_type === "rating_scale" ? (
                <RatingScaleQuestion
                  key={index}
                  index={index + 1}
                  question={item.question}
                  options={item.options}
                  questionType={item.question_type}
                />
              )
               : item.question_type === "drop_down" ? (
                <DropdownQuestion
                  index={index + 1}
                  key={index}
                  question={item.question}
                  options={item.options}
                  questionType={item.question_type}
                  drop_down_value={item.drop_down_value}
                 status={item?.validation_result?.status}

                />
              )
               : item.question_type === "number" ? (
                <NumberQuestion
                  key={index}
                  index={index + 1}
                  question={item.question}
                  questionType={item.question_type}
                />
              ) : null}
            </div>
          ))
        ) : error ? (
          <div>Something went wrong</div>
        ) : (
          "No record found"
        )}
      </div>
    </div>
  );
};

export default UserResponses;
