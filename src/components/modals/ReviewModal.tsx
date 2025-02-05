import React, { useState } from "react";
import { toast } from "react-toastify";
import { useCreateReviewMutation } from "@/services/superadmin.service";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Loader2, X } from "lucide-react";
import { Input } from "../ui/shadcn-input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Skeleton } from "../ui/skeleton";
import { useGetReviewQuestionsQuery } from "@/services/survey.service";

interface SubscribeProps {
  onClose: () => void;
  openModal: boolean;
  survey_id: string;
}

interface Question {
  question: string;
  options?: string[];
  question_type: "single_choice" | "short_text" | "likert_scale";
}

const ReviewModal: React.FC<SubscribeProps> = ({
  onClose,
  survey_id,
  openModal,
}) => {
  const [answers, setAnswers] = useState<{
    [key: string]: {
      selected_options?: string[];
      scale_value?: string;
      text?: string;
    };
  }>({});

  const router = useRouter();

  const {
    data: questionsData,
    isLoading: isQuestionsLoading,
    isError: isQuestionsError,
  } = useGetReviewQuestionsQuery(undefined, {
    skip: !openModal,
  });

  const [createReview, { isLoading }] = useCreateReviewMutation();

  const handleAnswerChange = (key: string, value: any, type: string) => {
    setAnswers((prev) => ({
      ...prev,
      [key]:
        type === "short_text"
          ? { text: value }
          : type === "likert_scale"
          ? { scale_value: value }
          : { selected_options: [value] },
    }));
  };

  const isFormValid = () => {
    if (!questionsData?.data) return false;
    return questionsData.data.every((question: Question) => {
      const answer = answers[question.question];
      if (!answer) return false;

      if (question.question_type === "short_text") {
        return answer.text && answer.text.trim().length > 0;
      } else if (question.question_type === "likert_scale") {
        return answer.scale_value && answer.scale_value.length > 0;
      } else if (question.question_type === "single_choice") {
        return answer.selected_options && answer.selected_options.length > 0;
      }
      return false;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      toast.error("Please answer all questions before submitting");
      return;
    }

    const reviews = questionsData?.data.map((question: Question) => ({
      question: question.question,
      question_type: question.question_type,
      ...answers[question.question],
    }));

    try {
      await createReview({
        survey_id,
        reviews,
      }).unwrap();
      toast.success("Your review has been noted");
      router.refresh(); // Refresh the page to get latest data
      router.push("/surveys/survey-list");
    } catch (err: any) {
      toast.error(
        "Failed to register review " + (err?.data?.message || err.message)
      );
    }
  };

  const handleSkip = () => {
    router.refresh(); // Refresh the page to get latest data
    router.push("/surveys/survey-list");
    onClose();
  };

  if (isQuestionsLoading) {
    return (
      <AlertDialog open={openModal} onOpenChange={onClose}>
        <AlertDialogContent
          className="max-w-[800px] max-h-[80vh] overflow-y-auto z-[100000]"
          overlayClassName="z-[100000]"
        >
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4 p-4 rounded-lg bg-gray-50">
                <Skeleton className="h-6 w-3/4" />
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((j) => (
                    <Skeleton key={j} className="h-8 w-full" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  if (isQuestionsError) {
    return (
      <AlertDialog open={openModal} onOpenChange={onClose}>
        <AlertDialogContent
          className="max-w-[800px] max-h-[80vh] overflow-y-auto z-[100000]"
          overlayClassName="z-[100000]"
        >
          <div className="text-center py-6">
            <h3 className="text-lg font-semibold text-red-600 mb-2">
              Failed to load review questions
            </h3>
            <p className="text-gray-600 mb-4">
              Please try again later or contact support if the problem persists.
            </p>
            <Button onClick={handleSkip}>Skip Review</Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <AlertDialog open={openModal} onOpenChange={onClose}>
      <AlertDialogContent
        className="max-w-[800px] max-h-[80vh] overflow-y-auto z-[100000]"
        overlayClassName="z-[100000]"
      >
        <div className="absolute right-4 top-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSkip}
            className="rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <AlertDialogHeader>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <AlertDialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] bg-clip-text text-transparent">
              Help Us Serve You Better
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 text-center">
              Take a minute to complete this survey to improve your experience
            </AlertDialogDescription>
          </motion.div>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8 mt-6">
          <AnimatePresence>
            {questionsData?.data?.map((question: Question, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-4 p-4 rounded-lg bg-gray-50"
              >
                <p className="font-medium text-gray-800">
                  <span className="text-[#5B03B2]">{index + 1}. </span>
                  {question.question}
                  <span className="text-red-500 ml-1">*</span>
                </p>
                {question.question_type === "single_choice" &&
                  question.options && (
                    <RadioGroup
                      value={
                        answers[question.question]?.selected_options?.[0] || ""
                      }
                      onValueChange={(value) =>
                        handleAnswerChange(
                          question.question,
                          value,
                          question.question_type
                        )
                      }
                      required
                    >
                      {question.options.map((option) => (
                        <div
                          key={option}
                          className="flex items-center space-x-2 mb-3"
                        >
                          <RadioGroupItem value={option} id={option} />
                          <Label htmlFor={option} className="text-gray-700">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                {question.question_type === "short_text" && (
                  <Input
                    type="text"
                    className="w-full"
                    placeholder="Type your answer here..."
                    value={answers[question.question]?.text || ""}
                    onChange={(e) =>
                      handleAnswerChange(
                        question.question,
                        e.target.value,
                        question.question_type
                      )
                    }
                    required
                  />
                )}
                {question.question_type === "likert_scale" &&
                  question.options && (
                    <RadioGroup
                      className="flex items-center justify-between space-x-4"
                      value={answers[question.question]?.scale_value || ""}
                      onValueChange={(value) =>
                        handleAnswerChange(
                          question.question,
                          value,
                          question.question_type
                        )
                      }
                      required
                    >
                      {question.options.map((option) => (
                        <div
                          key={option}
                          className="flex flex-col items-center space-y-2"
                        >
                          <RadioGroupItem
                            value={option}
                            id={`${question.question}-${option}`}
                            className="text-[#5B03B2]"
                          />
                          <Label
                            htmlFor={`${question.question}-${option}`}
                            className="text-sm text-gray-600"
                          >
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
              </motion.div>
            ))}
          </AnimatePresence>

          <AlertDialogFooter className="flex gap-3 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleSkip}
              className="flex-1 sm:flex-none"
            >
              Skip Review
            </Button>
            <Button
              type="submit"
              className="group relative py-3 px-8 rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-200 overflow-hidden active:scale-[0.98] bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] text-white hover:opacity-90 flex-1 sm:flex-none"
              disabled={isLoading || !isFormValid()}
            >
              <span className="group-hover:tracking-wider transition-all duration-200">
                {isLoading ? "Submitting" : "Submit Review"}
              </span>
              {!isLoading ? (
                <ArrowRight className="h-4 w-4" />
              ) : (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ReviewModal;
