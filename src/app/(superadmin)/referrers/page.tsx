"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ClipLoader, FadeLoader } from "react-spinners";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/shadcn-input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";

import PageControl from "@/components/common/PageControl";
import GenericRowPopover from "@/components/custom/GenericRowPopover";
import { formatDate } from "@/lib/helpers";
import { handleApiErrors, isValidResponse } from "@/lib/utils";
import { queryKeys } from "@/services/api/constants.api";
import {
  deleteReferrer,
  getReferrerByIdOrCode,
  getReferrers,
} from "@/services/api/referrals.api";
import { IReferrer } from "@/types/api/referrals.types";
import {
  RiArrowRightUpLine,
  RiDeleteBin5Line,
  RiEditBoxLine,
  RiMore2Fill,
  RiAddLine,
} from "react-icons/ri";
import CreateOrEditReferrerSheet from "./CreateOrEditReferrerSheet";
import { useRouter } from "next/navigation";
import DeleteSurvey from "@/components/survey/DeleteSurvey";
import { toast } from "react-toastify";
import useDebounce from "@/hooks/useDebouncer";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

const ReferralsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isSheetVisible, setSheetVisibility] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selecteRef, setSelectedRef] = useState<IReferrer>();
  const queryClient = useQueryClient();
  const [searchValue, setSearchValue] = useState("");

  const debouncedSearchValue = useDebounce(searchValue, 700);

  const deleteReferrerAPI = useMutation({ mutationFn: deleteReferrer });

  const { data, isLoading, error, isRefetching } = useQuery({
    queryKey: [queryKeys.REFERRERS, currentPage],
    queryFn: async () => {
      const response = await getReferrers({ pageNumber: currentPage });
      if (isValidResponse(response)) {
        return response;
      } else {
        handleApiErrors(response);
        return null;
      }
    },
  });

  const { data: searchData, isLoading: isSearchLoading } = useQuery({
    queryKey: [queryKeys.REFERRERS, "search", debouncedSearchValue],
    queryFn: async () => {
      if (!debouncedSearchValue) {
        return null;
      }

      if (debouncedSearchValue?.length < 5) {
        toast?.warning("Search value must be minmum of 5 charcters");
        return null;
      }

      const response = await getReferrerByIdOrCode(debouncedSearchValue);
      if (isValidResponse(response)) {
        return response?.data;
      } else {
        handleApiErrors(response);
        return null;
      }
    },
    enabled: !!debouncedSearchValue,
  });

  const totalItems = data?.data?.total || 0;
  const totalPages = Math.ceil(totalItems / 20);

  const navigatePage = (direction: "next" | "prev") => {
    setCurrentPage((prevIndex) => {
      if (direction === "next") {
        return prevIndex < totalPages ? prevIndex + 1 : prevIndex;
      } else {
        return prevIndex > 1 ? prevIndex - 1 : prevIndex;
      }
    });
  };

  const handleDelete = async () => {
    if (!selecteRef?._id) return toast.warning("Invalid Id");

    const response = await deleteReferrerAPI?.mutateAsync(selecteRef?._id);

    if (isValidResponse(response)) {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.REFERRERS],
      });

      setSelectedRef(undefined);
      setShowDelete(false);
      toast.success(
        response?.data?.message ?? `Referrer deleted successfully.`
      );
    } else {
      handleApiErrors(response);
    }
  };

  return (
    <div className="p-0 min-h-screen w-full">
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold">Referrers</h1>
      </div>

      {/* <Card className="mb-6">
        <div className="p-0">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 relative">
              <Input
                type="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search Referrer ID, Code"
                className="w-full"
              />
              {isSearchLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <ClipLoader size={16} />
                </div>
              )}
            </div>
          </div>
        </div>
      </Card> */}

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Count</TableHead>
                <TableHead>Date Created</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading || isRefetching || isSearchLoading ? (
                Array.from({ length: 20 }).map((_, index) => (
                  <TableRowSkeleton key={index} />
                ))
              ) : !!searchData && debouncedSearchValue?.length > 5 ? (
                <ReferrerRow
                  data={searchData}
                  onEditClick={() => {
                    setSelectedRef(searchData);
                    setSheetVisibility(true);
                  }}
                  onDeleteClick={() => {
                    setSelectedRef(searchData);
                    setShowDelete(true);
                  }}
                  index={0}
                />
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-red-500">
                    Something went wrong
                  </TableCell>
                </TableRow>
              ) : !data?.data?.data || data?.data?.data?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground"
                  >
                    No record found
                  </TableCell>
                </TableRow>
              ) : (
                data?.data?.data?.map((data, index) => (
                  <ReferrerRow
                    data={data}
                    onEditClick={() => {
                      setSelectedRef(data);
                      setSheetVisibility(true);
                    }}
                    onDeleteClick={() => {
                      setSelectedRef(data);
                      setShowDelete(true);
                    }}
                    index={index}
                    key={index}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="p-4 mt-2 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground order-2 sm:order-1">
            {totalItems > 0
              ? `Showing ${(currentPage - 1) * 20 + 1}-${Math.min(
                  currentPage * 20,
                  totalItems
                )} of ${totalItems}`
              : "No items to display"}
          </p>
          <div className="order-1 sm:order-2">
            <PageControl
              currentPage={currentPage}
              totalPages={totalPages}
              onNavigate={navigatePage}
            />
          </div>
        </div>
      </Card>

      {showDelete && (
        <DeleteSurvey
          openModal={showDelete}
          isLoading={deleteReferrerAPI?.isPending}
          onClose={() => {
            setShowDelete(false);
            setSelectedRef(undefined);
          }}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

interface ReferrerRowProps {
  data: IReferrer;
  index: number;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

function ReferrerRow(props: ReferrerRowProps) {
  const router = useRouter();
  const { onEditClick, data, index, onDeleteClick } = props;
  const userLink = `/referrers/${data?._id}`;

  const handleView = () => router?.push(`${userLink}?name=${data?.name}`);

  return (
    <TableRow>
      <TableCell>
        <Link
          href={userLink}
          className="hover:text-primary font-semibold transition-colors duration-200"
        >
          {data?.name}
        </Link>
      </TableCell>
      <TableCell>{data?.email}</TableCell>
      <TableCell>
        <span className="bg-gray-200 rounded-full p-2 text-center font-semibold">
          {data?.referral_code}
        </span>
      </TableCell>
      <TableCell>{data?.referrer_count ?? 0}</TableCell>
      <TableCell>{formatDate(data?.createdAt)}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <RiMore2Fill className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleView}>
              <RiArrowRightUpLine className="mr-2" /> View Users
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

function TableRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-4 w-[140px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[180px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-8 w-[100px] rounded-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[40px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[120px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-8 w-8 rounded-full" />
      </TableCell>
    </TableRow>
  );
}

export default ReferralsPage;
