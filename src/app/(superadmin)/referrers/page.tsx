"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ClipLoader, FadeLoader } from "react-spinners";

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
} from "react-icons/ri";
import CreateOrEditReferrerSheet from "./CreateOrEditReferrerSheet";
import { useRouter } from "next/navigation";
import DeleteSurvey from "@/components/survey/DeleteSurvey";
import { toast } from "react-toastify";
import useDebounce from "@/hooks/useDebouncer";
import Link from "next/link";

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
    <div className="p-6 bg-gray-50 min-h-screen w-full">
      <h1 className="text-sm font-bold mb-6">Referrers</h1>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 w-full  max-w-96">
          <input
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search Referrer ID, Code"
            className="py-2 px-4 border border-gray-300 outline-0 focus:border-purple-600 transition-all duration-300 rounded-full w-full max-w-96"
          />
          {isSearchLoading && <ClipLoader size={20} />}
        </div>

        <CreateOrEditReferrerSheet
          isVisible={isSheetVisible}
          onDone={() => {
            if (selecteRef) setSelectedRef(undefined);
          }}
          data={selecteRef}
          setVisibility={(value) => setSheetVisibility(value)}
        >
          <button
            type="button"
            className="flex  shrink-0 items-center gap-2 p-2 rounded px-4 bg-gradient-to-r hover:scale-105 transition-all duration-300 active:scale-95 from-[#5B03B2] to-[#9D50BB] text-white"
          >
            Create Referrer
          </button>
        </CreateOrEditReferrerSheet>
      </div>
      <div className="overflow-x-auto w-full">
        <table className="w-full border-collapse border-gray-200 overflow-x-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-sm">Name</th>
              {/* <th className="text-left py-3 px-4 font-medium text-sm">
                Account Type
              </th> */}
              <th className="text-left py-3 px-4 font-medium text-sm">Email</th>
              <th className="text-left py-3 px-4 font-medium text-sm">Code</th>
              <th className="text-left py-3 px-4 font-medium text-sm">Count</th>

              <th className="text-left py-3 px-4 font-medium text-sm">
                Date Created
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading || isRefetching || isSearchLoading ? (
              <tr>
                <td colSpan={6} className="text-center ">
                  <span className="flex justify-center items-center">
                    <FadeLoader height={10} radius={1} className="mt-3" />
                  </span>
                </td>
              </tr>
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
              <tr>
                <td colSpan={6} className="text-center ">
                  <span className="flex justify-center items-center text-xs text-red-500">
                    Something went wrong
                  </span>
                </td>
              </tr>
            ) : !data?.data?.data || data?.data?.data?.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center ">
                  <span className="flex justify-center items-center py-4 text-xs text-green-500">
                    No record found
                  </span>
                </td>
              </tr>
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
          </tbody>
        </table>
      </div>

      <div className="mt-6 sm:mt-8 flex justify-between items-center">
        <p className="text-xs font-medium">
          {totalItems > 0
            ? `Showing ${(currentPage - 1) * 20 + 1}-${Math.min(
                currentPage * 20,
                totalItems
              )} of ${totalItems}`
            : "No items to display"}
        </p>
        <PageControl
          currentPage={currentPage}
          totalPages={totalPages}
          onNavigate={navigatePage}
        />
      </div>

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

export default ReferralsPage;

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

  const handleView = () => {
    router?.push(userLink);
  };

  const actions = [
    {
      title: "View Users",
      icon: <RiArrowRightUpLine />,
      className: "",
      onClick: handleView,
    },
    {
      title: "Edit",
      onClick: onEditClick,
      icon: <RiEditBoxLine />,
      className: "",
    },
    {
      title: "Delete",
      onClick: onDeleteClick,
      icon: <RiDeleteBin5Line />,
      className: "!text-red-500",
    },
  ];

  return (
    <tr
      key={index}
      className={`text-xs ${
        index % 2 === 0 ? "bg-[#F7EEFED9]" : "bg-[#FEF5FED6]"
      } text-sm rounded-md`}
    >
      <td className="py-3 px-4 flex items-center gap-2">
        <Link
          href={userLink}
          className="block max-w-max hover:text-purple-500 transition-all duration-300 hover:scale-105 active:scale-95"
        >
          {data?.name}
        </Link>
      </td>

      <td className="py-3 px-4">{data?.email}</td>
      <td className="py-3 px-4">{data?.referral_code}</td>
      <td className="py-3 px-4">{data?.referrer_count ?? 0}</td>
      <td className="py-3 flex items-center gap-5 justify-between px-4">
        {formatDate(data?.createdAt)}

        <GenericRowPopover actions={actions}>
          <button
            className="flex-shrink-0 rounded border border-appLightGray300 p-2"
            type="button"
          >
            <RiMore2Fill className="text-xl" />
          </button>
        </GenericRowPopover>
      </td>
    </tr>
  );
}
