import { toast } from "react-toastify";
import { updateSection } from "@/redux/slices/survey.slice";

export const handleRequiredToggle = (
  index: number,
  currentSection: number,
  questions: any[],
  dispatch: any
) => {
  const updatedSections = [...questions];
  const updatedSection = { ...updatedSections[currentSection] };
  const updatedQuestions = [...updatedSection.questions];

  updatedQuestions[index] = {
    ...updatedQuestions[index],
    is_required: !updatedQuestions[index].is_required,
  };

  updatedSection.questions = updatedQuestions;
  dispatch(
    updateSection({ index: currentSection, newSection: updatedSection })
  );
};

export const processNewSurveyQuestions = (response: any) => {
  return response.map((question: any) => {
    const optionType = question["Option type"]?.trim();

    const baseQuestion = {
      question: question.Question,
      question_type: optionType || "",
      is_required: true,
      description: "",
    };

    if (optionType === "matrix_multiple_choice") {
      return {
        ...baseQuestion,
        rows: question.Options.Rows,
        columns: question.Options.Columns,
      };
    }

    if (optionType === "long_text" || optionType === "short_text") {
      return {
        ...baseQuestion,
        options: "",
      };
    }

    if (optionType === "boolean") {
      return {
        ...baseQuestion,
        options: ["Yes", "No"],
      };
    }

    if (optionType === "number") {
      return {
        ...baseQuestion,
        options: "",
        min: 1,
        max: 10000000,
      };
    }

    if (optionType === "slider") {
      return {
        ...baseQuestion,
        options: "",
        min: question.Options.Min,
        max: question.Options.Max,
        step: question.Options.Step,
      };
    }

    return {
      ...baseQuestion,
      options: question.Options,
    };
  });
};
