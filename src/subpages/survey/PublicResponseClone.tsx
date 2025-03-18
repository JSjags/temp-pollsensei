import { pollsensei_new_logo, sparkly } from "@/assets/images";
import AppReactQuill from "@/components/common/forms/AppReactQuill";
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
import { motion, AnimatePresence } from "framer-motion";
import { validateQuestionResponse } from "@/utils/validation";
import { fadeInUp, slideIn } from "@/utils/animations";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/shadcn-input";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { SelectTrigger } from "@/components/ui/select";
import { Textarea } from "@/components/ui/shadcn-textarea";
import { Checkbox } from "@/components/ui/shadcn-checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import PublicResponseFile from "@/components/ui/PublicVoiceRecorder";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

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

interface FormErrors {
  respondent_email?: string;
  respondent_name?: string;
  questions: Record<string, string>;
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

  const [activeInput, setActiveInput] = useState<
    Record<string, "textarea" | "audio" | null>
  >({});
  const [quilValue, setQuilValue] = useState("");
  const [showAudio, setShowAudio] = useState<Record<string, boolean>>({});

  // Single source of validation errors
  const [formErrors, setFormErrors] = useState<FormErrors>({
    questions: {},
  });

  // Validate single question
  const validateQuestion = (question: any, value: any) => {
    const error = validateQuestionResponse(question, value);

    // Additional validation for matrix questions
    if (
      (question.question_type === "matrix_checkbox" ||
        question.question_type === "matrix_multiple_choice") &&
      question.is_required
    ) {
      const matrixAnswers = value?.matrix_answers || [];
      const answeredRows = new Set(matrixAnswers.map((ans: any) => ans.row));

      // Check if all rows have at least one selection
      if (question.rows?.length !== answeredRows.size) {
        const missingRows = question.rows.filter(
          (row: string) => !answeredRows.has(row)
        );
        const errorMessage = `Please select at least one option for the following rows: ${missingRows.join(
          ", "
        )}`;
        setFormErrors((prev) => ({
          ...prev,
          questions: {
            ...prev.questions,
            [question.question]: errorMessage,
          },
        }));
        return errorMessage;
      }
    }

    if (error) {
      setFormErrors((prev) => ({
        ...prev,
        questions: {
          ...prev.questions,
          [question.question]: error,
        },
      }));
    } else {
      setFormErrors((prev) => {
        const newQuestionErrors = { ...prev.questions };
        delete newQuestionErrors[question.question];
        return {
          ...prev,
          questions: newQuestionErrors,
        };
      });
    }
    return error;
  };

  const handleInputFocus = (
    question: string,
    inputType: "textarea" | "audio"
  ) => {
    setActiveInput((prev) => ({ ...prev, [question]: inputType }));
  };

  const handleInputBlur = (question: string) => {
    setActiveInput((prev) => ({ ...prev, [question]: null }));
  };

  const isTextareaDisabled = (question: string) =>
    activeInput[question] === "audio";
  const isAudioDisabled = (question: string) =>
    activeInput[question] === "textarea" || !!answers[question]?.text;

