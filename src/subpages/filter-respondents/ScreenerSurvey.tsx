"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import AddQuestionPage from "@/subpages/survey/AddQuestionPage";
import { FiEdit2 } from "react-icons/fi";

const ScreenerSurvey = () => {
  const [previewSurvey, setPreviewSurvey] = useState<boolean>(false);

  return (
    <div className="w-full h-full overflow-auto flex flex-col gap-3">
      <div className="w-full flex items-center justify-between">
        <div className="flex lg:hidden items-center gap-2">
          {" "}
          <FiEdit2 className="text-sm" /> Edit Style
        </div>
        <Button
          variant="outline"
          size="default"
          className={`border-[#AAAAAA] flex items-center gap-2 text-[#7D8398] text-sm w-fit ${
            previewSurvey && "hidden"
          }`}
          type="button"
          onClick={() => setPreviewSurvey(true)}
        >
          <AiOutlineEye className="text-sm lg:text-lg text-[#7D8398]" />
          Preview screener survey
        </Button>
        <Button
          variant="outline"
          size="default"
          className={`border-[#AAAAAA] flex items-center gap-2 text-[#7D8398] text-sm w-fit ml-auto ${
            !previewSurvey && "hidden"
          }`}
          type="button"
          onClick={() => setPreviewSurvey(false)}
        >
          <AiOutlineEyeInvisible className="text-sm lg:text-lg text-[#7D8398]" />
          Close Preview
        </Button>
      </div>
      <AddQuestionPage previewSurvey={previewSurvey} />
    </div>
  );
};
export default ScreenerSurvey;
