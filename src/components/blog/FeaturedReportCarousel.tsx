"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import {
  FaChevronLeft,
  FaChevronRight,
  FaUser,
  FaRegCommentDots,
} from "react-icons/fa";
import { BsMegaphone } from "react-icons/bs";

interface FeaturedReport {
  _id: string;
  title: string;
  description: string;
  published_by: {
    name: string;
  };
  thumbnail?: string;
  image?: string;
  fields_of_interest?: Array<{ name: string }>;
  published_at: string;
  echoes_count: number;
  comments_count: number;
  slug: string;
  survey_id: {
    _id: string;
    topic: string;
  };
}

interface FeaturedReportCarouselProps {
  reports: FeaturedReport[];
  onReportClick: (report: FeaturedReport) => void;
}

const FeaturedReportCarousel: React.FC<FeaturedReportCarouselProps> = ({
  reports,
  onReportClick,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const defaultImage =
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop";

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? reports.length - 1 : prev - 1));
    setImageError(false); // Reset image error for new report
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === reports.length - 1 ? 0 : prev + 1));
    setImageError(false); // Reset image error for new report
  };

  const handleCardClick = () => {
    onReportClick(reports[currentIndex]);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (!reports || reports.length === 0) {
    return (
      <div className="h-80 bg-gray-100 rounded-xl flex items-center justify-center">
        <p className="text-gray-500">No reports available</p>
      </div>
    );
  }

  const currentReport = reports[currentIndex];

  if (!currentReport) return null;

  return (
    <Card
      className="h-auto mb-8 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow rounded-xl relative"
      onClick={handleCardClick}
    >
      {/* Image Section with Overlay */}
      <div className="relative h-80">
        <Image
          src={
            imageError
              ? defaultImage
              : currentReport.thumbnail || currentReport.image || defaultImage
          }
          alt={currentReport.title}
          width={800}
          height={800}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />

        {/* White overlay with transparency */}
        <div className="absolute bottom-0 left-0 inset-0 bg-white bg-opacity-30" />

        {/* Navigation Arrows */}
        {reports.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full flex items-center justify-center transition-all shadow-lg z-10"
              aria-label="Previous report"
            >
              <FaChevronLeft className="w-4 h-4 text-gray-700" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full flex items-center justify-center transition-all shadow-lg z-10"
              aria-label="Next report"
            >
              <FaChevronRight className="w-4 h-4 text-gray-700" />
            </button>
          </>
        )}

        {/* Carousel Indicators */}
        {reports.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {reports.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                  setImageError(false);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? "bg-white" : "bg-white bg-opacity-50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 bg-transparent opacity-80">
        {/* Author Info */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative w-10 h-10">
            <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
              <FaUser className="text-base text-gray-500" />
            </div>
          </div>
          <span className="text-sm font-medium text-gray-700">
            {currentReport.published_by?.name || "Anonymous"}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg lg:text-[44px] text-[#333333] mb-3 leading-tight capitalize">
          {currentReport.survey_id?.topic}
        </h3>

        {/* Description */}
        <p className="text-[#404040] text-xs mb-4 leading-relaxed">
          {currentReport.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {currentReport.fields_of_interest?.map((field, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 text-[#333333] text-[10px] rounded-full"
            >
              {field.name}
            </span>
          ))}
        </div>

        {/* Footer with Date and Stats */}
        <div className="flex items-center justify-end gap-4 text-sm text-gray-500">
          {/* Green dot with date */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm text-[#898989]">
              {formatDate(currentReport.published_at)}
            </span>
          </div>

          {/* Views/Echoes with megaphone icon */}
          <div className="flex items-center gap-1">
            <BsMegaphone className="text-sm text-[#898989]" />
            <span className="text-sm text-[#898989]">
              {currentReport.echoes_count || 0}
            </span>
          </div>

          {/* Comments with comment icon */}
          <div className="flex items-center gap-1">
            <FaRegCommentDots className="text-sm text-[#898989]" />
            <span className="text-sm text-[#898989]">
              {currentReport.comments_count || 0}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FeaturedReportCarousel;
