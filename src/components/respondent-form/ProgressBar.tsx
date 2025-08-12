"use client";
import React, { FC, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IoClose } from "react-icons/io5";
import { useRouter } from "next/navigation";

interface Props {
  skip: boolean;
  progress: number;
  onContinue?: () => void;
}
const ProgressBar: FC<Props> = ({ skip, progress, onContinue }) => {
  const router = useRouter();

  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const handleContinue = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onContinue && onContinue();
  };

  // console.log({ progress });

  return (
    <div className="w-full flex items-center justify-center gap-5 mb-5">
      <div className="w-full lg:w-[65%] mx-auto flex items-center gap-2">
        {skip && (
          <button
            className="text-[#5B03B2] text-sm h-fit"
            onClick={handleContinue}
          >
            Skip
          </button>
        )}
        <div className="bg-[#E8DEF8] w-full h-1 rounded-md relative">
          <span
            className={`bg-[#5B03B2] h-1 absolute rounded-lg left-0 top-1/2  -translate-y-1/2`}
            style={{ width: `${progress}%` }}
          >
            &nbsp;
          </span>
        </div>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <IoClose className="text-[#231F20] text-base cursor-pointer" />
        </DialogTrigger>
        <DialogContent className="max-w-[80%] md:max-w-[425px] max-h-[60vh] lg:max-h-[425px] flex flex-col justify-center items-center gap-5 bg-white border-0 outline-none px-10 py-5">
          <h4 className="font-bold text-xl text-center text-[#54595E]">
            Are you sure?
          </h4>
          <p className="text-[#838383] text-sm text-center">
            You are about to exit the process of becoming a paid respondents.
            The changes you have made will not be saved and you will not be
            eligible to participate in paid surveys.
          </p>
          <div className="w-full flex items-center justify-center gap-5">
            <Button
              variant="outline"
              className="border-[#333333] text-[#333333] text-sm"
              onClick={() => setOpenDialog(false)}
            >
              No, cancel
            </Button>
            <Button
              variant="default"
              className="bg-[#D40418] text-white text-sm"
              onClick={() => router.push("/dashboard")}
            >
              Yes, I am sure
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default ProgressBar;
