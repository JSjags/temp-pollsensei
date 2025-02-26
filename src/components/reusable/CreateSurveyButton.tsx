import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ClipboardList, Edit2, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { resetSurvey } from "@/redux/slices/survey.slice";
import { cn } from "@/lib/utils";

interface CreateSurveyButtonProps {
  variant?: "default" | "outline" | "secondary";
  className?: string;
}

const CreateSurveyButton = ({
  variant = "default",
  className,
}: CreateSurveyButtonProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showContinueDialog, setShowContinueDialog] = useState(false);
  const survey = useSelector((state: RootState) => state.survey);

  const totalQuestions = survey.sections.reduce(
    (total, section) => total + section.questions.length,
    0
  );

  const handleCreateSurvey = () => {
    if (survey.topic && survey.sections.length > 0) {
      setShowContinueDialog(true);
    } else {
      router.push("/surveys/create-survey");
    }
  };

  const handleContinueSurvey = () => {
    setShowContinueDialog(false);

    if (survey.generated_by === "manually") {
      router.push("/surveys/manual-survey-create");
    } else {
      router.push("/surveys/edit-survey");
    }
  };

  const handleNewSurvey = () => {
    dispatch(resetSurvey());
    setShowContinueDialog(false);
    router.push("/surveys/create-survey");
  };

  return (
    <>
      <Button
        variant={variant}
        className={cn(className, "auth-btn !text-sm flex gap-2 items-center")}
        onClick={handleCreateSurvey}
      >
        Create Survey
        <PlusCircle size={14} />
      </Button>

      <Dialog open={showContinueDialog} onOpenChange={setShowContinueDialog}>
        <DialogContent
          className="sm:max-w-[500px] z-[100000] rounded-xl shadow-2xl"
          overlayClassName="z-[100000]"
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Existing Survey Draft Found
            </DialogTitle>
            <DialogDescription className="pt-6">
              <div className="space-y-5">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    {survey.topic || "Untitled Survey"}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {survey.description || "No description available"}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-primary font-medium">
                    <ClipboardList className="w-4 h-4" />
                    <span>{totalQuestions} questions added</span>
                  </div>
                </div>
                <p className="text-gray-700 text-center font-medium">
                  Would you like to continue with this survey or start a new
                  one?
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-4 mt-8">
            <Button
              variant="outline"
              onClick={handleNewSurvey}
              className="flex-1 h-10 font-medium border-2 hover:bg-gray-50 transition-colors duration-200"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Create New
            </Button>
            <Button
              onClick={handleContinueSurvey}
              className="flex-1 h-10 font-medium bg-gradient-to-r from-[#5b03b2] rounded-t-md to-[#9d50bb] hover:opacity-90 transition-opacity duration-200 text-white"
            >
              <Edit2 className="w-5 h-5 mr-2" />
              Continue Draft
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateSurveyButton;
