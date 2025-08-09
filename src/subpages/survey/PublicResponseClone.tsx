import { pollsensei_new_logo, sparkly } from "@/assets/images";
import StarRating from "@/components/survey/StarRating";
import ResponseFile from "@/components/ui/VoiceRecorder";
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
import PaginationBtn from "@/components/common/PaginationBtn";

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
  questions: Record<string, string | undefined>;
}

const PublicResponse = () => {
  const [answers, setAnswers] = useState<Record<number, Record<string, any>>>(
    {}
  );
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
  const [shouldEndSurvey, setShouldEndSurvey] = useState(false);
  const [showEndSurveyDialog, setShowEndSurveyDialog] = useState(false);
  const [pendingEndSurveyAnswer, setPendingEndSurveyAnswer] = useState<{
    key: string;
    value: any;
  } | null>(null);
  const [endSurveyTriggered, setEndSurveyTriggered] = useState(false);
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

  const question =
    typeof params?.id === "string" && params.id.startsWith("ps-")
      ? psId
      : psShortUrl;

  // Use sections from question?.data?.sections
  const sections = question?.data?.sections || [];

  // Configuration variable for end survey behavior
  // "dialog" - shows confirmation dialog (current behavior)
  // "hide_questions" - hides remaining questions and shows submit button (new behavior)
  const end_survey_type =
    question?.data?.settings?.end_survey_type || "hide_questions";

  // Helper: flatten all questions with section and index info
  const flattenQuestions = (sections: any[]): any[] => {
    const all: any[] = [];
    let globalIndex = 0;
    for (let s = 0; s < sections.length; s++) {
      for (let q = 0; q < sections[s].questions.length; q++) {
        all.push({
          ...sections[s].questions[q],
          sectionIndex: s,
          questionIndex: q,
          globalIndex,
          sectionId: sections[s]._id,
        });
        globalIndex++;
      }
    }
    return all;
  };

  // Logic engine: returns a Set of hidden question _ids
  const evaluateSkipLogic = (
    sections: any[],
    answers: any
  ): {
    hidden: Set<string>;
    hiddenSections: Set<string>;
    endSurvey: boolean;
    jumpToSection?: number;
    jumpToQuestion?: number;
    showActions: Array<{ sectionId: string; sectionIndex: number }>;
  } => {
    const allQuestions = flattenQuestions(sections);
    const hidden = new Set<string>();
    const hiddenSections = new Set<string>();
    let endSurvey = false;
    let jumpToSection: number | undefined;
    let jumpToQuestion: number | undefined;
    const showActions: Array<{ sectionId: string; sectionIndex: number }> = [];

    // Initialize hidden set with questions that have "show" logic (they should be hidden by default)
    // BUT only if the show action targets the question itself, not if it targets a section
    allQuestions.forEach((q) => {
      if (
        q.skip_logic?.some(
          (logic: any) =>
            logic.condition.action.type === "show" &&
            logic.condition.action.target_type !== "section"
        )
      ) {
        hidden.add(q._id);
        console.log(
          `Initializing question as hidden due to show logic: ${q._id} (${q.question})`
        );
      }
    });

    // Initialize hidden sections set with sections that have "show" logic (they should be hidden by default)
    // Also hide sections that are targeted by "show" actions from other questions
    sections.forEach((section, sectionIndex) => {
      // Check if this section has its own show logic
      if (
        section.skip_logic?.some(
          (logic: any) => logic.condition.action.type === "show"
        )
      ) {
        hiddenSections.add(section._id);
        console.log(
          `Initializing section as hidden due to its own show logic: ${
            section._id
          } (${section.section_topic || "Section " + (sectionIndex + 1)})`
        );
      }

      // Check if any question has show logic targeting this section
      const isTargetedByShowLogic = allQuestions.some((q) =>
        q.skip_logic?.some(
          (logic: any) =>
            logic.condition.action.type === "show" &&
            logic.condition.action.target_type === "section" &&
            logic.condition.action.target_id === section._id
        )
      );

      if (isTargetedByShowLogic) {
        hiddenSections.add(section._id);
        console.log(
          `Initializing section as hidden due to show logic from other questions: ${
            section._id
          } (${section.section_topic || "Section " + (sectionIndex + 1)})`
        );
      }
    });

    // Helper to get answer by question _id
    const getAnswer = (qid: string): any => {
      const q = allQuestions.find((q: any) => q._id === qid);
      if (!q) return undefined;
      return answers[q.sectionIndex]?.[q.question];
    };

    // Helper to get question by _id
    const getQuestion = (qid: string): any => {
      return allQuestions.find((q: any) => q._id === qid);
    };

    // Helper to extract value from answer based on question type
    const extractValue = (qid: string, ans: any): any => {
      if (!ans) return undefined;

      const question = getQuestion(qid);
      if (!question) return undefined;

      const questionType = question.question_type;

      console.log(
        `Extracting value for question ${qid} (${questionType}):`,
        ans
      );

      switch (questionType) {
        case "star_rating":
          // Extract numeric value from "4 stars" -> 4
          if (ans.scale_value) {
            const match = ans.scale_value.match(/(\d+)/);
            return match ? parseInt(match[1]) : undefined;
          }
          return undefined;

        case "rating_scale":
        case "likert_scale":
        case "slider":
        case "number":
          // For likert_scale, the value might be the option text itself
          if (ans.scale_value !== undefined) {
            // If it's a string like "Very Unfamiliar", return it as is
            if (typeof ans.scale_value === "string") {
              return ans.scale_value;
            }
            // If it's a number, return as number
            return Number(ans.scale_value);
          }
          return undefined;

        case "multiple_choice":
        case "single_choice":
        case "drop_down":
          return ans.selected_options?.[0];
        case "boolean":
          // For boolean questions, convert boolean_value to string representation
          if (ans.boolean_value === true) return "Yes";
          if (ans.boolean_value === false) return "No";
          return undefined;

        case "checkbox":
          return ans.selected_options;
        case "matrix_multiple_choice":
        case "matrix_checkbox":
          return ans.matrix_answers;

        case "long_text":
        case "short_text":
          return ans.text;

        default:
          return (
            ans.selected_options?.[0] ??
            ans.scale_value ??
            ans.boolean_value ??
            ans.text ??
            ans.drop_down_value ??
            ans.num ??
            ans
          );
      }
    };

    for (const q of allQuestions) {
      for (const logic of q.skip_logic || []) {
        const { logical_operator, rules, action } = logic.condition;
        const ruleResults = (rules || []).map((rule: any) => {
          const ans = getAnswer(rule.source_id);
          const val = extractValue(rule.source_id, ans);

          // Handle "Any answer" special case - this should trigger if there's any answer
          if (rule.value === "Any answer") {
            let hasAnswer = false;

            if (val !== undefined && val !== null) {
              if (Array.isArray(val)) {
                // For arrays (multiple choice, matrix answers), check if array has any elements
                hasAnswer = val.length > 0;
              } else if (typeof val === "string") {
                // For strings, check if not empty after trimming
                hasAnswer = val.trim() !== "";
              } else {
                // For other types (numbers, objects), any truthy value is considered an answer
                hasAnswer = Boolean(val);
              }
            }

            console.log(`"Any answer" rule: hasAnswer=${hasAnswer}, val=`, val);
            return hasAnswer;
          }

          if (val === undefined) return false;

          // Handle array values
          const compareVal = Array.isArray(val) ? val[0] : val;

          // Get the source question to determine comparison type
          const sourceQuestion = getQuestion(rule.source_id);
          const isNumericComparison =
            sourceQuestion &&
            ["star_rating", "rating_scale", "slider", "number"].includes(
              sourceQuestion.question_type
            );

          const isLikertScale =
            sourceQuestion && sourceQuestion.question_type === "likert_scale";

          // Extract numeric value from rule.value for numeric comparisons
          let ruleValue = rule.value;
          if (isNumericComparison && typeof rule.value === "string") {
            // Extract number from "3 stars" -> 3
            const match = rule.value.match(/(\d+)/);
            ruleValue = match ? parseInt(match[1]) : rule.value;
          }

          // For likert_scale, use string comparison
          if (isLikertScale) {
            ruleValue = rule.value; // Keep as string for "Very Unfamiliar"
          }

          console.log(`Rule evaluation:`, {
            sourceId: rule.source_id,
            sourceQuestion: sourceQuestion?.question,
            questionType: sourceQuestion?.question_type,
            compareVal,
            compareValType: typeof compareVal,
            ruleValue,
            ruleValueType: typeof ruleValue,
            operator: rule.operator,
            isNumericComparison,
            isLikertScale,
            rawAnswer: getAnswer(rule.source_id),
          });

          let result;
          switch (rule.operator) {
            case "equals":
              // Handle both string and number comparisons
              result = compareVal == ruleValue; // Use loose equality for type coercion
              break;
            case "notEquals":
              result = compareVal != ruleValue; // Use loose equality for type coercion
              break;
            case "includes":
              result = Array.isArray(val) ? val.includes(ruleValue) : false;
              break;
            case "greaterThan":
              result = Number(compareVal) > Number(ruleValue);
              break;
            case "lessThan":
              result = Number(compareVal) < Number(ruleValue);
              break;
            case "greaterThanOrEqual":
              result = Number(compareVal) >= Number(ruleValue);
              break;
            case "lessThanOrEqual":
              result = Number(compareVal) <= Number(ruleValue);
              break;
            default:
              result = false;
          }

          console.log(`Rule result: ${result} for ${rule.operator} comparison`);

          // Special debug for end_survey logic
          if (action.type === "end_survey") {
            console.log("🔍 END_SURVEY RULE DEBUG:", {
              sourceId: rule.source_id,
              operator: rule.operator,
              compareVal,
              compareValType: typeof compareVal,
              ruleValue,
              ruleValueType: typeof ruleValue,
              result,
              rawAnswer: getAnswer(rule.source_id),
            });
          }

          return result;
        });

        const condMet =
          logical_operator === "and"
            ? ruleResults.every(Boolean)
            : ruleResults.some(Boolean);

        console.log(`Condition evaluation for question ${q.question}:`, {
          ruleResults,
          logical_operator,
          condMet,
          action: action.type,
        });

        if (condMet) {
          console.log(`Skip logic triggered for question ${q.question}:`, {
            action,
            logic,
          });

          if (action.type === "hide") {
            // Check if target is a question or section
            if (action.target_type === "section") {
              // Hide the target section
              hiddenSections.add(action.target_id);
            } else {
              // Hide the question that contains the skip logic (source question)
              hidden.add(q._id);
            }
          } else if (action.type === "show") {
            // Check if target is a question or section
            if (action.target_type === "section") {
              // Show the target section
              hiddenSections.delete(action.target_id);
              const sectionIndex = sections.findIndex(
                (s: any) => s._id === action.target_id
              );
              if (sectionIndex !== -1) {
                showActions.push({ sectionId: action.target_id, sectionIndex });
              }
            } else {
              // Show the question that contains the skip logic (source question)
              hidden.delete(q._id);
            }
          } else if (action.type === "end_survey") {
            console.log("🚨 END_SURVEY TRIGGERED:", {
              triggeringQuestion: q.question,
              triggeringQuestionId: q._id,
              condMet,
              ruleResults,
              rules: logic.condition.rules,
              answers: Object.keys(answers).map((sectionIdx) => ({
                sectionIndex: sectionIdx,
                answers: answers[sectionIdx],
              })),
            });
            endSurvey = true;

            // If end_survey_type is "hide_questions", hide all remaining questions after the current one
            if (end_survey_type === "hide_questions") {
              // Find the current question's global index
              const currentQuestionIndex = q.globalIndex;

              // Hide all questions that come after the current question
              for (
                let i = currentQuestionIndex + 1;
                i < allQuestions.length;
                i++
              ) {
                hidden.add(allQuestions[i]._id);
                console.log(
                  `Hiding question after end survey trigger: ${allQuestions[i].question} (${allQuestions[i]._id})`
                );
              }
            }
          } else if (action.type === "jump_to") {
            // For jump_to actions, hide everything between source and target
            const sourceQuestion = q;
            const sourceGlobalIndex = sourceQuestion.globalIndex;

            if (action.target_type === "section") {
              // Jump to section: hide everything between source question and target section start
              const targetSectionIndex = sections.findIndex(
                (s: any) => s._id === action.target_id
              );

              if (targetSectionIndex !== -1) {
                // Calculate target section's first question global index
                let targetGlobalIndex = 0;
                for (let s = 0; s < targetSectionIndex; s++) {
                  targetGlobalIndex += sections[s].questions.length;
                }

                console.log(
                  `Jump to section: source=${sourceGlobalIndex}, target section start=${targetGlobalIndex}`
                );

                // Hide all questions between source and target section start
                for (
                  let i = sourceGlobalIndex + 1;
                  i < targetGlobalIndex;
                  i++
                ) {
                  if (allQuestions[i]) {
                    hidden.add(allQuestions[i]._id);
                    console.log(
                      `Hiding question ${i}: ${allQuestions[i].question}`
                    );
                  }
                }

                // Hide all sections between source section and target section
                for (
                  let s = sourceQuestion.sectionIndex + 1;
                  s < targetSectionIndex;
                  s++
                ) {
                  if (sections[s]) {
                    hiddenSections.add(sections[s]._id);
                    console.log(
                      `Hiding section ${s}: ${
                        sections[s].section_topic || "Section " + (s + 1)
                      }`
                    );
                  }
                }

                // Don't force target section visibility - respect other skip logic
                // The target section should only be visible if other logic allows it
              }
            } else if (action.target_type === "question") {
              // Jump to specific question: hide everything between source and target question
              const targetQuestion = allQuestions.find(
                (qq: any) => qq._id === action.target_id
              );

              if (targetQuestion) {
                const targetGlobalIndex = targetQuestion.globalIndex;

                console.log(
                  `Jump to question: source=${sourceGlobalIndex}, target=${targetGlobalIndex}`
                );

                // Hide all questions between source and target (exclusive)
                for (
                  let i = sourceGlobalIndex + 1;
                  i < targetGlobalIndex;
                  i++
                ) {
                  if (allQuestions[i]) {
                    hidden.add(allQuestions[i]._id);
                    console.log(
                      `Hiding question ${i}: ${allQuestions[i].question}`
                    );
                  }
                }

                // Hide all sections that are completely between source and target sections
                for (
                  let s = sourceQuestion.sectionIndex + 1;
                  s < targetQuestion.sectionIndex;
                  s++
                ) {
                  if (sections[s]) {
                    hiddenSections.add(sections[s]._id);
                    console.log(
                      `Hiding section ${s}: ${
                        sections[s].section_topic || "Section " + (s + 1)
                      }`
                    );
                  }
                }
              }
            }
          }
        }
      }
    }

    console.log(`Final skip logic result:`, {
      hiddenQuestions: Array.from(hidden),
      hiddenSections: Array.from(hiddenSections),
      endSurvey,
      jumpToSection,
      jumpToQuestion,
      showActions,
    });

    return {
      hidden,
      hiddenSections,
      endSurvey,
      jumpToSection,
      jumpToQuestion,
      showActions,
    };
  };

  // Validate single question
  const validateQuestion = (question: any, value: any) => {
    let error = validateQuestionResponse(question, value);

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
        error = `Please select at least one option for the following rows: ${missingRows.join(
          ", "
        )}`;
      }
    }

    // Update form errors state
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
    activeInput[question] === "textarea" ||
    !!answers[currentSection]?.[question]?.text;

  // Enhanced answer change handler with validation and skip logic
  const handleAnswerChange = (key: string, value: any, question?: any) => {
    setAnswers((prev) => {
      const sectionAnswers = prev[currentSection] || {};
      const updatedSection = { ...sectionAnswers, [key]: value };
      const newAnswers = { ...prev, [currentSection]: updatedSection };

      // Evaluate skip logic after updating answers
      const { endSurvey, jumpToSection, jumpToQuestion, showActions } =
        evaluateSkipLogic(sections, newAnswers);

      // Debug: Log end survey evaluation
      console.log("🎯 ANSWER CHANGE DEBUG:", {
        questionKey: key,
        answerValue: value,
        endSurvey,
        currentAnswers: newAnswers,
        end_survey_type,
      });

      // Handle end survey action based on end_survey_type
      if (endSurvey) {
        if (end_survey_type === "dialog") {
          // Original behavior: show confirmation dialog
          setPendingEndSurveyAnswer({ key, value });
          setShowEndSurveyDialog(true);
          // Revert the answer change until user confirms
          return prev;
        } else if (end_survey_type === "hide_questions") {
          // New behavior: hide remaining questions and allow submit
          setEndSurveyTriggered(true);
          // Apply the answer change immediately
          return newAnswers;
        }
      }

      // Don't automatically navigate - let users choose when to navigate
      // Sections will be shown/hidden based on skip logic, but navigation is manual

      return newAnswers;
    });

    if (question) {
      const error = validateQuestion(question, value);
      // Clear error if question is now valid
      if (!error && formErrors.questions[question.question]) {
        setFormErrors((prev) => {
          const newQuestions = { ...prev.questions };
          delete newQuestions[question.question];
          return {
            ...prev,
            questions: newQuestions,
          };
        });
      }
    }
  };

  const handleMatrixAnswerChange = (
    key: string,
    row: string,
    column: string,
    type: "checkbox" | "radio"
  ) => {
    setAnswers((prev) => {
      const sectionAnswers = prev[currentSection] || {};
      const matrixAnswers = sectionAnswers[key]?.matrix_answers || [];
      let newAnswers;
      if (type === "radio") {
        // For matrix_multiple_choice, allow multiple selections per row
        const existingAnswer = matrixAnswers.find(
          (ans: any) => ans.row === row && ans.column === column
        );
        if (existingAnswer) {
          newAnswers = matrixAnswers.filter(
            (ans: any) => !(ans.row === row && ans.column === column)
          );
        } else {
          newAnswers = [...matrixAnswers, { row, column }];
        }
      } else {
        // For matrix_checkbox, ensure only one selection per row
        const newMatrixAnswers = matrixAnswers.filter(
          (ans: any) => ans.row !== row
        );
        newAnswers = [...newMatrixAnswers, { row, column }];
      }
      const updatedSection = {
        ...sectionAnswers,
        [key]: { matrix_answers: newAnswers },
      };

      const newAnswersState = { ...prev, [currentSection]: updatedSection };

      // Evaluate skip logic after updating answers
      const { endSurvey, jumpToSection, jumpToQuestion, showActions } =
        evaluateSkipLogic(sections, newAnswersState);

      // Handle end survey action based on end_survey_type
      if (endSurvey) {
        if (end_survey_type === "dialog") {
          // Original behavior: show confirmation dialog
          setPendingEndSurveyAnswer({
            key,
            value: { matrix_answers: newAnswers },
          });
          setShowEndSurveyDialog(true);
          // Revert the answer change until user confirms
          return prev;
        } else if (end_survey_type === "hide_questions") {
          // New behavior: hide remaining questions and allow submit
          setEndSurveyTriggered(true);
          // Apply the answer change immediately
          return newAnswersState;
        }
      }

      // Don't automatically navigate - let users choose when to navigate
      // Sections will be shown/hidden based on skip logic, but navigation is manual

      // Validate
      const error = validateQuestion(
        {
          question: key,
          question_type:
            type === "radio" ? "matrix_multiple_choice" : "matrix_checkbox",
          rows: sectionAnswers[key]?.rows,
        },
        updatedSection[key]
      );

      // Clear error if question is now valid
      if (!error && formErrors.questions[key]) {
        setFormErrors((prev) => {
          const newQuestions = { ...prev.questions };
          delete newQuestions[key];
          return {
            ...prev,
            questions: newQuestions,
          };
        });
      }
      return newAnswersState;
    });
  };

  const isMatrixOptionSelected = (
    question: string,
    row: string,
    column: string
  ) => {
    return answers[currentSection]?.[question]?.matrix_answers?.some(
      (ans: any) => ans.row === row && ans.column === column
    );
  };

  // Handle end survey confirmation
  const handleConfirmEndSurvey = () => {
    if (pendingEndSurveyAnswer) {
      // Apply the pending answer change
      setAnswers((prev) => {
        const sectionAnswers = prev[currentSection] || {};
        const updatedSection = {
          ...sectionAnswers,
          [pendingEndSurveyAnswer.key]: pendingEndSurveyAnswer.value,
        };
        const newAnswers = { ...prev, [currentSection]: updatedSection };
        return newAnswers;
      });

      // End the survey
      setShouldEndSurvey(true);
      setSubmitSurveySuccess(true);
    }

    // Close the dialog
    setShowEndSurveyDialog(false);
    setPendingEndSurveyAnswer(null);
  };

  // Handle cancel end survey
  const handleCancelEndSurvey = () => {
    setShowEndSurveyDialog(false);
    setPendingEndSurveyAnswer(null);
  };

  const handleAudioToggle = (question: string) => {
    setShowAudio((prev) => {
      const newState = { ...prev, [question]: !prev[question] };
      // Reset answers for this question when toggling
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [currentSection]: {
          ...prevAnswers[currentSection],
          [question]: {},
        },
      }));
      return newState;
    });
  };

  console.log(question?.data?.settings);

  useEffect(() => {
    if (question?.data?.sections) {
      setSelectedOptions(new Array(question.data.sections.length).fill(null));
      setTextResponses(new Array(question.data.sections.length).fill(""));
    }
  }, [question]);

  // Evaluate skip logic when sections or answers change (only for jump logic, not end survey)
  useEffect(() => {
    if (
      sections.length > 0 &&
      !shouldEndSurvey &&
      !showEndSurveyDialog &&
      !endSurveyTriggered
    ) {
      const { jumpToSection } = evaluateSkipLogic(sections, answers);

      // Handle jump to action
      if (jumpToSection !== undefined && jumpToSection !== currentSection) {
        setCurrentSection(jumpToSection);
      }
    }
  }, [
    sections,
    answers,
    currentSection,
    shouldEndSurvey,
    showEndSurveyDialog,
    endSurveyTriggered,
  ]);

  // Returns visible questions for the current section
  const getVisibleQuestions = (
    sections: any[],
    answers: any,
    currentSection: number
  ): any[] => {
    const { hidden, hiddenSections } = evaluateSkipLogic(sections, answers);

    // Check if the current section is hidden
    const currentSectionData = sections[currentSection];
    if (currentSectionData && hiddenSections.has(currentSectionData._id)) {
      console.log(`Section ${currentSection} is hidden by skip logic`);
      return [];
    }

    const visibleQuestions = sections[currentSection]?.questions.filter(
      (q: any) => !hidden.has(q._id)
    );

    console.log(`Section ${currentSection} - Visible questions:`, {
      total: sections[currentSection]?.questions.length,
      visible: visibleQuestions.length,
      hidden:
        sections[currentSection]?.questions.length - visibleQuestions.length,
      hiddenIds: Array.from(hidden),
      sectionHidden: hiddenSections.has(currentSectionData?._id || ""),
    });

    return visibleQuestions;
  };

  // Helper function to check if a section is visible (not hidden by skip logic)
  const isSectionVisible = (sectionIndex: number): boolean => {
    const { hiddenSections } = evaluateSkipLogic(sections, answers);
    const sectionData = sections[sectionIndex];
    return !(sectionData && hiddenSections.has(sectionData._id));
  };

  // Helper function to get the next visible section
  const getNextVisibleSection = (currentSectionIndex: number): number => {
    for (let i = currentSectionIndex + 1; i < sections.length; i++) {
      if (isSectionVisible(i)) {
        return i;
      }
    }
    return currentSectionIndex; // Return current if no next visible section found
  };

  // Helper function to get the previous visible section
  const getPreviousVisibleSection = (currentSectionIndex: number): number => {
    for (let i = currentSectionIndex - 1; i >= 0; i--) {
      if (isSectionVisible(i)) {
        return i;
      }
    }
    return currentSectionIndex; // Return current if no previous visible section found
  };

  // Helper function to get total number of visible sections
  const getVisibleSectionsCount = (): number => {
    return sections.filter((_: any, index: number) => isSectionVisible(index))
      .length;
  };

  // Helper function to get current visible section index (among visible sections only)
  const getCurrentVisibleSectionIndex = (): number => {
    let visibleIndex = 0;
    for (let i = 0; i <= currentSection; i++) {
      if (isSectionVisible(i)) {
        if (i === currentSection) {
          return visibleIndex;
        }
        visibleIndex++;
      }
    }
    return 0;
  };

  // Helper function to check if a section has validation errors
  const getSectionValidationStatus = (sectionIndex: number) => {
    const visibleQuestions = getVisibleQuestions(
      sections,
      answers,
      sectionIndex
    );
    const hasErrors = visibleQuestions.some((quest: any) => {
      if (!quest.is_required) return false;
      const error = validateQuestionResponse(
        quest,
        answers[sectionIndex]?.[quest.question]
      );
      return !!error;
    });

    return {
      hasErrors,
      errorCount: visibleQuestions.filter((quest: any) => {
        if (!quest.is_required) return false;
        const error = validateQuestionResponse(
          quest,
          answers[sectionIndex]?.[quest.question]
        );
        return !!error;
      }).length,
    };
  };

  // Auto submit function for skip logic end survey

  // No automatic navigation - users stay on whatever section they're on
  // Sections become visible/hidden based on skip logic, but navigation is completely manual

  // Validate all required questions in all sections (only visible questions)
  const isAllRequiredAnswered = React.useMemo(() => {
    if (!sections.length) return false;

    // Check all sections for visible required questions
    for (let s = 0; s < sections.length; s++) {
      const visibleQuestions = getVisibleQuestions(sections, answers, s);
      for (const quest of visibleQuestions) {
        if (quest.is_required) {
          const error = validateQuestionResponse(
            quest,
            answers[s]?.[quest.question]
          );
          if (error) return false;
        }
      }
    }

    // Check respondent info if required
    if (question?.data?.settings?.collect_email_addresses && !respondent_email)
      return false;
    if (
      question?.data?.settings?.collect_name_of_respondents &&
      !respondent_name
    )
      return false;
    return true;
  }, [
    sections,
    answers,
    respondent_email,
    respondent_name,
    question,
    endSurveyTriggered,
  ]);

  // Enhanced submit handler with comprehensive validation
  const handleSubmitResponse = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // Always submit the form normally, regardless of end survey state
    // The end survey confirmation should only happen when answering questions, not when submitting

    const allSections = question?.data?.sections || [];
    if (!allSections.length) {
      toast.warning("No sections found in this survey");
      return;
    }

    // Initialize validation errors
    const newFormErrors: FormErrors = {
      questions: {},
    };

    // Validate respondent information if required
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

    // Validate all visible questions across all sections
    let hasValidationErrors = false;
    const allVisibleQuestions: any[] = [];

    for (let sIdx = 0; sIdx < allSections.length; sIdx++) {
      const visibleQuestions = getVisibleQuestions(sections, answers, sIdx);

      visibleQuestions.forEach((quest: any) => {
        allVisibleQuestions.push({
          ...quest,
          sectionIndex: sIdx,
        });

        // Only validate required questions
        if (quest.is_required) {
          const answer = answers[sIdx]?.[quest.question];
          const error = validateQuestionResponse(quest, answer);

          if (error) {
            newFormErrors.questions[quest.question] = error;
            hasValidationErrors = true;
            console.log(
              `Validation error in section ${sIdx + 1}: ${
                quest.question
              } - ${error}`
            );
          }
        }
      });
    }

    console.log("Validation summary:", {
      totalVisibleQuestions: allVisibleQuestions.length,
      requiredQuestions: allVisibleQuestions.filter((q) => q.is_required)
        .length,
      validationErrors: Object.keys(newFormErrors.questions).length,
      hasErrors: hasValidationErrors,
    });

    // Update form errors state
    setFormErrors(newFormErrors);

    // Check if there are any validation errors
    if (
      hasValidationErrors ||
      newFormErrors.respondent_email ||
      newFormErrors.respondent_name
    ) {
      // Create a more detailed error message
      const errorSections = new Set<number>();
      Object.keys(newFormErrors.questions).forEach((questionName) => {
        const question = allVisibleQuestions.find(
          (q) => q.question === questionName
        );
        if (question) {
          errorSections.add(question.sectionIndex + 1);
        }
      });

      const sectionList = Array.from(errorSections)
        .sort((a: number, b: number) => a - b)
        .join(", ");
      const errorMessage =
        errorSections.size > 0
          ? `Please fix validation errors in section(s): ${sectionList}`
          : "Please fix the validation errors before submitting";

      toast.error(errorMessage);

      // If there are errors in the current section, stay on it
      // If there are errors in other sections, navigate to the first section with errors
      const firstErrorSection = allVisibleQuestions.find(
        (quest: any) => newFormErrors.questions[quest.question]
      )?.sectionIndex;

      if (
        firstErrorSection !== undefined &&
        firstErrorSection !== currentSection
      ) {
        setCurrentSection(firstErrorSection);
      }

      return;
    }

    // Format answers for submission (only visible questions)
    const formattedAnswers = allVisibleQuestions.map((quest: any) => {
      const answer = answers[quest.sectionIndex]?.[quest.question];
      const formattedAnswer = {
        question: quest.question,
        question_type: quest.question_type,
        ...answer,
      };

      // Add duration field for long text with media URL
      if (quest.question_type === "long_text" && answer?.media_url) {
        formattedAnswer.duration = answer.duration || 0;
      }

      return formattedAnswer;
    });

    // Submit response
    const responsePayload: any = {
      survey_id: question?.data?._id,
      answers: formattedAnswers,
    };

    if (
      question?.data?.settings?.collect_name_of_respondents &&
      respondent_name
    ) {
      responsePayload.respondent_name = respondent_name;
    }

    if (question?.data?.settings?.collect_email_addresses && respondent_email) {
      responsePayload.respondent_email = respondent_email;
    }

    try {
      await submitPublicResponse(responsePayload).unwrap();
      toast.success("Your response was saved successfully");
      setSubmitSurveySuccess(true);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while submitting your response");
    }
  };

  // Update navigatePage to use sections and skip logic
  const navigatePage = (direction: "next" | "prev") => {
    setCurrentSection((prevIndex) => {
      if (direction === "next") {
        return getNextVisibleSection(prevIndex);
      } else {
        return getPreviousVisibleSection(prevIndex);
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
                        className="flex items-center font-normal p-3 gap-3 rounded-lg hover:bg-gray-50 transition-colors"
                        style={{
                          fontSize: `${question?.data?.question_text?.size}px`,
                        }}
                      >
                        <Checkbox
                          id={`${quest.question}-${option}`}
                          value={option}
                          checked={answers[currentSection]?.[
                            quest.question
                          ]?.selected_options?.includes(option)}
                          onCheckedChange={(checked) =>
                            handleAnswerChange(
                              quest.question,
                              {
                                selected_options: checked
                                  ? [
                                      ...(answers[currentSection]?.[
                                        quest.question
                                      ]?.selected_options || []),
                                      option,
                                    ]
                                  : (
                                      answers[currentSection]?.[quest.question]
                                        ?.selected_options || []
                                    ).filter((opt: string) => opt !== option),
                              },
                              quest
                            )
                          }
                          className="size-4 sm:size-5"
                        />
                        <Label
                          htmlFor={`${quest.question}-${option}`}
                          className="flex-1 cursor-pointer font-normal"
                          style={{
                            fontSize: `clamp(0.75rem, ${question?.data?.question_text?.size}px, 0.875rem)`,
                          }}
                        >
                          {option}
                        </Label>
                      </motion.div>
                    ))}
                    {answers[currentSection]?.[
                      quest.question
                    ]?.selected_options?.some(isOtherOption) && (
                      <Input
                        type="text"
                        placeholder="Please specify"
                        className="mt-2"
                        value={
                          answers[currentSection]?.[quest.question]
                            ?.other_value || ""
                        }
                        onChange={(e) =>
                          handleAnswerChange(quest.question, {
                            ...answers[currentSection]?.[quest.question],
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
                    value={
                      answers[currentSection]?.[quest.question]
                        ?.selected_options?.[0]
                    }
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
                          style={{
                            fontSize: `clamp(0.75rem, ${question?.data?.question_text?.size}px, 0.875rem)`,
                          }}
                        >
                          {option}
                        </Label>
                      </motion.div>
                    ))}
                    {answers[currentSection]?.[
                      quest.question
                    ]?.selected_options?.some(isOtherOption) && (
                      <Input
                        type="text"
                        placeholder="Please specify"
                        className="mt-2"
                        value={
                          answers[currentSection]?.[quest.question]
                            ?.other_value || ""
                        }
                        onChange={(e) =>
                          handleAnswerChange(quest.question, {
                            ...answers[currentSection]?.[quest.question],
                            other_value: e.target.value,
                          })
                        }
                      />
                    )}
                  </RadioGroup>
                );

              case "likert_scale":
                return (
                  <RadioGroup
                    className="mb-4 bg-white w-full p-4 sm:p-6 px-0 sm:px-0 rounded-lg transition-all duration-300"
                    value={
                      answers[currentSection]?.[quest.question]?.scale_value ||
                      ""
                    }
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
                              fontSize: `clamp(0.75rem, ${question?.data?.question_text?.size}px, 0.875rem)`,
                            }}
                          >
                            {option}
                          </Label>
                        </motion.div>
                      ))}
                    </div>
                    {answers[currentSection]?.[quest.question]?.scale_value &&
                      isOtherOption(
                        answers[currentSection]?.[quest.question]?.scale_value
                      ) && (
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
                            value={
                              answers[currentSection]?.[quest.question]
                                ?.other_value || ""
                            }
                            onChange={(e) =>
                              handleAnswerChange(quest.question, {
                                ...answers[currentSection]?.[quest.question],
                                other_value: e.target.value,
                              })
                            }
                          />
                        </motion.div>
                      )}
                  </RadioGroup>
                );

              case "drop_down":
                return (
                  <>
                    <Select
                      value={
                        answers[currentSection]?.[quest.question]
                          ?.drop_down_value || ""
                      }
                      onValueChange={(value) =>
                        handleAnswerChange(quest.question, {
                          drop_down_value: value,
                        })
                      }
                    >
                      <SelectTrigger
                        className="mb-4 bg-[#FAFAFA] w-full"
                        style={{
                          fontSize: `clamp(0.75rem, ${question?.data?.question_text?.size}px, 0.875rem)`,
                        }}
                      >
                        <SelectValue
                          placeholder="Select an option"
                          style={{
                            fontSize: `clamp(0.75rem, ${question?.data?.question_text?.size}px, 0.875rem)`,
                          }}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {quest.options?.map((option: any) => (
                          <SelectItem
                            key={option}
                            value={option}
                            style={{
                              fontSize: `clamp(0.75rem, ${question?.data?.question_text?.size}px, 0.875rem)`,
                            }}
                          >
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {answers[currentSection]?.[quest.question]
                      ?.drop_down_value &&
                      isOtherOption(
                        answers[currentSection]?.[quest.question]
                          ?.drop_down_value
                      ) && (
                        <Input
                          type="text"
                          placeholder="Please specify"
                          className="mt-2"
                          value={
                            answers[currentSection]?.[quest.question]
                              ?.other_value || ""
                          }
                          onChange={(e) =>
                            handleAnswerChange(quest.question, {
                              ...answers[currentSection]?.[quest.question],
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
                    value={
                      answers[currentSection]?.[quest.question]
                        ?.boolean_value === true
                        ? "true"
                        : answers[currentSection]?.[quest.question]
                            ?.boolean_value === false
                        ? "false"
                        : ""
                    }
                    onValueChange={(value) =>
                      handleAnswerChange(quest.question, {
                        boolean_value: value === "true",
                      })
                    }
                    required={quest.is_required}
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4 p-2 sm:p-3 rounded-md transition-colors duration-200 hover:bg-gray-50">
                      <RadioGroupItem
                        value="true"
                        id={`${quest.question}-yes`}
                        className="size-4 sm:size-5"
                      />
                      <Label
                        htmlFor={`${quest.question}-yes`}
                        className="font-normal cursor-pointer select-none transition-colors duration-200 hover:text-[#5B03B2]"
                        style={{
                          fontSize: `clamp(0.75rem, ${question?.data?.question_text?.size}px, 0.875rem)`,
                        }}
                      >
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 sm:space-x-4 p-2 sm:p-3 rounded-md transition-colors duration-200">
                      <RadioGroupItem
                        value="false"
                        id={`${quest.question}-no`}
                        className="size-4 sm:size-5"
                      />
                      <Label
                        htmlFor={`${quest.question}-no`}
                        className="font-normal cursor-pointer select-none transition-colors duration-200 hover:text-[#5B03B2]"
                        style={{
                          fontSize: `clamp(0.75rem, ${question?.data?.question_text?.size}px, 0.875rem)`,
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
                        value={
                          answers[currentSection]?.[quest.question]?.text || ""
                        }
                        onChange={(e) =>
                          handleAnswerChange(quest.question, {
                            text: e.target.value,
                          })
                        }
                        style={{
                          fontSize: `clamp(0.75rem, ${question?.data?.question_text?.size}px, 0.875rem)`,
                        }}
                      />
                    ) : (
                      <PublicResponseFile
                        question={quest.question}
                        handleAnswerChange={handleAnswerChange}
                        selectedValue={
                          answers[currentSection]?.[quest.question]
                            ?.media_url || ""
                        }
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
                      value={
                        answers[currentSection]?.[quest.question]?.text || ""
                      }
                      onChange={(e) =>
                        handleAnswerChange(quest.question, {
                          text: e.target.value,
                        })
                      }
                      style={{
                        fontSize: `clamp(0.75rem, ${question?.data?.question_text?.size}px, 0.875rem)`,
                      }}
                    />
                  </div>
                );

              case "star_rating":
                return (
                  <div className="px-4">
                    <StarRating
                      question={quest.question}
                      options={quest.options}
                      handleAnswerChange={handleAnswerChange}
                      selectedValue={
                        answers[currentSection]?.[quest.question]
                          ?.scale_value || ""
                      }
                      required={quest.is_required}
                    />
                  </div>
                );

              case "rating_scale":
                return (
                  <RadioGroup
                    className="mb-4 bg-[#FAFAFA] flex flex-col w-full p-3 gap-3 rounded"
                    value={
                      answers[currentSection]?.[quest.question]?.scale_value ||
                      ""
                    }
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
                              fontSize: `clamp(0.75rem, ${question?.data?.question_text?.size}px, 0.875rem)`,
                            }}
                          >
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {answers[currentSection]?.[quest.question]?.scale_value &&
                      isOtherOption(
                        answers[currentSection]?.[quest.question]?.scale_value
                      ) && (
                        <Input
                          type="text"
                          placeholder="Please specify"
                          className="mt-2"
                          value={
                            answers[currentSection]?.[quest.question]
                              ?.other_value || ""
                          }
                          onChange={(e) =>
                            handleAnswerChange(quest.question, {
                              ...answers[currentSection]?.[quest.question],
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
                                fontSize: `clamp(0.75rem, ${question?.data?.question_text?.size}px, 0.875rem)`,
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
                                fontSize: `clamp(0.75rem, ${question?.data?.question_text?.size}px, 0.875rem)`,
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

              case "slider":
                return (
                  <div className="w-full px-4">
                    <Slider
                      value={
                        answers[currentSection]?.[quest.question]
                          ?.scale_value !== undefined
                          ? [
                              Number(
                                answers[currentSection][quest.question]
                                  .scale_value
                              ),
                            ]
                          : [quest.min ?? 0]
                      }
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
                      {(() => {
                        const step = quest.step || 1;
                        const min = quest.min ?? 0;
                        const max = quest.max ?? 10;
                        const values = [];
                        for (let v = min; v <= max; v += step) {
                          // Avoid floating point issues
                          values.push(Number(v.toFixed(5)));
                        }
                        let markers;
                        if (values.length <= 20) {
                          markers = values;
                        } else {
                          markers = [
                            min,
                            ...[0.25, 0.5, 0.75].map((f) =>
                              Number((min + (max - min) * f).toFixed(2))
                            ),
                            max,
                          ];
                        }
                        return markers.map((value, i) => (
                          <div
                            key={i}
                            className="flex flex-col items-center"
                            style={{ width: "2px", position: "relative" }}
                          >
                            <div className="h-2 w-[2px] bg-gray-300"></div>
                            <span
                              style={{
                                fontSize: `clamp(0.75rem, ${question?.data?.question_text?.size}px, 0.875rem)`,
                                marginTop: "4px",
                              }}
                            >
                              {value}
                            </span>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                );

              case "number":
                return (
                  <Input
                    className="mb-4 bg-[#FAFAFA] flex flex-col w-full p-3 gap-3 rounded"
                    placeholder={`Enter a number`}
                    type="number"
                    min={quest.min}
                    max={quest.max}
                    value={
                      answers[currentSection]?.[quest.question]?.num !==
                      undefined
                        ? answers[currentSection][quest.question].num
                        : ""
                    }
                    onChange={(e) =>
                      handleAnswerChange(quest.question, {
                        num: Number(e.target.value),
                      })
                    }
                    style={{
                      fontSize: `clamp(0.75rem, ${question?.data?.question_text?.size}px, 0.875rem)`,
                    }}
                  />
                );

              case "media":
                return (
                  <div className="flex flex-col">
                    <ResponseFile
                      question={quest.question}
                      handleAnswerChange={handleAnswerChange}
                      selectedValue={
                        answers[currentSection]?.[quest.question]?.media_url ||
                        ""
                      }
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

  // Add type guard helper
  const isFetchBaseQueryError = (
    error: any
  ): error is { data: { message: string } } => {
    if (!error || typeof error !== "object") return false;
    return (
      "data" in error &&
      typeof error.data === "object" &&
      error.data !== null &&
      "message" in error.data &&
      typeof error.data.message === "string"
    );
  };

  console.log(question);

  // Scroll to top on section change
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentSection]);

  return (
    <div className={`flex flex-col gap-5 w-full`}>
      {(psIdLoading || psShUrLoading) && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
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
      {showEndSurveyDialog && (
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
                <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl animate-pulse" />
                <div className="text-orange-500 text-7xl mb-6 relative z-10 drop-shadow-lg">
                  ⚠️
                </div>
              </motion.div>

              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold mb-3 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent"
              >
                Survey Will End
              </motion.h1>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 text-lg mb-8 text-center"
              >
                Based on your answer, this survey will end immediately. Are you
                sure you want to continue?
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex gap-4 w-full"
              >
                <Button
                  onClick={handleCancelEndSurvey}
                  variant="outline"
                  className="flex-1 relative inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 hover:bg-gray-100 h-10 px-4 py-2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmEndSurvey}
                  className="flex-1 relative inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-orange-500 to-red-500 text-white h-10 px-4 py-2 hover:opacity-90"
                >
                  End Survey
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
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
              className={`${question?.data?.theme} min-h-screen flex justify-center px-5 bg-fixed lg:px-16 mx-auto gap-10 w-full relative z-20 bg-gray-50`}
            >
              <form
                onSubmit={handleSubmitResponse}
                className={`flex flex-col relative custom-scrollbar w-full max-w-screen-lg pb-20`}
              >
                {question?.data?.logo_url && (
                  <div className="bg-gray-100 w-16 sm:w-20 md:w-24 rounded my-3 sm:my-4 md:my-5 text-white flex items-center flex-col">
                    <Image
                      src={question?.data?.logo_url}
                      alt="Survey Logo"
                      className="w-full object-cover rounded bg-no-repeat h-16 sm:h-20 md:h-24"
                      width={100}
                      height={100}
                      priority
                    />
                  </div>
                )}
                {question?.data?.header_url && (
                  <div className="bg-gray-100 rounded-lg w-full my-3 sm:my-4 text-white h-16 sm:h-20 md:h-24 flex items-center flex-col">
                    <Image
                      src={question?.data?.header_url}
                      alt="Survey Header"
                      className="w-full object-cover bg-no-repeat h-full rounded-lg"
                      width={800}
                      height={200}
                      priority
                    />
                  </div>
                )}

                {/* Validation Error Summary */}
                {Object.keys(formErrors.questions).length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <svg
                        className="w-5 h-5 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      <h3 className="text-red-800 font-medium">
                        Please fix the following errors:
                      </h3>
                    </div>
                    <ul className="text-sm text-red-700 space-y-1">
                      {Object.entries(formErrors.questions).map(
                        ([question, error]) => (
                          <li key={question} className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">•</span>
                            <span>
                              <strong>{question}:</strong> {error}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </motion.div>
                )}

                <div className="bg-white rounded-lg w-full my-3 sm:my-4 flex gap-2 px-4 sm:px-8 md:px-11 py-3 sm:py-4 flex-col">
                  <h2
                    className={cn(
                      "font-normal bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] bg-clip-text text-transparent",
                      getFontClass(
                        (
                          sections[currentSection]?.header_text ||
                          question?.data?.header_text
                        )?.name
                      )
                    )}
                    style={{
                      fontSize: `clamp(1.25rem, ${
                        (
                          sections[currentSection]?.header_text ||
                          question?.data?.header_text
                        )?.size
                      }px, 2rem)`,
                    }}
                  >
                    {sections[currentSection]?.section_topic ||
                      question?.data?.topic}
                  </h2>
                  <p
                    className={cn(
                      "text-gray-600",
                      getFontClass(
                        (
                          sections[currentSection]?.body_text ||
                          question?.data?.body_text
                        )?.name
                      )
                    )}
                    style={{
                      fontSize: `clamp(0.875rem, ${
                        (
                          sections[currentSection]?.body_text ||
                          question?.data?.body_text
                        )?.size
                      }px, 1.125rem)`,
                    }}
                  >
                    {sections[currentSection]?.section_description ||
                      question?.data?.description}
                  </p>
                </div>

                {(question?.data?.settings?.collect_name_of_respondents ||
                  question?.data?.settings?.collect_email_addresses) && (
                  <div
                    className={cn(
                      "flex flex-col gap-2 w-full bg-white px-4 sm:px-8 md:px-11 py-3 sm:py-4 rounded-lg mb-4",
                      getFontClass(question?.data?.body_text?.name)
                    )}
                  >
                    {question?.data?.settings?.collect_name_of_respondents && (
                      <div className="flex flex-col w-full">
                        <Label
                          htmlFor="full_name"
                          className="text-sm sm:text-base mb-1"
                        >
                          Full name{" "}
                          {question?.data?.settings
                            ?.collect_name_of_respondents && (
                            <span className="text-red-500 text-base">*</span>
                          )}
                        </Label>
                        <Input
                          id="full_name"
                          type="text"
                          className={`border-0 border-b rounded-none ring-0 active:border-none focus:border-none py-1 px-0 outline-none text-sm sm:text-base ${
                            formErrors.respondent_name ? "border-red-500" : ""
                          }`}
                          required={
                            question?.data?.settings
                              ?.collect_name_of_respondents
                          }
                          onChange={(e) => {
                            setRespondent_name(e.target.value);
                            if (formErrors.respondent_name) {
                              setFormErrors((prev) => ({
                                ...prev,
                                respondent_name: undefined,
                              }));
                            }
                          }}
                          value={respondent_name}
                        />
                        {formErrors.respondent_name && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors.respondent_name}
                          </p>
                        )}
                      </div>
                    )}
                    {question?.data?.settings?.collect_email_addresses && (
                      <div className="flex flex-col w-full mt-3 sm:mt-4">
                        <Label
                          htmlFor="email"
                          className="text-sm sm:text-base mb-1"
                        >
                          Email{" "}
                          <span className="text-red-500 text-base">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          className={`border-0 border-b rounded-none ring-0 active:border-none focus:border-none py-1 px-0 outline-none text-sm sm:text-base ${
                            formErrors.respondent_email ? "border-red-500" : ""
                          }`}
                          required={
                            question?.data?.settings?.collect_email_addresses
                          }
                          onChange={(e) => {
                            setRespondent_email(e.target.value);
                            if (formErrors.respondent_email) {
                              setFormErrors((prev) => ({
                                ...prev,
                                respondent_email: undefined,
                              }));
                            }
                          }}
                          value={respondent_email}
                        />
                        {formErrors.respondent_email && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors.respondent_email}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
                <AnimatePresence mode="wait">
                  <motion.div className="flex flex-col gap-4">
                    {getVisibleQuestions(sections, answers, currentSection).map(
                      (quest: any, index: number) =>
                        renderQuestion(quest, index, question?.data?.theme)
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Sticky PaginationBtn */}
                {getVisibleSectionsCount() > 1 && (
                  <div className="flex w-full md:w-auto md:justify-end items-center mb-6 mt-10 sticky bottom-10 z-30">
                    <PaginationBtn
                      currentSection={getCurrentVisibleSectionIndex()}
                      totalSections={getVisibleSectionsCount()}
                      onNavigate={navigatePage}
                    />
                  </div>
                )}

                {/* Show submit button on last visible section */}
                {(currentSection === sections.length - 1 ||
                  getNextVisibleSection(currentSection) === currentSection) && (
                  <div className="rounded-full flex flex-col justify-center w-full py-5 text-center">
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r rounded-full from-[#5b03b2] h-12 to-[#9d50bb] hover:from-[#4a0291] hover:to-[#8544a0] transition-all duration-300 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={submitting || !isAllRequiredAnswered}
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

                    {/* Show validation status */}
                    {!isAllRequiredAnswered && (
                      <p className="text-sm text-orange-600 mt-2">
                        Please complete all required questions before submitting
                      </p>
                    )}
                  </div>
                )}
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
      {(errorSubmitting || psId?.error || psShortUrl?.error) && (
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
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full mx-4 shadow-[0_0_50px_rgba(255,0,0,0.25)] border border-red-100"
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl" />
                <svg
                  className="w-12 h-12 text-red-500 relative z-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Error</h3>
              <p className="text-gray-600">
                {(isFetchBaseQueryError(errorSubmitting)
                  ? errorSubmitting.data.message
                  : null) ||
                  (isFetchBaseQueryError(psId?.error)
                    ? psId.error.data.message
                    : null) ||
                  (isFetchBaseQueryError(psShortUrl?.error)
                    ? psShortUrl.error.data.message
                    : null) ||
                  "An unexpected error occurred. Please try again later."}
              </p>
              <Button
                onClick={() => router.refresh()}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white"
              >
                Try Again
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default PublicResponse;
