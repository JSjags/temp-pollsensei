import React, { useState } from "react";
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
import { GitBranch, ArrowRight, Pencil, Trash2, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import axiosInstancev3 from "@/lib/axios-instance-v3";

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
  skipLogic: SkipLogicRule[];
  onChange: (rules: SkipLogicRule[]) => void;
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
    "greaterThan",
    "lessThan",
    "greaterThanOrEqual",
    "lessThanOrEqual",
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
type SkipLogicCondition = {
  sectionIndex: number;
  questionIndex: number;
  operator: string;
  value: any;
};

type SkipLogicRuleV2 = {
  id: string;
  conditions: SkipLogicCondition[];
  logicalOperator: string; // "and" | "or"
  action: string; // "hide" | "show"
  target: { type: string; sectionIndex?: number; questionIndex?: number };
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
      const res = await axiosInstancev3.get("/survey/skip-logic-constants");
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

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
  const logicConstants = constants?.data || DEFAULT_SKIP_LOGIC_CONSTANTS;
  const [form, setForm] = useState<{
    conditions: SkipLogicCondition[];
    logicalOperator: string;
    action: string;
    targetType: string;
    targetSection: number;
    targetQuestion: number | null;
  }>({
    conditions: [
      {
        sectionIndex: 0,
        questionIndex: 0,
        operator: "equals",
        value: "",
      },
    ],
    logicalOperator: "and",
    action: logicConstants.action_types[0],
    targetType: logicConstants.target_types[0],
    targetSection: 0,
    targetQuestion: 0,
  });
  // New state for delete confirmation
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    rule: SkipLogicRule | null;
  }>({ open: false, rule: null });

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

  // Helper to get the highest section and question index in the conditions
  const getMaxConditionIndices = (conditions: SkipLogicCondition[]) => {
    let maxSection = 0;
    let maxQuestion = 0;
    conditions.forEach((cond) => {
      if (
        cond.sectionIndex > maxSection ||
        (cond.sectionIndex === maxSection && cond.questionIndex > maxQuestion)
      ) {
        maxSection = cond.sectionIndex;
        maxQuestion = cond.questionIndex;
      }
    });
    return { maxSection, maxQuestion };
  };

  // Validation for rule creation
  const isValidRule =
    form.conditions.length > 0 &&
    form.conditions.every(
      (cond) =>
        cond.sectionIndex !== null &&
        cond.questionIndex !== null &&
        cond.operator &&
        cond.value !== undefined &&
        cond.value !== null &&
        cond.value !== ""
    ) &&
    form.action &&
    form.targetType &&
    (form.targetType === "section" || form.targetQuestion !== null);

  // Add or update rule
  const handleSave = () => {
    const rule: SkipLogicRuleV2 = {
      id: editRule?.id || uuidv4(),
      conditions: form.conditions,
      logicalOperator: form.logicalOperator,
      action: form.action,
      target: {
        type: form.targetType,
        sectionIndex: form.targetSection,
        ...(form.targetType === "question" && form.targetQuestion !== null
          ? { questionIndex: form.targetQuestion }
          : {}),
      },
    };
    let newRules = [...(skipLogic as any[])];
    if (editRule) {
      newRules = newRules.map((r) => (r.id === rule.id ? rule : r));
    } else {
      newRules.push(rule);
    }
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
          questionIndex: 0,
          operator: "equals",
          value: "",
        },
      ],
      logicalOperator: "and",
      action: logicConstants.action_types[0],
      targetType: logicConstants.target_types[0],
      targetSection: 0,
      targetQuestion: 0,
    });
    setEditRule(null);
    setOpen(true);
  };

  // Open modal for editing
  const handleEdit = (rule: SkipLogicRuleV2) => {
    setForm({
      conditions: rule.conditions,
      logicalOperator: rule.logicalOperator,
      action: rule.action,
      targetType: rule.target.type,
      targetSection: rule.target.sectionIndex ?? 0,
      targetQuestion: rule.target.questionIndex ?? 0,
    });
    setEditRule(rule);
    setOpen(true);
  };

  // Delete rule
  const handleDelete = (id: string) => {
    onChange((skipLogic as any[]).filter((r) => r.id !== id));
    setDeleteDialog({ open: false, rule: null });
  };

  // Add/remove conditions
  const addCondition = () => {
    setForm((f) => ({
      ...f,
      conditions: [
        ...f.conditions,
        {
          sectionIndex: 0,
          questionIndex: 0,
          operator: "equals",
          value: "",
        },
      ],
      logicalOperator: f.logicalOperator || "and",
    }));
  };
  const removeCondition = (idx: number) => {
    setForm((f) => ({
      ...f,
      conditions: f.conditions.filter((_, i) => i !== idx),
    }));
  };

  // Render value input based on operator and question type
  const renderValueInput = (cond: SkipLogicCondition, idx: number) => {
    const qType = getQuestionType(cond.sectionIndex, cond.questionIndex);
    const answers = getAnswers(cond.sectionIndex, cond.questionIndex);
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
              newConds[idx].value = [val]; // For demo, single select; replace with multi-select as needed
              return { ...f, conditions: newConds };
            });
          }}
        >
          <SelectTrigger className="max-w-[180px] truncate">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {answers.map((a: string, i: number) => (
              <SelectItem key={i} value={a} className="truncate">
                {a}
              </SelectItem>
            ))}
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
              newConds[idx].value = val;
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
              newConds[idx].value = val;
              return { ...f, conditions: newConds };
            });
          }}
        >
          <SelectTrigger className="max-w-[180px] truncate">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {answers.map((a: string, i: number) => (
              <SelectItem key={i} value={a} className="truncate">
                {a}
              </SelectItem>
            ))}
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
              newConds[idx].value = val;
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
            newConds[idx].value = val;
            return { ...f, conditions: newConds };
          });
        }}
      >
        <SelectTrigger className="max-w-[180px] truncate">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {answers.map((a: string, i: number) => (
            <SelectItem key={i} value={a} className="truncate">
              {a}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg flex items-center gap-2">
          Skip Logic
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span tabIndex={0} className="cursor-pointer text-purple-600">
                  <Info className="w-4 h-4" />
                </span>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="max-w-xs text-sm font-medium bg-purple-50"
              >
                Skip Logic lets you control which question or section a
                respondent sees next, based on their answer to a previous
                question.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h2>
        {constantsLoading ? (
          <div className="flex flex-col items-center justify-center py-10 text-center bg-purple-50 rounded-lg border border-dashed border-purple-200 my-4 animate-pulse">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 mb-3">
              <GitBranch className="w-7 h-7 text-purple-300" />
            </div>
            <h3 className="text-lg font-semibold mb-1 text-gray-400">
              Loading skip logic options...
            </h3>
            <div className="w-40 h-4 bg-purple-100 rounded mt-2 mb-1" />
            <div className="w-32 h-4 bg-purple-100 rounded mb-1" />
            <div className="w-24 h-4 bg-purple-100 rounded" />
          </div>
        ) : (
          <>
            <Button onClick={handleAdd} variant="outline" size={"sm"}>
              + Add Rule
            </Button>
          </>
        )}
      </div>
      <ul className="space-y-3 mb-4">
        {skipLogic.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center bg-purple-50 rounded-lg border border-dashed border-purple-200 my-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 mb-3">
              <GitBranch className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-1 text-gray-800">
              No skip logic rules yet
            </h3>
            <p className="text-gray-500 max-w-xs mx-auto">
              Add a rule to control which question or section a respondent sees
              next, based on their answer to a previous question.
            </p>
          </div>
        )}
        {skipLogic.map((rule) => (
          <li
            key={rule.id}
            className="bg-white border border-purple-100 rounded-lg shadow-sm px-4 py-3 flex flex-col gap-2 relative group hover:shadow-md transition"
          >
            {/* First line: If ... = ... */}
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <div className="flex gap-2 items-start">
                <span className="text-purple-600 font-semibold flex items-center gap-1">
                  <GitBranch className="w-4 h-4" />
                  If
                </span>
                <p className="flex-1 flex pr-20 whitespace-normal">
                  <span className="font-medium text-gray-800">
                    {getQuestionLabel(
                      rule.from.sectionIndex,
                      rule.from.questionIndex
                    )}
                  </span>
                </p>
              </div>
              <span className="mx-1 text-gray-500">=</span>
              <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-xs font-semibold">
                {rule.from.answer}
              </span>
            </div>
            {/* Second line: Then go to ... */}
            <div className="flex flex-wrap items-center gap-2 text-sm mt-1">
              <span className="text-green-600 font-semibold flex items-center gap-1">
                <ArrowRight className="w-4 h-4" />
                Then
              </span>
              <span>
                go to{" "}
                {"end" in rule.to ? (
                  <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded text-xs font-semibold">
                    End Survey
                  </span>
                ) : (
                  <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs font-semibold">
                    {getQuestionLabel(
                      rule.to.sectionIndex,
                      rule.to.questionIndex ?? 0
                    )}
                  </span>
                )}
              </span>
            </div>
            {!readOnly && (
              <div className="absolute right-3 top-2 gap-1 flex bg-gray-50 rounded-md">
                <Button
                  size="icon"
                  className="!p-0 size-6"
                  variant="ghost"
                  onClick={() => handleEdit(rule as unknown as SkipLogicRuleV2)}
                  aria-label="Edit rule"
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  size="icon"
                  className="!p-0 size-6"
                  variant="ghost"
                  onClick={() => setDeleteDialog({ open: true, rule })}
                  aria-label="Delete rule"
                >
                  <Trash2 className="size-4 text-red-500" />
                </Button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <>
            <DialogHeader>
              <DialogTitle>
                {editRule ? "Edit Skip Logic Rule" : "Add Skip Logic Rule"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              {/* --- CONDITIONS --- */}
              <div>
                <label className="block text-sm font-medium mb-1">If</label>
                {form.conditions.map((cond, idx) => {
                  const qType = getQuestionType(
                    cond.sectionIndex,
                    cond.questionIndex
                  );
                  const availableOperators =
                    operatorMap[qType] || logicConstants.operators || [];
                  return (
                    <div key={idx} className="flex gap-2 items-center mb-2">
                      {/* Section select */}
                      <Select
                        value={cond.sectionIndex.toString()}
                        onValueChange={(val) => {
                          setForm((f) => {
                            const newConds = [...f.conditions];
                            newConds[idx].sectionIndex = Number(val);
                            newConds[idx].questionIndex = 0;
                            newConds[idx].value = "";
                            return { ...f, conditions: newConds };
                          });
                        }}
                      >
                        <SelectTrigger className="max-w-[120px] truncate">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {sections.map((s, i) => (
                            <SelectItem
                              key={i}
                              value={i.toString()}
                              className="truncate"
                            >
                              Section {i + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {/* Question select */}
                      <Select
                        value={cond.questionIndex.toString()}
                        onValueChange={(val) => {
                          setForm((f) => {
                            const newConds = [...f.conditions];
                            newConds[idx].questionIndex = Number(val);
                            newConds[idx].value = "";
                            return { ...f, conditions: newConds };
                          });
                        }}
                      >
                        <SelectTrigger className="max-w-[180px] truncate">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {sections[cond.sectionIndex]?.questions.map(
                            (q, i) => (
                              <SelectItem
                                key={i}
                                value={i.toString()}
                                className="truncate"
                              >
                                {q.question || `Q${i + 1}`}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      {/* Operator select */}
                      <Select
                        value={cond.operator}
                        onValueChange={(val) => {
                          setForm((f) => {
                            const newConds = [...f.conditions];
                            newConds[idx].operator = val;
                            newConds[idx].value = "";
                            return { ...f, conditions: newConds };
                          });
                        }}
                      >
                        <SelectTrigger className="max-w-[140px] truncate">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {availableOperators.map((op: string) => (
                            <SelectItem
                              key={op}
                              value={op}
                              className="truncate"
                            >
                              {op}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {/* Value input */}
                      {renderValueInput(cond, idx)}
                      {/* Remove condition button */}
                      {form.conditions.length > 1 && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="!p-0 size-6"
                          onClick={() => removeCondition(idx)}
                          aria-label="Remove condition"
                        >
                          <Trash2 className="size-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={addCondition}
                >
                  + Add Condition
                </Button>
              </div>
              {/* --- LOGICAL OPERATOR --- */}
              {form.conditions.length > 1 &&
                logicConstants.logical_operators?.length > 0 && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">
                      Combine conditions with
                    </label>
                    <Select
                      value={form.logicalOperator || "and"}
                      onValueChange={(val) =>
                        setForm((f) => ({ ...f, logicalOperator: val }))
                      }
                    >
                      <SelectTrigger className="max-w-[120px] truncate">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {logicConstants.logical_operators.map((op: string) => (
                          <SelectItem key={op} value={op} className="truncate">
                            {op.toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              {/* --- ACTION & TARGET --- */}
              <div className="flex gap-2 items-center">
                <label className="block text-sm font-medium mb-1">Action</label>
                <Select
                  value={form.action}
                  onValueChange={(val) =>
                    setForm((f) => ({ ...f, action: val }))
                  }
                >
                  <SelectTrigger className="max-w-[120px] truncate">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {logicConstants.action_types.map((a: string) => (
                      <SelectItem key={a} value={a} className="truncate">
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <label className="block text-sm font-medium mb-1">Target</label>
                <Select
                  value={form.targetType}
                  onValueChange={(val) =>
                    setForm((f) => ({ ...f, targetType: val }))
                  }
                >
                  <SelectTrigger className="max-w-[120px] truncate">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {logicConstants.target_types
                      .filter(
                        (t: string) => t !== "section" || sections.length > 1
                      )
                      .map((t: string) => (
                        <SelectItem key={t} value={t} className="truncate">
                          {t}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {/* Target section/question select */}
                {sections.length > 1 && (
                  <Select
                    value={form.targetSection.toString()}
                    onValueChange={(val) =>
                      setForm((f) => ({ ...f, targetSection: Number(val) }))
                    }
                  >
                    <SelectTrigger className="max-w-[120px] truncate">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(() => {
                        const { maxSection } = getMaxConditionIndices(
                          form.conditions
                        );
                        return sections
                          .map((s, i) =>
                            i > maxSection ? (
                              <SelectItem
                                key={i}
                                value={i.toString()}
                                className="truncate"
                              >
                                Section {i + 1}
                              </SelectItem>
                            ) : null
                          )
                          .filter(Boolean);
                      })()}
                    </SelectContent>
                  </Select>
                )}
                {form.targetType === "question" && (
                  <Select
                    value={`${form.targetSection}-${form.targetQuestion ?? 0}`}
                    onValueChange={(val) => {
                      const [sectionIdx, questionIdx] = val
                        .split("-")
                        .map(Number);
                      setForm((f) => ({
                        ...f,
                        targetSection: sectionIdx,
                        targetQuestion: questionIdx,
                      }));
                    }}
                  >
                    <SelectTrigger className="max-w-[120px] truncate">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(() => {
                        const { maxSection, maxQuestion } =
                          getMaxConditionIndices(form.conditions);
                        let items: JSX.Element[] = [];
                        sections.forEach((section, sIdx) => {
                          if (sIdx === maxSection) {
                            section.questions.forEach((q, qIdx) => {
                              if (qIdx > maxQuestion) {
                                items.push(
                                  <SelectItem
                                    key={`${sIdx}-${qIdx}`}
                                    value={`${sIdx}-${qIdx}`}
                                    className="truncate"
                                  >
                                    {q.question || `Q${qIdx + 1}`}
                                  </SelectItem>
                                );
                              }
                            });
                          } else if (sIdx > maxSection) {
                            section.questions.forEach((q, qIdx) => {
                              items.push(
                                <SelectItem
                                  key={`${sIdx}-${qIdx}`}
                                  value={`${sIdx}-${qIdx}`}
                                  className="truncate"
                                >
                                  {q.question || `Q${qIdx + 1}`}
                                </SelectItem>
                              );
                            });
                          }
                        });
                        return items;
                      })()}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="group relative h-10 px-6 rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-200 overflow-hidden active:scale-[0.98] bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] text-white hover:opacity-90"
                disabled={!isValidRule}
              >
                <span className="group-hover:tracking-wider transition-all duration-200">
                  {editRule ? "Save Changes" : "Add Rule"}
                </span>
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-200 pointer-events-none" />
              </Button>
            </DialogFooter>
          </>
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
          <div className="py-4 text-center">
            <p>Are you sure you want to delete this skip logic rule?</p>
            {deleteDialog.rule && (
              <div className="mt-4">
                <li className="bg-white border border-purple-100 rounded-lg shadow-sm px-4 py-3 flex flex-col gap-2 relative transition list-none">
                  {/* First line: If ... = ... */}
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
                  {/* Second line: Then go to ... */}
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
