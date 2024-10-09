import React from "react";
import IsLoadingModal from "./IsLoadingModal";
import Image from "next/image";
import { stars } from "@/assets/images";
import { GridLoader } from "react-spinners";

interface IsGeneratingProps {
  isGeneratingSurveyLoading: boolean;
}

const IsGenerating: React.FC<IsGeneratingProps> = ({
  isGeneratingSurveyLoading,
}) => {
  return (
    <div className="custom-scrollbar">
      {isGeneratingSurveyLoading && (
        <IsLoadingModal openModal={isGeneratingSurveyLoading} modalSize={"lg"}>
          <div className="flex flex-col text-center gap-2 custom-scrollbar">
            {/* <Image
              src={stars}
              alt="stars"
              className={`h-8 w-auto animate-spin-slow`}
            /> */}
            <GridLoader
              color="#5903b0"
              loading
              margin={4}
              size={20}
              speedMultiplier={1}
              className=" mx-auto"
            />
            <h2 className="text-lg">Generating Questions for you</h2>
            <p className="text-sm">
              Hold on while we do the hard work for you.
            </p>
          </div>
        </IsLoadingModal>
      )}
    </div>
  );
};

export default IsGenerating;
