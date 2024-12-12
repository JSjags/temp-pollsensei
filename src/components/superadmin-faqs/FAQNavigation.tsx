"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "../ui/sheet";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useCreateFAQsMutation } from "@/services/superadmin.service";
import { ClipLoader } from "react-spinners";
import { Form, Field } from "react-final-form";
import validate from "validate.js";
import Input from "../ui/Input";
import { toast } from "react-toastify";
import TextArea from "../ui/TextArea";

interface Tab {
  label: string;
  value: string;
}

const slugify = (tab: string) => {
  return tab.toLowerCase().replace(/\s+/g, "-");
};
const constraints = {
  question: {
    presence: true,
  },
  answer: {
    presence: true,
  },
};

const FAQNavigation: React.FC = () => {
  const tabs: Tab[] = useMemo(
    () => [
      { label: "All FAQs", value: "faqs" },
      { label: "Live FAQs", value: "live-faqs" },
      { label: "Draft FAQs", value: "drafts" },
    ],
    []
  );
  const [createFAQs, { isLoading, isSuccess, error }] = useCreateFAQsMutation();
  const pathname = usePathname();

  const getActiveTabFromPath = useCallback(
    (path: string) => {
      const matchedTab = tabs?.find((tab) => path.includes(slugify(tab.value)));
      return matchedTab || "faqs";
    },
    [tabs]
  );

  const [activeTab, setActiveTab] = useState(getActiveTabFromPath(pathname));

  useEffect(() => {
    setActiveTab(getActiveTabFromPath(pathname));
  }, [getActiveTabFromPath, pathname]);

  const RoutePath = (tab: string) => {
    if (pathname.includes("faqs")) {
      return tab === "faqs" ? `/faqs` : `/faqs/${slugify(tab)}`;
    }
    return "/";
  };
  const onSubmit = async (values: { email: string; password: string }) => {
    try {
      await createFAQs(values).unwrap();
      toast.success("Faq created successfully");
    } catch (err: any) {
      toast.error(
        "Failed to create faq " + (err?.data?.message || err.message)
      );
      console.error("Failed to log in user", err);
    }
  };

  const validateForm = (values: any) => {
    return validate(values, constraints) || {};
  };
  

  return (
    <div className="flex items-center justify-between w-full  p-4">
      {/* Tabs */}
      <div className="flex space-x-8">
        {tabs.map((tab) => (
          <Link
            href={RoutePath(tab.value)}
            key={tab.value}
            className={`text-sm font-medium pb-2 ${
              activeTab === tab.value
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </Link>
        ))}
      </div>
      <Sheet>
        <SheetTrigger>
          <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-400 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg focus:outline-none">
            Create FAQ
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full md:w-1/3 bg-white flex flex-col gap-5">
          <SheetHeader>
            <SheetTitle>Create New FAQ</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <Form
              onSubmit={onSubmit}
              validate={validateForm}
              render={({ handleSubmit, form, submitting }) => (
                <form onSubmit={handleSubmit} className="w-full">
                  <Field name="question">
                    {({ input, meta }) => (
                      <Input
                        label="Question"
                        type="text"
                        placeholder="Enter Title"
                        form={form as any}
                        {...input}
                      />
                    )}
                  </Field>

                  <Field name="answer">
                    {({ input, meta }) => (
                      <TextArea
                        placeholder="Type brief description"
                        label="Answer"
                        form={form as any}
                        {...input}
                        name="answer"
                        type="text"
                      />
                    )}
                  </Field>

                  <div className="flex items-center justify-end space-x-4 w-full">
                    <SheetTrigger>
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
                    type="reset"
                    >
                      Cancel
                    </button>
                    </SheetTrigger>
                    <button
                      className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-400 rounded-md hover:shadow-lg"
                      type="submit"
                    >
                      {submitting || isLoading ? (
                        <ClipLoader size={20} />
                      ) : (
                        " Save and Continue"
                      )}
                    </button>
                  </div>
                </form>
              )}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default FAQNavigation;
