"use client";
import React, { FC } from "react";
import { formatDate, formatTo12Hour } from "@/lib/helpers";
import { Input } from "@/components/ui/shadcn-input";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/shadcn-checkbox";

interface ResponseData {
  question: string;
  answer: string;
  questionType: string;
  options?: string[];
}

interface Props {
  participantResponses: {
    respondent: {
      name: string;
      email: string;
    };
    submittedAt: string;
    responses: ResponseData[];
  };
}

const ScreenerSurveyResponse: FC<Props> = ({ participantResponses }) => {
  const renderAnswer = (data: any) => {
    switch (data.questionType) {
      case "single_choice":
      case "boolean":
        return (
          <RadioGroup value={data.answer} className="flex items-center gap-3">
            <RadioGroupItem
              value={data.answer}
              id={`${data.questionId}-${data.answer}`}
              checked={true}
              className="w-5 h-5 data-[state=checked]:bg-[#9D50BB] data-[state=checked]:border-[#9D50BB]"
            />
            <Label
              htmlFor={`${data.questionId}-${data.answer}`}
              className="text-[#333333] cursor-pointer"
            >
              {data.answer}
            </Label>
          </RadioGroup>
        );

      case "multiple_choice":
      case "checkbox":
        const selectedOptions = data.answer
          .split(",")
          .map((opt: string) => opt.trim());
        return (
          <div className="space-y-2">
            {selectedOptions.map((option: string) => (
              <div key={option} className="flex items-center gap-3">
                <Checkbox
                  id={`${data.questionId}-${option}`}
                  checked={true}
                  className="w-5 h-5 data-[state=checked]:bg-[#9D50BB] data-[state=checked]:border-[#9D50BB]"
                />
                <Label
                  htmlFor={`${data.questionId}-${option}`}
                  className="text-[#333333] cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
        );

      case "likert_scale":
      case "rating_scale":
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#9D50BB] text-white">
              {data.answer}
            </div>
            <span className="text-[#333333]">
              out of {data.options?.length || 5}
            </span>
          </div>
        );

      case "drop_down":
        return (
          <div className="px-3 py-2 bg-gray-100 rounded-md inline-block">
            <span className="text-[#333333]">{data.answer}</span>
          </div>
        );

      case "long_text":
        return (
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="text-[#333333] whitespace-pre-line">{data.answer}</p>
          </div>
        );

      case "short_text":
        return (
          <div className="px-3 py-2 bg-gray-100 rounded-md inline-block">
            <span className="text-[#333333]">{data.answer}</span>
          </div>
        );

      case "number":
        return (
          <div className="flex items-center gap-3">
            <span className="text-[#333333] font-medium">{data.answer}</span>
          </div>
        );

      default:
        return <p className="text-[#333333]">{data.answer}</p>;
    }
  };

  return (
    <div className="w-full h-auto flex flex-col gap-5">
      <h2 className="text-lg text-center font-bold">Review Screener survey</h2>

      <div className="w-full h-auto border border-[#BDBDBD] rounded-lg p-5 gap-2 grid grid-cols-2">
        <div className="w-auto h-auto flex items-center gap-3">
          <p className="text-[#838383] text-base">Respondent:</p>{" "}
          <p className="text-[#333333] text-base capitalize">
            {participantResponses?.respondent?.name}
          </p>
        </div>
        <div className="w-auto h-auto flex items-center gap-3">
          <p className="text-[#838383] text-base">Status:</p>{" "}
          <p className="text-[#333333] text-base">100% Complete</p>
        </div>
        <div className="w-auto h-auto flex items-center gap-3">
          <p className="text-[#838383] text-base">Date:</p>{" "}
          <p className="text-[#333333] text-base">
            {formatDate(participantResponses?.submittedAt)}
          </p>
        </div>
        <div className="w-auto h-auto flex items-center gap-3">
          <p className="text-[#838383] text-base">Time:</p>{" "}
          <p className="text-[#333333] text-base">
            {formatTo12Hour(participantResponses?.submittedAt)}
          </p>
        </div>
        <div className="w-auto h-auto flex items-center gap-3">
          <p className="text-[#838383] text-base">Country:</p>{" "}
          <p className="text-[#333333] text-base">Not available</p>
        </div>
        <div className="w-auto h-auto flex items-center gap-3">
          <p className="text-[#838383] text-base">Email:</p>{" "}
          <p className="text-[#333333] text-base">
            {participantResponses?.respondent?.email}
          </p>
        </div>
      </div>

      <div className="w-full h-[40vh] overflow-y-auto flex flex-col gap-5">
        {participantResponses?.responses.map(
          (data: ResponseData, index: number) => (
            <div
              key={index}
              className="w-full h-auto border border-[#BDBDBD] rounded-lg p-5 flex flex-col gap-3"
            >
              <div className="w-full h-auto flex items-center gap-3">
                <p className="text-[#333333] text-base">{index + 1}.</p>{" "}
                <p className="text-[#333333] text-base relative">
                  {data?.question}
                  <span className="text-[red] absolute top-1 -right-3">*</span>
                </p>
              </div>
              <div className="w-full h-auto flex items-center gap-3">
                {renderAnswer(data)}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ScreenerSurveyResponse;
