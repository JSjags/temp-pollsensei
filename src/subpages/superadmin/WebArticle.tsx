"use client";

import PageControl from "@/components/common/PageControl";
import { 
  useAllTutorialsQuery,
  useDeleteTutorialMutation,
  useEditTutorialMutation,
  usePreviewTutorialQuery,
  usePublishTutorialMutation,
  useUnpublishTutorialMutation,
 } from "@/services/superadmin.service";
 import React, { useState, useRef, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { ClipLoader, FadeLoader } from "react-spinners";
import { BsThreeDotsVertical } from "react-icons/bs";
import { toast } from "react-toastify";
import DeleteFaq from "@/components/superadmin-faqs/DeleteFaq";
import UnpublishFaq from "@/components/superadmin-faqs/UnpublishFaq";
import PublishFaq from "@/components/superadmin-faqs/Publish";
import { Modal } from "@/components/superadmin-faqs/Modal";
import { FaFileUpload } from "react-icons/fa";
import { cn } from "@/lib/utils";



const WebArticle = () => {
  
    const [currentPage, setCurrentPage] = useState(1);
    const [dropdownIndex, setDropdownIndex] = useState<number | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const [preview, setPreview] = useState(false);
    const [edit, setEdit] = useState(false);
    const [publish, setPublish] = useState(false);
    const [unpublish, setUnpublish] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [_id, set_Id] = useState("");
    const [deleteTutorial, { isLoading: isDeleteing }] =
      useDeleteTutorialMutation();
    const [unpublishTutorial, { isLoading: isUnpublishLoading }] =
      useUnpublishTutorialMutation();
    const [publishTutorial, { isLoading: isPublishLoading }] =
      usePublishTutorialMutation();
    const { data: previewTutorial, isLoading: isLoadingAll } =
      usePreviewTutorialQuery(_id, { skip: _id ? false : true });
    const [editTutorial, { isLoading: isEditLoading }] =
      useEditTutorialMutation();
  
    // const options = ["Edit", is_published ? "Unpublish" : "Publish", "Delete"];
  
    const [formData, setFormData] = useState<{
      type: string;
      title: string;
      description: string;
      links: string;
      file: File | null;
    }>({
      type: "image",
      title: "",
      description: "",
      links: "",
      file: null,
    });
  
    const handleChange = (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };
  
    const [fileName, setFileName] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
  
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const droppedFile = event.dataTransfer.files[0];
      if (droppedFile) {
        setFileName(droppedFile.name);
        setFile(droppedFile);
      }
    };
  
    const preventDefaults = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
    };
  
    // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //   const file = e.target.files?.[0] || null;
    //   setFormData((prevData) => ({
    //     ...prevData,
    //     file,
    //   }));
    // };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      setFormData((prevData) => ({
          ...prevData,
          file, 
      }));
      setFileName(file?.name || null); 
  };
  
  
    const handleSubmit = async () => {
      const editFormData = new FormData();
      editFormData.append("type", formData.type);
      editFormData.append("title", formData.title);
      editFormData.append("description", formData.description);
      editFormData.append("links", formData.links);
      if (formData.links) {
        editFormData.append("links", formData.links);
      }
      if (formData.file) {
        editFormData.append("file", formData.file);
      } else {
        toast.error("Please upload a file to proceed.");
        return;
      }
      console.log(editFormData);
      try {
        await editTutorial({id:_id, body:editFormData}).unwrap();
        toast.success("Tutorial created successfully");
        setEdit(false);
      } catch (err: any) {
        toast.error(
          "Failed to create tutorial " + (err?.data?.message || err.message)
        );
        console.error("Failed to create tutorial", err);
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
  const { data, isLoading, isError, refetch } = useAllTutorialsQuery({
    pagesNumber: currentPage,
    filter_by:"web"
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
    refetch();
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
  
    useEffect(() => {
      if (previewTutorial?.data) {
          setFormData({
              type: previewTutorial.data.type || "image",
              title: previewTutorial.data.title || "",
              description: previewTutorial.data.description || "",
              links: previewTutorial.data.links || "",
              file: null, // Files are not retrieved from the server
          });
      }
  }, [previewTutorial]);

  console.log(data);
  console.log(currentPage);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="text-center flex justify-center items-center w-full">
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
          data?.data?.data.map((card: any, index: number) => (
            <div
              key={index}
              className="relative flex flex-col bg-white shadow rounded-lg overflow-hidden"
            >
              {/* Card Background */}
              <div className={`relative h-40 flex justify-center items-center`}>
                {card.media[0].type.includes("image") ? (
                  <Image
                    className="dark:invert"
                    src={card?.media[0]?.url}
                    alt="Next.js logo"
                    width={180}
                    height={38}
                    priority
                  />
                ) : (
                  <video loop muted autoPlay className="w-full">
                    <source src={card?.media[0]?.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>

              {/* Card Content */}
              <div className="p-4 flex flex-col">
                <h3 className="text-sm font-medium text-gray-800">
                  {card?.title}
                </h3>
                <div className="w-full flex justify-between items-center">
                  {card.media[0].type.includes("image") && (
                    <small>Read article</small>
                  )}
                  {card.media[0].type === "video/mp4" && (
                    <small>Watch Video</small>
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
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setPreview(true);
                        set_Id(card?._id);
                      }}
                    >
                      Preview
                    </li>

                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setEdit(true);
                        set_Id(card?._id);
                      }}
                    >
                      Edit
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => setUnpublish(true)}
                    >
                      Unpublish
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
                      onClick={() => setShowDelete(true)}
                    >
                      Delete
                    </li>
                  </ul>
                </div>
              )}

              {preview && (
                <Modal
                  size="w-[60%]"
                  onClose={() => {
                    setPreview(false);
                    set_Id("");
                  }}
                >
                  {isLoadingAll && "Loading..."}

                  {previewTutorial?.data && (
                    <div className="max-h-[60vh] overflow-y-auto custom-scrollbar ">
                      <div className="flex flex-col gap-4">
                        <h2 className="text-center text-2xl font-bold">
                          {previewTutorial?.data?.title}
                        </h2>
                        <div
                          className={`relative flex justify-center items-center`}
                        >
                          {previewTutorial?.data?.media[0].type.includes(
                            "image"
                          ) ? (
                            <Image
                              className="dark:invert"
                              src={previewTutorial?.data?.media[0]?.url}
                              alt={previewTutorial?.data?.title}
                              width={700}
                              height={300}
                            />
                          ) : (
                            <video loop muted autoPlay className="w-full">
                              <source
                                src={previewTutorial?.data?.media[0]?.url}
                                type="video/mp4"
                              />
                              Your browser does not support the video tag.
                            </video>
                          )}
                        </div>
                      </div>
                      <div className="px-10 py-4">
                        <p className="">{previewTutorial?.data?.description}</p>
                      </div>
                    </div>
                  )}
                </Modal>
              )}

              {showDelete && (
                <DeleteFaq
                  openModal={showDelete}
                  onClose={handleCloseAll}
                  onDelete={() => handleDeleteTutorial(card?._id)}
                  isLoading={isDeleteing}
                />
              )}
              {unpublish && (
                <UnpublishFaq
                  openModal={unpublish}
                  onClose={handleCloseAll}
                  onDelete={() => handleUnpublishTutorial(card?._id)}
                  isLoading={isUnpublishLoading}
                />
              )}
              {publish && (
                <PublishFaq
                  openModal={publish}
                  onClose={handleCloseAll}
                  onDelete={() => handlePublishTutorial(card?._id)}
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
                      <SheetTitle>Edit Tutorial</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                      {isLoadingAll && "Loading..."}
                      {
                        previewTutorial && <>

                        <div>
                          <select
                            className={cn(
                              "auth-input focus:outline-purple-800 focus:ring-focus focus:ring-1 font-sans border border-border text-foreground w-full placeholder:text-foreground/40"
                            )}
                            name="type"
                            id="type"
                          >
                            <option value="">{formData.type}</option>
                            {[
                              { value: "video", label: "Video" },
                              { value: "image", label: "Image" },
                              { value: "Link", label: "Link" },
                            ].map((option: any) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title
                          </label>
                          <input
                            type="text"
                            placeholder="Enter Title"
                            className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            value={formData.title}
                            onChange={handleChange}
                            name="title"
                            id="title"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                          </label>
                          <textarea
                            placeholder="Type brief description"
                            rows={4}
                            className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            value={formData.description}
                            onChange={handleChange}
                            name="description"
                            id="description"
                          />
                        </div>

                        <div
                          onDrop={handleDrop}
                          onDragOver={preventDefaults}
                          onDragEnter={preventDefaults}
                          className="flex flex-col items-center justify-center w-full h-32 cursor-pointer bg-gray-50 hover:bg-gray-100 rounded-lg"
                        >
                          <div className="flex flex-col items-center">
                            <FaFileUpload size={24} />
                            <p className="text-gray-500 mt-2">
                              {fileName ||
                                "Select a file or drag and drop here"}
                            </p>
                            <p className="text-sm text-gray-400">
                              MP4, MOV, MKV, file size no more than 50MB
                            </p>
                          </div>
                          <input
                            type="file"
                            id="fileUpload"
                            name="fileUpload"
                            accept=".mp4, .mov, .mkv, .jpg, .jpeg, .png"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                          <label
                            htmlFor="fileUpload"
                            className="border border-purple-800 py-1 px-4 rounded-full mt-3"
                          >
                            Select file
                          </label>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Links
                          </label>
                          <input
                            type="text"
                            placeholder="Enter Title"
                            className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            value={formData.links}
                            onChange={handleChange}
                            name="links"
                            id="links"
                          />
                        </div>
                        <div className="flex items-center justify-end space-x-4 w-full">
                          <button className="px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100" type="button">
                            Cancel
                          </button>
                          <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-400 rounded-md hover:shadow-lg" type="submit">
                            {isEditLoading ? "Waiting..." : "Save and Continue"}
                          </button>
                        </div>
                        </>
                      }
                      </form>
                    </div>
                  </SheetContent>
                </Sheet>
              )}
            </div>
          ))
        )}
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
    </div>
  );
};

export default WebArticle;
