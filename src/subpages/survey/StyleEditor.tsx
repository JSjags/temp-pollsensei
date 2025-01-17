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

const StyleEditor = () => {
  const dispatch = useDispatch();
  const [addSurveyHeader] = useAddSurveyHeaderMutation();
  const headerUrl = useSelector(
    (state: RootState) => state?.survey?.header_url
  );
  const colorTheme = useSelector(
    (state: RootState) => state?.survey?.color_theme
  );

  const [headerFont, setHeaderFont] = useState({ name: "DM Sans", size: 24 });
  const [questionFont, setQuestionFont] = useState({
    name: "DM Sans",
    size: 18,
  });
  const [bodyFont, setBodyFont] = useState({ name: "DM Sans", size: 16 });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [headerImageFile, setHeaderImageFile] = useState<File | null>(null);
  const [color, setColor] = useState(colorTheme || "#ff5722");

  useEffect(() => {
    dispatch(saveHeaderText(headerFont));
  }, [headerFont, dispatch]);

  useEffect(() => {
    dispatch(saveQuestionText(questionFont));
  }, [questionFont, dispatch]);

  useEffect(() => {
    dispatch(saveBodyText(bodyFont));
  }, [bodyFont, dispatch]);

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
          font={headerFont}
          setFont={setHeaderFont}
          fontOptions={fontOptions}
          sizeOptions={sizeOptions}
        />
        <FontSelector
          label="Question"
          font={questionFont}
          setFont={setQuestionFont}
          fontOptions={fontOptions}
          sizeOptions={sizeOptions}
        />
        <FontSelector
          label="Body text"
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
            onChange={(newColor) => {
              setColor(newColor);
              dispatch(saveColorTheme(newColor));
            }}
          />
        </div>
      </div>

      <ImageUploader
        title="Logo"
        imageUrl={logoFile ? URL.createObjectURL(logoFile) : null}
        setFile={setLogoFile}
        fileType="logo"
        currentFile={logoFile}
      />

      <ImageUploader
        title="Header Image"
        imageUrl={
          headerImageFile ? URL.createObjectURL(headerImageFile) : headerUrl
        }
        setFile={setHeaderImageFile}
        fileType="header_image"
        currentFile={headerImageFile}
      />
    </div>
  );
};

export default StyleEditor;
