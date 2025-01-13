import { formatDate } from "@/lib/helpers";
import { useSurveyLeaderboardQuery } from "@/services/dashboard.service";
import React from "react";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, Edit, Trash2, MoreVertical } from "lucide-react";
import Link from "next/link";

const SurveyTable: React.FC = () => {
  const { data, isLoading } = useSurveyLeaderboardQuery(null);

  const getStatusBadgeClasses = (status: string) => {
    switch (status.toLowerCase()) {
      case "on going":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const LoadingSkeleton = () => (
    <>
      {[1, 2, 3].map((index) => (
        <tr key={index} className="bg-white border-b animate-pulse">
          <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4">
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
          </td>
          <td className="hidden sm:table-cell px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4">
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-24"></div>
          </td>
          <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-center">
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-8 sm:w-12 mx-auto"></div>
          </td>
          <td className="hidden sm:table-cell px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4">
            <div className="h-5 sm:h-6 bg-gray-200 rounded w-16 sm:w-20"></div>
          </td>
          <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4">
            <div className="h-4 sm:h-5 bg-gray-200 rounded w-4 sm:w-5"></div>
          </td>
        </tr>
      ))}
    </>
  );

  return (
    <div className="relative overflow-x-auto sm:mx-0">
      {/* The table uses hidden sm:table-cell to hide certain columns on mobile screens */}
      {/* This is done to prevent overcrowding on small screens */}
      {/* Date Created and Status columns are hidden on mobile (< 640px) */}
      <table className="w-full text-xs sm:text-sm text-left rtl:text-right">
        <thead className="text-sm sm:text-base text-[#7A8699] !font-normal bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 font-medium"
            >
              Survey Name
            </th>
            <th
              scope="col"
              className="hidden sm:table-cell px-2 sm:px-4 md:px-6 py-2 sm:py-3 font-medium"
            >
              Date Created {/* Hidden on mobile */}
            </th>
            <th
              scope="col"
              className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 font-medium"
            >
              Responses
            </th>
            <th
              scope="col"
              className="hidden sm:table-cell px-2 sm:px-4 md:px-6 py-2 sm:py-3 font-medium"
            >
              Status {/* Hidden on mobile */}
            </th>
            <th
              scope="col"
              className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 font-medium"
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            data?.data?.map((items: any, index: number) => (
              <tr
                className={`bg-white hover:bg-gray-50 text-[calc(0.75rem)] sm:text-[calc(1rem-2px)] ${
                  index !== data.data.length - 1 ? "border-b" : ""
                }`}
                key={items?._id}
              >
                <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 font-medium">
                  <div className="max-w-[120px] sm:max-w-none truncate">
                    {items?.topic}
                  </div>
                </td>
                <td className="hidden sm:table-cell px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4">
                  {formatDate(items?.createdAt)} {/* Hidden on mobile */}
                </td>
                <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-center">
                  {items?.number_of_responses}
                </td>
                <td className="hidden sm:table-cell px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4">
                  <span
                    className={`px-2 py-1 text-xs font-medium whitespace-nowrap rounded-full ${getStatusBadgeClasses(
                      items?.status
                    )}`}
                  >
                    {items?.status} {/* Hidden on mobile */}
                  </span>
                </td>
                <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="focus:outline-none">
                      <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36 sm:w-36">
                      <DropdownMenuItem>
                        <Link
                          href={`/surveys/question/${items?._id}`}
                          className="flex items-center w-full"
                        >
                          <Eye className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <span>View Survey</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link
                          href={`/surveys/edit/${items?._id}`}
                          className="flex items-center w-full"
                        >
                          <Edit className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <span>Edit Survey</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SurveyTable;
