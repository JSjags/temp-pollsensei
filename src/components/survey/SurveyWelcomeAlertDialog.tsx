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
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/shadcn-checkbox";

export default function SurveyWelcomeAlertDialog({
  showModal = true,
  type = "a",
  setShowModal,
}: {
  showModal?: boolean;
  type?: "a" | "b";
  setShowModal?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [shouldShow, setShouldShow] = useState(true);
  const [showPreference, setShowPreference] = useState(true);

  useEffect(() => {
    const visitedMilestone = localStorage.getItem("visited_milestone");
    const showPreference = localStorage.getItem("show_welcome_dialog");

    if (visitedMilestone || showPreference === "false") {
      setShouldShow(false);
    }
  }, []);

  const handleCheckboxChange = (checked: boolean) => {
    setShowPreference(checked);
    localStorage.setItem("show_welcome_dialog", checked.toString());
  };

  if (!shouldShow) return null;

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent
        className="sm:max-w-md z-[100000]"
        buttonClassName="hidden"
        overlayClassName="backdrop-blur-sm z-[100000]"
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
              ? "You can click on the Create Survey button to create a new survey. If you were already creating magic before and left off, we got you covered with your milestones saved."
              : "We have saved your progress for you. You can continue by clicking on the checkpoint"}
          </DialogDescription>
          <div className="flex items-center space-x-2 justify-center">
            <Checkbox
              id="show-dialog"
              checked={showPreference}
              onCheckedChange={handleCheckboxChange}
              className="border-purple-300 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
            />
            <label
              htmlFor="show-dialog"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Show this welcome message next time
            </label>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
