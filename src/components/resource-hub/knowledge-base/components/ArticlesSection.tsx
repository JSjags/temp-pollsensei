"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { getPopularTutorials } from "@/services/api/tutorial";
import { handleApiErrors, isValidResponse } from "@/lib/utils";
import DuplicateLoader from "@/components/common/DuplicateLoader";
import AppLoadingSkeleton from "@/components/common/AppLoadingSkeleton";
import EmptyTableData from "@/components/common/EmptyTableData";
import { formatDate } from "@/lib/helpers";
import routes from "@/config/routes";

const ArticlesSection = (): JSX.Element => {
  const { data, isLoading } = useQuery({
    queryKey: ["getPopularWebTutorials"],
    queryFn: async () => {
      const response = await getPopularTutorials("web");
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
      <h2 className="text-2xl font-bold mb-6">Popular on Articles</h2>

      <ul className="flex flex-col gap-y-6">
        {isLoading ? (
          <DuplicateLoader loader={<ArticleLoader />} />
        ) : !!data?.data && data?.data?.length > 0 ? (
          <>
            {data?.data?.map((value, key) => (
              <dl key={key}>
                <Link href={routes.SINGLE_ARTICLE_PAGE(value?.slug)}>
                  <dt className="text-xl font-semibold text-purple-700 hover:underline cursor-pointer">
                    {value?.title}
                  </dt>
                </Link>
                <dd className="text-gray-600 mt-2">{value?.description}</dd>
                <p className="text-gray-500 text-sm mt-1">
                  {formatDate(value?.createdAt)}
                </p>
              </dl>
            ))}
            <Link
              href="/articles"
              className="inline-flex items-center text-purple-700 font-medium mt-6"
            >
              Read more Articles <span className="ml-1">&gt;</span>
            </Link>
          </>
        ) : (
          <EmptyTableData />
        )}
      </ul>
    </div>
  );
};

export default ArticlesSection;

function ArticleLoader() {
  return (
    <dl className="flex flex-col gap-y-2">
      <AppLoadingSkeleton className="w-[70%] h-4" />
      <AppLoadingSkeleton className="w-[50%] h-3" />
      <AppLoadingSkeleton className="w-[30%] h-3" />
    </dl>
  );
}
