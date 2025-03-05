import { RootState } from "@/redux/store";
import { usePathname } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";
import { BsExclamation } from "react-icons/bs";
import {
  Check,
  GripVertical,
  MessageSquare,
  AlignLeft,
  TextCursor,
} from "lucide-react";
import { Switch } from "../ui/switch";
import PollsenseiTriggerButton from "../ui/pollsensei-trigger-button";
import { Textarea } from "../ui/shadcn-textarea";
import { Input } from "../ui/shadcn-input";
import ActionButtons from "./ActionButtons";
import { SurveyData } from "@/subpages/survey/EditSubmittedSurvey";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

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
  surveyData?: SurveyData;
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
  surveyData,
}) => {
  const pathname = usePathname();
  const questionText = useSelector(
    (state: RootState) => state?.survey?.question_text
  );

  const getStatus = (status: string) => {
    switch (status) {
      case "passed":
        return (
          <div className="bg-green-500 rounded-full p-1 transition-all duration-200 hover:bg-green-600">
            <Check
              strokeWidth={1.5}
              className="w-4 h-4 text-white"
              aria-label="Passed validation"
            />
          </div>
        );
      case "failed":
        return (
          <div className="bg-red-500 rounded-full p-1 transition-all duration-200 hover:bg-red-600">
            <BsExclamation
              className="w-4 h-4 text-white"
              aria-label="Failed validation"
            />
          </div>
        );
      case "pending":
        return (
          <div className="bg-yellow-500 rounded-full p-1 transition-all duration-200 hover:bg-yellow-600">
            <span
              className="block w-4 h-4 animate-pulse"
              aria-label="Validation pending"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "mb-6 bg-gray-50 shadow-sm hover:shadow-md rounded-xl p-6 transition-all duration-300",
        {
          [`font-${questionText?.name
            ?.split(" ")
            .join("-")
            .toLowerCase()
            .replace(/\s+/g, "-")}`]: questionText?.name,
        }
      )}
      style={{
        fontSize: `${questionText?.size}px`,
      }}
    >
      <div className="flex gap-4">
        <GripVertical
          className={`w-5 h-5 text-gray-400 mt-1 ${
            pathname === "/surveys/create-survey" ? "visible" : "hidden"
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

                  {!pathname.includes("survey-public-response") &&
                    !pathname.includes("response-upload") &&
                    isEdit && (
                      <PollsenseiTriggerButton
                        key={index}
                        tooltipText="Rephrase question"
                        className="hidden group-hover:inline-block transition transform hover:scale-110"
                        triggerType="rephrase"
                        question={question}
                        optionType={questionType}
                        options={options}
                        setEditId={setEditId}
                        onSave={onSave!}
                        index={index}
                        imageUrl="/assets/images/pollsensei.png"
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
                    className="bg-white"
                  />
                ) : (
                  <Textarea
                    placeholder="Type your response here..."
                    className="resize-none bg-white min-h-[120px]"
                    onChange={onChange}
                    value={response}
                    required={is_required}
                  />
                )}
              </div>
            </div>
          </div>

          {(pathname === "/surveys/edit-survey" ||
            pathname.includes("/edit-submitted-survey") ||
            pathname.includes("/edit-draft-survey")) && (
            <ActionButtons onDelete={DeleteQuestion} onEdit={EditQuestion} />
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

          {(pathname === "/surveys/edit-survey" ||
            pathname.includes("/edit-submitted-survey") ||
            pathname.includes("/edit-draft-survey")) && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Required</span>
              <Switch
                checked={is_required}
                onCheckedChange={
                  setIsRequired && ((checked) => setIsRequired(checked))
                }
                className="bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] scale-90"
              />
            </div>
          )}
        </div>

        {pathname.includes("survey-response-upload") && status && (
          <div>{getStatus(status)}</div>
        )}
      </div>

      <div className="flex justify-end mt-4">
        <p className="text-sm font-medium bg-gradient-to-r from-[#F5F0FF] to-[#F8F4FF] text-[#5B03B2] px-4 py-1.5 rounded-full shadow-sm border border-[#E5D5FF]">
          <span className="flex items-center gap-1 text-xs">
            {questionType === "short_text" ? (
              <TextCursor className="text-[#9D50BB] w-3 h-3" />
            ) : (
              <AlignLeft className="text-[#9D50BB] w-3 h-3" />
            )}
            {questionType === "short_text" ? "Short Text" : "Long Text"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LongTextQuestion;
