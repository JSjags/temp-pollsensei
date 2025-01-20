"use client";

import { Button } from "@/components/ui/button";
import { ContentType } from "@/data/learning-resources";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConditionalRender } from "../common/AppTabs";
import AllResources from "./AllResources";
import VideoResources from "./VideoResource";
import WebArticles from "./WebArticles";

const contentTypes: ContentType[] = [
  "All resources",
  "Video tutorials",
  "Web Articles",
];

interface ResourceTab {
  content: JSX.Element;
  contentType: ContentType;
}

export default function LearningResources() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);

  const tabs: ResourceTab[] = [
    {
      content: <AllResources key={0} />,
      contentType: "All resources",
    },
    {
      content: <VideoResources key={1} />,
      contentType: "Video tutorials",
    },
    {
      content: <WebArticles key={2} />,
      contentType: "Web Articles",
    },
  ];

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
              {tabs.map(({ contentType }, index) => (
                <button
                  key={contentType}
                  onClick={() => setActiveTab(index)}
                  className={`pb-2 text-sm font-medium transition-colors duration-300 ${
                    activeTab === index
                      ? "text-purple-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {contentType}
                </button>
              ))}
            </div>
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-purple-600"
              initial={false}
              animate={{
                width: `${100 / contentTypes.length}%`,
                x: `${activeTab * 100}%`,
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
            {tabs?.map(({ content }, index) => (
              <ConditionalRender condition={activeTab === index} key={index}>
                {content}
              </ConditionalRender>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
