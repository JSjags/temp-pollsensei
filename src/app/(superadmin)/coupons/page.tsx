"use client";
import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import validate from "validate.js";
import axiosInstance from "@/lib/axios-instance";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import MultiSelectField from "@/components/ui/MultipleSelect";
import { parse, format } from "date-fns";
import { WithContext as ReactTagInput, Tag as ReactTag } from "react-tag-input";

type Props = {};

const couponConstraints = {
  title: { presence: { allowEmpty: false, message: "is required" } },
  discount_type: {
    presence: true,
    inclusion: {
      within: ["percentage", "fixed"],
      message: "^must be 'percentage' or 'fixed'",
    },
  },
  discount_value: { presence: true, numericality: { greaterThan: 0 } },
  start_date: { presence: true, datetime: true },
  end_date: { presence: true, datetime: true },
  usage_limit: {
    presence: true,
    numericality: { onlyInteger: true, greaterThan: 0 },
  },
  applicable_to: {
    presence: true,
    inclusion: {
      within: ["specific", "all"],
      message: "^must be 'specific' or 'all'",
    },
  },
  applicable_domains: function (value: any, attributes: any) {
    if (
      attributes.applicable_to === "specific" &&
      (!value || value.length === 0)
    ) {
      return { presence: true, message: "is required for 'specific'" };
    }
    return null;
  },
};

// Configure validate.js datetime validator to use date-fns for parsing and formatting
import validatejs from "validate.js";
validatejs.validators.datetime.parse = function (value: string) {
  // Parse from 'YYYY-MM-DD' to timestamp
  return parse(value, "yyyy-MM-dd", new Date()).getTime();
};
validatejs.validators.datetime.format = function (
  value: number,
  options?: any
) {
  // Format timestamp to 'YYYY-MM-DD'
  return format(new Date(value), "yyyy-MM-dd");
};

const defaultInitialValues = {
  title: "",
  description: "",
  discount_type: "percentage",
  discount_value: "",
  start_date: "",
  end_date: "",
  usage_limit: "",
  applicable_to: "all",
  applicable_domains: [],
  applicable_emails: [],
  applicable_plans: [],
};

const domainOptions = [
  { value: "oaksintelligence.co", label: "oaksintelligence.co" },
  { value: "example.com", label: "example.com" },
];
const planOptions = [
  { value: "basic", label: "Basic" },
  { value: "pro", label: "Pro" },
];

// Tag input key codes for react-tag-input
const KeyCodes = {
  comma: 188,
  enter: 13,
};
const delimiters = [KeyCodes.comma, KeyCodes.enter];

