"use client";
import React, { useState, useEffect } from "react";
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
import CouponDialog from "@/components/dialogs/CouponDialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import PaginatorButtons from "@/components/ui/paginator-buttons";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Eye, Edit, Trash2, Info } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { TPricing } from "@/subpages/settings/subscription/PricingCards";
import { getSubscriptionTiers } from "@/services/admin";
import { parseISO, format as formatDate } from "date-fns";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  Dialog as UIDialog,
  DialogContent as UIDialogContent,
  DialogHeader as UIDialogHeader,
  DialogTitle as UIDialogTitle,
  DialogDescription as UIDialogDescription,
  DialogFooter as UIDialogFooter,
  DialogTrigger as UIDialogTrigger,
} from "@/components/ui/dialog";
import { useQuery as useTanstackQuery } from "@tanstack/react-query";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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
      (!Array.isArray(value) || value.length === 0)
    ) {
      return "is required for 'specific'";
    }
    return null;
  },
};

// Configure validate.js datetime validator to use date-fns for parsing and formatting
import validatejs from "validate.js";
import PageControl from "@/components/common/PageControl";
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

// Tag input key codes for react-tag-input
const KeyCodes = {
  comma: 188,
  enter: 13,
};
const delimiters = [KeyCodes.comma, KeyCodes.enter];

