import { resetAnswers } from "@/redux/slices/answer.slice";
import { RootState } from "@/redux/store";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import CommentQuestion from "@/components/survey/CommentQuestion";
import LikertScaleQuestion from "@/components/survey/LikertScaleQuestion";
import LinearScaleQuestion from "@/components/survey/LinearScaleQuestion";
import StarRatingQuestion from "@/components/survey/StarRatingQuestion";
import React, { useState } from "react";
import Image from "next/image";
import { pollsensei_new_logo } from "@/assets/images";
import MatrixQuestion from "@/components/survey/MatrixQuestion";
import PaginationBtn from "@/components/common/PaginationBtn";
import PreviewFile from "@/components/survey/PreviewFile";
import AnswerMultiChoiceQuestion from "@/components/survey/AnswerMuiltipleChoice";
import { toast } from "react-toastify";


interface Answer {
  question: string;
  question_type: string;
  options: string[];
  selected_options: string[];
}

interface OCRResponse {
  extracted_answers: Answer[];
  survey: any
}

const ValidateResponse = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const OCRresponses = useSelector((state: RootState) => state.answer.answers as OCRResponse[]);
  console.log(params.id);
  console.log(OCRresponses);
  const [currentSection, setCurrentSection] = useState(0);

  console.log(OCRresponses);

  const navigatePage = (direction: any) => {
    setCurrentSection((prevIndex) => {
      if (direction === "next") {
        return prevIndex < OCRresponses.length - 1 ? prevIndex + 1 : prevIndex;
      } else {
        return prevIndex > 0 ? prevIndex - 1 : prevIndex;
      }
    });
  };

  const handleSubmitResponse = () => {
    toast.error("Somethiingwent wrong")
    dispatch(resetAnswers());
    router.push("/surveys/survey-list")
  };

  // <button type="reset" onClick={handleReset}>Resent</button>

  // TODO: Check why the last option is not piked

  const handleQuestionChange = (index: number, selectedOptions: string[]) => {
    console.log(`Question ${index} selected options:`, selectedOptions);
  };
  return (
    <div
      className={`${(OCRresponses as any)?.survey?.theme} flex flex-col gap-5 w-full px-5 lg:pl-16 relative`}
    >
      <div className={`${(OCRresponses as any)?.survey?.theme} flex justify-between gap-10 w-full`}>
        <div className="lg:w-2/3 flex flex-col overflow-y-auto max-h-screen custom-scrollbar">
        <div className="bg-[#9D50BB] rounded-full w-1/3 my-5 text-white flex items-center flex-col "> 
              <Image
                src={
                  (OCRresponses as any)?.survey?.logo_url
                }
                alt=""
                className="w-full object-cover bg-no-repeat h-16 rounded-full"
                width={"100"}
                height={"200"}
              />
            </div>
       
          <div className="bg-[#9D50BB] rounded-lg w-full my-4 text-white h-24 flex items-center flex-col ">
            <Image
              src={
                (OCRresponses as any)?.survey?.header_url
              }
              alt=""
              className="w-full object-cover bg-no-repeat h-24 rounded-lg"
              width={"100"}
              height={"200"}
            />
          </div> 
          <div className="bg-white rounded-lg w-full my-4 flex gap-2 px-11 py-4 flex-col ">
            <h2 className="text-[1.5rem] font-normal" style={{fontSize:`${(OCRresponses as any)?.header_text?.size}px`, fontFamily:`${(OCRresponses as any)?.header_text?.name}` }}>{(OCRresponses as any)?.survey?.topic}</h2>
            <p style={{fontSize:`${(OCRresponses as any)?.body_text?.size}px`, fontFamily:`${(OCRresponses as any)?.body_text?.name}` }}>{(OCRresponses as any)?.survey?.description}</p>
          </div>
          
          {OCRresponses[currentSection]?.extracted_answers?.map(
            (item: any, index: number) => (
              <div key={index} className="mb-4">
                {item.question_type === "multiple_choice" ||
                item.question_type === "multi_choice" ? (
                  <AnswerMultiChoiceQuestion
                    key={index}
                    question={item.question}
                    options={item.options}
                    questionType={item.question_type}
                    selectedOptions={item.selected_options}
                    onChange={(selected) =>
                      handleQuestionChange(index, selected)
                    }
                    index={index + 1}
                  />
                ) : item.question_type === "comment" ||
                  item.question_type === "long_text" ? (
                  <CommentQuestion
                    key={index}
                    index={index + 1}
                    questionType={item.question_type}
                    question={item.question}
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
            )
          )}
          <div className="flex flex-col gap-4 md:flex-row justify-between items-center">
            <div className="flex gap-2 items-center"></div>
            {OCRresponses?.length > 1 && (
              <div className="flex w-full md:w-auto md:justify-end items-center">
                <PaginationBtn
                  currentSection={currentSection}
                  totalSections={OCRresponses.length}
                  onNavigate={navigatePage}
                />
              </div>
            )}
          </div>

          <div className=" rounded-md flex flex-col justify-center w-full md:w-[16rem] py-5 text-center">
            <button
              className="bg-gradient-to-r from-[#5b03b2] to-[#9d50bb] rounded-lg px-8 py-2 text-white text-[16px] font-medium leading-6 text-center font-inter justify-center"
              type="button"
              onClick={handleSubmitResponse}
            >
              Submit
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
        </div>
        <div
          className={`hidden lg:flex lg:w-1/3 overflow-y-auto max-h-screen custom-scrollbar bg-white`}
        >
          <PreviewFile data={[]} />
        </div>
      </div>
    </div>
  );
};

export default ValidateResponse;
