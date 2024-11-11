import { replaceAnswers, resetAnswers } from "@/redux/slices/answer.slice";
import { RootState } from "@/redux/store";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import CommentQuestion from "@/components/survey/CommentQuestion";
import LikertScaleQuestion from "@/components/survey/LikertScaleQuestion";
import LinearScaleQuestion from "@/components/survey/LinearScaleQuestion";
import StarRatingQuestion from "@/components/survey/StarRatingQuestion";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { pollsensei_new_logo } from "@/assets/images";
import MatrixQuestion from "@/components/survey/MatrixQuestion";
import PaginationBtn from "@/components/common/PaginationBtn";
import PreviewFile from "@/components/survey/PreviewFile";
import AnswerMultiChoiceQuestion from "@/components/survey/AnswerMuiltipleChoice";
import { toast } from "react-toastify";
import { useSubmitResponseMutation } from "@/services/survey.service";

interface Answer {
  question: string;
  question_type: string;
  options: string[];
  selected_options: string[];
}

interface DataProps {
  extracted_answers: Answer[];
  survey: any;
  uploaded_files: any;
}
interface OCRResponse {
  extracted_answers: Answer[];
  survey: any;
  uploaded_files: any;
}

const ValidateResponse = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const OCRresponses = useSelector(
    // @ts-ignore
    (state: RootState) => state.answer.answers as OCRResponse[]
  );
  console.log(params.id);
  console.log(OCRresponses);
  const [currentSection, setCurrentSection] = useState(0);
  const [submitResponse, { data, isLoading, isSuccess, isError, error }] =
    useSubmitResponseMutation();
  const [respondent_name, setRespondent_name] = useState<string>("No provided");
  const [respondent_phone, setRespondent_phone] = useState("");
  const [respondent_country, setRespondent_country] = useState("");
  // const [respondent_email, setRespondent_email] = useState( "" || "example@gmail.com");
  const [respondent_email, setRespondent_email] =
    useState<string>("example@gmail.com");

  const [filteredData, setFilteredData] = useState([]);

  console.log(OCRresponses);

  const navigatePage = (direction: any) => {
    setCurrentSection((prevIndex) => {
      if (direction === "next") {
        // @ts-ignore
        return prevIndex < OCRresponses[currentSection]?.survey?.length - 1
          ? prevIndex + 1
          : prevIndex;
      } else {
        return prevIndex > 0 ? prevIndex - 1 : prevIndex;
      }
    });
  };

  const handleSubmitResponse = async () => {
    // @ts-ignore
    const answers = OCRresponses[currentSection]?.survey?.extracted_answers
      ?.map((item: any) => {
        if (
          item.question_type === "multiple_choice" ||
          item.question_type === "single_choice"
        ) {
          return {
            question: item.question,
            question_type: item.question_type,
            selected_options: item.selected_options || [],
          };
        } else if (
          item.question_type === "comment" ||
          item.question_type === "long_text" ||
          item.question_type === "short_text"
        ) {
          return {
            question: item.question,
            question_type: item.question_type,
            text: item.text || "",
          };
        }
        // return null;
      })
      .filter(Boolean);

    const responsePayload = {
      survey_id: params.id,
      respondent_name: respondent_name,
      respondent_phone: respondent_phone,
      respondent_country: respondent_country,
      respondent_email: respondent_email,
      answers: answers,
    };
    console.log(responsePayload);
    try {
      await submitResponse(responsePayload);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Your response was saved successfully");
      router.push("/surveys/survey-list");
      dispatch(resetAnswers());
    }
    if (isError || error) {
      toast.error("An error occurred while submitting your response");
    }
  }, [isSuccess, isError, error, router]);

  // TODO: Check why the last option is not piked

  const handleQuestionChange = (index: number, selectedOptions: string[]) => {
    console.log(`Question ${index} selected options:`, selectedOptions);
  };

  useEffect(() => {
    function filterUniqueQuestions(data: Answer[]) {
      const uniqueQuestions: Answer[] = [];
      const seenQuestions = new Set<string>();

      data?.forEach((item) => {
        if (!seenQuestions.has(item.question)) {
          uniqueQuestions.push(item);
          seenQuestions.add(item.question);
        }
      });

      return uniqueQuestions;
    }

    const currentExtractedAnswers =
      OCRresponses?.[currentSection]?.extracted_answers || [];
    const uniqueFilteredData = filterUniqueQuestions(currentExtractedAnswers);
    // @ts-ignore
    setFilteredData(uniqueFilteredData);
  }, [OCRresponses, currentSection]);

  return (
    <div
      className={`${
        (OCRresponses as any)?.[currentSection]?.survey?.theme
      } flex flex-col gap-5 w-full px-5 lg:pl-16 relative`}
    >
      <div
        className={`${
          (OCRresponses as any)?.[currentSection]?.survey?.theme
        } flex justify-between gap-10 w-full`}
      >
        <div className="lg:w-2/3 flex flex-col overflow-y-auto max-h-screen custom-scrollbar">
          <div className="bg-[#9D50BB] rounded-full w-1/3 my-5 text-white flex items-center flex-col ">
            <Image
              src={(OCRresponses as any)?.[currentSection]?.survey?.logo_url}
              alt=""
              className="w-full object-cover bg-no-repeat h-16 rounded-full"
              width={"100"}
              height={"200"}
            />
          </div>

          <div className="bg-[#9D50BB] rounded-lg w-full my-4 text-white h-24 flex items-center flex-col ">
            <Image
              src={(OCRresponses as any)?.[currentSection]?.survey?.header_url}
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
                fontSize: `${
                  (OCRresponses as any)?.[currentSection]?.survey?.header_text
                    ?.size
                }px`,
                fontFamily: `${
                  (OCRresponses as any)?.[currentSection]?.survey?.header_text
                    ?.name
                }`,
              }}
            >
              {(OCRresponses as any)?.[currentSection]?.survey?.topic}
            </h2>
            <p
              style={{
                fontSize: `${
                  (OCRresponses as any)?.[currentSection]?.survey?.body_text
                    ?.size
                }px`,
                fontFamily: `${
                  (OCRresponses as any)?.[currentSection]?.survey?.body_text
                    ?.name
                }`,
              }}
            >
              {(OCRresponses as any)?.[currentSection]?.survey?.description}
            </p>
          </div>

          <div className="flex flex-col gap-2 w-full bg-white px-11 py-4 rounded-lg mb-4">
            {(OCRresponses as any)?.[currentSection]?.survey?.settings
              ?.collect_email_addresses && (
              <div className="flex flex-col w-full">
                <label htmlFor="full name" className="pl-5">
                  Full name <sup className="text-red-700 text-sm">*</sup>
                </label>
                <input
                  type="text"
                  className="border-b-2 rounded-b-md ring-0 shadow-sm active:border-none focus:border-none py-1 px-4 outline-none "
                  required
                  onChange={(e) => setRespondent_name(e.target.value)}
                  value={respondent_name}
                />
              </div>
            )}
            {(OCRresponses as any)?.[currentSection]?.survey?.settings
              ?.collect_name_of_respondents && (
              <div className="flex flex-col w-full">
                <label htmlFor="full name" className="pl-5">
                  Email <sup className="text-red-700 text-sm">*</sup>
                </label>
                <input
                  type="email"
                  className="border-b-2 rounded-b-md ring-0 shadow-sm active:border-none focus:border-none py-1 px-4 outline-none "
                  required
                  onChange={(e) => setRespondent_email(e.target.value)}
                  value={respondent_email}
                />
              </div>
            )}
          </div>

          {/* @ts-ignore */}
          {filteredData?.map((item: any, index: number) => (
            <div key={index} className="mb-4">
              {item.question_type === "multiple_choice" ||
              item.question_type === "multi_choice" ? (
                <AnswerMultiChoiceQuestion
                  key={index}
                  question={item.question}
                  options={item.options}
                  questionType={item.question_type}
                  selectedOptions={item.selected_options || []}
                  onChange={(selected) =>
                    // handleQuestionChange(index, selected)
                    console.log(selected)
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
                  response={item.text}
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
                  // maxRating={5}
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

          <div className=" rounded-md flex  items-center w-full md:min-w-[16rem] py-5 text-center">
            <button
              className="bg-gradient-to-r from-[#5b03b2] to-[#9d50bb] rounded-lg px-8 py-2 text-white text-[16px] font-medium leading-6 text-center font-inter justify-center"
              type="button"
              onClick={() => {
                dispatch(replaceAnswers(filteredData));
                console.log("You clicked me");
              }}
            >
              Remove duplicate questions
            </button>
            <button
              className="bg-gradient-to-r from-[#5b03b2] to-[#9d50bb] rounded-lg px-8 py-2 text-white text-[16px] font-medium leading-6 text-center font-inter justify-center"
              type="button"
              onClick={() => {
                setTimeout(() => {
                  router.push("/surveys/survey-list");
                  toast.success("Successful");
                  dispatch(resetAnswers());
                }, 3000);
              }}
            >
              {isLoading ? "Submitting..." : "Submit"}
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
          <PreviewFile data={OCRresponses?.[currentSection]?.uploaded_files} />
        </div>
      </div>
    </div>
  );
};

export default ValidateResponse;
