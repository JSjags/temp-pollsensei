import React from "react";

const FormSkeleton = ({ fieldCount = 7 }) => {
  return (
    <div className="w-full h-full flex flex-col items-center mx-auto">
      <div className="flex flex-col gap-4 w-full lg:w-[70%] mx-auto">
        {/* Header skeleton */}
        <div className="flex items-center gap-3">
          <div className="lg:hidden w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>

        {/* Form skeleton */}
        <div className="flex flex-col gap-6">
          {/* Generate form field skeletons */}
          {Array.from({ length: fieldCount }).map((_, index) => (
            <div key={index} className="flex flex-col gap-2">
              {/* Label skeleton */}
              <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>

              {/* Select field skeleton */}
              <div className="w-full h-11 bg-gray-200 rounded-md animate-pulse border-2 border-gray-100"></div>
            </div>
          ))}

          {/* Buttons skeleton */}
          <div className="w-full flex items-center gap-5 lg:mb-10 mt-5">
            <div className="w-full h-11 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="w-full h-11 bg-gray-300 rounded-md animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormSkeleton;
