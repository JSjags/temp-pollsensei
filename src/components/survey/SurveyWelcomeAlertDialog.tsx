"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import surveyWelcome from "../../assets/images/survey_welcome_illustration.svg";
import Image from "next/image";

export default function SurveyWelcomeAlertDialog({
  showModal = true,
  type = "a",
  setShowModal,
}: {
  showModal?: boolean;
  type?: "a" | "b";
  setShowModal?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent
        className="sm:max-w-md z-[1000]"
        buttonClassName="hidden"
        overlayClassName="backdrop-blur-sm z-[1000]"
      >
        <DialogHeader className="gap-0">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 h-auto w-auto p-2 bg-purple-50 hover:bg-purple-100 rounded-xl"
            onClick={() => setShowModal?.(false)}
          >
            <X className="h-4 w-4 text-purple-600" />
            <span className="sr-only">Close</span>
          </Button>
          <div className="flex justify-center pt-8">
            <Image
              className="h-[200px] w-auto"
              width={200}
              height={200}
              src={surveyWelcome}
              alt="Notification"
            />
          </div>
          <DialogTitle className="text-center text-2xl font-semibold">
            Yay! Glad to have you here
          </DialogTitle>
          <DialogDescription className="text-center pt-2 px-4 pb-6 text-base leading-normal text-muted-foreground">
            {type === "a"
              ? "You can click on the Create Survey button to create a new survey. Ifyou were already creating magic before and left off, we got you covered with your milestones saved."
              : "We have saved your progress for you. You can continue by clicking on the checkpoint"}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
