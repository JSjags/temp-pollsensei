"use client";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaEllipsisV } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ReplyForm from "@/components/blog/ReplyForm";
import { cn } from "@/lib/utils";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

interface CommentAuthor {
  id: string;
  name: string;
  avatar: string;
}

interface CommentType {
  id: string;
  content: string;
  author: CommentAuthor;
  likes: number;
  isLiked: boolean;
  replies: CommentType[];
  parentId?: string;
  timestamp: string;
  editTimestamp?: string;
  reportId?: string;
}

interface CommentProps {
  comment: CommentType;
  timestamp?: string | undefined;
  reportId?: string;
  onLike: (commentId: string, rootCommentId?: string) => void;
  onReply: (parentId: string, content: string) => void;
  onEdit?: (
    commentId: string,
    content: string,
    isNested?: boolean,
    parentCommentId?: string
  ) => void;
  onDelete?: (
    commentId: string,
    isNested?: boolean,
    parentCommentId?: string
  ) => void;
  currentUserId?: string;
  depth?: number;
  maxDepth?: number;
  rootCommentId?: string;
  canReply?: boolean;
  canModify?: boolean;
}

const Comment: React.FC<CommentProps> = ({
  comment,
  onLike,
  onReply,
  onEdit,
  onDelete,
  currentUserId,
  depth = 0,
  maxDepth = 3,
  rootCommentId,
  canReply = true,
  canModify = false,
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // DEBUG: Log component props
  console.log("🎨 Comment component rendered with:", {
    commentId: comment.id,
    depth,
    rootCommentId,
    hasOnEdit: !!onEdit,
    hasOnDelete: !!onDelete,
    canModify,
    currentUserId,
    authorId: comment.author.id,
  });

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return "Just now";
      }

      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const minutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (minutes < 1) return "Just now";
      if (minutes < 60) return `${minutes}m ago`;
      if (hours < 24) return `${hours}h ago`;
      if (days < 7) return `${days}d ago`;
      return date.toLocaleDateString();
    } catch (error) {
      return "Just now";
    }
  };

  const handleReply = async (content: string) => {
    console.log("💬 REPLY button clicked:", { parentId: comment.id, content });
    try {
      await onReply(comment.id, content);
      setShowReplyForm(false);
      toast.success("Reply posted successfully!");
    } catch (error) {
      console.error("Error posting reply:", error);
      toast.error("Failed to post reply. Please try again.");
    }
  };

  // FIXED: Enhanced edit handler with proper debug info and parameter validation
  const handleEdit = async (content: string) => {
    console.log("✏️ EDIT button clicked (from ReplyForm):", {
      commentId: comment.id,
      content,
      depth,
      rootCommentId,
      hasOnEdit: !!onEdit,
    });

    if (onEdit) {
      try {
        const isNested = depth > 0;
        const parentCommentId = isNested ? rootCommentId : undefined;

        console.log("✏️ Calling onEdit with params:", {
          commentId: comment.id,
          content,
          isNested,
          parentCommentId,
          depthCheck: depth,
          rootCommentIdCheck: rootCommentId,
        });

        // CRITICAL FIX: Ensure we pass the parameters in the correct order
        if (isNested && parentCommentId) {
          console.log("✏️ ✅ NESTED EDIT - Calling with nested params");
          await onEdit(comment.id, content, true, parentCommentId);
        } else {
          console.log("✏️ ✅ MAIN EDIT - Calling with main params");
          await onEdit(comment.id, content, false);
        }

        setIsEditing(false);
        toast.success("Comment updated successfully!");
      } catch (error) {
        console.error("❌ Error editing comment:", error);
        toast.error("Failed to edit comment. Please try again.");
      }
    } else {
      console.error("❌ onEdit prop is undefined!");
      toast.error("Edit function not available");
    }
  };

  const handleLike = async () => {
    if (isLikeLoading) return;

    setIsLikeLoading(true);
    try {
      const currentRootCommentId = depth === 0 ? comment.id : rootCommentId;
      await onLike(comment.id, currentRootCommentId);
    } catch (error) {
      console.error("Error liking comment:", error);
      toast.error("Failed to like comment. Please try again.");
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleDeleteConfirmation = () => {
    console.log("🗑️ DELETE confirmation dialog opened for:", {
      commentId: comment.id,
      depth,
      rootCommentId,
    });
    setShowDeleteDialog(true);
  };

  // FIXED: Enhanced delete handler with proper debug info
  const handleDeleteConfirmed = async () => {
    console.log("🗑️ DELETE confirmed button clicked:", {
      commentId: comment.id,
      depth,
      rootCommentId,
      hasOnDelete: !!onDelete,
    });

    if (!onDelete) {
      console.error("❌ onDelete prop is undefined!");
      toast.error("Delete function not available");
      return;
    }

    setIsDeleteLoading(true);
    setShowDeleteDialog(false);

    try {
      const isNested = depth > 0;
      const parentCommentId = isNested ? rootCommentId : undefined;

      console.log("🗑️ Calling onDelete with params:", {
        commentId: comment.id,
        isNested,
        parentCommentId,
        depthCheck: depth,
        rootCommentIdCheck: rootCommentId,
      });

      // CRITICAL FIX: Ensure we pass the parameters in the correct order
      if (isNested && parentCommentId) {
        console.log("🗑️ ✅ NESTED DELETE - Calling with nested params");
        await onDelete(comment.id, true, parentCommentId);
      } else {
        console.log("🗑️ ✅ MAIN DELETE - Calling with main params");
        await onDelete(comment.id, false);
      }

      toast.success(
        `${depth === 0 ? "Comment" : "Reply"} deleted successfully!`
      );
    } catch (error) {
      console.error("❌ Error deleting comment:", error);
      toast.error("Failed to delete comment. Please try again.");
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const isNested = depth > 0;
  const canNest = depth < maxDepth;

  const canReplyToThisComment =
    canReply && currentUserId && comment.author.id !== currentUserId;

  const canModifyThisComment =
    (onEdit || onDelete) &&
    currentUserId &&
    comment.author.id === currentUserId;

  // DEBUG: Log permission calculations
  console.log("🔐 Permission check for comment:", comment.id, {
    canReplyToThisComment,
    canModifyThisComment,
    canReply,
    canModify,
    currentUserId,
    authorId: comment.author.id,
    userMatch: currentUserId === comment.author.id,
  });

  return (
    <div
      className={cn(
        "group",
        isNested && "ml-8 border-l-2 border-gray-100 pl-4"
      )}
    >
      <div className="flex gap-3">
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src="" />
          <AvatarFallback className="text-xs font-semibold bg-purple-100 text-purple-600">
            {comment.author?.avatar}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          {/* Comment Header */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-gray-900">
                {comment.author?.name}
              </span>
              {comment.editTimestamp !== comment.timestamp ? (
                <span className="text-xs text-gray-500">
                  (Edited {formatTimestamp(comment.editTimestamp ?? "")})
                </span>
              ) : (
                <span className="text-xs text-gray-500">
                  {formatTimestamp(comment.timestamp)}
                </span>
              )}
            </div>

            {/* Only show dropdown for comment owner */}
            {canModifyThisComment && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                    onClick={() =>
                      console.log("🎛️ Dropdown menu opened for:", comment.id)
                    }
                  >
                    <FaEllipsisV className="text-gray-700 text-xs" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      console.log("✏️ Edit menu item clicked for:", comment.id);
                      setIsEditing(true);
                    }}
                    disabled={isEditing}
                  >
                    <FaEdit className="w-3 h-3 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      console.log(
                        "🗑️ Delete menu item clicked for:",
                        comment.id
                      );
                      handleDeleteConfirmation();
                    }}
                    disabled={isDeleteLoading}
                    className="text-red-600 focus:text-red-600"
                  >
                    <FaTrash className="w-3 h-3 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Comment Content */}
          {isEditing ? (
            <div className="mb-2">
              <ReplyForm
                onSubmit={handleEdit}
                onCancel={() => {
                  console.log("❌ Edit cancelled for:", comment.id);
                  setIsEditing(false);
                }}
                placeholder="Edit your comment..."
                initialContent={comment.content}
              />
            </div>
          ) : (
            <div className="text-sm text-gray-700 mb-2 whitespace-pre-wrap">
              {comment.content}
            </div>
          )}

          {/* Comment Actions */}
          {!isEditing && (
            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={handleLike}
                disabled={isLikeLoading}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-full transition-colors disabled:opacity-50",
                  comment.isLiked
                    ? "text-purple-500 bg-purple-50 hover:bg-purple-100"
                    : "text-gray-500 hover:text-purple-500 hover:bg-purple-50"
                )}
              >
                {comment.isLiked ? (
                  <AiFillLike className="text-sm" />
                ) : (
                  <AiOutlineLike className="text-sm" />
                )}
                {comment.likes > 0 && (
                  <span className="font-medium">{comment.likes}</span>
                )}
              </button>

              {canNest && canReplyToThisComment && (
                <button
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="flex items-center gap-1 px-2 py-1 rounded-full text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                >
                  <IoChatbubbleEllipsesOutline className="text-sm" />
                  {comment.replies.length > 0 && (
                    <span className="font-medium">
                      {comment.replies.length}
                    </span>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Reply Form */}
          {showReplyForm && !isEditing && canReplyToThisComment && (
            <div className="mt-3">
              <ReplyForm
                onSubmit={handleReply}
                onCancel={() => setShowReplyForm(false)}
                placeholder={`Reply to ${comment.author?.name}...`}
                parentAuthor={comment.author?.name}
              />
            </div>
          )}

          {/* Nested Replies */}
          {comment.replies?.length > 0 && showReplies && !isEditing && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply) => {
                const canReplyToReply =
                  currentUserId && reply.author.id !== currentUserId;
                const canModifyReply =
                  currentUserId && reply.author.id === currentUserId;

                return (
                  <Comment
                    key={reply.id}
                    comment={reply}
                    timestamp={reply.timestamp}
                    reportId={comment.reportId}
                    onLike={onLike}
                    onReply={onReply}
                    onEdit={canModifyReply ? onEdit : undefined}
                    onDelete={canModifyReply ? onDelete : undefined}
                    currentUserId={currentUserId}
                    depth={depth + 1}
                    maxDepth={maxDepth}
                    rootCommentId={depth === 0 ? comment.id : rootCommentId}
                    canReply={Boolean(canReplyToReply)}
                    canModify={Boolean(canModifyReply)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {depth === 0 ? "Comment" : "Reply"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this{" "}
              {depth === 0 ? "comment" : "reply"}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleteLoading}
              onClick={() => console.log("❌ Delete cancelled via dialog")}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                console.log("🗑️ Delete confirmed via dialog button");
                handleDeleteConfirmed();
              }}
              disabled={isDeleteLoading}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleteLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Comment;
