import React, { useState } from "react";
import Image from "next/image";
import { Form, Field } from "react-final-form";
import validate from "validate.js";
import Link from "next/link";
import { ClipLoader } from "react-spinners";
import { Modal } from "flowbite-react";
import close from "./close.svg";
import Input from "../ui/Input";
import { toast } from "react-toastify";
import ModalComponent from "../ui/ModalComponent";
import { mail_bag } from "@/assets/images";
import { useCreateReviewMutation } from "@/services/superadmin.service";
import { useRouter } from "next/navigation";

interface SubscribeProps {
  onClose: () => void;
  openModal: boolean;
  survey_id: string;
}

interface Question {
  id: string;
  question: string;
  options?: string[]; // For multiple-choice questions
  type: "single-choice" | "short-text"; // Determines rendering
  key: string; // Key for JSON structure
}


const constraints = {
  field_description: {
    presence: true,
  },
  suggested_improvement: {
    presence: true,
  },
  overall_satisfaction: {
    presence: true,
  },
};

const ReviewModal: React.FC<SubscribeProps> = ({ onClose, survey_id, openModal }) => {
  const [answers, setAnswers] = useState<{ [key: string]: string }>({
    survey_id: survey_id, 
  });
  const router = useRouter()
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
  ];

  const handleAnswerChange = (key: string, value: string) => {
    setAnswers((prev:any) => ({ ...prev, [key]: value }));
  };
  const handleSubmit =async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted Answers:", answers);
    // Handle API submission or other logic here
    try {
      await createReview(answers).unwrap();
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

  const onSubmit = async (values: { field_description: string; suggested_improvement: string; overall_satisfaction:string }) => {
    const review_response = {...values, survey_id}
    try {
      await createReview(review_response).unwrap();
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
  };

  const validateForm = (values: any) => {
    return validate(values, constraints) || {};
  };
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
        {questions.map((question) => (
          <div key={question.id} className="space-y-2">
            <p className="font-medium">{question.question}</p>
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
                      required
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
                required
              />
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


