import NoResponse from "@/components/survey/NoResponse";
import Responses from "@/components/survey/Responses";
import UploadedItem from "@/components/ui/UploadedItem";
import { setSurvey } from "@/redux/slices/answer.slice";
import { closeUpload } from "@/redux/slices/upload.slice";
import { RootState } from "@/redux/store";
import {
  useFetchASurveyQuery,
  useUploadResponseOCRMutation,
} from "@/services/survey.service";
import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { SlCloudUpload } from "react-icons/sl";
import { useSelector, useDispatch } from "react-redux";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable } from "@/components/ui/StrictModeDroppable";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

const SurveyResponses = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const uploadState = useSelector(
    (state: RootState) => state?.upload?.isUploadOpen
  );
  const { data } = useFetchASurveyQuery(params.id);
  const [
    uploadResponseOCR,
    {
      data: uploadOCR,
      isSuccess: successOCRUpload,
      isLoading: OCRloading,
      error: OCRerror,
    },
  ] = useUploadResponseOCRMutation();
  const [selectedItem, setSelectedItem] = useState<File | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleParentClick = (inputRef: React.RefObject<HTMLInputElement>) => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(selectedFiles);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSelectedFiles(items);
  };

  const handleToggle = useCallback(() => {
    dispatch(closeUpload());
    setSelectedFiles([]);
  }, [dispatch]);

  const handleRemove = (item: File) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((file) => file !== item));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files as FileList);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const handleItemSelect = (item: any) => {
    setSelectedItem(item);
  };

  const handleResponeOCR = async () => {
    if (selectedFiles.length === 0) {
      toast.warning("Please attach a file");
      return null;
    }

    setUploadProgress(0);
    const totalFiles = selectedFiles.length;
    let processedFiles = 0;

    if (selectedFiles.length > 0) {
      const filePromises = selectedFiles.map(async (file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();

          reader.onloadend = () => {
            const base64String = reader.result?.toString().split(",")[1];
            if (base64String) {
              processedFiles++;
              setUploadProgress((processedFiles / totalFiles) * 100);
              resolve(`data:${file.type};base64,${base64String}`);
            } else {
              reject(new Error("Failed to convert file to Base64."));
            }
          };

          reader.readAsDataURL(file);
        });
      });

      try {
        const base64Responses = await Promise.all(filePromises);
        const payload = {
          survey_id: params.id,
          responses: base64Responses,
        };

        await uploadResponseOCR(payload);
      } catch (error) {
        console.error("Error converting files:", error);
        toast.error("Error processing files");
      }
    }
  };

  useEffect(() => {
    if (OCRloading) {
      dispatch(closeUpload());
    }

    if (successOCRUpload) {
      toast.success("OCR processed successfully");
      setSelectedItem(null);
      dispatch(
        setSurvey({
          survey: uploadOCR?.data.survey,
          extracted_answers: uploadOCR?.data.extracted_answers,
          uploaded_files: uploadOCR?.data.uploaded_files,
        })
      );
      handleToggle();
      router.push("validate-res");
    }

    if (OCRerror) {
      toast.error("Failed to process OCR. Please try again.");
    }
  }, [
    successOCRUpload,
    OCRloading,
    dispatch,
    uploadOCR?.data,
    handleToggle,
    router,
    OCRerror,
  ]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container px-4 sm:px-6 lg:px-8 pb-2 my-6 sm:my-10 flex flex-col justify-center min-h-[60vh]"
    >
      <AnimatePresence mode="wait">
        {data?.data?.response_count === 0 ? (
          <motion.div
            key="no-response"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <NoResponse />
          </motion.div>
        ) : (
          <motion.div
            key="responses"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Responses data={data?.data} />
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={uploadState} onOpenChange={() => dispatch(closeUpload())}>
        <DialogContent
          className="sm:max-w-[600px] z-[100000]"
          overlayClassName="z-[100000]"
        >
          <DialogHeader>
            <DialogTitle className="text-center">
              Upload Survey Results
            </DialogTitle>
          </DialogHeader>

          <Card className="p-0 border-none shadow-none">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <div
                className="w-full border-2 border-dashed rounded-lg p-8 cursor-pointer hover:border-purple-400 transition-colors"
                onClick={() => handleParentClick(fileInputRef)}
              >
                <div className="flex flex-col items-center gap-4">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <SlCloudUpload className="w-12 h-12 text-purple-600" />
                  </motion.div>

                  <div className="text-center">
                    <h3 className="font-medium">
                      Select a file or drag and drop here
                    </h3>
                    <p className="text-sm text-gray-500">
                      JPG, PNG, file size no more than 10MB
                    </p>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png"
                    className="hidden"
                    multiple
                  />
                </div>
              </div>

              <small className="text-yellow-600">
                Please ensure that the files are uploaded in the format in which
                the survey was created. You can drag and drop the selected files
                to reorder them if they are not arranged correctly.
              </small>

              <div className="w-full">
                <DragDropContext onDragEnd={handleDragEnd}>
                  <StrictModeDroppable droppableId="files">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-2"
                      >
                        <AnimatePresence>
                          {selectedFiles.map((item, index) => (
                            <Draggable
                              key={item.name}
                              draggableId={item.name}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                  >
                                    <UploadedItem
                                      item={item}
                                      onRemove={handleRemove}
                                      onItemSelect={handleItemSelect}
                                    />
                                  </motion.div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        </AnimatePresence>
                        {provided.placeholder}
                      </div>
                    )}
                  </StrictModeDroppable>
                </DragDropContext>
              </div>

              <div className="flex justify-end gap-4 w-full">
                <Button variant="outline" onClick={handleToggle}>
                  Cancel
                </Button>
                <Button
                  onClick={handleResponeOCR}
                  disabled={!selectedFiles.length || OCRloading}
                >
                  {OCRloading ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </motion.div>
          </Card>
        </DialogContent>
      </Dialog>

      <Dialog open={OCRloading}>
        <DialogContent>
          <div className="flex flex-col items-center gap-6 py-8">
            <BeatLoader color="#6b46c1" />
            <Progress value={uploadProgress} className="w-[60%]" />
            <p className="text-center text-gray-600">
              Processing your files... Please wait
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default SurveyResponses;
