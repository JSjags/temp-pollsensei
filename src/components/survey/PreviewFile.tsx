import Image from 'next/image';
import React, { useState } from 'react'

interface ImageData {
  src: string;
  alt: string;
}

interface PreviewFileProps {
  data: ImageData[];
}

const PreviewFile:React.FC<PreviewFileProps> = ({data}) => {
  const [activeImage, setActiveImage] = useState<ImageData>(data[0]);

  const handleThumbnailClick = (image: ImageData) => {
    setActiveImage(image);
  };
  return (
    <div className="flex flex-col items-center w-full mt-5">
      {/* Active Image Display */}
      <div className="border-2 border-purple-400 p-2 mb-4 w-full min-h-[50vh]">
        <Image
          src={activeImage?.src}
          alt={activeImage?.alt}
          className="w-full h-auto max-w-md"
        />
      </div>

      {/* Thumbnail List */}
      <div className="flex space-x-4">
        {data.map((image, index) => (
          <button
            key={index}
            onClick={() => handleThumbnailClick(image)}
            className={`border-2 p-1 ${
              activeImage?.src === image?.src
                ? 'border-purple-600'
                : 'border-gray-300'
            }`}
          >
            <Image
              src={image?.src}
              alt={image?.alt}
              className="w-16 h-16 object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

export default PreviewFile
