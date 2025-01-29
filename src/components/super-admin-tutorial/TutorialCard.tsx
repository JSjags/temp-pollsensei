"use client";
import React, { useState, useRef, useEffect } from "react";
import PageControl from "@/components/common/PageControl";
import {
  useAllTutorialsQuery,
  useDeleteTutorialMutation,
  useEditTutorialMutation,
  usePublishTutorialMutation,
  useUnpublishTutorialMutation,
} from "@/services/superadmin.service";
import Image from "next/image";
import { FadeLoader } from "react-spinners";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "../ui/sheet";
import { toast } from "react-toastify";
import DeleteFaq from "../superadmin-faqs/DeleteFaq";
import UnpublishFaq from "../superadmin-faqs/UnpublishFaq";
import PublishFaq from "../superadmin-faqs/Publish";
import { ChatBotIcon } from "../icons";

interface TutorialCardItemProps {
  type: string;
  title: string;
  description: string;
  media: any;
  _id: string;
  is_deleted?: boolean;
  is_published: boolean;
  index: number;
}

const TutorialCardItem: React.FC<TutorialCardItemProps> = ({
  type,
  title,
  description,
  media,
  _id,
  is_deleted,
  is_published,
  index,
}) => {
  const [dropdownIndex, setDropdownIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [edit, setEdit] = useState(false);
  const [publish, setPublish] = useState(false);
  const [unpublish, setUnpublish] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [deleteTutorial, { isLoading: isDeleteing }] =
    useDeleteTutorialMutation();
  const [unpublishTutorial, { isLoading: isUnpublishLoading }] =
    useUnpublishTutorialMutation();
  const [publishTutorial, { isLoading: isPublishLoading }] =
    usePublishTutorialMutation();
  // const { data: singleFAQs, isLoading: isLoadingAll } = useSingleFAQsQuery(_id);
  const [editTutorial, { isLoading: isEditLoading }] =
    useEditTutorialMutation();

  const options = ["Edit", is_published ? "Unpublish" : "Publish", "Delete"];

  const handleSelectOption = (option: string, index: number) => {
    setDropdownIndex((prevIndex) => (prevIndex === index ? null : index));
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

  const handleDeleteTutorial = async (id: any) => {
    try {
      await deleteTutorial(id).unwrap();
      toast.success("FAQ deleted successfully");
      handleCloseAll();
      // refetch();
    } catch (e) {
      console.log(e);
      toast.error("Error deleting FAQ");
    }
  };
  const handleUnpublishTutorial = async (id: any) => {
    try {
      await unpublishTutorial(id).unwrap();
      toast.success("FAQ unpublish successfully");
      handleCloseAll();
      // refetch();
    } catch (e) {
      console.log(e);
      toast.error("Error deleting FAQ");
    }
  };
  const handlePublishTutorial = async (id: any) => {
    try {
      await publishTutorial(id).unwrap();
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

  // useEffect(() => {
  //   if (singleFAQs) {
  //     setEdittingFaq({
  //       question: singleFAQs.data?.question || "",
  //       answer: singleFAQs.data?.answer || "",
  //     });
  //   }
  // }, [singleFAQs]);

  const handleSubmit = async () => {
    const editData = {
      question: editingFaq.question,
      answer: editingFaq.answer,
    };
    console.log(editData);
    try {
      await editTutorial(editData).unwrap();
      toast.success("FAQ updated successfully");
    } catch (err: any) {
      toast.error("Failed: " + err.message);
    }
  };

  const handleDeleteFaq = async (id: any) => {
    try {
      await deleteTutorial(id).unwrap();
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
      await unpublishTutorial(id).unwrap();
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
      await publishTutorial(id).unwrap();
      toast.success("FAQ deleted successfully");
      handleCloseAll();
      // refetch();
    } catch (e) {
      console.log(e);
      toast.error("Error deleting FAQ");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="relative flex flex-col bg-white shadow rounded-lg overflow-hidden">
          {/* Card Background */}
          <div className={`relative h-40 flex justify-center items-center`}>
            {media?.[0]?.type.includes("image") ? (
              <Image
                className="dark:invert"
                src={media[0]?.url}
                alt="Next.js logo"
                width={180}
                height={38}
                priority
              />
            ) : media?.[0]?.type.includes("video") ? (
              <video loop muted autoPlay className="w-full">
                <source src={media[0]?.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="w-full text-3xl md:text-4xl lg:text-5xl aspect-video flex items-center justify-between">
                <ChatBotIcon />
              </div>
            )}
          </div>

          {/* Card Content */}
          <div className="p-4 flex flex-col">
            <h3 className="text-sm font-medium text-gray-800">{title}</h3>
            <div className="w-full flex justify-between items-center">
              {media?.[0]?.type === "video/mp4" ? (
                <small>Watch Video</small>
              ) : (
                <small>Read article</small>
              )}
              <button
                onClick={() =>
                  setDropdownIndex((prevIndex) =>
                    prevIndex === index ? null : index
                  )
                }
                className="relative"
              >
                <BsThreeDotsVertical />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1"></p>
          </div>

          {/* Action Menu */}
          {dropdownIndex === index && (
            <div
              ref={dropdownRef}
              className="absolute top-12 right-4 bg-white shadow-md rounded-md w-40 py-2 z-10"
            >
              <ul>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  {options.map((op, id) => (
                    <p
                      key={id}
                      onClick={() => handleSelectOption(op, id)}
                      className={`${
                        op.toLowerCase() === "delete"
                          ? "text-[#FF3E3E]"
                          : "text-[#333333]"
                      } text-[14px] sm:text-[16px] cursor-pointer mb-2 sm:mb-3`}
                    >
                      {op}
                    </p>
                  ))}
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

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
                  onChange={(e) => {
                    setEdittingFaq({ ...editingFaq, question: e.target.value });
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
                  onChange={(e) => {
                    setEdittingFaq({ ...editingFaq, answer: e.target.value });
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

interface TutorialCard {
  items: TutorialCardItemProps[];
  isLoading: boolean;
  isError: boolean;
}

const TutorialCard: React.FC<TutorialCard> = ({
  items,
  isLoading,
  isError,
}) => {
  return (
    <div>
      {isLoading ? (
        <div className="text-center w-full">
          <span className="flex justify-center items-center">
            <FadeLoader height={10} radius={1} className="mt-3" />
          </span>
        </div>
      ) : isError ? (
        <div className="text-center w-full">
          <span className="flex justify-center items-center text-xs text-red-500">
            Something went wrong
          </span>
        </div>
      ) : (
        items?.map((item, index) => <TutorialCardItem key={index} {...item} />)
      )}
    </div>
  );
};
export default TutorialCard;
