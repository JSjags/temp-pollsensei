import { draggable, stars } from "@/assets/images";
import { RootState } from "@/redux/store";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useState, SetStateAction, useEffect } from "react";
import { useSelector } from "react-redux";
import { AutosizeTextarea } from "../ui/autosize-textarea";
import VoiceRecorder from "../ui/VoiceRecorder";
import { BsExclamation } from "react-icons/bs";
import { Check, GripVertical, MessageSquare } from "lucide-react";
import { Switch } from "../ui/switch";
import PollsenseiTriggerButton from "../ui/pollsensei-trigger-button";
import { cn } from "@/lib/utils";

interface ComponentQuestionProps {
  question: string;
  audio?: string;
  response?: string;
  mediaUrl?: string;
  onTranscribe?: (updatedResponse: string) => void;
  questionType: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  EditQuestion?: () => void;
  DeleteQuestion?: () => void;
  index: number;
  status?: string;
  is_required?: boolean;
  setIsRequired?: (value: boolean) => void;
  setEditId?: React.Dispatch<React.SetStateAction<number | null>>;
  options?: string[] | undefined;
  onSave?: (
    updatedQuestion: string,
    updatedOptions: string[],
    updatedQuestionType: string,
    aiEditIndex?: number
  ) => void;
}

const CommentWithMediaQuestion: React.FC<ComponentQuestionProps> = ({
  question,
  questionType,
  EditQuestion,
  DeleteQuestion,
  index,
  response,
  audio,
  mediaUrl,
  options,
  onChange,
  status,
  is_required,
  setIsRequired,
  onSave,
  setEditId,
  onTranscribe,
}) => {
  const pathname = usePathname();
  const questionText = useSelector(
    (state: RootState) => state?.survey?.question_text
  );
  const colorTheme = useSelector(
    (state: RootState) => state?.survey?.color_theme
  );

  const [editableResponse, setEditableResponse] = useState(response || "");

  useEffect(() => {
    setEditableResponse(response || "");
  }, [response]);

  const handleTranscriptionUpdate = () => {
    if (onTranscribe) {
      onTranscribe(editableResponse);
    }
  };

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
                </div>
              </h3>
            </div>
            {!pathname.includes("survey-public-response") && (
              <PollsenseiTriggerButton
                key={index}
                imageUrl={stars}
                tooltipText="Rephrase question"
                className="group-hover:inline-block hidden"
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

          {pathname.includes("survey-response-upload") && mediaUrl ? (
            <div className="flex flex-col gap-2 w-full">
              <textarea
                placeholder="Your transcribed text goes here"
                className="p-3 rounded-md mt-2 border focus:ring-2 focus:ring-[#5B03B2] focus:border-transparent"
                value={editableResponse}
                onChange={(e) => setEditableResponse(e.target.value)}
              />
              <div className="flex items-center justify-between gap-5 pt-4">
                <audio controls className="flex-1">
                  <source src={audio} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
                <button
                  className="bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
                  onClick={handleTranscriptionUpdate}
                >
                  Update Transcription
                </button>
              </div>
            </div>
          ) : (
            <div>
              <AutosizeTextarea
                className="w-full rounded-md p-3 bg-white border border-gray-200 focus:ring-2 focus:ring-[#5B03B2] focus:border-transparent"
                placeholder="Respond to this question with a voicenote"
                value={editableResponse}
                onChange={onChange}
                required={is_required}
                readOnly
              />
            </div>
          )}

          {pathname === "/surveys/edit-survey" && (
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
            <MessageSquare className="text-[#9D50BB] w-3 h-3" />
            Comment with Media
          </span>
        </p>
      </div>
    </div>
  );
};

export default CommentWithMediaQuestion;
