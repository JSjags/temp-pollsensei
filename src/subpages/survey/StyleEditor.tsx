import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { TwitterPicker } from "react-color";
import Image from "next/image";
import { defaultBg, neon, sparkly } from "@/assets/images";
import { IoMdCloudUpload } from "react-icons/io";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useAddSurveyHeaderMutation } from "@/services/survey.service";
import { toast } from "react-toastify";
import {
  saveBodyText,
  saveColorTheme,
  saveHeaderText,
  saveHeaderUrl,
  saveLogoUrl,
  saveQuestionText,
  saveTheme,
} from "@/redux/slices/survey.slice";

// Types for font options
interface FontOption {
  value: string;
  label: string;
}

interface SizeOption {
  value: number;
  label: number;
}

const StyleEditor = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileLogoRef = useRef<HTMLInputElement>(null);
  const headerUrl = useSelector(
    (state: RootState) => state?.survey?.header_url
  );
  const dispatch = useDispatch();
  const [addSurveyHeader, { data: response, isSuccess, isLoading }] =
    useAddSurveyHeaderMutation();
  const theme = useSelector((state: RootState) => state?.survey?.theme);
  const [headerFont, setHeaderFont] = useState({ name: "Helvetica", size: 24 });
  const [questionFont, setQuestionFont] = useState({
    name: "Helvetica",
    size: 18,
  });
  const [bodyFont, setBodyFont] = useState({ name: "Helvetica", size: 16 });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [headerImageFile, setHeaderImageFile] = useState<File | null>(null);
  const colorTheme = useSelector(
    (state: RootState) => state?.survey?.color_theme
  );
  const [color, setColor] = useState(colorTheme || "#ff5722");
  const [logo_url, setLogoUrl] = useState<string | null>(null);

  const fontOptions: FontOption[] = [
    { value: "Helvetica", label: "Helvetica" },
    { value: "Arial", label: "Arial" },
    { value: "Times New Roman", label: "Times New Roman" },
    { value: "Yuji Mai", label: "Yuji Mai" },
    { value: "Brush Script MT", label: "Brush Script MT" },
    { value: "Garamond", label: "Garamond" },
    { value: "Playwrite HR Lijeva", label: "Playwrite HR Lijeva" },
    // Add more fonts here...
  ];

  const sizeOptions: SizeOption[] = [
    { value: 32, label: 32 },
    { value: 30, label: 30 },
    { value: 28, label: 28 },
    { value: 26, label: 26 },
    { value: 24, label: 24 },
    { value: 22, label: 22 },
    { value: 20, label: 20 },
    { value: 18, label: 18 },
    { value: 16, label: 16 },
    { value: 14, label: 14 },
    { value: 12, label: 12 },
    { value: 10, label: 10 },
  ];

  const handleParentClick = (inputRef: React.RefObject<HTMLInputElement>) => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    file_type: string
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("file_type", file_type);

      try {
        const response = await addSurveyHeader(formData).unwrap();

        if (file_type === "logo") {
          dispatch(saveLogoUrl((response as any)?.data.url));
        } else {
          dispatch(saveHeaderUrl((response as any)?.data.url));
        }

        toast.success("Image uploaded successfully");
      } catch (err: any) {
        toast.error(
          "Failed to upload image " + (err?.data?.message || err.message)
        );
      }
    }
  };

  useEffect(() => {
    if (isSuccess && (response as any)?.data) {
      if ((response as any).data.file_type === "logo") {
        dispatch(saveLogoUrl((response as any).data.url));
      } else if ((response as any).data.file_type === "header_image") {
        dispatch(saveHeaderUrl((response as any).data.url));
      }
    }
  }, [isSuccess, response, dispatch]);

  console.log(color);

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
    <div className="style-editor bg-white h-full flex flex-col transform transition-transform duration-300 ease-in-out">
      <div className="border-b py-4">
        <h2 className="px-10 font-bold">Style Editor</h2>
      </div>

      <div className="theme-selector px-10 border-b py-5">
        <h4 className="font-bold">Theme</h4>
        <div className="flex w-full justify-between gap-2 items-center pt-3 ">
          <div
            className="flex-1 flex flex-col w-1/3 h-24"
            onClick={() => {
              dispatch(saveTheme("default"));
            }}
          >
            <Image
              src={defaultBg}
              alt=""
              className={`${
                theme === "default"
                  ? "border-2 rounded-lg border-[#9D50BB]"
                  : ""
              } w-full`}
            />
            <span className="text-sm font-normal">Default</span>
          </div>
          <div
            className="flex-1 flex flex-col w-1/3 h-24"
            onClick={() => {
              dispatch(saveTheme("neon"));
            }}
          >
            <Image
              src={neon}
              alt=""
              className={`${
                theme === "neon" ? "border-2 rounded-lg border-[#9D50BB]" : ""
              } w-full`}
            />
            <span className="text-sm font-normal">Neon</span>
          </div>
          <div
            className="flex-1 flex flex-col w-1/3 h-24"
            onClick={() => {
              dispatch(saveTheme("sparkly"));
            }}
          >
            <Image
              src={sparkly}
              alt=""
              className={`${
                theme === "sparkly"
                  ? "border-2 rounded-lg border-[#9D50BB]"
                  : ""
              } w-full`}
            />
            <span className="text-sm font-normal">Sparkly</span>
          </div>
        </div>
      </div>

      <div className="text-style px-10 border-b py-5">
        <h4 className="font-bold">Text Style</h4>
        <div className="text-style-option flex flex-col gap-1 pt-3">
          <label className="mt-4">Header</label>
          <div className="flex gap-2 items-center w-full">
            <Select
              options={fontOptions}
              value={fontOptions.find((opt) => opt.value === headerFont.name)}
              // onChange={(opt) => {
              //   setHeaderFont({
              //     ...headerFont,
              //     name: opt?.value || "Helvetica",
              //   });
              //   dispatch(saveHeaderText(headerFont));
              // }}
              onChange={(opt) =>
                setHeaderFont((prev) => ({
                  ...prev,
                  name: opt?.value || "Helvetica",
                }))
              }
              className="w-[80%]"
              classNamePrefix={`header_font`}
            />
            <Select
              options={sizeOptions}
              value={sizeOptions.find((opt) => opt.value === headerFont.size)}
              // onChange={(opt) => {
              //   setHeaderFont({ ...headerFont, size: opt?.value || 24 });
              //   dispatch(saveHeaderText(headerFont));
              // }}
              onChange={(opt) =>
                setHeaderFont((prev) => ({ ...prev, size: opt?.value || 24 }))
              }
              className="w-[20%]"
              classNamePrefix={`header_font`}
            />
          </div>
        </div>
        <div className="text-style-option flex flex-col gap-1">
          <label className="mt-4">Question</label>
          <div className="flex gap-2 items-center w-full">
            <Select
              options={fontOptions}
              value={fontOptions.find((opt) => opt.value === questionFont.name)}
              // onChange={(opt) => {
              //   setQuestionFont({
              //     ...questionFont,
              //     name: opt?.value || "Helvetica",
              //   });
              //   dispatch(saveQuestionText(questionFont));
              // }}
              onChange={(opt) =>
                setQuestionFont((prev) => ({
                  ...prev,
                  name: opt?.value || "Helvetica",
                }))
              }
              className="w-[80%]"
              classNamePrefix={`question_font`}
            />
            <Select
              options={sizeOptions}
              value={sizeOptions.find((opt) => opt.value === questionFont.size)}
              // onChange={(opt) => {
              //   setQuestionFont({ ...questionFont, size: opt?.value || 18 });
              //   dispatch(saveQuestionText(questionFont));
              // }}
              onChange={(opt) =>
                setQuestionFont((prev) => ({ ...prev, size: opt?.value || 18 }))
              }
              className="w-[20%]"
              classNamePrefix={`question_font`}
            />
          </div>
        </div>
        <div className="text-style-option flex flex-col gap-1">
          <label className="mt-4">Body text</label>
          <div className="flex gap-2 items-center w-full">
            <Select
              options={fontOptions}
              value={fontOptions.find((opt) => opt.value === bodyFont.name)}
              // onChange={(opt) => {
              //   setBodyFont({ ...bodyFont, name: opt?.value || "Helvetica" });
              //   dispatch(saveBodyText(bodyFont));
              // }}
              onChange={(opt) =>
                setBodyFont((prev) => ({
                  ...prev,
                  name: opt?.value || "Helvetica",
                }))
              }
              className="w-[80%]"
              classNamePrefix={`body_font`}
            />
            <Select
              options={sizeOptions}
              value={sizeOptions.find((opt) => opt.value === bodyFont.size)}
              // onChange={(opt) => {
              //   setBodyFont({ ...bodyFont, size: opt?.value || 16 });
              //   dispatch(saveBodyText(bodyFont));
              // }}
              onChange={(opt) =>
                setBodyFont((prev) => ({ ...prev, size: opt?.value || 16 }))
              }
              className="w-[20%]"
              classNamePrefix={`body_font`}
            />
          </div>
        </div>
      </div>

      <div className="color-theme px-10 border-b py-5">
        <h4 className="font-bold">Color Theme</h4>
        <div className="pt-5">
          <TwitterPicker
            color={color}
            onChangeComplete={(newColor) => {
              setColor(newColor.hex);
              dispatch(saveColorTheme(newColor.hex));
            }}
            className="w-full pt-4"
            width="100%"
            triangle="hide"
          />
        </div>
      </div>

      <div className="color-theme px-10 border-b py-5">
        <h4 className="font-bold">Logo</h4>
        <div className="my-5">
          <div
            className={`flex flex-col border-2 border-dashed items-center bg-white py-3 cursor-pointer`}
            role="button"
            onClick={() => handleParentClick(fileLogoRef)}
          >
            <div className="text-center flex flex-col items-center">
              <IoMdCloudUpload className="" style={{ fontSize: "2rem" }} />
              <label
                htmlFor="logoFileInput"
                className="small py-2 px-2"
                role="button"
              >
                {!logo_url ? (
                  <>
                    {" "}
                    <span className="text-decoration-underline">
                      click to upload your image
                    </span>{" "}
                    <br />
                    Or drag and drop{" "}
                  </>
                ) : (
                  <img
                    // @ts-ignore
                    src={logo_url !== null && logo_url ? logo_url : ""}
                    alt="Logo"
                  />
                )}
              </label>
              <input
                type="file"
                id="logoFileInput"
                ref={fileLogoRef}
                onChange={(e) => handleFileChange(e, setLogoFile, "logo")}
                accept=".jpg, .jpeg, .png"
                className="hidden"
                role="button"
              />
            </div>
          </div>
          {logoFile && <p>{logoFile.name}</p>}
        </div>
      </div>

      <div className="color-theme px-10 border-b py-5">
        <h4 className="font-bold">Header Image</h4>
        <div className="my-5">
          <div
            className={`flex flex-col border-2 border-dashed items-center bg-white py-3 cursor-pointer`}
            role="button"
            onClick={() => handleParentClick(fileInputRef)}
          >
            <div className="text-center flex flex-col items-center">
              <IoMdCloudUpload className="" style={{ fontSize: "2rem" }} />
              <label
                htmlFor="header_image"
                className="small py-2 px-2"
                role="button"
              >
                {headerUrl === null ? (
                  <>
                    <span className="text-decoration-underline">
                      click to upload your image
                    </span>{" "}
                    <br />
                    Or drag and drop
                  </>
                ) : (
                  <img
                    // @ts-ignore
                    src={headerUrl !== null && headerUrl ? headerUrl : ""}
                    alt="Logo"
                  />
                  // <img src={logoFile ? URL.createObjectURL(logoFile) : logo_url || ""} alt="Logo" />
                )}
              </label>
              <input
                type="file"
                id="header_image"
                ref={fileInputRef}
                // onChange={handleAddHeaderImg}
                onChange={(e) =>
                  handleFileChange(e, setHeaderImageFile, "header_image")
                }
                accept=".jpg, .jpeg, .png"
                className="hidden"
                role="button"
              />
            </div>
          </div>
          {headerImageFile && <p>{headerImageFile?.name}</p>}
        </div>
      </div>
    </div>
  );
};

export default StyleEditor;
