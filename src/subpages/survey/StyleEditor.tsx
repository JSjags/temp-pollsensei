"use client";
import React, { useEffect, useState } from "react";
import { TwitterPicker } from "react-color";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { useAddSurveyHeaderMutation } from "@/services/survey.service";
import {
  saveHeaderText,
  saveQuestionText,
  saveBodyText,
  saveColorTheme,
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
  const headerText = useSelector(
    (state: RootState) => state.survey.header_text
  );
  const questionText = useSelector(
    (state: RootState) => state.survey.question_text
  );
  const bodyText = useSelector((state: RootState) => state.survey.body_text);
  const colorTheme = useSelector(
    (state: RootState) => state.survey.color_theme
  );

  const [headerFont, setHeaderFont] = useState(headerText);
  const [questionFont, setQuestionFont] = useState(questionText);
  const [bodyFont, setBodyFont] = useState(bodyText);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [headerImageFile, setHeaderImageFile] = useState<File | null>(null);
  const [color, setColor] = useState(
    surveyData?.color_theme || colorTheme || "#ff5722"
  );

  useEffect(() => {
    setHeaderFont(headerText);
    setQuestionFont(questionText);
    setBodyFont(bodyText);
    setColor(colorTheme);
  }, [headerText, questionText, bodyText, colorTheme]);

  useEffect(() => {
    dispatch(saveHeaderText(headerFont));
  }, [headerFont, dispatch]);

  useEffect(() => {
    dispatch(saveQuestionText(questionFont));
  }, [questionFont, dispatch]);

  useEffect(() => {
    dispatch(saveBodyText(bodyFont));
  }, [bodyFont, dispatch]);

  useEffect(() => {
    dispatch(saveColorTheme(color));
  }, [color, dispatch]);

  return (
    <div className="style-editor bg-white h-full flex flex-col">
      <div className="border-b py-4">
        <h2 className="px-10 font-bold">Style Editor</h2>
      </div>

      <ThemeSelector />

      <div className="text-style px-10 border-b py-5">
        <h4 className="font-bold">Text Style</h4>
        <FontSelector
          label="Header"
          value="header_text"
          font={headerFont}
          setFont={setHeaderFont}
          fontOptions={fontOptions}
          sizeOptions={sizeOptions}
        />
        <FontSelector
          label="Question"
          value="question_text"
          font={questionFont}
          setFont={setQuestionFont}
          fontOptions={fontOptions}
          sizeOptions={sizeOptions}
        />
        <FontSelector
          label="Body text"
          value="body_text"
          font={bodyFont}
          setFont={setBodyFont}
          fontOptions={fontOptions}
          sizeOptions={sizeOptions}
        />
      </div>

      <div className="color-theme px-10 border-b py-5">
        <h4 className="font-bold">Color Theme</h4>
        <div className="pt-5 w-full">
          <ColorPicker
            value={color}
            onChange={(newColor) => setColor(newColor)}
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
