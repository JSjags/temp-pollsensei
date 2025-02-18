import { replaceAnswers, resetAnswers } from "@/redux/slices/answer.slice";
import { RootState } from "@/redux/store";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { pollsensei_new_logo } from "@/assets/images";
import PaginationBtn from "@/components/common/PaginationBtn";
import PreviewFile from "@/components/survey/PreviewFile";
import { toast } from "react-toastify";
import { useSubmitResponseMutation } from "@/services/survey.service";

const ValidateResponse = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const OCRresponses = useSelector((state: RootState) => state.answer as any);
  const userEmail = useSelector((state: RootState) => state.user.user?.email);
  const loggedInUserName = useSelector(
    (state: RootState) => state.user?.user?.name
  );

  const [currentSection, setCurrentSection] = useState(0);
  const [respondent_name, setRespondent_name] = useState<string>("");
  const [respondent_email, setRespondent_email] = useState<string>("");
  const [ocrRes, setOcrRes] = useState<any | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitResponse, { isLoading, isSuccess, isError, error }] =
    useSubmitResponseMutation();

  // useEffect(() => {
  //   if (OCRresponses) {
  //     setOcrRes({
  //       survey: OCRresponses.survey || [],
  //       extracted_answers: OCRresponses.extracted_answers || [],
  //       uploaded_files: OCRresponses.uploaded_files || [],
  //     });

  //     // Pre-fill answers with existing responses
  //     const existingAnswers: Record<string, any> = {};
  //     OCRresponses.extracted_answers.forEach((item: any) => {
  //       existingAnswers[item.question] = {
  //         selected_options: item?.selected_options || [],
  //         scale_value: item?.scale_value || "",
  //         drop_down_value: item?.drop_down_value || "",
  //         boolean_value:
  //           item?.boolean_value !== undefined ? item.boolean_value : null,
  //         text: item?.text || "",
  //         num: item?.num || null,
  //         media_url: item?.media_url || "",
  //       };
  //     });

  //     setAnswers(existingAnswers);
  //   }
  // }, [OCRresponses]);

  useEffect(() => {
    if (OCRresponses) {
      setOcrRes({
        survey: OCRresponses.survey || [],
        extracted_answers: OCRresponses.extracted_answers || [],
        uploaded_files: OCRresponses.uploaded_files || [],
      });

      // Pre-fill answers with existing responses
      const existingAnswers: Record<string, any> = {};
      OCRresponses.extracted_answers.forEach((item: any) => {
        existingAnswers[item.question] = {
          selected_options: item?.selected_options || [],
          scale_value: item?.scale_value || "",
          drop_down_value: Array.isArray(item?.drop_down_value)
            ? item.drop_down_value[0] || ""
            : item?.drop_down_value || "",
          boolean_value:
            item?.boolean_value !== undefined ? item.boolean_value : null,
          text: item?.text || "",
          num: item?.num || null,
          media_url: item?.media_url || "",
        };
      });

      setAnswers(existingAnswers);
    }
  }, [OCRresponses]);

  const handleAnswerChange = (key: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleMatrixAnswerChange = (
    questionKey: string,
    row: string,
    column: string,
    type: "checkbox" | "radio"
  ) => {
    setAnswers((prev) => {
      const matrixAnswers = prev[questionKey]?.matrix_answers || [];
      const newAnswer = { row, column };

      const updatedMatrixAnswers =
        type === "checkbox"
          ? [
              ...matrixAnswers.filter(
                (ans: any) => !(ans.row === row && ans.column === column)
              ),
              newAnswer,
            ]
          : [
              ...matrixAnswers.filter((ans: any) => ans.row !== row), // Remove existing row answer
              newAnswer,
            ];

      return {
        ...prev,
        [questionKey]: { matrix_answers: updatedMatrixAnswers },
      };
    });
  };

  const handleSubmitResponse = async () => {
    const formattedAnswers = OCRresponses.extracted_answers.map(
      (item: any) => ({
        question: item.question,
        question_type: item.question_type,
        ...answers[item.question],
      })
    );

    const responsePayload = {
      survey_id: params.id,
      respondent_name: !respondent_name ? "Not provided" : respondent_name,
      respondent_email: !respondent_email ? userEmail : respondent_email,
      answers: formattedAnswers,
    };

    try {
      await submitResponse(responsePayload).unwrap();
      toast.success("Submitted successfully");
    } catch (e) {
      toast.error("Error submitting data: " + e);
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

  return (
    <div
      className={`${
        (ocrRes as any)?.survey?.theme
      } flex flex-col gap-5 w-full px-5 lg:pl-16 relative`}
    >
      <div className="flex justify-between gap-10 w-full">
        <div className="lg:w-2/3 flex flex-col overflow-y-auto max-h-screen custom-scrollbar">
          {ocrRes?.survey?.logo_url && (
            <div className="bg-[#9D50BB] rounded-full w-1/3 my-5 text-white flex items-center flex-col">
              <Image
                src={ocrRes.survey.logo_url}
                alt=""
                width={100}
                height={200}
                className="w-full h-16 object-cover bg-no-repeat rounded-full"
              />
            </div>
          )}
          {ocrRes?.survey?.header_url && (
            <div className="bg-[#9D50BB] rounded-lg w-full my-4 text-white h-24 flex items-center flex-col">
              <Image
                src={(ocrRes as any)?.survey?.header_url}
                alt=""
                width={100}
                height={200}
                className="w-full object-cover bg-no-repeat h-24 rounded-lg"
              />
            </div>
          )}

          {/* <div className="bg-white rounded-lg w-full my-4 flex gap-2 px-11 py-4 flex-col">
            <h2 className="text-[1.5rem] font-normal">
              {ocrRes?.survey?.topic}
            </h2>
            <p>{ocrRes?.survey?.description}</p>
          </div> */}

          <div className="bg-white rounded-lg w-full my-4 flex gap-2 px-11 py-4 flex-col ">
            <h2
              className="text-[1.5rem] font-normal"
              style={{
                fontSize: `${(ocrRes as any)?.survey?.header_text?.size}px`,
                fontFamily: `${(ocrRes as any)?.survey?.header_text?.name}`,
              }}
            >
              {(ocrRes as any)?.survey?.topic}
            </h2>
            <p
              style={{
                fontSize: `${(ocrRes as any)?.survey?.body_text?.size}px`,
                fontFamily: `${(ocrRes as any)?.survey?.body_text?.name}`,
              }}
            >
              {(ocrRes as any)?.survey?.description}
            </p>
          </div>

          {/* Collect respondent name and email if required */}
          <div className="flex flex-col gap-2 w-full bg-white px-11 py-4 rounded-lg mb-4">
            {ocrRes?.survey?.settings?.collect_email_addresses && (
              <input
                type="text"
                placeholder="Full name"
                required
                className="border-b-2 rounded-b-md ring-0 shadow-sm active:border-none focus:border-none py-1 px-4 outline-none"
                value={respondent_name}
                onChange={(e) => setRespondent_name(e.target.value)}
              />
            )}
            {ocrRes?.survey?.settings?.collect_name_of_respondents && (
              <input
                type="email"
                placeholder="Email"
                required
                className="border-b-2 rounded-b-md ring-0 shadow-sm active:border-none focus:border-none py-1 px-4 outline-none"
                value={respondent_email}
                onChange={(e) => setRespondent_email(e.target.value)}
              />
            )}
          </div>

          {/* Render Questions */}
          {ocrRes?.extracted_answers?.map((item: any, index: number) => (
            <div key={index} className="mb-4 w-full">
              <p className="font-medium">{`${index + 1}. ${item.question}`}</p>

              {(() => {
                switch (item.question_type) {
                  case "checkbox":
                  case "multiple_choice":
                  case "single_choice":
                    return (
                      <div className=" flex-col mb-4 bg-[#FAFAFA] flex w-full p-3 gap-3 rounded">
                        {item.options?.map((option: any) => (
                          <label
                            key={option}
                            className="flex relative  cursor-pointer items-center"
                          >
                            <input
                              type="checkbox"
                              value={option}
                              checked={
                                answers[
                                  item.question
                                ]?.selected_options?.includes(option) || false
                              }
                              onChange={(e) => {
                                const updatedOptions = e.target.checked
                                  ? [
                                      ...answers[item.question]
                                        ?.selected_options,
                                      option,
                                    ]
                                  : answers[
                                      item.question
                                    ]?.selected_options.filter(
                                      (opt: any) => opt !== option
                                    );
                                handleAnswerChange(item.question, {
                                  selected_options: updatedOptions,
                                });
                              }}
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    );

                  // case "single_choice":
                  case "likert_scale":
                    return (
                      <div className="flex flex-col mb-4 bg-[#FAFAFA] w-full p-3 gap-3">
                        {item.options?.map((option: any) => (
                          <label key={option} className="flex items-center">
                            <input
                              type="radio"
                              name={item.question}
                              value={option}
                              checked={
                                answers[item.question]?.scale_value === option
                              }
                              onChange={(e) =>
                                handleAnswerChange(item.question, {
                                  scale_value: e.target.value,
                                })
                              }
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    );
                  // case "boolean":
                  // return (
                  //   <div className="flex flex-col gap-2">
                  //     {item.options?.map((option: any) => (
                  //       <label key={option} className="flex items-center">
                  //         <input
                  //           type="radio"
                  //           name={item.question}
                  //           value={option}
                  //           checked={answers[item.question]?.boolean_value === option}
                  //           onChange={(e) => handleAnswerChange(item.question, { boolean_value: e.target.value})}
                  //         />
                  //         <span>{option}</span>
                  //       </label>
                  //     ))}
                  //   </div>
                  // );
                  case "boolean":
                    return (
                      <div className=" flex-col mb-4 bg-[#FAFAFA] flex w-full p-3 gap-3 rounded">
                        {["Yes", "No"].map((option) => (
                          <label key={option} className="flex items-center">
                            <input
                              type="radio"
                              name={item.question}
                              value={option} // Option remains "Yes" or "No"
                              checked={
                                (answers[item.question]?.boolean_value ===
                                  true &&
                                  option === "Yes") ||
                                (answers[item.question]?.boolean_value ===
                                  false &&
                                  option === "No")
                              }
                              onChange={(e) =>
                                handleAnswerChange(item.question, {
                                  boolean_value:
                                    e.target.value === "Yes" ? true : false, // Store as true/false
                                })
                              }
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    );

                  // case "drop_down":
                  //   return (
                  //     <select
                  //       className="w-full p-2 border rounded"
                  //       value={answers[item.question]?.drop_down_value || ""}
                  //       onChange={(e) => handleAnswerChange(item.question, { drop_down_value: e.target.value })}
                  //     >
                  //       <option value="">Select an option</option>
                  //       {item.options?.map((option: any) => (
                  //         <option key={option} value={option}>
                  //           {option}
                  //         </option>
                  //       ))}
                  //     </select>
                  //   );

                  case "drop_down":
                    return (
                      <select
                        className="w-full p-2 border rounded"
                        value={answers[item.question]?.drop_down_value || ""}
                        onChange={(e) =>
                          handleAnswerChange(item.question, {
                            drop_down_value: e.target.value,
                          })
                        }
                      >
                        <option value="">Select an option</option>
                        {item.options?.map((option: any) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    );

                  case "long_text":
                  case "short_text":
                    return (
                      <div className="mb-4 bg-[#FAFAFA] flex items-center gap-3 p-3 rounded ">
                        <textarea
                          rows={4}
                          className="w-full p-2 border rounded"
                          value={answers[item.question]?.text || ""}
                          onChange={(e) =>
                            handleAnswerChange(item.question, {
                              text: e.target.value,
                            })
                          }
                        />
                      </div>
                    );

                  case "rating_scale":
                    return (
                      <div className="mb-4 bg-[#FAFAFA] flex flex-col w-full p-3 gap-3 rounded">
                        {item.options?.map((option: any, idx: number) => (
                          <label
                            key={idx}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="radio"
                              name={item.question}
                              value={option}
                              checked={
                                answers[item.question]?.scale_value === option
                              }
                              onChange={(e) =>
                                handleAnswerChange(item.question, {
                                  scale_value: e.target.value,
                                })
                              }
                              required={item.is_required}
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    );
                  case "star_rating":
                    return (
                      <div className="mb-4 bg-[#FAFAFA] flex flex-col w-full p-3 gap-3 rounded">
                        {item.options?.map((option: any, idx: number) => (
                          <label
                            key={idx}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="radio"
                              name={item.question}
                              value={option}
                              checked={
                                answers[item.question]?.scale_value === option
                              }
                              onChange={(e) =>
                                handleAnswerChange(item.question, {
                                  scale_value: e.target.value || "1 Star",
                                })
                              }
                              required={item.is_required}
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    );

                  // case "matrix_multiple_choice":
                  // case "matrix_checkbox":
                  //   return (
                  //     <table className="w-full border-collapse mb-4 bg-[#FAFAFA] flex flex-col p-3 gap-3 rounded">
                  //       <thead>
                  //         <tr>
                  //           <th></th>
                  //           {item.columns?.map((col: any) => (
                  //             <th key={col}>{col}</th>
                  //           ))}
                  //         </tr>
                  //       </thead>
                  //       <tbody>
                  //         {item.rows?.map((row: any) => (
                  //           <tr key={row}>
                  //             <td>{row}</td>
                  //             {item.columns?.map((col: any) => (
                  //               <td key={col}>
                  //                 <input
                  //                   type={item.question_type === "matrix_checkbox" ? "checkbox" : "radio"}
                  //                   name={item.question + row}
                  //                   checked={
                  //                     answers[item.question]?.matrix_answers?.some(
                  //                       (ans: any) => ans.row === row && ans.column === col
                  //                     ) || false
                  //                   }
                  //                   onChange={() => {
                  //                     setAnswers((prev) => {
                  //                       const matrixAnswers = prev[item.question]?.matrix_answers || [];
                  //                       const newAnswer = { row, column: col };

                  //                       const updatedMatrixAnswers =
                  //                         item.question_type === "matrix_checkbox"
                  //                           ? [
                  //                               ...matrixAnswers.filter(
                  //                                 (ans: any) => !(ans.row === row && ans.column === col)
                  //                               ),
                  //                               newAnswer,
                  //                             ]
                  //                           : [...matrixAnswers.filter((ans: any) => ans.row !== row), newAnswer];

                  //                       return {
                  //                         ...prev,
                  //                         [item.question]: { matrix_answers: updatedMatrixAnswers },
                  //                       };
                  //                     });
                  //                   }}
                  //                 />
                  //               </td>
                  //             ))}
                  //           </tr>
                  //         ))}
                  //       </tbody>
                  //     </table>
                  //   );

                  case "matrix_multiple_choice":
                  case "matrix_checkbox":
                    return (
                      <table className="w-full border-collapse mb-4 bg-[#FAFAFA] flex flex-col p-3 gap-3 rounded">
                        <thead>
                          <tr>
                            <th></th>
                            {item.columns?.map((col: any) => (
                              <th key={col}>{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {item.rows?.map((row: any) => (
                            <tr key={row}>
                              <td>{row}</td>
                              {item.columns?.map((col: any) => (
                                <td key={col}>
                                  <input
                                    type={
                                      item.question_type === "matrix_checkbox"
                                        ? "checkbox"
                                        : "radio"
                                    }
                                    name={item.question + row}
                                    checked={
                                      answers[
                                        item.question
                                      ]?.matrix_answers?.some(
                                        (ans: any) =>
                                          ans.row === row && ans.column === col
                                      ) || false
                                    }
                                    onChange={() =>
                                      handleMatrixAnswerChange(
                                        item.question,
                                        row,
                                        col,
                                        item.question_type === "matrix_checkbox"
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
                      <div className="mb-4 bg-[#FAFAFA] flex items-center w-full p-3 gap-3">
                        <input
                          type="range"
                          min={item.min}
                          max={item.max}
                          step={item.step}
                          value={
                            answers[item.question]?.scale_value || item.min
                          }
                          onChange={(e) =>
                            handleAnswerChange(item.question, {
                              scale_value: e.target.value,
                            })
                          }
                          required={item.is_required}
                        />
                      </div>
                    );

                  case "number":
                    return (
                      <div className="mb-4 bg-[#FAFAFA] flex items-center gap-3 p-3 rounded ">
                        <input
                          className="mb-4 bg-[#FAFAFA] flex flex-col w-full p-3 gap-3 rounded"
                          placeholder={`Enter a number between ${item?.min} and ${item?.max}`}
                          type="number"
                          min={item.min}
                          max={item.max}
                          value={answers[item.question]?.num || ""}
                          onChange={(e) =>
                            handleAnswerChange(item.question, {
                              num: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                    );

                  default:
                    return <p>Unsupported question type</p>;
                }
              })()}
            </div>
          ))}

          {/* <button className="bg-purple-600 text-white px-6 py-2 rounded" onClick={handleSubmitResponse}>
            {isLoading ? "Submitting..." : "Submit Response"}
          </button> */}
          <div className=" rounded-md flex  items-center w-full md:min-w-[16rem] py-5 text-center">
            <button
              className="bg-gradient-to-r from-[#5b03b2] to-[#9d50bb] rounded-lg px-8 py-2 text-white text-[16px] font-medium leading-6 text-center font-inter justify-center"
              // type="submit"
              onClick={() => {
                handleSubmitResponse();
              }}
            >
              {/* Submit Response */}
              {isLoading ? "Submitting..." : "Submit Response"}
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
          <PreviewFile data={(ocrRes as any)?.uploaded_files} />
        </div>
      </div>
    </div>
  );
};

export default ValidateResponse;
