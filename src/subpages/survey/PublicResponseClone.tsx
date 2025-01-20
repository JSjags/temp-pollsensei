import { pollsensei_new_logo, sparkly } from "@/assets/images";
import PaginationBtn from "@/components/common/PaginationBtn";
import StarRating from "@/components/survey/StarRating";
import ResponseFile from "@/components/ui/VoiceRecorder";
import VoiceRecorder from "@/components/ui/VoiceRecorder";
import { RootState } from "@/redux/store";
import {
  useGetPublicSurveyByIdQuery,
  useGetPublicSurveyByShortUrlQuery,
  useSubmitPublicResponseMutation,
} from "@/services/survey.service";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

interface Question {
  question: string;
  question_type: string;
  options?: string[];
  rows?: string[];
  columns?: string[];
  min?: number;
  max?: number;
  step?: number;
  is_required?: boolean;
}

const PublicResponse = () => {
  const questionText = useSelector(
    (state: RootState) => state?.survey?.question_text
  );
  const [answers, setAnswers] = useState<Record<string, any>>({});
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

  const [activeInput, setActiveInput] = useState<Record<string, "textarea" | "audio" | null>>({});


  const handleInputFocus = (question: string, inputType: "textarea" | "audio") => {
    setActiveInput((prev) => ({ ...prev, [question]: inputType }));
  };

  const handleInputBlur = (question: string) => {
    setActiveInput((prev) => ({ ...prev, [question]: null }));
  };

  const isTextareaDisabled = (question: string) => activeInput[question] === "audio";
  const isAudioDisabled = (question: string) =>
    activeInput[question] === "textarea" || !!answers[question]?.text;

  const handleAnswerChange = (key: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleMatrixAnswerChange = (
    key: string,
    row: string,
    column: string,
    type: "checkbox" | "radio"
  ) => {
    setAnswers((prev) => {
      const matrixAnswers = prev[key]?.matrix_answers || [];
      const newAnswer = { row, column };
      const updatedMatrixAnswers =
        type === "checkbox"
          ? [
              ...matrixAnswers.filter(
                (ans: any) => !(ans.row === row && ans.column === column)
              ),
              newAnswer,
            ]
          : [...matrixAnswers.filter((ans: any) => ans.row !== row), newAnswer];
      return { ...prev, [key]: { matrix_answers: updatedMatrixAnswers } };
    });
  };

  console.log(textResponses);
  console.log(selectedOptions);

  console.log(params.id);
  const question =
    typeof params?.id === "string" && params.id.startsWith("ps-")
      ? psId
      : psShortUrl;

  useEffect(() => {
    if (question?.data?.sections) {
      setSelectedOptions(new Array(question.data.sections.length).fill(null));
      setTextResponses(new Array(question.data.sections.length).fill(""));
    }
  }, [question]);

  const handleSubmitResponse = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const formattedAnswers = question?.data?.sections[
      currentSection
    ]?.questions?.map((question: any) => ({
      question: question.question,
      question_type: question.question_type,
      ...answers[question.question],
    }));

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
      await submitPublicResponse(responsePayload).unwrap();
      toast.success("Your response was saved successfully");
      setSubmitSurveySuccess(true);
    } catch (e) {
      console.log(e);
      toast.error("An error occurred while submitting your response");
    }
  };

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
      {submitSurveySuccess && (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          <div className="bg-white p-6 rounded-lg flex flex-col  my-auto items-center justify-center shadow-md text-center max-w-md w-full">
            <div className="flex flex-col items-center">
              <FaCheckCircle className="text-[#9D50BB] text-6xl mb-4" />
              <h1 className="text-2xl font-semibold mb-2 text-gray-800">
                Thank You!
              </h1>
              <p className="text-gray-600 mb-4">
                Your response has been submitted successfully.
              </p>
              <div className="flex justify-between items-center gap-4">
                <Link
                  href="/dashboard"
                  className="hover:bg-[#9D50BB] hover:text-white transition py-2 px-4 rounded-md"
                >
                  Home
                </Link>
                <button
                  onClick={() => {
                    setSubmitSurveySuccess((prev) => !prev);
                  }}
                  className="px-6 py-2 bg- hover:text-white rounded-md hover:bg-[#9D50BB] transition"
                >
                  Take survey again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {!submitSurveySuccess && (
        <div>
          {question?.data && (
            <div
              className={`${question?.data?.theme} flex justify-center  items-center px-5 mx-auto gap-10 lg:w-[80%]`}
            >
              <form
                onSubmit={handleSubmitResponse}
                className={` flex flex-col overflow-y-auto max-h-screen custom-scrollbar w-full`}
              >
                {question?.data?.logo_url && (
                  <div className="bg-[#9D50BB] w-16 rounded my-5 text-white flex items-center flex-col ">
                    <Image
                      src={question?.data?.logo_url}
                      alt=""
                      className="w-full object-cover rounded bg-no-repeat h-16"
                      width={"100"}
                      height={"200"}
                    />
                  </div>
                )}
                {question?.data?.header_url && (
                  <div className="bg-[#9D50BB] rounded-lg w-full my-4 text-white h-24 flex items-center flex-col ">
                    <Image
                      src={question?.data?.header_url}
                      alt=""
                      className="w-full object-cover bg-no-repeat h-24 rounded-lg"
                      width={"100"}
                      height={"200"}
                    />
                  </div>
                )}

                <div className="bg-white rounded-lg w-full my-4 flex gap-2 px-11 py-4 flex-col ">
                  <h2
                    className="text-[1.5rem] font-normal"
                    style={{
                      fontSize: `${question?.data?.header_text?.size}px`,
                      fontFamily: `${question?.data?.header_text?.name}`,
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

                <div
                  className="flex flex-col gap-2 w-full bg-white px-11 py-4 rounded-lg mb-4"
                  style={{
                    // fontSize: `${question?.data?.body_text?.size}px`,
                    fontFamily: `${question?.data?.body_text?.name}`,
                  }}
                >
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
                  (quest: any, index: number) => (
                    <div
                      key={index}
                      className="space-y-2 py-4"
                      style={{
                        fontFamily: `${question?.data?.question_text?.name}`,
                        fontSize: `${question?.data?.question_text?.size}px`,
                      }}
                    >
                      <p className="font-medium">
                        {`${index + 1}. ${quest.question}`}{" "}
                        {quest.is_required && (
                          <sup className="text-red-700 font-extrabold text-sm">
                            *
                          </sup>
                        )}
                      </p>
                      {(() => {
                        switch (quest.question_type) {
                          case "checkbox":
                            return (
                              <div className="mb-4 bg-[#FAFAFA] flex flex-col w-full p-3 gap-3 rounded">
                                {quest.options?.map((option: any) => (
                                  <label
                                    key={option}
                                    className="flex items-center space-x-2"
                                  >
                                    <input
                                      type="checkbox"
                                      value={option}
                                      onChange={(e) =>
                                        handleAnswerChange(quest.question, {
                                          selected_options: [
                                            ...(answers[quest.question]
                                              ?.selected_options || []),
                                            e.target.checked ? option : null,
                                          ].filter(Boolean),
                                        })
                                      }
                                    />
                                    <span>{option}</span>
                                  </label>
                                ))}
                              </div>
                            );
                          case "likert_scale":
                            return (
                              <div className="space-x-4 mb-4 bg-[#FAFAFA] flex flex-col w-full p-3 gap-3 rounded">
                                {quest.options?.map(
                                  (option: any, idx: number) => (
                                    <label
                                      key={idx}
                                      className="flex items-center space-x-2"
                                    >
                                      <input
                                        type="radio"
                                        name={quest.question}
                                        value={option}
                                        // value={idx + 1}
                                        onChange={(e) =>
                                          handleAnswerChange(
                                            quest.question,
                                            { scale_value: e.target.value }
                                            // { scale_value: idx + 1 }
                                          )
                                        }
                                        required={quest.is_required}
                                      />
                                      <span>{option}</span>
                                    </label>
                                  )
                                )}
                              </div>
                            );
                          case "multiple_choice":
                            return (
                              <div className="mb-4 bg-[#FAFAFA] flex flex-col w-full p-3 gap-3 rounded">
                                {quest.options?.map((option: any) => (
                                  <label
                                    key={option}
                                    className="flex items-center space-x-2"
                                  >
                                    <input
                                      type="checkbox"
                                      value={option}
                                      onChange={(e) =>
                                        handleAnswerChange(quest.question, {
                                          selected_options: [
                                            ...(answers[quest.question]
                                              ?.selected_options || []),
                                            e.target.checked ? option : null,
                                          ].filter(Boolean),
                                        })
                                      }
                                      // required={quest.is_required}
                                    />
                                    <span>{option}</span>
                                  </label>
                                ))}
                              </div>
                            );
                          case "single_choice":
                            return (
                              <div className="mb-4 bg-[#FAFAFA] flex flex-col w-full p-3 gap-3 rounded">
                                {quest.options?.map((option: any) => (
                                  <label
                                    key={option}
                                    className="flex items-center space-x-2"
                                  >
                                    <input
                                      type="radio"
                                      name={quest.question}
                                      value={option}
                                      className="cursor-pointer"
                                      onChange={(e) =>
                                        handleAnswerChange(quest.question, {
                                          selected_options: [e.target.value],
                                        })
                                      }
                                    />
                                    <span>{option}</span>
                                  </label>
                                ))}
                              </div>
                            );
                          case "drop_down":
                            return (
                              <select
                                className="mb-4 bg-[#FAFAFA] flex flex-col w-full p-3 gap-3 rounded"
                                onChange={(e) =>
                                  handleAnswerChange(quest.question, {
                                    drop_down_value: e.target.value,
                                  })
                                }
                              >
                                <option value="">Select an option</option>
                                {quest.options?.map((option: any) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                            );
                          case "boolean":
                            return (
                              <div className="mb-4 bg-[#FAFAFA] flex flex-col w-full p-3 gap-3 rounded">
                                <label>
                                  <input
                                    type="radio"
                                    name={quest.question}
                                    value="true"
                                    onChange={() =>
                                      handleAnswerChange(quest.question, {
                                        boolean_value: true,
                                      })
                                    }
                                    required={quest.is_required}
                                  />
                                  Yes
                                </label>
                                <label>
                                  <input
                                    type="radio"
                                    name={quest.question}
                                    value="false"
                                    onChange={() =>
                                      handleAnswerChange(quest.question, {
                                        boolean_value: false,
                                      })
                                    }
                                    required={quest.is_required}
                                  />
                                  No
                                </label>
                              </div>
                            );
                          case "long_text":
                            return (
                              <div className="flex flex-col">
                                <textarea
                                  rows={4}
                                  className="w-full border  mb-4 bg-[#FAFAFA] flex flex-col p-3 gap-3 rounded"
                                  // onFocus={handleTextareaFocus}
                                  // onBlur={resetActiveInput}
                                  // disabled={activeInput === "audio"}
                                  onFocus={() => handleInputFocus(quest.question, "textarea")}
                                  onBlur={() => handleInputBlur(quest.question)}
                                  readOnly={isTextareaDisabled(quest.question)}
                                  value={answers[quest.question]?.text || ""}
                                  onChange={(e) =>
                                    handleAnswerChange(quest.question, {
                                      text: e.target.value,
                                    })
                                  }
                                />
                                {
                                  quest.can_accept_media &&   <ResponseFile
                                  question={quest.question}
                                  handleAnswerChange={handleAnswerChange}
                                  selectedValue={
                                    answers[quest.question]?.media_url || ""
                                  }
                                  required={quest.is_required}
                                  // onFocus={handleAudioFocus}
                                  // onBlur={resetActiveInput} 
                                  // isDisabled={activeInput === "textarea"} 
                                  onFocus={() => handleInputFocus(quest.question, "audio")}
                                  onBlur={() => handleInputBlur(quest.question)}
                                  isDisabled={isAudioDisabled(quest.question)}
                                />
                                }
                            
                            </div>
                            );
                          case "short_text":
                            return (
                              <div className="flex flex-col">
                                <input
                                  placeholder="Your response here..."
                                  className="w-full border  mb-4 bg-[#FAFAFA] flex flex-col p-3 gap-3 rounded"
                                  onChange={(e) =>
                                    handleAnswerChange(quest.question, {
                                      text: e.target.value,
                                    })
                                  }
                                />
                            </div>
                            );
                          case "star_rating":
                            return (
                              <StarRating
                                question={quest.question}
                                options={quest.options}
                                handleAnswerChange={handleAnswerChange}
                                selectedValue={
                                  answers[quest.question]?.scale_value || ""
                                }
                                required={quest.is_required}
                              />
                            );

                          case "rating_scale":
                            return (
                              <div className="mb-4 bg-[#FAFAFA] flex flex-col w-full p-3 gap-3 rounded">
                                {quest.options?.map(
                                  (option: any, idx: number) => (
                                    <label
                                      key={idx}
                                      className="flex items-center space-x-2"
                                    >
                                      <input
                                        type="radio"
                                        name={quest.question}
                                        value={option}
                                        // value={idx + 1}
                                        onChange={(e) =>
                                          handleAnswerChange(
                                            quest.question,
                                            { scale_value: e.target.value }
                                            // { scale_value: idx + 1 }
                                          )
                                        }
                                        required={quest.is_required}
                                      />
                                      <span>{option}</span>
                                    </label>
                                  )
                                )}
                              </div>
                            );
                          case "matrix_multiple_choice":
                          case "matrix_checkbox":
                            return (
                              <table className="w-full border-collapse mb-4 bg-[#FAFAFA] flex flex-col p-3 gap-3 rounded">
                                <thead>
                                  <tr>
                                    <th></th>
                                    {quest.columns?.map((col: any) => (
                                      <th key={col}>{col}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {quest.rows?.map((row: any) => (
                                    <tr key={row}>
                                      <td>{row}</td>
                                      {quest.columns?.map((col: any) => (
                                        <td key={col}>
                                          <input
                                            type={
                                              quest.question_type ===
                                              "matrix_checkbox"
                                                ? "checkbox"
                                                : "radio"
                                            }
                                            name={quest.question + row}
                                            onChange={() =>
                                              handleMatrixAnswerChange(
                                                quest.question,
                                                row,
                                                col,
                                                quest.question_type ===
                                                  "matrix_checkbox"
                                                  ? "checkbox"
                                                  : "radio"
                                              )
                                            }
                                          />
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            );
                          case "slider":
                            return (
                              <input
                                type="range"
                                min={quest.min}
                                max={quest.max}
                                step={quest.step}
                                onChange={(e) =>
                                  handleAnswerChange(quest.question, {
                                    scale_value: e.target.value,
                                  })
                                }
                                required={quest.is_required}
                              />
                            );
                          case "number":
                            return (
                              <input
                                className="mb-4 bg-[#FAFAFA] flex flex-col w-full p-3 gap-3 rounded"
                                placeholder={`Enter a number between ${quest?.min} and ${quest?.max}`}
                                type="number"
                                min={quest.min}
                                max={quest.max}
                                onChange={(e) =>
                                  handleAnswerChange(quest.question, {
                                    num: Number(e.target.value),
                                  })
                                }
                              />
                            );
                          case "media":
                            return (
                              <div className="flex flex-col">
                                <ResponseFile
                                  question={quest.question}
                                  handleAnswerChange={handleAnswerChange}
                                  selectedValue={
                                    answers[quest.question]?.media_url || ""
                                  }
                                  required={quest.is_required}
                                />
                              </div>
                            );
                          default:
                            return <p>Unsupported question type</p>;
                        }
                      })()}
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
      )}
    </div>
  );
};

export default PublicResponse;
