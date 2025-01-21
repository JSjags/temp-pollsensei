import { draggable } from "@/assets/images";
import {
  setActionMessage,
  setCurrentQuestion,
  setCurrentQuestionType,
  setIsCollapsed,
} from "@/redux/slices/sensei-master.slice";
import Image from "next/image";
import React, { useState, useMemo, useEffect } from "react";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Grip, X, Save } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/shadcn-input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface MultiChoiceQuestionEditProps {
  question: string;
  questionType: string;
  options: string[] | undefined;
  onSave?: (
    updatedQuestion: string,
    updatedOptions: string[],
    editedQuestionType: string,
    is_required: boolean,
    minValue?: number,
    maxValue?: number,
    matrixRows?: string[],
    matrixColumns?: string[]
  ) => void;
  onCancel?: () => void;
  setIsRequired?: (value: boolean) => void;
  is_required: boolean;
  index?: number;
}

const MultiChoiceQuestionEdit: React.FC<MultiChoiceQuestionEditProps> = ({
  question,
  options,
  questionType,
  onSave,
  onCancel,
  is_required,
  setIsRequired,
  index,
}) => {
  const dispatch = useDispatch();
  const [editedQuestion, setEditedQuestion] = useState<string>(question);
  const [editedQuestionType, setEditedQuestionType] =
    useState<string>(questionType);
  const [editedOptions, setEditedOptions] = useState<string[]>(options || [""]);
  const [rows, setRows] = useState<string[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [minValue, setMinValue] = useState<number>(0);
  const [maxValue, setMaxValue] = useState<number>(100);
  const [isRequired, setIsRequiredLocal] = useState<boolean>(is_required);

  const questionTypes = useMemo(
    () => [
      { value: "checkbox", label: "Checkbox" },
      { value: "multiple_choice", label: "Multiple Choice" },
      { value: "single_choice", label: "Single Choice" },
      { value: "drop_down", label: "Dropdown" },
      { value: "boolean", label: "Boolean" },
      { value: "short_text", label: "Short Text" },
      { value: "long_text", label: "Long Text" },
      { value: "slider", label: "Slider" },
      // { value: "media", label: "Media" },
      { value: "likert_scale", label: "Likert Scale" },
      { value: "rating_scale", label: "Rating Scale" },
      { value: "star_rating", label: "Star Rating" },
      { value: "matrix_multiple_choice", label: "Matrix Multiple Choice" },
      { value: "matrix_checkbox", label: "Matrix Checkbox" },
      { value: "number", label: "Number" },
    ],
    []
  );

  const isValid = useMemo(() => {
    if (!editedQuestion.trim()) return false;

    switch (editedQuestionType) {
      case "multiple_choice":
      case "single_choice":
      case "checkbox":
      case "drop_down":
        return (
          editedOptions.length >= 2 && editedOptions.every((opt) => opt.trim())
        );

      case "slider":
        return minValue < maxValue;

      case "matrix_multiple_choice":
      case "matrix_checkbox":
        return (
          rows.length >= 1 &&
          columns.length >= 1 &&
          rows.every((row) => row.trim()) &&
          columns.every((col) => col.trim())
        );

      case "likert_scale":
        return (
          editedOptions.length === 5 && editedOptions.every((opt) => opt.trim())
        );

      default:
        return true;
    }
  }, [
    editedQuestion,
    editedQuestionType,
    editedOptions,
    minValue,
    maxValue,
    rows,
    columns,
  ]);

  const handleTypeChange = (value: string) => {
    setEditedQuestionType(value);

    // Reset all question-specific values when changing types
    setMinValue(0);
    setMaxValue(100);
    setRows([]);
    setColumns([]);

    if (value === "likert_scale") {
      setEditedOptions([
        "Strongly Disagree",
        "Disagree",
        "Neutral",
        "Agree",
        "Strongly Agree",
      ]);
    } else if (
      ["multiple_choice", "single_choice", "checkbox", "drop_down"].includes(
        value
      )
    ) {
      if (!editedOptions.length) setEditedOptions([""]);
    } else if (["matrix_multiple_choice", "matrix_checkbox"].includes(value)) {
      setRows([""]);
      setColumns([""]);
      setEditedOptions([]);
    } else if (value === "slider") {
      setEditedOptions([]);
      setMinValue(0);
      setMaxValue(100);
    } else {
      setEditedOptions([]);
    }

    dispatch(setCurrentQuestionType(value));
  };

  const handleOptionChange = (index: number, value: string) => {
    setEditedOptions((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleMatrixChange = (
    type: "row" | "column",
    index: number,
    value: string
  ) => {
    if (type === "row") {
      setRows((prev) => {
        const updated = [...prev];
        updated[index] = value;
        return updated;
      });
    } else {
      setColumns((prev) => {
        const updated = [...prev];
        updated[index] = value;
        return updated;
      });
    }
  };

  const handleSave = () => {
    if (!isValid) return;

    if (onSave) {
      // Create an object with the base properties
      const questionData = {
        question: editedQuestion,
        options: editedOptions,
        questionType: editedQuestionType,
        is_required: isRequired,
      };

      // Add question-specific properties based on the question type
      if (editedQuestionType === "slider") {
        onSave(
          editedQuestion,
          editedOptions,
          editedQuestionType,
          isRequired,
          minValue,
          maxValue
        );
      } else if (
        ["matrix_multiple_choice", "matrix_checkbox"].includes(
          editedQuestionType
        )
      ) {
        onSave(
          editedQuestion,
          editedOptions,
          editedQuestionType,
          isRequired,
          undefined,
          undefined,
          rows,
          columns
        );
      } else {
        onSave(editedQuestion, editedOptions, editedQuestionType, isRequired);
      }
    }
  };

  const handleRequiredChange = (checked: boolean) => {
    setIsRequiredLocal(checked);
    if (setIsRequired) {
      setIsRequired(checked);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-4 bg-white shadow-lg rounded-xl p-6"
    >
      <div className="flex items-start gap-4">
        <motion.div whileHover={{ scale: 1.1 }} className="mt-2">
          <Grip className="text-gray-400" />
        </motion.div>

        <div className="flex-1 space-y-6">
          <Input
            value={editedQuestion}
            onChange={(e) => setEditedQuestion(e.target.value)}
            className={cn(
              "text-xl font-semibold border-none shadow-none focus:border-none",
              !editedQuestion.trim() && "border-red-500"
            )}
            placeholder="Enter your question"
          />

          <div className="flex items-center gap-4">
            <Label>Question Type</Label>
            <Select value={editedQuestionType} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] overflow-y-auto">
                {questionTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <AnimatePresence mode="wait">
            {editedQuestionType === "slider" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label>Min Value</Label>
                    <Input
                      type="number"
                      value={minValue}
                      onChange={(e) => setMinValue(Number(e.target.value))}
                      className={cn(minValue >= maxValue && "border-red-500")}
                    />
                  </div>
                  <div className="flex-1">
                    <Label>Max Value</Label>
                    <Input
                      type="number"
                      value={maxValue}
                      onChange={(e) => setMaxValue(Number(e.target.value))}
                      className={cn(maxValue <= minValue && "border-red-500")}
                    />
                  </div>
                </div>
                <Slider
                  value={[minValue, maxValue]}
                  min={0}
                  max={100}
                  step={1}
                  className="bg-gradient-to-r from-[#5B03B2] to-[#9D50BB]"
                />
              </motion.div>
            )}

            {["matrix_multiple_choice", "matrix_checkbox"].includes(
              editedQuestionType
            ) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <Label>Matrix Rows</Label>
                  {rows.map((row, index) => (
                    <div key={`row-${index}`} className="flex gap-2">
                      <Input
                        value={row}
                        onChange={(e) =>
                          handleMatrixChange("row", index, e.target.value)
                        }
                        placeholder="Enter row label"
                        className={cn(!row.trim() && "border-red-500")}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setRows((prev) => prev.filter((_, i) => i !== index))
                        }
                        disabled={rows.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => setRows((prev) => [...prev, ""])}
                    className="w-full bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Row
                  </Button>
                </div>

                <div className="space-y-4">
                  <Label>Matrix Columns</Label>
                  {columns.map((col, index) => (
                    <div key={`col-${index}`} className="flex gap-2">
                      <Input
                        value={col}
                        onChange={(e) =>
                          handleMatrixChange("column", index, e.target.value)
                        }
                        placeholder="Enter column label"
                        className={cn(!col.trim() && "border-red-500")}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setColumns((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                        disabled={columns.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => setColumns((prev) => [...prev, ""])}
                    className="w-full bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Column
                  </Button>
                </div>
              </motion.div>
            )}

            {[
              "multiple_choice",
              "single_choice",
              "checkbox",
              "drop_down",
            ].includes(editedQuestionType) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                {editedOptions.map((option, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex gap-2"
                  >
                    <Input
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                      placeholder={`Option ${index + 1}`}
                      className={cn(!option.trim() && "border-red-500")}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setEditedOptions((prev) =>
                          prev.filter((_, i) => i !== index)
                        )
                      }
                      disabled={editedOptions.length <= 2}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => setEditedOptions((prev) => [...prev, ""])}
                  className="w-full bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] text-white"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Option
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Label>Required</Label>
              <Switch
                checked={isRequired}
                onCheckedChange={handleRequiredChange}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onCancel}
                className="rounded-full transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!isValid}
                className={cn(
                  "rounded-full transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2",
                  isValid
                    ? "bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] text-white"
                    : "bg-gray-300 cursor-not-allowed"
                )}
              >
                <Save className="h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MultiChoiceQuestionEdit;
