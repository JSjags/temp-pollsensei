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
import { motion } from "framer-motion";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { Progress } from "@/components/ui/progress";
import { IoArrowBack } from "react-icons/io5";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { DialogContent } from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";

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
  const [progress, setProgress] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

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

  // Calculate progress
  useEffect(() => {
    if (ocrRes?.extracted_answers) {
      const totalQuestions = ocrRes.extracted_answers.length;
      const answeredQuestions = Object.keys(answers).length;
      setProgress((answeredQuestions / totalQuestions) * 100);
    }
  }, [answers, ocrRes]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const questionVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const handleAnswerChange = (key: string, value: any) => {
    // For single choice questions, ensure selected_options is always an array with one item
    if (
      value.selected_options &&
      ["single_choice"].includes(
        ocrRes?.extracted_answers.find((q: any) => q.question === key)
          ?.question_type
      )
    ) {
      value.selected_options = [value.selected_options].flat();
    }

    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleMatrixAnswerChange = (
    questionKey: string,
    row: string,
    column: string,
    type: "checkbox" | "radio"
  ) => {
    setAnswers((prev) => {
      const currentAnswers = prev[questionKey]?.matrix_answers || [];
      let updatedAnswers;

      if (type === "checkbox") {
        // For matrix_checkbox, toggle the selection
        const existingAnswer = currentAnswers.find(
          (ans: any) => ans.row === row && ans.column === column
        );
        if (existingAnswer) {
          updatedAnswers = currentAnswers.filter(
            (ans: any) => !(ans.row === row && ans.column === column)
          );
        } else {
          updatedAnswers = [...currentAnswers, { row, column }];
        }
      } else {
        // For matrix_multiple_choice, replace existing row answer
        updatedAnswers = [
          ...currentAnswers.filter((ans: any) => ans.row !== row),
          { row, column },
        ];
      }

      return {
        ...prev,
        [questionKey]: { matrix_answers: updatedAnswers },
      };
    });
  };

  const validateResponses = () => {
    const errors: string[] = [];

    // Validate respondent info
    if (!respondent_name && !ocrRes?.respondent_name) {
      errors.push("Please provide respondent name");
    }

    if (!respondent_email && !userEmail && !ocrRes?.respondent_email) {
      errors.push("Please provide respondent email");
    } else if (
      respondent_email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(respondent_email)
    ) {
      errors.push("Please provide a valid email address");
    }

    // Validate each question
    ocrRes?.extracted_answers?.forEach((item: any, index: number) => {
      const answer = answers[item.question];
      const questionNum = index + 1;

      if (item.is_required) {
        switch (item.question_type) {
          case "checkbox":
          case "multiple_choice":
          case "single_choice":
            if (!answer?.selected_options?.length) {
              errors.push(
                `Question ${questionNum}: Please select at least one option for "${item.question}"`
              );
            }
            break;

          case "likert_scale":
          case "rating_scale":
          case "star_rating":
          case "slider":
            if (!answer?.scale_value && answer?.scale_value !== 0) {
              errors.push(
                `Question ${questionNum}: Please select a rating for "${item.question}"`
              );
            }
            break;

          case "drop_down":
            if (!answer?.drop_down_value) {
              errors.push(
                `Question ${questionNum}: Please select an option from the dropdown for "${item.question}"`
              );
            }
            break;

          case "boolean":
            if (
              answer?.boolean_value === null ||
              answer?.boolean_value === undefined
            ) {
              errors.push(
                `Question ${questionNum}: Please select Yes or No for "${item.question}"`
              );
            }
            break;

          case "long_text":
          case "short_text":
            if (!answer?.text?.trim()) {
              errors.push(
                `Question ${questionNum}: Please provide a text response for "${item.question}"`
              );
            }
            break;

          case "number":
            if (answer?.num === null || answer?.num === undefined) {
              errors.push(
                `Question ${questionNum}: Please enter a number for "${item.question}"`
              );
            } else {
              if (item.min !== undefined && answer.num < item.min) {
                errors.push(
                  `Question ${questionNum}: Number must be at least ${item.min} for "${item.question}"`
                );
              }
              if (item.max !== undefined && answer.num > item.max) {
                errors.push(
                  `Question ${questionNum}: Number must not exceed ${item.max} for "${item.question}"`
                );
              }
            }
            break;

          case "matrix_multiple_choice":
            // Check if each row has exactly one selection
            const rowsWithAnswers =
              answer?.matrix_answers?.map((ans: any) => ans.row) || [];
            const missingRows = item.rows?.filter(
              (row: string) => !rowsWithAnswers.includes(row)
            );
            if (missingRows?.length) {
              errors.push(
                `Question ${questionNum}: Please select an option for each row in "${
                  item.question
                }". Missing rows: ${missingRows.join(", ")}`
              );
            }
            break;

          case "matrix_checkbox":
            // For matrix checkbox, at least one selection is required
            if (!answer?.matrix_answers?.length) {
              errors.push(
                `Question ${questionNum}: Please make at least one selection in the matrix for "${item.question}"`
              );
            }
            break;

          case "media":
            if (!answer?.media_url) {
              errors.push(
                `Question ${questionNum}: Please upload media for "${item.question}"`
              );
            }
            break;
        }
      }
    });

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const validatePayloadStructure = (formattedAnswers: any[]) => {
    const errors: string[] = [];

    formattedAnswers.forEach((answer, index) => {
      const questionNum = index + 1;
      const questionType = answer.question_type;

      // Check required fields for all answers
      if (!answer.question || !answer.question_type) {
        errors.push(`Question ${questionNum}: Missing required fields`);
        return;
      }

      // Validate answer structure based on question type
      try {
        switch (questionType) {
          case "checkbox":
          case "multiple_choice":
          case "single_choice":
            if (!Array.isArray(answer.selected_options)) {
              errors.push(
                `Question ${questionNum}: Selected options must be an array`
              );
            }
            break;

          case "likert_scale":
          case "rating_scale":
          case "star_rating":
          case "slider":
            if (answer.scale_value === undefined || answer.scale_value === "") {
              errors.push(`Question ${questionNum}: Rating value is required`);
            }
            break;

          case "drop_down":
            if (!answer.drop_down_value && answer.drop_down_value !== "") {
              errors.push(
                `Question ${questionNum}: Dropdown value is required`
              );
            }
            break;

          case "boolean":
            if (answer.boolean_value === undefined) {
              errors.push(`Question ${questionNum}: Boolean value is required`);
            }
            break;

          case "long_text":
          case "short_text":
            if (!answer.hasOwnProperty("text")) {
              errors.push(`Question ${questionNum}: Text field is required`);
            }
            break;

          case "number":
            if (typeof answer.num !== "number") {
              errors.push(
                `Question ${questionNum}: Number value must be a number`
              );
            }
            break;

          case "matrix_multiple_choice":
          case "matrix_checkbox":
            if (!Array.isArray(answer.matrix_answers)) {
              errors.push(
                `Question ${questionNum}: Matrix answers must be an array`
              );
            } else {
              // Validate each matrix answer has required fields
              answer.matrix_answers.forEach(
                (matrixAnswer: any, mIndex: number) => {
                  if (!matrixAnswer.row || !matrixAnswer.column) {
                    errors.push(
                      `Question ${questionNum}: Matrix answer ${
                        mIndex + 1
                      } is missing row or column`
                    );
                  }
                }
              );
            }
            break;

          case "media":
            if (!answer.hasOwnProperty("media_url")) {
              errors.push(`Question ${questionNum}: Media URL is required`);
            }
            break;

          default:
            errors.push(
              `Question ${questionNum}: Unknown question type "${questionType}"`
            );
        }
      } catch (error) {
        errors.push(`Question ${questionNum}: Invalid data structure`);
      }
    });

    return errors;
  };

  const handleSubmitResponse = async () => {
    if (!validateResponses()) {
      validationErrors.forEach((error) => toast.error(error));
      return;
    }

    const formattedAnswers = OCRresponses.extracted_answers.map((item: any) => {
      const rawAnswer = answers[item.question];
      const baseAnswer = {
        question: item.question,
        question_type: item.question_type,
      };

      // Handle case where answer might be a direct value
      const answer =
        typeof rawAnswer === "object" ? rawAnswer : { value: rawAnswer };

      // Format answer based on question type
      switch (item.question_type) {
        case "checkbox":
        case "multiple_choice":
        case "single_choice":
          return {
            ...baseAnswer,
            selected_options: Array.isArray(answer)
              ? answer
              : Array.isArray(answer.selected_options)
              ? answer.selected_options
              : [],
          };

        case "likert_scale":
        case "rating_scale":
        case "star_rating":
        case "slider":
          return {
            ...baseAnswer,
            scale_value:
              typeof answer === "string" || typeof answer === "number"
                ? answer
                : answer.scale_value || "",
          };

        case "drop_down":
          return {
            ...baseAnswer,
            drop_down_value:
              typeof answer === "string"
                ? answer
                : answer.drop_down_value || "",
          };

        case "boolean":
          return {
            ...baseAnswer,
            boolean_value:
              typeof answer === "boolean" ? answer : answer.boolean_value,
          };

        case "long_text":
        case "short_text":
          return {
            ...baseAnswer,
            text: typeof answer === "string" ? answer : answer.text || "",
          };

        case "number":
          return {
            ...baseAnswer,
            num:
              typeof answer === "number"
                ? answer
                : typeof answer.num === "number"
                ? answer.num
                : typeof answer.value === "number"
                ? answer.value
                : parseFloat(answer.num) || 0,
          };

        case "matrix_multiple_choice":
        case "matrix_checkbox":
          return {
            ...baseAnswer,
            matrix_answers: Array.isArray(answer)
              ? answer
              : Array.isArray(answer.matrix_answers)
              ? answer.matrix_answers
              : [],
          };

        case "media":
          return {
            ...baseAnswer,
            media_url:
              typeof answer === "string" ? answer : answer.media_url || "",
          };

        default:
          return baseAnswer;
      }
    });

    // Validate payload structure
    const structureErrors = validatePayloadStructure(formattedAnswers);
    if (structureErrors.length > 0) {
      structureErrors.forEach((error) => toast.error(error));
      return;
    }

    const responsePayload = {
      survey_id: params.id,
      respondent_name: respondent_name || "Not provided",
      respondent_email: respondent_email || userEmail,
      answers: formattedAnswers,
    };

    try {
      await submitResponse(responsePayload).unwrap();
    } catch (e) {
      toast.error("Error submitting response");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      router.push("/surveys/survey-list");
      dispatch(resetAnswers());
      setShowConfirmation(true);
    }
    if (isError || error) {
      setShowConfirmation(true);
    }
  }, [isSuccess, isError, error, router]);

  const handleBack = () => {
    router.push(`/surveys/${params.id}/survey-response-upload`);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`${ocrRes?.survey?.theme} min-h-screen bg-gray-50`}
    >
      {/* Header Section */}
      <div className="sticky top-0 z-10 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 
                       text-gray-700 transition-all duration-200 group"
          >
            <IoArrowBack className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to responses</span>
          </motion.button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
        {/* Main Content */}
        <div className="flex-1">
          {/* Survey Description Card */}
          <motion.div
            variants={questionVariants}
            className="bg-white rounded-lg shadow-sm p-6 mb-8"
          >
            <h2
              className={cn(
                "text-2xl font-semibold mb-4",
                `font-${ocrRes?.survey?.header_text?.name
                  ?.split(" ")
                  ?.join("-")
                  ?.toLowerCase()}`
              )}
              style={{
                fontSize: `${ocrRes?.survey?.header_text?.size}px`,
              }}
            >
              {ocrRes?.survey?.topic}
            </h2>
            <p
              className={cn(
                "text-gray-600",
                `font-${ocrRes?.survey?.body_text?.name
                  ?.split(" ")
                  ?.join("-")
                  ?.toLowerCase()}`
              )}
              style={{
                fontSize: `${ocrRes?.survey?.body_text?.size}px`,
              }}
            >
              {ocrRes?.survey?.description}
            </p>
          </motion.div>

          {/* Respondent Info */}
          <motion.div
            variants={questionVariants}
            className="bg-white rounded-lg shadow-sm p-6 mb-8"
          >
            <h3 className="text-lg font-medium mb-4">Respondent Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter respondent's name"
                  className="w-full p-2 border-0 border-b border-gray-300 focus:border-b-2 focus:border-purple-500 focus:outline-none transition-all"
                  value={ocrRes?.respondent_name || respondent_name}
                  onChange={(e) => setRespondent_name(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter respondent's email"
                  className="w-full p-2 border-0 border-b border-gray-300 focus:border-b-2 focus:border-purple-500 focus:outline-none transition-all"
                  value={ocrRes?.respondent_email || respondent_email}
                  onChange={(e) => setRespondent_email(e.target.value)}
                />
              </div>
            </div>
          </motion.div>

          {console.log(ocrRes?.extracted_answers)}

          {/* Questions */}
          {ocrRes?.extracted_answers?.map((item: any, index: number) => (
            <motion.div
              key={index}
              variants={questionVariants}
              className="bg-white rounded-lg shadow-sm p-6 mb-6"
            >
              <div className="flex items-start gap-4 mb-4">
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  Question {index + 1}
                </span>
                <h3 className="text-lg font-medium flex-1">{item.question}</h3>
              </div>

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

                  case "boolean":
                    return (
                      <div className=" flex-col mb-4 bg-[#FAFAFA] flex w-full p-3 gap-3 rounded">
                        {["Yes", "No"].map((option) => (
                          <label key={option} className="flex items-center">
                            <input
                              type="radio"
                              name={item.question}
                              value={option}
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
                                    e.target.value === "Yes" ? true : false,
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
                    const generateSmartLabels = (min: number, max: number) => {
                      const range = (max ?? 10) - (min ?? 0);
                      let step;

                      if (range <= 10) {
                        step = 1;
                      } else if (range <= 100) {
                        step = Math.ceil(range / 5) * 5; // Round to nearest 5
                      } else if (range <= 1000) {
                        step = Math.ceil(range / 5) * 50; // Round to nearest 50
                      } else if (range <= 10000) {
                        step = Math.ceil(range / 5) * 500; // Round to nearest 500
                      } else {
                        step = Math.ceil(range / 5) * 5000; // Round to nearest 5000
                      }

                      const labels = [];
                      // Always include min
                      labels.push(min ?? 0);

                      // Add intermediate points
                      for (
                        let i = (min ?? 0) + step;
                        i < (max ?? 10);
                        i += step
                      ) {
                        labels.push(Math.round(i)); // Round to ensure clean numbers
                      }

                      // Add max if not already included
                      if (labels[labels.length - 1] !== (max ?? 10)) {
                        labels.push(max ?? 10);
                      }

                      return labels;
                    };

                    const sliderValue =
                      answers[item.question]?.scale_value || item.min || 0;
                    const sliderLabels = generateSmartLabels(
                      item.min || 0,
                      item.max || 10
                    );

                    return (
                      <div className="mb-4 bg-[#FAFAFA] flex flex-col w-full p-3 gap-3">
                        <Slider
                          value={[Number(sliderValue)]}
                          max={item.max || 10}
                          min={item.min || 0}
                          step={1}
                          onValueChange={(newValue) =>
                            handleAnswerChange(item.question, {
                              scale_value: newValue[0],
                            })
                          }
                          className="w-full"
                        />
                        <div className="w-full mt-4 flex justify-between text-sm text-gray-600">
                          {sliderLabels.map((label, i) => (
                            <span key={i} className="text-center">
                              {label.toLocaleString("en-US")}
                            </span>
                          ))}
                        </div>
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
            </motion.div>
          ))}

          {/* Submit Button */}
          <motion.div
            variants={questionVariants}
            className="sticky bottom-8 flex justify-center"
          >
            <button
              className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-8 py-3 rounded-lg
                        shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2
                        disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmitResponse}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Submit Response</span>
                  <BsArrowRight />
                </>
              )}
            </button>
          </motion.div>
        </div>

        {/* Preview Panel */}
        <div className="hidden lg:block w-1/3 sticky top-24 h-[calc(100vh-6rem)]">
          <motion.div
            variants={questionVariants}
            className="bg-white rounded-lg shadow-sm h-full overflow-hidden"
          >
            <PreviewFile data={ocrRes?.uploaded_files} />
          </motion.div>
        </div>
      </div>

      {/* Success/Error Modal */}
      <Dialog
        open={showConfirmation}
        onOpenChange={() => {
          if (isSuccess) {
            router.push(`/surveys/${params.id}/survey-response-upload`);
            dispatch(resetAnswers());
          }
          if (isError) {
            setShowConfirmation(false);
          }
        }}
      >
        <DialogContent
          className="sm:max-w-md z-[100000]"
          overlayClassName="z-[100000]"
        >
          <div className="flex flex-col items-center">
            {isSuccess ? (
              <FiCheckCircle className="text-green-500 text-4xl mb-4" />
            ) : (
              <FiAlertCircle className="text-red-500 text-4xl mb-4" />
            )}
            <h3 className="text-xl font-semibold mb-2">
              {isSuccess ? "Success!" : "Error"}
            </h3>
            <p className="text-center text-gray-600">
              {isSuccess
                ? "Your response was submitted successfully."
                : "An error occurred while submitting your response."}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ValidateResponse;
