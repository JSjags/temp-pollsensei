"use client";
import React, { useState, FC, ChangeEvent, useRef, useEffect } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { BsFileEarmarkImage } from "react-icons/bs";
import { GoDotFill } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import { FaRegCircleCheck } from "react-icons/fa6";
import Link from "next/link";
import congrats from "@/assets/images/congrats.svg";
import { IoArrowBack } from "react-icons/io5";
import ProgressBar from "@/components/respondent-form/ProgressBar";

interface Props {
  onPrevious: () => void;
}

const IdentityVerification: FC<Props> = ({ onPrevious }) => {
  const router = useRouter();
  const [imageSelected, setImageSelected] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [proceed, setProceed] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [submitForm, setSubmitForm] = useState<boolean>(false);

  // Request camera access when "proceed" is true
  useEffect(() => {
    if (proceed && videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setStream(stream);
          }
        })
        .catch((err) => console.error("Error accessing the camera: ", err));
    }
  }, [proceed]);

  // Clean up the stream when the component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  // function to handle the image capture
  const handleCapture = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        const imageUrl = canvasRef.current.toDataURL("image/png");
        setCapturedImage(imageUrl);
      }
    }
  };

  // function to handle the previous tab/section
  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    onPrevious();
  };

  // function to handle the next tab/section
  const handleContinue = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setProceed(true);
  };

  // function to handle image removal
  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setImageSelected(false);
    setSelectedFile(null);
  };

  // function to handle image selection
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImageSelected(true);
    }
  };

  // function to handle form submission
  const handleSubmit = (e: any) => {
    e.preventDefault();
    setSubmitForm(true);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-full flex flex-col items-center mx-auto"
    >
      {submitForm ? (
        <div className="w-full h-full flex flex-col items-center justify-center gap-5 relative p-20">
          <IoClose
            className="text-[#231F20] text-base cursor-pointer absolute top-5 left-5"
            onClick={() => router.push("/dashboard")}
          />
          <Image src={congrats} width={250} height={250} alt="congrats" />
          <h1 className="text-2xl font-bold text-center">Congratulations</h1>
          <p className="text-base text-center">
            You have been successfully enrolled as a Paid Respondent. You can
            now earn coins by taking surveys you qualify for on the survey board
          </p>
          <Link
            href="/dashboard"
            className="text-[#6A06CD] underline text-base"
          >
            Continue
          </Link>
        </div>
      ) : (
        <>
          <ProgressBar skip={false} progress={100} />
          <div className="w-full h-auto">
            <div className="flex items-center gap-3 lg:hidden mb-10">
              <IoArrowBack className="text-2xl" onClick={handlePrevious} />
              <h2 className="text-lg lg:text-2xl font-bold">
                Identity Verification
              </h2>
            </div>
          </div>
          {proceed ? (
            <div className="w-full flex flex-col gap-10">
              {capturedImage ? (
                <div className="w-full flex flex-col lg:flex-row gap-5">
                  <div className="h-[60vh] md:h-[400px] w-[80%] md:w-[70%] border-2 border-[#A9A9B1] border-dashed rounded-lg relative hidden lg:flex">
                    <Image
                      src={capturedImage}
                      alt="Captured image"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-5 items-center">
                    <h3 className="text-lg font-bold text-[#333333] text-center">
                      Verification Successful
                    </h3>
                    <FaRegCircleCheck className="text-[#52C41A] text-5xl" />
                    <p className="text-[13px] text-[#00000099]">
                      Your facial verification is suitable match with the
                      government ID presented. Click on Finish to complete the
                      enrollment process
                    </p>
                  </div>
                </div>
              ) : (
                <div className="w-full flex flex-col-reverse lg:flex-row gap-5">
                  <Button
                    size="default"
                    className="w-full md:w-full bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] shadow-[-5px_5px_10px_#563BFF42] hover:bg-purple-700 rounded-md text-xs md:text-sm p-4 hover:scale-x-105 transition-all lg:hidden text-center"
                    onClick={handleCapture}
                  >
                    START
                  </Button>
                  <div className="h-[40vh] md:h-[400px] w-full md:w-[70%] border-2 border-[#A9A9B1] border-dashed rounded-lg relative flex flex-col items-center justify-center">
                    <video
                      ref={videoRef}
                      autoPlay
                      width="80%"
                      height="100%"
                      className="object-cover rounded-full w-[80%] h-full"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                  <div className="flex-1 flex flex-col items-center lg:items-normal">
                    <h3 className="text-lg font-bold text-[#333333] mb-2 text-center">
                      Take a selfie
                    </h3>
                    <p className="text-[13px] text-[#00000099] mb-5 text-center">
                      Adjust your position to place your face in the oval frame.
                      Then click <span className="font-bold">START</span> to
                      enroll
                    </p>
                    <Button
                      size="default"
                      className="w-full md:w-full bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] shadow-[-5px_5px_10px_#563BFF42] hover:bg-purple-700 rounded-md text-xs md:text-sm p-4 hover:scale-x-105 transition-all hidden lg:flex items-center justify-center"
                      onClick={handleCapture}
                    >
                      START
                    </Button>
                  </div>
                </div>
              )}
              <div className="w-full flex items-center gap-5 mt-5">
                <Button
                  size="default"
                  variant="outline"
                  className="w-full md:w-full bg-transparent border-[#A9A9B1] rounded-md text-xs md:text-sm p-4 hover:scale-x-105 transition-all text-black"
                  onClick={handlePrevious}
                >
                  Previous
                </Button>
                <Button
                  size="default"
                  className="w-full md:w-full bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] shadow-[-5px_5px_10px_#563BFF42] hover:bg-purple-700 rounded-md text-xs md:text-sm p-4 hover:scale-x-105 transition-all"
                  disabled={!capturedImage}
                  type="submit"
                >
                  Finish
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 w-full lg:w-[70%] mx-auto items-center justify-center">
              <h2 className="text-2xl font-bold hidden lg:inline-block">
                Identity Verification
              </h2>
              <h4 className="text-lg text-[#898989]">Please Upload your ID</h4>
              <p className="text-[13px] text-[#00000099] text-center mb-5">
                Upload a valid government issued ID card to enable us verify
                your identity and information provided
              </p>
              <div
                className={`flex flex-col w-full ${
                  imageSelected ? "gap-3 lg:gap-10" : "gap-3"
                }`}
              >
                <div
                  className={`w-full flex items-center border-dashed border-2 border-[#00000040] rounded-lg ${
                    imageSelected
                      ? "h-[250px] lg:h-auto flex-col lg:flex-row lg:p-3 gap-3 justify-center lg:justify-normal"
                      : "h-[250px] flex-col justify-center gap-5"
                  }`}
                >
                  <FiUploadCloud
                    className={`text-[#00000066] ${
                      imageSelected ? "text-5xl lg:text-4xl" : "text-5xl"
                    }`}
                  />
                  <div
                    className={`flex items-center gap-3 w-full ${
                      imageSelected
                        ? "flex-col lg:flex-row lg:justify-between"
                        : "flex-col justify-center"
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-[13px]">
                        Select a file or drag and drop here
                      </p>

                      {imageSelected ? (
                        <p className="text-xs text-[#00000066]">
                          JPG, PNG, file size no more than 10MB{" "}
                        </p>
                      ) : (
                        <p className="text-xs text-[#00000066]">
                          {" "}
                          JPG, PNG, DOCX or PDF, file size no more than 10MB{" "}
                        </p>
                      )}
                    </div>
                    <label
                      htmlFor="file"
                      className={`flex items-center justify-center py-1 border-2 border-[#5B03B2] bg-transparent rounded-full w-fit cursor-pointer hover:scale-x-105 transition-all ${
                        imageSelected ? "px-2" : "px-5 mx-auto"
                      }`}
                    >
                      <span
                        className={`text-[#5B03B2] cursor-pointer ${
                          imageSelected ? "text-xs" : "text-base"
                        }`}
                      >
                        Select file
                      </span>
                    </label>
                    <input
                      id="file"
                      type="file"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
                {imageSelected && selectedFile && (
                  <div className="border-2 border-[#E8E4FF] rounded-lg h-auto w-full px-3 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BsFileEarmarkImage className="text-[#5B03B2] text-2xl" />
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-black hidden lg:inline-block">
                          {selectedFile?.name}
                        </p>
                        <p className="text-xs text-black lg:hidden">
                          {selectedFile?.name.toString().length > 10
                            ? `${selectedFile.name.slice(0, 7)}...`
                            : selectedFile.name}
                        </p>
                        <GoDotFill className="text-sm text-[#767676]" />
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="default"
                              className="text-[#9D50BB] text-xs h-fit bg-transparent hover:bg-transparent"
                            >
                              Preview
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-[80%] md:max-w-[425px] max-h-[60vh] lg:max-h-[425px] flex justify-center p-0 bg-transparent border-0 outline-none">
                            <Image
                              src={URL.createObjectURL(selectedFile)}
                              alt="Preview"
                              width={400}
                              height={400}
                              className="rounded-lg"
                            />
                          </DialogContent>
                        </Dialog>

                        <span className="text-[#00000066]">|</span>
                        <Button
                          variant="default"
                          className="text-[#FC3135] text-xs h-fit bg-transparent hover:bg-transparent"
                          onClick={handleRemove}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                    <p className="text-[#000000B2] text-[10px] uppercase">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)}MB
                    </p>
                  </div>
                )}
                <div className="w-full flex items-center gap-5 mt-5">
                  <Button
                    size="default"
                    variant="outline"
                    className="w-full md:w-full bg-transparent border-[#A9A9B1] rounded-md text-xs md:text-sm p-4 hover:scale-x-105 transition-all text-black"
                    onClick={handlePrevious}
                  >
                    Previous
                  </Button>
                  {imageSelected ? (
                    <Button
                      size="default"
                      className="w-full md:w-full bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] shadow-[-5px_5px_10px_#563BFF42] hover:bg-purple-700 rounded-md text-xs md:text-sm p-4 hover:scale-x-105 transition-all"
                      onClick={handleContinue}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      size="default"
                      className="w-full md:w-full bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] shadow-[-5px_5px_10px_#563BFF42] hover:bg-purple-700 rounded-md text-xs md:text-sm p-4 hover:scale-x-105 transition-all"
                      disabled={selectedFile === null}
                    >
                      Submit
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </form>
  );
};

export default IdentityVerification;
