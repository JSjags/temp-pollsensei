"use client";

import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { Loader2, FileQuestion } from "lucide-react";
import { cn } from "@/lib/utils";
import axiosInstance from "@/lib/axios-instance";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import NavBar from "@/components/blocks/NavBar";

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface FAQResponse {
  data: FAQ[];
  total: number;
  page: number;
  page_size: number;
}

const FAQSkeleton = () => (
  <div className="space-y-6">
    {[1, 2, 3, 4, 5].map((i) => (
      <div
        key={i}
        className="rounded-lg border bg-card text-card-foreground shadow-sm p-4"
      >
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-4" />
        </div>
      </div>
    ))}
  </div>
);

const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-12"
  >
    <FileQuestion className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
    <h3 className="text-lg font-semibold mb-2">No FAQs Available</h3>
    <p className="text-muted-foreground max-w-sm mx-auto">
      We haven't added any frequently asked questions yet. Please check back
      later or contact us directly for any queries.
    </p>
  </motion.div>
);

const FAQPage = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["faqs"],
      queryFn: async ({ pageParam = 1 }) => {
        const response = await axiosInstance.get<FAQResponse>(
          `/faq?page=${pageParam}&page_size=20`
        );
        return response.data;
      },
      getNextPageParam: (lastPage) => {
        const totalPages = Math.ceil(lastPage.total / lastPage.page_size);
        if (lastPage.page < totalPages) {
          return lastPage.page + 1;
        }
        return undefined;
      },
      initialPageParam: 1,
    });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (status === "pending") {
    return (
      <>
        <NavBar />
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-3/4 mx-auto mb-4" />
            <Skeleton className="h-4 w-2/4 mx-auto" />
          </div>
          <FAQSkeleton />
        </div>
      </>
    );
  }

  const hasNoFAQs = data?.pages[0]?.data.length === 0;

  return (
    <>
      <NavBar />
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground">
            Find answers to common questions about our services
          </p>
        </motion.div>

        {hasNoFAQs ? (
          <EmptyState />
        ) : (
          <>
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-6"
            >
              {data?.pages.map((page, pageIndex) => (
                <React.Fragment key={pageIndex}>
                  {page.data.map((faq, index) => (
                    <motion.div
                      key={faq.id}
                      variants={item}
                      className="rounded-lg border bg-card text-card-foreground shadow-sm"
                    >
                      <Accordion type="single" collapsible>
                        <AccordionItem value={faq.id}>
                          <AccordionTrigger className="text-left">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent>{faq.answer}</AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </motion.div>
                  ))}
                </React.Fragment>
              ))}
            </motion.div>

            {hasNextPage && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  variant="outline"
                  size="lg"
                  className="w-full max-w-xs"
                >
                  {isFetchingNextPage ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "See More FAQs"
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default FAQPage;
