import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import {
  ArrowLeft,
  Trash2,
  MoreVertical,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axios-instance";
import { formatDate } from "@/lib/helpers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

interface DraftsListProps {
  onBack: () => void;
}

interface DraftResponse {
  data: Draft[];
  total: number;
  page: number;
  page_size: number;
}

interface Draft {
  _id: string;
  topic: string;
  description: string;
  createdAt: string;
  status: string;
}

const DraftsList = ({ onBack }: DraftsListProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const {
    data: draftsResponse,
    isLoading,
    isFetching,
  } = useQuery<DraftResponse>({
    queryKey: ["get-drafts", currentPage],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/progress?page=${currentPage}&page_size=${pageSize}`
      );
      return response.data;
    },
  });

  const { mutate: deleteDraft } = useMutation({
    mutationFn: async (id: string) => {
      return await axiosInstance.delete(`/progress/${id}`);
    },
    onSuccess: () => {
      toast.success("Draft deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["get-drafts"],
      });
    },
    onError: () => {
      toast.error("Failed to delete draft");
    },
  });

  const handleDelete = (id: string) => {
    deleteDraft(id);
  };

  const totalPages = draftsResponse
    ? Math.ceil(draftsResponse.total / pageSize)
    : 0;

  const DraftCard = ({ draft }: { draft: Draft }) => (
    <div className="bg-white relative rounded-[12px] p-3 sm:p-4 border-[1px] w-full max-w-[413px] h-auto transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-purple-400">
      <div>
        <div className="flex justify-between items-center mb-1 gap-2">
          <h3 className="text-[16px] sm:text-[20px] text-[#333333] truncate">
            {draft.topic || "Untitled Survey"}
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <MoreVertical className="h-5 w-5 text-gray-500 hover:text-purple-600 transition-colors duration-200" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => handleDelete(draft._id)}
                className="gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-[12px] sm:text-[14px] text-[#838383]">
          Created: {formatDate(draft.createdAt)}
        </p>
      </div>

      <div className="mt-3 sm:mt-4">
        <div className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700 transition-all duration-200 hover:bg-gray-200 hover:scale-105">
          {draft.status}
        </div>
      </div>

      <div className="mt-6">
        <p className="text-gray-500 text-sm line-clamp-2 min-h-10">
          {draft.description || "No description"}
        </p>
      </div>

      <div className="mt-6">
        <Button
          onClick={() => router.push(`/surveys/edit-draft-survey/${draft._id}`)}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-all duration-200 group rounded-lg"
        >
          <span className="flex items-center justify-center gap-2">
            <span>Continue editing</span>
            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
          </span>
        </Button>
      </div>
    </div>
  );

  const DraftCardSkeleton = () => (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-2">
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
      <Skeleton className="h-4 w-36 mb-4" />
      <Skeleton className="h-6 w-20 rounded-full mb-6" />
      <Skeleton className="h-4 w-full mb-6" />
      <Skeleton className="h-10 w-full rounded-lg" />
    </Card>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="container px-4 sm:px-6 lg:px-8 pb-2 my-6 sm:my-10"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="group hover:bg-purple-50"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Surveys
          </Button>
          <h2 className="text-2xl font-bold text-gray-800">Draft Surveys</h2>
        </div>
      </div>

      {isLoading || isFetching ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <DraftCardSkeleton />
              </motion.div>
            ))}
        </div>
      ) : draftsResponse?.data.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Draft Surveys
          </h3>
          <p className="text-gray-500">
            You don't have any surveys saved as drafts.
          </p>
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {draftsResponse?.data.map((draft, index) => (
                <motion.div
                  key={draft._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <DraftCard draft={draft} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default DraftsList;
