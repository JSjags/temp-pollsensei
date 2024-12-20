// "use client"

// import { useGetReviewQuery } from "@/services/superadmin.service";
// import React, { useState } from "react";

// interface ReviewData {
//   _id: string;
//   survey_id: string;
//   field_description: string;
//   suggested_improvement: string;
//   overall_satisfaction: string;
//   is_deleted: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

// interface ReviewsProps {
//   data: ReviewData[];
// }

// const AdminReviews: React.FC = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [reviewsPerPage] = useState(5);
//   const { data } = useGetReviewQuery(currentPage)

//   console.log(data)

//   const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

//   return (
//     <div className="p-6 max-w-5xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Customer Reviews</h1>

//       {/* Reviews List */}
//       <div className="space-y-4">
//         {data?.data?.data?.map((review:any) => (
//           <div
//             key={review._id}
//             className="p-4 border border-gray-300 rounded-md shadow-sm bg-white"
//           >
//             <div className="mb-2">
//               <span className="font-semibold text-gray-800">
//                 Field Description:
//               </span>{" "}
//               {review.field_description}
//             </div>
//             <div className="mb-2">
//               <span className="font-semibold text-gray-800">
//                 Suggested Improvement:
//               </span>{" "}
//               {review.suggested_improvement}
//             </div>
//             <div className="mb-2">
//               <span className="font-semibold text-gray-800">
//                 Overall Satisfaction:
//               </span>{" "}
//               {review.overall_satisfaction}
//             </div>
//             <div className="text-sm text-gray-500">
//               <p>
//                 <span className="font-semibold">Created At:</span>{" "}
//                 {new Date(review.createdAt).toLocaleString()}
//               </p>
//               <p>
//                 <span className="font-semibold">Updated At:</span>{" "}
//                 {new Date(review.updatedAt).toLocaleString()}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>

//     </div>
//   );
// };

// export default AdminReviews;

"use client";

import PageControl from "@/components/common/PageControl";
import { useGetReviewQuery } from "@/services/superadmin.service";
import React, { useState } from "react";
import { FadeLoader } from "react-spinners";
import { generateInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Answer {
  question: string;
  question_type: string;
  selected_options?: string[];
  text?: string;
  _id: string;
}
interface UserId {
  name: string;
  email: string;
  country?: string;
}

interface ReviewData {
  _id: string;
  survey_id: string;
  user_id: any;
  reviews: Answer[];
  createdAt: string;
  updatedAt: string;
}

const AdminReviews: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(10);
  const { data, isLoading, error, refetch } = useGetReviewQuery(currentPage);

  const totalItems = data?.data?.total || 0;
  const totalPages = Math.ceil(totalItems / reviewsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const reviews: ReviewData[] = data?.data?.data || [];

  const navigatePage = (direction: "next" | "prev") => {
    setCurrentPage((prevIndex) => {
      if (direction === "next") {
        return prevIndex < totalPages ? prevIndex + 1 : prevIndex;
      } else {
        return prevIndex > 1 ? prevIndex - 1 : prevIndex;
      }
    });
    refetch();
  };

  const statusColorMap = ["#FFC107", "#3498DB", "#27AE60", "#2980B9", "#2ECC71", "#E74C3C", "#FF5733", "#FF5733", "#FF5733",
  ];
  const getRandomColor = () => {
    return statusColorMap[Math.floor(Math.random() * statusColorMap.length)];
  };


  console.log(reviews)

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Customer Reviews</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Respondent Name
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Respondent Email
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Country
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Answers
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Created At
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Updated At
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center ">
                  <span className="flex justify-center items-center">
                    <FadeLoader height={10} radius={1} className="mt-3" />
                  </span>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="text-center ">
                  <span className="flex justify-center items-center text-xs text-red-500">
                    Something went wrong
                  </span>
                </td>
              </tr>
            ) : (
              reviews.map((review) => (
                <tr key={review._id} className="even:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    {review?.user_id?.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {review?.user_id?.email}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {review?.user_id?.country || "Not Provided"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {review?.reviews?.map((answer) => (
                      <div key={answer._id} className="mb-2">
                        <p>
                          <strong>{answer.question}</strong>
                        </p>
                        {answer.question_type === "long_text" ||
                        answer.question_type === "short_text" ? (
                          <p>{answer.text}</p>
                        ) : (
                          <ul className="list-disc ml-4">
                            {answer.selected_options?.map((option, index) => (
                              <li key={index}>{option}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(review.createdAt).toLocaleString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(review.updatedAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full border-collapse border-gray-200 overflow-x-auto">
          <thead className="bg-gray-100">
          <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Respondent Name
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Respondent Email
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Country
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Answers
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Created At
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Updated At
              </th>
            </tr>
          </thead>
          <tbody>
            {
              isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center ">
                    <span className="flex justify-center items-center" >
                    <FadeLoader height={10} radius={1} className="mt-3" />
                    </span>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="text-center ">
                    <span className="flex justify-center items-center text-xs text-red-500" >
                    Something went wrong
                    </span>
                  </td>
                </tr>
              ) :
            data?.data?.data?.map((user: any, index: number) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-[#F7EEFED9]" : "bg-[#FEF5FED6]"
                } text-sm rounded-md`}
              >
                <td className="py-3 px-4 flex items-center gap-2">
                <Avatar className="size-8">
                  <AvatarImage
                    src={(user as any)?.photo_url ?? ""}
                    alt="@johndoe"
                  />
                  <AvatarFallback className={`font-semibold  `} style={{backgroundColor: getRandomColor()}}>
                    {generateInitials(user?.name ?? "")}
                  </AvatarFallback>
                </Avatar>
                   {user?.name}</td>
                <td className="py-3 px-4">
                  {user?.accountType ? user?.accountType : "Not Available"}
                </td>
                <td className="py-3 px-4">{user?.email}</td>
                <td
                  className={`py-3 px-4 font-medium ${
                    user.subscription === "Premium"
                      ? "text-purple-600"
                      : user.subscription === "Pro Plan"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  <span
                    className={`py-1 px-2 rounded-full ${
                      user.subscription === "Premium"
                        ? "bg-[#D195FC1A]"
                        : user.subscription === "Pro Plan"
                        ? "bg-[#FFEBED]"
                        : "bg-[#D3FAEC]"
                    }`}
                  >
                    {user?.subscription ? user?.subscription : "Free Plan"}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {user?.collaborators ? user.collaborators : "Not Available"}
                </td>
                <td
                  className={`py-3 px-4 font-medium ${
                    user.plan === "Premium"
                      ? "text-purple-600"
                      : user.plan === "Pro Plan"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {user?.plan ? user?.plan : "Free Plan"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {/* <div className="mt-6 flex justify-center space-x-4">
        {Array.from(
          { length: Math.ceil((data?.data?.total || 0) / reviewsPerPage) },
          (_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`px-4 py-2 border rounded ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500 border-blue-500"
              }`}
            >
              {i + 1}
            </button>
          )
        )}
      </div> */}

      <div className="mt-6 sm:mt-8 flex justify-between items-center">
        <p className="text-xs font-medium">
          {totalItems > 0
            ? `Showing ${(currentPage - 1) * reviewsPerPage + 1}-${Math.min(
                currentPage * reviewsPerPage,
                totalItems
              )} of ${totalItems}`
            : "No items to display"}
        </p>
        <PageControl
          currentPage={currentPage}
          totalPages={totalPages}
          onNavigate={navigatePage}
        />
      </div>
    </div>
  );
};

export default AdminReviews;
