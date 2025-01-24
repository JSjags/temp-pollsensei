import { draggable } from "@/assets/images";
import {
  setActionMessage,
  setCurrentQuestion,
  setCurrentQuestionType,
  setIsCollapsed,
} from "@/redux/slices/sensei-master.slice";
import Image from "next/image";
import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/shadcn-textarea";
import { Star } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { SurveyData } from "@/subpages/survey/EditSubmittedSurvey";
import { RootState } from "@/redux/store";

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
  surveyData?: SurveyData;
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
  maxValue: initialMaxValue = 10,
  matrixRows: initialRows = [],
  matrixColumns: initialColumns = [],
  surveyData,
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
  const [previewValue, setPreviewValue] = useState<any>("");
  const [selectedRating, setSelectedRating] = useState<number>(0);

  const questionText = useSelector(
    (state: RootState) => state?.survey?.question_text
  );

  const defaultLikertOptions = [
    "Strongly Disagree",
    "Disagree",
    "Neutral",
    "Agree",
    "Strongly Agree",
  ];

  // Extract range from question text
  const extractRange = (question: string) => {
    // If min and max are provided, use those values
    if (minValue !== undefined && maxValue !== undefined) {
      return {
        minValue,
        maxValue,
      };
    }

    // Otherwise extract from question text
    const numberWords: { [key: string]: number } = {
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6,
      seven: 7,
      eight: 8,
      nine: 9,
      ten: 10,
      twenty: 20,
      thirty: 30,
      forty: 40,
      fifty: 50,
      sixty: 60,
      seventy: 70,
      eighty: 80,
      ninety: 90,
      hundred: 100,
    };

    // Convert text numbers to digits
    let processedQuestion = question.toLowerCase();
    Object.entries(numberWords).forEach(([word, num]) => {
      processedQuestion = processedQuestion.replace(
        new RegExp(word, "g"),
        num.toString()
      );
    });

    // Try different patterns
    const patterns = [
      /(\d+)\s*-\s*(\d+)/, // "1-5"
      /(\d+)\s*to\s*(\d+)/, // "1 to 5"
      /(\d+)\s*\.\.\s*(\d+)/, // "1..5"
      /(\d+)\s*points?\s*=.*?\/\s*(\d+)\s*points?/i, // "1 point = not important / 5 points"
      /(\d+)\s*points?\s*=.*?(\d+)\s*points?\s*=/i, // "1 point = ... 5 points ="
    ];

    for (const pattern of patterns) {
      const match = processedQuestion.match(pattern);
      if (match) {
        const [_, start, end] = match;
        return {
          min: parseInt(start),
          max: parseInt(end),
        };
      }
    }

    return null;
  };

  // Generate default labels for a rating scale
  const generateRatingLabels = (min: number, max: number) => {
    const defaultLabels = ["Poor", "Fair", "Good", "Very Good", "Excellent"];
    const range = max - min + 1;

    if (range <= defaultLabels.length) {
      return defaultLabels.slice(0, range);
    }

    return Array.from({ length: range }, (_, i) => (i + min).toString());
  };

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
      [
        "multiple_choice",
        "single_choice",
        "checkbox",
        "drop_down",
        "likert_scale",
      ].includes(questionType)
    ) {
      // Only set initial options if they don't already exist
      if (
        !editedOptions.length ||
        (editedOptions.length === 1 && !editedOptions[0])
      ) {
        setEditedOptions(options?.length ? [...options] : [""]);
      }
    }
  }, [questionType]);

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
      case "likert_scale":
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
    setPreviewValue("");
    setSelectedRating(0);

    // Initialize with appropriate default values
    switch (value) {
      case "multiple_choice":
      case "single_choice":
      case "checkbox":
      case "drop_down":
        setEditedOptions([""]);
        break;
      case "matrix_multiple_choice":
      case "matrix_checkbox":
        setRows([""]);
        setColumns([""]);
        setSelectedMatrixItems({});
        break;
      case "slider":
        setMinValue(0);
        setMaxValue(10);
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
    setEditedOptions((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
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
      if (editedQuestionType === "slider") {
        onSave(
          editedQuestion,
          [],
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
          editedOptions.filter((opt) => opt.trim()),
          editedQuestionType,
          isRequired
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

  const renderPreview = () => {
    switch (editedQuestionType) {
      case "checkbox":
        return (
          <div className="space-y-2">
            {editedOptions.map((option, idx) => (
              <div
                key={`checkbox-${idx}`}
                className="flex items-center space-x-2"
              >
                <Checkbox
                  id={`preview-checkbox-${idx}`}
                  checked={previewValue[idx]}
                  onCheckedChange={(checked) => {
                    setPreviewValue((prev: any) => ({
                      ...prev,
                      [idx]: checked,
                    }));
                  }}
                />
                <Input
                  value={option}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  placeholder={`Option ${idx + 1}`}
                  className="border-none shadow-none"
                />
              </div>
            ))}
          </div>
        );

      case "multiple_choice":
      case "single_choice":
        return (
          <RadioGroup
            value={previewValue}
            onValueChange={setPreviewValue}
            className="space-y-2"
          >
            {editedOptions.map((option, idx) => (
              <div key={`radio-${idx}`} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={idx.toString()}
                  id={`preview-radio-${idx}`}
                />
                <Input
                  value={option}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  placeholder={`Option ${idx + 1}`}
                  className="border-none shadow-none"
                />
              </div>
            ))}
          </RadioGroup>
        );

      case "drop_down":
        return (
          <Select value={previewValue} onValueChange={setPreviewValue}>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {editedOptions.map((option, idx) => (
                <SelectItem key={`select-${idx}`} value={idx.toString()}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "boolean":
        return (
          <RadioGroup
            value={previewValue}
            onValueChange={setPreviewValue}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id={`preview-radio-yes`} />
              <label htmlFor="preview-radio-yes">Yes</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id={`preview-radio-no`} />
              <label htmlFor="preview-radio-no">No</label>
            </div>
          </RadioGroup>
        );

      case "short_text":
        return (
          <Input
            value={previewValue}
            onChange={(e) => setPreviewValue(e.target.value)}
            placeholder="Enter your answer"
          />
        );

      case "long_text":
        return (
          <Textarea
            value={previewValue}
            onChange={(e) => setPreviewValue(e.target.value)}
            placeholder="Enter your answer"
          />
        );

      case "slider":
        return (
          <div className="space-y-4">
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
            <div className="flex justify-between text-sm text-gray-500">
              <Input
                type="number"
                value={minValue}
                onChange={(e) => setMinValue(Number(e.target.value))}
                className="w-20 text-center"
              />
              <Input
                type="number"
                value={maxValue}
                onChange={(e) => setMaxValue(Number(e.target.value))}
                className="w-20 text-center"
              />
            </div>
          </div>
        );

      case "likert_scale":
        return (
          <RadioGroup
            value={previewValue}
            onValueChange={setPreviewValue}
            className="flex justify-between"
          >
            {editedOptions.map((option, idx) => (
              <div
                key={`likert-${idx}`}
                className="flex flex-col items-center space-y-2"
              >
                <RadioGroupItem
                  value={idx.toString()}
                  id={`preview-likert-${idx}`}
                />
                <Input
                  value={option}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  placeholder={`Option ${idx + 1}`}
                  className="border-none shadow-none text-center w-24 text-sm"
                />
              </div>
            ))}
          </RadioGroup>
        );

      case "rating_scale":
        const range = extractRange(editedQuestion);
        const { min, max } = range || { min: 1, max: 5 };
        const labels = generateRatingLabels(min ?? 1, max ?? 5);

        return (
          <RadioGroup
            value={previewValue}
            onValueChange={setPreviewValue}
            className="flex items-center justify-between gap-2 w-full"
          >
            {labels.map((label, idx) => (
              <div
                className="flex flex-col justify-center items-center gap-2"
                key={`rating-${idx}`}
              >
                <RadioGroupItem
                  value={label}
                  id={`preview-rating-${idx}`}
                  className="h-6 w-6 data-[state=checked]:bg-purple-600 data-[state=checked]:text-white"
                />
                <Input
                  value={label}
                  onChange={(e) => {
                    const newLabels = [...labels];
                    newLabels[idx] = e.target.value;
                    // Update labels logic here
                  }}
                  className="border-none shadow-none text-center w-20 text-sm"
                />
              </div>
            ))}
          </RadioGroup>
        );

      case "star_rating":
        return (
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Star
                key={`star-${rating}`}
                className={cn(
                  "w-6 h-6 cursor-pointer transition-colors",
                  rating <= selectedRating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300 hover:text-yellow-200"
                )}
                onClick={() => setSelectedRating(rating)}
              />
            ))}
          </div>
        );

      case "number":
        return (
          <Input
            type="number"
            value={previewValue}
            onChange={(e) => setPreviewValue(e.target.value)}
            placeholder="Enter a number"
          />
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "mb-6 bg-gray-50 shadow-sm hover:shadow-md rounded-xl p-6 transition-all duration-300",
        {
          [`font-${questionText?.name
            ?.split(" ")
            .join("-")
            .toLowerCase()
            .replace(/\s+/g, "-")}`]: questionText?.name,
        }
      )}
      style={{
        fontSize: `${questionText?.size}px`,
      }}
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
                  <SelectItem key={`type-${type.value}`} value={type.value}>
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
                    <div key={`matrix-row-${index}`} className="flex gap-2">
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
                    <div key={`matrix-col-${index}`} className="flex gap-2">
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
                    key={`option-${index}`}
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
                  className="w-full bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] text-white hover:bg-gradient-to-r hover:from-[#6d04d2] hover:to-[#b75ed6] hover:text-white transition-all duration-200"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Option
                </Button>
              </motion.div>
            )}

            {/* Preview Section */}
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 border-t pt-4 mt-4"
            >
              <Label>Preview</Label>
              <div className="p-4 border rounded-lg bg-gray-50">
                {renderPreview()}
              </div>
            </motion.div>
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
