import FaqAccordion from "@/components/superadmin-faqs/FaqAccordion";
import React from "react";

const SuperAdminFaq = () => {
  const faqItems = [
    {
      question: "How do I create a survey?",
      answer: "You can create a survey by clicking on the 'Create Survey' button...",
    },
    {
      question: "Can I customize the survey design and layout?",
      answer: "Yes, you can customize the survey design and layout...",
    },
    {
      question: "Is my survey data kept confidential and secure?",
      answer: "Your survey data is kept confidential using our security measures...",
    },
  ];

  return (
    <div className="p-6">
      <FaqAccordion items={faqItems} />
    </div>
  );
};

export default SuperAdminFaq;
