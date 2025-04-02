"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
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
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import RichTextToolbar from "./RichTextToolbar";
import { CreateFAQSheet } from "./CreateFAQSheet";
import { useDispatch } from "react-redux";
import apiSlice from "@/services/config/apiSlice";

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
  answer: { presence: true, length: { minimum: 1 } },
};

// Replace the editorStyles object with:
const editorStyles = {
  minHeight: "150px",
  height: "100%",
  outline: "none",
  padding: "0.5rem",
} as const;

const FAQNavigation: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [createFAQs, { isLoading }] = useCreateFAQsMutation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
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
      setIsSheetOpen(false);
      toast.success("FAQ created successfully");
    } catch (err: any) {
      toast.dismiss();
      toast.error(
        `Failed to create FAQ: ${JSON.parse(err?.data)?.message || err.message}`
      );
    } finally {
      // Invalidate all queries to refresh data
      refetch();
    }
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

          <CreateFAQSheet
            isOpen={isSheetOpen}
            onOpenChange={setIsSheetOpen}
            onSubmit={onSubmit}
            isLoading={isLoading}
          />
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

          <CreateFAQSheet
            isOpen={isSheetOpen}
            onOpenChange={setIsSheetOpen}
            onSubmit={onSubmit}
            isLoading={isLoading}
            variant="small"
          />
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
