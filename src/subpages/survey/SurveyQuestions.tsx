import CommentQuestion from "@/components/survey/CommentQuestion";
import LikertScaleQuestion from "@/components/survey/LikertScaleQuestion";
import MultiChoiceQuestion from "@/components/survey/MultiChoiceQuestion";
import StarRatingQuestion from "@/components/survey/StarRatingQuestion";
import React, { useState } from "react";
import Image from "next/image";
import { pollsensei_new_logo } from "@/assets/images";
import MatrixQuestion from "@/components/survey/MatrixQuestion";
import PaginationBtn from "@/components/common/PaginationBtn";
import { useFetchASurveyQuery } from "@/services/survey.service";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import SliderQuestion from "@/components/survey/SliderQuestion";
import ShortTextQuestion from "@/components/survey/LongTextQuestion";
import BooleanQuestion from "@/components/survey/BooleanQuestion";
import SingleChoiceQuestion from "@/components/survey/SingleChoiceQuestion";
import NumberQuestion from "@/components/survey/NumberQuestion";
import CheckboxQuestion from "@/components/survey/CheckboxQuestion";
import DropdownQuestion from "@/components/survey/DropdownQuestion";
import RatingScaleQuestion from "@/components/survey/RatingScaleQuestion";
import MediaQuestion from "@/components/survey/MediaQuestion";
import { cn } from "@/lib/utils";
import WatermarkBanner from "@/components/common/WatermarkBanner";
import SurveyHeader from "@/components/survey/SurveyHeader";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios-instance";

