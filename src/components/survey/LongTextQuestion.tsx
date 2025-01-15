import { stars } from "@/assets/images";
import { RootState } from "@/redux/store";
import { usePathname } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";
import { BsExclamation } from "react-icons/bs";
import { Check, GripVertical, MessageSquare } from "lucide-react";
import { Switch } from "../ui/switch";
import PollsenseiTriggerButton from "../ui/pollsensei-trigger-button";
import { Textarea } from "../ui/shadcn-textarea";
import { Input } from "../ui/shadcn-input";

interface ComponentQuestionProps {
  question: string;
  response?: string;
  questionType: string;
  onChange?: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  EditQuestion?: () => void;
  DeleteQuestion?: () => void;
  index: number;
  status?: string;
  is_required?: boolean;
  setIsRequired?: (value: boolean) => void;
  setEditId?: React.Dispatch<React.SetStateAction<number | null>>;
  options?: string[] | undefined;
  isEdit?: boolean;
  onSave?: (
    updatedQuestion: string,
    updatedOptions: string[],
    updatedQuestionType: string,
    aiEditIndex?: number
  ) => void;
}

const LongTextQuestion: React.FC<ComponentQuestionProps> = ({
  question,
  questionType,
  EditQuestion,
  DeleteQuestion,
  index,
  response,
  options,
  onChange,
  status,
  is_required,
  setIsRequired,
  onSave,
  setEditId,
  isEdit = false,
}) => {
  const pathname = usePathname();
  const questionText = useSelector(
    (state: RootState) => state?.survey?.question_text
  );

  const getStatus = (status: string) => {
    switch (status) {
      case "passed":
        return (
          <div className="bg-green-500 rounded-full p-1.5 mr-3">
            <Check strokeWidth={1.5} className="text-white w-4 h-4" />
          </div>
        );
      case "failed":
        return (
          <div className="bg-red-500 rounded-full p-1.5 mr-3">
            <BsExclamation className="text-white w-4 h-4" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="mb-6 bg-gray-50 shadow-sm hover:shadow-md rounded-xl p-6 transition-all duration-300"
      style={{
        fontFamily: questionText?.name,
        fontSize: `${questionText?.size}px`,
      }}
    >
      <div className="flex gap-4">
        <GripVertical
          className={`w-5 h-5 text-gray-400 mt-1 ${
            pathname === "/surveys/create-survey" ? "visible" : "invisible"
          }`}
        />

        <div className="flex-1 space-y-4">
          <div className="flex items-start">
            <span className="font-semibold min-w-[24px]">{index}.</span>
            <div className="flex-1">
              <h3 className="group font-semibold">
                <div className="flex items-start gap-2">
                  <span className="text-left">{question}</span>
                  {is_required && (
                    <span className="text-2xl text-red-500">*</span>
                  )}

                  {!pathname.includes("survey-public-response") && isEdit && (
                    <PollsenseiTriggerButton
                      key={index}
                      imageUrl={stars}
                      tooltipText="Rephrase question"
                      className="hidden group-hover:inline-block transition transform hover:scale-110"
                      triggerType="rephrase"
                      question={question}
                      optionType={questionType}
                      options={options}
                      setEditId={setEditId}
                      onSave={onSave!}
                      index={index}
                    />
                  )}
                </div>
              </h3>

              <div className="mt-4">
                {questionType === "short_text" ? (
                  <Input
                    placeholder="Type your response here..."
                    onChange={onChange}
                    value={response}
                    required={is_required}
                  />
                ) : (
                  <Textarea
                    placeholder="Type your response here..."
                    className="resize-none"
                    onChange={onChange}
                    value={response}
                    required={is_required}
                  />
                )}
              </div>
            </div>
          </div>

          {(pathname === "/surveys/edit-survey" ||
            pathname.includes("/edit-submitted-survey")) && (
            <div className="flex justify-end gap-3">
              <button
                className="px-6 py-2 text-gray-600 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
                onClick={EditQuestion}
              >
                Edit
              </button>
              <button
                className="px-6 py-2 text-red-500 border border-red-500 rounded-full hover:bg-red-50 transition-colors"
                onClick={DeleteQuestion}
              >
                Delete
              </button>
            </div>
          )}

          {pathname === "/surveys/add-question-m" && (
            <div className="flex justify-end gap-3">
              <button
                className="px-6 py-2 text-red-500 border border-red-500 rounded-full hover:bg-red-50 transition-colors"
                onClick={DeleteQuestion}
              >
                Delete
              </button>
            </div>
          )}

          {pathname.includes("edit-survey") && (
            <div className="flex items-center gap-3">
              <span className="text-gray-600">Required</span>
              <Switch
                checked={is_required}
                onCheckedChange={
                  setIsRequired
                    ? (checked: boolean) => setIsRequired(checked)
                    : undefined
                }
                className="bg-gradient-to-r from-[#5B03B2] to-[#9D50BB]"
              />
            </div>
          )}

          <div className="flex justify-end">
            {!pathname.includes("edit-survey") &&
              !pathname.includes("surveys/question") && (
                <p className="text-sm font-medium bg-gradient-to-r from-[#F5F0FF] to-[#F8F4FF] text-[#5B03B2] px-4 py-1.5 rounded-full shadow-sm border border-[#E5D5FF]">
                  {(questionType === "long_text" ||
                    questionType === "short_text") && (
                    <span className="flex items-center gap-1 text-xs">
                      <MessageSquare className="text-[#9D50BB] w-3 h-3" />
                      {questionType === "long_text"
                        ? "Long Text"
                        : "Short Text"}
                    </span>
                  )}
                </p>
              )}
          </div>
        </div>

        {pathname.includes("survey-response-upload") && status && (
          <div>{getStatus(status)}</div>
        )}
      </div>
    </div>
  );
};

export default LongTextQuestion;
