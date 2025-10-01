"use client";
import React, { useEffect, useState } from "react";
import PaginationBtn from "@/components/common/PaginationBtn";
import StarRating from "@/components/survey/StarRating";
import ResponseFile from "@/components/ui/VoiceRecorder";
import VoiceRecorder from "@/components/ui/VoiceRecorder";
import { RootState } from "@/redux/store";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
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
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Textarea } from "@/components/ui/shadcn-textarea";
import { Checkbox } from "@/components/ui/shadcn-checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import PublicResponseFile from "@/components/ui/PublicVoiceRecorder";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  submitScreenerSurvey,
  submitPaidSurvey,
  fetchScreenerSurveyBySurveyId,
  GetRespondentSectionData,
  fetchApplicationSurveys,
  startPaidSurvey,
} from "@/services/api/apiRequest";
import {
  selectScreenerSurvey,
  closeSurveyFormDialog,
  openSuccessDialog,
} from "@/redux/slices/earnDialogSlice";
import { useDispatch } from "react-redux";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { APP_KEYS } from "@/constants";
import {} from "@tanstack/react-query";

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

const PaidRespondentSurveyResponse = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState<boolean>(false);

  const [currentSection, setCurrentSection] = useState(0);

  const [activeInput, setActiveInput] = useState<
    Record<string, "textarea" | "audio" | null>
  >({});
  const [showAudio, setShowAudio] = useState<Record<string, boolean>>({});
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [textResponses, setTextResponses] = useState<string[]>([]);

  const screenerSurvey = useSelector(selectScreenerSurvey);

  // Single source of validation errors
  const [formErrors, setFormErrors] = useState<FormErrors>({
    questions: {},
  });

  // Validate single question
  const validateQuestion = (question: any, value: any) => {
    const error = validateQuestionResponse(question, value);

    if (
      (question.question_type === "matrix_checkbox" ||
        question.question_type === "matrix_multiple_choice") &&
      question.is_required
    ) {
      const matrixAnswers = value?.matrix_answers || [];
      const answeredRows = new Set(matrixAnswers.map((ans: any) => ans.row));

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

  // Enhanced answer change handler with validation
  const handleAnswerChange = (key: string, value: any, question?: any) => {
    setAnswers((prev) => {
      // For text inputs (short_text and long_text)
      if (value?.text !== undefined) {
        return {
          ...prev,
          [key]: {
            ...prev[key],
            text_response: value.text,
          },
        };
      }
      // For drop_down
      else if (value?.drop_down_value !== undefined) {
        return {
          ...prev,
          [key]: {
            ...prev[key],
            selected_options: [value.drop_down_value],
          },
        };
      }
      // For other types (single_choice, multiple_choice)
      else {
        return {
          ...prev,
          [key]: value,
        };
      }
    });

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

  const question = screenerSurvey;

  // console.log({ screenerSurvey });

  useEffect(() => {
    if (question?.sections[currentSection]?.questions) {
      setSelectedOptions(new Array(question.sections.length).fill(null));
      setTextResponses(new Array(question.sections.length).fill(""));
    }
  }, [currentSection, question]);

  const currentQuestions = question?.sections[currentSection]?.questions;
  const surveyType = question?.survey_type ?? question?.survey_type;

  const { data: screenerSuveyBySurveyId } = useQuery({
    queryKey: [...[APP_KEYS.SCREENER_SURVEY_BY_SURVEY_ID]],
    queryFn: () => fetchScreenerSurveyBySurveyId(question._id),
    enabled: !!question,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const screenerSurveyID = screenerSuveyBySurveyId?.[0]?._id || null;

  const { data: respondent } = useQuery({
    queryKey: [...[APP_KEYS.START_SURVEY]],
    queryFn: () => startPaidSurvey(question._id, screenerSurveyID),
    enabled: !!screenerSurveyID,
  });

  const respondentId = respondent?.respondentId || null;

  // useEffect(() => {
  //   if (respondentId === null) {
  //     toast.error(
  //       "You have already responded to this survey. Please fill the other surveys."
  //     );
  //     dispatch(closeSurveyFormDialog());
  //     return;
  //   }
  // }, [respondentId, dispatch]);

  const { data: screenerParticipants } = useQuery({
    queryKey: [APP_KEYS.RESPONDENT_DATA_BY_SECTION, "personalInfo"],
    queryFn: () => GetRespondentSectionData("personalInfo"),
    enabled: true,
  });

  const { data: screenerParticipantsGeo } = useQuery({
    queryKey: [APP_KEYS.RESPONDENT_DATA_BY_SECTION, "geographicInfo"],
    queryFn: () => GetRespondentSectionData("geographicInfo"),
    enabled: true,
  });

  // console.log({ screenerParticipants, screenerParticipantsGeo });

  const handleSubmitResponse = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!currentQuestions) {
      toast.warning("No questions found in this section");
      return;
    }

    // Check if all required questions are answered
    const allQuestionsAnswered = currentQuestions.every((question: any) => {
      if (question.is_required) {
        const answerData = answers[question.question];
        if (question.question_type === "checkbox") {
          return answerData?.selected_options.length > 0;
        } else if (
          question.question_type === "single_choice" ||
          question.question_type === "drop_down" ||
          question.question_type === "boolean"
        ) {
          return answerData?.selected_options?.[0] !== undefined;
        } else if (question.question_type === "text") {
          return answerData?.text_response !== "";
        }
      }
      return true;
    });

    // Format answers for all sections
    const allFormattedAnswers = question.sections.flatMap((section: any) =>
      section.questions.map((question: any) => {
        const answerData = answers[question.question];
        let answerValue;

        if (question.question_type === "checkbox") {
          answerValue = answerData?.selected_options || [];
        } else if (
          question.question_type === "single_choice" ||
          question.question_type === "drop_down"
        ) {
          answerValue = answerData?.selected_options?.[0] || "";
        } else if (question.question_type === "boolean") {
          answerValue =
            answerData?.selected_options?.[0] === true ? "Yes" : "No";
        } else if (question.question_type === "text") {
          answerValue = answerData?.text_response || "";
        } else {
          answerValue = "";
        }

        return {
          questionId: question.question,
          question: question.question,
          questionType: question.question_type,
          answer: answerValue,
          section: section.sectionTitle,
        };
      })
    );

    const allSurveyFormattedAnswers = question.sections.flatMap(
      (section: any) =>
        section.questions.map((quest: any) => {
          const answerData = answers[quest.question];
          const questionType =
            quest.question_type?.toLowerCase() || "short_text";

          if (questionType === "multiple_choice") {
            return {
              question: quest.question,
              question_type: "multiple_choice",
              selected_options: answerData?.selected_options || [],
            };
          } else if (questionType === "checkbox") {
            return {
              question: quest.question,
              question_type: "checkbox",
              selected_options: answerData?.selected_options || [],
            };
          } else if (questionType === "single_choice") {
            return {
              question: quest.question,
              question_type: "single_choice",
              selected_options: answerData?.selected_options
                ? [answerData.selected_options[0]]
                : [],
            };
          } else if (questionType === "drop_down") {
            return {
              question: quest.question,
              question_type: "drop_down",
              selected_options: answerData?.selected_options
                ? [answerData.selected_options[0]]
                : [],
            };
          } else if (questionType === "boolean") {
            return {
              question: quest.question,
              question_type: "boolean",
              selected_options: [
                answerData?.selected_options?.[0] === true ? "Yes" : "No",
              ],
            };
          } else if (questionType === "long_text") {
            return {
              question: quest.question,
              question_type: "long_text",
              text: answerData?.text_response || "",
            };
          } else if (questionType === "short_text") {
            return {
              question: quest.question,
              question_type: "short_text",
              text: answerData?.text_response || "",
            };
          } else if (questionType === "likert_scale") {
            return {
              question: quest.question,
              question_type: "likert_scale",
              scale_value: answerData?.scale_value || "",
            };
          } else if (questionType === "star_rating") {
            return {
              question: quest.question,
              question_type: "star_rating",
              scale_value: answerData?.scale_value || "",
            };
          } else if (questionType === "rating_scale") {
            return {
              question: quest.question,
              question_type: "rating_scale",
              scale_value: answerData?.scale_value || "",
            };
          } else if (questionType === "slider") {
            return {
              question: quest.question,
              question_type: "slider",
              scale_value: answerData?.scale_value || "",
            };
          } else {
            return {
              question: quest.question,
              question_type: "short_text",
              text:
                answerData?.text_response ||
                answerData?.selected_options?.[0] ||
                "",
            };
          }
        })
    );

    const screenerSurveyResponsePayload = {
      screenerId: question._id,
      responses: allFormattedAnswers,
    };

    const paidSurveyResponsePayload = {
      survey_id: question._id,
      respondent_id: respondentId,
      respondent_name: screenerParticipants?.sectionData?.firstName,
      respondent_country: screenerParticipantsGeo?.sectionData?.nationality,
      respondent_email: screenerParticipants?.sectionData?.email,
      answers: allSurveyFormattedAnswers,
    };

    try {
      setLoading(true);
      let isPaidSurvey = false;

      if (!surveyType) {
        await submitScreenerSurvey(
          screenerSurveyResponsePayload,
          question.surveyIds[0]
        );
      } else {
        await submitPaidSurvey(paidSurveyResponsePayload);
        isPaidSurvey = true;
      }
      queryClient.invalidateQueries({
        queryKey: [...[APP_KEYS.UNRESTRICTED_BALANCE]],
      });
      dispatch(closeSurveyFormDialog());
      await fetchApplicationSurveys();
      if (isPaidSurvey) {
        dispatch(openSuccessDialog());
      } else {
        toast.success("Your response was saved successfully");
      }

      setLoading(false);
    } catch (error: any) {
      toast.error(
        error.message || "An error occurred while submitting your response"
      );
    } finally {
      setLoading(false);
    }
  };

  const navigatePage = (direction: any) => {
    setCurrentSection((prevIndex) => {
      if (direction === "next") {
        return prevIndex < question.sections.length - 1
          ? prevIndex + 1
          : prevIndex;
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
    return otherOptions.some(
      (otherOption) => otherOption.toLowerCase() === option.toLowerCase().trim()
    );
  };

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
          fontSize: `${question?.question_text?.size}px`,
        }}
      >
        <motion.div
          variants={slideIn}
          className={cn(
            "flex items-start gap-3 px-4 lg:px-10",
            getFontClass(question?.question_text?.name)
          )}
          style={{
            fontSize: `${question?.question_text?.size}px`,
          }}
        >
          <span className="bg-gradient-to-r font-medium text-lg rounded-full flex items-center justify-center">
            {index + 1}.
          </span>
          <div className="flex-1">
            <p className="font-medium text-lg capitalize">
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
          className="mt-4 px-4 lg:px-10 h-auto"
          style={{
            fontSize: `${question?.question_text?.size}px`,
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
                          fontSize: `${question?.question_text?.size}px`,
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
                            fontSize: `${question?.question_text?.size}px`,
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
                            fontSize: `${question?.question_text?.size}px`,
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
                // console.log(quest);

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
                              fontSize: `${question?.question_text?.size}px`,
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
                  <div className="mb-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full bg-[#FAFAFA] flex justify-between"
                        >
                          {answers[quest.question]?.selected_options?.[0] ||
                            "Select an option"}
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white z-[1000000]"
                        side="bottom"
                        align="start"
                        sideOffset={4}
                      >
                        {quest.options?.map((option: any) => (
                          <DropdownMenuItem
                            key={option}
                            onSelect={() => {
                              handleAnswerChange(quest.question, {
                                selected_options: [option],
                              });
                            }}
                            className="cursor-pointer text-black"
                          >
                            {option}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {answers[quest.question]?.selected_options?.[0] &&
                      isOtherOption(
                        answers[quest.question]?.selected_options?.[0]
                      ) && (
                        <Input
                          type="text"
                          placeholder="Please specify"
                          className="mt-2"
                          value={answers[quest.question]?.other_value || ""}
                          onChange={(e) =>
                            handleAnswerChange(quest.question, {
                              selected_options:
                                answers[quest.question]?.selected_options,
                              other_value: e.target.value,
                            })
                          }
                        />
                      )}
                  </div>
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
                          fontSize: `${question?.question_text?.size}px`,
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
                          fontSize: `${question?.question_text?.size}px`,
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
                        value={answers[quest.question]?.text_response || ""}
                        onChange={(e) => {
                          handleAnswerChange(quest.question, {
                            text: e.target.value,
                          });
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
                  <Input
                    placeholder="Your response here..."
                    className="w-full border mb-4 bg-[#FAFAFA] flex flex-col p-3 gap-3 rounded"
                    value={answers[quest.question]?.text_response || ""}
                    onChange={(e) => {
                      handleAnswerChange(quest.question, {
                        text: e.target.value,
                      });
                    }}
                  />
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
                              fontSize: `${question?.question_text?.size}px`,
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
                      fontSize: `${question?.question_text?.size}px`,
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

  return (
    <div className={`flex flex-col gap-5 w-full`}>
      <div>
        {question && (
          <div
            className={`${question?.theme} max-h-[80vh] overflow-y-auto flex justify-center px-5 lg:px-16 mx-auto gap-10 w-full`}
          >
            <form
              onSubmit={handleSubmitResponse}
              className={` flex flex-col overflow-y-auto custom-scrollbar w-full max-w-screen-lg`}
            >
              {question?.logo_url && (
                <div className="bg-gray-100 w-16 rounded my-5 text-white flex items-center flex-col ">
                  <Image
                    src={question?.logo_url}
                    alt=""
                    className="w-full object-cover rounded bg-no-repeat h-16"
                    width={"100"}
                    height={"200"}
                  />
                </div>
              )}
              {question?.header_url && (
                <div className="bg-gray-100 rounded-lg w-full my-4 text-white h-24 flex items-center flex-col ">
                  <Image
                    src={question?.header_url}
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
                    getFontClass(question?.header_text?.name)
                  )}
                  style={{
                    fontSize: `${question?.header_text?.size}px`,
                  }}
                >
                  {question?.topic || question?.title}
                </h2>
                <p
                  className={cn(
                    "text-gray-600 leading-relaxed",
                    getFontClass(question?.body_text?.name)
                  )}
                  style={{
                    fontSize: `${question?.body_text?.size}px`,
                  }}
                >
                  {question?.description}
                </p>
              </div>

              <AnimatePresence mode="wait">
                <motion.div className="flex flex-col gap-4 h-auto">
                  {question?.sections[currentSection]?.questions?.map(
                    renderQuestion
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex flex-col gap-4 md:flex-row justify-between items-center">
                <div className="flex gap-2 items-center"></div>
                {question?.sections?.length > 1 && (
                  <div className="flex w-full md:w-auto md:justify-end items-center">
                    <PaginationBtn
                      currentSection={currentSection}
                      totalSections={question?.sections?.length}
                      onNavigate={navigatePage}
                    />
                  </div>
                )}
              </div>

              <div className=" rounded-md flex flex-col justify-center w-full md:w-[16rem] py-5 text-center">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#5b03b2] to-[#9d50bb] hover:from-[#4a0291] hover:to-[#8544a0] transition-all duration-300 text-white font-medium"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaidRespondentSurveyResponse;
