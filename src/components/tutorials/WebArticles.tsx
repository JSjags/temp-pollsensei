import { handleApiErrors, isValidResponse } from "@/lib/utils";
import { getTutorials } from "@/services/api/tutorial";
import { useQuery } from "@tanstack/react-query";
import DuplicateLoader from "../common/DuplicateLoader";
import EmptyTableData from "../common/EmptyTableData";
import { ResourceCardLoader, ResourceCard } from "./components/ResourceCard";

const WebArticles = (): JSX.Element => {
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["getAllWebArticles"],
    queryFn: async () => {
      const response = await getTutorials("web");
      if (isValidResponse(response)) {
        return response?.data;
      } else {
        handleApiErrors(response);
        return null;
      }
    },
  });

  return (
    <main className="p-5">
      {isLoading || isRefetching ? (
        <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DuplicateLoader loader={<ResourceCardLoader />} />
        </div>
      ) : !data?.data || data?.data?.length < 1 ? (
        <EmptyTableData onRefectch={refetch} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data.map((resource, index) => (
            <ResourceCard key={index} resource={resource} index={index} />
          ))}
        </div>
      )}
    </main>
  );
};

export default WebArticles;
