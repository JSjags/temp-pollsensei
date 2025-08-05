"use client";
import React, { FC, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import ReportCard from "@/components/blog/ReportCard";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter, useParams } from "next/navigation";
import { setSelectedReport } from "@/redux/slices/blog.slice";
import ReportActions from "@/components/blog/ReportActions";
import CommentSection from "@/components/blog/CommentSection";
import EchoModal from "@/components/blog/EchoModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { APP_KEYS } from "@/constants";
import {
  GetReportBySlug,
  GetReportCommentsAndReplies,
  GetMostRecentReport,
  ReportEcho,
  ReportBookmark,
  GetReportBookmark,
} from "@/services/api/apiRequest";
import {
  ReportCardSkeleton,
  BlogDetailsSkeleton,
} from "@/components/blog/Skeletons";
import { IoMdTime } from "react-icons/io";
import { toast } from "react-toastify";
import { fetchUserBalance } from "@/services/api/getUserBalance";

interface BlogDetailsProps {
  slug?: string;
}

const BlogDetails: FC<BlogDetailsProps> = ({ slug: propSlug }) => {
  const params = useParams();
  const slug = propSlug || (params?.slug as string);

  const [showEchoModal, setShowEchoModal] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isEchoed, setIsEchoed] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const user = useSelector((state: RootState) => state.user?.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();

  const showComments = useSelector(
    (state: RootState) => state.blogSlice.showComments
  );

  const navigateToReport = (slug: string) => {
    router.push(`/blog/${slug}`, { scroll: false });
  };

  const handleAuthRequired = (actionName: string) => {
    if (!user) {
      router.push("/login");
      return false;
    }
    return true;
  };

  // ============================================================================
  // Queries
  // ============================================================================

  const {
    data: reportData,
    isLoading: isReportLoading,
    error: reportError,
  } = useQuery({
    queryKey: [APP_KEYS.REPORTS_DETAILS, slug],
    queryFn: () => GetReportBySlug(slug),
    enabled: !!slug,
  });

  const { data: recentReportsResponse, isLoading: isRecentLoading } = useQuery({
    queryKey: [APP_KEYS.MOST_RECENT_REPORTS],
    queryFn: GetMostRecentReport,
  });

  const { data: commentsData, isLoading: isCommentsLoading } = useQuery({
    queryKey: [APP_KEYS.REPORT_COMMENTS, reportData?._id],
    queryFn: () => GetReportCommentsAndReplies(reportData?._id),
    enabled: !!reportData?._id,
  });

  const { data: userBalance, isLoading: isBalanceLoading } = useQuery({
    queryKey: [APP_KEYS.UNRESTRICTED_BALANCE, reportData?._id],
    queryFn: () => fetchUserBalance(),
    enabled: !!reportData?._id,
  });

  const { data: bookmarkData, isLoading: isLoadingBookmark } = useQuery({
    queryKey: [APP_KEYS.REPORTS_BOOKMARK_BY_ID, reportData?._id],
    queryFn: () => GetReportBookmark(reportData?._id),
    enabled: !!reportData?._id,
  });

  // ============================================================================
  // Mutations
  // ============================================================================

  const echoMutation = useMutation({
    mutationFn: ({
      reportId,
      number_of_echoes,
    }: {
      reportId: string;
      number_of_echoes: number | undefined;
    }) => ReportEcho(reportId, number_of_echoes),
    onSuccess: () => {
      setIsEchoed(true);
      queryClient.invalidateQueries({
        queryKey: [APP_KEYS.REPORTS_DETAILS, slug],
      });
      setShowEchoModal(false);
      toast.success("Report echoed successfully!");
    },
    onError: () => {
      toast.error("Failed to echo report");
    },
  });

  const bookmarkMutation = useMutation({
    mutationFn: (reportId: string) => ReportBookmark(reportId),
    onMutate: async () => {
      queryClient.invalidateQueries({
        queryKey: [APP_KEYS.REPORTS_BOOKMARK_BY_ID, reportData?._id],
      });
    },
    onSuccess: (data) => {
      toast.success(data.message || "Bookmark updated successfully!");
      queryClient.invalidateQueries({
        queryKey: [APP_KEYS.REPORTS_BOOKMARK_BY_ID, reportData?._id],
      });
    },
    onError: (error) => {
      console.error("Bookmark error:", error);
      toast.error("Failed to update bookmark. Please try again.");
    },
  });

  // ============================================================================
  // Effects
  // ============================================================================

  useEffect(() => {
    if (reportData && user) {
      setIsEchoed(reportData.is_echoed || false);
      setIsBookmarked(bookmarkData?.is_bookmarked || false);
    }
  }, [reportData, user, bookmarkData]);

  useEffect(() => {
    if (reportData) {
      const transformedReport = {
        id: reportData._id,
        ...reportData,
        author: reportData.published_by?.name || "Anonymous",
        image: reportData.thumbnail,
        date: new Date(reportData.published_at).toLocaleDateString(),
        views: reportData.echoes_count || 0,
        echoes: reportData.echoes_count || 0,
        comments: commentsData?.data || [],
        commentsCount: reportData.comments_count || 0,
        isBookmarked: isBookmarked,
      };

      dispatch(setSelectedReport(transformedReport));
    }
  }, [reportData, commentsData, dispatch, isBookmarked]);

  console.log("bookmarkData", bookmarkData);
  console.log("isBookmarked", isBookmarked);

  // ============================================================================
  // Action Handlers
  // ============================================================================

  const handleEcho = () => {
    if (!handleAuthRequired("Echo")) return;
    setShowEchoModal(true);
  };

  const handleComment = () => {
    if (!handleAuthRequired("Comment")) return;
    dispatch({ type: "blog/toggleComments" });
  };

  const handleShare = () => {
    if (!handleAuthRequired("Share")) return;
    // Share logic handled in ReportActions component
  };

  const handleBookmark = () => {
    if (!handleAuthRequired("Bookmark")) return;

    if (!reportData?._id) {
      toast.error("Report not found");
      return;
    }

    bookmarkMutation.mutate(reportData._id);
  };

  const handleEchoConfirm = (amount?: number | undefined) => {
    echoMutation.mutate({ reportId: reportData._id, number_of_echoes: amount });
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // ============================================================================
  // Helper Functions
  // ============================================================================

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(" ").length;
    return Math.ceil(words / wordsPerMinute);
  };

  const parseEditorContent = (content: string) => {
    try {
      const parsed = JSON.parse(content);
      return (
        parsed.blocks?.map((block: any) => block.data.text).join(" ") || content
      );
    } catch {
      return content;
    }
  };

  // ============================================================================
  // Render Logic
  // ============================================================================

  if (isReportLoading) {
    return <BlogDetailsSkeleton />;
  }

  if (reportError || !reportData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Report Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The report you&apos;re looking for doesn&apos;t exist.
          </p>
          <button
            onClick={() => router.push("/blog")}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            Back to Reports
          </button>
        </div>
      </div>
    );
  }

  const report = reportData;
  const defaultImage =
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop";
  const reportImage = imageError
    ? defaultImage
    : report.thumbnail || defaultImage;
  const parsedContent = parseEditorContent(report.content || "");
  const readTime = calculateReadTime(parsedContent);

  // Transform recent reports data properly
  const recentReports = Array.isArray(recentReportsResponse)
    ? recentReportsResponse
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Echo Modal */}
      <EchoModal
        isOpen={showEchoModal}
        onClose={() => setShowEchoModal(false)}
        onEcho={handleEchoConfirm}
        isLoading={echoMutation.isPending}
        userBalance={userBalance?.totalBalance}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="w-full">
          {/* Left Column - Article Content */}
          <div className="w-full">
            <article className="bg-white rounded-lg shadow-sm p-8">
              <h1 className="text-[69px] font-bold text-gray-900 mb-4">
                {report.title}
              </h1>

              <p className="text-gray-600 mb-6">{report.description}</p>

              <div className="flex items-center gap-4 mb-8 text-sm text-gray-500 pb-1 border-b-2 w-[25%]">
                <div className="w-auto flex items-center gap-1">
                  <IoMdTime className="text-gray-500 text-base" />
                  <span>{readTime} minute read</span>
                </div>
                <div className="w-auto flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>{formatDate(report.published_at)}</span>
                </div>
              </div>

              <div
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: parsedContent }}
              />

              {/* Author and Actions */}
              <div className="border-t pt-6 mt-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {(report.published_by?.name || "A")
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    </div>
                    <span className="font-semibold">
                      {report.published_by?.name || "Anonymous"}
                    </span>
                  </div>

                  {/* Report Actions with API Bookmark */}
                  <ReportActions
                    reportId={report._id}
                    reportTitle={report.title}
                    onEcho={handleEcho}
                    onComment={handleComment}
                    onShare={handleShare}
                    onBookmark={handleBookmark}
                    echoes={report.echoes_count || 0}
                    comments={report.comments_count || 0}
                    isEchoed={isEchoed}
                    isBookmarked={isBookmarked}
                    isAuthenticated={!!user}
                    isBookmarkLoading={bookmarkMutation.isPending}
                    isEchoLoading={echoMutation.isPending}
                  />
                </div>

                {/* Tags */}
                <div className="flex gap-2 mt-4">
                  {report.fields_of_interest?.map((field: any) => (
                    <Badge key={field._id} variant="secondary">
                      {field.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </article>

            {/* Comments or Similar Reports Section */}
            <div className="mt-12">
              {showComments ? (
                <CommentSection
                  reportId={report._id}
                  onHideReplies={() =>
                    dispatch({ type: "report/toggleComments" })
                  }
                />
              ) : (
                <section className="animate-in slide-in-from-top-4 duration-300">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">
                    Similar reports
                  </h2>
                  <div className="space-y-6">
                    {isRecentLoading ? (
                      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                          <ReportCardSkeleton key={index} />
                        ))}
                      </div>
                    ) : recentReports.length > 0 ? (
                      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-3">
                        {recentReports.map((report: any) => (
                          <ReportCard
                            key={report._id}
                            report={report}
                            onClick={() => navigateToReport(report.slug)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">
                          No recent reports available
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BlogDetails;
