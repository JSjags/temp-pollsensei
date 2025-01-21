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
import { Checkbox } from "@/components/ui/shadcn-checkbox";
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
  minValue?: number;
  maxValue?: number;
  matrixRows?: string[];
  matrixColumns?: string[];
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
  minValue: initialMinValue = 0,
  maxValue: initialMaxValue = 100,
  matrixRows: initialRows = [],
  matrixColumns: initialColumns = [],
}) => {
  const dispatch = useDispatch();
  const [editedQuestion, setEditedQuestion] = useState<string>(question);
  const [editedQuestionType, setEditedQuestionType] =
    useState<string>(questionType);
  const [editedOptions, setEditedOptions] = useState<string[]>(options || [""]);
  const [rows, setRows] = useState<string[]>(initialRows);
  const [columns, setColumns] = useState<string[]>(initialColumns);
  const [minValue, setMinValue] = useState<number>(initialMinValue);
  const [maxValue, setMaxValue] = useState<number>(initialMaxValue);
  const [isRequired, setIsRequiredLocal] = useState<boolean>(is_required);
  const [selectedMatrixItems, setSelectedMatrixItems] = useState<{
    [key: string]: boolean;
  }>({});

  const defaultLikertOptions = [
    "Strongly Disagree",
    "Disagree",
    "Neutral",
    "Agree",
    "Strongly Agree",
  ];

  // Initialize values only when component mounts or when dependencies change
  useEffect(() => {
    if (questionType === "slider") {
      setMinValue(initialMinValue);
      setMaxValue(initialMaxValue);
    } else if (
      ["matrix_multiple_choice", "matrix_checkbox"].includes(questionType)
    ) {
      setRows(initialRows.length ? initialRows : [""]);
      setColumns(initialColumns.length ? initialColumns : [""]);
    } else if (
      ["multiple_choice", "single_choice", "checkbox", "drop_down"].includes(
        questionType
      )
    ) {
      setEditedOptions(options?.length ? options : [""]);
    } else if (questionType === "likert_scale") {
      setEditedOptions(options?.length ? options : defaultLikertOptions);
    }
  }, [
    questionType,
    initialMinValue,
    initialMaxValue,
    initialRows,
    initialColumns,
    options,
  ]);

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
      { value: "media", label: "Media" },
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
    // Basic question validation
    if (!editedQuestion.trim()) return false;

    switch (editedQuestionType) {
      case "multiple_choice":
      case "single_choice":
      case "checkbox":
      case "drop_down":
        // Allow saving as long as there's at least one non-empty option
        return editedOptions.some((opt) => opt.trim());

      case "slider":
        // Allow any min/max values as long as min is less than max
        return minValue < maxValue;

      case "matrix_multiple_choice":
      case "matrix_checkbox":
        // Allow saving as long as there's at least one non-empty row and column
        return (
          rows.some((row) => row.trim()) && columns.some((col) => col.trim())
        );

      case "likert_scale":
        // Allow customization of likert scale options
        return (
          editedOptions.length >= 2 && editedOptions.every((opt) => opt.trim())
        );

      // For other question types, no specific validation needed
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
    dispatch(setCurrentQuestionType(value));

    // Initialize with appropriate default values
    switch (value) {
      case "multiple_choice":
      case "single_choice":
      case "checkbox":
      case "drop_down":
        setEditedOptions([""]); // Start with one empty option
        break;
      case "matrix_multiple_choice":
      case "matrix_checkbox":
        setRows([""]);
        setColumns([""]);
        setSelectedMatrixItems({});
        break;
      case "slider":
        setMinValue(0);
        setMaxValue(100);
        break;
      case "likert_scale":
        setEditedOptions([...defaultLikertOptions]);
        break;
      default:
        setEditedOptions([]);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...editedOptions];
    newOptions[index] = value;
    setEditedOptions(newOptions);
  };

  const handleAddOption = () => {
    setEditedOptions((prev) => [...prev, ""]);
  };

  const handleRemoveOption = (index: number) => {
    setEditedOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMatrixChange = (
    type: "row" | "column",
    index: number,
    value: string
  ) => {
    if (type === "row") {
      const updatedRows = [...rows];
      updatedRows[index] = value;
      setRows(updatedRows);
    } else {
      const updatedColumns = [...columns];
      updatedColumns[index] = value;
      setColumns(updatedColumns);
    }
  };

  const handleMatrixItemSelect = (rowIndex: number, colIndex: number) => {
    const key = `${rowIndex}-${colIndex}`;
    setSelectedMatrixItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    if (!isValid) return;

    if (onSave) {
      const saveOptions =
        editedQuestionType === "slider"
          ? [minValue.toString(), maxValue.toString()]
          : editedOptions.filter((opt) => opt.trim());

      if (
        ["matrix_multiple_choice", "matrix_checkbox"].includes(
          editedQuestionType
        )
      ) {
        onSave(
          editedQuestion,
          [],
          editedQuestionType,
          isRequired,
          undefined,
          undefined,
          rows.filter((r) => r.trim()),
          columns.filter((c) => c.trim())
        );
      } else {
        onSave(
          editedQuestion,
          saveOptions,
          editedQuestionType,
          isRequired,
          editedQuestionType === "slider" ? minValue : undefined,
          editedQuestionType === "slider" ? maxValue : undefined
        );
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
          <div className="flex items-center gap-2">
            <Input
              value={editedQuestion}
              onChange={(e) => setEditedQuestion(e.target.value)}
              className={cn(
                "text-xl font-semibold border-none shadow-none focus:border-none",
                !editedQuestion.trim() && "border-red-500"
              )}
              placeholder="Enter your question"
            />
            {isRequired && <span className="text-red-500 text-xl">*</span>}
          </div>

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
                    />
                  </div>
                  <div className="flex-1">
                    <Label>Max Value</Label>
                    <Input
                      type="number"
                      value={maxValue}
                      onChange={(e) => setMaxValue(Number(e.target.value))}
                    />
                  </div>
                </div>
                <Slider
                  value={[minValue, maxValue]}
                  min={Math.min(minValue, maxValue)}
                  max={Math.max(minValue, maxValue)}
                  step={1}
                  className="bg-gradient-to-r from-[#5B03B2] to-[#9D50BB]"
                  onValueChange={([min, max]) => {
                    setMinValue(min);
                    setMaxValue(max);
                  }}
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
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setRows((prev) => prev.filter((_, i) => i !== index))
                        }
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
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setColumns((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
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

                {/* Matrix Preview */}
                <div className="mt-4">
                  <Label>Preview</Label>
                  <div className="mt-2 border rounded-lg p-4">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th></th>
                          {columns.map((col, colIndex) => (
                            <th key={colIndex} className="text-center p-2">
                              {col || `Column ${colIndex + 1}`}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            <td className="p-2">
                              {row || `Row ${rowIndex + 1}`}
                            </td>
                            {columns.map((_, colIndex) => (
                              <td key={colIndex} className="text-center">
                                <Checkbox
                                  checked={
                                    selectedMatrixItems[
                                      `${rowIndex}-${colIndex}`
                                    ]
                                  }
                                  onCheckedChange={() =>
                                    handleMatrixItemSelect(rowIndex, colIndex)
                                  }
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {[
              "multiple_choice",
              "single_choice",
              "checkbox",
              "drop_down",
              "likert_scale",
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
                      className="flex-1 bg-red-500"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveOption(index)}
                      className="hover:bg-red-100"
                      disabled={editedOptions.length === 1}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </motion.div>
                ))}
                <Button
                  variant="outline"
                  onClick={handleAddOption}
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