const SurveyQuestions = () => {
  const params = useParams();
  const [currentSection, setCurrentSection] = useState(0);
  const isSettings = useSelector(
    (state: RootState) => state.survey_settings.isSettings
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ["survey", params.id],
    queryFn: async () => {
      return await axiosInstance.get(`survey/${params.id}`);
    },
  });

  const navigatePage = (direction: any) => {
    setCurrentSection((prevIndex) => {
      if (direction === "next") {
        return prevIndex < data?.data?.sections?.length - 1
          ? prevIndex + 1
          : prevIndex;
      } else {
        return prevIndex > 0 ? prevIndex - 1 : prevIndex;
      }
    });
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-lg shadow-lg text-center"
        >
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600">
            We're having trouble loading your survey. Please try again later.
          </p>
        </motion.div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="animate-pulse px-4 py-10 md:px-10">
        <div className="w-16 h-16 bg-gray-200 rounded-lg mb-4" />
        <div className="w-full h-24 bg-gray-200 rounded-lg mb-6" />
        <div className="bg-white rounded-lg p-6 mb-8">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-full mb-2" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg p-6 mb-4">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
              <div className="h-4 bg-gray-200 rounded w-4/5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  console.log(data?.data?.sections[currentSection]?.questions);

  return (
    <div
      className={cn(
        `flex flex-col gap-5 w-full min-h-screen`,
        data?.data?.theme && data?.data?.theme
      )}
    >
      {data && data?.data && (
        <div
          className={`flex justify-center items-center mx-auto gap-10 w-full lg:px-16 max-w-[80%]`}
        >
          <div
            className={`w-full flex flex-col overflow-y-auto max-h-screen custom-scrollbar`}
          >
            {data && data?.data?.logo_url && (
              <div className="bg-white rounded-lg w-16 my-3 text-white flex items-center flex-col ">
                <Image
                  src={data?.data?.logo_url}
                  alt=""
                  className="w-full object-cover bg-no-repeat h-16 rounded-lg"
                  width={"100"}
                  height={"200"}
                />
              </div>
            )}
            {data && data?.data?.header_url && (
              <div className="bg-white rounded-lg  w-full my-2 text-white h-24 flex items-center flex-col ">
                <Image
                  src={data?.data?.header_url}
                  alt=""
                  className="w-full object-cover bg-no-repeat h-24 rounded-lg"
                  width={"100"}
                  height={"200"}
                />
              </div>
            )}

            <div className="rounded-lg w-full my-4 flex gap-2 py-4 flex-col ">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-lg w-full my-4 flex gap-2 px-4 md:px-6 py-6 flex-col shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className={cn(
                    "text-[1.5rem] font-normal bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] bg-clip-text text-transparent",
                    `font-${data?.data?.headerText?.name
                      ?.split(" ")
                      ?.join("-")
                      ?.toLowerCase()}`
                  )}
                  style={{
                    fontSize: `${data?.data?.headerText?.size}px`,
                  }}
                >
                  {data?.data?.topic}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className={cn(
                    "text-gray-600 leading-relaxed",
                    `font-${data?.data?.bodyText?.name
                      ?.split(" ")
                      ?.join("-")
                      ?.toLowerCase()}`
                  )}
                  style={{
                    fontSize: `${data?.data?.bodyText?.size}px`,
                  }}
                >
                  {data?.data?.description}
                </motion.p>
              </motion.div>
            </div>
            {data?.data &&
              data?.data?.sections[currentSection]?.questions?.map(
                (item: any, index: number) => (
                  <div
                    key={index}
                    className="mb-4"
                    style={{
                      fontFamily: `${data?.data?.question_text?.name}`,
                      fontSize: `${data?.data?.question_text?.size}px`,
                    }}
                  >
                    {item.question_type &&
                    item.question_type === "multiple_choice" ? (
                      <MultiChoiceQuestion
                        question={item.question}
                        options={item.options}
                        questionType={item.question_type}
                        index={index + 1}
                        is_required={item.is_required}
                      />
                    ) : item.question_type === "long_text" ? (
                      <CommentQuestion
                        key={index}
                        index={index + 1}
                        questionType={item.question_type}
                        question={item.question}
                        is_required={item.is_required}
                      />
                    ) : item.question_type === "media" ? (
                      <MediaQuestion
                        key={index}
                        index={index + 1}
                        questionType={item.question_type}
                        question={item.question}
                        is_required={item.is_required}
                      />
                    ) : item.question_type === "slider" ? (
                      <SliderQuestion
                        question={item.question}
                        options={item.options}
                        questionType={item.question_type}
                        index={index + 1}
                        is_required={item.is_required}
                      />
                    ) : item.question_type === "likert_scale" ? (
                      <LikertScaleQuestion
                        question={item.question}
                        options={item.options}
                        questionType={item.question_type}
                        key={index}
                        index={index + 1}
                        is_required={item.is_required}
                      />
                    ) : item.question_type === "star_rating" ? (
                      <StarRatingQuestion
                        question={item.question}
                        index={index + 1}
                        questionType={item.question_type}
                        is_required={item.is_required}
                      />
                    ) : item.question_type === "matrix_multiple_choice" ? (
                      <MatrixQuestion
                        key={index}
                        index={index + 1}
                        rows={item.rows}
                        columns={item.columns}
                        questionType={item.question_type}
                        question={item.question}
                        is_required={item.is_required}
                      />
                    ) : item.question_type === "matrix_checkbox" ? (
                      <MatrixQuestion
                        key={index}
                        index={index + 1}
                        rows={item.rows}
                        columns={item.columns}
                        questionType={item.question_type}
                        question={item.question}
                        is_required={item.is_required}
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
                        questionType={item.question_type}
                      />
                    ) : item.question_type === "single_choice" ? (
                      <SingleChoiceQuestion
                        index={index + 1}
                        key={index}
                        question={item.question}
                        options={item.options}
                        questionType={item.question_type}
                      />
                    ) : item.question_type === "number" ? (
                      <NumberQuestion
                        key={index}
                        index={index + 1}
                        question={item.question}
                        questionType={item.question_type}
                      />
                    ) : item.question_type === "checkbox" ? (
                      <CheckboxQuestion
                        key={index}
                        index={index + 1}
                        question={item.question}
                        options={item.options}
                        questionType={item.question_type}
                      />
                    ) : item.question_type === "rating_scale" ? (
                      <RatingScaleQuestion
                        key={index}
                        index={index + 1}
                        question={item.question}
                        options={item.options}
                        questionType={item.question_type}
                      />
                    ) : item.question_type === "drop_down" ? (
                      <DropdownQuestion
                        index={index + 1}
                        key={index}
                        question={item.question}
                        options={item.options}
                        questionType={item.question_type}
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
                )
              )}

            {/* {data?.data?.sections?.length > 1 && (
              <div className="flex justify-end items-center pb-10">
                <PaginationBtn
                  currentSection={currentSection}
                  totalSections={data?.data?.sections?.length}
                  onNavigate={navigatePage}
                />
              </div>
            )} */}

            <WatermarkBanner className="mb-10" />
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyQuestions;
