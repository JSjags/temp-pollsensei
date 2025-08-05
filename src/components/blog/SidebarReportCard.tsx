"use client";
import React, { FC, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ReportCardProps {
  report: any;
  onClick: (report: any) => void;
  variant?: "default" | "compact";
}

const SidebarReportCard: FC<ReportCardProps> = ({
  report,
  onClick,
  variant = "default",
}) => {
  const [imageError, setImageError] = useState(false);

  const defaultImage =
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop";

  const handleClick = () => {
    onClick(report);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) return `${diffMinutes} MINS AGO`;
    if (diffHours < 24) return `${diffHours} HRS AGO`;
    return `${diffDays} DAYS AGO`;
  };

  if (variant === "compact") {
    return (
      <Card
        className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow h-full"
        onClick={handleClick}
      >
        <div className="aspect-square">
          <Image
            src={
              imageError
                ? defaultImage
                : report.thumbnail || report.image || defaultImage
            }
            alt={report.title}
            width={150}
            height={150}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        </div>
        <CardContent className="px-3 py-2">
          <div className="flex items-center gap-1 mb-2">
            <div className="w-2 h-2 bg-[#FF3E3E] rounded-full" />
            <span className="text-xs font-semibold text-gray-500">
              {formatTimeAgo(report.published_at)}
            </span>
          </div>

          <h4 className="font-bold text-sm mb-2 line-clamp-2 leading-tight">
            {report.title?.length > 25
              ? `${report.title.slice(0, 25)}...`
              : report.title}
          </h4>

          <p className="text-xs line-clamp-2 mb-3 text-gray-600">
            {report.description?.length > 35
              ? `${report.description.slice(0, 35)}...`
              : report.description}
          </p>

          <Button
            variant="default"
            size="sm"
            className="bg-[#ECEDF0] hover:bg-[#ECEDF0] text-black w-full text-xs font-extrabold h-8"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            READ REPORT
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow h-full"
      onClick={handleClick}
    >
      <div className="aspect-video">
        <Image
          src={
            imageError
              ? defaultImage
              : report.thumbnail || report.image || defaultImage
          }
          alt={report.title}
          width={300}
          height={200}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      </div>
      <CardContent className="px-3 py-2">
        <div className="flex items-center gap-1 mb-2">
          <div className="w-2 h-2 bg-[#FF3E3E] rounded-full" />
          <span className="text-xs font-semibold text-gray-500">
            {formatTimeAgo(report.published_at)}
          </span>
        </div>

        <h4 className="font-bold text-base mb-2 line-clamp-2">
          {report.title?.length > 40
            ? `${report.title.slice(0, 40)}...`
            : report.title}
        </h4>

        <p className="text-sm line-clamp-2 mb-3 text-gray-600">
          {report.description?.length > 60
            ? `${report.description.slice(0, 60)}...`
            : report.description}
        </p>

        <Button
          variant="default"
          size="sm"
          className="bg-[#ECEDF0] hover:bg-[#ECEDF0] text-black w-full text-sm font-extrabold"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          READ REPORT
        </Button>
      </CardContent>
    </Card>
  );
};

export default SidebarReportCard;
