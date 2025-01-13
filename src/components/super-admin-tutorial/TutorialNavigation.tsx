"use client";

import React, { useCallback, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "../ui/sheet";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ClipLoader } from "react-spinners";
import { Form, Field } from "react-final-form";
import Input from "../ui/Input";
import TextArea from "../ui/TextArea";
import validate from "validate.js";
import { toast } from "react-toastify";
import { useCreateTutorialMutation } from "@/services/superadmin.service";
import SelectTag from "../ui/SelectTag";
import FileInput from "../ui/FileInput";

interface Tab {
  label: string;
  value: string;
}

const slugify = (tab: string) => {
  return tab.toLowerCase().replace(/\s+/g, "-");
};

const constraints = {
  type: {
    presence: true,
  },
  title: {
    presence: true,
  },
  description: {
    presence: true,
  },
  file: {
    presence: true,
  },
  links: {
    presence: false,
  },
};

const TutorialNavigation: React.FC = () => {
  const [activeTab, setActiveTab] = useState("");
  const [createTutorial, { isLoading, isSuccess, error }] =
    useCreateTutorialMutation();

  const tabs: Tab[] = [
    { label: "All Resources", value: "" },
    { label: "Video Tutorials", value: "video-tutorial" },
    { label: "Web articles", value: "web-articles" },
  ];

  const pathname = usePathname();
  const getActiveTabFromPath = useCallback(
    (path: string) => {
      const matchedTab = tabs?.find((tab) => path.includes(slugify(tab.value)));
      return matchedTab || "tutorials";
    },
    [tabs]
  );

  const RoutePath = (tab: string) => {
    if (pathname.includes("tutorials")) {
      return tab === "tutorials" ? `/tutorials` : `/tutorials/${slugify(tab)}`;
    }
    return "/";
  };

  const onSubmit = async (values: { type: string; title: string, description:string, links:string, file:any }) => {
    const formData = new FormData();
    formData.append("type", values.type)
    formData.append("title", values.title)
    formData.append("description", values.description)
    formData.append("links", values.links)
    if (values.links) {
      formData.append("links", values.links);
    }
    if (values.file && values.file.length > 0) {
      formData.append("file", values.file[0]); 
    } else {
      toast.error("Please upload a file to proceed.");
      return;
    }
    console.log(formData)
    try {
      await createTutorial(formData).unwrap();
      toast.success("Tutorial created successfully");
    } catch (err: any) {
      toast.error(
        "Failed to create tutorial " + (err?.data?.message || err.message)
      );
      console.error("Failed to create tutorial", err);
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

      <Sheet >
        <SheetTrigger>
          <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-400 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg focus:outline-none">
            Add New Tutorial
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full md:w-1/3 bg-white overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Create New Tutorial</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <Form
              onSubmit={onSubmit}
              validate={validateForm}
              render={({ handleSubmit, form, submitting,  }) => (
                <form onSubmit={handleSubmit} className="w-full">
                  <Field name="type">
                    {({ input, meta }) => (
                      <SelectTag
                        label="Type"
                        options={[
                          { value: "video", label: "Video" },
                          { value: "image", label: "Image" },
                          { value: "Link", label: "Link" },
                        ]}
                        placeholder="Select a Tutorial type"
                        form={form as any}
                        {...input}
                      />
                    )}
                  </Field>
                  <Field name="title">
                    {({ input, meta }) => (
                      <Input
                        label="Title"
                        type="text"
                        placeholder="Enter Title"
                        form={form as any}
                        {...input}
                      />
                    )}
                  </Field>

                  <Field name="description">
                    {({ input, meta }) => (
                      <TextArea
                        placeholder="Type brief description"
                        label="Description"
                        form={form as any}
                        {...input}
                        name="description"
                        type="text"
                      />
                    )}
                  </Field>

                  <Field name="file">
                    {({ input, meta }) => (
                      <FileInput
                        // name="file"
                        form={form as any}
                        {...input}
                        
                      />
                    )}
                  </Field>

                  <Field name="links">
                    {({ input, meta }) => (
                      <Input
                        label="Add Links to resources"
                        type="text"
                        placeholder="..."
                        form={form as any}
                        {...input}
                      />
                    )}
                  </Field>

                  <div className="flex items-center justify-end space-x-4 w-full">
                    <SheetTrigger>
                      <button
                        className="px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
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

export default TutorialNavigation;
