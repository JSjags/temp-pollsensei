"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, PlayCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  learningResources,
  ContentType,
  LearningResource,
} from "@/data/learning-resources";
import { useRouter } from "next/navigation";

const contentTypes: ContentType[] = [
  "All resources",
  "Video tutorials",
  "Web Articles",
];

export default function LearningResources() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ContentType>("All resources");

  const filteredResources = learningResources.filter((resource) =>
    resource.contentType.includes(activeTab)
  );

  return (
    <div className="container mx-auto p-4 px-0 md:p-8 md:px-0">
      <div className="mb-8">
        <Button
          variant="ghost"
          className="mb-4 hover:bg-transparent hover:text-purple-600"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
        </Button>
        <div className="max-w-fit mx-auto">
          <h2 className="text-sm text-purple-600 mb-2 text-center font-bold">
            GET STARTED
          </h2>
          <h1 className="text-3xl font-bold mb-6 text-center">
            Start Learning
          </h1>
          <div className="relative mb-8 w-fit">
            <div className="flex space-x-4 border-b border-gray-200 px-2">
              {contentTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveTab(type)}
                  className={`pb-2 text-sm font-medium transition-colors duration-300 ${
                    activeTab === type
                      ? "text-purple-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-purple-600"
              initial={false}
              animate={{
                width: `${100 / contentTypes.length}%`,
                x: `${contentTypes.indexOf(activeTab) * 100}%`,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-6xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource, index) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  index={index}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function ResourceCard({
  resource,
  index,
}: {
  resource: LearningResource;
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
        {resource.mediaType === "video" || resource.mediaType === "both" ? (
          <PlayCircle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white h-12 w-12" />
        ) : (
          <FileText className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white h-12 w-12" />
        )}
      </div>
      <div className="pt-4">
        <h3 className="font-semibold mb-2">{resource.title}</h3>
        <div className="flex items-center text-sm text-gray-600">
          {resource.mediaType === "video" && (
            <PlayCircle className="mr-1 h-4 w-4" />
          )}
          {resource.mediaType === "article" && (
            <FileText className="mr-1 h-4 w-4" />
          )}
          {resource.mediaType === "both" && (
            <>
              <PlayCircle className="mr-1 h-4 w-4" />
              <FileText className="mr-1 h-4 w-4" />
            </>
          )}
          <span>{resource.duration}</span>
        </div>
      </div>
    </motion.div>
  );
}
