import { useQuery } from "@tanstack/react-query";
import { FaPlay } from "react-icons/fa";

import { isValidResponse, handleApiErrors } from "@/lib/utils";
import { getPopularTutorials } from "@/services/api/tutorial";
import DuplicateLoader from "@/components/common/DuplicateLoader";
import Link from "next/link";
import EmptyTableData from "@/components/common/EmptyTableData";
import AppLoadingSkeleton from "@/components/common/AppLoadingSkeleton";
import routes from "@/config/routes";
import { formatDate } from "@/lib/helpers";

const VideosSection = (): JSX.Element => {
  const { data, isLoading } = useQuery({
    queryKey: ["getPopularVideoTutorials"],
    queryFn: async () => {
      const response = await getPopularTutorials("video");
      if (isValidResponse(response)) {
        return response?.data;
      } else {
        handleApiErrors(response);
        return null;
      }
    },
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Popular Video Tutorials</h2>

      <ul className="flex flex-col gap-y-6">
        {isLoading ? (
          <DuplicateLoader loader={<VideoLoader />} />
        ) : !!data?.data && data?.data?.length > 0 ? (
          <>
            {data?.data?.map((value, key) => (
              <dl key={key}>
                <Link
                  href={routes.SINGLE_ARTICLE_PAGE(value?.slug)}
                  className="text-xl font-semibold text-purple-700 hover:underline cursor-pointer flex items-center"
                >
                  <FaPlay className="text-purple-700 text-xs mr-2" />{" "}
                  {value?.title}
                </Link>
                <dd className="text-gray-500 text-sm mt-1">
                  {formatDate(value?.createdAt)}
                </dd>
              </dl>
            ))}
            <Link
              href="/articles"
              className="inline-flex items-center text-purple-700 font-medium mt-6"
            >
              Watch more tutorials <span className="ml-1">&gt;</span>
            </Link>
          </>
        ) : (
          <EmptyTableData />
        )}
      </ul>
    </div>
  );
};

export default VideosSection;

function VideoLoader() {
  return (
    <dl className="flex flex-col gap-y-2">
      <AppLoadingSkeleton className=" h-4  w-[70%]" />
      <div className="flex items-center gap-2">
        <FaPlay className="text-purple-700 text-xs " />
        <AppLoadingSkeleton className="h-3 w-[50%]" />
      </div>

      <AppLoadingSkeleton className=" h-3 w-[30%]" />
    </dl>
  );
}
