import { formatDate } from "@/lib/helpers";
import { useSurveyLeaderboardQuery } from "@/services/dashboard.service";
import React from "react";
import { Eye, Edit, MoreVertical, Calendar, Users } from "lucide-react";
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

  const MobileCard = ({ item }: { item: any }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm !w-[clamp(240px,100%,720px)]">
      <div className="flex justify-between items-start mb-3 w-full relative">
        <div className="min-w-0 pr-2">
          <h3 className="font-medium whitespace-pre-wrap text-gray-900 truncate text-sm pr-6">
            {item?.topic}
          </h3>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none ml-2">
            <MoreVertical className="h-5 w-5 text-gray-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem className="py-2">
              <Link
                href={`/surveys/question/${item?._id}`}
                className="flex items-center w-full"
              >
                <Eye className="mr-2 h-4 w-4" />
                <span>View Survey</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="py-2">
              <Link
                href={`/surveys/edit/${item?._id}`}
                className="flex items-center w-full"
              >
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit Survey</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-2 text-xs text-gray-600">
        <div className="flex items-center">
          <Calendar className="h-3 w-3 mr-2" />
          <span>{formatDate(item?.createdAt)}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="h-3 w-3 mr-2" />
            <span>{item?.number_of_responses} responses</span>
          </div>
          <span
            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClasses(
              item?.status
            )}`}
          >
            {item?.status}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {/* Mobile View */}
      <div className="lg:hidden">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3 w-full">
            {data?.data?.map((item: any) => (
              <MobileCard key={item?._id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block overflow-x-auto rounded-lg">
        <div className="min-w-full">
          <table className="w-full text-sm">
            <thead className="text-[#7A8699] bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-3 font-medium text-left">
                  Survey Name
                </th>
                <th scope="col" className="px-3 py-3 font-medium text-left">
                  Date Created
                </th>
                <th scope="col" className="px-3 py-3 font-medium text-center">
                  Responses
                </th>
                <th scope="col" className="px-3 py-3 font-medium text-left">
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
                      <div className="max-w-[300px] truncate font-medium">
                        {items?.topic}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-gray-600">
                      {formatDate(items?.createdAt)}
                    </td>
                    <td className="px-3 py-3 text-center text-gray-600">
                      {items?.number_of_responses}
                    </td>
                    <td className="px-3 py-3">
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
    </div>
  );
};

export default SurveyTable;
