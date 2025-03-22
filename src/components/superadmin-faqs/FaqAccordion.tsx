"use client";

import React, { useEffect, useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { toast } from "react-toastify";
import {
  useSingleFAQsQuery,
  useDeleteFAQsMutation,
  useEditFAQsMutation,
  usePublishFAQsMutation,
  useUnpublishFAQsMutation,
  surveyApiSlice,
  useAllFAQsQuery,
} from "@/services/superadmin.service";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Input } from "../ui/shadcn-input";
import { Textarea } from "../ui/shadcn-textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { useParams } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import { Pencil, Trash2, EyeOff, Eye } from "lucide-react";
import { Badge } from "../ui/badge";
import { useDispatch } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios-instance";

interface AccordionItemProps {
  question: string;
  answer: string;
  _id: string;
  is_deleted?: boolean;
  is_published: boolean;
  currentPage: number;
  refetch: any;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  question,
  answer,
  _id,
  is_deleted,
  is_published,
  currentPage,
  refetch,
}) => {
  const params = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [edit, setEdit] = useState(false);
  const [publish, setPublish] = useState(false);
  const [unpublish, setUnpublish] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteFAQs, { isLoading: isDeleteing }] = useDeleteFAQsMutation();
  const [unpublishFAQs, { isLoading: isUnpublishLoading }] =
    useUnpublishFAQsMutation();
  const [publishFAQs, { isLoading: isPublishLoading }] =
    usePublishFAQsMutation();
  const { data: singleFAQs, isLoading: isLoadingAll } = useSingleFAQsQuery(_id);
  const [editFAQs, { isLoading: isEditLoading }] = useEditFAQsMutation();
  // const { refetch } = useAllFAQsQuery({ pagesNumber: currentPage });
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const options = ["Edit", is_published ? "Unpublish" : "Publish", "Delete"];

  const toggleAccordion = () => setIsOpen(!isOpen);

  const handleSelectOption = (option: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    const choice = option.toLowerCase();

    if (choice.includes("edit")) {
      setEdit(true);
    }
    if (choice === "publish") {
      setPublish(true);
    }
    if (choice === "unpublish") {
      setUnpublish(true);
    }
    if (choice.includes("delete")) {
      setShowDelete(true);
    }
  };

  const handleCloseAll = () => {
    setEdit(false);
    setPublish(false);
    setUnpublish(false);
    setShowDelete(false);
  };

  const handleDeleteFaq = async (id: any) => {
    try {
      await deleteFAQs(id).unwrap();
      toast.success("FAQ deleted successfully");
      handleCloseAll();
      refetch();
    } catch (e) {
      console.log(e);
      toast.error("Error deleting FAQ");
    }
  };

  const publishMutation = useMutation({
    mutationFn: (id: string) =>
      axiosInstance.patch(`/superadmin/faq-status/${id}?status=publish`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      refetch();
      toast.success("FAQ published successfully");
      handleCloseAll();
    },
    onError: () => {
      toast.error("Error publishing FAQ");
    },
  });

  const unpublishMutation = useMutation({
    mutationFn: (id: string) =>
      axiosInstance.patch(`/superadmin/faq-status/${id}?status=unpublish`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      refetch();
      toast.success("FAQ unpublished successfully");
      handleCloseAll();
    },
    onError: () => {
      toast.error("Error unpublishing FAQ");
    },
  });

  const handleUnpublishFaq = async (id: string) => {
    unpublishMutation.mutate(id);
  };

  const handlePublishFaq = async (id: string) => {
    publishMutation.mutate(id);
  };

  const [editingFaq, setEdittingFaq] = useState({
    question: "",
    answer: "",
  });

  useEffect(() => {
    if (singleFAQs) {
      setEdittingFaq({
        question: singleFAQs.data?.question || "",
        answer: singleFAQs.data?.answer || "",
      });
    }
  }, [singleFAQs]);

  const handleSubmit = async (id: string) => {
    const editData = {
      question: editingFaq.question,
      answer: editingFaq.answer,
    };
    console.log(editData);
    try {
      await editFAQs({ id, body: editData }).unwrap();
      toast.success("FAQ updated successfully");
      refetch();
    } catch (err: any) {
      toast.error("Failed: " + err.message);
    } finally {
      setEdit(false);
    }
  };

  console.log(_id);
  console.log(singleFAQs);

  return (
    <div className="relative border border-gray-200 rounded-xl mb-4 shadow-sm w-full hover:shadow-md transition-all duration-200 ease-in-out overflow-hidden bg-white">
      <div
        className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50/50 transition-colors duration-200"
        onClick={toggleAccordion}
      >
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100 transition-colors duration-200"
              >
                <HiDotsVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="animate-in slide-in-from-top-1 duration-200"
            >
              <DropdownMenuItem
                onClick={(e) => handleSelectOption("Edit", e)}
                className="transition-colors duration-200 gap-2"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) =>
                  handleSelectOption(is_published ? "Unpublish" : "Publish", e)
                }
                className="transition-colors duration-200 gap-2"
              >
                {is_published ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                {is_published ? "Unpublish" : "Publish"}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 transition-colors duration-200 gap-2"
                onClick={(e) => handleSelectOption("Delete", e)}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex-1 flex items-center gap-3">
          <div className="text-gray-800 font-medium">{question}</div>
          <Badge
            variant="outline"
            className={`
              ${
                is_published
                  ? "border-green-500 text-green-700 bg-green-50"
                  : "border-orange-500 text-orange-700 bg-orange-50"
              } text-xs font-medium`}
          >
            {is_published ? "Published" : "Draft"}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-2 transition-transform duration-200"
        >
          <div
            className={`transform transition-transform duration-200 ${
              isOpen ? "rotate-90" : "rotate-0"
            }`}
          >
            <FiChevronRight className="h-4 w-4" />
          </div>
        </Button>
      </div>
      <div
        className={`transform transition-all duration-200 ease-in-out ${
          isOpen ? "opacity-100 max-h-[500px]" : "opacity-0 max-h-0"
        }`}
      >
        <div className="p-4 bg-gray-50 text-gray-600 border-t">{answer}</div>
      </div>

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent className="animate-in zoom-in-90 duration-200">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              FAQ.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => handleDeleteFaq(_id)}
            >
              {isDeleteing ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Unpublish Dialog */}
      <AlertDialog open={unpublish} onOpenChange={setUnpublish}>
        <AlertDialogContent className="animate-in zoom-in-90 duration-200">
          <AlertDialogHeader>
            <AlertDialogTitle>Unpublish FAQ</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unpublish this FAQ? It will no longer be
              visible to users.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseAll}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-orange-600 hover:bg-orange-700"
              onClick={() => handleUnpublishFaq(_id)}
            >
              {unpublishMutation.isPending ? "Unpublishing..." : "Unpublish"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Publish Dialog */}
      <AlertDialog open={publish} onOpenChange={setPublish}>
        <AlertDialogContent className="animate-in zoom-in-90 duration-200">
          <AlertDialogHeader>
            <AlertDialogTitle>Publish FAQ</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to publish this FAQ? It will be visible to
              all users.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseAll}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-green-600 hover:bg-green-700"
              onClick={() => handlePublishFaq(_id)}
            >
              {publishMutation.isPending ? "Publishing..." : "Publish"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Sheet open={edit} onOpenChange={setEdit}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-lg animate-in slide-in-from-right duration-300"
        >
          <SheetHeader>
            <SheetTitle>Edit FAQ</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Question</label>
              <Input
                placeholder="Enter question"
                value={editingFaq.question}
                onChange={(e) =>
                  setEdittingFaq({ ...editingFaq, question: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Answer</label>
              <Textarea
                placeholder="Enter answer"
                rows={4}
                value={editingFaq.answer}
                onChange={(e) =>
                  setEdittingFaq({ ...editingFaq, answer: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEdit(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => handleSubmit(_id)}
                disabled={isEditLoading}
                className="bg-gradient-to-r from-[#5B03B2] to-[#9D50BB]"
              >
                {isEditLoading ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

interface AccordionProps {
  items: AccordionItemProps[];
  isLoading: boolean;
  isError: boolean;
  currentPage: number;
  refetch: any;
}

const FaqAccordion: React.FC<AccordionProps> = ({
  items,
  isLoading,
  isError,
  currentPage,
  refetch,
}) => {
  return (
    <div className="w-full space-y-2">
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-xl p-4 space-y-3 bg-white"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
              <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center w-full p-8 rounded-xl bg-red-50 border border-red-100">
          <span className="flex justify-center items-center text-xs text-red-500">
            Something went wrong
          </span>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center w-full p-8 rounded-xl bg-gray-50 border border-gray-100">
          <div className="flex flex-col items-center gap-2">
            <div className="text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5h.01v.01H12V17Z" />
              </svg>
            </div>
            <p className="text-sm text-gray-600">No FAQs found</p>
            <p className="text-xs text-gray-400">
              Create a new FAQ to get started
            </p>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in duration-500">
          {items?.map((item, index) => (
            <AccordionItem
              key={index}
              {...item}
              currentPage={currentPage}
              refetch={refetch}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FaqAccordion;
