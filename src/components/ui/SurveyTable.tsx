import { formatDate } from "@/lib/helpers";
import { useSurveyLeaderboardQuery } from "@/services/dashboard.service";
import React from "react";
import { Eye, Edit, MoreVertical } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
          <td className="px-3 py-3">
            <div className="h-4 bg-gray-200 rounded w-[120px] md:w-[200px]"></div>
          </td>
          <td className="hidden md:table-cell px-3 py-3">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </td>
          <td className="px-3 py-3 text-center">
            <div className="h-4 bg-gray-200 rounded w-8 mx-auto"></div>
          </td>
          <td className="hidden md:table-cell px-3 py-3">
            <div className="h-6 bg-gray-200 rounded w-20"></div>
          </td>
          <td className="px-3 py-3">
            <div className="h-5 bg-gray-200 rounded w-5"></div>
          </td>
        </tr>
      ))}
    </>
  );

  return (
    <div className="w-full overflow-x-auto rounded-lg">
      <div className="min-w-[600px] md:min-w-full">
        <table className="w-full text-sm">
          <thead className="text-[#7A8699] bg-gray-50">
            <tr>
              <th scope="col" className="px-3 py-3 font-medium text-left">
                Survey Name
              </th>
              <th
                scope="col"
                className="hidden md:table-cell px-3 py-3 font-medium text-left"
              >
                Date Created
              </th>
              <th scope="col" className="px-3 py-3 font-medium text-center">
                Responses
              </th>
              <th
                scope="col"
                className="hidden md:table-cell px-3 py-3 font-medium text-left"
              >
                Status
              </th>
              <th scope="col" className="px-3 py-3 font-medium text-left">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <LoadingSkeleton />
            ) : (
              data?.data?.map((items: any, index: number) => (
                <tr
                  className="bg-white hover:bg-gray-50 transition-colors"
                  key={items?._id}
                >
                  <td className="px-3 py-3">
                    <div className="max-w-[150px] md:max-w-[300px] truncate font-medium">
                      {items?.topic}
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-3 py-3 text-gray-600">
                    {formatDate(items?.createdAt)}
                  </td>
                  <td className="px-3 py-3 text-center text-gray-600">
                    {items?.number_of_responses}
                  </td>
                  <td className="hidden md:table-cell px-3 py-3">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClasses(
                        items?.status
                      )}`}
                    >
                      {items?.status}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="focus:outline-none">
                        <MoreVertical className="h-5 w-5 text-gray-500" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem className="py-2">
                          <Link
                            href={`/surveys/question/${items?._id}`}
                            className="flex items-center w-full"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View Survey</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="py-2">
                          <Link
                            href={`/surveys/edit/${items?._id}`}
                            className="flex items-center w-full"
                          >
                            <Edit className="mr-2 h-4 w-4" />
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
    </div>
  );
};

export default SurveyTable;
