import {
  resetFilters,
  setAnswersss,
  setQuestion,
  setQuestionType,
} from "@/redux/slices/filter.slice";
import { resetName } from "@/redux/slices/name.slice";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

interface DropdownData {
  questions: any;
}

const ThreeStepDropdown: React.FC<DropdownData> = ({ questions }) => {
  const dispatch = useDispatch();
  const [isAddingFilter, setIsAddingFilter] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [selectedQuestionType, setSelectedQuestionType] = useState<
    string | null
  >(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleReset = () => {
    setSelectedQuestion(null);
    setSelectedAnswer(null);
    setIsAddingFilter(false);
    dispatch(resetFilters());
    dispatch(resetName());

  };

  useEffect(() => {
    if (selectedAnswer) {
      console.log("Answer updated:", selectedAnswer);
    }
  }, [selectedAnswer]);

  return (
    <div className="p- space-y- flex justify-between items-start gap-4">
      <button
        onClick={() => {
          setIsAddingFilter(true);
          dispatch(resetFilters());
          dispatch(resetName());

        }}
        className="border border-gray-300 text-gray-700 rounded-md px-4 py-2 hover:bg-gray-50"
      >
        Add filter
      </button>

      {isAddingFilter && (
        <div className="space-y-4">
          {/* Step 1: Select Question */}
          {!selectedQuestion && (
            <div className="w-[350px]">
              <select
                className="block w-[400px] text-wrap p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => {
                  const value = e.target.value;
                  dispatch(setQuestion(value));
                  setSelectedQuestion(value);
                  console.log(value);
                }}
                defaultValue=""
              >
                <option value="" disabled>
                  -- Choose a Question --
                </option>
                {questions?.map((question: any, index: any) => {
                  console.log(question)
                  console.log(question?.question_type)
                  dispatch(setQuestionType(question?.question_type))
                  return (
                    <option key={index} value={question?.question}>
                      {question?.question}
                    </option>
                  )
                })}
              </select>
            </div>
          )}

          {/* Step 2: Select Question Type */}
          {/* {selectedQuestion && !selectedQuestionType && (
            <div className="">
              <select
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) =>{ 
                  const value = e.target.value;
                  dispatch(setQuestionType(value))
                  setSelectedQuestionType(value)
                }}
                defaultValue=""
              >
                <option value="" disabled>
                  -- Choose a Question Type --
                </option>
                {questions?.map((type:any, index:any) => (
                  <option key={index} value={type?.question_type
                  }>
                    {type?.question_type
                    }
                  </option>
                ))}
              </select>
            </div>
          )} */}

          {/* Step 3: Select Answer */}
          {selectedQuestion && !selectedAnswer && (
            <div className="">
              <select
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => {
                  const value = e.target.value;
                  dispatch(setAnswersss(value));
                  setSelectedAnswer(value);
                }}
                defaultValue=""
              >
                <option value="" disabled>
                  -- Choose an Answer --
                </option>
                {questions
                  ?.filter((q: any) => q.question === selectedQuestion) // Filter for the selected question
                  ?.flatMap((q: any) => q.options || []) // Get all options for the selected question
                  ?.map((option: any, index: any) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Final Step: Show Selected Filters */}
          {selectedAnswer && (
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Reset
            </button>

            // </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ThreeStepDropdown;
