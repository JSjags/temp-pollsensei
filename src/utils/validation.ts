export const validateQuestionResponse = (question: any, answer: any) => {
  if (question.is_required) {
    if (!answer) return "This question is required";

    switch (question.question_type) {
      case "checkbox":
      case "multiple_choice":
        if (!answer.selected_options?.length) {
          return "Please select at least one option";
        }
        break;

      case "single_choice":
        if (!answer.selected_options?.[0]) {
          return "Please select an option";
        }
        break;

      case "drop_down":
        if (!answer.drop_down_value) {
          return "Please select an option";
        }
        break;

      case "likert_scale":
        if (!answer.scale_value) {
          return "Please select a rating";
        }
        break;

      case "matrix_multiple_choice":
      case "matrix_checkbox":
        if (!answer.matrix_answers?.length) {
          return "Please complete the matrix";
        }
        break;

      case "slider":
      case "rating_scale":
      case "star_rating":
        if (answer.scale_value === undefined || answer.scale_value === null) {
          return "Please provide a rating";
        }
        break;

      case "number":
        if (typeof answer.num !== "number") {
          return "Please enter a valid number";
        }
        if (question.min && answer.num < question.min) {
          return `Value must be at least ${question.min}`;
        }
        if (question.max && answer.num > question.max) {
          return `Value must be at most ${question.max}`;
        }
        break;

      case "text":
      case "short_text":
      case "long_text":
        if (!answer.text?.trim() && !answer.media_url) {
          return "Please enter a response or provide media";
        }
        break;

      case "media":
        if (!answer.media_url) {
          return "Please upload media";
        }
        break;

      case "boolean":
        if (
          answer.boolean_value === undefined ||
          answer.boolean_value === null
        ) {
          return "Please select yes or no";
        }
        break;

      default:
        return "Invalid question type";
    }
  }
  return "";
};
