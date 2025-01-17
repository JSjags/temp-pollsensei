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
  if (isEdit && editIndex === index) {
    if (item.question_type === "matrix_multiple_choice") {
      return (
        <MatrixQuestionEdit
          question={item.question}
          options={item.options}
          is_required={item.is_required}
          questionType={item.question_type}
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
        questionType={item.question_type}
        is_required={item.is_required}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  const commonProps = {
    key: index,
    index: index + 1,
    question: item.question,
    questionType: item.question_type,
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

  const QuestionComponent = questionComponents[item.question_type];
  if (!QuestionComponent) return null;

  const extraProps = {
    ...(item.options && { options: item.options }),
    ...(item.rows && { rows: item.rows }),
    ...(item.columns && { columns: item.columns }),
  };

  return <QuestionComponent {...commonProps} {...extraProps} />;
};

export default QuestionRenderer;
