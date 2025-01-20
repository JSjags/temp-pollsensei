import { useCreateReviewMutation, useGetReviewQuestionQuery } from "@/services/superadmin.service";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

interface Question {
  question: string;
  options?: string[];
  question_type: "single_choice" | "short_text" | "likert_scale";
}

const UserReview: React.FC = () => {
  const router = useRouter();
  const { data: reviewQuestion } = useGetReviewQuestionQuery(null);
  const [answers, setAnswers] = useState<{
    [key: string]: { selected_options?: string[]; scale_value?: string; text?: string };
  }>({});

  console.log(reviewQuestion)
  
  const [reviewerDetails, setReviewerDetails] = useState({
    reviewer_name: "",
    reviewer_email: "",
    reviewer_phone: "",
    reviewer_country: "",
  });



  const survey_id = "6720b91b2bd7efe551ecd6b5";

  const questions: Question[] = reviewQuestion?.data || [
    {
      question: "Which best describes you?",
      question_type: "single_choice",
      options: ["Business", "Marketing / Sales", "Student", "Academic", "Government / NGO"],
    },
    {
      question: "Rate your ease of use",
      question_type: "likert_scale",
      options: ["Strongly Dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Strongly Satisfied"],
    },
    {
      question: "Which do you find most useful?",
      question_type: "single_choice",
      options: ["Generate with AI", "Create Manually", "Both"],
    },
    {
      question: "What features do you find valuable?",
      question_type: "single_choice",
      options: [
        "A simple and intuitive user interface",
        "Quick survey setup and deployment",
        "Guided templates for survey creation",
        "Flexible question types",
        "Real-time response tracking and reporting",
      ],
    },
    {
      question: "Rate the pre-made survey design available in PollSensei.",
      question_type: "likert_scale",
      options: ["Strongly Dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Strongly Satisfied"],
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

  const handleReviewerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setReviewerDetails((prev) => ({ ...prev, [name]: value }));
  };

  const [createReview, { isLoading }] = useCreateReviewMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const reviews = questions.map((question) => ({
      question: question.question,
      question_type: question.question_type,
      ...answers[question.question],
    }));

    const payload = {
      survey_id,
      ...reviewerDetails,
      reviews,
    };

    console.log(payload)

    try {
      await createReview(payload).unwrap();
      toast.success("Review submitted successfully!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Failed to submit review. Please try again.");
    }
  };

  return (
    <div className="w-full container mx-auto px-4 py-10">
      <div className="mx-auto w-[60%] bg-[#e5e5e5] p-8">
        <h1 className="text-xl font-bold text-center mb-4">PollSensei Survey</h1>
        <h2 className="font-medium text-center">Help Us Serve You Better</h2>
        <p className="text-[#838383] font-normal text-center">Take a minute survey</p>
        <form onSubmit={handleSubmit} className="space-y-6 mx-auto">

        {/* <div className="grid grid-cols-1 gap-4 border md:grid-cols-2 mt-10">
            <div className="">
              <label className="block font-medium mb-2" htmlFor="reviewer_name">Your Name</label>
              <input
                type="text"
                id="reviewer_name"
                name="reviewer_name"
                className="w-full p-2 border my-0 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your name"
                value={reviewerDetails.reviewer_name}
                onChange={handleReviewerChange}
              />
            </div>
            <div className="">
              <label className="block font-medium mb-2" htmlFor="reviewer_email">Email Address</label>
              <input
                type="email"
                id="reviewer_email"
                name="reviewer_email"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
                value={reviewerDetails.reviewer_email}
                onChange={handleReviewerChange}
              />
            </div>
            <div className="">
              <label className="block font-medium mb-2" htmlFor="reviewer_phone">Phone Number</label>
              <input
                type="tel"
                id="reviewer_phone"
                name="reviewer_phone"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your phone number"
                value={reviewerDetails.reviewer_phone}
                onChange={handleReviewerChange}
              />
            </div>
            <div className="">
              <label className="block font-medium mb-2" htmlFor="reviewer_country">Country</label>
              <input
                type="text"
                id="reviewer_country"
                name="reviewer_country"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your country"
                value={reviewerDetails.reviewer_country}
                onChange={handleReviewerChange}
              />
            </div>
          </div> */}

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
            disabled={isLoading}
            className="w-full py-2 auth-btn justify-center mt-4"
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserReview;
