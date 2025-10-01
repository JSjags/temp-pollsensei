import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/shadcn-input";
import { v4 as uuidv4 } from "uuid";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  GitBranch,
  ArrowRight,
  Pencil,
  Trash2,
  Info,
  Check,
  ChevronDown,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import axiosInstancev3 from "@/lib/axios-instance-v3";
import axiosInstance from "@/lib/axios-instance";

/*
 * Example usage of transformSurveySkipLogic function:
 *
 * const surveyData = {
 *   "_id": "688c6ef4c1f4639c2cd2fe4a",
 *   "sections": [
 *     {
 *       "questions": [
 *         {
 *           "_id": "688c6ef4c1f4639c2cd2fe35",
 *           "question": "How familiar are you with AI and HI?",
 *           "question_type": "likert_scale",
 *           "skip_logic": []
 *         },
 *         {
 *           "_id": "688c6ef4c1f4639c2cd2fe36",
 *           "question": "Which has more potential: AI or HI?",
 *           "question_type": "single_choice",
 *           "skip_logic": [
 *             {
 *               "logic_type": "display_logic",
 *               "condition": {
 *                 "logical_operator": "and",
 *                 "rules": [
 *                   {
 *                     "source_id": "688c6ef4c1f4639c2cd2fe35",
 *                     "operator": "equals",
 *                     "value": "Neutral"
 *                   }
 *                 ],
 *                 "action": {
 *                   "type": "hide",
 *                   "target_type": "question",
 *                   "target_id": "688c6ef4c1f4639c2cd2fe35"
 *                 }
 *               }
 *             }
 *           ]
 *         }
 *       ]
 *     }
 *   ]
 * };
 *
 * const transformedSkipLogic = transformSurveySkipLogic(surveyData);
 * // This will properly map the source_id and target_id to section and question indices
 */

// Types
export type SkipLogicRule = {
  id: string;
  from: { sectionIndex: number; questionIndex: number; answer: string };
  to: { sectionIndex: number; questionIndex: number | null } | { end: true };
};

interface Section {
  section_topic?: string;
  section_description?: string;
  questions: any[];
  header_text?: { name: string; size: number };
  body_text?: { name: string; size: number };
}

interface SkipLogicEditorProps {
  sections: Section[];
  skipLogic: (SkipLogicRule | SkipLogicRuleV2)[];
  onChange: (rules: (SkipLogicRule | SkipLogicRuleV2)[]) => void;
  readOnly?: boolean;
}

// --- Operator mapping by question type ---
const operatorMap: Record<string, string[]> = {
  multiple_choice: ["equals", "notEquals"],
  single_choice: ["equals", "notEquals"],
  drop_down: ["equals", "notEquals"],
  multi_choice: ["includes", "notIncludes", "equals", "notEquals"],
  checkbox: ["includes", "notIncludes", "equals", "notEquals"],
  matrix_multiple_choice: ["includes", "notIncludes", "equals", "notEquals"],
  matrix_checkbox: ["includes", "notIncludes", "equals", "notEquals"],
  comment: ["equals", "notEquals", "includes", "notIncludes"],
  long_text: ["equals", "notEquals", "includes", "notIncludes"],
  short_text: ["equals", "notEquals", "includes", "notIncludes"],
  number: [
    "equals",
    "notEquals",
    "greaterThan",
    "lessThan",
    "greaterThanOrEqual",
    "lessThanOrEqual",
  ],
  slider: [
    "equals",
    "notEquals",
    "greaterThan",
    "lessThan",
    "greaterThanOrEqual",
    "lessThanOrEqual",
  ],
  Linear_Scale: [
    "equals",
    "notEquals",
    "greaterThan",
    "lessThan",
    "greaterThanOrEqual",
    "lessThanOrEqual",
  ],
  linear_Scale: [
    "equals",
    "notEquals",
    "greaterThan",
    "lessThan",
    "greaterThanOrEqual",
    "lessThanOrEqual",
  ],
  likert_scale: [
    "equals",
    "notEquals",
    // "greaterThan",
    // "lessThan",
    // "greaterThanOrEqual",
    // "lessThanOrEqual",
  ],
  star_rating: [
    "equals",
    "notEquals",
    "greaterThan",
    "lessThan",
    "greaterThanOrEqual",
    "lessThanOrEqual",
  ],
  rating_scale: [
    "equals",
    "notEquals",
    "greaterThan",
    "lessThan",
    "greaterThanOrEqual",
    "lessThanOrEqual",
  ],
  boolean: ["equals", "notEquals"],
};

// --- Types for advanced skip logic ---
export type SkipLogicCondition = {
  sectionIndex: number;
  questionIndex: number | null;
  operator: string;
  value: any;
};

export type SkipLogicRuleV2 = {
  id: string;
  conditions: SkipLogicCondition[];
  logicalOperator: string; // "and" | "or"
  action: string; // "hide" | "show"
  target: { type: string; sectionIndex?: number; questionIndex?: number };
  mainQuestionSection: number; // The section of the main question
  mainQuestionIndex: number; // The index of the main question
};

