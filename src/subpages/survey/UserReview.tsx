import { useCreateReviewMutation, useGetReviewQuery } from "@/services/superadmin.service";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

interface Question {
  id: string;
  question: string;
  options?: string[]; // For multiple-choice questions
  type: "single-choice" | "short-text" | "likert-scale"; // Determines rendering
  key: string; // Key for JSON structure
}

const UserReview: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(5);
  const router = useRouter()
  // const { data } = useGetReviewQuery(currentPage)
  const [answers, setAnswers] = useState<{ [key: string]: string }>({
    survey_id: "6720b91b2bd7efe551ecd6b5"
  });

  const questions: Question[] = [
    {
      id: "1",
      question: "Which better best describes you?",
      options: [
        "Business",
        "Marketing/Sales",
        "Student",
        "Academic",
        "Government/NGO",
      ],
      type: "single-choice",
      key: "field_description",
    },
    {
      id: "2",
      question: "What improvement do you suggest for PollSensei?",
      type: "short-text",
      key: "suggested_improvement",
    },
    {
      id: "3",
      question:
        "How satisfied are you with your overall experience on PollSensei?",
      options: [
        "Very satisfied",
        "Satisfied",
        "Neutral",
        "Dissatisfied",
        "Very dissatisfied",
      ],
      type: "single-choice",
      key: "overall_satisfaction",
    },
    {
      id: "4",
      question: "Rate your ease of use",
      type: "likert-scale",
      key: "ease_of_use",
      options: ["1", "2", "3", "4", "5"], // Likert scale options
    },
    {
      id: "5",
      question: "Which do you find most useful?",
      options: ["Generate with AI", "Create Manually", "Both"],
      type: "single-choice",
      key: "most_useful_feature",
    },
    {
      id: "6",
      question: "What features do you find valuable?",
      options: [
        "A simple and intuitive user interface",
        "Quick survey setup and deployment",
        "Guided templates for survey creation",
        "Flexible question types",
        "Real-time response tracking and reporting",
      ],
      type: "single-choice",
      key: "valuable_features",
    },
    {
      id: "7",
      question: "Rate the pre-made survey design available in PollSensei",
      type: "likert-scale",
      key: "survey_design_rating",
      options: ["1", "2", "3", "4", "5"], // Likert scale options
    },
  ];

  const handleAnswerChange = (key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

 
  const handleSubmit =async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted Answers:", answers);

    // try {
    //   await createReview(answers).unwrap();
    //   toast.success(
    //     "Your review is noted"
    //   );
    //   console.log("Your review is noted");
    // } catch (err: any) {
    //   toast.error(
    //     "Failed to register review " + (err?.data?.message || err.message)
    //   );
    //   console.error("Failed to submit review", err);
    // }
    //   router.push("/surveys/survey-list");
  };

  const [createReview,{ data, isLoading, isSuccess}] = useCreateReviewMutation()

  return (
    <div className="w-full container mx-auto px-4 py-10">
    <div className=" mx-auto w-[60%] bg-[#e5e5e5] p-8">
      <h1 className="text-xl font-bold text-center mb-4">PollSensei Survey</h1>
      <h2 className="font-medium  text-center">
                Help Us Serve You Better
                </h2>
                <p className="text-[#838383] font-normal text-center">
                  Take a minute survey
                </p>
      <form onSubmit={handleSubmit} className="space-y-6 mx-auto">
        {questions.map((question, index) => (
          <div key={question.id} className="space-y-2 py-3">
            <p className="font-medium"><span>{index + 1}. </span>{question.question}</p>

            {question.type === "single-choice" && question.options && (
              <div className="space-y-1">
                {question.options.map((option) => (
                  <label
                    key={option}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={option}
                      className="cursor-pointer"
                      onChange={(e) =>
                        handleAnswerChange(question.key, e.target.value)
                      }
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}

            {question.type === "short-text" && (
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Type your answer here..."
                onChange={(e) =>
                  handleAnswerChange(question.key, e.target.value)
                }
              />
            )}

            {question.type === "likert-scale" && question.options && (
              <div className="flex items-center justify-between space-x-2">
                {question.options.map((option) => (
                  <label key={option} className="flex flex-col items-center">
                    <input
                      type="radio"
                      name={question.id}
                      value={option}
                      className="cursor-pointer"
                      onChange={(e) =>
                        handleAnswerChange(question.key, e.target.value)
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
          className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
    </div>
  );
};

export default UserReview;
