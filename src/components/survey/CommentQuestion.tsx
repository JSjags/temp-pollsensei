import { draggable, stars } from "@/assets/images";
import { RootState } from "@/redux/store";
import { usePathname } from "next/navigation";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { BsExclamation } from "react-icons/bs";
import {
  Check,
  GripVertical,
  MessageCircle,
  MessageSquare,
  AlignLeft,
  TextQuote,
} from "lucide-react";
import { Switch } from "../ui/switch";
import PollsenseiTriggerButton from "../ui/pollsensei-trigger-button";
import { Textarea } from "../ui/shadcn-textarea";
import ActionButtons from "./ActionButtons";
import { SurveyData } from "@/subpages/survey/EditSubmittedSurvey";
import { cn } from "@/lib/utils";

interface ComponentQuestionProps {
  question: string;
  response?: string;
  questionType: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  EditQuestion?: () => void;
  DeleteQuestion?: () => void;
  index: number;
  status?: string;
  is_required?: boolean;
  can_accept_media?: boolean;
  setCanAcceptMedia?: (value: boolean) => void;
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

const CommentQuestion: React.FC<ComponentQuestionProps> = ({
  question,
  questionType,
  EditQuestion,
  DeleteQuestion,
  index,
  response,
  can_accept_media,
  setCanAcceptMedia,
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
    (state: RootState) =>
      surveyData?.question_text ?? state?.survey?.question_text
  );
  const colorTheme = useSelector(
    (state: RootState) => state?.survey?.color_theme
  );

  const getStatus = useMemo(() => {
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
  }, [status]);

  const getQuestionTypeIcon = () => {
    switch (questionType) {
      case "comment":
        return <MessageCircle className="text-[#9D50BB] w-3 h-3" />;
      case "short_text":
        return <AlignLeft className="text-[#9D50BB] w-3 h-3" />;
      case "long_text":
        return <TextQuote className="text-[#9D50BB] w-3 h-3" />;
      default:
        return <MessageSquare className="text-[#9D50BB] w-3 h-3" />;
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
                <Textarea
                  placeholder="Type your response here..."
                  className="resize-none"
                  onChange={onChange}
                  value={response}
                  required={is_required}
                />
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
            <div className="flex items-center gap-4">
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
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">Allow Audio</span>
                <Switch
                  checked={can_accept_media}
                  onCheckedChange={
                    setCanAcceptMedia
                      ? (checked: boolean) => setCanAcceptMedia(checked)
                      : undefined
                  }
                  className="bg-[#9D50BB] "
                />
              </div>
            </div>
          )}
        </div>

        {pathname.includes("survey-response-upload") && status && (
          <div>{getStatus}</div>
        )}
      </div>
      <div className="flex justify-end mt-4 ">
        <p className="text-sm font-medium bg-gradient-to-r from-[#F5F0FF] to-[#F8F4FF] text-[#5B03B2] px-4 py-1.5 rounded-full shadow-sm border border-[#E5D5FF]">
          <span className="flex items-center gap-1 text-xs capitalize">
            {getQuestionTypeIcon()}
            {questionType.replace(/_/g, " ")}
          </span>
        </p>
      </div>
    </div>
  );
};

export default CommentQuestion;
