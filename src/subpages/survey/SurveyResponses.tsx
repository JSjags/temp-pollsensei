import NoResponse from "@/components/survey/NoResponse";
import Responses from "@/components/survey/Responses";
import ModalComponent from "@/components/ui/ModalComponent";
import UploadedItem from "@/components/ui/UploadedItem";
import { setSurvey } from "@/redux/slices/answer.slice";
import {
  closeUpload,
} from "@/redux/slices/upload.slice";
import { RootState } from "@/redux/store";
import {
  useFetchASurveyQuery,
  useUploadResponseOCRMutation,
} from "@/services/survey.service";
import { useParams, useRouter } from "next/navigation";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Slide } from "react-awesome-reveal";
import { SlCloudUpload } from "react-icons/sl";
import { useSelector, useDispatch } from "react-redux";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable } from "@/components/ui/StrictModeDroppable";

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
    if (selectedFiles.length > 0) {
      const filePromises = selectedFiles.map((file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();

          reader.onloadend = () => {
            const base64String = reader.result?.toString().split(",")[1];
            const image_name = file.name
            console.log(image_name)
            if (base64String) {
              console.log({
                image_name: image_name,
                base64: `data:${file.type};base64,${base64String}`, //`data:${file.type};base64,${base64String}`
              })
              resolve(
                // image_name: image_name,
                `data:${file.type};base64,${base64String}`, //`data:${file.type};base64,${base64String}`
              );
            } else {
              reject(new Error("Failed to convert file to Base64."));
            }
          };

          reader.readAsDataURL(file);
        });
      });

      try {
        const base64Responses = await Promise.all(filePromises); // Wait for all file conversions

        const payload = {
          survey_id: params.id,
          responses: base64Responses,
        };

        await uploadResponseOCR(payload);
        console.log(uploadOCR);
      } catch (error) {
        console.error("Error converting files:", error);
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
      // router.push("validate-response");
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

  console.log(selectedItem);
  console.log(selectedFiles);
  console.log(uploadOCR);

  console.log(data?.data);
  return (
    <div className="container px-4 sm:px-6 lg:px-8 pb-2 my-6 sm:my-10 flex flex-col justify-center min-h-[60vh]">
      {data?.data?.response_count === 0 && <NoResponse />}

      {data?.data?.response_count > 0 && <Responses data={data?.data} />}

      {/* Responses */}
      <Slide direction="up" duration={200}>
        <ModalComponent titleClassName={"pl-0"} openModal={uploadState}>
          <div className="flex flex-col items-center w-full">
            <h2 className="text-[1.25rem] font-normal ">
              Please Upload your result
            </h2>
            <p className="text-sm font-normal">
              Upload your survey to validate and analyze
            </p>
            <div
              className={`flex flex-col border-2 border-dashed items-center w-full bg-white py-3 cursor-pointer`}
              role="button"
              onClick={() => handleParentClick(fileInputRef)}
            >
              <div
                className={`${
                  selectedFiles.length > 0
                    ? "text-sm px-2 justify-between"
                    : "flex-col px-10"
                } text-center flex items-center w-full  py-5`}
              >
                <SlCloudUpload
                  className="font-thin"
                  size={selectedFiles.length > 0 ? 30 : 50}
                />
                <label
                  htmlFor="header_image"
                  className="text-center"
                  role="button"
                >
                  Select a file or drag and drop here
                  <br />
                  <span className={`text-xs`}>
                    JPG, PNG, file size no more than 10MB
                  </span>{" "}
                </label>
                <input
                  type="file"
                  id="header_image"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".jpg, .jpeg, .png,"
                  className="hidden"
                  multiple
                />

                <button
                  className={`${
                    selectedFiles.length > 0 ? "px-3" : "px-4 border-[#5B03B2]"
                  } rounded-full py-1 border border-[#5B03B2] text-[#5B03B2] mt-3`}
                >
                  Select file
                </button>
              </div>
            </div>
            <small className="text-yellow-600">
              Please ensure that the files are uploaded in the format in which
              the survey was created. You can drag and drop the selected files
              to reorder them if they are not arranged correctly.
            </small>
            <DragDropContext onDragEnd={handleDragEnd}>
              <StrictModeDroppable droppableId="files">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {selectedFiles && (
                      <div
                        className={`${
                          selectedFiles ? "flex" : "hidden"
                        } pt-2 rounded-md max-h-80 overflow-y-auto flex-wrap w-full`}
                      >
                        {[...selectedFiles].map((item, index) => (
                          <Draggable
                            key={item.name}
                            // key={index + 1}
                            // draggableId={index.toString()}
                            draggableId={item.name}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="mb-4"
                              >
                                <UploadedItem
                                  key={index}
                                  item={item}
                                  onRemove={handleRemove}
                                  onItemSelect={handleItemSelect}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </StrictModeDroppable>
            </DragDropContext>

            <div className="flex justify-end w-full mt-5">
              <div className="flex justify-between items-center gap-4">
                <button
                  className="border-none px-4 py-1"
                  onClick={handleToggle}
                >
                  Cancel
                </button>
                <button
                  className="border-none px-4 py-1 text-[#5B03B2]"
                  disabled={!selectedFiles}
                  onClick={handleResponeOCR}
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </ModalComponent>
      </Slide>

      <Slide direction="up" duration={200}>
        <ModalComponent titleClassName={"pl-0"} openModal={OCRloading}>
          <div className="flex flex-col items-center text-center min-h-[7.5rem]">
            <BeatLoader />
            <h2 className="font-normal text-lg">
              Uploading... Please be patient
            </h2>
          </div>
        </ModalComponent>
      </Slide>
    </div>
  );
};

export default SurveyResponses;
