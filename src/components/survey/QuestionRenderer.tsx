import React from "react";
import MultiChoiceQuestion from "./MultiChoiceQuestion";
import CommentQuestion from "./CommentQuestion";
import LinearScaleQuestion from "./LinearScaleQuestion";
import LikertScaleQuestion from "./LikertScaleQuestion";
import StarRatingQuestion from "./StarRatingQuestion";
import MatrixQuestion from "./MatrixQuestion";
import SingleChoiceQuestion from "./SingleChoiceQuestion";
import CheckboxQuestion from "./CheckboxQuestion";
import RatingScaleQuestion from "./RatingScaleQuestion";
import DropdownQuestion from "./DropdownQuestion";
import NumberQuestion from "./NumberQuestion";
import ShortTextQuestion from "./LongTextQuestion";
import BooleanQuestion from "./BooleanQuestion";
import SliderQuestion from "./SliderQuestion";
import MultiChoiceQuestionEdit from "./MultiChoiceQuestionEdit";
import MatrixQuestionEdit from "./MatrixQuestionEdit";

interface QuestionRendererProps {
  item: any;
  index: number;
  isEdit: boolean;
  editIndex: number | null;
  currentSection: number;
  handleSave: any;
  handleCancel: () => void;
  handleAISave: any;
  EditQuestion: (index: number) => void;
  handleDeleteQuestion: (index: number) => void;
  handleRequiredToggle: (index: number) => void;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  item,
  index,
  isEdit,
  editIndex,
  handleSave,
  handleCancel,
  handleAISave,
  EditQuestion,
  handleDeleteQuestion,
  handleRequiredToggle,
}) => {
  const questionType =
    !item.question_type && item.rows?.length && item.columns?.length
      ? "matrix_multiple_choice"
      : item.question_type;

  if (isEdit && editIndex === index) {
    if (
      questionType === "matrix_multiple_choice" ||
      questionType === "matrix_checkbox"
    ) {
      return (
        <MatrixQuestionEdit
          question={item.question}
          options={item.options}
          is_required={item.is_required}
          questionType={questionType}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      );
    }
    return (
      <MultiChoiceQuestionEdit
        index={index + 1}
        question={item.question}
        options={item.options}
        questionType={questionType}
        is_required={item.is_required}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  const commonProps = {
    index: index + 1,
    question: item.question,
    questionType: questionType,
    EditQuestion: () => EditQuestion(index),
    DeleteQuestion: () => handleDeleteQuestion(index),
    is_required: item.is_required,
    setIsRequired: () => handleRequiredToggle(index),
    onSave: handleAISave,
  };

  const questionComponents: { [key: string]: React.FC<any> } = {
    multiple_choice: MultiChoiceQuestion,
    multi_choice: MultiChoiceQuestion,
    comment: CommentQuestion,
    long_text: CommentQuestion,
    linear_Scale: LinearScaleQuestion,
    likert_scale: LikertScaleQuestion,
    star_rating: StarRatingQuestion,
    matrix_multiple_choice: MatrixQuestion,
    matrix_checkbox: MatrixQuestion,
    single_choice: SingleChoiceQuestion,
    checkbox: CheckboxQuestion,
    rating_scale: RatingScaleQuestion,
    drop_down: DropdownQuestion,
    number: NumberQuestion,
    short_text: ShortTextQuestion,
    boolean: BooleanQuestion,
    slider: SliderQuestion,
  };

  const QuestionComponent = questionComponents[questionType];
  if (!QuestionComponent) return null;

  const extraProps = {
    ...(item.options && !item.options.Rows && { options: item.options }),
    ...(item.options?.Rows && { rows: item?.options?.Rows }),
    ...(item.options?.Columns && {
      columns: item?.options?.Columns,
    }),
    ...(item?.rows && { rows: item.rows }),
    ...(item?.columns && {
      columns: item.columns,
    }),
    isEdit: true,
  };

  return <QuestionComponent key={index} {...commonProps} {...extraProps} />;
};

export default QuestionRenderer;
