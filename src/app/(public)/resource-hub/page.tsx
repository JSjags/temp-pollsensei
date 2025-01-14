"use client"


import NavBar from "@/components/blocks/NavBar";
import ChatWidget from "@/components/resource-hub/chat-widget";
import ContactUs from "@/components/resource-hub/contact-us";
// import FeatureComing from "@/components/common/FeatureComing";
import Help from "@/components/resource-hub/hero";
import KnowledgeBase from "@/components/resource-hub/knowledge-base";
import ResourceActions from "@/components/resource-hub/resoure-action";
import React, { useState } from "react";

type Props = {};

const Page = (props: Props) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);

  const toggleChat = () => setIsChatOpen(!isChatOpen);
  const minimizeChat = () => setIsChatMinimized(!isChatMinimized);
  const closeChat = () => {
    setIsChatOpen(false);
    setIsChatMinimized(false);
  };
  return (
    <section className="mt-2 min-h-[50vh] relative">
    <Help />
    <ResourceActions onClick={toggleChat} />
    <KnowledgeBase />
    <ContactUs />
    <ChatWidget isChatMinimized={isChatMinimized} isChatOpen={isChatOpen} minimizeChat={minimizeChat} closeChat={closeChat} />
  </section>
  )
};

export default Page;
