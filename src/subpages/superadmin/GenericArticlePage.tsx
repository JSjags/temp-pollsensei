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
import React, {
  useState,
  useRef,
  useEffect,
  SetStateAction,
  Dispatch,
} from "react";
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
import { FaFileUpload } from "react-icons/fa";
import { cn } from "@/lib/utils";
import {
  apiConstantOptions,
  queryKeys,
  TUTORIAL_ENUM,
} from "@/services/api/constants.api";
import { useGetTutorials } from "@/hooks/useGetRequests";
import { useQueryClient, UseQueryResult } from "@tanstack/react-query";
import AppReactQuill from "@/components/common/forms/AppReactQuill";
import AppCollapse from "@/components/custom/AppCollapse";
import { GetTutorials } from "@/types/api/tutorials.types";
import { ChatBotIcon } from "@/components/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, Pencil, Ban, Trash2, MoreVertical } from "lucide-react";
import { PlayCircle, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/shadcn-input";
import { Textarea } from "@/components/ui/shadcn-textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface Props {
  pageValue: UseQueryResult<GetTutorials | null, Error>;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}

const CardSkeleton = () => (
  <div className="bg-white rounded-lg overflow-hidden shadow-sm">
    <Skeleton className="w-full h-[200px]" />
    <div className="p-4">
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-1/4" />
    </div>
  </div>
);

const EditSheetSkeleton = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-10 w-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-32 w-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-32 w-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-10 w-full" />
    </div>
    <Skeleton className="h-64 w-full" />
  </div>
);

