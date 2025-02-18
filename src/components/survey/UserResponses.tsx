"use client";

import React, { useState } from "react";
import AnswerMultiChoiceQuestion from "./AnswerMuiltipleChoice";
import CommentQuestion from "./CommentQuestion";
import LinearScaleQuestion from "./LinearScaleQuestion";
// import LikertScaleQuestion from "./LikertScaleQuestion";
import MatrixQuestion from "./MatrixQuestion";
// import StarRatingQuestion from "./StarRatingQuestion";
import PaginationBtn from "../common/PaginationBtn";
import ShortTextQuestion from "./LongTextQuestion";
// import BooleanQuestion from "./BooleanQuestion";
import NumberQuestion from "./NumberQuestion";
import CheckboxQuestion from "./CheckboxQuestion";
import RatingScaleQuestion from "./RatingScaleQuestion";
// import DropdownQuestion from "./DropdownQuestion";
import MediaQuestion from "./MediaQuestion";
import StarRatingQuestion from "./AnswerStarRating";
import BooleanQuestion from "./AnswerBoolean";
import DropdownQuestion from "./AnswerDropdownQuestion";
import LikertScaleQuestion from "./AnswerLikertScale";
import { useEditTranscriptionMutation } from "@/services/survey.service";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import CommentWithMediaQuestion from "./CommentWithMediaQuestion";

interface Answer {
  question?: string;
  question_type?: string;
  options?: string[];
  selected_options?: string[];
}

interface DataProps {
  _id?: string;
  answers: Answer[];
}

interface UserResponseProps {
  data?: DataProps;
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
  const [editTranscription, { isLoading: IsTranscribing }] =
    useEditTranscriptionMutation();
  const params = useParams();
  const response_id = data?._id;
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

  // const handleTranscribe = async (updatedResponse: string) => {
  //   console.log("Updated transcription:", updatedResponse);
  //   const payload = {
  //     transcription_id: updatedResponse,
  //     text:""   // update text goes here
  //   }
  //   console.log(payload)
  //      try {
  //             await editTranscription(payload).unwrap();
  //             toast.success("Transcription updated successfully!");
  //           } catch (error) {
  //             console.error("Error updating response:", error);
  //             toast.error("Failed to transcribe response.");
  //           }

  // };

  const handleTranscribe = async (transcription_id: string, text: string) => {
    console.log("Updating transcription:", transcription_id, text);

    const payload = {
      id: response_id,
      transcription_id: transcription_id,
      text: text,
    };

    console.log(payload);

    try {
      await editTranscription(payload).unwrap();
      toast.success("Transcription updated successfully!");
    } catch (error) {
      console.error("Error updating response:", error);
      toast.error("Failed to transcribe response.");
    }
  };

  return (
    <div className={`flex flex-col gap-5 w-full relative mt-4`}>
      <div className={`flex flex-col justify-between gap-10 w-full`}>
        {isLoading ? (
          <div className="w-full h-100 flex justify-center items-center">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : isSuccess ? (
          data?.answers?.map((item: any, index: number) => (
            <div key={index} className="mb-4">
              {item.question_type === "multiple_choice" ||
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
              ) : item.question_type === "comment" ||
                item.question_type === "short_text" ? (
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
              ) : item.question_type === "number" ? (
                <CommentQuestion
                  key={index}
                  index={index + 1}
                  questionType={item.question_type}
                  question={item.question}
                  response={item.num}
                  status={item?.validation_result?.status}
                  // DeleteQuestion={()=>handleDeleteQuestion(index)}
                />
              ) : item.question_type === "media" ? (
                <MediaQuestion
                  key={index}
                  index={index + 1}
                  questionType={item.question_type}
                  question={item.question}
                  response={item?.media?.text}
                  status={item?.validation_result?.status}
                  audio={item?.media?.url}
                  onTranscribe={(updatedText) => {
                    handleTranscribe(
                      item?.media?.transcription_id,
                      updatedText
                    );
                  }}
                  // onTranscribe={()=>{
                  //   console.log("You clicked me" + index)
                  //   console.log(item?.media?.url)
                  //   handleTranscribe(item?.media?.transcription_id
                  //     )
                  // }}
                />
              ) : item.question_type === "long_text" ? (
                <CommentWithMediaQuestion
                  key={index}
                  index={index + 1}
                  questionType={item.question_type}
                  question={item.question}
                  response={item?.media?.text || item.text}
                  mediaUrl={item?.media?.url}
                  status={item?.validation_result?.status}
                  audio={item?.media?.url}
                  onTranscribe={(updatedText) => {
                    handleTranscribe(
                      item?.media?.transcription_id,
                      updatedText
                    );
                  }}
                  // EditQuestion={() => EditQuestion(index)}
                  // DeleteQuestion={()=>handleDeleteQuestion(index)}
                />
              ) : item.question_type === "linear_Scale" ? (
                <LinearScaleQuestion
                  index={index + 1}
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
                  index={index + 1}
                  options={item.options}
                  questionType={item.question_type}
                  scale_value={item.scale_value}
                  status={item?.validation_result?.status}
                />
              ) : item.question_type === "star_rating" ? (
                <StarRatingQuestion
                  index={index + 1}
                  question={item.question}
                  questionType={item.question_type}
                  scale_value={item.scale_value}
                  status={item?.validation_result?.status}
                  onRate={(value) => console.log("Rated:", value)}
                />
              ) : item.question_type === "matrix_checkbox" ? (
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
              ) : //  : item.question_type === "single_choice" ? (
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
              item.question_type === "checkbox" ? (
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
                  item={item}
                />
              ) : item.question_type === "drop_down" ||
                item.question_type === "dropdown" ? (
                <DropdownQuestion
                  index={index + 1}
                  key={index}
                  question={item.question}
                  options={item.options}
                  questionType={item.question_type}
                  drop_down_value={item.drop_down_value}
                  status={item?.validation_result?.status}
                />
              ) : item.question_type === "number" ? (
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
