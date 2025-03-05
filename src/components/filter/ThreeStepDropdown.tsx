import {
  resetFilters,
  setAnswersss,
  setQuestion,
  setQuestionType,
} from "@/redux/slices/filter.slice";
import { resetName } from "@/redux/slices/name.slice";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Filter, ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface DropdownData {
  questions: any;
  isLoading: boolean;
}

const ThreeStepDropdown: React.FC<DropdownData> = ({
  questions,
  isLoading,
}) => {
  const dispatch = useDispatch();
  const [isAddingFilter, setIsAddingFilter] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [selectedQuestionType, setSelectedQuestionType] = useState<
    string | null
  >(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleReset = () => {
    setSelectedQuestion(null);
    setSelectedAnswer(null);
    setIsAddingFilter(false);
    dispatch(resetFilters());
    dispatch(resetName());
  };

  const handleBackToQuestion = () => {
    setSelectedAnswer(null);
    dispatch(setAnswersss(""));
  };

  const dropdownAnimation = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.2 },
  };

  return (
    <div className="flex items-start gap-4 flex-1 w-full">
      {!isAddingFilter ? (
        <Button
          variant="outline"
          onClick={() => {
            setIsAddingFilter(true);
            dispatch(resetFilters());
            dispatch(resetName());
          }}
          className="flex items-center gap-2 w-full"
          disabled={isLoading}
        >
          <Filter className="h-4 w-4" />
          Add Filter
        </Button>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            className="space-y-4 w-full"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={dropdownAnimation}
          >
            <Card className="p-4 space-y-4 min-w-full">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-8 w-24" />
                </div>
              ) : (
                <div className="w-full">
                  {!selectedQuestion && (
                    <Select
                      onValueChange={(value) => {
                        dispatch(setQuestion(value));
                        setSelectedQuestion(value);
                        const questionType = questions.find(
                          (q: any) => q.question === value
                        )?.question_type;
                        dispatch(setQuestionType(questionType));
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a question" />
                      </SelectTrigger>
                      <SelectContent className="z-[100000]">
                        {questions?.map((question: any, index: number) => (
                          <SelectItem key={index} value={question.question}>
                            {question.question}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {selectedQuestion && !selectedAnswer && (
                    <motion.div {...dropdownAnimation} className="space-y-4">
                      <Select
                        onValueChange={(value) => {
                          dispatch(setAnswersss(value));
                          setSelectedAnswer(value);
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select an answer" />
                        </SelectTrigger>
                        <SelectContent className="z-[100000]">
                          {questions
                            ?.filter(
                              (q: any) => q.question === selectedQuestion
                            )
                            ?.flatMap((q: any) => q.options || [])
                            ?.map((option: any, index: number) => (
                              <SelectItem
                                key={index}
                                value={option}
                                className="line-clamp-1"
                              >
                                {option}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedQuestion(null);
                          dispatch(setQuestion(""));
                        }}
                        className="flex items-center gap-2"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Back to questions
                      </Button>
                    </motion.div>
                  )}

                  {selectedAnswer && (
                    <motion.div {...dropdownAnimation} className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="px-3 py-1 line-clamp-1"
                        >
                          {selectedQuestion}: {selectedAnswer}
                          <button
                            onClick={handleReset}
                            className="ml-2 hover:text-red-500 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleBackToQuestion}
                        className="flex items-center gap-2"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Change answer
                      </Button>
                    </motion.div>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAddingFilter(false)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default ThreeStepDropdown;