const GenericArticlePage = (props: Props) => {
  const {
    currentPage,
    setCurrentPage,
    pageValue: { data, isLoading, isError, isRefetching },
  } = props;

  const [dropdownIndex, setDropdownIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [preview, setPreview] = useState(false);
  const [edit, setEdit] = useState(false);
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
  const queryClient = useQueryClient();
  const [quilValue, setQuilValue] = useState("");
  const [selectedCardId, setSelectedCardId] = useState<string>("");
  const [selectedTutorial, setSelectedTutorial] = useState<any>(null);
  const [confirmationDialog, setConfirmationDialog] = useState<{
    isOpen: boolean;
    type: "publish" | "unpublish" | "delete";
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: "delete",
    title: "",
    message: "",
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const editFormData = new FormData();
    editFormData.append("type", formData.type);
    editFormData.append("title", formData.title);
    editFormData.append("description", formData.description);

    if (formData.links) {
      editFormData.append("links", formData.links);
    }
    if (formData.file) {
      editFormData.append("file", formData.file);
    }
    console.log(editFormData);
    try {
      await editTutorial({ id: _id, body: editFormData }).unwrap();
      toast.success("Tutorial edited successfully");
      setEdit(false);
      await queryClient.invalidateQueries({ queryKey: [queryKeys.TUTORIALS] });
    } catch (err: any) {
      toast.error(
        "Failed to edit tutorial " + (err?.data?.message || err.message)
      );
    }
  };

  const handleDelete = async (id: string) => {
    setSelectedTutorial(id);
    setConfirmationDialog({
      isOpen: true,
      type: "delete",
      title: "Delete Tutorial",
      message:
        "Are you sure you want to delete this tutorial? This action cannot be undone.",
    });
  };

  const handlePublish = async (id: string) => {
    setSelectedTutorial(id);
    setConfirmationDialog({
      isOpen: true,
      type: "publish",
      title: "Publish Tutorial",
      message:
        "Are you sure you want to publish this tutorial? It will be visible to all users.",
    });
  };

  const handleUnpublish = async (id: string) => {
    setSelectedTutorial(id);
    setConfirmationDialog({
      isOpen: true,
      type: "unpublish",
      title: "Unpublish Tutorial",
      message:
        "Are you sure you want to unpublish this tutorial? It will no longer be visible to users.",
    });
  };

  const handleConfirmAction = async () => {
    try {
      switch (confirmationDialog.type) {
        case "delete":
          await deleteTutorial({ id: selectedTutorial }).unwrap();
          toast.success("Tutorial deleted successfully");
          break;
        case "publish":
          await publishTutorial({ id: selectedTutorial }).unwrap();
          toast.success("Tutorial published successfully");
          break;
        case "unpublish":
          await unpublishTutorial({ id: selectedTutorial }).unwrap();
          toast.success("Tutorial unpublished successfully");
          break;
      }
      setConfirmationDialog((prev) => ({ ...prev, isOpen: false }));

      // Add these two lines to ensure data is refreshed
      await queryClient.invalidateQueries({ queryKey: [queryKeys.TUTORIALS] });
      await value.refetch(); // Refetch the current page data
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const totalItems = data?.total || 0;
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

  const value = useGetTutorials({
    filter: TUTORIAL_ENUM.web,
    page: currentPage,
  });

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
      console.log(previewTutorial);
      setFormData({
        type: previewTutorial.data.type || "image",
        title: previewTutorial.data.title || "",
        description: previewTutorial.data.description || "",
        links: previewTutorial.data.links || "",
        file: null, // Files are not retrieved from the server
      });

      if (!quilValue && previewTutorial?.data?.content) {
        setQuilValue(previewTutorial?.data?.content);
      }
    }
  }, [previewTutorial]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {isLoading || isRefetching ? (
          <>
            {[...Array(6)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </>
        ) : isError ? (
          <div className="col-span-full text-center">
            <span className="flex justify-center items-center text-sm text-red-500">
              Something went wrong
            </span>
          </div>
        ) : (
          data?.data.map((card: any, index: number) => (
            <div
              key={index}
              className="relative flex flex-col bg-white shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg overflow-hidden"
            >
              {/* Card Background */}
              <div className="relative w-full aspect-video flex justify-center items-center bg-gray-100">
                {card?.media[0]?.type.includes("image") ? (
                  <Image
                    className="w-full h-full object-cover"
                    src={card?.media[0]?.url}
                    alt={card?.title}
                    width={400}
                    height={225}
                    priority
                  />
                ) : card?.media?.[0]?.type.includes("video") ? (
                  <video
                    loop
                    muted
                    autoPlay
                    className="w-full h-full object-cover"
                  >
                    <source src={card?.media[0]?.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-purple-50">
                    <ChatBotIcon className="w-16 h-16 text-purple-600" />
                  </div>
                )}
              </div>

              {/* Card Content */}
              <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-center mb-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      "px-2 py-1 text-xs font-medium",
                      card.is_published
                        ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                        : "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100"
                    )}
                  >
                    {card.is_published ? "Published" : "Draft"}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="p-1 hover:bg-gray-100 rounded-full">
                      <MoreVertical className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem
                        onClick={() => {
                          setPreview(true);
                          set_Id(card?._id);
                        }}
                        className="cursor-pointer"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        <span>Preview</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setEdit(true);
                          set_Id(card?._id);
                        }}
                        className="cursor-pointer"
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleUnpublish(card._id)}
                        className="cursor-pointer"
                      >
                        <Ban className="mr-2 h-4 w-4" />
                        <span>Unpublish</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(card._id)}
                        className="cursor-pointer text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                <div className="mt-auto pt-2 flex items-center text-xs text-gray-500">
                  {card?.media?.[0]?.type === "video/mp4" ? (
                    <span className="flex items-center">
                      <PlayCircle className="w-4 h-4 mr-1" />
                      Watch Video
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <FileText className="w-4 h-4 mr-1" />
                      Read article
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-xs font-medium order-2 sm:order-1">
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

      {preview && (
        <Sheet open={preview} onOpenChange={setPreview}>
          <SheetContent
            side="right"
            className=" sm:max-w-[80vw] md:max-w-[60vw] lg:max-w-[50vw] overflow-y-auto bg-white flex flex-col gap-5"
          >
            <SheetHeader>
              <SheetTitle>Preview</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              {isLoadingAll && (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-[300px] w-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                  </div>
                </div>
              )}

              {previewTutorial?.data && (
                <div className="max-h-[60vh] overflow-y-auto custom-scrollbar ">
                  <div className="flex flex-col gap-4">
                    <div className="overflow-y-auto max-h-[80vh]">
                      <h2 className="text-2xl font-bold mb-4">
                        {previewTutorial?.data?.title}
                      </h2>

                      <p className="text-gray-600 mb-4">
                        {previewTutorial?.data?.description}
                      </p>

                      <div
                        className={`relative flex justify-center items-center mb-4`}
                      >
                        {previewTutorial?.data?.media?.length > 0 ? (
                          previewTutorial.data.media[0].type.includes(
                            "image"
                          ) ? (
                            <Image
                              className="dark:invert"
                              src={previewTutorial.data.media[0].url}
                              alt="Preview"
                              width={300}
                              height={300}
                            />
                          ) : previewTutorial.data.media[0].type.includes(
                              "video"
                            ) ? (
                            <video loop muted autoPlay className="w-full">
                              <source
                                src={previewTutorial.data.media[0].url}
                                type={previewTutorial.data.media[0].type}
                              />
                              Your browser does not support the video tag.
                            </video>
                          ) : null
                        ) : (
                          <div className="text-gray-500 italic">
                            No media available
                          </div>
                        )}
                      </div>

                      <div
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: previewTutorial?.data?.content || "",
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      )}

      {edit && (
        <Sheet open={edit} onOpenChange={setEdit}>
          <SheetContent
            side="right"
            className="w-full sm:max-w-[80vw] md:max-w-[60vw] lg:max-w-[50vw]  overflow-y-auto"
          >
            <SheetHeader>
              <SheetTitle>Edit Tutorial</SheetTitle>
              <SheetDescription>
                Make changes to your tutorial here.
              </SheetDescription>
            </SheetHeader>

            {isLoadingAll ? (
              <EditSheetSkeleton />
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 py-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Type brief description"
                      rows={4}
                    />
                  </div>

                  {formData.type !== TUTORIAL_ENUM.text && (
                    <div
                      onDrop={handleDrop}
                      onDragOver={preventDefaults}
                      onDragEnter={preventDefaults}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-purple-500 transition-colors"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <FaFileUpload className="h-8 w-8 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          {fileName || "Select a file or drag and drop here"}
                        </p>
                        <p className="text-xs text-gray-400">
                          MP4, MOV, MKV, file size no more than 50MB
                        </p>
                        <Input
                          type="file"
                          id="fileUpload"
                          name="fileUpload"
                          accept=".mp4,.mov,.mkv,.jpg,.jpeg,.png"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            document.getElementById("fileUpload")?.click()
                          }
                        >
                          Select file
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="links">Links</Label>
                    <Input
                      id="links"
                      name="links"
                      value={formData.links}
                      onChange={handleChange}
                      placeholder="Enter links"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Content</Label>
                    <AppReactQuill
                      quilValue={quilValue}
                      setQuilValue={setQuilValue}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEdit(false)}
                    disabled={isEditLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isEditLoading}
                    className="bg-gradient-to-r from-[#5B03B2] to-[#9D50BB]"
                  >
                    {isEditLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving changes...
                      </>
                    ) : (
                      "Save changes"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </SheetContent>
        </Sheet>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmationDialog.isOpen && confirmationDialog.type === "delete"}
        onOpenChange={(open) =>
          setConfirmationDialog((prev) =>
            prev.type === "delete" ? { ...prev, isOpen: open } : prev
          )
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Tutorial</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this tutorial? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() =>
                setConfirmationDialog((prev) => ({ ...prev, isOpen: false }))
              }
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmAction}
              disabled={isDeleteing}
            >
              {isDeleteing ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Publish Confirmation Dialog */}
      <Dialog
        open={
          confirmationDialog.isOpen && confirmationDialog.type === "publish"
        }
        onOpenChange={(open) =>
          setConfirmationDialog((prev) =>
            prev.type === "publish" ? { ...prev, isOpen: open } : prev
          )
        }
      >
        <DialogContent className="z-[100000]" overlayClassName="z-[100000]">
          <DialogHeader>
            <DialogTitle>Publish Tutorial</DialogTitle>
            <DialogDescription>
              Are you sure you want to publish this tutorial? It will be visible
              to all users.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() =>
                setConfirmationDialog((prev) => ({ ...prev, isOpen: false }))
              }
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAction}
              disabled={isPublishLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isPublishLoading ? "Publishing..." : "Publish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unpublish Confirmation Dialog */}
      <Dialog
        open={
          confirmationDialog.isOpen && confirmationDialog.type === "unpublish"
        }
        onOpenChange={(open) =>
          setConfirmationDialog((prev) =>
            prev.type === "unpublish" ? { ...prev, isOpen: open } : prev
          )
        }
      >
        <DialogContent className="z-[100000]" overlayClassName="z-[100000]">
          <DialogHeader>
            <DialogTitle>Unpublish Tutorial</DialogTitle>
            <DialogDescription>
              Are you sure you want to unpublish this tutorial? It will no
              longer be visible to users.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() =>
                setConfirmationDialog((prev) => ({ ...prev, isOpen: false }))
              }
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAction}
              disabled={isUnpublishLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isUnpublishLoading ? "Unpublishing..." : "Unpublish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GenericArticlePage;
