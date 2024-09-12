import CommentQuestion from "@/components/survey/CommentQuestion";
import LikertScaleQuestion from "@/components/survey/LikertScaleQuestion";
import LinearScaleQuestion from "@/components/survey/LinearScaleQuestion";
import MultiChoiceQuestion from "@/components/survey/MultiChoiceQuestion";
import MultiChoiceQuestionEdit from "@/components/survey/MultiChoiceQuestionEdit";
import StarRatingQuestion from "@/components/survey/StarRatingQuestion";
import { RootState } from "@/redux/store";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import { pollsensei_new_logo, sparkly, stars } from "@/assets/images";
import MatrixQuestion from "@/components/survey/MatrixQuestion";
import MatrixQuestionEdit from "@/components/survey/MatrixQuestionEdit";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import PaginationBtn from "@/components/common/PaginationBtn";

const Preview = () => {
  const survey = useSelector((state: RootState) => state?.survey);
  const questions = useSelector((state: RootState) => state?.survey?.sections);
  const headerUrl = useSelector(
    (state: RootState) => state?.survey?.header_url
  );
  const logoUrl = useSelector((state: RootState) => state?.survey?.logo_url);
  const theme = useSelector((state: RootState) => state?.survey?.theme);
  const headerText = useSelector(
    (state: RootState) => state?.survey?.header_text
  );
  const surveyTitle = useSelector((state: RootState) => state?.survey?.topic);
  const [currentSection, setCurrentSection] = useState(0);
  const surveyDescription = useSelector(
    (state: RootState) => state?.survey?.description
  );
  const [isEdit, setIsEdit] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  console.log(questions);

  const navigatePage = (direction: any) => {
    setCurrentSection((prevIndex) => {
      if (direction === "next") {
        return prevIndex < questions.length - 1 ? prevIndex + 1 : prevIndex;
      } else {
        return prevIndex > 0 ? prevIndex - 1 : prevIndex;
      }
    });
  };

  return (
    <div className={` flex flex-col gap-5 px-16`}>
      <div
        className={`${theme} flex justify-center items-center px-5 mx-auto gap-10 w-[80%]`}
      >
        <div
          className={` w- flex flex-col overflow-y-auto max-h-screen custom-scrollbar`}
        >
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

          <div className="bg-[#9D50BB] rounded-lg w-full my-4 text-white h-24 flex items-center flex-col ">
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

          <div className="bg-white rounded-lg w-full my-4 flex gap-2 px-11 py-4 flex-col ">
            <h2
              className="text-[1.5rem] font-normal"
              style={{
                fontSize: `${headerText?.size}px`,
                fontFamily: `${headerText?.name}`,
              }}
            >
              {surveyTitle}
            </h2>
            <p>{surveyDescription}</p>
            {/* <div className="flex justify-end">
            <button className="rounded-full border px-5 py-1" >Edit</button>
          </div> */}
          </div>
          {questions && questions[currentSection]?.questions?.map(
            (item: any, index: number) => (
              <div key={index} className="mb-4">
                {isEdit &&
                editIndex === index &&
                item.question_type === "matrix_checkbox" ? (
                  <MatrixQuestionEdit
                    question={item.question}
                    options={item.options}
                    questionType={item.question_type}
                  />
                ) : isEdit && editIndex === index ? (
                  <MultiChoiceQuestionEdit
                    question={item.Question}
                    options={item.Options}
                    questionType={item.question_type}
                  />
                ) : item.question_type === "multiple_choice" ? (
                  <MultiChoiceQuestion
                    question={item.question}
                    options={item.options}
                    questionType={item.question_type}
                    index={index + 1}
                  />
                ) : item.question_type === "long_text" ? (
                  <CommentQuestion
                    key={index}
                    index={index + 1}
                    questionType={item.question_type}
                    question={item.question}
                  />
                ) : item.question_type === "linear_Scale" ? (
                  <LinearScaleQuestion
                    question={item.question}
                    scaleStart={item.scaleStart}
                    scaleEnd={item.scaleEnd}
                    questionType={item.question_type}
                  />
                ) : item.question_type === "likert_scale" ? (
                  <LikertScaleQuestion
                    question={item.question}
                    options={item.options}
                    questionType={item.question_type}
                  />
                ) : item.question_type === "star_rating" ? (
                  <StarRatingQuestion
                    question={item.question}
                    maxRating={5}
                    questionType={item.question_type}
                  />
                ) : item.question_type === "matrix_checkbox" ? (
                  <MatrixQuestion
                    key={index}
                    index={index + 1}
                    options={item.options}
                    questionType={item.question_type}
                    question={item.question}
                  />
                ) : null}
              </div>
            )
          )}

          {questions?.length > 1 && (
            <div className="flex justify-end items-center pb-10">
              <PaginationBtn
                currentSection={currentSection}
                totalSections={questions.length}
                onNavigate={navigatePage}
              />
            </div>
          )}

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
      </div>
    </div>
  );
};

export default Preview;
