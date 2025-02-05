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
    columns?: string[],
    can_accept_media?: boolean
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
  const [question] = useState<string>("");
  const [questionType] = useState<string>("multiple_choice");
  const [options] = useState<string[] | any>([""]);
  const [is_required] = useState<boolean>(true);
  const [can_accept_media, setCanAcceptMedia] = useState<boolean>(true);
  const [min] = useState<number | undefined>(undefined);
  const [max] = useState<number | undefined>(undefined);
  const [rows] = useState<string[]>([]);
  const [columns] = useState<string[]>([]);

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
      can_accept_media={can_accept_media}
    />
  );
};

export default AddQuestion;