  // Enhanced answer change handler with validation
  const handleAnswerChange = (key: string, value: any, question?: any) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    if (question) {
      validateQuestion(question, value);
    }
  };

  const handleMatrixAnswerChange = (
    key: string,
    row: string,
    column: string,
    type: "checkbox" | "radio"
  ) => {
    setAnswers((prev) => {
      const matrixAnswers = prev[key]?.matrix_answers || [];

      if (type === "radio") {
        // For matrix_multiple_choice, allow multiple selections per row
        const existingAnswer = matrixAnswers.find(
          (ans: any) => ans.row === row && ans.column === column
        );

        if (existingAnswer) {
          const newAnswers = {
            ...prev,
            [key]: {
              matrix_answers: matrixAnswers.filter(
                (ans: any) => !(ans.row === row && ans.column === column)
              ),
            },
          };
          validateQuestion(
            {
              question: key,
              question_type: "matrix_multiple_choice",
              rows: prev[key]?.rows,
            },
            newAnswers[key]
          );
          return newAnswers;
        } else {
          const newAnswers = {
            ...prev,
            [key]: {
              matrix_answers: [...matrixAnswers, { row, column }],
            },
          };
          validateQuestion(
            {
              question: key,
              question_type: "matrix_multiple_choice",
              rows: prev[key]?.rows,
            },
            newAnswers[key]
          );
          return newAnswers;
        }
      } else {
        // For matrix_checkbox, ensure only one selection per row
        const newMatrixAnswers = matrixAnswers.filter(
          (ans: any) => ans.row !== row
        );
        const newAnswers = {
          ...prev,
          [key]: {
            matrix_answers: [...newMatrixAnswers, { row, column }],
          },
        };
        validateQuestion(
          {
            question: key,
            question_type: "matrix_checkbox",
            rows: prev[key]?.rows,
          },
          newAnswers[key]
        );
        return newAnswers;
      }
    });
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
      // Reset answers for this question when toggling
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [question]: {},
      }));
      return newState;
    });
  };

  console.log(textResponses);
  console.log(selectedOptions);

  console.log(psId);
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

  // Enhanced submit handler with full validation
  const handleSubmitResponse = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const currentQuestions =
      question?.data?.sections[currentSection]?.questions;
    if (!currentQuestions) {
      toast.warning("No questions found in this section");
      return;
    }

    // Format answers for current section
    const formattedAnswers = currentQuestions.map((question: any) => ({
      question: question.question,
      question_type: question.question_type,
      ...answers[question.question],
    }));

    // Validate required fields
    const newFormErrors: FormErrors = {
      questions: {},
    };

    if (
      question?.data?.settings?.collect_email_addresses &&
      !respondent_email
    ) {
      newFormErrors.respondent_email = "Email is required";
    }

    if (
      question?.data?.settings?.collect_name_of_respondents &&
      !respondent_name
    ) {
      newFormErrors.respondent_name = "Name is required";
    }

    // Validate all questions in current section
    currentQuestions.forEach((quest: any) => {
      // Only validate if question is required
      if (quest.is_required) {
        const error = validateQuestionResponse(quest, answers[quest.question]);
        if (error) {
          newFormErrors.questions[quest.question] = error;
        }
      }
    });

    setFormErrors(newFormErrors);

    // Check if there are any errors
    if (
      Object.keys(newFormErrors.questions).length > 0 ||
      newFormErrors.respondent_email ||
      newFormErrors.respondent_name
    ) {
      toast.error("Please fix the validation errors before submitting");
      return;
    }

    // Submit response
    const responsePayload = {
      survey_id: question?.data?._id,
      respondent_name,
      respondent_email,
      answers: formattedAnswers,
    };

    try {
      await submitPublicResponse(responsePayload).unwrap();
      toast.success("Your response was saved successfully");
      setSubmitSurveySuccess(true);
    } catch (error) {
      console.error(error);
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

  // Helper function to check if an option is "Other" type
  const isOtherOption = (option: string) => {
    const otherOptions = [
      "Others (please specify)",
      "Other (please specify)",
      "Others",
      "Other",
      "other",
      "others",
    ];
    return otherOptions.includes(option);
  };

  console.log(question);

  // Question rendering with enhanced UI and animations
  const renderQuestion = (quest: any, index: number, theme: string) => {
    return (
      <motion.div
        key={index}
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        exit="exit"
        className="space-y-4 py-6 bg-white rounded-lg shadow-sm"
        style={{
          fontSize: `${question?.data?.question_text?.size}px`,
        }}
      >
        <motion.div
          variants={slideIn}
          className={cn(
            "flex items-start gap-3 px-4 lg:px-10",
            getFontClass(question?.data?.question_text?.name)
          )}
          style={{
            fontSize: `${question?.data?.question_text?.size}px`,
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
            {/* {quest.description && (
              <p className="text-gray-600 text-sm mt-1">{quest.description}</p>
            )} */}
          </div>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="mt-4 px-4 lg:px-10"
          style={{
            fontSize: `${question?.data?.question_text?.size}px`,
          }}
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
                        variants={fadeInUp}
                        custom={idx}
                        className="flex items-center font-normal p-3 gap-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        style={{
                          fontSize: `${question?.data?.question_text?.size}px`,
                        }}
                      >
                        <Checkbox
                          id={`${quest.question}-${option}`}
                          value={option}
                          checked={answers[
                            quest.question
                          ]?.selected_options?.includes(option)}
                          onCheckedChange={(checked) =>
                            handleAnswerChange(
                              quest.question,
                              {
                                selected_options: checked
                                  ? [
                                      ...(answers[quest.question]
                                        ?.selected_options || []),
                                      option,
                                    ]
                                  : (
                                      answers[quest.question]
                                        ?.selected_options || []
                                    ).filter((opt: string) => opt !== option),
                              },
                              quest
                            )
                          }
                          className="w-5 h-5 data-[state=checked]:bg-[#9D50BB] data-[state=checked]:border-[#9D50BB]"
                        />
                        <Label
                          htmlFor={`${quest.question}-${option}`}
                          className="flex-1 cursor-pointer font-normal"
                          style={{
                            fontSize: `${question?.data?.question_text?.size}px`,
                          }}
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
                      handleAnswerChange(
                        quest.question,
                        { selected_options: [value] },
                        quest
                      )
                    }
                  >
                    {quest.options?.map((option: string, idx: number) => (
                      <motion.div
                        key={option}
                        variants={fadeInUp}
                        custom={idx}
                        className="flex items-center p-3 gap-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <RadioGroupItem
                          value={option}
                          id={`${quest.question}-${option}`}
                          className="w-5 h-5 data-[state=checked]:bg-[#9D50BB] data-[state=checked]:border-[#9D50BB]"
                        />
                        <Label
                          htmlFor={`${quest.question}-${option}`}
                          className="flex-1 cursor-pointer font-normal"
                          style={{
                            fontSize: `${question?.data?.question_text?.size}px`,
                          }}
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

              case "likert_scale":
                console.log(quest);

                return (
                  <RadioGroup
                    className="mb-4 bg-[#FAFAFA] w-full p-3 rounded"
                    onValueChange={(value) =>
                      handleAnswerChange(quest.question, {
                        scale_value: value,
                      })
                    }
                    required={quest.is_required}
                  >
                    <div className="flex justify-between items-center">
                      {quest.options?.map((option: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex flex-col items-center gap-2"
                        >
                          <RadioGroupItem
                            value={option}
                            id={`${quest.question}-${idx}`}
                            className="mb-1"
                          />
                          <Label
                            htmlFor={`${quest.question}-${idx}`}
                            className="text-sm text-center font-normal"
                            style={{
                              fontSize: `${question?.data?.question_text?.size}px`,
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

              case "drop_down":
                return (
                  <>
                    <Select
                      onValueChange={(value) =>
                        handleAnswerChange(quest.question, {
                          drop_down_value: value,
                        })
                      }
                    >
                      <SelectTrigger
                        className="mb-4 bg-[#FAFAFA] w-full"
                        style={{
                          fontSize: `${question?.data?.question_text?.size}px`,
                        }}
                      >
                        <SelectValue
                          placeholder="Select an option"
                          style={{
                            fontSize: `${question?.data?.question_text?.size}px`,
                          }}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {quest.options?.map((option: any) => (
                          <SelectItem
                            key={option}
                            value={option}
                            style={{
                              fontSize: `${question?.data?.question_text?.size}px`,
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
                    className="mb-4 bg-[#FAFAFA] flex flex-col w-full p-3 gap-3 rounded"
                    onValueChange={(value) =>
                      handleAnswerChange(quest.question, {
                        boolean_value: value === "true",
                      })
                    }
                    required={quest.is_required}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="true"
                        id={`${quest.question}-yes`}
                      />
                      <Label
                        htmlFor={`${quest.question}-yes`}
                        className="font-normal"
                        style={{
                          fontSize: `${question?.data?.question_text?.size}px`,
                        }}
                      >
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="false"
                        id={`${quest.question}-no`}
                      />
                      <Label
                        htmlFor={`${quest.question}-no`}
                        className="font-normal"
                        style={{
                          fontSize: `${question?.data?.question_text?.size}px`,
                        }}
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
                        style={{
                          fontSize: `${question?.data?.question_text?.size}px`,
                        }}
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
                      style={{
                        fontSize: `${question?.data?.question_text?.size}px`,
                      }}
                    />
                  </div>
                );

              case "star_rating":
                return (
                  <StarRating
                    question={quest.question}
                    options={quest.options}
                    handleAnswerChange={handleAnswerChange}
                    selectedValue={answers[quest.question]?.scale_value || ""}
                    required={quest.is_required}
                  />
                );

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
                          />
                          <Label
                            htmlFor={`${quest.question}-${idx}`}
                            className="font-normal"
                            style={{
                              fontSize: `${question?.data?.question_text?.size}px`,
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
                            >
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {quest.rows?.map((row: any) => (
                          <tr key={row} className="border-b border-gray-100">
                            <td className="p-3 text-gray-700">{row}</td>
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
                                      className="h-5 w-5"
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
                                      className="h-5 w-5"
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

              case "slider":
                return (
                  <div className="w-full px-4">
                    <Slider
                      defaultValue={[0]}
                      min={quest.min}
                      max={quest.max}
                      step={quest.step}
                      onValueChange={(value) =>
                        handleAnswerChange(quest.question, {
                          scale_value: value[0].toString(),
                        })
                      }
                      className="w-full"
                    />
                    <div className="flex justify-between mt-2 text-sm text-gray-600">
                      <span>{quest.min}</span>
                      <span>
                        {Math.floor((quest.max - quest.min) / 2) + quest.min}
                      </span>
                      <span>{quest.max}</span>
                    </div>
                  </div>
                );

              case "number":
                return (
                  <Input
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
                    style={{
                      fontSize: `${question?.data?.question_text?.size}px`,
                    }}
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

        {formErrors.questions[quest.question] && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm mt-2 px-4 lg:pl-10"
          >
            {formErrors.questions[quest.question]}
          </motion.p>
        )}
      </motion.div>
    );
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

  console.log();

  return (
    <div className={`flex flex-col gap-5 w-full`}>
      {(psIdLoading || psShUrLoading) && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl animate-pulse" />
              <Image
                src={pollsensei_new_logo}
                alt="Loading..."
                className="relative z-10 w-full h-full object-contain animate-pulse"
              />
            </div>
            <p className="text-gray-600 animate-pulse">Loading survey...</p>
          </div>
        </div>
      )}
      {submitSurveySuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full mx-4 shadow-[0_0_50px_rgba(157,80,187,0.25)] border border-purple-100"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.2,
                }}
                className="relative"
              >
                <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl animate-pulse" />
                <FaCheckCircle className="text-[#9D50BB] text-7xl mb-6 relative z-10 drop-shadow-lg" />
              </motion.div>

              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold mb-3 bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] bg-clip-text text-transparent"
              >
                Thank You!
              </motion.h1>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 text-lg mb-8 text-center"
              >
                Your response has been submitted successfully.
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex gap-4"
              >
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] text-white h-10 px-4 py-2 hover:opacity-90 group relative"
                >
                  <span className="absolute inset-0 rounded-md bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center gap-2">
                    <motion.span
                      initial={{ x: 0 }}
                      whileHover={{ x: -4 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      Home
                    </motion.span>
                    <motion.span
                      initial={{ x: 0, opacity: 0.5 }}
                      whileHover={{ x: 4, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 400 }}
                      className="transition-transform duration-200"
                    >
                      →
                    </motion.span>
                  </span>
                </Link>

                <Button
                  onClick={() => {
                    location.reload();
                  }}
                  variant="outline"
                  className="relative inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-[#9D50BB] hover:bg-gradient-to-r hover:from-[#5B03B2] hover:to-[#9D50BB] hover:text-white h-10 px-4 py-2 group overflow-hidden"
                >
                  <span className="relative flex items-center gap-2 z-20">
                    <motion.span
                      animate={{ rotate: [0, 360] }}
                      transition={{
                        duration: 0.5,
                        delay: 0.1,
                        ease: "easeInOut",
                      }}
                      className="text-lg"
                    >
                      ↺
                    </motion.span>
                    Take survey again
                  </span>
                  <span className="absolute inset-0 translate-y-[102%] bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
      {!submitSurveySuccess && (
        <div>
          {question?.data && (
            <div
              className={`${question?.data?.theme} min-h-screen flex justify-center px-5 bg-fixed lg:px-16 mx-auto gap-10 w-full`}
            >
              <form
                onSubmit={handleSubmitResponse}
                className={` flex flex-col overflow-y-auto custom-scrollbar w-full max-w-screen-lg`}
              >
                {question?.data?.logo_url && (
                  <div className="bg-gray-100 w-16 rounded my-5 text-white flex items-center flex-col ">
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
                  <div className="bg-gray-100 rounded-lg w-full my-4 text-white h-24 flex items-center flex-col ">
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
                    className={cn(
                      "text-[1.5rem] font-normal bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] bg-clip-text text-transparent",
                      getFontClass(question?.data?.header_text?.name)
                    )}
                    style={{
                      fontSize: `${question?.data?.header_text?.size}px`,
                    }}
                  >
                    {question?.data?.topic}
                  </h2>
                  <p
                    className={cn(
                      "text-gray-600 leading-relaxed",
                      getFontClass(question?.data?.body_text?.name)
                    )}
                    style={{
                      fontSize: `${question?.data?.body_text?.size}px`,
                    }}
                  >
                    {question?.data?.description}
                  </p>
                </div>

                <div
                  className={cn(
                    "flex flex-col gap-2 w-full bg-white px-11 py-4 rounded-lg mb-4",
                    getFontClass(question?.data?.body_text?.name)
                  )}
                >
                  {question?.data?.settings?.collect_email_addresses && (
                    <div className="flex flex-col w-full">
                      <Label htmlFor="full name" className="">
                        Full name{" "}
                        <span className="text-red-500 text-base">*</span>
                      </Label>
                      <Input
                        type="text"
                        className="border-0 border-b rounded-none ring-0 active:border-none focus:border-none py-1 px-0 outline-none"
                        required
                        onChange={(e) => setRespondent_name(e.target.value)}
                        value={respondent_name}
                      />
                    </div>
                  )}
                  {question?.data?.settings?.collect_name_of_respondents && (
                    <div className="flex flex-col w-full">
                      <Label htmlFor="full name" className="">
                        Email <span className="text-red-500 text-base">*</span>
                      </Label>
                      <Input
                        type="email"
                        className="border-0 border-b rounded-none ring-0 active:border-none focus:border-none py-1 px-0 outline-none "
                        required
                        onChange={(e) => setRespondent_email(e.target.value)}
                        value={respondent_email}
                      />
                    </div>
                  )}
                </div>
                <AnimatePresence mode="wait">
                  <motion.div className="flex flex-col gap-4">
                    {question?.data?.sections[currentSection]?.questions?.map(
                      renderQuestion
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="flex flex-col gap-4 md:flex-row justify-between items-center">
                  <div className="flex gap-2 items-center"></div>
                  {/* {question?.data?.sections?.length > 1 && (
                    <div className="flex w-full md:w-auto md:justify-end items-center">
                      <PaginationBtn
                        currentSection={currentSection}
                        totalSections={question?.data?.sections?.length}
                        onNavigate={navigatePage}
                      />
                    </div>
                  )} */}
                </div>

                <div className=" rounded-md flex flex-col justify-center w-full md:w-[16rem] py-5 text-center">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#5b03b2] to-[#9d50bb] hover:from-[#4a0291] hover:to-[#8544a0] transition-all duration-300 text-white font-medium"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </div>
                {/* <div className="bg-[#5B03B21A] rounded-md flex flex-col justify-center items-center mb-10 py-5 text-center relative">
                  <div className="flex flex-col">
                    <p>Form created by</p>
                    <Image src={pollsensei_new_logo} alt="Logo" />
                  </div>
                  <span className="absolute bottom-2 right-4 text-[#828282]">
                    Remove watermark
                  </span>
                </div> */}
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PublicResponse;
