"use client";

import React from "react";
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

interface CustomButtonProps {
  imageUrl: string;
  tooltipText: string;
  className: string;
  triggerType: "rephrase";
}

export default function PollsenseiTriggerButton({
  imageUrl,
  tooltipText,
  className,
  triggerType
}: CustomButtonProps) {
  const dispatch = useDispatch()

const handleClick = () => {
  if(triggerType === "rephrase") {
    
  }
}


  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => alert("Rephrase question")}
            className={cn(
              "size-6 bg-transparent rounded-full hover:bg-gray-200 flex justify-center items-center p-0 transition-colors duration-200 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-transparent",
              className
            )}
            aria-label={tooltipText}
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
