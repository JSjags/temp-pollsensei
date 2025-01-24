import React, { useEffect, useState } from "react";
import { TwitterPicker } from "react-color";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { useAddSurveyHeaderMutation } from "@/services/survey.service";
import {
  saveBodyText,
  saveColorTheme,
  saveHeaderText,
  saveQuestionText,
} from "@/redux/slices/survey.slice";
import ThemeSelector from "@/components/style-editor/ThemeSelector";
import FontSelector from "@/components/style-editor/FontSelector";
import ImageUploader from "@/components/style-editor/ImageUploader";
import { fontOptions, sizeOptions } from "@/constants/fonts";
import { ColorPicker } from "@/components/form/color-picker";

export interface Question {
  question: string;
  question_type: string;
  options?: string[];
  rows?: string[];
  columns?: string[];
  is_required?: boolean;
}

export interface Section {
  questions: Question[];
}

export interface StyleEditorProps {
  surveyData?: {
    topic: string;
    description: string;
    sections: Section[];
    theme: string;
    header_text?: any;
    question_text?: any;
    body_text?: any;
    color_theme: string;
    logo_url: string;
    header_url: string;
  };
  setSurveyData?: React.Dispatch<React.SetStateAction<any>>;
}

const StyleEditor: React.FC<StyleEditorProps> = ({
  surveyData,
  setSurveyData,
}) => {
  const dispatch = useDispatch();
  const [addSurveyHeader] = useAddSurveyHeaderMutation();
  const headerUrl = useSelector(
    (state: RootState) => state?.survey?.header_url
  );
  const colorTheme = useSelector(
    (state: RootState) => state?.survey?.color_theme
  );

  const [headerFont, setHeaderFont] = useState(surveyData?.header_text);
  const [questionFont, setQuestionFont] = useState(surveyData?.question_text);
  const [bodyFont, setBodyFont] = useState(surveyData?.body_text);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [headerImageFile, setHeaderImageFile] = useState<File | null>(null);
  const [color, setColor] = useState(
    surveyData?.color_theme || colorTheme || "#ff5722"
  );

  console.log(surveyData);

  // Update state when props change
  useEffect(() => {
    setHeaderFont(surveyData?.header_text);
    setQuestionFont(surveyData?.question_text);
    setBodyFont(surveyData?.body_text);
    setColor(surveyData?.color_theme || colorTheme || "#ff5722");
  }, [surveyData, colorTheme]);

  useEffect(() => {
    dispatch(saveHeaderText(headerFont));
    if (setSurveyData) {
      setSurveyData((prev: any) => ({
        ...prev,
        header_text: headerFont,
      }));
    }
  }, [headerFont, dispatch, setSurveyData]);

  useEffect(() => {
    dispatch(saveQuestionText(questionFont));
    if (setSurveyData) {
      setSurveyData((prev: any) => ({
        ...prev,
        question_text: questionFont,
      }));
    }
  }, [questionFont, dispatch, setSurveyData]);

  useEffect(() => {
    dispatch(saveBodyText(bodyFont));
    if (setSurveyData) {
      setSurveyData((prev: any) => ({
        ...prev,
        body_text: bodyFont,
      }));
    }
  }, [bodyFont, dispatch, setSurveyData]);

  useEffect(() => {
    if (setSurveyData) {
      setSurveyData((prev: any) => ({
        ...prev,
        color_theme: color,
      }));
    }
  }, [color, setSurveyData]);

  return (
    <div className="style-editor bg-white h-full flex flex-col">
      <div className="border-b py-4">
        <h2 className="px-10 font-bold">Style Editor</h2>
      </div>

      <ThemeSelector
        initialTheme={surveyData?.theme}
        setSurveyData={setSurveyData}
      />

      <div className="text-style px-10 border-b py-5">
        <h4 className="font-bold">Text Style</h4>
        <FontSelector
          label="Header"
          value="header_text"
          font={headerFont}
          setFont={setHeaderFont}
          fontOptions={fontOptions}
          sizeOptions={sizeOptions}
          setSurveyData={setSurveyData}
        />
        <FontSelector
          label="Question"
          value="question_text"
          font={questionFont}
          setFont={setQuestionFont}
          fontOptions={fontOptions}
          sizeOptions={sizeOptions}
          setSurveyData={setSurveyData}
        />
        <FontSelector
          label="Body text"
          value="body_text"
          font={bodyFont}
          setFont={setBodyFont}
          fontOptions={fontOptions}
          sizeOptions={sizeOptions}
          setSurveyData={setSurveyData}
        />
      </div>

      <div className="color-theme px-10 border-b py-5">
        <h4 className="font-bold">Color Theme</h4>
        <div className="pt-5 w-full">
          <ColorPicker
            value={color}
            onChange={(newColor) => {
              setColor(newColor);
              dispatch(saveColorTheme(newColor));
            }}
          />
        </div>
      </div>

      <ImageUploader
        title="Logo"
        imageUrl={
          logoFile
            ? URL.createObjectURL(logoFile)
            : surveyData?.logo_url || null
        }
        setFile={setLogoFile}
        fileType="logo"
        currentFile={logoFile}
        surveyData={surveyData}
        setSurveyData={setSurveyData}
      />

      <ImageUploader
        title="Header Image"
        imageUrl={
          headerImageFile
            ? URL.createObjectURL(headerImageFile)
            : surveyData?.header_url || headerUrl
        }
        setFile={setHeaderImageFile}
        fileType="header_image"
        currentFile={headerImageFile}
        surveyData={surveyData}
        setSurveyData={setSurveyData}
      />
    </div>
  );
};

export default StyleEditor;
