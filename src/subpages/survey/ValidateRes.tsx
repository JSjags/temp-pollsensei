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
import {
  useGetPublicSurveyByShortUrlQuery,
  useSubmitResponseMutation,
} from "@/services/survey.service";
import { motion } from "framer-motion";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { Progress } from "@/components/ui/progress";
import { IoArrowBack } from "react-icons/io5";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { DialogContent } from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";
import { Spinner } from "@/components/loaders/page-loaders/AnalysisPageLoader";
import { useQuery } from "@tanstack/react-query";
import { getSurveySettings } from "@/services/survey";
import LikertScaleQuestion from "@/components/survey/LikertScaleQuestion";
import { Input } from "@/components/ui/shadcn-input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/shadcn-textarea";
import { Checkbox } from "@/components/ui/shadcn-checkbox";
import { Switch } from "@/components/ui/switch";
import PublicResponseFile from "@/components/ui/PublicVoiceRecorder";
import ResponseFile from "@/components/ui/VoiceRecorder";
import StarRating from "@/components/survey/StarRating";

const ValidateResponse = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const OCRresponses = useSelector((state: RootState) => state.answer as any);
  const userEmail = useSelector((state: RootState) => state.user.user?.email);
  const loggedInUserName = useSelector(
    (state: RootState) => state.user?.user?.name
  );

  const [respondent_name, setRespondent_name] = useState<string>("");
  const [respondent_email, setRespondent_email] = useState<string>("");
  const [ocrRes, setOcrRes] = useState<any | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitResponse, { isLoading, isSuccess, isError, error }] =
    useSubmitResponseMutation();
  const [progress, setProgress] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showAudio, setShowAudio] = useState<Record<string, boolean>>({});

  const {
    data: surveySettings,
    isLoading: isSurveySettingsLoading,
    isSuccess: isSurveySettingsSuccess,
    isError: isSurveySettingsError,
    refetch: refetchSettings,
    error: surveyError,
  } = useQuery<{
    regional_availability: {
      status: boolean;
      regions: string[];
    };
    survey_id: {
      _id: string;
      topic: string;
    };
    _id: string;
    language: string;
    collect_email_addresses: boolean;
    collect_name_of_respondents: boolean;
    allow_survey_edit: boolean;
    receive_email_notification: boolean;
    response_threshold: number;
    voice_response_duration_in_seconds: number;
  }>({
    queryKey: ["survey-settings", params.id],
    queryFn: () => getSurveySettings({ surveyId: params?.id as string }),
  });

  // Utility function to extract number from string
  const extractNumberFromString = (value: any): number | null => {
    if (value === null || value === undefined) return null;

    // If it's already a number, return it
    if (typeof value === "number") return value;

    // If it's an array, take the first element
    if (Array.isArray(value)) {
      value = value[0];
    }

    // If it's a string, extract the number
    if (typeof value === "string") {
      // Remove all non-numeric characters except decimal points and negative signs
      const numericString = value.replace(/[^0-9.-]/g, "");
      const extractedNumber = parseFloat(numericString);

      // Return the number if it's valid, otherwise null
      return isNaN(extractedNumber) ? null : extractedNumber;
    }

    return null;
  };

  // Utility function to convert extracted matrix answers format to expected format
  const convertMatrixAnswersFormat = (matrixAnswers: any): any[] => {
    if (!matrixAnswers || typeof matrixAnswers !== "object") return [];

    const convertedAnswers: any[] = [];

    // Handle the format where matrix_answers is an object with column names as keys
    // and arrays of row names as values
    Object.keys(matrixAnswers).forEach((column) => {
      const rows = matrixAnswers[column];
      if (Array.isArray(rows)) {
        rows.forEach((row) => {
          if (row && typeof row === "string") {
            convertedAnswers.push({ row, column });
          }
        });
      }
    });

    return convertedAnswers;
  };

  useEffect(() => {
    if (OCRresponses && Object.keys(answers).length === 0) {
      setOcrRes({
        survey: OCRresponses.survey || [],
        extracted_answers: OCRresponses.extracted_answers || [],
        uploaded_files: OCRresponses.uploaded_files || [],
        respondent_details: OCRresponses.respondent_details || null,
      });

      console.log(OCRresponses.respondent_details);

      setRespondent_name(OCRresponses?.respondent_details?.name);
      setRespondent_email(OCRresponses?.respondent_details?.email);

      const existingAnswers: Record<string, any> = {};
      OCRresponses.extracted_answers.forEach((item: any) => {
        let scale_value = item?.scale_value || "";
        if (item.question_type === "star_rating") {
          // Use the first value if it's an array
          let val = Array.isArray(scale_value) ? scale_value[0] : scale_value;
          // If it's a number or numeric string, find the matching option
          if (
            typeof val === "number" ||
            (typeof val === "string" && !isNaN(Number(val)))
          ) {
            const num = Number(val);
            if (Array.isArray(item.options)) {
              const match = item.options.find(
                (opt: string) => opt.replace(/[^0-9]/g, "") === String(num)
              );
              scale_value = match || "";
            } else {
              scale_value = "";
            }
          } else if (typeof val === "string") {
            scale_value = val;
          }
        }

        // Extract number from string for number question types
        let numValue = item?.num || null;
        if (item.question_type === "number") {
          numValue = extractNumberFromString(item?.num);
        }

        // Convert matrix answers format for matrix question types
        let matrixAnswers = item?.matrix_answers || [];
        if (
          item.question_type === "matrix_checkbox" ||
          item.question_type === "matrix_multiple_choice"
        ) {
          matrixAnswers = convertMatrixAnswersFormat(item?.matrix_answers);
        }

        existingAnswers[item.question] = {
          selected_options: item?.selected_options || [],
          scale_value,
          drop_down_value: Array.isArray(item?.drop_down_value)
            ? item.drop_down_value[0] || ""
            : item?.drop_down_value || "",
          boolean_value:
            item?.boolean_value !== undefined ? item.boolean_value : null,
          text: item?.text || "",
          num: numValue,
          media_url: item?.media_url || "",
          matrix_answers: matrixAnswers,
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
    // Check survey settings to determine if respondent name is required
    if (
      surveySettings?.collect_name_of_respondents &&
      !respondent_name &&
      !ocrRes?.respondent_name
    ) {
      errors.push("Please provide respondent name");
    }

    // Check survey settings to determine if respondent email is required
    if (
      surveySettings?.collect_email_addresses &&
      !respondent_email &&
      !userEmail &&
      !ocrRes?.respondent_email
    ) {
      errors.push("Please provide respondent email");
    } else if (
      surveySettings?.collect_email_addresses &&
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
            let textValue = answer?.text;

            if (Array.isArray(textValue)) {
              textValue = textValue[0];
            }
            if (!textValue || !String(textValue).trim()) {
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

    console.log(ocrRes);

    const formattedAnswers = OCRresponses.extracted_answers.map((item: any) => {
      const rawAnswer = answers[item.question];
      const baseAnswer = {
        question: item.question,
        question_type: item.question_type,
      };
      const answer =
        typeof rawAnswer === "object" ? rawAnswer : { value: rawAnswer };

      switch (item.question_type) {
        case "checkbox":
        case "multiple_choice":
        case "single_choice":
          return {
            ...baseAnswer,
            selected_options: Array.isArray(answer.selected_options)
              ? answer.selected_options.filter((opt: any) =>
                  Array.isArray(item.options)
                    ? item.options.includes(opt)
                    : true
                )
              : answer.selected_options
              ? Array.isArray(item.options) &&
                item.options.includes(answer.selected_options)
                ? [answer.selected_options]
                : []
              : [],
          };
        case "drop_down":
          return {
            ...baseAnswer,
            drop_down_value:
              typeof answer.drop_down_value === "string"
                ? answer.drop_down_value
                : Array.isArray(answer.drop_down_value)
                ? answer.drop_down_value[0] || ""
                : answer.drop_down_value || "",
          };
        case "likert_scale":
          return {
            ...baseAnswer,
            scale_value:
              typeof answer.scale_value === "string"
                ? answer.scale_value
                : Array.isArray(answer.scale_value)
                ? answer.scale_value[0] || ""
                : answer.scale_value || "",
          };
        case "rating_scale":
          return {
            ...baseAnswer,
            scale_value:
              typeof answer.scale_value === "string"
                ? answer.scale_value
                : Array.isArray(answer.scale_value)
                ? answer.scale_value[0] || ""
                : answer.scale_value || "",
          };
        case "star_rating": {
          let checkedValue = answers[item.question]?.scale_value;
          if (Array.isArray(checkedValue)) checkedValue = checkedValue[0];
          return {
            ...baseAnswer,
            scale_value: checkedValue || "",
          };
        }
        case "slider":
          return {
            ...baseAnswer,
            scale_value:
              typeof answer.scale_value === "number"
                ? answer.scale_value
                : Number(answer.scale_value) || 0,
          };
        case "matrix_multiple_choice":
        case "matrix_checkbox":
          return {
            ...baseAnswer,
            matrix_answers: Array.isArray(answer.matrix_answers)
              ? answer.matrix_answers
              : [],
          };
        case "number":
          return {
            ...baseAnswer,
            num:
              typeof answer.num === "number"
                ? answer.num
                : Number(answer.num) || 0,
          };
        case "long_text": {
          if (answer.media_url) {
            return {
              ...baseAnswer,
              media_url: answer.media_url,
            };
          }
          return {
            ...baseAnswer,
            text:
              typeof answer.text === "string"
                ? answer.text
                : Array.isArray(answer.text)
                ? answer.text[0] || ""
                : "",
          };
        }
        case "short_text":
          return {
            ...baseAnswer,
            text:
              typeof answer.text === "string"
                ? answer.text
                : Array.isArray(answer.text)
                ? answer.text[0] || ""
                : "",
          };
        case "media":
          return {
            ...baseAnswer,
            media_url: answer.media_url || "",
          };
        case "boolean":
          return {
            ...baseAnswer,
            boolean_value:
              typeof answer.boolean_value === "boolean"
                ? answer.boolean_value
                : answer.boolean_value[0] === "True"
                ? true
                : answer.boolean_value[0] === "false"
                ? false
                : Boolean(answer.boolean_value),
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
      uploaded_files: OCRresponses.uploaded_files || [],
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
    resetAnswers();
    router.push(`/surveys/${params.id}/survey-response-upload`);
  };

  const isOtherOption = (option: string) => {
    const otherOptions = [
      "Others (please specify)",
      "Other (please specify)",
      "Others",
      "Other",
      "other",
      "others",
      "Other...",
      "Others...",
      "Other option",
      "Other options",
      "Other choice",
      "Other choices",
      "Something else",
      "Something else...",
      "Specify other",
      "Please specify",
      "Please specify other",
      "Please specify others",
      "Custom option",
      "Custom choice",
      "Please specify here",
      "Please specify below",
      "Please provide details",
      "Please explain",
      "Please describe",
      "Please elaborate",
      "Please write here",
      "Please enter details",
      "Please tell us more",
      "Specify here",
      "Enter other option",
      "Write your answer",
      "Other option (please specify)",
      "Other options (please specify)",
      "Other choice (please specify)",
      "Other choices (please specify)",
      "Specify other option",
      "Specify other options",
    ];
    if (typeof option !== "string") return false;
    return otherOptions.some(
      (otherOption) =>
        typeof otherOption === "string" &&
        otherOption.toLowerCase() === option.toLowerCase().trim()
    );
  };

  const isMatrixOptionSelected = (
    question: string,
    row: string,
    column: string
  ) => {
    return answers[question]?.matrix_answers?.some(
      (ans: any) => ans.row === row && ans.column === column
    );
  };

  const handleAudioToggle = (question: string) => {
    setShowAudio((prev) => {
      const newState = { ...prev, [question]: !prev[question] };
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [question]: {},
      }));
      return newState;
    });
  };

  const getFontClass = (fontName?: string | null) => {
    if (!fontName || typeof fontName !== "string") return "";
    try {
      return `font-${fontName.split(" ").join("-").toLowerCase()}`;
    } catch (error) {
      console.error("Error processing font name:", error);
      return "";
    }
  };

  const renderQuestion = (quest: any, index: number, theme: string) => {
    return (
      <motion.div
        key={index}
        variants={questionVariants}
        className={cn(
          "space-y-4 py-6 bg-white rounded-lg shadow-sm",
          getFontClass(ocrRes?.survey?.question_text?.name)
        )}
        style={{
          fontSize: `16px`,
        }}
      >
        <motion.div
          variants={questionVariants}
          className={cn(
            "flex items-start gap-3 px-4 lg:px-10",
            getFontClass(ocrRes?.survey?.question_text?.name)
          )}
          style={{
            fontSize: `16px`,
          }}
        >
          <span className="bg-gradient-to-r font-medium text-lg rounded-full flex items-center justify-center">
            {index + 1}.
          </span>
          <div className="flex-1">
            <p className="font-medium text-lg">
              {quest.question}
              {quest.is_required && (
                <span className="text-red-500 font-extrabold text-base ml-1">
                  *
                </span>
              )}
            </p>
          </div>
        </motion.div>
        <motion.div
          variants={questionVariants}
          className="mt-4 px-4 lg:px-10"
          style={{ fontSize: `16px` }}
        >
          {(() => {
            switch (quest.question_type) {
              case "checkbox":
              case "multiple_choice":
                return (
                  <div className="space-y-3">
                    {quest.options?.map((option: string, idx: number) => (
                      <motion.div
                        key={option}
                        variants={questionVariants}
                        custom={idx}
                        className="flex items-center font-normal p-3 gap-3 rounded-lg hover:bg-gray-50 transition-colors"
                        style={{ fontSize: `16px` }}
                      >
                        <Checkbox
                          id={`${quest.question}-${option}`}
                          value={option}
                          checked={answers[
                            quest.question
                          ]?.selected_options?.includes(option)}
                          onCheckedChange={(checked) =>
                            handleAnswerChange(quest.question, {
                              selected_options: checked
                                ? [
                                    ...(answers[quest.question]
                                      ?.selected_options || []),
                                    option,
                                  ]
                                : (
                                    answers[quest.question]?.selected_options ||
                                    []
                                  ).filter((opt: string) => opt !== option),
                            })
                          }
                          className="size-4 sm:size-5"
                        />
                        <Label
                          htmlFor={`${quest.question}-${option}`}
                          className="flex-1 cursor-pointer font-normal"
                          style={{ fontSize: `clamp(0.75rem, 16px, 0.875rem)` }}
                        >
                          {option}
                        </Label>
                      </motion.div>
                    ))}
                    {answers[quest.question]?.selected_options?.some(
                      isOtherOption
                    ) && (
                      <Input
                        type="text"
                        placeholder="Please specify"
                        className="mt-2"
                        value={answers[quest.question]?.other_value || ""}
                        onChange={(e) =>
                          handleAnswerChange(quest.question, {
                            ...answers[quest.question],
                            other_value: e.target.value,
                          })
                        }
                      />
                    )}
                  </div>
                );
              case "single_choice":
                return (
                  <RadioGroup
                    className="space-y-3"
                    value={answers[quest.question]?.selected_options?.[0]}
                    onValueChange={(value) =>
                      handleAnswerChange(quest.question, {
                        selected_options: [value],
                      })
                    }
                  >
                    {quest.options?.map((option: string, idx: number) => (
                      <motion.div
                        key={option}
                        variants={questionVariants}
                        custom={idx}
                        className="flex items-center p-3 gap-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <RadioGroupItem
                          value={option}
                          id={`${quest.question}-${option}`}
                          className="size-4 sm:size-5"
                        />
                        <Label
                          htmlFor={`${quest.question}-${option}`}
                          className="flex-1 cursor-pointer font-normal"
                          style={{ fontSize: `clamp(0.75rem, 16px, 0.875rem)` }}
                        >
                          {option}
                        </Label>
                      </motion.div>
                    ))}
                    {answers[quest.question]?.selected_options?.some(
                      isOtherOption
                    ) && (
                      <Input
                        type="text"
                        placeholder="Please specify"
                        className="mt-2"
                        value={answers[quest.question]?.other_value || ""}
                        onChange={(e) =>
                          handleAnswerChange(quest.question, {
                            ...answers[quest.question],
                            other_value: e.target.value,
                          })
                        }
                      />
                    )}
                  </RadioGroup>
                );
              case "likert_scale": {
                // Support scale_value as string, number, or array
                let checkedValue = answers[quest.question]?.scale_value;
                if (Array.isArray(checkedValue)) checkedValue = checkedValue[0];
                return (
                  <RadioGroup
                    className="mb-4 bg-white w-full p-4 sm:p-6 px-0 sm:px-0 rounded-lg transition-all duration-300"
                    value={checkedValue ?? ""}
                    onValueChange={(value) =>
                      handleAnswerChange(quest.question, {
                        scale_value: value,
                      })
                    }
                    required={quest.is_required}
                  >
                    <div className="flex flex-col md:flex-row justify-between items-stretch gap-2">
                      {quest.options?.map((option: any, idx: number) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex-1 min-w-[100px] flex items-center md:flex-col md:items-center gap-2 p-3 rounded-lg bg-gray-50 sm:bg-transparent hover:bg-gray-50 transition-colors duration-200"
                        >
                          <RadioGroupItem
                            value={option}
                            id={`${quest.question}-${idx}`}
                            className="size-4 sm:size-5 md:mb-1 transition-all duration-200"
                          />
                          <Label
                            htmlFor={`${quest.question}-${idx}`}
                            className="text-sm md:text-center flex-1 font-normal cursor-pointer transition-colors duration-200 hover:text-[#9D50BB]"
                            style={{
                              fontSize: `clamp(0.75rem, 16px, 0.875rem)`,
                            }}
                          >
                            {option}
                          </Label>
                        </motion.div>
                      ))}
                    </div>
                    {checkedValue && isOtherOption(checkedValue) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Input
                          type="text"
                          placeholder="Please specify"
                          className="mt-4 transition-all duration-200 focus:ring-[#9D50BB] focus:border-[#9D50BB]"
                          value={answers[quest.question]?.other_value || ""}
                          onChange={(e) =>
                            handleAnswerChange(quest.question, {
                              ...answers[quest.question],
                              other_value: e.target.value,
                            })
                          }
                        />
                      </motion.div>
                    )}
                  </RadioGroup>
                );
              }
              case "drop_down":
                return (
                  <>
                    <Select
                      value={
                        answers[quest.question]?.drop_down_value?.[0] || ""
                      }
                      onValueChange={(value) =>
                        handleAnswerChange(quest.question, {
                          drop_down_value: [value],
                        })
                      }
                    >
                      <SelectTrigger
                        className="mb-4 bg-[#FAFAFA] w-full"
                        style={{ fontSize: `clamp(0.75rem, 16px, 0.875rem)` }}
                      >
                        {/* Show the full selected value, not just the first letter */}
                        <span
                          style={{ fontSize: `clamp(0.75rem, 16px, 0.875rem)` }}
                        >
                          {answers[quest.question]?.drop_down_value ||
                            "Select an option"}
                        </span>
                      </SelectTrigger>
                      <SelectContent>
                        {quest.options?.map((option: any) => (
                          <SelectItem
                            key={option}
                            value={option}
                            style={{
                              fontSize: `clamp(0.75rem, 16px, 0.875rem)`,
                            }}
                          >
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {answers[quest.question]?.drop_down_value &&
                      isOtherOption(
                        answers[quest.question]?.drop_down_value
                      ) && (
                        <Input
                          type="text"
                          placeholder="Please specify"
                          className="mt-2"
                          value={answers[quest.question]?.other_value || ""}
                          onChange={(e) =>
                            handleAnswerChange(quest.question, {
                              ...answers[quest.question],
                              other_value: e.target.value,
                            })
                          }
                        />
                      )}
                  </>
                );
              case "boolean":
                return (
                  <RadioGroup
                    className="mb-4 flex flex-col w-full p-3 gap-4 sm:gap-5 rounded-lg transition-all duration-300"
                    onValueChange={(value) =>
                      handleAnswerChange(quest.question, {
                        boolean_value: value === "True",
                      })
                    }
                    required={quest.is_required}
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4 p-2 sm:p-3 rounded-md transition-colors duration-200 hover:bg-gray-50">
                      <RadioGroupItem
                        value="true"
                        checked={
                          answers[quest.question]?.boolean_value?.[0] === "True"
                        }
                        id={`${quest.question}-yes`}
                        className="size-4 sm:size-5"
                      />
                      <Label
                        htmlFor={`${quest.question}-yes`}
                        className="font-normal cursor-pointer select-none transition-colors duration-200 hover:text-[#5B03B2]"
                        style={{ fontSize: `clamp(0.75rem, 16px, 0.875rem)` }}
                      >
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 sm:space-x-4 p-2 sm:p-3 rounded-md transition-colors duration-200">
                      <RadioGroupItem
                        value="false"
                        checked={
                          answers[quest.question]?.boolean_value?.[0] ===
                          "False"
                        }
                        id={`${quest.question}-no`}
                        className="size-4 sm:size-5"
                      />
                      <Label
                        htmlFor={`${quest.question}-no`}
                        className="font-normal cursor-pointer select-none transition-colors duration-200 hover:text-[#5B03B2]"
                        style={{ fontSize: `clamp(0.75rem, 16px, 0.875rem)` }}
                      >
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                );
              case "long_text":
                return (
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <Label>Response Type</Label>
                      <div className="flex items-center space-x-2">
                        <Label>Text</Label>
                        <Switch
                          checked={showAudio[quest.question]}
                          onCheckedChange={() =>
                            handleAudioToggle(quest.question)
                          }
                        />
                        <Label>Audio</Label>
                      </div>
                    </div>
                    {!showAudio[quest.question] ? (
                      <Textarea
                        rows={4}
                        className="mb-4 bg-[#FAFAFA]"
                        value={answers[quest.question]?.text || ""}
                        onChange={(e) =>
                          handleAnswerChange(quest.question, {
                            text: e.target.value,
                          })
                        }
                        style={{ fontSize: `clamp(0.75rem, 16px, 0.875rem)` }}
                      />
                    ) : (
                      <PublicResponseFile
                        question={quest.question}
                        handleAnswerChange={handleAnswerChange}
                        selectedValue={answers[quest.question]?.media_url || ""}
                        required={quest.is_required}
                      />
                    )}
                  </div>
                );
              case "short_text":
                return (
                  <div className="flex flex-col">
                    <Input
                      placeholder="Your response here..."
                      className="w-full border  mb-4 bg-[#FAFAFA] flex flex-col p-3 gap-3 rounded"
                      onChange={(e) =>
                        handleAnswerChange(quest.question, {
                          text: e.target.value,
                        })
                      }
                      value={answers[quest.question]?.text || ""}
                      style={{ fontSize: `clamp(0.75rem, 16px, 0.875rem)` }}
                    />
                  </div>
                );
              case "star_rating": {
                // Use the value directly as set by StarRating
                let checkedValue = answers[quest.question]?.scale_value;
                if (Array.isArray(checkedValue)) checkedValue = checkedValue[0];
                return (
                  <div className="px-4">
                    <StarRating
                      question={quest.question}
                      options={quest.options}
                      handleAnswerChange={handleAnswerChange}
                      selectedValue={checkedValue || ""}
                      required={quest.is_required}
                    />
                  </div>
                );
              }
              case "rating_scale":
                return (
                  <RadioGroup
                    className="mb-4 bg-[#FAFAFA] flex flex-col w-full p-3 gap-3 rounded"
                    onValueChange={(value) =>
                      handleAnswerChange(quest.question, {
                        scale_value: value,
                      })
                    }
                    required={quest.is_required}
                  >
                    <div className="flex justify-between w-full">
                      {quest.options?.map((option: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex flex-col items-center gap-2"
                        >
                          <RadioGroupItem
                            value={option}
                            id={`${quest.question}-${idx}`}
                            className="size-4 sm:size-5 md:mb-1 transition-all duration-200"
                          />
                          <Label
                            htmlFor={`${quest.question}-${idx}`}
                            className="font-normal"
                            style={{
                              fontSize: `clamp(0.75rem, 16px, 0.875rem)`,
                            }}
                          >
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {answers[quest.question]?.scale_value &&
                      isOtherOption(answers[quest.question]?.scale_value) && (
                        <Input
                          type="text"
                          placeholder="Please specify"
                          className="mt-2"
                          value={answers[quest.question]?.other_value || ""}
                          onChange={(e) =>
                            handleAnswerChange(quest.question, {
                              ...answers[quest.question],
                              other_value: e.target.value,
                            })
                          }
                        />
                      )}
                  </RadioGroup>
                );
              case "matrix_multiple_choice":
              case "matrix_checkbox":
                return (
                  <div className="w-full mb-4 bg-[#FAFAFA] p-6 rounded">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="p-3 text-left font-medium text-gray-600"></th>
                          {quest.columns?.map((col: any) => (
                            <th
                              key={col}
                              className="p-3 text-center font-medium text-gray-600"
                              style={{
                                fontSize: `clamp(0.75rem, 16px, 0.875rem)`,
                              }}
                            >
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {quest.rows?.map((row: any) => (
                          <tr key={row} className="border-b border-gray-100">
                            <td
                              className="p-3 text-gray-700"
                              style={{
                                fontSize: `clamp(0.75rem, 16px, 0.875rem)`,
                              }}
                            >
                              {row}
                            </td>
                            {quest.columns?.map((col: any) => (
                              <td key={col} className="p-3">
                                <div className="flex justify-center">
                                  {quest.question_type === "matrix_checkbox" ? (
                                    <Checkbox
                                      id={`${quest.question}-${row}-${col}`}
                                      checked={isMatrixOptionSelected(
                                        quest.question,
                                        row,
                                        col
                                      )}
                                      onCheckedChange={() =>
                                        handleMatrixAnswerChange(
                                          quest.question,
                                          row,
                                          col,
                                          "checkbox"
                                        )
                                      }
                                      className="size-4 sm:size-5"
                                    />
                                  ) : (
                                    <Checkbox
                                      id={`${quest.question}-${row}-${col}`}
                                      checked={isMatrixOptionSelected(
                                        quest.question,
                                        row,
                                        col
                                      )}
                                      onCheckedChange={() =>
                                        handleMatrixAnswerChange(
                                          quest.question,
                                          row,
                                          col,
                                          "radio"
                                        )
                                      }
                                      className="size-4 sm:size-5"
                                    />
                                  )}
                                </div>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              case "slider": {
                const generateSmartLabels = (min: number, max: number) => {
                  const range = (max ?? 10) - (min ?? 0);
                  let step;
                  if (range <= 10) {
                    step = 1;
                  } else if (range <= 100) {
                    step = Math.ceil(range / 5) * 5;
                  } else if (range <= 1000) {
                    step = Math.ceil(range / 5) * 50;
                  } else if (range <= 10000) {
                    step = Math.ceil(range / 5) * 500;
                  } else {
                    step = Math.ceil(range / 5) * 5000;
                  }
                  const labels = [];
                  labels.push(min ?? 0);
                  for (let i = (min ?? 0) + step; i < (max ?? 10); i += step) {
                    labels.push(Math.round(i));
                  }
                  if (labels[labels.length - 1] !== (max ?? 10)) {
                    labels.push(max ?? 10);
                  }
                  return labels;
                };
                const sliderValue =
                  answers[quest.question]?.scale_value || quest.min || 0;
                const sliderLabels = generateSmartLabels(
                  quest.min || 0,
                  quest.max || 10
                );
                return (
                  <div className="mb-4 bg-[#FAFAFA] flex flex-col w-full p-3 gap-3">
                    <Slider
                      value={[Number(sliderValue)]}
                      max={quest.max || 10}
                      min={quest.min || 0}
                      step={1}
                      onValueChange={(newValue) =>
                        handleAnswerChange(quest.question, {
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
              }
              case "number":
                return (
                  <Input
                    className="mb-4 bg-[#FAFAFA] flex flex-col w-full p-3 gap-3 rounded"
                    placeholder={`Enter a number`}
                    type="number"
                    min={quest.min}
                    max={quest.max}
                    value={answers[quest.question]?.num || ""}
                    onChange={(e) =>
                      handleAnswerChange(quest.question, {
                        num: Number(e.target.value),
                      })
                    }
                    style={{ fontSize: `clamp(0.75rem, 16px, 0.875rem)` }}
                  />
                );
              case "media":
                return (
                  <div className="flex flex-col">
                    <ResponseFile
                      question={quest.question}
                      handleAnswerChange={handleAnswerChange}
                      selectedValue={answers[quest.question]?.media_url || ""}
                      required={quest.is_required}
                    />
                  </div>
                );
              default:
                return <p>Unsupported question type</p>;
            }
          })()}
        </motion.div>
      </motion.div>
    );
  };

  // Early return for loading
  if (isSurveySettingsLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        {/* <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mb-6" /> */}
        <Spinner />
        <h2 className="text-xl font-semibold text-gray-700 mt-4">
          Loading survey data...
        </h2>
      </div>
    );
  }

  // Early return for error
  if (isSurveySettingsError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
          <svg
            className="w-16 h-16 text-red-500 mb-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-4 text-center">
            {(surveyError as any)?.data?.message ??
              "We couldn't load the survey. It may have been deleted, moved, or the link is incorrect."}
          </p>
          <button
            className="mt-2 px-6 py-2 bg-purple-600 text-white flex justify-center gap-2 items-center rounded-lg shadow hover:bg-purple-700 transition"
            onClick={() => router.back()}
          >
            <IoArrowBack />
            Go back
          </button>
        </div>
      </div>
    );
  }

  console.log(ocrRes);

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
          {(surveySettings?.collect_name_of_respondents ||
            surveySettings?.collect_email_addresses) && (
            <motion.div
              variants={questionVariants}
              className="bg-white rounded-lg shadow-sm p-6 mb-8"
            >
              <h3 className="text-lg font-medium mb-4">
                Respondent Information
              </h3>
              <div className="space-y-4">
                {surveySettings?.collect_name_of_respondents && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter respondent's name"
                      className="w-full p-2 border-0 border-b border-gray-300 focus:border-b-2 focus:border-purple-500 focus:outline-none transition-all"
                      value={respondent_name}
                      onChange={(e) => setRespondent_name(e.target.value)}
                    />
                  </div>
                )}

                {surveySettings?.collect_email_addresses && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="Enter respondent's email"
                      className="w-full p-2 border-0 border-b border-gray-300 focus:border-b-2 focus:border-purple-500 focus:outline-none transition-all"
                      value={respondent_email}
                      onChange={(e) => setRespondent_email(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* {console.log(ocrRes?.extracted_answers)} */}

          {/* Questions */}
          {ocrRes?.extracted_answers?.map((item: any, index: number) =>
            renderQuestion(item, index, ocrRes?.survey?.theme)
          )}

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
