import React, { useState } from "react";
import Select from "react-select";
import { MdDeleteOutline } from "react-icons/md";
import { Switch } from "@/components/ui/switch";
import MultiChoiceQuestionEdit from "@/components/survey/MultiChoiceQuestionEdit";

interface AddQuestionProps {
  onSave?: (
    question: string,
    options: string[],
    questionType: string,
    is_required: boolean,
    min?: number,
    max?: number,
    rows?: string[],
    columns?: string[]
  ) => void;
  onCancel?: () => void;
}

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    paddingLeft: "1.3rem",
    border: "none",
    backgroundColor: "#fff",
    color: "#9900EF",
    outline: "none",
  }),
  option: (provided: any) => ({
    ...provided,
    display: "flex",
    alignItems: "center",
  }),
};

const AddQuestion: React.FC<AddQuestionProps> = ({ onSave, onCancel }) => {
  const [question, setQuestion] = useState<string>("");
  const [questionType, setQuestionType] = useState<string>("multiple_choice");
  const [options, setOptions] = useState<string[] | any>([""]);
  const [is_required, setIsRequired] = useState<boolean>(true);
  const [min, setMin] = useState<number | undefined>(undefined);
  const [max, setMax] = useState<number | undefined>(undefined);
  const [rows, setRows] = useState<string[]>([]);
  const [columns, setColumns] = useState<string[]>([]);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(
        question,
        options,
        questionType,
        is_required,
        min,
        max,
        questionType === "matrix_checkbox" ? rows : undefined,
        questionType === "matrix_checkbox" ? columns : undefined
      );
    }
  };

  const handleAddRow = () => setRows([...rows, ""]);
  const handleRemoveRow = (index: number) =>
    setRows(rows.filter((_, i) => i !== index));
  const handleRowChange = (index: number, value: string) => {
    const updatedRows = [...rows];
    updatedRows[index] = value;
    setRows(updatedRows);
  };

  const handleAddColumn = () => setColumns([...columns, ""]);
  const handleRemoveColumn = (index: number) =>
    setColumns(columns.filter((_, i) => i !== index));
  const handleColumnChange = (index: number, value: string) => {
    const updatedColumns = [...columns];
    updatedColumns[index] = value;
    setColumns(updatedColumns);
  };

  const handleQuestionTypeChange = (selectedOption: any) => {
    setQuestionType(selectedOption.value);
    switch (selectedOption.value) {
      case "Likert Scale":
        setOptions([
          "Strongly Disagree",
          "Disagree",
          "Neutral",
          "Agree",
          "Strongly Agree",
        ]);
        break;
      case "multiple_choice":
        setOptions([""]);
        break;
      case "long_text":
        setOptions([]);
        break;
      case "boolean":
        setOptions(["True", "False"]);
        break;
      case "number":
        setOptions([]);
        break;
      case "slider":
        setOptions([1, 2, 3, 4, 5]);
        break;
      case "matrix_checkbox":
        // setOptions({
        //   Head: ["Head 1", "Head 2", "Head 3", "Head 4", "Head 5"],
        //   Body: ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"],
        // });
        setRows([]);
        setColumns([]);
        break;
      default:
        setOptions([""]);
    }
  };

  const selectOptions = [
    { value: "multiple_choice", label: "Multiple Choice" },
    { value: "single_choice", label: "Single Choice" },
    { value: "long_text", label: "Comment" },
    { value: "likert_scale", label: "Likert Scale" },
    { value: "short_text", label: "Short Text" },
    { value: "checkbox", label: "Checkbox" },
    { value: "star_rating", label: "Star Rating" },
    { value: "rating_scale", label: "Rating Scale" },
    { value: "boolean", label: "Boolean" },
    // { value: "slider", label: "Slider" },
    { value: "number", label: "Number" },
    { value: "drop_down", label: "Dropdown" },
    { value: "matrix_checkbox", label: "Matrix" },
    { value: "media", label: "Media" },
  ];

  return (
    <MultiChoiceQuestionEdit
      question={question}
      options={options}
      questionType={questionType}
      is_required={is_required}
      onSave={(
        updatedQuestion,
        updatedOptions,
        editedQuestionType,
        is_required,
        minValue,
        maxValue,
        rows,
        columns
      ) => {
        if (onSave) {
          onSave(
            updatedQuestion,
            updatedOptions,
            editedQuestionType,
            is_required,
            minValue,
            maxValue,
            rows,
            columns
          );
        }
      }}
      onCancel={onCancel}
      minValue={min}
      maxValue={max}
      matrixRows={rows}
      matrixColumns={columns}
    />
  );
};

export default AddQuestion;
