"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "../ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import {
  useAllFAQsQuery,
  useCreateFAQsMutation,
} from "@/services/superadmin.service";
import { ClipLoader } from "react-spinners";
import { Form, Field } from "react-final-form";
import validate from "validate.js";
import { Input } from "../ui/shadcn-input";
import { toast } from "react-toastify";
import { Textarea } from "../ui/shadcn-textarea";
import { Menu, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Tab {
  label: string;
  value: string;
}

const tabs: Tab[] = [
  { label: "All FAQs", value: "faqs" },
  { label: "Live FAQs", value: "live-faqs" },
  { label: "Draft FAQs", value: "drafts" },
];

const constraints = {
  question: { presence: true },
  answer: { presence: true },
};

const FAQNavigation: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [createFAQs, { isLoading }] = useCreateFAQsMutation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { refetch } = useAllFAQsQuery({
    pagesNumber: 1,
  });

  const currentTab = useMemo(() => {
    const path = pathname.split("/").pop() || "faqs";
    return tabs.find((tab) => tab.value === path)?.value || "faqs";
  }, [pathname]);

  const handleTabChange = (value: string) => {
    const basePath = "/faqs";
    const newPath = value === "faqs" ? basePath : `${basePath}/${value}`;
    router.push(newPath);
    setIsMobileMenuOpen(false);
  };

  const onSubmit = async (values: { question: string; answer: string }) => {
    try {
      await createFAQs(values).unwrap();
      toast.success("FAQ created successfully");
      refetch();
    } catch (err: any) {
      toast.error(`Failed to create FAQ: ${err?.data?.message || err.message}`);
    }
  };

  // Move CreateFAQButton inside FAQNavigation to access onSubmit
  const CreateFAQButton = ({
    variant = "default",
  }: {
    variant?: "default" | "small";
  }) => {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button
            className={cn(
              "bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] text-white",
              "hover:opacity-90 transition-all duration-300",
              variant === "small" ? "px-3 py-1.5 text-sm" : "px-4 py-2"
            )}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create FAQ
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold text-gray-800">
              Create New FAQ
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <Form
              onSubmit={onSubmit}
              validate={(values) => validate(values, constraints) || {}}
              render={({ handleSubmit, submitting }) => (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Field name="question">
                    {({ input }) => (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Question</label>
                        <Input
                          {...input}
                          placeholder="Enter your question here"
                          className="w-full"
                        />
                      </div>
                    )}
                  </Field>

                  <Field name="answer">
                    {({ input }) => (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Answer</label>
                        <Textarea
                          {...input}
                          placeholder="Type detailed answer here..."
                          className="min-h-[150px] resize-none"
                        />
                      </div>
                    )}
                  </Field>

                  <SheetFooter>
                    <SheetTrigger asChild>
                      <Button variant="outline">Cancel</Button>
                    </SheetTrigger>
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="bg-gradient-to-r from-[#5B03B2] to-[#9D50BB]"
                    >
                      {submitting ? (
                        <ClipLoader size={20} color="#ffffff" />
                      ) : (
                        "Save FAQ"
                      )}
                    </Button>
                  </SheetFooter>
                </form>
              )}
            />
          </div>
        </SheetContent>
      </Sheet>
    );
  };

  return (
    <div className="w-full bg-transparent">
      {/* Desktop Navigation */}
      <div className="hidden md:block w-full">
        <div className="flex items-center justify-between px-0 py-4 border-b bg-transparent backdrop-blur-md">
          <Tabs
            value={currentTab}
            onValueChange={handleTabChange}
            className="w-full max-w-3xl"
          >
            <TabsList className="grid grid-cols-3 w-[400px] bg-muted/50">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={cn(
                    "data-[state=active]:bg-white relative overflow-hidden",
                    "after:content-[''] after:absolute after:bottom-0 after:left-0",
                    "after:h-0.5 after:w-full after:bg-purple-600",
                    "after:transform after:scale-x-0 after:transition-transform",
                    "data-[state=active]:after:scale-x-100"
                  )}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <CreateFAQButton />
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden w-full bg-transparent backdrop-blur-md border-b">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="hover:bg-purple-50"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <CreateFAQButton variant="small" />
        </div>

        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            isMobileMenuOpen ? "max-h-[300px]" : "max-h-0"
          )}
        >
          <Tabs
            value={currentTab}
            onValueChange={handleTabChange}
            className="w-full p-4"
          >
            <TabsList className="flex flex-col w-full gap-2 bg-transparent">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="w-full data-[state=active]:bg-purple-50 data-[state=active]:text-purple-600 justify-start"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default FAQNavigation;
