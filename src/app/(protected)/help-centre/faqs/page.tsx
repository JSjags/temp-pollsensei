"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import faqData from "@/data/faqs.json";
import Link from "next/link";
import { Fade, Slide } from "react-awesome-reveal";

export default function FAQComponent() {
  return (
    <div className="container mx-auto p-4 md:p-8 md:px-4">
      <Fade triggerOnce delay={500}>
        <Slide direction="left" triggerOnce>
          <nav className="my-6 mt-2 text-gray-500 " aria-label="Breadcrumb">
            <ol className="list-none p-0 inline-flex">
              <li className="flex items-center">
                <Link
                  href="/help-centre"
                  className="hover:text-purple-600 text-base"
                >
                  Help Center
                </Link>
                <ChevronRight className="h-4 w-4 mx-2" />
              </li>
              <li className="flex items-center text-base text-foreground">
                Frequently Asked Questions
              </li>
            </ol>
          </nav>
        </Slide>
      </Fade>

      <div className="flex flex-col items-center mt-14">
        <Accordion
          type="single"
          collapsible
          className="space-y-4 max-w-4xl w-full"
        >
          <Fade>
            <Slide direction="up" triggerOnce>
              {faqData.faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-2 border-transparent hover:shadow-[#9D50BB50] hover:border-[#9D50BB] rounded-lg overflow-hidden shadow-[0_5px_10px_#00000010]"
                >
                  <AccordionTrigger
                    buttonClassName="text-white p-1 bg-[#9D50BB] rounded-full flex justify-center items-center size-6 md:size-8"
                    className="flex justify-between items-center w-full p-4 md:p-8 text-left text-lg font-medium hover:no-underline text-purple-900"
                  >
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 md:px-8 pt-0 bg-white">
                    <p className="text-gray-600">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Slide>
          </Fade>
        </Accordion>
      </div>
    </div>
  );
}
