import { useRef, Dispatch, SetStateAction, useState } from "react";
import { IoMdCloudUpload } from "react-icons/io";
import { handleParentClick, handleFileChange } from "@/utils/fileUtils";
import { Progress } from "@/components/ui/progress";
import { X } from "lucide-react";

interface ImageUploaderProps {
  title: string;
  imageUrl: string | File | null;
  setFile: Dispatch<SetStateAction<File | null>>;
  fileType: string;
  currentFile: File | null;
}

const ImageUploader = ({
  title,
  imageUrl,
  setFile,
  fileType,
  currentFile,
}: ImageUploaderProps) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];

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
      setFile(file);
      simulateUpload();
    }
  };

  const simulateUpload = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const handleRemoveImage = () => {
    setFile(null);
    setUploadProgress(0);
    setError(null);
  };

  return (
    <div className="color-theme px-10 border-b py-5">
      <h4 className="font-bold">{title}</h4>
      <div className="my-5">
        <div
          className={`relative flex flex-col border-2 border-dashed rounded-lg ${
            isDragging ? "border-[#9D50BB] bg-purple-50" : "border-gray-300"
          } items-center bg-white py-6 cursor-pointer transition-all duration-200`}
          role="button"
          onClick={() => !imageUrl && handleParentClick(fileRef)}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {!imageUrl ? (
            <div className="text-center flex flex-col items-center gap-2 p-4">
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
            <div className="relative w-full h-48 group">
              <img
                src={
                  imageUrl instanceof File
                    ? URL.createObjectURL(imageUrl)
                    : imageUrl
                }
                alt={title}
                className="w-full h-full object-contain rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={handleRemoveImage}
                  className="p-2 bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] rounded-full text-white hover:opacity-90 transition-opacity"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          <input
            type="file"
            ref={fileRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && validateFile(file)) {
                handleFileChange(e, setFile, fileType);
                simulateUpload();
              }
            }}
            accept=".jpg,.jpeg,.png"
            className="hidden"
            role="button"
          />
        </div>

        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mt-4">
            <Progress
              value={uploadProgress}
              className="h-2 bg-gradient-to-r from-[#5B03B2] to-[#9D50BB]"
            />
            <p className="text-sm text-gray-600 mt-2">
              Uploading... {uploadProgress}%
            </p>
          </div>
        )}

        {currentFile && !error && (
          <p className="text-xs text-gray-600 mt-2 flex items-start gap-2">
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
