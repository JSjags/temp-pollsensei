import React from "react";
import { BsFillFilePdfFill } from "react-icons/bs";
import { FaTimes } from "react-icons/fa";
import { FaFileImage } from "react-icons/fa6";
import { toast } from "react-toastify";
import { GoDotFill } from "react-icons/go";

interface UploadedItemProps {
  item: File;
  onRemove: (item: File) => void;
  onItemSelect: (item: File) => void;
}

const UploadedItem: React.FC<UploadedItemProps> = ({
  item,
  onRemove,
  onItemSelect,
}) => {
  if (!item || !item.name) {
    return null;
  }

  const fileSizeLimit = 10 * 1024 * 1024; 

  const isValidFileType =
    item.type === "image/jpeg" ||
    item.type === "image/png";
    // item.type === "application/pdf";
  const isValidFileSize = item.size <= fileSizeLimit;

  if (!isValidFileType || !isValidFileSize) {
    toast.error("File size limit exceeded or invalid file type.");
    return null;
  }

  const fileSizeInMB = (item.size / (1024 * 1024)).toFixed(1);

  const handleRemoveClick = () => {
    onRemove(item);
  };

  const handlePdfPreview = () => {
    window.open(URL.createObjectURL(item), "_blank");
  };

  return (
    <div className="flex items-center justify-between w-full py-2 max-h-[20vh] custom-scrollbar overflow-y-auto">
      <div className="flex items-center gap-3 ">
        {item.type.startsWith("image") ? (
          <FaFileImage />
        ) : (
          <BsFillFilePdfFill />
        )}
        <span className="text-gray-700">{item.name.slice(0, 15)}...</span>
        <GoDotFill />
        <button
          onClick={handlePdfPreview}
          className="text-purple-600 hover:text-purple-800 text-sm"
        >
          Preview
        </button>
      </div>

      <div className="flex items-center gap-4 ">
        <span className="text-gray-400 text-sm flex">{fileSizeInMB}MB</span>
        <button
          onClick={handleRemoveClick}
          className="text-red-500 hover:text-red-700 flex"
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default UploadedItem;
