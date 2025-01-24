import { motion } from "framer-motion";
import { FileText, PlayCircle } from "lucide-react";
import Image from "next/image";

import { ITutorial } from "@/types/api/tutorials.types";
import AppLoadingSkeleton from "@/components/common/AppLoadingSkeleton";
import { ChatBotIcon } from "@/components/icons";

export function ResourceCard({
  resource,
  index,
}: {
  resource: ITutorial;
  index: number;
}) {
  const colors = [
    "bg-green-200",
    "bg-yellow-200",
    "bg-blue-400",
    "bg-green-200",
    "bg-pink-300",
    "bg-purple-300",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "linear" }}
      className="bg-white rounded-xl scale-100 shadow-md overflow-hidden cursor-pointer border-2 hover:border-2 border-transparent hover:shadow-[#9D50BB50] hover:border-[#9D50BB] p-4 hover:!scale-105 hover:shadow-2xl transition-all"
    >
      <div
        className={`${
          colors[index % colors.length]
        } aspect-video relative rounded-lg`}
      >
        {resource?.media?.[0]?.type?.includes("image") ? (
          <Image
            height={100}
            width={100}
            className="w-full object-cover aspect-video"
            src={resource?.media?.[0]?.url}
            alt=""
          />
        ) : resource?.media?.[0]?.type?.includes("video") ? (
          <video loop muted autoPlay className="w-full">
            <source src={resource?.media?.[0]?.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="w-full bg-white/90 text-3xl md:text-4xl lg:text-5xl aspect-video flex items-center justify-center">
            <ChatBotIcon />
          </div>
          // <PlayCircle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white h-12 w-12" />
          // <FileText className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white h-12 w-12" />
        )}
      </div>
      <div className="pt-4">
        <h3 className="font-semibold mb-2">{resource.title}</h3>
        <div className="flex items-center text-sm text-gray-600">
          {resource.type === "video" && <PlayCircle className="mr-1 h-4 w-4" />}
          {resource.type === "article" && <FileText className="mr-1 h-4 w-4" />}
          {/* {resource.mediaType === "both" && (
                <>
                  <PlayCircle className="mr-1 h-4 w-4" />
                  <FileText className="mr-1 h-4 w-4" />
                </>
              )} */}
          {/* <span>{resource.duration}</span> */}
        </div>
      </div>
    </motion.div>
  );
}

export function ResourceCardLoader() {
  return (
    <div className="flex shadow rounded-md gap-y-4 flex-col">
      <AppLoadingSkeleton className="rounded w-full aspect-video" />

      <div className="flex w-full flex-col px-3 pb-5 gap-y-2">
        <AppLoadingSkeleton className="w-[60%] h-4" />
        <AppLoadingSkeleton className="w-[40%] h-3" />
      </div>
    </div>
  );
}
