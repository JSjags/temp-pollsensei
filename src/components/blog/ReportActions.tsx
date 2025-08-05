"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  BsMegaphone,
  BsBookmark,
  BsBookmarkFill,
  BsShare,
} from "react-icons/bs";
import { FaRegCommentDots } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import ShareModal from "@/components/blog/ShareModal";
import { toast } from "react-toastify";

interface ReportActionsProps {
  reportId: string;
  reportTitle: string;
  onEcho: () => void;
  onComment: () => void;
  onShare: () => void;
  onBookmark: () => void;
  echoes?: number;
  comments?: number;
  isEchoed?: boolean;
  isBookmarked?: boolean;
  isAuthenticated: boolean;
  isBookmarkLoading?: boolean;
  isEchoLoading?: boolean;
}

const ReportActions: React.FC<ReportActionsProps> = ({
  reportId,
  reportTitle,
  onEcho,
  onComment,
  onShare,
  onBookmark,
  echoes = 0,
  comments = 0,
  isEchoed = false,
  isBookmarked = false,
  isAuthenticated,
  isBookmarkLoading = false,
  isEchoLoading = false,
}) => {
  const showComments = useSelector(
    (state: RootState) => state.blogSlice.showComments
  );

  // State for controlling ShareModal visibility
  const [showShareModal, setShowShareModal] = useState(false);

  // Generate proper report URL
  const reportUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/blog/${reportId}`
      : `https://yoursite.com/blog/${reportId}`;

  const handleShareClick = () => {
    if (isAuthenticated) {
      setShowShareModal(true);
    } else {
      onShare(); // This will handle the auth redirect in parent
    }
  };

  // Helper function to get button opacity based on auth state
  const getButtonOpacity = (isLoading: boolean = false) => {
    if (isLoading) return "opacity-50 cursor-not-allowed";
    if (!isAuthenticated) return "opacity-75 hover:opacity-100";
    return "";
  };

  return (
    <div className="flex items-center gap-2">
      {/* Echo Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onEcho}
        disabled={isEchoLoading}
        className={`flex items-center gap-2 hover:bg-purple-50 hover:text-purple-600 transition-all ${
          isEchoed ? "text-purple-600 bg-purple-50" : "text-gray-600"
        } ${getButtonOpacity(isEchoLoading)}`}
        title={
          !isAuthenticated ? "Login to echo this report" : "Echo this report"
        }
      >
        {isEchoLoading ? (
          <AiOutlineLoading3Quarters className="w-4 h-4 animate-spin" />
        ) : (
          <BsMegaphone className="w-4 h-4" />
        )}
        <span className="text-sm font-medium">{echoes}</span>
      </Button>

      {/* Comment Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onComment}
        className={`flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600 transition-all ${
          showComments ? "text-blue-600 bg-blue-50" : "text-gray-600"
        } ${getButtonOpacity()}`}
        title={
          !isAuthenticated ? "Login to comment on this report" : "View comments"
        }
      >
        <FaRegCommentDots className="w-4 h-4" />
        <span className="text-sm font-medium">{comments}</span>
      </Button>

      {/* Share Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleShareClick}
        className={`flex items-center gap-2 hover:bg-green-50 hover:text-green-600 text-gray-600 transition-all ${getButtonOpacity()}`}
        title={
          !isAuthenticated ? "Login to share this report" : "Share this report"
        }
      >
        <BsShare className="w-4 h-4" />
      </Button>

      {/* Bookmark Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onBookmark}
        disabled={isBookmarkLoading}
        className={`flex items-center gap-2 hover:bg-yellow-50 hover:text-yellow-600 transition-all ${
          isBookmarked ? "text-yellow-600 bg-yellow-50" : "text-gray-600"
        } ${getButtonOpacity(isBookmarkLoading)}`}
        title={
          !isAuthenticated
            ? "Login to bookmark this report"
            : isBookmarked
            ? "Remove bookmark"
            : "Bookmark this report"
        }
      >
        {isBookmarkLoading ? (
          <AiOutlineLoading3Quarters className="w-4 h-4 animate-spin" />
        ) : isBookmarked ? (
          <BsBookmarkFill className="w-4 h-4" />
        ) : (
          <BsBookmark className="w-4 h-4" />
        )}
      </Button>

      {/* ShareModal with proper control */}
      {showShareModal && isAuthenticated && (
        <ShareModal
          reportTitle={reportTitle}
          reportUrl={reportUrl}
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};

export default ReportActions;
