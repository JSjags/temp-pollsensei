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

const SkipLogicEditor: React.FC<SkipLogicEditorProps> = ({
  sections,
  skipLogic,
  onChange,
  readOnly = false,
}) => {
  const [open, setOpen] = useState(false);
  const [editRule, setEditRule] = useState<SkipLogicRule | null>(null);
  const [form, setForm] = useState<{
    fromSection: number;
    fromQuestion: number;
    fromAnswer: string;
    toSection: number;
    toQuestion: number | null;
    toEnd: boolean;
  }>({
    fromSection: 0,
    fromQuestion: 0,
    fromAnswer: "",
    toSection: 0,
    toQuestion: null,
    toEnd: false,
  });
  // New state for delete confirmation
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    rule: SkipLogicRule | null;
  }>({ open: false, rule: null });

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

  // Validation for rule creation
  const availableAnswers = getAnswers(form.fromSection, form.fromQuestion);
  const isValidRule =
    form.fromSection !== null &&
    form.fromQuestion !== null &&
    form.fromAnswer !== "" &&
    availableAnswers.includes(form.fromAnswer) &&
    (form.toEnd || (form.toSection !== null && form.toQuestion !== null));

  // Add or update rule
  const handleSave = () => {
    const rule: SkipLogicRule = {
      id: editRule?.id || uuidv4(),
      from: {
        sectionIndex: form.fromSection,
        questionIndex: form.fromQuestion,
        answer: form.fromAnswer,
      },
      to: form.toEnd
        ? { end: true }
        : { sectionIndex: form.toSection, questionIndex: form.toQuestion },
    };
    let newRules = [...skipLogic];
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
      fromSection: 0,
      fromQuestion: 0,
      fromAnswer: "",
      toSection: 0,
      toQuestion: null,
      toEnd: false,
    });
    setEditRule(null);
    setOpen(true);
  };

  // Open modal for editing
  const handleEdit = (rule: SkipLogicRule) => {
    const answers = getAnswers(rule.from.sectionIndex, rule.from.questionIndex);
    setForm({
      fromSection: rule.from.sectionIndex,
      fromQuestion: rule.from.questionIndex,
      fromAnswer: answers.includes(rule.from.answer)
        ? rule.from.answer
        : answers[0] || "",
      toSection: "sectionIndex" in rule.to ? rule.to.sectionIndex : 0,
      toQuestion: "questionIndex" in rule.to ? rule.to.questionIndex : null,
      toEnd: "end" in rule.to ? true : false,
    });
    setEditRule(rule);
    setOpen(true);
  };

  // Delete rule
  const handleDelete = (id: string) => {
    onChange(skipLogic.filter((r) => r.id !== id));
    setDeleteDialog({ open: false, rule: null });
  };

  // When section/question changes, reset answer
  const handleFromChange = (sectionIdx: number, questionIdx: number) => {
    const answers = getAnswers(sectionIdx, questionIdx);
    setForm((f) => ({
      ...f,
      fromSection: sectionIdx,
      fromQuestion: questionIdx,
      fromAnswer: answers.includes(f.fromAnswer)
        ? f.fromAnswer
        : answers[0] || "",
    }));
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
        <Button onClick={handleAdd} variant="outline" size={"sm"}>
          + Add Rule
        </Button>
      </div>
      <ul className="space-y-3 mb-4">
        {skipLogic.length === 0 && (
          <li className="text-gray-400">No skip logic rules yet.</li>
        )}
        {skipLogic.map((rule) => (
          <li
            key={rule.id}
            className="bg-white border border-purple-100 rounded-lg shadow-sm px-4 py-3 flex flex-col gap-2 relative group hover:shadow-md transition"
          >
            {/* First line: If ... = ... */}
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-purple-600 font-semibold flex items-center gap-1">
                <GitBranch className="w-4 h-4" />
                If
              </span>
              <span className="font-medium text-gray-800">
                {getQuestionLabel(
                  rule.from.sectionIndex,
                  rule.from.questionIndex
                )}
              </span>
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
              <div className="absolute right-3 top-2 gap-1 flex">
                <Button
                  size="icon"
                  className="!p-0 size-6"
                  variant="ghost"
                  onClick={() => handleEdit(rule)}
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
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editRule ? "Edit Skip Logic Rule" : "Add Skip Logic Rule"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* FROM: Section & Question */}
            <div>
              <label className="block text-sm font-medium mb-1">If</label>
              <div className="flex gap-2">
                <Select
                  value={form.fromSection.toString()}
                  onValueChange={(val) =>
                    handleFromChange(Number(val), form.fromQuestion)
                  }
                >
                  <SelectTrigger className="max-w-[180px] truncate">
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
                        {s.section_topic ? `: ${s.section_topic}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={form.fromQuestion.toString()}
                  onValueChange={(val) =>
                    handleFromChange(form.fromSection, Number(val))
                  }
                >
                  <SelectTrigger className="max-w-[180px] truncate">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sections[form.fromSection]?.questions.map((q, i) => (
                      <SelectItem
                        key={i}
                        value={i.toString()}
                        className="truncate"
                      >
                        {q.question || `Q${i + 1}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={form.fromAnswer}
                  onValueChange={(val) =>
                    setForm((f) => ({ ...f, fromAnswer: val }))
                  }
                >
                  <SelectTrigger className="max-w-[180px] truncate">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getAnswers(form.fromSection, form.fromQuestion).map(
                      (a: string, i: number) => (
                        <SelectItem key={i} value={a} className="truncate">
                          {a}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* THEN: Target */}
            <div>
              <label className="block text-sm font-medium mb-1">Then</label>
              <div className="flex gap-2 items-center">
                <Select
                  value={form.toEnd ? "end" : form.toSection.toString()}
                  onValueChange={(val) => {
                    if (val === "end") {
                      setForm((f) => ({ ...f, toEnd: true }));
                    } else {
                      setForm((f) => ({
                        ...f,
                        toEnd: false,
                        toSection: Number(val),
                        toQuestion: 0,
                      }));
                    }
                  }}
                >
                  <SelectTrigger className="max-w-[180px] truncate">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="end" className="truncate">
                      End Survey
                    </SelectItem>
                    {sections.map((s, i) => (
                      <SelectItem
                        key={i}
                        value={i.toString()}
                        className="truncate"
                      >
                        Section {i + 1}
                        {s.section_topic ? `: ${s.section_topic}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!form.toEnd && (
                  <Select
                    value={(form.toQuestion ?? 0).toString()}
                    onValueChange={(val) =>
                      setForm((f) => ({ ...f, toQuestion: Number(val) }))
                    }
                  >
                    <SelectTrigger className="max-w-[180px] truncate">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sections[form.toSection]?.questions.map((q, i) => (
                        <SelectItem
                          key={i}
                          value={i.toString()}
                          className="truncate"
                        >
                          {q.question || `Q${i + 1}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
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
