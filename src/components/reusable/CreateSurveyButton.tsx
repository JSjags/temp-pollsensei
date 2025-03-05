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
  type?: "default" | "dashboard";
}

const CreateSurveyButton = ({
  variant = "default",
  className,
  type = "default",
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

  if (type === "dashboard") {
    return (
      <>
        <Button
          onClick={handleCreateSurvey}
          className="group relative !mt-6 overflow-hidden rounded-full bg-gradient-to-r from-purple-700 to-pink-600 px-8 shadow-lg transition-all duration-300 hover:shadow-[0_0_25px_rgba(139,92,246,0.7)] hover:scale-[1.02]"
        >
          <div className="absolute inset-0">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute size-0.1 rounded-full bg-white/50"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `twinkle ${
                    1.5 + Math.random() * 1
                  }s ease-in-out infinite ${Math.random() * 2}s`,
                  opacity: 0.6,
                }}
              />
            ))}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute size-0.5 rounded-full bg-white/50"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `twinkle ${
                    1 + Math.random() * 1.5
                  }s ease-in-out infinite ${Math.random() * 2}s`,
                  opacity: 0.8,
                }}
              />
            ))}
          </div>
          <div className="relative flex items-center gap-3 text-white">
            <span className="text-base font-medium">Create New Survey</span>
            <svg
              className="w-5 h-5 transform transition-transform duration-300 group-hover:rotate-90"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4V20M20 12H4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-violet-300/0 via-violet-300/40 to-violet-300/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
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
  }

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
