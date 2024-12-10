import React, { useState } from "react";

import { toast } from "react-toastify";

import { useCreateReviewMutation } from "@/services/superadmin.service";
import { useRouter } from "next/navigation";

interface SubscribeProps {
  onClose: () => void;
  openModal: boolean;
  survey_id: string;
}

interface Question {
  question: string;
  options?: string[];
  question_type: "single_choice" | "short_text" | "likert_scale";
}




const ReviewModal: React.FC<SubscribeProps> = ({ onClose, survey_id, openModal }) => {
  const [answers, setAnswers] = useState<{     [key: string]: { selected_options?: string[]; scale_value?: string; text?: string }; }>({});
  const router = useRouter()
  const questions: Question[] = [
    {
      question: "Which better best describes you?",
      question_type: "single_choice",
      options: ["Business", "Marketing / Sales", "Student", "Academic", "Government / NGO"],
    },
    {
      question: "What improvement do you suggest for PollSensei?",
      question_type: "short_text",
    },
    {
      question: "How satisfied are you with your overall experience on PollSensei?",
      question_type: "single_choice",
      options: ["Very satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"],
    },
  ];

  const handleAnswerChange = (key: string, value: any, type: string) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: type === "short_text" ? { text: value } : type === "likert_scale" ? { scale_value: value } : { selected_options: [value] },
    }));
  };

  const handleSubmit =async (e: React.FormEvent) => {
    e.preventDefault();
    const reviews = questions.map((question) => ({
      question: question.question,
      question_type: question.question_type,
      ...answers[question.question],
    }));

    const payload = {
      survey_id,
      reviews,
    };

    console.log(payload)
    try {
      await createReview(payload).unwrap();
      toast.success(
        "Your review is noted"
      );
      console.log("Your review is noted");
    } catch (err: any) {
      toast.error(
        "Failed to register review " + (err?.data?.message || err.message)
      );
      console.error("Failed to submit review", err);
    }
      router.push("/surveys/survey-list");
  };

  const [createReview,{ data, isLoading, isSuccess}] = useCreateReviewMutation()




  return (
 
      <div className="fixed inset-0 py-32 flex items-center justify-center bg-black bg-opacity-50" style={{zIndex:"999999px"}}>
        <div className="bg-white rounded-lg mt-16 p-8 w-[80%] lg:w-[50%] relative overflow-y-auto">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute text-4xl top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            &times;
          </button>

          <div className="flex flex-col items-center gap-2">
          <h2 className="font-medium text-2xl text-center">
                Help Us Serve You Better
                </h2>
                <p className="text-[#838383] font-normal text-center">
                  Take a minute survey
                </p>
          <form onSubmit={handleSubmit} className="space-y-6">
          {questions?.map((question, index) => (
            <div key={index} className="space-y-2 py-3">
              <p className="font-medium">
                <span>{index + 1}. </span>
                {question.question}
              </p>
              {question.question_type === "single_choice" && question.options && (
                <div className="space-y-1">
                  {question.options.map((option) => (
                    <label key={option} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name={question.question}
                        value={option}
                        className="cursor-pointer"
                        onChange={(e) =>
                          handleAnswerChange(question.question, e.target.value, question.question_type)
                        }
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}
              {question.question_type === "short_text" && (
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Type your answer here..."
                  onChange={(e) => handleAnswerChange(question.question, e.target.value, question.question_type)}
                />
              )}
              {question.question_type === "likert_scale" && question.options && (
                <div className="flex items-center justify-between space-x-2">
                  {question.options.map((option) => (
                    <label key={option} className="flex flex-col items-center">
                      <input
                        type="radio"
                        name={question.question}
                        value={option}
                        className="cursor-pointer"
                        onChange={(e) =>
                          handleAnswerChange(question.question, e.target.value, question.question_type)
                        }
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}

        <button
          type="submit"
          className="w-full py-2 auth-btn justify-center mt-4"
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </form>

      </div>
        </div>
      </div>
  );
};

export default ReviewModal;


