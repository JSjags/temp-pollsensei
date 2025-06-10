import { useGetTutorials } from "@/hooks/useGetRequests";
import { TUTORIAL_ENUM } from "@/services/api/constants.api";
import DuplicateLoader from "../common/DuplicateLoader";
import EmptyTableData from "../common/EmptyTableData";
import { ResourceCard, ResourceCardLoader } from "./components/ResourceCard";
import axiosInstance from "@/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";
import { Globe } from "lucide-react";
import EmptyState from "../common/EmptyState";
import PageControl from "../common/PageControl";
import { useState } from "react";

const PAGE_SIZE = 20;

const WebArticles = (): JSX.Element => {
  const [currentPage, setCurrentPage] = useState(1);

  const fetchTutorials = async () => {
    const response = await axiosInstance.get(
      `/tutorial?page=${currentPage}&page_size=${PAGE_SIZE}&filter_by=web`
    );
    return response;
  };

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["web-tutorials", currentPage],
    queryFn: fetchTutorials,
  });

  // Calculate totalPages from API response if available, else default to 1
  const totalCount = data?.data?.total || 0;
  const totalPages = totalCount > 0 ? Math.ceil(totalCount / PAGE_SIZE) : 1;

  const navigatePage = (direction: "next" | "prev") => {
    setCurrentPage((prevIndex) => {
      if (direction === "next") {
        return prevIndex < totalPages ? prevIndex + 1 : prevIndex;
      } else {
        return prevIndex > 1 ? prevIndex - 1 : prevIndex;
      }
    });
  };

  return (
    <main className="p-5">
      {isLoading || isRefetching ? (
        <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DuplicateLoader loader={<ResourceCardLoader />} />
        </div>
      ) : !data?.data?.data || data?.data?.data?.length < 1 ? (
        <EmptyState
          title="No web resource found"
          description="We couldn't find any web resource matching your search or filters. Try adjusting your criteria or check back later for new content."
          icon={<Globe className="w-12 h-12 text-purple-400 mx-auto" />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data?.data?.map((resource: any, index: any) => (
            <ResourceCard key={index} resource={resource} index={index} />
          ))}
        </div>
      )}
      <div className="mt-10">
        <PageControl
          currentPage={currentPage}
          totalPages={totalPages}
          onNavigate={navigatePage}
        />
      </div>
    </main>
  );
};

export default WebArticles;
