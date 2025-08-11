"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import Comment from "@/components/blog/Comment";
import ReplyForm from "@/components/blog/ReplyForm";
import { Button } from "@/components/ui/button";
import { FaComments } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { APP_KEYS } from "@/constants";
import { toast } from "react-toastify";
import {
  GetReportCommentsAndReplies,
  ReportComment,
  EditReportComment,
  DeleteReportComment,
  EchoReportComment,
  NestedReportComment,
  EditNestedReportComment,
  DeleteNestedReportComment,
  EchoNestedReportComment,
} from "@/services/api/apiRequest";

interface CommentSectionProps {
  reportId: string;
  onHideReplies: () => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  reportId,
  onHideReplies,
}) => {
  const [showMainReplyForm, setShowMainReplyForm] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();

  const user = useSelector((state: RootState) => state.user?.user);

  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    error: commentsError,
    refetch: refetchComments,
  } = useQuery({
    queryKey: [APP_KEYS.REPORT_COMMENTS, reportId],
    queryFn: () => GetReportCommentsAndReplies(reportId, 1, 20),
    enabled: !!reportId,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const invalidateCommentQueries = async () => {
    try {
      await queryClient.invalidateQueries({
        queryKey: [APP_KEYS.REPORT_COMMENTS, reportId],
      });
      await queryClient.invalidateQueries({
        queryKey: [APP_KEYS.REPORTS_DETAILS, reportId],
      });
      await queryClient.refetchQueries({
        queryKey: [APP_KEYS.REPORT_COMMENTS, reportId],
      });
    } catch (error) {
      refetchComments();
    }
  };

  const addCommentMutation = useMutation({
    mutationFn: ({ content, media }: { content: string; media?: any }) =>
      ReportComment(reportId, content, media),
    onMutate: async ({ content }) => {
      await queryClient.cancelQueries({
        queryKey: [APP_KEYS.REPORT_COMMENTS, reportId],
      });

      const previousComments = queryClient.getQueryData([
        APP_KEYS.REPORT_COMMENTS,
        reportId,
      ]);

      queryClient.setQueryData(
        [APP_KEYS.REPORT_COMMENTS, reportId],
        (old: any) => {
          if (!old?.data) return old;

          const newComment = {
            _id: `temp-${Date.now()}`,
            content,
            user_id: {
              _id: (user as any)?._id,
              name: (user as any)?.name || "You",
            },
            echoes: 0,
            is_echoed: false,
            replies: [],
            createdAt: new Date().toISOString(),
          };

          return {
            ...old,
            data: [newComment, ...old.data],
            meta: {
              ...old.meta,
              total: (old.meta?.total || 0) + 1,
            },
          };
        }
      );

      return { previousComments };
    },
    onSuccess: async (data) => {
      await invalidateCommentQueries();
      setShowMainReplyForm(false);
      setTimeout(() => setShowMainReplyForm(true), 100);
    },
    onError: (error, variables, context) => {
      console.error("Add comment error:", error);
      queryClient.setQueryData(
        [APP_KEYS.REPORT_COMMENTS, reportId],
        context?.previousComments
      );
      toast.error(error.message || "Failed to add comment. Please try again.");
    },
  });

  // Edit main comment mutation
  const editCommentMutation = useMutation({
    mutationFn: ({
      commentId,
      content,
      media,
    }: {
      commentId: string;
      content: string;
      media?: any;
    }) => {
      return EditReportComment(commentId, content, media);
    },
    onSuccess: async (data) => {
      await invalidateCommentQueries();
    },
    onError: (error) => {
      console.error("❌ Edit main comment error:", error);
      toast.error(
        error.message || "Failed to update comment. Please try again."
      );
    },
  });

  // Delete main comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => {
      return DeleteReportComment(commentId);
    },
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({
        queryKey: [APP_KEYS.REPORT_COMMENTS, reportId],
      });

      const previousComments = queryClient.getQueryData([
        APP_KEYS.REPORT_COMMENTS,
        reportId,
      ]);

      queryClient.setQueryData(
        [APP_KEYS.REPORT_COMMENTS, reportId],
        (old: any) => {
          if (!old?.data) return old;

          return {
            ...old,
            data: old.data.filter((comment: any) => comment._id !== commentId),
            meta: {
              ...old.meta,
              total: Math.max((old.meta?.total || 1) - 1, 0),
            },
          };
        }
      );

      return { previousComments };
    },
    onSuccess: async (data) => {
      await invalidateCommentQueries();
    },
    onError: (error, commentId, context) => {
      console.error("❌ Delete main comment error:", error);
      queryClient.setQueryData(
        [APP_KEYS.REPORT_COMMENTS, reportId],
        context?.previousComments
      );
      toast.error(
        error.message || "Failed to delete comment. Please try again."
      );
    },
  });

  const editNestedCommentMutation = useMutation({
    mutationFn: async ({
      replyId,
      parentCommentId,
      content,
      media,
    }: {
      replyId: string;
      parentCommentId: string;
      content: string;
      media?: any;
    }) => {
      const result = await EditNestedReportComment(
        parentCommentId,
        replyId,
        content,
        media
      );
      return result;
    },
    onSuccess: async (data, variables) => {
      await invalidateCommentQueries();
    },
    onError: (error, variables) => {
      console.error("❌ Edit nested comment error:", error);
      console.error("❌ Failed variables:", variables);
      toast.error(error.message || "Failed to update reply. Please try again.");
    },
  });

  const deleteNestedCommentMutation = useMutation({
    mutationFn: async ({
      replyId,
      parentCommentId,
    }: {
      replyId: string;
      parentCommentId: string;
    }) => {
      const result = await DeleteNestedReportComment(replyId, parentCommentId);
      return result;
    },
    onSuccess: async (data, variables) => {
      await invalidateCommentQueries();
    },
    onError: (error, variables) => {
      console.error("❌ Delete nested comment error:", error);
      console.error("❌ Failed variables:", variables);
      toast.error(error.message || "Failed to delete reply. Please try again.");
    },
  });

  // Echo main comment mutation
  const echoMainCommentMutation = useMutation({
    mutationFn: (commentId: string) => EchoReportComment(commentId),
    onSuccess: async (data) => {
      await invalidateCommentQueries();
    },
    onError: (error) => {
      console.error("Echo comment error:", error);
      toast.error(error.message || "Failed to echo comment. Please try again.");
    },
  });

  // Echo reply mutation
  const echoReplyMutation = useMutation({
    mutationFn: ({
      replyId,
      commentId,
    }: {
      replyId: string;
      commentId: string;
    }) => EchoNestedReportComment(replyId, commentId),
    onSuccess: async (data) => {
      await invalidateCommentQueries();
    },
    onError: (error) => {
      console.error("Echo reply error:", error);
      toast.error(error.message || "Failed to echo reply. Please try again.");
    },
  });

  // Reply to comment mutation
  const replyCommentMutation = useMutation({
    mutationFn: ({
      parentId,
      content,
      media,
    }: {
      parentId: string | undefined;
      content: string;
      media?: any;
    }) => NestedReportComment(parentId, content, media),
    onSuccess: async (data) => {
      await invalidateCommentQueries();
    },
    onError: (error) => {
      console.error("Add reply error:", error);
      toast.error(error.message || "Failed to add reply. Please try again.");
    },
  });

  const handleAuthRequired = () => {
    if (!user) {
      router.push("/login");
      return false;
    }
    return true;
  };

  const handleAddComment = (content: string) => {
    if (!handleAuthRequired()) return;
    addCommentMutation.mutate({ content });
  };

  const handleEditComment = (
    commentId: string,
    content: string,
    isNested: boolean = false,
    parentCommentId?: string
  ) => {
    if (!handleAuthRequired()) return;

    if (isNested && parentCommentId) {
      editNestedCommentMutation.mutate({
        replyId: commentId,
        parentCommentId: parentCommentId,
        content,
      });
    } else {
      editCommentMutation.mutate({ commentId, content });
    }
  };

  const handleDeleteComment = (
    commentId: string,
    isNested: boolean = false,
    parentCommentId?: string
  ) => {
    if (!handleAuthRequired()) return;

    if (isNested && parentCommentId) {
      deleteNestedCommentMutation.mutate({
        replyId: commentId,
        parentCommentId: parentCommentId,
      });
    } else {
      deleteCommentMutation.mutate(commentId);
    }
  };

  const handleLikeComment = (commentId: string, rootCommentId?: string) => {
    if (!handleAuthRequired()) return;

    if (rootCommentId && rootCommentId !== commentId) {
      echoReplyMutation.mutate({
        replyId: commentId,
        commentId: rootCommentId,
      });
    } else {
      echoMainCommentMutation.mutate(commentId);
    }
  };

  const handleReplyToComment = (
    parentId: string | undefined,
    content: string
  ) => {
    if (!handleAuthRequired()) return;

    replyCommentMutation.mutate({ parentId, content });
  };

  // Updated logic to check if user can reply to their own comment
  const canReplyToOwnComment = (comment: any) => {
    if (!user || comment.user_id?._id !== (user as any)?._id) return false;

    // User can only reply to their own comment if there are replies from other users
    const hasRepliesFromOthers = comment.replies?.some(
      (reply: any) => reply.user_id?._id !== (user as any)?._id
    );

    return hasRepliesFromOthers;
  };

  // Check if user can reply to someone else's comment
  const canReplyToOthersComment = (comment: any) => {
    return user && comment.user_id?._id !== (user as any)?._id;
  };

  // Check if user can modify (edit/delete) a comment
  const canModifyComment = (comment: any) => {
    return user && comment.user_id?._id === (user as any)?._id;
  };

  if (isCommentsLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm animate-pulse">
        <div className="p-6 border-b">
          <div className="h-6 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="p-6 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (commentsError) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center text-red-600">
          <p className="mb-3">Failed to load comments. Please try again.</p>
          <Button onClick={() => refetchComments()} variant="outline" size="sm">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const comments = commentsData?.data || [];
  const totalCommentsCount = commentsData?.meta?.total || comments.length;

  return (
    <div className="bg-white rounded-lg shadow-sm animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-900">
            Reply ({totalCommentsCount})
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={onHideReplies}
            variant="outline"
            size="sm"
            className="text-gray-600 hover:text-gray-800"
          >
            Hide comments
          </Button>
        </div>
      </div>

      <div className="p-6">
        {user ? (
          showMainReplyForm ? (
            <div className="mb-6">
              {/* Comment Section Disclaimer */}
              <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm text-purple-800">
                  <span className="font-semibold">Community Guidelines:</span>{" "}
                  We encourage respectful discussion and diverse perspectives.
                  We do not tolerate violent language, hate speech, harassment,
                  or threats. Please keep comments constructive and relevant to
                  the topic. Violations may result in comment removal or account
                  restrictions.
                </p>
              </div>

              <ReplyForm
                onSubmit={handleAddComment}
                onCancel={() => setShowMainReplyForm(false)}
                placeholder="Share your thoughts..."
                isSubmitting={addCommentMutation.isPending}
              />
            </div>
          ) : (
            <Button
              onClick={() => setShowMainReplyForm(true)}
              variant="outline"
              className="mb-6 w-full justify-start text-gray-500"
            >
              Share your thoughts...
            </Button>
          )
        ) : (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-gray-600 mb-3">Join the conversation</p>
            <Button
              onClick={() => router.push("/login")}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Sign in to comment
            </Button>
          </div>
        )}

        {comments.length > 0 ? (
          <div className="space-y-6">
            {comments.map((comment: any) => {
              const canReplyOwn = canReplyToOwnComment(comment);
              const canReplyOthers = canReplyToOthersComment(comment);
              const canModify = canModifyComment(comment);

              return (
                <Comment
                  key={comment._id}
                  comment={{
                    id: comment._id,
                    content: comment.content,
                    author: {
                      id: comment.user_id?._id,
                      name:
                        comment.user_id?.name.toString().split(" ")[0] ||
                        "Anonymous",
                      avatar:
                        comment.user_id?.name?.slice(0, 1)?.toUpperCase() ||
                        "A",
                    },
                    likes: comment.echoes || 0,
                    isLiked: comment.is_echoed || false,
                    replies:
                      comment.replies?.map((reply: any) => ({
                        id: reply._id,
                        content: reply.content,
                        author: {
                          id: reply.user_id?._id,
                          name:
                            reply.user_id?.name.toString().split(" ")[0] ||
                            "Anonymous",
                          avatar:
                            reply.user_id?.name?.slice(0, 1)?.toUpperCase() ||
                            "A",
                        },
                        likes: reply.echoes || 0,
                        isLiked: reply.is_echoed || false,
                        replies: [],
                        parentId: comment._id,
                        timestamp: reply.createdAt,
                        editTimestamp: reply.updatedAt,
                        reportId: reportId,
                      })) || [],
                    parentId: comment.parent_id,
                    timestamp: comment.createdAt,
                    editTimestamp: comment.updatedAt,
                    reportId: reportId,
                  }}
                  reportId={reportId}
                  onLike={handleLikeComment}
                  onReply={handleReplyToComment}
                  onEdit={handleEditComment}
                  onDelete={handleDeleteComment}
                  currentUserId={(user as any)?._id}
                  rootCommentId={comment._id}
                  canReply={canReplyOwn || canReplyOthers}
                  canModify={canModify}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <FaComments className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-2">No comments yet</p>
            <p className="text-sm text-gray-400">
              Be the first to share your thoughts on this report
            </p>
          </div>
        )}

        {comments.length > 0 && comments.length < totalCommentsCount && (
          <div className="mt-6 text-center">
            <Button variant="outline" size="sm">
              Load more comments ({totalCommentsCount - comments.length}{" "}
              remaining)
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
