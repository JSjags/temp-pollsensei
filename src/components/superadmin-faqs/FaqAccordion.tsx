"use client";

import React, { useEffect, useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { Modal } from "./Modal";
import DeleteSurvey from "../survey/DeleteSurvey";
import DeleteFaq from "./DeleteFaq";
import { toast } from "react-toastify";
import {
  useSingleFAQsQuery,
  useDeleteFAQsMutation,
  useEditFAQsMutation,
  usePublishFAQsMutation,
  useUnpublishFAQsMutation,
} from "@/services/superadmin.service";
import UnpublishFaq from "./UnpublishFaq";
import PublishFaq from "./Publish";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "../ui/sheet";
import { useParams } from "next/navigation";
import { FadeLoader } from "react-spinners";

interface AccordionItemProps {
  question: string;
  answer: string;
  _id: string;
  is_deleted?: boolean;
  is_published: boolean;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  question,
  answer,
  _id,
  is_deleted,
  is_published,
}) => {
  const params = useParams()
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
  const { data:singleFAQs, isLoading:isLoadingAll, } = useSingleFAQsQuery(_id);
  const [editFAQs, { isLoading: isEditLoading }] = useEditFAQsMutation();

  const options = ["Edit", is_published ? "Unpublish" : "Publish", "Delete"];

  const toggleAccordion = () => setIsOpen(!isOpen);

  const handleSelectOption = (option: string) => {
    setShowMenu(false);
    const choice = option.toLowerCase();

    if (choice.includes("edit")) {
      setEdit(true);
    }
    if (choice.includes("Publish")) {
      setPublish(true);
    }
    if (choice.includes("unpublish")) {
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
      // refetch();
    } catch (e) {
      console.log(e);
      toast.error("Error deleting FAQ");
    }
  };
  const handleUnpublishFaq = async (id: any) => {
    try {
      await unpublishFAQs(id).unwrap();
      toast.success("FAQ unpublish successfully");
      handleCloseAll();
      // refetch();
    } catch (e) {
      console.log(e);
      toast.error("Error deleting FAQ");
    }
  };
  const handlePublishFaq = async (id: any) => {
    try {
      await publishFAQs(id).unwrap();
      toast.success("FAQ deleted successfully");
      handleCloseAll();
      // refetch();
    } catch (e) {
      console.log(e);
      toast.error("Error deleting FAQ");
    }
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

  const handleSubmit = async () => {
   
    const editData = {
      question: editingFaq.question,
      answer: editingFaq.answer,
  }
  console.log(editData);
    try {
      await editFAQs(editData).unwrap();
      toast.success("FAQ updated successfully");
    } catch (err: any) {
      toast.error("Failed: " + err.message);
    }
  };

  console.log(_id)
  console.log(singleFAQs)

  return (
    <div className="relative border border-gray-300 rounded-lg mb-4 shadow-sm w-full">
      <div
        className="flex justify-between items-center p-4 cursor-pointer"
        onClick={toggleAccordion}
      >
        <div className="flex items-center gap-4">
          <button
            className="p-2 text-gray-600 rounded-full hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu((prev) => !prev);
            }}
          >
            <HiDotsVertical size={18} />
          </button>
          {showMenu && (
            <div className="absolute left-4 sm:right-8 top-12 sm:top-16 z-50 w-[180px] sm:w-[210px] rounded-[8px] py-[20px] sm:py-[24px] px-[30px] sm:px-[40px] border border-border/50 bg-white shadow-lg">
              <div className="flex flex-col justify-between h-full">
                {options.map((op, id) => (
                  <p
                    key={id}
                    onClick={() => handleSelectOption(op)}
                    className={`${
                      op.toLowerCase() === "delete"
                        ? "text-[#FF3E3E]"
                        : "text-[#333333]"
                    } text-[14px] sm:text-[16px] cursor-pointer mb-2 sm:mb-3`}
                  >
                    {op}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex-1 text-gray-800 font-semibold text-sm">
          {question}
        </div>
        <button className="p-2 text-gray-600 rounded-full hover:bg-gray-100">
          {isOpen ? <FiChevronDown size={18} /> : <FiChevronRight size={18} />}
        </button>
      </div>
      {isOpen && (
        <div className="p-4 bg-gray-50 text-gray-600 text-sm">{answer}</div>
      )}
      {showDelete && (
        <DeleteFaq
          openModal={showDelete}
          onClose={handleCloseAll}
          onDelete={() => handleDeleteFaq(_id)}
          isLoading={isDeleteing}
        />
      )}
      {unpublish && (
        <UnpublishFaq
          openModal={unpublish}
          onClose={handleCloseAll}
          onDelete={() => handleUnpublishFaq(_id)}
          isLoading={isUnpublishLoading}
        />
      )}
      {publish && (
        <PublishFaq
          openModal={publish}
          onClose={handleCloseAll}
          onDelete={() => handlePublishFaq(_id)}
          isLoading={isPublishLoading}
        />
      )}
      {edit && (
        <Sheet open={edit} onOpenChange={setEdit}>
          <SheetContent
            side="right"
            className="w-full md:w-1/3 bg-white flex flex-col gap-5"
          >
            <SheetHeader>
              <SheetTitle>Edit FAQ</SheetTitle>
            </SheetHeader>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question
                </label>
                <input
                  type="text"
                  placeholder="Enter Title"
                  className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  value={editingFaq.question}
                  onChange={(e)=>{
                    setEdittingFaq({...editingFaq, question: e.target.value });
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Answer
                </label>
                <textarea
                  placeholder="Type brief description"
                  rows={4}
                  className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  value={editingFaq.answer}
                  onChange={(e)=>{
                    setEdittingFaq({...editingFaq, answer: e.target.value });
                  }}
                />
              </div>
              <div className="flex items-center justify-end space-x-4 w-full">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">
                  Cancel
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-400 rounded-md hover:shadow-lg">
                  {isEditLoading ? "Waiting..." : "Save and Continue"}
                </button>
              </div>
            </form>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};

interface AccordionProps {
  items: AccordionItemProps[];
  isLoading:boolean,
  isError:boolean,
}

const FaqAccordion: React.FC<AccordionProps> = ({ items, isLoading, isError }) => {
  return (
    <div className="w-full">
      {
         isLoading ? (
         
            <div className="text-center w-full">
              <span className="flex justify-center items-center" >
              <FadeLoader height={10} radius={1} className="mt-3" />
              </span>
            </div>
         
        ) : isError ? (
         
            <div className="text-center w-full">
              <span className="flex justify-center items-center text-xs text-red-500" >
              Something went wrong
              </span>
            </div>
         
        ) :
      items?.map((item, index) => (
        <AccordionItem key={index} {...item} />
      ))}
    </div>
  );
};

export default FaqAccordion;
