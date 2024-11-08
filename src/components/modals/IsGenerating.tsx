// import React, { useState } from "react";
// import IsLoadingModal from "./IsLoadingModal";
// import Image from "next/image";
// import { stars } from "@/assets/images";
// import { GridLoader } from "react-spinners";
// import { Fade } from "react-awesome-reveal";

// interface IsGeneratingProps {
//   isGeneratingSurveyLoading: boolean;
// }

// const messages = [
//   "Hold on while we do the hard work for you.",
//   "It's taking longer than we expected. Please bear with us.",
//   "We understand waiting can be stressful. Hang in there!",
//   "Still working on it. Thanks for your patience!",
//   "We’re doing our best to get your response. Thank you for waiting!",
//   "Responses are taking a bit longer. We appreciate your patience!",
// ];

// const IsGenerating: React.FC<IsGeneratingProps> = ({
//   isGeneratingSurveyLoading,
// }) => {
//   const [currentMessage, setCurrentMessage] = useState(messages[0]);
//   const [messageIndex, setMessageIndex] = useState(0);
  
//   return (
//     <div className="custom-scrollbar">
//       {isGeneratingSurveyLoading && (
//         <IsLoadingModal openModal={isGeneratingSurveyLoading} modalSize={"lg"}>
//           <div className="flex flex-col text-center gap-2 custom-scrollbar">
//             <GridLoader
//               color="#5903b0"
//               loading
//               margin={4}
//               size={20}
//               speedMultiplier={1}
//               className=" mx-auto"
//             />
//             <h2 className="text-lg">Generating Questions for you</h2>
//             <Fade delay={1e3} cascade damping={1e-1} className="text-sm">
//               {currentMessage}
//             </Fade>
//             {/* <p className="text-sm">
//               Hold on while we do the hard work for you.
//             </p> */}
//           </div>
//         </IsLoadingModal>
//       )}
//     </div>
//   );
// };

// export default IsGenerating;


import React, { useState, useEffect } from "react";
import IsLoadingModal from "./IsLoadingModal";
import { GridLoader } from "react-spinners";
import { Fade } from "react-awesome-reveal";

interface IsGeneratingProps {
  isGeneratingSurveyLoading: boolean;
  what?:string;
}

const messages = [
  "Hold on while we do the hard work for you.",
  "It's taking longer than we expected. Please bear with us.",
  "We understand waiting can be stressful. Hang in there!",
  "Still working on it. Thanks for your patience!",
  "We’re doing our best to get your response. Thank you for waiting!",
  "Responses are taking a bit longer. We appreciate your patience!",
];

const IsGenerating: React.FC<IsGeneratingProps> = ({
  isGeneratingSurveyLoading,
  what ="Question"
}) => {
  const [currentMessage, setCurrentMessage] = useState(messages[0]);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isGeneratingSurveyLoading) {
      interval = setInterval(() => {
        setMessageIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % messages.length;
          setCurrentMessage(messages[nextIndex]);
          return nextIndex;
        });
      }, 300000); 
    }

    return () => {
      clearInterval(interval);
    };
  }, [isGeneratingSurveyLoading]);

  return (
    <div className="custom-scrollbar">
      {isGeneratingSurveyLoading && (
        <IsLoadingModal openModal={isGeneratingSurveyLoading} modalSize={"lg"}>
          <div className="flex flex-col text-center gap-2 custom-scrollbar">
            <GridLoader
              color="#5903b0"
              loading
              margin={4}
              size={20}
              speedMultiplier={1}
              className="mx-auto"
            />
            <h2 className="text-lg">Generating {what} for you</h2>
            <Fade delay={1e3} cascade damping={1e-1} className="text-sm">
              {currentMessage}
            </Fade>
          </div>
        </IsLoadingModal>
      )}
    </div>
  );
};

export default IsGenerating;

