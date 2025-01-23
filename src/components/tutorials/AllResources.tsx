import { useGetTutorials } from "@/hooks/useGetRequests";
import DuplicateLoader from "../common/DuplicateLoader";
import EmptyTableData from "../common/EmptyTableData";
import { ResourceCard, ResourceCardLoader } from "./components/ResourceCard";

const AllResources = (): JSX.Element => {
  const { data, isLoading, refetch, isRefetching } = useGetTutorials({});

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

export default AllResources;