// Utility function to transform survey data with skip logic to editor format
export const transformSurveySkipLogic = (
  surveyData: any
): (SkipLogicRule | SkipLogicRuleV2)[] => {
  const rules: (SkipLogicRule | SkipLogicRuleV2)[] = [];

  // Create a map to find questions by their _id
  const questionIdMap = new Map<
    string,
    { sectionIndex: number; questionIndex: number }
  >();

  // Create a map to find sections by their _id
  const sectionIdMap = new Map<string, number>();

  surveyData.sections.forEach((section: any, sectionIndex: number) => {
    if (section._id) {
      sectionIdMap.set(section._id, sectionIndex);
    }
    section.questions.forEach((question: any, questionIndex: number) => {
      if (question._id) {
        questionIdMap.set(question._id, { sectionIndex, questionIndex });
      }
    });
  });

  // Process question-level skip logic
  surveyData.sections.forEach((section: any, sectionIndex: number) => {
    section.questions.forEach((question: any, questionIndex: number) => {
      if (question.skip_logic && Array.isArray(question.skip_logic)) {
        question.skip_logic.forEach((logic: any, logicIndex: number) => {
          if (logic.condition && logic.condition.rules) {
            const conditions: SkipLogicCondition[] = logic.condition.rules.map(
              (rule: any) => {
                // Find the source question by its _id
                const sourceQuestion = questionIdMap.get(rule.source_id);
                if (!sourceQuestion) {
                  console.warn(
                    `Could not find source question with id: ${rule.source_id}`
                  );
                  return {
                    sectionIndex: 0,
                    questionIndex: 0,
                    operator: rule.operator,
                    value: rule.value,
                  };
                }

                return {
                  sectionIndex: sourceQuestion.sectionIndex,
                  questionIndex: sourceQuestion.questionIndex,
                  operator: rule.operator,
                  value: rule.value,
                };
              }
            );

            // Determine target based on action type
            let target: {
              type: string;
              sectionIndex?: number;
              questionIndex?: number;
            };

            if (logic.condition.action.type === "end_survey") {
              target = { type: "end" };
            } else if (logic.condition.action.target_type === "section") {
              // Handle section targets
              const targetSectionIndex = sectionIdMap.get(
                logic.condition.action.target_id
              );
              if (targetSectionIndex === undefined) {
                console.warn(
                  `Could not find target section with id: ${logic.condition.action.target_id}`
                );
                target = {
                  type: "section",
                  sectionIndex: 0,
                };
              } else {
                target = {
                  type: "section",
                  sectionIndex: targetSectionIndex,
                };
              }
            } else {
              // Handle question targets
              const targetQuestion = questionIdMap.get(
                logic.condition.action.target_id
              );
              if (!targetQuestion) {
                console.warn(
                  `Could not find target question with id: ${logic.condition.action.target_id}`
                );
                target = {
                  type: logic.condition.action.target_type || "question",
                  sectionIndex: 0,
                  questionIndex: 0,
                };
              } else {
                target = {
                  type: logic.condition.action.target_type || "question",
                  sectionIndex: targetQuestion.sectionIndex,
                  questionIndex: targetQuestion.questionIndex,
                };
              }
            }

            // For show/hide/end_survey actions, mainQuestionSection and mainQuestionIndex should point to the target question
            // For jump_to actions, they should point to the source question
            let mainQuestionSection: number;
            let mainQuestionIndex: number;

            if (
              logic.condition.action.type === "show" ||
              logic.condition.action.type === "hide"
            ) {
              // For show/hide, the main question is the target question (the one being shown/hidden)
              if (logic.condition.action.target_type === "section") {
                const targetSectionIndex = sectionIdMap.get(
                  logic.condition.action.target_id
                );
                if (targetSectionIndex !== undefined) {
                  mainQuestionSection = targetSectionIndex;
                  mainQuestionIndex = 0; // For section targets, use first question
                } else {
                  mainQuestionSection = sectionIndex;
                  mainQuestionIndex = questionIndex;
                }
              } else {
                const targetQuestion = questionIdMap.get(
                  logic.condition.action.target_id
                );
                if (targetQuestion) {
                  mainQuestionSection = targetQuestion.sectionIndex;
                  mainQuestionIndex = targetQuestion.questionIndex;
                } else {
                  mainQuestionSection = sectionIndex;
                  mainQuestionIndex = questionIndex;
                }
              }
            } else if (logic.condition.action.type === "end_survey") {
              // For end_survey, the main question is the question that triggers the end survey
              mainQuestionSection = sectionIndex;
              mainQuestionIndex = questionIndex;
            } else {
              // For jump_to, the main question is the source question (the one containing the logic)
              mainQuestionSection = sectionIndex;
              mainQuestionIndex = questionIndex;
            }

            const newRule: SkipLogicRuleV2 = {
              id:
                logic._id ||
                `rule_${sectionIndex}_${questionIndex}_${logicIndex}_${Date.now()}`,
              conditions,
              logicalOperator: logic.condition.logical_operator || "and",
              action: logic.condition.action.type,
              target,
              mainQuestionSection,
              mainQuestionIndex,
            };

            rules.push(newRule);
          }
        });
      }
    });
  });

  // Process section-level skip logic
  surveyData.sections.forEach((section: any, sectionIndex: number) => {
    if (section.skip_logic && Array.isArray(section.skip_logic)) {
      section.skip_logic.forEach((logic: any, logicIndex: number) => {
        if (logic.condition && logic.condition.rules) {
          const conditions: SkipLogicCondition[] = logic.condition.rules.map(
            (rule: any) => {
              // Find the source question by its _id
              const sourceQuestion = questionIdMap.get(rule.source_id);
              if (!sourceQuestion) {
                console.warn(
                  `Could not find source question with id: ${rule.source_id}`
                );
                return {
                  sectionIndex: 0,
                  questionIndex: 0,
                  operator: rule.operator,
                  value: rule.value,
                };
              }

              return {
                sectionIndex: sourceQuestion.sectionIndex,
                questionIndex: sourceQuestion.questionIndex,
                operator: rule.operator,
                value: rule.value,
              };
            }
          );

          // Determine target based on action type
          let target: {
            type: string;
            sectionIndex?: number;
            questionIndex?: number;
          };

          if (logic.condition.action.type === "end_survey") {
            target = { type: "end" };
          } else if (logic.condition.action.target_type === "section") {
            // Handle section targets
            const targetSectionIndex = sectionIdMap.get(
              logic.condition.action.target_id
            );
            if (targetSectionIndex === undefined) {
              console.warn(
                `Could not find target section with id: ${logic.condition.action.target_id}`
              );
              target = {
                type: "section",
                sectionIndex: 0,
              };
            } else {
              target = {
                type: "section",
                sectionIndex: targetSectionIndex,
              };
            }
          } else {
            // Handle question targets
            const targetQuestion = questionIdMap.get(
              logic.condition.action.target_id
            );
            if (!targetQuestion) {
              console.warn(
                `Could not find target question with id: ${logic.condition.action.target_id}`
              );
              target = {
                type: logic.condition.action.target_type || "question",
                sectionIndex: 0,
                questionIndex: 0,
              };
            } else {
              target = {
                type: logic.condition.action.target_type || "question",
                sectionIndex: targetQuestion.sectionIndex,
                questionIndex: targetQuestion.questionIndex,
              };
            }
          }

          // For section-level logic, mainQuestionSection and mainQuestionIndex should point to the target
          let mainQuestionSection: number;
          let mainQuestionIndex: number;

          if (
            logic.condition.action.type === "show" ||
            logic.condition.action.type === "hide"
          ) {
            // For show/hide, the main question is the target section (use first question)
            if (logic.condition.action.target_type === "section") {
              const targetSectionIndex = sectionIdMap.get(
                logic.condition.action.target_id
              );
              if (targetSectionIndex !== undefined) {
                mainQuestionSection = targetSectionIndex;
                mainQuestionIndex = 0; // For section targets, use first question
              } else {
                mainQuestionSection = sectionIndex;
                mainQuestionIndex = 0;
              }
            } else {
              const targetQuestion = questionIdMap.get(
                logic.condition.action.target_id
              );
              if (targetQuestion) {
                mainQuestionSection = targetQuestion.sectionIndex;
                mainQuestionIndex = targetQuestion.questionIndex;
              } else {
                mainQuestionSection = sectionIndex;
                mainQuestionIndex = 0;
              }
            }
          } else if (logic.condition.action.type === "end_survey") {
            // For end_survey, use the section containing the logic
            mainQuestionSection = sectionIndex;
            mainQuestionIndex = 0;
          } else {
            // For jump_to, use the section containing the logic
            mainQuestionSection = sectionIndex;
            mainQuestionIndex = 0;
          }

          const newRule: SkipLogicRuleV2 = {
            id:
              logic._id ||
              `section_rule_${sectionIndex}_${logicIndex}_${Date.now()}`,
            conditions,
            logicalOperator: logic.condition.logical_operator || "and",
            action: logic.condition.action.type,
            target,
            mainQuestionSection,
            mainQuestionIndex,
          };

          rules.push(newRule);
        }
      });
    }
  });

  return rules;
};

// --- Mapping for user-friendly action labels ---
const actionTypeLabels: Record<string, string> = {
  hide: "Hide", // Will be dynamic based on target type
  show: "Display", // Will be dynamic based on target type
  jump_to: "Jump to", // Will be dynamic based on target type
  end_survey: "End the survey",
};

// Helper function to get dynamic action label based on target type
const getDynamicActionLabel = (action: string, targetType: string): string => {
  const baseAction = actionTypeLabels[action] || action;

  if (action === "hide") {
    return targetType === "section" ? "Hide section" : "Hide question";
  } else if (action === "show") {
    return targetType === "section" ? "Display section" : "Display question";
  } else if (action === "jump_to") {
    return targetType === "section" ? "Jump to section" : "Jump to question";
  }

  return baseAction;
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 20,
    transition: {
      duration: 0.2,
    },
  },
};

const stepVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
};

