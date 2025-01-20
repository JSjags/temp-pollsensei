import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
} from "../ui/alert-dialog";
import ShareSurvey from "./ShareSurvey";
import { Share2, X } from "lucide-react";

interface ShareSurveyModalProps {
  onClose: () => void;
  openModal: boolean;
  _id: string;
}

const ShareSurveyModal: React.FC<ShareSurveyModalProps> = ({
  onClose,
  openModal,
  _id,
}) => {
  return (
    <AlertDialog open={openModal} onOpenChange={onClose}>
      <AlertDialogContent
        className="sm:max-w-[425px] z-[100000]"
        overlayClassName="z-[100000]"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        <AlertDialogHeader>
          <div className="flex flex-col items-center gap-6 py-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center shadow-inner">
              <Share2 className="h-6 w-6 text-emerald-600 animate-pulse" />
            </div>
            <div className="space-y-2 text-center">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Share Survey
              </h2>
              <p className="text-sm text-gray-500">
                Share this survey with your team or respondents
              </p>
            </div>
          </div>
        </AlertDialogHeader>
        <ShareSurvey _id={_id} />
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ShareSurveyModal;
