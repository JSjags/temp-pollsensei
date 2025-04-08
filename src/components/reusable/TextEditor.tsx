"use client";
import React, { FC, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { CgFormatBold } from "react-icons/cg";
import { GoItalic } from "react-icons/go";
import { HiMiniUnderline } from "react-icons/hi2";
import { IoIosLink } from "react-icons/io";
import {
  CiTextAlignLeft,
  CiTextAlignCenter,
  CiTextAlignRight,
} from "react-icons/ci";
import { cn } from "@/lib/utils";
import { useDispatch } from "react-redux";
import {
  updateSectionTopic,
  updateSectionDescription,
} from "@/redux/slices/questions.slice";
import { updateDescription, updateTopic } from "@/redux/slices/survey.slice";

interface Props {
  sectionTitle: string;
  setSectionTitle: any;
  sDescription: string;
  setsDescription: any;
  surveyData?: any;
  handleSave: () => void;
  setIsEditing: (isEditing: boolean) => void;
}

const TextEditor: FC<Props> = ({
  sectionTitle,
  setSectionTitle,
  sDescription,
  setsDescription,
  surveyData,
  handleSave,
  setIsEditing,
}) => {
  const dispatch = useDispatch();
  const [alignment, setAlignment] = useState<string>("left");
  const [manualSurveyTitle, setManualSurveyTitle] = useState<string>(
    sectionTitle || ""
  );
  const [surveyPrompt, setSurveyPrompt] = useState<string>(sDescription || "");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      Placeholder.configure({
        placeholder: "Untitled Section",
      }),
    ],
    content: sectionTitle || "",
    onUpdate: ({ editor }) => {
      const content = editor.getText();
      setManualSurveyTitle(content);
    },
  });

  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      editor.commands.setContent(sectionTitle || "");
    }
  }, [sectionTitle, editor]);

  const handleAlignmentClick = () => {
    if (!editor) return;

    switch (alignment) {
      case "left":
        editor.chain().focus().setTextAlign("center").run();
        setAlignment("center");
        break;
      case "center":
        editor.chain().focus().setTextAlign("right").run();
        setAlignment("right");
        break;
      case "right":
        editor.chain().focus().setTextAlign("left").run();
        setAlignment("left");
        break;
      default:
        editor.chain().focus().setTextAlign("left").run();
        setAlignment("left");
    }
  };

  const handleCancel = () => {
    setManualSurveyTitle("");
    setSurveyPrompt("");
    if (editor) {
      editor.commands.setContent("");
    }
    setIsEditing(false);
  };

  const handleSaveChanges = () => {
    const titleContent = editor?.getText() || "";
    dispatch(updateTopic(titleContent));
    dispatch(updateDescription(surveyPrompt));
    setSectionTitle(titleContent);
    setsDescription(surveyPrompt);
    handleSave();
    setIsEditing(false);
  };

  const isSaveDisabled = !manualSurveyTitle.trim();

  return (
    <div className="bg-white shadow-md shadow-gray-200 p-5 w-full flex flex-col gap-5">
      <div className="w-full flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <EditorContent
            editor={editor}
            className={cn(
              "w-full pb-3 border-b-2 border-[#5B03B2] active:outline-none focus:outline-none resize-none",
              `font-${surveyData?.header_text?.name
                .split(" ")
                .join("-")
                .toLowerCase()}`
            )}
            style={{
              fontSize: `${surveyData?.header_text?.size}px`,
            }}
          />
          <div className="flex gap-2 items-center">
            <CgFormatBold
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={`text-base cursor-pointer ${
                editor?.isActive("bold") ? "text-black" : "text-[#333333]"
              }`}
            />

            <GoItalic
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={`text-base cursor-pointer ${
                editor?.isActive("italic") ? "text-black" : "text-[#333333]"
              }`}
            />

            <HiMiniUnderline
              onClick={() => editor?.chain().focus().toggleUnderline().run()}
              className={`text-base cursor-pointer ${
                editor?.isActive("underline") ? "text-black" : "text-[#333333]"
              }`}
            />

            <IoIosLink
              onClick={() => {
                const previousUrl = editor?.getAttributes("link").href;
                const url = window.prompt("Enter URL", previousUrl);

                if (url === null) return;

                if (url === "") {
                  editor?.chain().focus().unsetLink().run();
                  return;
                }

                editor?.chain().focus().setLink({ href: url }).run();
              }}
              className={`text-base cursor-pointer ${
                editor?.isActive("link") ? "text-black" : "text-[#333333]"
              }`}
            />

            <div
              onClick={handleAlignmentClick}
              className="text-base cursor-pointer text-[#333333]"
            >
              {alignment === "left" && <CiTextAlignLeft />}
              {alignment === "center" && <CiTextAlignCenter />}
              {alignment === "right" && <CiTextAlignRight />}
            </div>
          </div>
        </div>

        <input
          type="text"
          placeholder="Describe Section (Optional)"
          className={cn(
            "w-full pb-3 border-b-2 border-[#D9D9D9] text-[##828282] text-base active:outline-none focus:outline-none resize-none",
            `font-${surveyData?.body_text?.name
              .split(" ")
              .join("-")
              .toLowerCase()}`
          )}
          style={{
            fontSize: `${surveyData?.body_text?.size}px`,
          }}
          value={surveyPrompt}
          onChange={(e) => {
            setSurveyPrompt(e.target.value);
          }}
        />
      </div>

      <div className="flex justify-end gap-3 items-center w-full">
        <Button
          variant="outline"
          className="text-[#828282] rounded-full border-[#828282] text-sm font-normal w-16 h-fit py-1 hover:scale-105 transition-all duration-300"
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button
          variant="default"
          className="bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] shadow-[-5px_5px_10px_#563BFF42] hover:bg-purple-700 rounded-full text-sm font-normal text-white w-16 h-fit py-1 hover:scale-105 transition-all duration-300"
          onClick={handleSaveChanges}
          disabled={isSaveDisabled}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default TextEditor;
