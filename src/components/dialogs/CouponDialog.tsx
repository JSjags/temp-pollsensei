import React, { useEffect } from "react";
import { Form, Field } from "react-final-form";
import { Input } from "@/components/ui/shadcn-input";
import { Textarea } from "@/components/ui/shadcn-textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import MultiSelectField from "@/components/ui/MultipleSelect";
import { WithContext as ReactTagInput, Tag as ReactTag } from "react-tag-input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TPricing } from "@/subpages/settings/subscription/PricingCards";

interface CouponDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  loading: boolean;
  domains: ReactTag[];
  setDomains: (tags: ReactTag[]) => void;
  emails: ReactTag[];
  setEmails: (tags: ReactTag[]) => void;
  onSubmit: (values: any, form: any) => Promise<void>;
  defaultInitialValues: any;
  couponConstraints: any;
  delimiters: number[];
  isValidEmail: (email: string) => boolean;
  isValidDomain: (domain: string) => boolean;
  planOptions: TPricing[] | undefined;
  mode?: "create" | "edit";
}

const CouponDialog: React.FC<CouponDialogProps> = ({
  open,
  setOpen,
  loading,
  domains,
  setDomains,
  emails,
  setEmails,
  onSubmit,
  defaultInitialValues,
  couponConstraints,
  delimiters,
  isValidEmail,
  isValidDomain,
  planOptions,
  mode = "create",
}) => {
  // Add a custom tag render function for shadcn-style tags
  const renderTag = (props: any) => {
    const { tag, key, disabled, onRemove, className, ...other } = props;
    return (
      <span
        key={key}
        className={
          "inline-flex items-center bg-muted border border-border px-2 py-1 rounded-full text-xs mr-2 mb-2" +
          (className ? ` ${className}` : "")
        }
        {...other}
      >
        {tag.text}
        {!disabled && (
          <button
            type="button"
            className="ml-1 text-muted-foreground hover:text-destructive"
            onClick={onRemove}
          >
            ×
          </button>
        )}
      </span>
    );
  };

  // Helper to get today in yyyy-mm-dd
  const today = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(
    today.getDate()
  )}`;

  const tagClassName =
    "inline-flex items-center bg-muted border border-border px-2 py-1 rounded-full text-xs mr-2 mb-2";

  // Helper to ensure all tags have the correct className
  const normalizeTags = (tags: ReactTag[]) =>
    tags.map((tag) => ({ ...tag, className: tagClassName }));

  useEffect(() => {
    // Only normalize if tags are missing className
    if (domains.some((tag) => !tag.className)) {
      setDomains(normalizeTags(domains));
    }
    if (emails.some((tag) => !tag.className)) {
      setEmails(normalizeTags(emails));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultInitialValues, setDomains, setEmails]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-w-2xl rounded-2xl shadow-2xl border border-gray-100 bg-white p-0 z-[100000]"
        overlayClassName="z-[100000]"
      >
        <ScrollArea className="max-h-[90vh] p-6 py-0">
          <DialogHeader className="px-2 py-4 border-b border-border mb-4 sticky top-0 bg-white">
            <DialogTitle className="text-xl font-bold text-primary">
              {mode === "edit" ? "Edit Coupon" : "Create Coupon"}
            </DialogTitle>
            <DialogDescription>
              {mode === "edit"
                ? "Update the details of this coupon."
                : "Fill in the details to create a new coupon."}
            </DialogDescription>
          </DialogHeader>
          <Form
            onSubmit={onSubmit}
            initialValues={defaultInitialValues}
            validate={(values) => {
              const errors: Record<string, string> = {};
              if (!values.title) errors.title = "Title is required";
              if (!values.discount_type)
                errors.discount_type = "Discount type is required";
              if (!values.discount_value || Number(values.discount_value) <= 0)
                errors.discount_value = "Discount value must be greater than 0";
              if (!values.start_date)
                errors.start_date = "Start date is required";
              if (!values.end_date) errors.end_date = "End date is required";
              if (!values.usage_limit || Number(values.usage_limit) <= 0)
                errors.usage_limit = "Usage limit must be greater than 0";
              if (!values.applicable_to)
                errors.applicable_to = "Applicable to is required";
              if (
                values.applicable_to === "specific" &&
                (!Array.isArray(values.applicable_domains) ||
                  values.applicable_domains.length === 0)
              ) {
                errors.applicable_domains = "At least one domain is required";
              }
              // Date logic
              if (values.start_date && values.end_date) {
                if (values.start_date > values.end_date) {
                  errors.start_date = "Start date must be before end date";
                  errors.end_date = "End date must be after start date";
                }
              }
              // Add more as needed...
              return errors;
            }}
            render={({ handleSubmit, form, submitting, values }) => {
              // Sync local state to form values for validation
              useEffect(() => {
                form.change("applicable_domains", domains);
                form.change("applicable_emails", emails);
              }, [domains, emails, form]);
              return (
                <form onSubmit={handleSubmit} className="space-y-8 px-2 pb-8">
                  <div>
                    {/* <h2 className="text-lg font-medium mb-4 text-primary">
                      Coupon Details
                    </h2> */}
                    <div className="flex flex-col gap-4">
                      <div className="mb-4">
                        <label
                          htmlFor="title"
                          className="block mb-1 font-medium"
                        >
                          Title
                        </label>
                        <Field name="title">
                          {({ input, meta }) => (
                            <>
                              <Input
                                {...input}
                                id="title"
                                type="text"
                                placeholder="Coupon Title"
                                className="w-full"
                              />
                              {meta.touched && meta.error && (
                                <span className="text-red-600 text-xs">
                                  {meta.error}
                                </span>
                              )}
                            </>
                          )}
                        </Field>
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="description"
                          className="block mb-1 font-medium"
                        >
                          Description
                        </label>
                        <Field name="description">
                          {({ input, meta }) => (
                            <>
                              <Textarea
                                {...input}
                                placeholder="Description (optional)"
                              />
                              {meta.touched && meta.error && (
                                <span className="text-red-600 text-xs">
                                  {meta.error}
                                </span>
                              )}
                            </>
                          )}
                        </Field>
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
                        <div className="flex-1">
                          <label
                            htmlFor="discount_value"
                            className="block mb-1 font-medium"
                          >
                            Discount Value
                          </label>
                          <Field name="discount_value">
                            {({ input, meta }) => (
                              <>
                                <Input
                                  {...input}
                                  id="discount_value"
                                  type="number"
                                  placeholder="e.g. 20"
                                  className="w-full"
                                />
                                {meta.touched && meta.error && (
                                  <span className="text-red-600 text-xs">
                                    {meta.error}
                                  </span>
                                )}
                              </>
                            )}
                          </Field>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label
                            htmlFor="start_date"
                            className="block mb-1 font-medium"
                          >
                            Start Date
                          </label>
                          <Field name="start_date">
                            {({ input, meta }) => (
                              <>
                                <Input
                                  {...input}
                                  id="start_date"
                                  type="date"
                                  className="w-full"
                                  min={todayStr}
                                  max={values.end_date || undefined}
                                />
                                {meta.touched && meta.error && (
                                  <span className="text-red-600 text-xs">
                                    {meta.error}
                                  </span>
                                )}
                              </>
                            )}
                          </Field>
                        </div>
                        <div className="flex-1">
                          <label
                            htmlFor="end_date"
                            className="block mb-1 font-medium"
                          >
                            End Date
                          </label>
                          <Field name="end_date">
                            {({ input, meta }) => (
                              <>
                                <Input
                                  {...input}
                                  id="end_date"
                                  type="date"
                                  className="w-full"
                                  min={values.start_date || todayStr}
                                />
                                {meta.touched && meta.error && (
                                  <span className="text-red-600 text-xs">
                                    {meta.error}
                                  </span>
                                )}
                              </>
                            )}
                          </Field>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label
                            htmlFor="usage_limit"
                            className="block mb-1 font-medium"
                          >
                            Usage Limit
                          </label>
                          <Field name="usage_limit">
                            {({ input, meta }) => (
                              <>
                                <Input
                                  {...input}
                                  id="usage_limit"
                                  type="number"
                                  placeholder="e.g. 5"
                                  className="w-full"
                                />
                                {meta.touched && meta.error && (
                                  <span className="text-red-600 text-xs">
                                    {meta.error}
                                  </span>
                                )}
                              </>
                            )}
                          </Field>
                        </div>
                        <div className="flex-1">
                          <label className="block mb-1">Applicable To</label>
                          <Field name="applicable_to">
                            {({ input, meta }) => (
                              <>
                                <Select
                                  value={input.value}
                                  onValueChange={input.onChange}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="specific">
                                      Specific
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                {meta.touched && meta.error && (
                                  <span className="text-red-600 text-xs">
                                    {meta.error}
                                  </span>
                                )}
                              </>
                            )}
                          </Field>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-4 text-primary">
                      Applicability
                    </h2>
                    {values.applicable_to === "specific" && (
                      <div className="flex gap-4 mt-4">
                        <div className="flex-1">
                          <label className="block mb-1 font-medium">
                            Applicable Domains
                          </label>
                          <div className="border rounded-md p-2 bg-background">
                            <ReactTagInput
                              tags={domains}
                              delimiters={delimiters}
                              handleDelete={(i) =>
                                setDomains(
                                  domains.filter((_, idx) => idx !== i)
                                )
                              }
                              handleAddition={(tag) => {
                                if (isValidDomain(tag.id)) {
                                  setDomains([
                                    ...domains,
                                    {
                                      ...tag,
                                      className:
                                        "inline-flex items-center bg-muted border border-border px-2 py-1 rounded-full text-xs mr-2 mb-2",
                                    },
                                  ]);
                                }
                              }}
                              handleDrag={(tag, currPos, newPos) => {
                                const newTags = [...domains];
                                newTags.splice(currPos, 1);
                                newTags.splice(newPos, 0, tag);
                                setDomains(newTags);
                              }}
                              inputFieldPosition="top"
                              placeholder="Type and press enter to add domain"
                              autofocus={false}
                              allowUnique
                              minQueryLength={2}
                              classNames={{
                                //   tags: "tagsClass",
                                //   tagInput: "tagInputClass",
                                tagInputField:
                                  "w-full !border-none focus:border-transparent focus-within:border-transparent focus-within:border-transparent outline-none ring-0 focus:outline-none focus:ring-0 focus-within:outline-none focus-within:ring-0",
                                selected: emails.length <= 1 ? "pt-2" : "pt-0",
                                tag: "bg-gradient-to-r rounded-full from-[#5B03B2] to-[#9D50BB] text-white hover:from-[#5B03B2] hover:to-[#9D50BB] gap-2",
                                //   remove: "removeClass",
                                //   suggestions: "bg-red-500",
                                activeSuggestion: "activeSuggestionClass",
                                //   editTagInput: "bg-red-500",
                                editTagInputField: "editTagInputField",
                                clearAll: "text-xs !mt-2 hover:text-purple-700",
                              }}
                            />
                          </div>
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
                        <div className="flex-1">
                          <label className="block mb-1 font-medium">
                            Applicable Emails
                          </label>
                          <div className="border rounded-md p-2 bg-background">
                            <ReactTagInput
                              tags={emails}
                              delimiters={delimiters}
                              handleDelete={(i) =>
                                setEmails(emails.filter((_, idx) => idx !== i))
                              }
                              handleAddition={(tag) => {
                                if (isValidEmail(tag.id)) {
                                  setEmails([
                                    ...emails,
                                    {
                                      ...tag,
                                      className:
                                        "inline-flex items-center bg-muted border border-border px-2 py-1 rounded-full text-xs mr-2 mb-2",
                                    },
                                  ]);
                                }
                              }}
                              handleDrag={(tag, currPos, newPos) => {
                                const newTags = [...emails];
                                newTags.splice(currPos, 1);
                                newTags.splice(newPos, 0, tag);
                                setEmails(newTags);
                              }}
                              inputFieldPosition="top"
                              placeholder="Type and press enter to add email"
                              autofocus={false}
                              allowUnique
                              minQueryLength={2}
                              clearAll={emails.length > 1}
                              classNames={{
                                tags: "tagsClass",
                                //   tagInput: "tagInputClass",
                                tagInputField:
                                  "w-full !border-none focus:border-transparent focus-within:border-transparent focus-within:border-transparent outline-none ring-0 focus:outline-none focus:ring-0 focus-within:outline-none focus-within:ring-0",
                                selected: emails.length <= 1 ? "pt-2" : "pt-0",
                                tag: "bg-gradient-to-r rounded-full from-[#5B03B2] to-[#9D50BB] text-white hover:from-[#5B03B2] hover:to-[#9D50BB] gap-2",
                                //   remove: "removeClass",
                                //   suggestions: "bg-red-500",
                                activeSuggestion: "activeSuggestionClass",
                                //   editTagInput: "bg-red-500",
                                editTagInputField: "editTagInputField",
                                clearAll: "text-xs !mt-2 hover:text-purple-700",
                              }}
                            />
                          </div>
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
                    )}
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">
                      Applicable Plans (optional)
                    </label>
                    <Field name="applicable_plans">
                      {({ input, meta }: { input: any; meta: any }) => (
                        <MultiSelectField
                          input={input}
                          meta={meta}
                          label=""
                          options={
                            planOptions?.map((plan) => ({
                              value: plan._id,
                              label: plan.name,
                            })) || []
                          }
                          disabled={!planOptions}
                          customStyles={{
                            control: (base: any, state: any) => ({
                              ...base,
                              borderColor: state.isFocused
                                ? "#6b21a8"
                                : base.borderColor,
                              boxShadow: state.isFocused
                                ? "0 0 0 1px #6b21a8"
                                : base.boxShadow,
                              "&:hover": {
                                borderColor: "#6b21a8",
                              },
                              minHeight: 40,
                              // borderRadius: 9999, // pill shape
                              // paddingLeft: 4,
                            }),
                            option: (base: any, state: any) => ({
                              ...base,
                              backgroundColor: state.isFocused
                                ? "#F3E8FF"
                                : base.backgroundColor,
                              color: state.isFocused ? "#5B03B2" : base.color,
                              // borderRadius: 9999, // pill shape for dropdown options
                              // margin: "2px 4px",
                              padding: "6px 16px",
                            }),
                            multiValue: (base: any) => ({
                              ...base,
                              background:
                                "linear-gradient(to right, #5B03B2, #9D50BB)",
                              color: "#fff",
                              borderRadius: 9999, // pill shape
                              padding: "2px 10px",
                              fontSize: "0.875rem",
                              fontWeight: 500,
                              margin: "2px 4px",
                              // width: "fit-content",
                            }),
                            multiValueLabel: (base: any) => ({
                              ...base,
                              color: "#fff",
                              padding: 0,
                            }),
                            multiValueRemove: (base: any) => ({
                              ...base,
                              color: "#fff",
                              background: "transparent",
                              borderRadius: "9999px",
                              ":hover": {
                                background: "#fff",
                                color: "#5B03B2",
                              },
                            }),
                          }}
                        />
                      )}
                    </Field>
                  </div>
                  <DialogFooter>
                    <Button
                      className="bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] text-white hover:from-[#5B03B2] hover:to-[#9D50BB]"
                      type="submit"
                      disabled={submitting || loading}
                    >
                      {loading
                        ? mode === "edit"
                          ? "Updating..."
                          : "Creating..."
                        : mode === "edit"
                        ? "Update Coupon"
                        : "Create Coupon"}
                    </Button>
                  </DialogFooter>
                </form>
              );
            }}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CouponDialog;
