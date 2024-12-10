import React, { useState } from "react";
import { FaDownload } from "react-icons/fa6";
import { useLazyDownloadAllResponseQuery, useLazyDownloadSingleResponseQuery } from "@/services/survey.service";
import { useParams } from "next/navigation";
import Link from "next/link";
import ResponseActions from "./ResponseAction";

interface ResponseHeaderProps {
  data: any;
  tabs: any;
  surveyData: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  curerentSurvey: number;
  valid_response?: number;
  invalid_response?: number;
  handleNext?: () => void;
  handlePrev?: () => void;
  deleteAResponse?: () => void;
  respondent_data?:any[];
  response_id?:string;
}

const ResponseHeader: React.FC<ResponseHeaderProps> = ({
  data,
  tabs,
  activeTab,
  setActiveTab,
  curerentSurvey,
  handleNext,
  handlePrev,
  respondent_data,
  valid_response,
  invalid_response,
  deleteAResponse,
  response_id,
  surveyData
}) => {
  const [downloadModal, setDownloadModal] = useState(false);
  const params = useParams();

  console.log(response_id)

  const [triggerDownloadAll, { data: allDownloadData }] = useLazyDownloadAllResponseQuery();
  const [triggerDownloadSingle, { data: singleDownloadData }] = useLazyDownloadSingleResponseQuery();

  const handleDownload = async (type: "all" | "single", format: "pdf" | "csv" | "xlsx") => {
    const id = type === "all" ? { survey_id: params.id, format } : { response_id: response_id, format };

    try {
      if (type === "all") {
        await triggerDownloadAll(id);
      } else {
        await triggerDownloadSingle(id);
      }
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4 w-full">
        <div className="lg:flex items-center space-x-2 w-full">
          {/* Avatars */}
          <div className="flex -space-x-2">
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="user1"
              className="w-8 h-8 rounded-full border-2 border-white"
            />
            <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold border-2 border-white">
              AD
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold border-2 border-white">
              MJ
            </div>
          </div>
          <span className="text-gray-700 font-semibold">
            Number of Responses:{" "}
            <span className="font-bold">{data}</span>
          </span>
        </div>

        {/* Icons */}
        <div className="flex relative w-full justify-end">
          <button className="text-gray-500 hover:text-gray-700" onClick={() => setDownloadModal((prev) => !prev)}>
            <FaDownload size={25} />
          </button>

          {downloadModal && (
            <div className="min-w-md px-6 py-3 shadow-md rounded-md absolute right-10 top-10 z-50 bg-white">
              <ul className="text-xs flex flex-col gap-4 w-full">
                <li className="cursor-pointer">
                  <Link
                    href={allDownloadData && allDownloadData?.data?.url ? allDownloadData.data.url : ""}
                    onClick={() => handleDownload("all", "pdf")}
                    target="blank"
                    download
                  >
                    Download all responses as PDF
                  </Link>
                </li>
                <li className="cursor-pointer">
                  <Link
                    href={singleDownloadData && singleDownloadData?.data?.url ? singleDownloadData.data.url : ""}
                    onClick={() => handleDownload("single", "pdf")}
                    target="blank"
                    download
                  >
                    Download current response as PDF
                  </Link>
                </li>
                <li className="cursor-pointer">
                  <Link
                    href={allDownloadData && allDownloadData?.data?.url ? allDownloadData.data.url : ""}
                    onClick={() => handleDownload("all", "csv")}
                    target="blank"
                    download
                  >
                    Download all responses as CSV
                  </Link>
                </li>
                <li className="cursor-pointer">
                  <Link
                    href={singleDownloadData && singleDownloadData?.data?.url ? singleDownloadData.data.url : ""}
                    onClick={() => handleDownload("single", "csv")}
                    target="blank"
                    download
                  >
                    Download current response as CSV
                  </Link>
                </li>
                <li className="cursor-pointer">
                  <Link
                    href={allDownloadData && allDownloadData?.data?.url ? allDownloadData.data.url : ""}
                    onClick={() => handleDownload("all", "xlsx")}
                    target="blank"
                    download
                  >
                    Download all responses as Excel
                  </Link>
                </li>
                <li className="cursor-pointer">
                  <Link
                    href={singleDownloadData && singleDownloadData?.data?.url ? singleDownloadData.data.url : ""}
                    onClick={() => handleDownload("single", "xlsx")}
                    target="blank"
                    download
                  >
                    Download current response as Excel
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center border-b border-gray-300 overflow-x-auto">
        {tabs.map((tab: any) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 transition-colors duration-200 ${
              activeTab === tab ? "text-purple-600 border-b-2 border-purple-600" : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Individual Responses" && (
        <ResponseActions
          curerentSurvey={curerentSurvey}
          totalSurveys={data}
          handleNext={handleNext}
          handlePrev={handlePrev}
          respondent_data={respondent_data}
          valid_response={valid_response}
          invalid_response={invalid_response}
          deleteAResponse={deleteAResponse}
          surveyData={surveyData}
        />
      )}
    </div>
  );
};

export default ResponseHeader;


// import React, { useState } from "react";
// import { FaDownload } from "react-icons/fa6";
// import { useLazyDownloadAllResponseQuery, useLazyDownloadSingleResponseQuery } from "@/services/survey.service";
// import { useParams } from "next/navigation";
// import Link from "next/link";

// interface ResponseHeaderProps {
//   data: any;
//   tabs: any;
//   activeTab: string;
//   setActiveTab: (tab: string) => void;
//   curerentSurvey: number;
//   valid_response?: number;
//   invalid_response?: number;
//   handleNext?: () => void;
//   handlePrev?: () => void;
//   deleteAResponse?: () => void;
//   respondent_data?:any[];
// }

// const ResponseHeader: React.FC<ResponseHeaderProps> = ({
//   data,
//   tabs,
//   activeTab,
//   setActiveTab,
//   curerentSurvey,
//   handleNext,
//   handlePrev,
//   respondent_data,
//   valid_response,
//   invalid_response,
//   deleteAResponse
// }) => {
//   const [downloadModal, setDownloadModal] = useState(false);
//   const params = useParams();

//   const [triggerDownloadAll, { data: allDownloadData }] = useLazyDownloadAllResponseQuery();
//   const [triggerDownloadSingle, { data: singleDownloadData }] = useLazyDownloadSingleResponseQuery();

//   const handleDownload = async (type: "all" | "single", format: "pdf" | "csv" | "xlsx") => {
//     const id = type === "all" ? { survey_id: params.id, format } : { response_id: data?._id, format };

//     try {
//       if (type === "all") {
//         await triggerDownloadAll(id);
//       } else {
//         await triggerDownloadSingle(id);
//       }
//     } catch (error) {
//       console.error("Download error:", error);
//     }
//   };

//   return (
//     <div className="border rounded-lg p-4 shadow-sm">
//       <div className="flex justify-between items-center mb-4 w-full">
//         <div className="lg:flex items-center space-x-2 w-full">
//           {/* Avatars */}
//           <div className="flex -space-x-2">
//             <img
//               src="https://randomuser.me/api/portraits/women/44.jpg"
//               alt="user1"
//               className="w-8 h-8 rounded-full border-2 border-white"
//             />
//             <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold border-2 border-white">
//               AD
//             </div>
//             <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold border-2 border-white">
//               MJ
//             </div>
//           </div>
//           <span className="text-gray-700 font-semibold">
//             Number of Responses:{" "}
//             <span className="font-bold">{data?.response_count}</span>
//           </span>
//         </div>

//         {/* Icons */}
//         <div className="flex relative w-full justify-end">
//           <button className="text-gray-500 hover:text-gray-700" onClick={() => setDownloadModal((prev) => !prev)}>
//             <FaDownload size={25} />
//           </button>

//           {downloadModal && (
//             <div className="min-w-md px-6 py-3 shadow-md rounded-md absolute right-10 top-10 z-50 bg-white">
//               <ul className="text-xs flex flex-col gap-4 w-full">
//                 <li className="cursor-pointer">
//                   <Link
//                     href={allDownloadData && allDownloadData?.data?.url ? allDownloadData.data.url : ""}
//                     onClick={() => handleDownload("all", "pdf")}
//                     target="blank"
//                     download
//                   >
//                     Download all responses as PDF
//                   </Link>
//                 </li>
//                 <li className="cursor-pointer">
//                   <Link
//                     href={singleDownloadData && singleDownloadData?.data?.url ? singleDownloadData.data.url : ""}
//                     onClick={() => handleDownload("single", "pdf")}
//                     target="blank"
//                     download
//                   >
//                     Download current response as PDF
//                   </Link>
//                 </li>
//                 <li className="cursor-pointer">
//                   <Link
//                     href={allDownloadData && allDownloadData?.data?.url ? allDownloadData.data.url : ""}
//                     onClick={() => handleDownload("all", "csv")}
//                     target="blank"
//                     download
//                   >
//                     Download all responses as CSV
//                   </Link>
//                 </li>
//                 <li className="cursor-pointer">
//                   <Link
//                     href={singleDownloadData && singleDownloadData?.data?.url ? singleDownloadData.data.url : ""}
//                     onClick={() => handleDownload("single", "csv")}
//                     target="blank"
//                     download
//                   >
//                     Download current response as CSV
//                   </Link>
//                 </li>
//                 <li className="cursor-pointer">
//                   <Link
//                     href={allDownloadData && allDownloadData?.data?.url ? allDownloadData.data.url : ""}
//                     onClick={() => handleDownload("all", "xlsx")}
//                     target="blank"
//                     download
//                   >
//                     Download all responses as Excel
//                   </Link>
//                 </li>
//                 <li className="cursor-pointer">
//                   <Link
//                     href={singleDownloadData && singleDownloadData?.data?.url ? singleDownloadData.data.url : ""}
//                     onClick={() => handleDownload("single", "xlsx")}
//                     target="blank"
//                     download
//                   >
//                     Download current response as Excel
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="flex justify-center border-b border-gray-300 overflow-x-auto">
//         {tabs.map((tab: any) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`px-4 py-2 transition-colors duration-200 ${
//               activeTab === tab ? "text-purple-600 border-b-2 border-purple-600" : "text-gray-500"
//             }`}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       {activeTab === "Individual Responses" && (
//         <ResponseActions
//           curerentSurvey={curerentSurvey}
//           totalSurveys={data?.response_count}
//           handleNext={handleNext}
//           handlePrev={handlePrev}
//           respondent_data={respondent_data}
//           valid_response={valid_response}
//           invalid_response={invalid_response}
//           deleteAResponse={deleteAResponse}
//         />
//       )}
//     </div>
//   );
// };

// export default ResponseHeader;