// Define a type for coupon details
interface CouponDetails {
  _id: string;
  title: string;
  description: string;
  code: string;
  discount_type: string;
  discount_value: number;
  start_date: string;
  end_date: string;
  usage_limit: number;
  used_count: number;
  is_active: boolean;
  applicable_to: string;
  applicable_users: {
    emails: string[];
    domains: string[];
    plans: string[];
  };
  is_deleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const page = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [domains, setDomains] = useState<ReactTag[]>([]);
  const [emails, setEmails] = useState<ReactTag[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Tabs state
  const [tab, setTab] = useState("all");

  // Coupons fetch
  const {
    data: couponsData,
    isLoading: couponsLoading,
    refetch: refetchCoupons,
  } = useQuery<{ data: any[]; total: number; page_size: number }>({
    queryKey: ["coupons", tab, currentPage, pageSize],
    queryFn: async () => {
      let url = `/superadmin/coupon?page=${currentPage}&page_size=${pageSize}`;
      if (tab === "active") {
        url = `/superadmin/coupon?status=active&page=${currentPage}&page_size=${pageSize}`;
      }
      const res = await axiosInstance.get(url);
      return res.data ?? res;
    },
  });

  console.log(couponsData);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<any>(null);

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [couponToView, setCouponToView] = useState<any>(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [couponToEdit, setCouponToEdit] = useState<string | null>(null);

  // Delete coupon
  const handleDelete = async () => {
    if (!couponToDelete) return;
    try {
      await axiosInstance.delete(`/superadmin/coupon/${couponToDelete._id}`);
      toast.success("Coupon deleted successfully!");
      setDeleteDialogOpen(false);
      setCouponToDelete(null);
      refetchCoupons();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete coupon");
    }
  };

  const onSubmit = async (values: any, form: any) => {
    setLoading(true);

    console.log(values);

    try {
      const payload = {
        ...values,
        discount_value: Number(values.discount_value),
        usage_limit: Number(values.usage_limit),
        applicable_domains:
          values.applicable_domains?.map((d: any) => d.id) || [],
        applicable_emails:
          values.applicable_emails?.map((e: any) => e.id) || [],
        applicable_plans:
          values.applicable_plans?.map((p: any) => p.label) || [],
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

  const tiersData = useQuery<TPricing[]>({
    queryKey: ["tiers"],
    queryFn: getSubscriptionTiers,
  });

  const navigatePage = (direction: "next" | "prev") => {
    setCurrentPage((prevIndex) => {
      if (direction === "next") {
        return prevIndex <
          (couponsData?.total
            ? Math.ceil(couponsData?.total / couponsData.page_size)
            : 0)
          ? prevIndex + 1
          : prevIndex;
      } else {
        return prevIndex > 1 ? prevIndex - 1 : prevIndex;
      }
    });
  };

  // Helper for email validation
  const isValidEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);
  // Helper for domain validation
  const isValidDomain = (domain: string) =>
    /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(domain);

  // New EditCouponDialog (reuse CouponDialog structure, but for editing)
  const EditCouponDialog = ({
    open,
    setOpen,
    couponId,
    onSuccess,
  }: {
    open: boolean;
    setOpen: (open: boolean) => void;
    couponId: string | null;
    onSuccess: () => void;
  }) => {
    // Fetch coupon details by id
    const { data, isLoading, error } = useTanstackQuery<CouponDetails | null>({
      queryKey: ["coupon-details", couponId],
      queryFn: async () => {
        if (!couponId) return null;
        const res = await axiosInstance.get(`/superadmin/coupon/${couponId}`);
        return res.data as CouponDetails;
      },
      enabled: !!couponId,
      gcTime: 0,
      staleTime: 0,
    });

    // Local state for domains and emails
    const [domains, setDomains] = React.useState<ReactTag[]>([]);
    const [emails, setEmails] = React.useState<ReactTag[]>([]);

    // When data changes or dialog opens, initialize state
    React.useEffect(() => {
      if (data && open) {
        setDomains(
          (data.applicable_users?.domains || []).map((d: string) => ({
            id: d,
            text: d,
            className: "",
          }))
        );
        setEmails(
          (data.applicable_users?.emails || []).map((e: string) => ({
            id: e,
            text: e,
            className: "",
          }))
        );
      }
    }, [data, open]);

    // Prepare initial values for CouponDialog
    const initialValues = data
      ? {
          title: data.title || "",
          description: data.description || "",
          discount_type: data.discount_type || "percentage",
          discount_value: data.discount_value || "",
          start_date: data.start_date ? data.start_date.slice(0, 10) : "",
          end_date: data.end_date ? data.end_date.slice(0, 10) : "",
          usage_limit: data.usage_limit || "",
          applicable_to: data.applicable_to || "all",
          applicable_domains: domains,
          applicable_emails: emails,
          applicable_plans: (data.applicable_users?.plans || []).map(
            (p: string) => ({ label: p, value: p })
          ),
        }
      : undefined;

    // Submit handler for editing
    const handleEdit = async (values: any, form: any) => {
      try {
        const payload = {
          ...values,
          discount_value: Number(values.discount_value),
          usage_limit: Number(values.usage_limit),
          applicable_domains:
            values.applicable_domains?.map((d: any) => d.id) || [],
          applicable_emails:
            values.applicable_emails?.map((e: any) => e.id) || [],
          applicable_plans:
            values.applicable_plans?.map((p: any) => p.label) || [],
        };
        await axiosInstance.patch(`/superadmin/coupon/${couponId}`, payload);
        toast.success("Coupon updated successfully!");
        setOpen(false);
        onSuccess();
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to update coupon");
      }
    };

    return (
      <CouponDialog
        open={open}
        setOpen={setOpen}
        loading={isLoading}
        domains={domains}
        setDomains={setDomains}
        emails={emails}
        setEmails={setEmails}
        onSubmit={handleEdit}
        defaultInitialValues={initialValues}
        couponConstraints={couponConstraints}
        delimiters={delimiters}
        isValidEmail={isValidEmail}
        isValidDomain={isValidDomain}
        planOptions={tiersData.data}
        mode="edit"
      />
    );
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Coupon Management</h1>
        <Button
          className="bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] text-white hover:from-[#5B03B2] hover:to-[#9D50BB]"
          onClick={() => setOpen(true)}
        >
          Create Coupon
        </Button>
        <CouponDialog
          open={open}
          setOpen={setOpen}
          loading={loading}
          domains={domains}
          setDomains={setDomains}
          emails={emails}
          setEmails={setEmails}
          onSubmit={onSubmit}
          defaultInitialValues={defaultInitialValues}
          couponConstraints={couponConstraints}
          delimiters={delimiters}
          isValidEmail={isValidEmail}
          isValidDomain={isValidDomain}
          planOptions={tiersData.data}
          mode="create"
        />
      </div>
      {/* Tabs for All/Active Coupons */}
      <Tabs value={tab} onValueChange={setTab} className="mb-4">
        <TabsList>
          <TabsTrigger value="all">All Coupons</TabsTrigger>
          <TabsTrigger value="active">Active Coupons</TabsTrigger>
        </TabsList>
      </Tabs>
      {/* Coupons Table */}
      <div className="border rounded-lg p-4 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {couponsLoading ? (
              // Table skeleton loader
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-gray-200 rounded w-40 animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-gray-200 rounded w-10 animate-pulse" />
                  </TableCell>
                </TableRow>
              ))
            ) : couponsData &&
              Array.isArray((couponsData as any).data) &&
              (couponsData as any).data.length > 0 ? (
              (couponsData as any).data.map((coupon: any) => (
                <TableRow key={coupon._id}>
                  <TableCell>{coupon.title}</TableCell>
                  <TableCell>{coupon.code}</TableCell>
                  <TableCell>{coupon.description}</TableCell>
                  <TableCell>
                    {coupon.discount_type === "percentage"
                      ? `${coupon.discount_value}%`
                      : `₦${coupon.discount_value}`}
                  </TableCell>
                  <TableCell>
                    {coupon.start_date
                      ? formatDate(parseISO(coupon.start_date), "MMM dd, yyyy")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {coupon.end_date
                      ? formatDate(parseISO(coupon.end_date), "MMM dd, yyyy")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {coupon.used_count ?? 0} / {coupon.usage_limit}
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        coupon.is_active ? "text-green-600" : "text-red-500"
                      }
                    >
                      {coupon.is_active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 rounded hover:bg-gray-100">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setCouponToView(coupon);
                            setViewDialogOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setCouponToEdit(coupon._id);
                            setEditDialogOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setCouponToDelete(coupon);
                            setDeleteDialogOpen(true);
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  No coupons found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {/* Pagination */}
        <div className="flex justify-center mt-10">
          <PageControl
            currentPage={currentPage}
            totalPages={
              couponsData?.total
                ? Math.ceil(couponsData?.total / couponsData.page_size)
                : 0
            }
            isLoading={couponsLoading}
            onNavigate={navigatePage}
          />
        </div>
      </div>
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Coupon</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this coupon? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* View Details Dialog (fetches full coupon data) */}
      <UIDialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <UIDialogContent className="max-w-lg w-full p-0 rounded-lg">
          {/* Creative colored header with icon */}
          <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] text-white rounded-t-lg">
            <Info className="w-6 h-6 text-white/80" />
            <div>
              <UIDialogTitle className="text-lg font-bold text-white">
                Coupon Details
              </UIDialogTitle>
              <UIDialogDescription className="text-white/80">
                Detailed information about this coupon.
              </UIDialogDescription>
            </div>
          </div>
          {/* Fetch coupon details by id for view */}
          <FetchCouponDetails couponId={couponToView} />
          <UIDialogFooter>
            <button
              className="mt-2 w-full py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
              onClick={() => setViewDialogOpen(false)}
              type="button"
            >
              Close
            </button>
          </UIDialogFooter>
        </UIDialogContent>
      </UIDialog>
      {/* Edit Coupon Dialog */}
      <EditCouponDialog
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
        couponId={couponToEdit}
        onSuccess={refetchCoupons}
      />
    </div>
  );
};

// Helper component to fetch and display coupon details
const FetchCouponDetails = ({
  couponId,
}: {
  couponId: { _id: string } | null;
}) => {
  const { data, isLoading, error } = useTanstackQuery<CouponDetails | null>({
    queryKey: ["coupon-details-view", couponId?._id],
    queryFn: async () => {
      if (!couponId?._id) return null;
      const res = await axiosInstance.get(
        `/superadmin/coupon/${couponId?._id}`
      );
      return res.data as CouponDetails;
    },
    enabled: !!couponId?._id,
  });

  console.log(data);

  if (isLoading) {
    return (
      <div className="px-6 py-8 text-center text-muted-foreground">
        Loading...
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="px-6 py-8 text-center text-red-500">
        Failed to load coupon details.
      </div>
    );
  }
  return (
    <div className="px-6 py-6">
      <div className="max-h-[60vh] overflow-y-auto space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground">Title</span>
            <span className="font-semibold text-lg">{data.title}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground">Code</span>
            <span className="font-mono bg-gray-100 rounded px-2 py-1 text-base text-purple-700 tracking-wider shadow-sm">
              {data.code}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground">Description</span>
            <span>
              {data.description || (
                <span className="italic text-gray-400">No description</span>
              )}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground">Discount</span>
            <span className="inline-flex items-center gap-2 font-medium">
              {data.discount_type === "percentage" ? (
                <>
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">
                    {data.discount_value}%
                  </span>{" "}
                  <span>off</span>
                </>
              ) : (
                <>
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                    ₦{data.discount_value}
                  </span>{" "}
                  <span>off</span>
                </>
              )}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground">Start Date</span>
            <span>
              {data.start_date
                ? formatDate(parseISO(data.start_date), "MMM dd, yyyy")
                : "-"}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground">End Date</span>
            <span>
              {data.end_date
                ? formatDate(parseISO(data.end_date), "MMM dd, yyyy")
                : "-"}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground">Usage</span>
            <span className="inline-flex items-center gap-2">
              <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-semibold">
                {data.used_count ?? 0}
              </span>
              <span className="text-gray-400">/</span>
              <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-semibold">
                {data.usage_limit}
              </span>
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground">Status</span>
            <span
              className={
                data.is_active
                  ? "text-green-600 font-semibold"
                  : "text-red-500 font-semibold"
              }
            >
              {data.is_active ? "Active" : "Inactive"}
            </span>
          </div>
          {data.applicable_to && (
            <div className="flex flex-col gap-2">
              <span className="text-xs text-muted-foreground">
                Applicable To
              </span>
              <span className="capitalize">{data.applicable_to}</span>
            </div>
          )}
          {data.applicable_users && (
            <div className="flex flex-col gap-2">
              <span className="text-xs text-muted-foreground">
                Applicable Users
              </span>
              <div className="flex flex-col gap-1">
                {data.applicable_users.emails?.length > 0 && (
                  <div>
                    <span className="font-semibold">Emails:</span>{" "}
                    {data.applicable_users.emails.join(", ")}
                  </div>
                )}
                {data.applicable_users.domains?.length > 0 && (
                  <div>
                    <span className="font-semibold">Domains:</span>{" "}
                    {data.applicable_users.domains.join(", ")}
                  </div>
                )}
                {data.applicable_users.plans?.length > 0 && (
                  <div>
                    <span className="font-semibold">Plans:</span>{" "}
                    {data.applicable_users.plans.join(", ")}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {/* Section divider */}
        <div className="border-t border-gray-200 my-2" />
      </div>
    </div>
  );
};

export default page;
