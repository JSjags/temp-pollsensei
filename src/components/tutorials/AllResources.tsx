import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios-instance";
import DuplicateLoader from "../common/DuplicateLoader";
import EmptyTableData from "../common/EmptyTableData";
import { ResourceCard, ResourceCardLoader } from "./components/ResourceCard";

const AllResources = (): JSX.Element => {
  const fetchTutorials = async () => {
    const response = await axiosInstance.get("/tutorial?page=1&page_size=20");
    return response;
  };

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["tutorials"],
    queryFn: fetchTutorials,
  });

  return (
    <main className="p-5 px-0">
      {isLoading || isRefetching ? (
        <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DuplicateLoader loader={<ResourceCardLoader />} />
        </div>
      ) : !data?.data || data?.data?.length < 1 ? (
        <EmptyTableData onRefectch={refetch} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {console.log(data)}
          {data?.data?.data?.map((resource: any, index: any) => (
            <ResourceCard key={index} resource={resource} index={index} />
          ))}
        </div>
      )}
    </main>
  );
};

export default AllResources;
