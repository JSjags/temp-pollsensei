import { pollsensei_new_logo, sparkly } from "@/assets/images";
import PaginationBtn from "@/components/common/PaginationBtn";
import AnswerMultiChoiceQuestion from "@/components/survey/AnswerMuiltipleChoice";
import CommentQuestion from "@/components/survey/CommentQuestion";
import MultiChoiceQuestion from "@/components/survey/MultiChoiceQuestion";
import StarRatingQuestion from "@/components/survey/StarRatingQuestion";
import {
  useGetPublicSurveyByIdQuery,
  useGetPublicSurveyByShortUrlQuery,
  useSubmitPublicResponseMutation,
} from "@/services/survey.service";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";

const PublicResponse = () => {
  const params = useParams();
  const { data: psId, isLoading: psIdLoading } = useGetPublicSurveyByIdQuery(
    params.id
  );
  const { data: psShortUrl, isLoading: psShUrLoading } =
    useGetPublicSurveyByShortUrlQuery(params.id);
  const [
    submitPublicResponse,
    { isSuccess: submitSuccess, isLoading: submitting, error: errorSubmitting },
  ] = useSubmitPublicResponseMutation();
  const [currentSection, setCurrentSection] = useState(0);
  const OCRresponses: string | any[] = [];
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [textResponses, setTextResponses] = useState<string[]>([]);
  const [respondent_name, setRespondent_name] = useState("");
  const [respondent_phone, setRespondent_phone] = useState("");
  const [respondent_country, setRespondent_country] = useState("");
  const [respondent_email, setRespondent_email] = useState("");
  const [submitSurveySuccess, setSubmitSurveySuccess] = useState(false);
  const router = useRouter();

  // const handleOptionChange = (
  //   index: number,
  //   value: string,
  //   question_type: string
  // ) => {
  //   if (
  //     question_type === "multiple_choice" ||
  //     question_type === "single_choice"
  //   ) {
  //     const updatedOptions = [...selectedOptions];
  //     updatedOptions[index] = value;
  //     setSelectedOptions(updatedOptions);
  //   } else if (
  //     question_type === "comment" ||
  //     question_type === "long_text" ||
  //     question_type === "short_text"
  //   ) {
  //     const updatedTextResponses = [...textResponses];
  //     updatedTextResponses[index] = value;
  //     setTextResponses(updatedTextResponses);
  //     console.log(updatedTextResponses);
  //   }
  // };

  const handleOptionChange = (
    index: number,
    value: string,
    question_type: string
  ) => {
    if (
      question_type === "multiple_choice" ||
      question_type === "single_choice"
    ) {
      const updatedOptions = [...selectedOptions];
      updatedOptions[index] = value;
      setSelectedOptions(updatedOptions);
    } else if (
      question_type === "comment" ||
      question_type === "long_text" ||
      question_type === "short_text"
    ) {
      const updatedTextResponses = [...textResponses];
      updatedTextResponses[index] = value;
      setTextResponses(updatedTextResponses);
      console.log(updatedTextResponses);
    }
  };
  

  console.log(textResponses);

  console.log(params.id);
  const question =
    typeof params?.id === "string" && params.id.startsWith("ps-")
      ? psId
      : psShortUrl;

  const handleSubmitResponse = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // const formattedAnswers = question?.data?.sections[currentSection]?.questions
    //   .map((item: any, index: number) => {
    //     if (
    //       item.question_type === "multiple_choice" ||
    //       item.question_type === "single_choice"
    //     ) {
    //       return {
    //         question: item.question,
    //         question_type: item.question_type,
    //         selected_options: [selectedOptions[index]],
    //       };
    //     } else if (
    //       item.question_type === "comment" ||
    //       item.question_type === "long_text" ||
    //       item.question_type === "short_text"
    //     ) {
    //       return {
    //         question: item.question,
    //         question_type: item.question_type,
    //         text: textResponses[index] || "something",
    //       };
    //     }
    //     return null;
    //   })
    //   .filter(Boolean);

    const formattedAnswers = question?.data?.sections[currentSection]?.questions
  .map((item: any, index: number) => {
    if (
      item.question_type === "multiple_choice" ||
      item.question_type === "single_choice"
    ) {
      return {
        question: item.question,
        question_type: item.question_type,
        selected_options: [selectedOptions[index]],
      };
    } else if (
      item.question_type === "comment" ||
      item.question_type === "long_text" ||
      item.question_type === "short_text"
    ) {
      return {
        question: item.question,
        question_type: item.question_type,
        text: textResponses[index] || "something",  
      };
    }
    return null;
  })
  .filter(Boolean);

    if (
      !formattedAnswers ||
      (question?.data?.settings?.collect_email_addresses === true &&
        respondent_email === "") ||
      (question?.data?.settings?.collect_name_of_respondents === true &&
        respondent_name === "")
    ) {
      toast.warning("All fields are required");
      return null;
    }

    const responsePayload = {
      survey_id: question?.data?._id,
      respondent_name: respondent_name,
      // respondent_phone: respondent_phone,
      // respondent_country: respondent_country,
      respondent_email: respondent_email,
      answers: formattedAnswers,
    };

    console.log(responsePayload);
    try {
      await submitPublicResponse(responsePayload);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (submitSuccess) {
      toast.success("Your response was saved successfully");
      // router.push("/");
      setSubmitSurveySuccess(true);
    }
    if (errorSubmitting) {
      toast.error("An error occurred while submitting your response");
    }
  }, [submitSuccess, errorSubmitting, router]);

  console.log(question);

  const navigatePage = (direction: any) => {
    setCurrentSection((prevIndex) => {
      if (direction === "next") {
        return prevIndex < OCRresponses.length - 1 ? prevIndex + 1 : prevIndex;
      } else {
        return prevIndex > 0 ? prevIndex - 1 : prevIndex;
      }
    });
  };

  return (
    <div className={`${""} flex flex-col gap-5 w-full lg:px-16 `}>
      {
        submitSurveySuccess && (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          <div className="bg-white p-6 rounded-lg flex flex-col  my-auto items-center justify-center shadow-md text-center max-w-md w-full">
            <div className="flex flex-col items-center">
              <FaCheckCircle className="text-green-500 text-6xl mb-4" />
              <h1 className="text-2xl font-semibold mb-2 text-gray-800">
                Thank You!
              </h1>
              <p className="text-gray-600 mb-4">
                Your response has been submitted successfully.
              </p>
              <button
                // onClick={handleRedirect}
                className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
              >
                Take survey again
              </button>
            </div>
          </div>
          </div>
        )
      }
      {
        !submitSurveySuccess && (
          <div>
      {question?.data && (
        <div
          className={`${question?.data?.theme} flex justify-center  items-center px-5 mx-auto gap-10 lg:w-[80%]`}
        >
          <form onSubmit={handleSubmitResponse}
            className={` flex flex-col overflow-y-auto max-h-screen custom-scrollbar`}
          >
            {
              question?.data?.logo_url && (
            <div className="bg-[#9D50BB] w-16 rounded my-5 text-white flex items-center flex-col ">
              <Image
                src={question?.data?.logo_url}
                alt=""
                className="w-full object-cover rounded bg-no-repeat h-16"
                width={"100"}
                height={"200"}
              />
            </div>
              )
            }
            {
              question?.data?.header_url && (
            <div className="bg-[#9D50BB] rounded-lg w-full my-4 text-white h-24 flex items-center flex-col ">
              <Image
                src={question?.data?.header_url}
                alt=""
                className="w-full object-cover bg-no-repeat h-24 rounded-lg"
                width={"100"}
                height={"200"}
              />
            </div>
              )
            }

            <div className="bg-white rounded-lg w-full my-4 flex gap-2 px-11 py-4 flex-col ">
              <h2
                className="text-[1.5rem] font-normal"
                style={{
                  fontSize: `${question?.data?.headerText?.size}px`,
                  fontFamily: `${question?.data?.headerText?.name}`,
                }}
              >
                {question?.data?.topic}
              </h2>
              <p
                style={{
                  fontSize: `${question?.data?.body_text?.size}px`,
                  fontFamily: `${question?.data?.body_text?.name}`,
                }}
              >
                {question?.data?.description}
              </p>
            </div>

            <div className="flex flex-col gap-2 w-full bg-white px-11 py-4 rounded-lg mb-4">
              {question?.data?.settings?.collect_email_addresses && (
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
              {question?.data?.settings?.collect_name_of_respondents && (
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

            {question?.data?.sections[currentSection]?.questions?.map(
              (item: any, index: number) => (
                <div key={index} className="mb-4">
                  {item.question_type === "multiple_choice" ? (
                    <MultiChoiceQuestion
                      key={index}
                      question={item.question}
                      questionType={item.questionType}
                      options={item.options}
                      index={index + 1}
                      onChange={(value: string) =>
                        handleOptionChange(index, value, item.question_type)
                      }
                      is_required={item.is_required}
                    />
                  ) : item.question_type === "comment" ||
                    item.question_type === "long_text" ? (
                      <CommentQuestion
                      key={index}
                      index={index + 1}
                      questionType={item.question_type}
                      response={textResponses[index] || ""} 
                      question={item.question}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value, item.question_type)
                      }
                      is_required={item.is_required}
                    />
                  ) : item.question_type === "star_rating" ? (
                    <StarRatingQuestion
                      key={index}
                      question={item.question}
                      maxRating={5}
                      questionType={item.question_type}
                    />
                  ) : null}
                </div>
              )
            )}
            <div className="flex flex-col gap-4 md:flex-row justify-between items-center">
              <div className="flex gap-2 items-center"></div>
              {question?.data?.sections?.length > 1 && (
                <div className="flex w-full md:w-auto md:justify-end items-center">
                  <PaginationBtn
                    currentSection={currentSection}
                    totalSections={question?.data?.sections?.length}
                    onNavigate={navigatePage}
                  />
                </div>
              )}
            </div>

            <div className=" rounded-md flex flex-col justify-center w-full md:w-[16rem] py-5 text-center">
              <button
                className="bg-gradient-to-r from-[#5b03b2] to-[#9d50bb] rounded-lg px-8 py-2 text-white text-[16px] font-medium leading-6 text-center font-inter justify-center"
                type="submit"
                // onClick={handleSubmitResponse}
              >
                {submitting ? "Submitting..." : "Submit"}
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
          </form>
        </div>
      )}
          </div>
        )
      }

    </div>
  );
};

export default PublicResponse;
