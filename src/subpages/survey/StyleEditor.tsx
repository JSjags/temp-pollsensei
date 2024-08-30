import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { TwitterPicker } from "react-color";
import Image from "next/image";
import { defaultBg, neon, sparkly } from "@/assets/images";
import { IoMdCloudUpload } from "react-icons/io";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { saveHeaderUrl, saveLogoUrl, saveTheme } from "@/redux/slices/theme.slice";
import { useDispatch } from "react-redux";
import { useAddSurveyHeaderMutation } from "@/services/survey.service";
import { toast } from "react-toastify";

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
  const headerUrl = useSelector((state: RootState) => state?.themes?.headerUrl);
  const dispatch = useDispatch();
  const [addSurveyHeader, { data:response, isSuccess , isLoading}] = useAddSurveyHeaderMutation()
  const theme = useSelector((state: RootState) => state?.themes?.theme);
  const [headerFont, setHeaderFont] = useState({ font: "Helvetica", size: 24 });
  const [questionFont, setQuestionFont] = useState({
    font: "Helvetica",
    size: 18,
  });
  const [bodyFont, setBodyFont] = useState({ font: "Helvetica", size: 16 });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [headerImageFile, setHeaderImageFile] = useState<File | null>(null);
  const [color, setColor] = useState("#ff5722");

  const fontOptions: FontOption[] = [
    { value: "Helvetica", label: "Helvetica" },
    { value: "Arial", label: "Arial" },
    { value: "Times New Roman", label: "Times New Roman" },
    // Add more fonts here...
  ];
  

  const sizeOptions: SizeOption[] = [
    { value: 24, label: 24 },
    { value: 18, label: 18 },
    { value: 16, label: 16 },
    // Add more sizes here...
  ];

  const handleParentClick = (inputRef: React.RefObject<HTMLInputElement>) => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    file_type: string,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
  
      const formData = new FormData();
      formData.append("file", file);
      formData.append("file_type", file_type);
  
      try {
        const response = await addSurveyHeader(formData).unwrap();
  
        if (file_type === 'logo') {
          dispatch(saveLogoUrl(response?.data.url)); 
        } else {
          dispatch(saveHeaderUrl(response?.data.url));
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
    if (isSuccess && response?.data) {
      if (response.data.file_type === 'logo') {
        dispatch(saveLogoUrl(response.data.url));
      } else if (response.data.file_type === 'header_image') {
        dispatch(saveHeaderUrl(response.data.url));
      }
    }
  }, [isSuccess, response, dispatch]);
  


  return (
    <div className="style-editor bg-white h-full flex flex-col transform transition-transform duration-300 ease-in-out">
      <div className="border-b py-4">
        <h2 className="px-10 font-bold">Style Editor</h2>
      </div>

      <div className="theme-selector px-10 border-b py-5">
        <h4 className="font-bold">Theme</h4>
        <div className="flex w-full justify-between gap-2 items-center pt-3 ">
          <div className="flex-1 flex flex-col w-1/3 h-24" onClick={()=>{dispatch(saveTheme('default'))}}>
            <Image src={defaultBg} alt="" className={`${theme === 'default' ? "border-2 rounded-lg border-[#9D50BB]" : ""} w-full`} />
            <span className="text-sm font-normal">Default</span>
          </div>
          <div className="flex-1 flex flex-col w-1/3 h-24" onClick={()=>{dispatch(saveTheme('neon'))}}>
            <Image src={neon} alt="" className={`${theme === 'neon' ? "border-2 rounded-lg border-[#9D50BB]" : ""} w-full`} />
            <span className="text-sm font-normal">Neon</span>
          </div>
          <div className="flex-1 flex flex-col w-1/3 h-24" onClick={()=>{dispatch(saveTheme('sparkly'))}}>
            <Image src={sparkly} alt="" className={`${theme === 'sparkly' ? "border-2 rounded-lg border-[#9D50BB]" : ""} w-full`} />
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
              value={fontOptions.find((opt) => opt.value === headerFont.font)}
              onChange={(opt) =>
                setHeaderFont({ ...headerFont, font: opt?.value || "Helvetica" })
              }
              className="w-[80%]"
            />
            <Select
              options={sizeOptions}
              value={sizeOptions.find((opt) => opt.value === headerFont.size)}
              onChange={(opt) =>
                setHeaderFont({ ...headerFont, size: opt?.value || 24 })
              }
              className="w-[20%]"
            />
          </div>
        </div>
        <div className="text-style-option flex flex-col gap-1">
          <label className="mt-4">Question</label>
          <div className="flex gap-2 items-center w-full">
            <Select
              options={fontOptions}
              value={fontOptions.find((opt) => opt.value === questionFont.font)}
              onChange={(opt) =>
                setQuestionFont({ ...questionFont, font: opt?.value || "Helvetica" })
              }
              className="w-[80%]"
            />
            <Select
              options={sizeOptions}
              value={sizeOptions.find((opt) => opt.value === questionFont.size)}
              onChange={(opt) =>
                setQuestionFont({ ...questionFont, size: opt?.value || 18 })
              }
              className="w-[20%]"
            />
          </div>
        </div>
        <div className="text-style-option flex flex-col gap-1">
          <label className="mt-4">Body text</label>
          <div className="flex gap-2 items-center w-full">
            <Select
              options={fontOptions}
              value={fontOptions.find((opt) => opt.value === bodyFont.font)}
              onChange={(opt) =>
                setBodyFont({ ...bodyFont, font: opt?.value || "Helvetica" })
              }
              className="w-[80%]"
            />
            <Select
              options={sizeOptions}
              value={sizeOptions.find((opt) => opt.value === bodyFont.size)}
              onChange={(opt) =>
                setBodyFont({ ...bodyFont, size: opt?.value || 16 })
              }
              className="w-[20%]"
            />
          </div>
        </div>
      </div>

      <div className="color-theme px-10 border-b py-5">
        <h4 className="font-bold">Color Theme</h4>
        <div className="pt-5">
          <TwitterPicker
            color={color}
            onChangeComplete={(newColor) => setColor(newColor.hex)}
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
                <span className="text-decoration-underline">
                  click to upload your image
                </span>{" "}
                <br />
                Or drag and drop
              </label>
              <input
                type="file"
                id="logoFileInput"
                ref={fileLogoRef}
                onChange={(e) => handleFileChange(e, setLogoFile, 'logo')}
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
                <span className="text-decoration-underline">
                  click to upload your image
                </span>{" "}
                <br />
                Or drag and drop
              </label>
              <input
                type="file"
                id="header_image"
                ref={fileInputRef}
                // onChange={handleAddHeaderImg}
                onChange={(e) => handleFileChange(e, setHeaderImageFile, 'header_image')}
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
