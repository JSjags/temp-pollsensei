import { pdf_svgrepo_com } from "@/assets/images";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaFilePdf } from "react-icons/fa6";

interface PreviewFileProps {
  data: any;
}

const PreviewFile: React.FC<PreviewFileProps> = ({ data }) => {
  const [activeImage, setActiveImage] = useState(data[0]);

  console.log(activeImage);

  const handleThumbnailClick = (image: any) => {
    setActiveImage(image);
  };
  return (
    <div className="flex flex-col items-center w-full mt-5">
      {/* Active Image Display */}
      {activeImage?.includes("pdf") ? (
        <div className="relative border-2 border-purple-400 flex items-center justify-center text-center p-2 mb-4 w-full min-h-[50vh] group">
  {/* Image */}
  <Image
    src={pdf_svgrepo_com}
    alt="image preview"
    className="w-full h-auto"
  />
  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity"></div>
  <p className="absolute inset-0 flex items-center justify-center text-white text-xl transition-opacity duration-300 group-hover:opacity-100 opacity-0">
    PDF file detected
  </p>
</div>

      ) : (
        <div className="border-2 border-purple-400 p-2 mb-4 w-full min-h-[50vh]">
          <Image
            src={activeImage?.src}
            alt={"image preview"}
            className="w-full h-auto max-w-md"
          />
        </div>
      )}

      {/* Thumbnail List */}
      <div className="flex space-x-4">
        {data.map((image: any, index: any) => {
          if (data.includes("pdf")) {
            return (
              <Link
                key={index}
                href={activeImage}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFilePdf/>
              </Link>
            );
          } else {
            return (
              <button
                key={index}
                onClick={() => handleThumbnailClick(image)}
                className={`border-2 p-1 ${
                  activeImage?.src === image?.src
                    ? "border-purple-600"
                    : "border-gray-300"
                }`}
              >
                <Image
                  src={image?.src}
                  alt={image.src}
                  className="w-16 h-16 object-cover"
                />
              </button>
            );
          }
        })}
      </div>
    </div>
  );
};

export default PreviewFile;
