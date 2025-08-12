"use client";
import React, { FC, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { FaUser, FaRegCommentDots } from "react-icons/fa";
import { BsMegaphone, BsBookmarkFill } from "react-icons/bs";

interface ReportCardProps {
  report: any;
  onClick: (report: any) => void;
  isBookmarked?: boolean;
}

const ReportCard: FC<ReportCardProps> = ({ report, onClick, isBookmarked }) => {
  const [imageError, setImageError] = useState(false);

  const defaultImage =
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop";

  const handleClick = () => {
    onClick(report);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-transparent border-none"
      onClick={handleClick}
    >
      <CardContent className="p-0">
        <div className="flex h-auto">
          {/* Left Side - Text Content */}
          <div className="flex-1 pr-5 pl-2 py-3 flex flex-col justify-between">
            <div>
              {/* Author Info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-10 h-10">
                  <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                    <FaUser className="text-base text-black" />
                  </div>
                </div>
                <span className="text-sm text-black">
                  {report.published_by?.name || report.author || "Anonymous"}
                </span>
              </div>

              <h4 className="font-bold text-black mb-3 text-base leading-tight line-clamp-2">
                {report.survey_id.topic?.length > 30
                  ? `${report.survey_id.topic.slice(0, 30)}...`
                  : report.survey_id.topic}
              </h4>

              <p className="text-[#404040] text-[13px] leading-relaxed line-clamp-3 mb-4">
                {report.description?.length > 70
                  ? `${report.description.slice(0, 70)}...`
                  : report.description}
              </p>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-[#898989] text-sm">
                  {formatDate(report.published_at)}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <BsMegaphone className="text-[#898989] text-sm" />
                <span className="text-[#898989] text-sm">
                  {report.echoes_count || 0}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <FaRegCommentDots className="text-[#898989] text-sm" />
                <span className="text-[#898989] text-sm">
                  {report.comments_count || 0}
                </span>
              </div>
              {isBookmarked && (
                <BsBookmarkFill className="w-4 h-4 text-[#5B03B2]" />
              )}
            </div>
          </div>

          <div className="flex-1 relative overflow-hidden">
            <Image
              src={
                imageError
                  ? defaultImage
                  : report.thumbnail || report.image || defaultImage
              }
              alt={report.title}
              width={192}
              height={70}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 rounded-lg "
              loading="lazy"
              onError={handleImageError}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportCard;
