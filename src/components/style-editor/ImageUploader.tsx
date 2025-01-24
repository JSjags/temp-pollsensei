import { useRef, Dispatch, SetStateAction, useState } from "react";
import { IoMdCloudUpload } from "react-icons/io";
import { handleParentClick, handleFileChange } from "@/utils/fileUtils";
import { Progress } from "@/components/ui/progress";
import { X, Upload, Trash2, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";
import axiosInstance from "@/lib/axios-instance";
import Image from "next/image";
import { Input } from "../ui/shadcn-input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SurveyData } from "@/subpages/survey/EditSubmittedSurvey";

interface ImageUploaderProps {
  title: string;
  imageUrl: string | File | null;
  setFile: Dispatch<SetStateAction<File | null>>;
  fileType: string;
  currentFile: File | null;
  surveyData?: any;
  setSurveyData?: Dispatch<SetStateAction<SurveyData>>;
}

const ImageUploader = ({
  title,
  imageUrl,
  setFile,
  fileType,
  currentFile,
  surveyData,
  setSurveyData,
}: ImageUploaderProps) => {
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("file_type", fileType);

      return axiosInstance.post("/survey/file", formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setUploadProgress(progress);
        },
      });
    },
    onSuccess: (response) => {
      queryClient.refetchQueries({ queryKey: ["survey"] });
      if (selectedImage && setSurveyData) {
        setFile(selectedImage);
        setUploadProgress(100);
        setSurveyData((prev: any) => ({
          ...prev,
          [fileType === "logo" ? "logo_url" : "header_url"]: response.data.url,
        }));
      }
      setIsProcessing(false);
    },
    onError: () => {
      setError("Failed to upload image");
      setIsProcessing(false);
    },
  });

  const removeMutation = () => {
    setIsProcessing(true);
    setFile(null);
    setSelectedImage(null);
    setUploadProgress(0);

    // Clear URL in surveyData
    if (setSurveyData) {
      setSurveyData((prev: any) => ({
        ...prev,
        [fileType === "logo" ? "logo_url" : "header_url"]: "",
      }));
    }
    setIsProcessing(false);
  };

  const validateFile = (file: File): boolean => {
    setError(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Invalid file type. Please upload JPG, JPEG or PNG files only.");
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File size exceeds 10MB limit. Please choose a smaller file.");
      return false;
    }

    return true;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      setSelectedImage(file);
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setFile(null);
    setUploadProgress(0);
    setError(null);
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  return (
    <div className="color-theme px-10 border-b py-5 max-w-full">
      <h4 className="font-bold">{title}</h4>
      <div className="my-5">
        <div
          className={`relative flex flex-col border-2 border-dashed rounded-lg ${
            isDragging ? "border-[#9D50BB] bg-purple-50" : "border-gray-300"
          } items-center bg-white py-6 cursor-pointer transition-all duration-200 max-w-full`}
          role="button"
          onClick={() => !isProcessing && handleParentClick(fileRef)}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {!selectedImage && !imageUrl ? (
            <div className="text-center flex flex-col items-center gap-2 p-4 w-full">
              <IoMdCloudUpload className="text-4xl text-gray-400" />
              <div className="text-sm text-gray-600">
                <span className="text-[#5B03B2] font-medium">
                  Click to upload
                </span>{" "}
                or drag and drop
              </div>
              <div className="text-xs text-gray-500">
                JPG, JPEG or PNG (max. 10MB)
              </div>
            </div>
          ) : (
            <div className="relative w-full h-48">
              <Image
                src={
                  selectedImage
                    ? URL.createObjectURL(selectedImage)
                    : imageUrl instanceof File
                    ? URL.createObjectURL(imageUrl)
                    : imageUrl || ""
                }
                alt={title}
                width={800}
                height={600}
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
          )}

          <Input
            type="file"
            ref={fileRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && validateFile(file)) {
                setSelectedImage(file);
              }
            }}
            accept=".jpg,.jpeg,.png"
            className="hidden"
            role="button"
            disabled={isProcessing}
          />
        </div>

        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

        {uploadProgress > 0 && uploadMutation.isPending && (
          <div className="mt-4 w-full">
            <Progress value={uploadProgress} className="h-1 rounded-full" />
            <p className="text-sm text-gray-600 mt-2">
              Uploading... {uploadProgress}%
            </p>
          </div>
        )}

        {selectedImage && (
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              onClick={handleClear}
              variant="outline"
              className="flex items-center gap-2"
              disabled={isProcessing || uploadMutation.isPending}
            >
              <RefreshCw className="w-4 h-4" />
              Clear
            </Button>

            {imageUrl && (
              <Button
                onClick={() => removeMutation()}
                variant="outline"
                className="flex items-center gap-2 text-red-500 hover:text-red-600"
                disabled={isProcessing || uploadMutation.isPending}
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </Button>
            )}

            <Button
              onClick={() => {
                setIsProcessing(true);
                selectedImage && uploadMutation.mutate(selectedImage);
              }}
              disabled={isProcessing || uploadMutation.isPending}
              className="flex items-center gap-2 bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] text-white"
            >
              <Upload className="w-4 h-4" />
              {uploadMutation.isPending ? "Uploading..." : "Upload"}
            </Button>
          </div>
        )}

        {currentFile && !error && (
          <p className="text-xs text-gray-600 mt-2 flex items-start gap-2 break-all">
            <span className="font-medium">
              <span className="whitespace-nowrap">Selected file:</span>
            </span>{" "}
            {currentFile.name}
          </p>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
