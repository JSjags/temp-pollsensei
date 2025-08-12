"use client";
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface ReplyFormProps {
  onSubmit: (content: string) => void;
  onCancel: () => void;
  placeholder?: string;
  initialContent?: string;
  parentAuthor?: string;
  isSubmitting?: boolean;
  maxLength?: number;
}

const ReplyForm: React.FC<ReplyFormProps> = ({
  onSubmit,
  onCancel,
  placeholder = "Write a comment...",
  initialContent = "",
  parentAuthor,
  isSubmitting = false,
  maxLength = 1000,
}) => {
  const [content, setContent] = useState(initialContent);
  const [error, setError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const user = useSelector((state: RootState) => state.user?.user);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      setError("Comment cannot be empty");
      textareaRef.current?.focus();
      return;
    }

    if (trimmedContent.length > maxLength) {
      setError(`Comment must be less than ${maxLength} characters`);
      return;
    }

    setError("");

    onSubmit(trimmedContent);

    if (!initialContent) {
      setContent("");
    }
  };

  const handleCancel = () => {
    setContent(initialContent);
    setError("");
    onCancel();
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);

    if (error && newContent.trim()) {
      setError("");
    }

    // Auto-resize
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e as any);
    }

    if (e.key === "Escape") {
      handleCancel();
    }
  };

  const remainingChars = maxLength - content.length;
  const isOverLimit = remainingChars < 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-3">
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage
            src={(user as any)?.photo_url || (user as any)?.avatar}
          />
          <AvatarFallback className="text-xs font-semibold">
            {((user as any)?.name || "U")
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .substring(0, 2)
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          {parentAuthor && (
            <div className="text-xs text-gray-500 mb-2">
              Replying to <span className="font-semibold">{parentAuthor}</span>
            </div>
          )}

          {/* Simple textarea */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleContentChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isSubmitting}
            rows={3}
            className={`
              w-full min-h-[80px] px-3 py-2 text-sm resize-none
              border rounded-md bg-white placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500
              disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50
              ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300"}
              ${isOverLimit ? "border-red-500" : ""}
            `}
          />

          {/* Error message */}
          {error && <div className="text-xs text-red-600 mt-1">{error}</div>}

          {/* Character count */}
          {content.length > 0 && (
            <div
              className={`text-xs mt-1 ${
                isOverLimit ? "text-red-500" : "text-gray-400"
              }`}
            >
              {remainingChars} characters remaining
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-2 pl-11">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting || !content.trim() || isOverLimit}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isSubmitting ? (
            <>
              <AiOutlineLoading3Quarters className="w-3 h-3 animate-spin mr-2" />
              Posting...
            </>
          ) : (
            <span>{initialContent ? "Post Reply" : "Post"}</span>
          )}
        </Button>
      </div>
    </form>
  );
};

export default ReplyForm;
