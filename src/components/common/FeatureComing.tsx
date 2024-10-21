import React from "react";
import { FaTools } from "react-icons/fa"; 
interface FeatureComingProps {
  featureName?: string;
  height?:string;
}

const FeatureComing: React.FC<FeatureComingProps> = ({
  featureName = "This feature",
  height='h-[calc(100vh-140px)]'
}) => {
  return (
    <div className={`flex flex-col items-center justify-center ${height}  py-10 text-center`}>
      <FaTools className="text-5xl text-purple-500 mb-4" />
      <h2 className="text-2xl font-semibold mb-2">{featureName} is coming soon!</h2>
      <p className="text-gray-600">
        We are working hard to bring this feature to you. Stay tuned for updates!
      </p>
    </div>
  );
};

export default FeatureComing;