const page = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [domains, setDomains] = useState<ReactTag[]>([]);
  const [emails, setEmails] = useState<ReactTag[]>([]);

  const onSubmit = async (values: any, form: any) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        discount_value: Number(values.discount_value),
        usage_limit: Number(values.usage_limit),
        applicable_domains:
          values.applicable_domains?.map((d: any) => d.value) || [],
        applicable_emails:
          values.applicable_emails?.map((e: any) => e.value) || [],
        applicable_plans:
          values.applicable_plans?.map((p: any) => p.value) || [],
      };
      await axiosInstance.post("/superadmin/coupon", payload);
      toast.success("Coupon created successfully!");
      setOpen(false);
      form.restart();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create coupon");
    } finally {
      setLoading(false);
    }
  };

  // Helper for email validation
  const isValidEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);
  // Helper for domain validation
  const isValidDomain = (domain: string) =>
    /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(domain);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Coupon Management</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setOpen(true)}>Create Coupon</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl rounded-2xl shadow-2xl border border-gray-100 bg-white">
            <DialogHeader>
              <DialogTitle>Create Coupon</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new coupon.
              </DialogDescription>
            </DialogHeader>
            <Form
              onSubmit={onSubmit}
              initialValues={defaultInitialValues}
              validate={(values) => validatejs(values, couponConstraints)}
              render={({ handleSubmit, form, submitting, values }) => (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-8 divide-y divide-gray-100"
                >
                  <div>
                    <h2 className="text-xl font-bold mb-4 text-primary">
                      Coupon Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Title"
                        name="title"
                        type="text"
                        placeholder="Coupon Title"
                        form={form}
                      />
                      <div className="mt-4">
                        <TextArea
                          label="Description"
                          name="description"
                          type="text"
                          placeholder="Description (optional)"
                          form={form}
                        />
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="block mb-1">Discount Type</label>
                          <Select
                            value={values.discount_type}
                            onValueChange={(val) =>
                              form.change("discount_type", val)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="percentage">
                                Percentage
                              </SelectItem>
                              <SelectItem value="fixed">Fixed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Input
                          label="Discount Value"
                          name="discount_value"
                          type="number"
                          placeholder="e.g. 20"
                          form={form}
                        />
                      </div>
                      <div className="flex gap-4">
                        <Input
                          label="Start Date"
                          name="start_date"
                          type="date"
                          form={form}
                        />
                        <Input
                          label="End Date"
                          name="end_date"
                          type="date"
                          form={form}
                        />
                      </div>
                      <Input
                        label="Usage Limit"
                        name="usage_limit"
                        type="number"
                        placeholder="e.g. 5"
                        form={form}
                      />
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="block mb-1">Applicable To</label>
                          <Select
                            value={values.applicable_to}
                            onValueChange={(val) =>
                              form.change("applicable_to", val)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All</SelectItem>
                              <SelectItem value="specific">Specific</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-8">
                    <h2 className="text-xl font-bold mb-4 text-primary">
                      Applicability
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {values.applicable_to === "specific" && (
                        <div>
                          <label className="block mb-1 font-medium">
                            Applicable Domains
                          </label>
                          <ReactTagInput
                            tags={domains}
                            delimiters={delimiters}
                            handleDelete={(i) =>
                              setDomains(domains.filter((_, idx) => idx !== i))
                            }
                            handleAddition={(tag) => {
                              if (isValidDomain(tag.id)) {
                                setDomains([
                                  ...domains,
                                  { ...tag, className: "" },
                                ]);
                              }
                            }}
                            handleDrag={(tag, currPos, newPos) => {
                              const newTags = [...domains];
                              newTags.splice(currPos, 1);
                              newTags.splice(newPos, 0, tag);
                              setDomains(newTags);
                            }}
                            inputFieldPosition="bottom"
                            placeholder="Type and press enter to add domain"
                            autofocus={false}
                            allowUnique
                            minQueryLength={2}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            e.g. oaksintelligence.co
                          </p>
                          {form.getState().submitFailed &&
                            form.getState().errors?.applicable_domains && (
                              <span className="text-red-600 text-xs">
                                {form.getState().errors?.applicable_domains}
                              </span>
                            )}
                        </div>
                      )}
                      <div>
                        <label className="block mb-1 font-medium">
                          Applicable Emails
                        </label>
                        <ReactTagInput
                          tags={emails}
                          delimiters={delimiters}
                          handleDelete={(i) =>
                            setEmails(emails.filter((_, idx) => idx !== i))
                          }
                          handleAddition={(tag) => {
                            if (isValidEmail(tag.id)) {
                              setEmails([...emails, { ...tag, className: "" }]);
                            }
                          }}
                          handleDrag={(tag, currPos, newPos) => {
                            const newTags = [...emails];
                            newTags.splice(currPos, 1);
                            newTags.splice(newPos, 0, tag);
                            setEmails(newTags);
                          }}
                          inputFieldPosition="bottom"
                          placeholder="Type and press enter to add email"
                          autofocus={false}
                          allowUnique
                          minQueryLength={2}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          e.g. user@email.com
                        </p>
                        {form.getState().submitFailed &&
                          form.getState().errors?.applicable_emails && (
                            <span className="text-red-600 text-xs">
                              {form.getState().errors?.applicable_emails}
                            </span>
                          )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block mb-1">Applicable Plans</label>
                    <Field name="applicable_plans">
                      {({ input, meta }: { input: any; meta: any }) => (
                        <MultiSelectField
                          input={input}
                          meta={meta}
                          label="Plans (optional)"
                          options={planOptions}
                        />
                      )}
                    </Field>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={submitting || loading}>
                      {loading ? "Creating..." : "Create Coupon"}
                    </Button>
                  </DialogFooter>
                </form>
              )}
            />
          </DialogContent>
        </Dialog>
      </div>
      {/* Placeholder for coupons table and management features */}
      <div className="border rounded-lg p-8 text-center text-muted-foreground">
        <p className="text-lg">
          Coupons table and management features coming soon...
        </p>
      </div>
    </div>
  );
};

export default page;
