"use client";

import React, { useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { useSensei } from "@/contexts/SenseiContext";
import store, { RootState } from "@/redux/store";
import {
  setActionMessage,
  setCurrentQuestion,
  setIsCollapsed,
} from "@/redux/slices/sensei-master.slice";
import { useSelector } from "react-redux";

interface CustomButtonProps {
  imageUrl: string;
  tooltipText: string;
  className: string;
  triggerType: "rephrase";
  question: string;
  setEditId: React.Dispatch<React.SetStateAction<number | null>>;
  optionType: string;
  index: number;
  options: string[] | undefined;
  onSave: (
    updatedQuestion: string,
    updatedOptions: string[],
    updatedQuestionType: string,
    aiEditIndex?: number
  ) => void;
}

export default function PollsenseiTriggerButton({
  imageUrl,
  tooltipText,
  className,
  triggerType,
  setEditId,
  question,
  optionType,
  options,
  onSave,
  index,
}: CustomButtonProps) {
  const dispatch = useDispatch();

  const conversation_id = store.getState().survey.conversation_id;
  const { aiResponse, loading, isConnected, emitEvent, socketIo, setLoading } =
    useSensei();

  const handleClick = () => {
    dispatch(setActionMessage(`Rephrase question ${index}`));
    dispatch(setIsCollapsed(false));
    dispatch(
      setCurrentQuestion({
        question: {
          Question: question,
          "Option type": optionType,
          Options: options,
        },
      })
    );
    // setEditId(index - 1);
    // const payload = {
    //   conversation_id,
    //   data: {
    //     question: {
    //       Question: question,
    //       "Option type": optionType,
    //       Options: options,
    //     },
    //   },
    //   trigger_type: "single-regen",
    // };
    // emitEvent("user_trigger", payload);

    // const optionsPayload = {
    //   conversation_id,
    //   data: {
    //     question: {
    //       Question: question,
    //       "Option type": optionType,
    //       Options: options,
    //     },
    //   },
    //   trigger_type: "option",
    // };
    // emitEvent("user_trigger", optionsPayload);
  };

  const handleEvent = useCallback(
    (eventName: string, ...args: any[]) => {
      if (eventName === "ai_trigger") {
        if (onSave) {
          onSave(args[0].actions[0], options || [], optionType, index);
          // if() {
          // }
          // else {
          // }
        }
      }
    },
    [onSave, options, optionType, index]
  );

  useEffect(() => {
    socketIo?.onAny(handleEvent);

    // Cleanup function to remove the event listener
    return () => {
      socketIo?.offAny(handleEvent);
    };
  }, [socketIo, handleEvent]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleClick}
            className={cn(
              "size-6 bg-transparent rounded-full hover:bg-gray-200 flex justify-center items-center p-0 transition-colors duration-200 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-transparent shrink-0",
              className
            )}
            aria-label={tooltipText}
            disabled={loading}
          >
            <motion.div whileHover={{ scale: 1 }} whileTap={{ scale: 0.9 }}>
              <Image
                src={imageUrl}
                alt=""
                width={16}
                height={16}
                className="size-4 w-auto animate-spin-slow"
              />
            </motion.div>
          </Button>
        </TooltipTrigger>
        <TooltipContent
          sideOffset={5}
          className="bg-white border border-border shadow-lg px-2 py-2 rounded-md text-xs font-medium"
        >
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {tooltipText}
          </motion.div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
