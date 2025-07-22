import React from "react";
import { cn } from "@/lib/utils";

interface FAQContentProps {
  content: string;
  className?: string;
}

export const FAQContent: React.FC<FAQContentProps> = ({
  content,
  className,
}) => {
  return (
    <div
      className={cn(
        "prose prose-sm w-full",
        "prose-p:my-2 prose-ul:my-2 prose-ol:my-2",
        "prose-headings:my-3 prose-headings:font-semibold",
        "prose-li:my-0 prose-li:marker:text-gray-400",
        className
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};
