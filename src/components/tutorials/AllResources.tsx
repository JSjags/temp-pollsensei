import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios-instance";
import DuplicateLoader from "../common/DuplicateLoader";
import EmptyTableData from "../common/EmptyTableData";
import { ResourceCard, ResourceCardLoader } from "./components/ResourceCard";
import EmptyState from "../common/EmptyState";
import { LibraryBigIcon } from "lucide-react";
import PageControl from "../common/PageControl";
import { useState } from "react";

const PAGE_SIZE = 20;

const AllResources = (): JSX.Element => {
  const [currentPage, setCurrentPage] = useState(1);

  const fetchTutorials = async ({ queryKey }: { queryKey: any[] }) => {
    const [_key, page] = queryKey;
    const response = await axiosInstance.get(
      `/tutorial?page=${page}&page_size=${PAGE_SIZE}`
    );
    return response;
  };

  const navigatePage = (direction: "next" | "prev") => {
    setCurrentPage((prevIndex) => {
      if (direction === "next") {
        return prevIndex < totalPages ? prevIndex + 1 : prevIndex;
      } else {
        return prevIndex > 1 ? prevIndex - 1 : prevIndex;
      }
    });
  };

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["tutorials", currentPage],
    queryFn: fetchTutorials,
    // keepPreviousData: true,
  });

  // Extract pagination info
  const totalItems = data?.data?.total || 0;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  return (
    <main className="p-5 px-0">
      {isLoading || isRefetching ? (
        <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DuplicateLoader loader={<ResourceCardLoader />} />
        </div>
      ) : !data?.data?.data || data?.data?.data?.length < 1 ? (
        <EmptyState
          title="No resources found"
          description="We couldn't find any resources matching your search or filters. Try adjusting your criteria or check back later for new content."
          icon={
            <LibraryBigIcon className="w-12 h-12 text-purple-400 mx-auto" />
          }
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
          onPageChange={(page) => {
            setCurrentPage(page);
          }}
        />
      </div>
    </main>
  );
};

export default AllResources;
