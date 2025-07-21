"use client";

import React, { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Loader2, FileQuestion, HelpCircle, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import axiosInstance from "@/lib/axios-instance";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import NavBar from "@/components/blocks/NavBar";
import DOMPurify from "isomorphic-dompurify";

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

const ParallaxBg = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 100, damping: 30, bounce: 0 };
  const y = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -50]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.5], [1, 0]),
    springConfig
  );

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity }}
      className="absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
      <div className="absolute inset-0 grid grid-cols-4 gap-4 p-8 opacity-50 pointer-events-none select-none">
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className="w-full aspect-square rounded-full bg-primary/5 animate-pulse blur-sm"
            style={{
              animationDelay: `${i * 0.1}s`,
              animationDuration: `${3 + i * 0.5}s`,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

const FloatingIcons = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {[HelpCircle, MessageCircle, FileQuestion].map((Icon, index) => (
        <motion.div
          key={index}
          className="absolute text-primary/20"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 5,
            delay: index * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            left: `${20 + index * 30}%`,
            top: `${10 + index * 15}%`,
          }}
        >
          <Icon size={40} />
        </motion.div>
      ))}
    </div>
  );
};

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
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  if (status === "pending") {
    return (
      <>
        <NavBar />
        <div className="relative min-h-screen">
          <ParallaxBg />
          <FloatingIcons />
          <div className="container mx-auto px-4 py-16 max-w-4xl">
            <div className="text-center mb-12">
              <Skeleton className="h-10 w-3/4 mx-auto mb-4" />
              <Skeleton className="h-4 w-2/4 mx-auto" />
            </div>
            <FAQSkeleton />
          </div>
        </div>
      </>
    );
  }

  const hasNoFAQs = data?.pages[0]?.data.length === 0;

  return (
    <>
      <NavBar />
      <div className="relative min-h-screen">
        <ParallaxBg />
        <FloatingIcons />
        <div className="container mx-auto px-4 py-16 max-w-4xl relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
            >
              <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Frequently Asked Questions
              </h1>
              <p className="text-muted-foreground text-lg">
                Find answers to common questions about our services
              </p>
            </motion.div>
          </motion.div>

          {hasNoFAQs ? (
            <EmptyState />
          ) : (
            <>
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-4 relative"
              >
                {data?.pages.map((page, pageIndex) => (
                  <React.Fragment key={pageIndex}>
                    {page.data.map((faq) => (
                      <motion.div
                        key={faq.id}
                        variants={item}
                        className="rounded-lg border bg-card/80 backdrop-blur-sm hover:bg-accent/5 transition-all duration-300 hover:shadow-lg"
                        whileHover={{
                          scale: 1.02,
                          transition: { duration: 0.2 },
                        }}
                      >
                        <Accordion type="single" collapsible>
                          <AccordionItem
                            className="border-none"
                            value={`item-${faq.id}`}
                          >
                            <AccordionTrigger className="text-left px-6 py-4 text-lg font-medium hover:no-underline group">
                              <div className="flex items-center gap-3 flex-1">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                  <span className="text-sm text-primary">
                                    Q
                                  </span>
                                </div>
                                <span className="text-left group-hover:text-primary transition-colors">
                                  {faq.question}
                                </span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                                className=""
                              >
                                <div className="pl-11 text-muted-foreground">
                                  <div
                                    className="prose prose-sm dark:prose-invert max-w-none bg-accent/5 rounded-lg p-4 py-0 backdrop-blur-sm"
                                    dangerouslySetInnerHTML={{
                                      __html: DOMPurify.sanitize(faq.answer),
                                    }}
                                  />
                                </div>
                              </motion.div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </motion.div>
                    ))}
                  </React.Fragment>
                ))}
              </motion.div>

              {hasNextPage && (
                <motion.div
                  className="flex justify-center mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    variant="outline"
                    size="lg"
                    className="w-full max-w-xs bg-card/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  >
                    {isFetchingNextPage ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading more questions...
                      </>
                    ) : (
                      "Load More Questions"
                    )}
                  </Button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default FAQPage;