const conditionVariants = {
  hidden: { opacity: 0, height: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    height: "auto",
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
};

const SkipLogicEditor: React.FC<SkipLogicEditorProps> = ({
  sections,
  skipLogic,
  onChange,
  readOnly = false,
}) => {
  // --- Fetch skip logic constants ---
  const { data: constants, isLoading: constantsLoading } = useQuery({
    queryKey: ["skip-logic-constants"],
    queryFn: async () => {
      const res = await axiosInstance.get("/survey/skip-logic-constants");
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  console.log("constants", constants);

  // --- New state for advanced skip logic ---
  const [open, setOpen] = useState(false);
  const [editRule, setEditRule] = useState<SkipLogicRuleV2 | null>(null);
  // Default skip logic constants
  const DEFAULT_SKIP_LOGIC_CONSTANTS = {
    operators: [
      "equals",
      "notEquals",
      "greaterThan",
      "lessThan",
      "greaterThanOrEqual",
      "lessThanOrEqual",
      "includes",
      "notIncludes",
    ],
    logical_operators: ["and", "or"],
    action_types: ["hide", "show"],
    target_types: ["question", "section"],
  };
  // Use constants from API or fallback to defaults
  const logicConstants = constants || DEFAULT_SKIP_LOGIC_CONSTANTS;

  const [form, setForm] = useState<{
    conditions: SkipLogicCondition[];
    logicalOperator: string;
    action: string;
    targetType: string;
    targetSection: number;
    targetQuestion: number | null;
    mainQuestionSection: number;
    mainQuestionIndex: number | null;
  }>({
    conditions: [
      {
        sectionIndex: 0,
        questionIndex: null, // Start empty
        operator: "",
        value: "",
      },
    ],
    logicalOperator: "and",
    action: "", // Start empty
    targetType: "", // Start empty - will be selected first
    targetSection: 0,
    targetQuestion: null,
    mainQuestionSection: 0,
    mainQuestionIndex: null,
  });
  // New state for delete confirmation
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    rule: SkipLogicRule | SkipLogicRuleV2 | null;
  }>({ open: false, rule: null });

  // State to track which accordions are open
  const [openAccordions, setOpenAccordions] = useState<string[]>([]);

  // Helper: get question type
  const getQuestionType = (sectionIdx: number, questionIdx: number) => {
    const q = sections[sectionIdx]?.questions[questionIdx];
    return q?.question_type || "multiple_choice";
  };

  // Helper: get all possible answers for a question
  const getAnswers = (sectionIdx: number, questionIdx: number) => {
    const q = sections[sectionIdx]?.questions[questionIdx];
    if (!q) return [];
    if (Array.isArray(q.options) && q.options.length > 0) return q.options;
    if (q.question_type === "boolean") return ["Yes", "No"];
    return ["Any answer"];
  };

  // Helper: get question label
  const getQuestionLabel = (sectionIdx: number, questionIdx: number) => {
    const q = sections[sectionIdx]?.questions[questionIdx];
    if (!q) return "?";
    return q.question || `Q${questionIdx + 1}`;
  };

  // Helper: get question label with number
  const getQuestionLabelWithNumber = (
    sectionIdx: number,
    questionIdx: number
  ) => {
    const q = sections[sectionIdx]?.questions[questionIdx];
    if (!q) return `Q${questionIdx + 1}`;
    const questionText = q.question || `Q${questionIdx + 1}`;
    return `Q${questionIdx + 1}. ${questionText}`;
  };

  // Helper to get the highest section and question index in the conditions
  const getMaxConditionIndices = (conditions: SkipLogicCondition[]) => {
    let maxSection = 0;
    let maxQuestion = 0;
    conditions.forEach((cond) => {
      if (
        cond.sectionIndex > maxSection ||
        (cond.sectionIndex === maxSection &&
          (cond.questionIndex ?? 0) > maxQuestion)
      ) {
        maxSection = cond.sectionIndex;
        maxQuestion = cond.questionIndex ?? 0;
      }
    });
    return { maxSection, maxQuestion };
  };

  // Validation for rule creation - simplified
  const isValidRule = (() => {
    const conditionsValid =
      form.conditions.length > 0 &&
      form.conditions.every(
        (cond) =>
          cond.sectionIndex !== null &&
          cond.questionIndex !== null &&
          cond.operator &&
          cond.value !== undefined &&
          cond.value !== null &&
          cond.value !== ""
      );

    const actionValid = form.action;
    const targetTypeValid = form.targetType;

    const targetValid =
      form.targetType === "section" ? true : form.mainQuestionIndex !== null;

    const mainQuestionValid =
      form.action === "end_survey" ||
      (form.mainQuestionSection !== null && form.mainQuestionIndex !== null);

    const isValid =
      conditionsValid &&
      actionValid &&
      targetTypeValid &&
      targetValid &&
      mainQuestionValid;

    console.log("Validation check:", {
      conditionsValid,
      actionValid,
      targetTypeValid,
      targetValid,
      mainQuestionValid,
      isValid,
      form: {
        conditionsLength: form.conditions.length,
        action: form.action,
        targetType: form.targetType,
        targetSection: form.targetSection,
        targetQuestion: form.targetQuestion,
        mainQuestionSection: form.mainQuestionSection,
        mainQuestionIndex: form.mainQuestionIndex,
      },
    });

    return isValid;
  })();

  // Add or update rule
  const handleSave = () => {
    console.log("handleSave called with form:", form);
    console.log("Current skipLogic:", skipLogic);
    console.log("Form conditions:", form.conditions);
    console.log("Form action:", form.action);

    const rule: SkipLogicRuleV2 = {
      id: editRule?.id || uuidv4(),
      conditions: form.conditions,
      logicalOperator: form.logicalOperator,
      action: form.action,
      target:
        form.action === "end_survey"
          ? { type: "end" } // For end_survey, target is just "end"
          : form.action === "jump_to"
          ? {
              type: form.targetType,
              sectionIndex: form.targetSection,
              ...(form.targetType === "question" && form.targetQuestion !== null
                ? { questionIndex: form.targetQuestion }
                : {}),
            }
          : {
              type: form.targetType,
              sectionIndex: form.mainQuestionSection,
              ...(form.targetType === "question" &&
              form.mainQuestionIndex !== null
                ? { questionIndex: form.mainQuestionIndex }
                : {}),
            },
      mainQuestionSection: form.mainQuestionSection,
      mainQuestionIndex: form.mainQuestionIndex ?? 0,
    };

    console.log("Created rule:", rule);
    console.log("Rule conditions:", rule.conditions);
    console.log("Rule action:", rule.action);

    let newRules = Array.isArray(skipLogic) ? [...skipLogic] : [];
    console.log("Initial newRules:", newRules);

    if (editRule) {
      newRules = newRules.map((r) => (r.id === rule.id ? rule : r));
      console.log("Updated existing rule, newRules:", newRules);
    } else {
      newRules.push(rule);
      console.log("Added new rule, newRules:", newRules);
    }

    console.log("Calling onChange with:", newRules);
    onChange(newRules);
    setOpen(false);
    setEditRule(null);
  };

  // Open modal for new rule
  const handleAdd = () => {
    setForm({
      conditions: [
        {
          sectionIndex: 0,
          questionIndex: null, // Start empty
          operator: "",
          value: "",
        },
      ],
      logicalOperator: "and",
      action: "", // Start empty
      targetType: "", // Start empty - will be selected first
      targetSection: 0,
      targetQuestion: null,
      mainQuestionSection: 0,
      mainQuestionIndex: null,
    });
    setEditRule(null);
    setOpenAccordions(["condition-0"]); // Expand the first condition by default
    setOpen(true);
  };

  // Open modal for editing
  const handleEdit = (rule: SkipLogicRuleV2) => {
    setForm({
      conditions: rule.conditions,
      logicalOperator: rule.logicalOperator,
      action: rule.action,
      targetType: rule.action === "end_survey" ? "question" : rule.target.type,
      targetSection:
        rule.action === "jump_to"
          ? (rule.target as any).sectionIndex ?? 0
          : rule.mainQuestionSection ?? 0,
      targetQuestion:
        rule.action === "jump_to"
          ? (rule.target as any).questionIndex ?? null
          : rule.mainQuestionIndex ?? null,
      mainQuestionSection: rule.mainQuestionSection ?? 0,
      mainQuestionIndex: rule.mainQuestionIndex ?? null,
    });
    setEditRule(rule);
    // Expand all conditions when editing
    setOpenAccordions(rule.conditions.map((_, idx) => `condition-${idx}`));
    setOpen(true);
  };

  // Delete rule
  const handleDelete = (id: string) => {
    onChange((skipLogic as any[]).filter((r) => r.id !== id));
    setDeleteDialog({ open: false, rule: null });
  };

  // Add/remove conditions
  const addCondition = () => {
    const newConditionIndex = form.conditions.length;
    setForm((f) => ({
      ...f,
      conditions: [
        ...f.conditions,
        {
          sectionIndex:
            f.action === "jump_to" || f.action === "end_survey"
              ? f.mainQuestionSection
              : 0, // For jump_to and end_survey, use the selected source section
          questionIndex:
            f.action === "jump_to" || f.action === "end_survey"
              ? f.mainQuestionIndex
              : null, // For jump_to and end_survey, use the selected source question
          operator: "",
          value: "",
        },
      ],
      logicalOperator: f.logicalOperator || "and",
    }));
    // Automatically expand the new condition
    setOpenAccordions((prev) => [...prev, `condition-${newConditionIndex}`]);
  };
  const removeCondition = (idx: number) => {
    setForm((f) => ({
      ...f,
      conditions: f.conditions.filter((_, i) => i !== idx),
    }));
  };

  // Helper to check if a question is valid for conditional logic
  const isValidQuestionForConditionalLogic = (
    sectionIndex: number,
    questionIndex: number
  ) => {
    // For hide/show logic, the question must have previous questions to create conditions from
    if (form.action === "hide" || form.action === "show") {
      // Check if there are any questions before this one
      if (sectionIndex === 0 && questionIndex === 0) {
        return false; // First question of first section - no previous questions
      }

      // Check if there are questions in previous sections
      if (sectionIndex > 0) {
        return true; // Any question in sections after the first has previous questions
      }

      // Check if there are questions before this one in the same section
      return questionIndex > 0;
    }

    // For end_survey and other actions, all questions are valid
    return true;
  };

  // Helper to check if all required fields are filled
  const canShowFooter =
    form.targetType &&
    form.action &&
    ((form.targetType === "question" && form.mainQuestionIndex !== null) ||
      (form.targetType === "section" && form.mainQuestionSection !== null) ||
      form.action === "end_survey" ||
      (form.action === "jump_to" &&
        ((form.targetType === "question" && form.targetQuestion !== null) ||
          form.targetType === "section"))) &&
    form.conditions.every((cond) => {
      // For jump_to and end_survey, questionIndex is automatically set to source question
      // For other actions, questionIndex is required for conditions
      const hasValidQuestion =
        form.action === "jump_to" || form.action === "end_survey"
          ? true
          : cond.questionIndex !== null;
      return (
        hasValidQuestion &&
        cond.operator &&
        cond.value !== undefined &&
        cond.value !== null &&
        cond.value !== ""
      );
    }) &&
    // Only check logical operator if there are multiple conditions
    (form.conditions.length === 1 || form.logicalOperator);

  // Render value input based on operator and question type
  // Helper function to get unique answers for a condition, filtering out already used options
  const getUniqueAnswers = (
    cond: SkipLogicCondition,
    idx: number
  ): string[] => {
    const allAnswers: string[] = getAnswers(
      cond.sectionIndex,
      cond.questionIndex ?? 0
    );

    // Get all answers that are already used in other conditions for the same question
    const usedAnswers: string[] = form.conditions
      .filter(
        (otherCond, otherIdx) =>
          otherIdx !== idx && // Not the current condition
          otherCond.sectionIndex === cond.sectionIndex &&
          otherCond.questionIndex === cond.questionIndex &&
          otherCond.value &&
          otherCond.value !== ""
      )
      .map((otherCond) => otherCond.value as string);

    // Filter out used answers, but keep the current condition's value if it exists
    return allAnswers.filter(
      (answer: string) => !usedAnswers.includes(answer) || cond.value === answer // Keep current selection
    );
  };

  // Helper function to check if there are any unique options available for adding new conditions
  const hasUniqueOptionsAvailable = (): boolean => {
    // Always allow adding conditions - the uniqueness check will be done per condition
    return true;

    // The previous logic was too restrictive and only checked existing questions
    // Users should be able to add conditions for any available question
    // The getUniqueAnswers function will handle filtering out used options per condition
  };

  const renderValueInput = (cond: SkipLogicCondition, idx: number) => {
    // Safety check to ensure the condition exists at the given index
    if (!form.conditions[idx]) {
      console.warn(`Condition at index ${idx} does not exist`);
      return (
        <div className="text-red-500 text-sm">Error: Condition not found</div>
      );
    }

    const qType = getQuestionType(cond.sectionIndex, cond.questionIndex ?? 0);
    const answers = getUniqueAnswers(cond, idx);
    if (
      [
        "multi_choice",
        "checkbox",
        "matrix_multiple_choice",
        "matrix_checkbox",
      ].includes(qType) &&
      ["includes", "notIncludes"].includes(cond.operator)
    ) {
      // Multi-select
      return (
        <Select
          value={Array.isArray(cond.value) ? cond.value[0] : cond.value}
          onValueChange={(val) => {
            setForm((f) => {
              const newConds = [...f.conditions];
              if (newConds[idx]) {
                newConds[idx] = {
                  ...newConds[idx],
                  value: [val], // For demo, single select; replace with multi-select as needed
                };
              }
              return { ...f, conditions: newConds };
            });
          }}
        >
          <SelectTrigger className="max-w-[180px] truncate">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {answers.length > 0 ? (
              answers.map((a: string, i: number) => (
                <SelectItem key={i} value={a} className="truncate">
                  {a}
                </SelectItem>
              ))
            ) : (
              <div className="px-2 py-1 text-sm text-gray-500">
                No unique options available
              </div>
            )}
          </SelectContent>
        </Select>
      );
    }
    // Only allow typing for short_text, long_text, and number types
    if (["short_text", "long_text"].includes(qType)) {
      return (
        <Input
          value={cond.value}
          onChange={(e) => {
            const val = e.target.value;
            setForm((f) => {
              const newConds = [...f.conditions];
              if (newConds[idx]) {
                newConds[idx] = {
                  ...newConds[idx],
                  value: val,
                };
              }
              return { ...f, conditions: newConds };
            });
          }}
          className="max-w-[180px]"
        />
      );
    }
    // For star_rating, rating_scale, likert_scale, drop_down, etc, use select if options exist
    if (
      ["star_rating", "rating_scale", "likert_scale", "drop_down"].includes(
        qType
      ) &&
      answers.length > 0
    ) {
      return (
        <Select
          value={cond.value}
          onValueChange={(val) => {
            setForm((f) => {
              const newConds = [...f.conditions];
              newConds[idx] = {
                ...newConds[idx],
                value: val,
              };
              return { ...f, conditions: newConds };
            });
          }}
        >
          <SelectTrigger className="max-w-[180px] truncate">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {answers.length > 0 ? (
              answers.map((a: string, i: number) => (
                <SelectItem key={i} value={a} className="truncate">
                  {a}
                </SelectItem>
              ))
            ) : (
              <div className="px-2 py-1 text-sm text-gray-500">
                No unique options available
              </div>
            )}
          </SelectContent>
        </Select>
      );
    }
    if (["number", "slider", "Linear_Scale", "linear_Scale"].includes(qType)) {
      return (
        <Input
          type="number"
          value={cond.value}
          onChange={(e) => {
            const val = e.target.value;
            setForm((f) => {
              const newConds = [...f.conditions];
              if (newConds[idx]) {
                newConds[idx] = {
                  ...newConds[idx],
                  value: val,
                };
              }
              return { ...f, conditions: newConds };
            });
          }}
          className="max-w-[120px]"
        />
      );
    }
    // For all other types, use select for value
    return (
      <Select
        value={cond.value}
        onValueChange={(val) => {
          setForm((f) => {
            const newConds = [...f.conditions];
            if (newConds[idx]) {
              newConds[idx] = {
                ...newConds[idx],
                value: val,
              };
            }
            return { ...f, conditions: newConds };
          });
        }}
      >
        <SelectTrigger className="max-w-[180px] truncate">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {answers.length > 0 ? (
            answers.map((a: string, i: number) => (
              <SelectItem key={i} value={a} className="truncate">
                {a}
              </SelectItem>
            ))
          ) : (
            <div className="px-2 py-1 text-sm text-gray-500">
              No unique options available
            </div>
          )}
        </SelectContent>
      </Select>
    );
  };

  // Helper to get available questions for conditions based on skip action and selected question
  const getAvailableQuestionsForConditions = (sectionIndex: number) => {
    if (!form.action || form.mainQuestionIndex === null) return [];

    const selectedQuestionIndex = form.mainQuestionIndex;
    const questions = sections[sectionIndex]?.questions || [];

    // For hide/show: only show questions that come BEFORE the selected question
    if (form.action === "hide" || form.action === "show") {
      return questions.filter((_, idx) => idx < selectedQuestionIndex);
    }

    // For other actions, show all questions
    return questions;
  };

  // Helper to get available target questions for jump_to
  const getAvailableTargetQuestions = () => {
    if (form.action !== "jump_to" || form.mainQuestionIndex === null) return [];

    const selectedQuestionIndex = form.mainQuestionIndex;
    const selectedSectionIndex = form.mainQuestionSection;

    let availableQuestions: Array<{
      sectionIdx: number;
      questionIdx: number;
      question: any;
    }> = [];

    sections.forEach((section, sIdx) => {
      section.questions.forEach((question, qIdx) => {
        // For jump_to: only show questions that come AFTER the selected question
        if (
          sIdx > selectedSectionIndex ||
          (sIdx === selectedSectionIndex && qIdx > selectedQuestionIndex)
        ) {
          availableQuestions.push({
            sectionIdx: sIdx,
            questionIdx: qIdx,
            question,
          });
        }
      });
    });

    return availableQuestions;
  };

  // Helper to check if question selection is needed
  const isQuestionSelectionNeeded = () => {
    return (
      form.action &&
      form.targetType &&
      form.action !== "end_survey" &&
      form.action !== "jump_to"
    );
  };

  // Helper to get a user-friendly action label for a rule
  const getRuleSummary = (rule: SkipLogicRule | SkipLogicRuleV2) => {
    if ("from" in rule && "to" in rule) {
      // Old rule type
      if ("end" in rule.to) return "End Survey";
      return `Jump to Question ${(rule.to.questionIndex ?? 0) + 1}`;
    } else if ("action" in rule && "target" in rule) {
      const v2Rule = rule as SkipLogicRuleV2;
      const actionLabel = getDynamicActionLabel(
        v2Rule.action,
        v2Rule.target.type
      );

      switch (v2Rule.action) {
        case "hide":
        case "show":
          if (v2Rule.target.type === "section") {
            return `${actionLabel} ${(v2Rule.target.sectionIndex ?? 0) + 1}`;
          } else {
            return `${actionLabel} ${v2Rule.mainQuestionIndex + 1}`;
          }
        case "jump_to":
          if (v2Rule.target.type === "section") {
            return `${actionLabel} ${(v2Rule.target.sectionIndex ?? 0) + 1}`;
          } else {
            return `${actionLabel} ${(v2Rule.target.questionIndex ?? 0) + 1}`;
          }
        case "end_survey":
          return "End Survey";
        default:
          return "Skip Logic";
      }
    }
    return "Skip Logic";
  };

  return (
    <div className="p-4">
      {skipLogic.length > 0 && (
        <div className="flex justify-end items-center mb-4">
          <Button
            onClick={handleAdd}
            variant="ghost"
            size={"sm"}
            className="text-[#5B03B2] hover:text-[#5B03B2]/80 hover:bg-[#5B03B2]/5"
          >
            Add skip logic +
          </Button>
        </div>
      )}
      <motion.ul
        className="space-y-3 mb-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="wait">
          {skipLogic.length === 0 && (
            <motion.div
              key="empty-state"
              className="flex flex-col items-center justify-center py-10 text-center"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <h3 className="text-lg font-semibold mb-1 text-gray-800">
                No Question logic applied
              </h3>
              <p className="text-gray-500 mb-4">Click here to apply logic</p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleAdd}
                  className="bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] text-white shadow-md"
                >
                  Create skip logic
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="popLayout">
          {skipLogic.map((rule) => {
            // Type guard: old rule has 'from' and 'to', new rule has 'conditions'
            if ("from" in rule && "to" in rule) {
              return (
                <motion.li
                  key={rule.id}
                  className="bg-purple-50 rounded-lg shadow-sm relative group hover:shadow-md transition"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                >
                  <div className="flex items-center p-4">
                    {/* Left purple bar and checkmark */}
                    <div className="flex items-center mr-3">
                      <div className="w-6 h-6 bg-[#5B03B2] rounded-full flex items-center justify-center">
                        <Check className="size-4 text-white" />
                      </div>
                    </div>

                    {/* Rule description */}
                    <div className="flex-1">
                      <span className="cursor-pointer">
                        {getRuleSummary(rule)}
                      </span>
                    </div>

                    {/* Action buttons */}
                    {!readOnly && (
                      <div className="flex gap-2">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Button
                            size="icon"
                            className="!p-0 size-6 text-purple-600 hover:text-purple-700"
                            variant="ghost"
                            onClick={() =>
                              handleEdit(rule as unknown as SkipLogicRuleV2)
                            }
                            aria-label="Edit rule"
                          >
                            <Pencil className="size-4" />
                          </Button>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Button
                            size="icon"
                            className="!p-0 size-6 text-red-500 hover:text-red-600"
                            variant="ghost"
                            onClick={() =>
                              setDeleteDialog({ open: true, rule })
                            }
                            aria-label="Delete rule"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </motion.div>
                      </div>
                    )}
                  </div>
                </motion.li>
              );
            } else if (
              "conditions" in rule &&
              "action" in rule &&
              "target" in rule
            ) {
              // New advanced skip logic rule
              const ruleV2 = rule as SkipLogicRuleV2;
              return (
                <motion.li
                  key={ruleV2.id}
                  className="bg-purple-50 rounded-lg shadow-sm relative group hover:shadow-md transition"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                >
                  <div className="flex items-center p-4 border-l-8 border-[#5B03B2] rounded-xl">
                    {/* Left purple bar and checkmark */}
                    <div className="flex items-center mr-3">
                      <div className="w-6 h-6 bg-[#5B03B2] rounded-full flex items-center justify-center">
                        <Check className="size-4 text-white" />
                      </div>
                    </div>

                    {/* Rule description */}
                    <div className="flex-1">
                      <span className="cursor-pointer">
                        {getRuleSummary(ruleV2)}
                      </span>
                    </div>

                    {/* Action buttons */}
                    {!readOnly && (
                      <div className="flex gap-2">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Button
                            size="icon"
                            className="!p-0 size-6 text-purple-600 hover:text-purple-700"
                            variant="ghost"
                            onClick={() => handleEdit(ruleV2)}
                            aria-label="Edit rule"
                          >
                            <Pencil className="size-4" />
                          </Button>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Button
                            size="icon"
                            className="!p-0 size-6 text-red-500 hover:text-red-600"
                            variant="ghost"
                            onClick={() =>
                              setDeleteDialog({
                                open: true,
                                rule: ruleV2 as any,
                              })
                            }
                            aria-label="Delete rule"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </motion.div>
                      </div>
                    )}
                  </div>
                </motion.li>
              );
            } else {
              // Unknown rule type
              return null;
            }
          })}
        </AnimatePresence>
      </motion.ul>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl flex justify-center bg-white rounded-xl shadow-md p-0 overflow-y-auto max-h-[90vh]">
          <motion.div
            className="w-full max-w-full mx-auto bg-white rounded-xl p-6 flex flex-col items-center"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <DialogHeader className="w-full text-center mb-4">
              <DialogTitle className="text-2xl font-bold">
                {editRule ? "Edit Skip Logic" : "Create Skip Logic"}
              </DialogTitle>
              <p className="text-gray-400 text-base font-normal mb-4">
                Configure skip logic to control the flow of your survey based on
                user responses
              </p>
            </DialogHeader>
            <div className="w-full space-y-6 mt-4">
              {/* --- STEP 1: CHOOSE TARGET TYPE --- */}
              <div className="p-0 mb-4">
                <label className="block text-base font-medium mb-2 text-gray-800 text-left">
                  What do you want to apply logic to?
                </label>
                <Select
                  value={form.targetType}
                  onValueChange={(val) => {
                    setForm((f) => ({
                      ...f,
                      targetType: val,
                      targetSection: 0,
                      targetQuestion: null,
                      action: "", // Reset action when target type changes
                    }));
                  }}
                >
                  <SelectTrigger className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm">
                    <SelectValue placeholder="- Select target type -" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="question" className="truncate">
                      Question
                    </SelectItem>
                    {sections.length > 1 && (
                      <SelectItem value="section" className="truncate">
                        Section
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* --- STEP 2: CHOOSE SKIP ACTION --- */}
              {form.targetType && (
                <div className="p-0 mb-4">
                  <label className="block text-base font-medium mb-2 text-gray-800 text-left">
                    Choose Skip Action
                  </label>
                  <Select
                    value={form.action}
                    onValueChange={(val) =>
                      setForm((f) => ({
                        ...f,
                        action: val,
                        // Automatically set targetType to "question" when end_survey is selected
                        targetType:
                          val === "end_survey" ? "question" : f.targetType,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm">
                      <SelectValue placeholder="- Select action -" />
                    </SelectTrigger>
                    <SelectContent>
                      {logicConstants.action_types.map((a: string) => (
                        <SelectItem key={a} value={a} className="truncate">
                          {getDynamicActionLabel(a, form.targetType)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* --- STEP 3: SELECT SOURCE QUESTION (for jump_to action) --- */}
              {form.action === "jump_to" && form.targetType && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-base font-medium mb-2 text-gray-800 text-left">
                      Select source question
                    </label>
                    <div className="flex gap-2 items-center">
                      {/* Source Section select (only if more than one section) */}
                      {sections.length > 1 && (
                        <Select
                          value={form.mainQuestionSection.toString()}
                          onValueChange={(val) => {
                            setForm((f) => {
                              const newMainQuestionSection = Number(val);
                              // For jump_to action, automatically populate the condition's sectionIndex with the selected source section
                              const newConditions = f.conditions.map(
                                (cond, idx) => {
                                  if (f.action === "jump_to" && idx === 0) {
                                    return {
                                      ...cond,
                                      sectionIndex: newMainQuestionSection,
                                      questionIndex: null, // Reset question index when section changes
                                    };
                                  }
                                  return cond;
                                }
                              );

                              return {
                                ...f,
                                mainQuestionSection: newMainQuestionSection,
                                mainQuestionIndex: null,
                                conditions: newConditions,
                              };
                            });
                          }}
                        >
                          <SelectTrigger className="w-full max-w-[180px] truncate bg-white border border-gray-300 rounded-md px-3 py-2 text-sm">
                            <SelectValue placeholder="- Select section -" />
                          </SelectTrigger>
                          <SelectContent>
                            {sections.map((s, i) => (
                              <SelectItem
                                key={i}
                                value={i.toString()}
                                className="truncate"
                              >
                                Section {i + 1}:{" "}
                                {s.section_topic || `Section ${i + 1}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      {/* Source Question select */}
                      <Select
                        value={
                          form.mainQuestionIndex === null
                            ? ""
                            : form.mainQuestionIndex.toString()
                        }
                        onValueChange={(val) => {
                          setForm((f) => {
                            const newMainQuestionIndex =
                              val === "" ? null : Number(val);
                            // For jump_to action, automatically populate the condition's questionIndex with the selected source question
                            const newConditions = f.conditions.map(
                              (cond, idx) => {
                                if (f.action === "jump_to" && idx === 0) {
                                  return {
                                    ...cond,
                                    sectionIndex: f.mainQuestionSection,
                                    questionIndex: newMainQuestionIndex,
                                  };
                                }
                                return cond;
                              }
                            );

                            return {
                              ...f,
                              mainQuestionIndex: newMainQuestionIndex,
                              conditions: newConditions,
                            };
                          });
                        }}
                      >
                        <SelectTrigger className="w-full max-w-full truncate bg-white border border-gray-300 rounded-md px-3 py-2 text-sm">
                          <SelectValue placeholder="- Select question -" />
                        </SelectTrigger>
                        <SelectContent>
                          {sections[form.mainQuestionSection]?.questions.map(
                            (q, i) => (
                              <SelectItem
                                key={i}
                                value={i.toString()}
                                className="truncate"
                                disabled={
                                  (form.action === "hide" ||
                                    form.action === "show" ||
                                    form.action === "end_survey") &&
                                  form.mainQuestionSection === 0 &&
                                  i === 0
                                }
                              >
                                {getQuestionLabelWithNumber(
                                  form.mainQuestionSection,
                                  i
                                )}
                                {(form.action === "hide" ||
                                  form.action === "show" ||
                                  form.action === "end_survey") &&
                                  form.mainQuestionSection === 0 &&
                                  i === 0 && (
                                    <span className="text-gray-400 ml-2">
                                      (No previous questions)
                                    </span>
                                  )}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* --- STEP 4: SELECT TARGET (for jump_to action) --- */}
              {form.action === "jump_to" &&
                form.targetType &&
                form.mainQuestionIndex !== null && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-base font-medium mb-2 text-gray-800 text-left">
                        Select target {form.targetType}
                      </label>
                      {form.targetType === "section" ? (
                        <Select
                          value={form.targetSection.toString()}
                          onValueChange={(val) => {
                            setForm((f) => ({
                              ...f,
                              targetSection: Number(val),
                            }));
                          }}
                        >
                          <SelectTrigger className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm">
                            <SelectValue placeholder="- Select target section -" />
                          </SelectTrigger>
                          <SelectContent>
                            {sections
                              .filter((_, i) => {
                                // For jump_to: only show sections that come AFTER the source section
                                return i > form.mainQuestionSection;
                              })
                              .map((s, i) => {
                                const actualIndex =
                                  i + form.mainQuestionSection + 1;
                                return (
                                  <SelectItem
                                    key={actualIndex}
                                    value={actualIndex.toString()}
                                    className="truncate"
                                  >
                                    Section {actualIndex + 1}:{" "}
                                    {s.section_topic ||
                                      `Section ${actualIndex + 1}`}
                                  </SelectItem>
                                );
                              })}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="flex gap-2 items-center">
                          {/* Target Section select (only if more than one section) */}
                          {sections.length > 1 && (
                            <Select
                              value={form.targetSection.toString()}
                              onValueChange={(val) => {
                                setForm((f) => ({
                                  ...f,
                                  targetSection: Number(val),
                                  targetQuestion: null, // Reset question when section changes
                                }));
                              }}
                            >
                              <SelectTrigger className="w-full max-w-[180px] truncate bg-white border border-gray-300 rounded-md px-3 py-2 text-sm">
                                <SelectValue placeholder="- Select section -" />
                              </SelectTrigger>
                              <SelectContent>
                                {sections
                                  .filter((_, i) => {
                                    // For jump_to: only show sections that come AFTER the source section
                                    return i > form.mainQuestionSection;
                                  })
                                  .map((s, i) => {
                                    const actualIndex =
                                      i + form.mainQuestionSection + 1;
                                    return (
                                      <SelectItem
                                        key={actualIndex}
                                        value={actualIndex.toString()}
                                        className="truncate"
                                      >
                                        Section {actualIndex + 1}:{" "}
                                        {s.section_topic ||
                                          `Section ${actualIndex + 1}`}
                                      </SelectItem>
                                    );
                                  })}
                              </SelectContent>
                            </Select>
                          )}
                          {/* Target Question select */}
                          <Select
                            value={
                              form.targetQuestion === null
                                ? ""
                                : form.targetQuestion.toString()
                            }
                            onValueChange={(val) => {
                              setForm((f) => ({
                                ...f,
                                targetQuestion: val === "" ? null : Number(val),
                              }));
                            }}
                          >
                            <SelectTrigger className="w-full max-w-full truncate bg-white border border-gray-300 rounded-md px-3 py-2 text-sm">
                              <SelectValue placeholder="- Select question -" />
                            </SelectTrigger>
                            <SelectContent>
                              {sections[form.targetSection]?.questions
                                .filter((_, i) => {
                                  // For jump_to: only show questions that come AFTER the source question
                                  // If target section is same as source section, only show questions after source question
                                  if (
                                    form.targetSection ===
                                      form.mainQuestionSection &&
                                    form.mainQuestionIndex !== null
                                  ) {
                                    return i > form.mainQuestionIndex;
                                  }
                                  // If target section is different, show all questions in target section
                                  return true;
                                })
                                .map((q, i) => {
                                  const actualIndex =
                                    form.targetSection ===
                                      form.mainQuestionSection &&
                                    form.mainQuestionIndex !== null
                                      ? i + form.mainQuestionIndex + 1
                                      : i;
                                  return (
                                    <SelectItem
                                      key={actualIndex}
                                      value={actualIndex.toString()}
                                      className="truncate"
                                    >
                                      {getQuestionLabelWithNumber(
                                        form.targetSection,
                                        actualIndex
                                      )}
                                    </SelectItem>
                                  );
                                })}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              {/* --- STEP 3: SELECT SECTION & QUESTION (for hide/show actions) --- */}
              <AnimatePresence>
                {isQuestionSelectionNeeded() && (
                  <motion.div
                    className="p-0 mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <label className="block text-base font-medium mb-2 text-gray-800 text-left">
                      Select {form.targetType} to apply logic to
                    </label>
                    <div className="flex gap-2 items-center mb-2 w-full">
                      {form.targetType === "section" ? (
                        /* Section select for section target */
                        <Select
                          value={form.mainQuestionSection.toString()}
                          onValueChange={(val) => {
                            setForm((f) => {
                              const newMainQuestionSection = Number(val);
                              return {
                                ...f,
                                mainQuestionSection: newMainQuestionSection,
                                mainQuestionIndex: null,
                              };
                            });
                          }}
                        >
                          <SelectTrigger className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm">
                            <SelectValue
                              placeholder="- Select section to apply logic to -"
                              className={
                                form.mainQuestionSection === 0
                                  ? "text-gray-400"
                                  : ""
                              }
                            >
                              {form.mainQuestionSection === 0
                                ? "- Select section to apply logic to -"
                                : (() => {
                                    const idx = Number(
                                      form.mainQuestionSection
                                    );
                                    const s = sections[idx];
                                    return s
                                      ? `Section ${idx + 1}: ${
                                          s.section_topic ||
                                          `Section ${idx + 1}`
                                        }`
                                      : "";
                                  })()}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {sections
                              .filter((_, i) => {
                                // For section targets: exclude the first section since there are no previous sections to create conditions from
                                return i > 0; // Only show sections after the first one
                              })
                              .map((s, i) => {
                                // Adjust the index for display since we're filtering
                                const displayIndex = i + 1;
                                return (
                                  <SelectItem
                                    key={i}
                                    value={displayIndex.toString()}
                                    className="truncate"
                                  >
                                    Section {displayIndex + 1}:{" "}
                                    {s.section_topic ||
                                      `Section ${displayIndex + 1}`}
                                  </SelectItem>
                                );
                              })}
                          </SelectContent>
                        </Select>
                      ) : (
                        /* Question select for question target */
                        <>
                          {/* Section select (only if more than one section) */}
                          {sections.length > 1 && (
                            <Select
                              value={form.mainQuestionSection.toString()}
                              onValueChange={(val) => {
                                setForm((f) => {
                                  const newMainQuestionSection = Number(val);
                                  // For jump_to action, automatically populate the condition's sectionIndex with the selected source section
                                  const newConditions = f.conditions.map(
                                    (cond, idx) => {
                                      if (f.action === "jump_to" && idx === 0) {
                                        return {
                                          ...cond,
                                          sectionIndex: newMainQuestionSection,
                                          questionIndex: null, // Reset question index when section changes
                                        };
                                      }
                                      return cond;
                                    }
                                  );

                                  return {
                                    ...f,
                                    mainQuestionSection: newMainQuestionSection,
                                    mainQuestionIndex: null,
                                    conditions: newConditions,
                                  };
                                });
                              }}
                            >
                              <SelectTrigger className="w-full max-w-[180px] truncate bg-white border border-gray-300 rounded-md px-3 py-2 text-sm">
                                <SelectValue placeholder="- Select section -" />
                              </SelectTrigger>
                              <SelectContent>
                                {sections.map((s, i) => (
                                  <SelectItem
                                    key={i}
                                    value={i.toString()}
                                    className="truncate"
                                  >
                                    Section {i + 1}:{" "}
                                    {s.section_topic || `Section ${i + 1}`}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                          {/* Question select */}
                          <Select
                            value={
                              form.mainQuestionIndex === null
                                ? ""
                                : form.mainQuestionIndex.toString()
                            }
                            onValueChange={(val) => {
                              setForm((f) => {
                                const newMainQuestionIndex =
                                  val === "" ? null : Number(val);
                                // For jump_to action, automatically populate the condition's questionIndex with the selected source question
                                const newConditions = f.conditions.map(
                                  (cond, idx) => {
                                    if (f.action === "jump_to" && idx === 0) {
                                      return {
                                        ...cond,
                                        sectionIndex: f.mainQuestionSection,
                                        questionIndex: newMainQuestionIndex,
                                      };
                                    }
                                    return cond;
                                  }
                                );

                                return {
                                  ...f,
                                  mainQuestionIndex: newMainQuestionIndex,
                                  conditions: newConditions,
                                };
                              });
                            }}
                          >
                            <SelectTrigger className="w-full max-w-full truncate bg-white border border-gray-300 rounded-md px-3 py-2 text-sm">
                              <SelectValue placeholder="- Select question -" />
                            </SelectTrigger>
                            <SelectContent>
                              {sections[form.mainQuestionSection]?.questions
                                .map((q, originalIdx) => ({
                                  question: q,
                                  originalIdx,
                                }))
                                .filter(({ originalIdx }) => {
                                  // For hide/show/end_survey: only show questions that have previous questions to create conditions from
                                  if (
                                    form.action === "hide" ||
                                    form.action === "show" ||
                                    form.action === "end_survey"
                                  ) {
                                    return isValidQuestionForConditionalLogic(
                                      form.mainQuestionSection,
                                      originalIdx
                                    );
                                  }
                                  // For jump_to: allow all questions (including first question)
                                  if (form.action === "jump_to") {
                                    return true;
                                  }
                                  // For other actions, show all questions
                                  return true;
                                })
                                .map(({ question, originalIdx }) => (
                                  <SelectItem
                                    key={originalIdx}
                                    value={originalIdx.toString()}
                                    className="truncate"
                                    disabled={
                                      (form.action === "hide" ||
                                        form.action === "show" ||
                                        form.action === "end_survey") &&
                                      form.mainQuestionSection === 0 &&
                                      originalIdx === 0
                                    }
                                  >
                                    {getQuestionLabelWithNumber(
                                      form.mainQuestionSection,
                                      originalIdx
                                    )}
                                    {(form.action === "hide" ||
                                      form.action === "show" ||
                                      form.action === "end_survey") &&
                                      form.mainQuestionSection === 0 &&
                                      originalIdx === 0 && (
                                        <span className="text-gray-400 ml-2">
                                          (No previous questions)
                                        </span>
                                      )}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </>
                      )}
                    </div>
                    {/* Show message when no valid questions available for conditional logic */}
                    {form.targetType === "question" &&
                      (form.action === "hide" ||
                        form.action === "show" ||
                        form.action === "end_survey") &&
                      sections[form.mainQuestionSection]?.questions.filter(
                        (_, qIdx) =>
                          isValidQuestionForConditionalLogic(
                            form.mainQuestionSection,
                            qIdx
                          )
                      ).length === 0 && (
                        <p className="text-sm text-amber-600 mt-1">
                          No questions available for {form.action} logic.
                          Questions must have previous questions to create
                          conditions from.
                        </p>
                      )}
                  </motion.div>
                )}
              </AnimatePresence>
              {/* --- STEP 4: CONDITIONS (show only after question and skip action are selected) --- */}
              {((form.targetType === "question" &&
                form.mainQuestionIndex !== null) ||
                (form.targetType === "section" &&
                  form.mainQuestionSection !== null) ||
                form.action === "end_survey") &&
                form.action && (
                  <>
                    {/* Copy condition checkbox */}
                    {/* <div className="mb-4 flex items-center">
                      <input
                        type="checkbox"
                        id="copy-condition"
                        className="mr-2"
                        // onChange handler can be added later
                      />
                      <label
                        htmlFor="copy-condition"
                        className="text-base text-gray-700 select-none"
                      >
                        Copy condition from other questions
                      </label>
                    </div> */}
                    {/* Conditions header */}
                    <motion.div
                      className="font-bold text-lg text-gray-800 mb-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                    >
                      Conditions
                    </motion.div>
                    <Accordion
                      type="multiple"
                      className="w-full"
                      value={
                        openAccordions.length > 0
                          ? openAccordions
                          : form.conditions.map((_, idx) => `condition-${idx}`)
                      }
                      onValueChange={setOpenAccordions}
                    >
                      {/* Condition blocks */}
                      {form.conditions.map((cond, idx) => (
                        <motion.div
                          key={idx}
                          className="relative"
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -20, scale: 0.95 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 25,
                          }}
                          layout
                        >
                          <AccordionItem
                            value={`condition-${idx}`}
                            className="border border-[#9D50BB54] overflow-hidden rounded-xl bg-gray-100 mb-2"
                          >
                            <AccordionTrigger className="px-4 py-3 hover:no-underline rounded-t-xl">
                              <div className="flex items-center justify-between w-full">
                                <span className="font-semibold text-gray-800">
                                  Condition {idx + 1}{" "}
                                  {form.conditions.length > 1 &&
                                    `(C${idx + 1})`}
                                </span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-4 rounded-b-xl">
                              <div className="flex flex-col gap-3 pt-2">
                                {/* If: Section and Question selectors - Hidden for jump_to action only */}
                                {form.action !== "jump_to" && (
                                  <div className="flex flex-row items-center gap-2 w-full">
                                    <label className="text-sm font-semibold text-gray-700 min-w-[80px]">
                                      If:
                                    </label>
                                    <div className="flex-1 flex gap-2 min-w-0">
                                      {/* Section selector (only if more than one section) */}
                                      {sections.length > 1 && (
                                        <Select
                                          value={cond.sectionIndex.toString()}
                                          onValueChange={(val) => {
                                            setForm((f) => {
                                              const newConds = [
                                                ...f.conditions,
                                              ];
                                              if (newConds[idx]) {
                                                newConds[idx] = {
                                                  ...newConds[idx],
                                                  sectionIndex: Number(val),
                                                  questionIndex: null,
                                                  operator: "",
                                                  value: "",
                                                };
                                              }
                                              return {
                                                ...f,
                                                conditions: newConds,
                                              };
                                            });
                                          }}
                                        >
                                          <SelectTrigger className="flex-shrink-0 w-[140px] truncate bg-white border border-gray-300 rounded-md px-3 py-2 text-sm">
                                            <SelectValue placeholder="- Select section -" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {sections
                                              .filter((_, i) => {
                                                // For section targets: only show sections that come before the target section
                                                if (
                                                  form.targetType === "section"
                                                ) {
                                                  return (
                                                    i < form.mainQuestionSection
                                                  );
                                                }
                                                // For question targets: show all sections
                                                return true;
                                              })
                                              .map((s, i) => (
                                                <SelectItem
                                                  key={i}
                                                  value={i.toString()}
                                                  className="truncate"
                                                >
                                                  Section {i + 1}:{" "}
                                                  {s.section_topic ||
                                                    `Section ${i + 1}`}
                                                </SelectItem>
                                              ))}
                                          </SelectContent>
                                        </Select>
                                      )}
                                      {/* Question selector */}
                                      <Select
                                        value={
                                          cond.questionIndex === null
                                            ? ""
                                            : cond.questionIndex.toString()
                                        }
                                        onValueChange={(val) => {
                                          setForm((f) => {
                                            const newConds = [...f.conditions];
                                            if (newConds[idx]) {
                                              newConds[idx] = {
                                                ...newConds[idx],
                                                questionIndex:
                                                  val === ""
                                                    ? null
                                                    : Number(val),
                                                operator: "",
                                                value: "",
                                              };
                                            }
                                            return {
                                              ...f,
                                              conditions: newConds,
                                            };
                                          });
                                        }}
                                      >
                                        <SelectTrigger className="flex-1 min-w-0 max-w-full truncate bg-white border border-gray-300 rounded-md px-3 py-2 text-sm">
                                          <SelectValue
                                            placeholder={
                                              form.action === "hide" ||
                                              form.action === "show"
                                                ? "- Select previous question -"
                                                : "- Select question -"
                                            }
                                            className="truncate"
                                          />
                                        </SelectTrigger>

                                        <SelectContent>
                                          {(() => {
                                            // When editing, always show all questions to ensure the current selection is available
                                            if (editRule) {
                                              return (
                                                sections[
                                                  cond.sectionIndex
                                                ]?.questions.map((q, i) => (
                                                  <SelectItem
                                                    key={i}
                                                    value={i.toString()}
                                                    className="truncate"
                                                  >
                                                    {getQuestionLabelWithNumber(
                                                      cond.sectionIndex,
                                                      i
                                                    )}
                                                  </SelectItem>
                                                )) || []
                                              );
                                            }

                                            // For hide/show: only show questions that come BEFORE the main selected question/section
                                            if (
                                              form.action === "hide" ||
                                              form.action === "show"
                                            ) {
                                              if (
                                                form.targetType === "section"
                                              ) {
                                                // For section targets: only show questions from sections before the target section
                                                const targetSectionIndex =
                                                  form.mainQuestionSection;
                                                if (
                                                  cond.sectionIndex >=
                                                  targetSectionIndex
                                                ) {
                                                  return [];
                                                }
                                                return (
                                                  sections[
                                                    cond.sectionIndex
                                                  ]?.questions.map((q, i) => (
                                                    <SelectItem
                                                      key={i}
                                                      value={i.toString()}
                                                      className="truncate"
                                                    >
                                                      {getQuestionLabelWithNumber(
                                                        cond.sectionIndex,
                                                        i
                                                      )}
                                                    </SelectItem>
                                                  )) || []
                                                );
                                              } else {
                                                // For question targets: only show questions that come BEFORE the main selected question
                                                const mainQuestionIndex =
                                                  form.mainQuestionIndex;
                                                const mainSectionIndex =
                                                  form.mainQuestionSection;

                                                if (mainQuestionIndex === null)
                                                  return [];

                                                return (
                                                  sections[
                                                    cond.sectionIndex
                                                  ]?.questions
                                                    .filter((_, qIdx) => {
                                                      // If same section, only show questions before the main question
                                                      if (
                                                        cond.sectionIndex ===
                                                        mainSectionIndex
                                                      ) {
                                                        return (
                                                          qIdx <
                                                          mainQuestionIndex
                                                        );
                                                      }
                                                      // If different section, only show questions from sections before the main section
                                                      return (
                                                        cond.sectionIndex <
                                                        mainSectionIndex
                                                      );
                                                    })
                                                    .map((q, i) => (
                                                      <SelectItem
                                                        key={i}
                                                        value={i.toString()}
                                                        className="truncate"
                                                      >
                                                        {getQuestionLabelWithNumber(
                                                          cond.sectionIndex,
                                                          i
                                                        )}
                                                      </SelectItem>
                                                    )) || []
                                                );
                                              }
                                            }

                                            // For other actions, show all questions
                                            return (
                                              sections[
                                                cond.sectionIndex
                                              ]?.questions.map((q, i) => (
                                                <SelectItem
                                                  key={i}
                                                  value={i.toString()}
                                                  className="truncate"
                                                >
                                                  {getQuestionLabelWithNumber(
                                                    cond.sectionIndex,
                                                    i
                                                  )}
                                                </SelectItem>
                                              )) || []
                                            );
                                          })()}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                )}
                                {/* For jump_to: Show the source question info */}
                                {form.action === "jump_to" && (
                                  <div className="flex flex-row items-center gap-2">
                                    <label className="text-sm font-semibold text-gray-700 min-w-[80px]">
                                      If:
                                    </label>
                                    <div className="flex-1">
                                      <div className="bg-gray-100 rounded-md px-3 py-2 text-sm text-gray-700">
                                        {getQuestionLabelWithNumber(
                                          form.mainQuestionSection,
                                          form.mainQuestionIndex ?? 0
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Condition: Operator selector */}
                                <div className="flex flex-row items-center gap-2">
                                  <label className="text-sm font-semibold text-gray-700 min-w-[80px]">
                                    Condition:
                                  </label>
                                  <div className="flex-1">
                                    <Select
                                      value={cond.operator}
                                      onValueChange={(val) => {
                                        setForm((f) => {
                                          const newConds = [...f.conditions];
                                          if (newConds[idx]) {
                                            newConds[idx] = {
                                              ...newConds[idx],
                                              operator: val,
                                              value: "",
                                            };
                                          }
                                          return { ...f, conditions: newConds };
                                        });
                                      }}
                                    >
                                      <SelectTrigger className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 truncate">
                                        <SelectValue
                                          placeholder="- Select Condition -"
                                          className="truncate"
                                        />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {(
                                          operatorMap[
                                            getQuestionType(
                                              cond.sectionIndex,
                                              cond.questionIndex ?? 0
                                            )
                                          ] ||
                                          logicConstants.operators ||
                                          []
                                        ).map((op: string) => (
                                          <SelectItem
                                            key={op}
                                            value={op}
                                            className="truncate"
                                          >
                                            {op
                                              .replace(/([A-Z])/g, " $1")
                                              .replace(/^./, (str) =>
                                                str.toUpperCase()
                                              )}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                {/* Response: Value input */}
                                <div className="flex flex-row items-center gap-2">
                                  <label className="text-sm font-semibold text-gray-700 min-w-[80px]">
                                    Response:
                                  </label>
                                  <div className="flex-1 truncate">
                                    {renderValueInput(cond, idx)}
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-end w-full mt-4">
                                {form.conditions.length > 1 && (
                                  <button
                                    type="button"
                                    className="text-red-600 text-sm flex items-center gap-1 hover:text-red-700"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeCondition(idx);
                                    }}
                                  >
                                    Delete condition{" "}
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                          {/* Logic gate selector between conditions */}
                          {idx < form.conditions.length - 1 && (
                            <div className="flex justify-center my-2 h-10 w-full absolute -bottom-7 left-0">
                              <Select
                                value={form.logicalOperator}
                                onValueChange={(val) =>
                                  setForm((f) => ({
                                    ...f,
                                    logicalOperator: val,
                                  }))
                                }
                              >
                                <SelectTrigger className="w-28 z-10 text-sm bg-white border border-purple-300 rounded-full px-3 py-1 text-center text-purple-700 font-semibold shadow-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {logicConstants.logical_operators.map(
                                    (op: string) => (
                                      <SelectItem
                                        key={op}
                                        value={op}
                                        className="truncate"
                                      >
                                        {op.toUpperCase()}
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </motion.div>
                      ))}
                      {/* Add condition button */}
                      <div className="flex justify-end w-full my-4">
                        <button
                          type="button"
                          className="border border-gray-300 hover:bg-gray-100 h-10 rounded-full px-4 text-sm font-medium transition"
                          onClick={addCondition}
                        >
                          + Add condition
                        </button>
                      </div>
                    </Accordion>
                    {/* Summary */}
                    {/* {form.conditions.length > 1 && (
                      <div className="mt-6 text-base text-gray-700 font-medium">
                        Summary:{" "}
                        <span className="font-bold text-black">
                          (
                          {form.conditions
                            .map((_, idx) => `C${idx + 1}`)
                            .join(` ${form.logicalOperator.toUpperCase()} `)}
                          )
                        </span>
                      </div>
                    )} */}
                  </>
                )}
              {/* --- ACTION & TARGET --- */}
            </div>
            {canShowFooter && (
              <DialogFooter className="w-full py-10 flex justify-between gap-6 items-center">
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="group flex-1 relative h-10 px-6 rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-200 overflow-hidden active:scale-[0.98] bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] text-white hover:opacity-90"
                  // disabled={!isValidRule}
                >
                  <span className="group-hover:tracking-wider transition-all duration-200">
                    {editRule ? "Save Changes" : "Add Rule"}
                  </span>
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-200 pointer-events-none" />
                </Button>
              </DialogFooter>
            )}

            {/* {console.log(form)} */}
          </motion.div>
        </DialogContent>
      </Dialog>
      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((d) => ({ ...d, open }))}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Delete Rule</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-left">
            <p>
              Are you sure you want to delete this skip logic rule? This action
              is irreversible.
            </p>
            {deleteDialog.rule && (
              <div className="mt-4">
                <li className="bg-white text-left border border-purple-100 rounded-lg shadow-sm px-4 py-3 flex flex-col gap-2 relative transition list-none">
                  {/* Render summary for both rule types */}
                  {deleteDialog.rule &&
                  "from" in deleteDialog.rule &&
                  "to" in deleteDialog.rule ? (
                    <>
                      {/* Old rule type */}
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="text-purple-600 font-semibold flex items-center gap-1">
                          <GitBranch className="w-4 h-4" />
                          If
                        </span>
                        <span className="font-medium text-gray-800">
                          {getQuestionLabel(
                            deleteDialog.rule.from.sectionIndex,
                            deleteDialog.rule.from.questionIndex
                          )}
                        </span>
                        <span className="mx-1 text-gray-500">=</span>
                        <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-xs font-semibold">
                          {deleteDialog.rule.from.answer}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-sm mt-1">
                        <span className="text-green-600 font-semibold flex items-center gap-1">
                          <ArrowRight className="w-4 h-4" />
                          Then
                        </span>
                        <span>
                          go to{" "}
                          {"end" in deleteDialog.rule.to ? (
                            <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded text-xs font-semibold">
                              End Survey
                            </span>
                          ) : (
                            <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs font-semibold">
                              {getQuestionLabel(
                                deleteDialog.rule.to.sectionIndex,
                                deleteDialog.rule.to.questionIndex ?? 0
                              )}
                            </span>
                          )}
                        </span>
                      </div>
                    </>
                  ) : null}
                  {/* New rule type rendering with type guard */}
                  {(() => {
                    const rule = deleteDialog.rule;
                    const isNewRule =
                      rule &&
                      "conditions" in rule &&
                      "action" in rule &&
                      "target" in rule;
                    if (!isNewRule || !rule) return null;
                    const v2Rule = rule as SkipLogicRuleV2;
                    return (
                      <>
                        {/* New rule type */}
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                          <span className="text-purple-600 font-semibold flex items-center gap-1">
                            <GitBranch className="w-4 h-4" />
                            If
                          </span>
                          <span className="font-medium text-gray-800">
                            {v2Rule.conditions.map((cond, idx) => (
                              <span key={idx}>
                                {getQuestionLabel(
                                  cond.sectionIndex,
                                  cond.questionIndex ?? 0
                                )}
                                <span className="mx-1 text-gray-500">
                                  {" "}
                                  {cond.operator}{" "}
                                </span>
                                <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-xs font-semibold">
                                  {Array.isArray(cond.value)
                                    ? cond.value.join(", ")
                                    : cond.value}
                                </span>
                                {idx < v2Rule.conditions.length - 1 ? (
                                  <span className="mx-1 text-gray-500 font-bold">
                                    {v2Rule.logicalOperator.toUpperCase()}
                                  </span>
                                ) : null}
                              </span>
                            ))}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-sm mt-1">
                          <span className="text-green-600 font-semibold flex items-center gap-1">
                            <ArrowRight className="w-4 h-4" />
                            Then
                          </span>
                          <span>
                            {v2Rule.action} {v2Rule.target.type}
                            {v2Rule.target.type === "section" &&
                            typeof v2Rule.target.sectionIndex === "number" ? (
                              <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs font-semibold ml-1">
                                Section {v2Rule.target.sectionIndex + 1}
                              </span>
                            ) : null}
                            {v2Rule.target.type === "question" &&
                            typeof v2Rule.target.sectionIndex === "number" &&
                            typeof v2Rule.target.questionIndex === "number" ? (
                              <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs font-semibold ml-1">
                                {getQuestionLabel(
                                  v2Rule.target.sectionIndex,
                                  v2Rule.target.questionIndex ?? 0
                                )}
                              </span>
                            ) : null}
                          </span>
                        </div>
                      </>
                    );
                  })()}
                </li>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, rule: null })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deleteDialog.rule && handleDelete(deleteDialog.rule.id)
              }
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SkipLogicEditor;
