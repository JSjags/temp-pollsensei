"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ScaleLoader } from "react-spinners";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Coins,
  DollarSign,
  TrendingUp,
  Package,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Power,
  PowerOff,
  X,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/shadcn-input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/shadcn-checkbox";
import { ReactSelectMulti } from "@/components/ui/react-select-multi";
import TextArea from "@/components/ui/TextArea";
import { IPollcoinBundle } from "@/types/pollcoin-bundle";
import Image from "next/image";
import { Pollcoin } from "@/assets/images";
import axiosInstance from "@/lib/axios-instance";
import { useToast } from "@/hooks/use-toast";

type Props = {};

// Dummy data
const dummyBundles: IPollcoinBundle[] = [
  {
    id: "1",
    name: "Starter Pack",
    amount: 100,
    price: 5.99,
    discount_type: "none",
    tag: "popular",
    currency: "USD",
    is_active: true,
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Early Bird Special",
    amount: 500,
    price: 24.99,
    discount_type: "percentage",
    percentage: 20,
    tag: "early bird",
    currency: "USD",
    is_active: true,
    created_at: "2024-01-10T08:15:00Z",
    updated_at: "2024-01-10T08:15:00Z",
  },
  {
    id: "3",
    name: "Premium Bundle",
    amount: 1000,
    price: 45.99,
    discount_type: "bonus",
    bonus: 200,
    tag: "premium",
    currency: "USD",
    is_active: true,
    created_at: "2024-01-05T14:20:00Z",
    updated_at: "2024-01-05T14:20:00Z",
  },
  {
    id: "4",
    name: "Nigerian Starter",
    amount: 200,
    price: 2500,
    discount_type: "none",
    tag: "local",
    currency: "NGN",
    is_active: false,
    created_at: "2024-01-20T12:00:00Z",
    updated_at: "2024-01-20T12:00:00Z",
  },
  {
    id: "5",
    name: "Mega Pack",
    amount: 2500,
    price: 99.99,
    discount_type: "percentage",
    percentage: 15,
    tag: "mega",
    currency: "USD",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
];

// Custom hook for fetching pollcoin bundles
const usePollcoinBundles = (
  filters: {
    page?: number;
    pageSize?: number;
    currency?: string;
    status?: string;
    region?: string;
    searchTerm?: string;
    tag?: string;
  } = {}
) => {
  const {
    page = 1,
    pageSize = 10,
    currency,
    status,
    region,
    searchTerm,
    tag,
  } = filters;

  return useQuery({
    queryKey: [
      "pollcoin-bundles",
      page,
      pageSize,
      currency,
      status,
      region,
      searchTerm,
      tag,
    ],
    queryFn: async () => {
      // Build query parameters
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("page_size", pageSize.toString());

      if (currency && currency !== "all") params.append("currency", currency);
      if (status && status !== "all") params.append("status", status);
      if (region && region !== "all") params.append("region", region);
      if (searchTerm) params.append("search_term", searchTerm);
      if (tag && tag !== "all") params.append("tag", tag);

      const response = await axiosInstance.get(
        `/superadmin/pricing/pollcoin?${params.toString()}`
      );
      console.log("Pollcoin bundles response:", response);

      // Handle the response structure: { success: true, message: "...", data: { data: [...], total: 1, page: 1, page_size: 10 } }
      let bundlesData = [];
      let totalCount = 0;
      let currentPage = page;
      let currentPageSize = pageSize;

      if (
        (response as any)?.success &&
        response?.data?.data &&
        Array.isArray(response.data.data)
      ) {
        // Transform the data to match our interface
        bundlesData = response.data.data.map((bundle: any) => ({
          ...bundle,
          id: bundle._id, // Add id for compatibility
          is_active: bundle.status === "published", // Convert status to is_active
          created_at: bundle.createdAt,
          updated_at: bundle.updatedAt,
        }));

        // Extract pagination info
        totalCount = response.data.total || 0;
        currentPage = response.data.page || page;
        currentPageSize = response.data.page_size || pageSize;
      } else if (Array.isArray(response)) {
        // Fallback for direct array response
        bundlesData = response;
        totalCount = response.length;
      } else if (response?.data && Array.isArray(response.data)) {
        // Fallback for response.data array
        bundlesData = response.data;
        totalCount = response.data.length;
      }

      console.log("Processed bundles data:", bundlesData);
      return {
        data: bundlesData,
        total: totalCount,
        page: currentPage,
        pageSize: currentPageSize,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// Custom hook for creating pollcoin bundle
const useCreatePollcoinBundle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bundleData: Partial<IPollcoinBundle>) => {
      const response = await axiosInstance.post(
        "/superadmin/pricing/pollcoin",
        bundleData
      );
      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch pollcoin bundles
      queryClient.invalidateQueries({ queryKey: ["pollcoin-bundles"] });
    },
  });
};

// Custom hook for updating pollcoin bundle
const useUpdatePollcoinBundle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...bundleData
    }: { id: string } & Partial<IPollcoinBundle>) => {
      const response = await axiosInstance.patch(
        `/superadmin/pricing/pollcoin/${id}`,
        bundleData
      );
      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch pollcoin bundles
      queryClient.invalidateQueries({ queryKey: ["pollcoin-bundles"] });
    },
  });
};

// Custom hook for deleting pollcoin bundle
const useDeletePollcoinBundle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.delete(
        `/superadmin/pricing/pollcoin/${id}`
      );
      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch pollcoin bundles
      queryClient.invalidateQueries({ queryKey: ["pollcoin-bundles"] });
    },
  });
};

// Custom hook for fetching regions
const useRegions = () => {
  return useQuery({
    queryKey: ["regions"],
    queryFn: async () => {
      const response = await axiosInstance.get("/country/regions");
      console.log("Regions response:", response);
      console.log(
        "Regions response structure:",
        JSON.stringify(response, null, 2)
      );

      // The axios instance already unwraps the response, so we access the data directly
      // Handle different possible response structures
      let regionsData = [];

      if (Array.isArray(response)) {
        // If response is directly an array
        regionsData = response;
      } else if (response?.data && Array.isArray(response.data)) {
        // If response has a data property that's an array
        regionsData = response.data;
      } else if (
        (response as any)?.success &&
        response?.data &&
        Array.isArray(response.data)
      ) {
        // If response has success: true and data array
        regionsData = response.data;
      }

      console.log("Extracted regions data:", regionsData);
      return regionsData;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Custom hook for fetching countries by region
const useCountriesByRegion = (regionId: string | null) => {
  return useQuery({
    queryKey: ["countries", regionId],
    queryFn: async () => {
      if (!regionId) return [];
      const response = await axiosInstance.get(`/country/region/${regionId}`);
      console.log("Countries response:", response);

      // Handle different possible response structures
      let countriesData = [];

      if (Array.isArray(response)) {
        // If response is directly an array
        countriesData = response;
      } else if (response?.data && Array.isArray(response.data)) {
        // If response has a data property that's an array
        countriesData = response.data;
      } else if (
        (response as any)?.success &&
        response?.data &&
        Array.isArray(response.data)
      ) {
        // If response has success: true and data array
        countriesData = response.data;
      }

      return countriesData;
    },
    enabled: !!regionId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Custom hook for fetching available tags
const useTags = () => {
  return useQuery({
    queryKey: ["pollcoin-tags"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        "/superadmin/pricing/pollcoin/tags"
      );
      console.log("Tags response:", response);

      let tagsData = [];
      if (Array.isArray(response)) {
        tagsData = response;
      } else if (response?.data && Array.isArray(response.data)) {
        tagsData = response.data;
      } else if (
        (response as any)?.success &&
        response?.data &&
        Array.isArray(response.data)
      ) {
        tagsData = response.data;
      }
      return tagsData;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

const PollcoinsPage = (props: Props) => {
  // Toast hook
  const { toast, success, error: toastError } = useToast();

  // Filter state
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 10,
    currency: "all",
    status: "all",
    region: "all",
    searchTerm: "",
    tag: "all",
  });

  // TanStack Query hooks
  const {
    data: bundlesResponse,
    isLoading,
    error,
    refetch,
  } = usePollcoinBundles(filters);
  const createBundleMutation = useCreatePollcoinBundle();
  const updateBundleMutation = useUpdatePollcoinBundle();
  const deleteBundleMutation = useDeletePollcoinBundle();
  const { data: regions = [] } = useRegions();
  const { data: tags = [] } = useTags();

  // Local state for UI
  const [selectedBundle, setSelectedBundle] = useState<IPollcoinBundle | null>(
    null
  );
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bundleToDelete, setBundleToDelete] = useState<IPollcoinBundle | null>(
    null
  );
  const [expandedCountries, setExpandedCountries] = useState<{
    included: boolean;
    exempted: boolean;
  }>({ included: false, exempted: false });

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    amount: 0,
    price: 0,
    discount_type: "none" as "none" | "percentage" | "bonus",
    percentage: 0,
    bonus: 0,
    region: "",
    countries_to_exempt: [] as string[],
    countries_to_include: [] as string[],
    tag: "",
    currency: "USD" as "USD" | "NGN",
    is_active: true,
  });

  // Countries data based on selected region
  const countriesQuery = useCountriesByRegion(formData.region || null);
  const { data: countries = [] } = countriesQuery;

  // Form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Extract bundles data and pagination info
  const bundles = bundlesResponse?.data || [];
  const totalBundles = bundlesResponse?.total || 0;
  const currentPage = bundlesResponse?.page || 1;
  // Use page size from filters
  const actualPageSize = filters.pageSize;
  const totalPages = Math.ceil(totalBundles / actualPageSize);

  // Fallback: if totalBundles is 0 but we have bundles, calculate from bundles length
  const effectiveTotalPages =
    totalBundles > 0 ? totalPages : Math.ceil(bundles.length / actualPageSize);

  // Debug logging
  console.log("Pagination Debug:", {
    totalBundles,
    actualPageSize,
    totalPages,
    effectiveTotalPages,
    currentPage,
    bundlesLength: bundles.length,
    calculation: `${totalBundles} / ${actualPageSize} = ${
      totalBundles / actualPageSize
    }`,
    ceilResult: Math.ceil(totalBundles / actualPageSize),
  });

  // Handle error state - fallback to dummy data if API fails
  const displayBundles = error ? dummyBundles : bundles;

  // Calculate overview stats
  const totalBundlesCount = displayBundles.length;
  const activeBundles = displayBundles.filter(
    (b: IPollcoinBundle) => b.is_active
  ).length;
  const totalRevenue = displayBundles.reduce(
    (sum: number, bundle: IPollcoinBundle) => {
      const discountedPrice =
        bundle.discount_type === "percentage"
          ? bundle.price * (1 - (bundle.percentage || 0) / 100)
          : bundle.price;
      return sum + discountedPrice;
    },
    0
  );
  const averagePrice =
    totalBundlesCount > 0 ? totalRevenue / totalBundlesCount : 0;

  // Filter functions
  const updateFilter = (key: string, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      pageSize: 10,
      currency: "all",
      status: "all",
      region: "all",
      searchTerm: "",
      tag: "all",
    });
  };

  const goToPage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Check if form can be submitted (for button state)
  const canSubmitForm = (): boolean => {
    // Check required fields
    if (!formData.name?.trim()) return false;
    if (!formData.amount || formData.amount <= 0) return false;
    if (!formData.price || formData.price <= 0) return false;
    if (!formData.region) return false;
    if (!formData.tag?.trim()) return false;

    // Check conditional fields based on discount type
    if (formData.discount_type === "percentage") {
      if (
        !formData.percentage ||
        formData.percentage <= 0 ||
        formData.percentage >= 100
      ) {
        return false;
      }
    }

    if (formData.discount_type === "bonus") {
      if (!formData.bonus || formData.bonus <= 0) {
        return false;
      }
    }

    return true;
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Bundle name is required";
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (!formData.region) {
      newErrors.region = "Region is required";
    }

    if (!formData.tag?.trim()) {
      newErrors.tag = "Tag is required";
    }

    if (formData.discount_type === "percentage") {
      if (
        !formData.percentage ||
        formData.percentage <= 0 ||
        formData.percentage >= 100
      ) {
        newErrors.percentage = "Percentage must be between 1 and 99";
      }
    }

    if (formData.discount_type === "bonus") {
      if (!formData.bonus || formData.bonus <= 0) {
        newErrors.bonus = "Bonus amount must be greater than 0";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      amount: 0,
      price: 0,
      discount_type: "none",
      percentage: 0,
      bonus: 0,
      region: "",
      countries_to_exempt: [],
      countries_to_include: [],
      tag: "",
      currency: "USD",
      is_active: true,
    });
    setErrors({});
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Handle create new bundle
  const handleCreateBundle = async () => {
    if (!validateForm()) return;

    try {
      const bundleData = {
        name: formData.name,
        amount: formData.amount,
        price: formData.price,
        discount_type: formData.discount_type,
        percentage:
          formData.discount_type === "percentage"
            ? formData.percentage
            : undefined,
        bonus: formData.discount_type === "bonus" ? formData.bonus : undefined,
        region: formData.region, // This will be the region ID string
        countries_to_exempt: formData.countries_to_exempt,
        countries_to_include: formData.countries_to_include,
        tag: formData.tag,
        currency: formData.currency,
      };

      await createBundleMutation.mutateAsync(bundleData);

      // Show success toast
      success("Pollcoin bundle created successfully!");

      setCreateDialogOpen(false);
      resetForm();

      // Refetch bundles
      refetch();
    } catch (error) {
      console.error("Error creating bundle:", error);

      // Show error toast
      toastError("Failed to create pollcoin bundle. Please try again.");
    }
  };

  // Handle edit bundle
  const handleEditBundle = (bundle: IPollcoinBundle) => {
    setSelectedBundle(bundle);

    // Extract region ID if it's an object
    const regionId =
      typeof bundle.region === "object" ? bundle.region?._id : bundle.region;

    // Extract country IDs from country objects
    const countriesToExempt = Array.isArray(bundle.countries_to_exempt)
      ? bundle.countries_to_exempt.map((country: any) =>
          typeof country === "object" ? country._id : country
        )
      : [];

    const countriesToInclude = Array.isArray(bundle.countries_to_include)
      ? bundle.countries_to_include.map((country: any) =>
          typeof country === "object" ? country._id : country
        )
      : [];

    setFormData({
      name: bundle.name,
      amount: bundle.amount,
      price: bundle.price,
      discount_type: bundle.discount_type as "none" | "percentage" | "bonus",
      percentage: bundle.percentage || 0,
      bonus: bundle.bonus || 0,
      region: regionId || "",
      countries_to_exempt: countriesToExempt,
      countries_to_include: countriesToInclude,
      tag: bundle.tag,
      currency: bundle.currency as "USD" | "NGN",
      is_active: bundle.is_active || false,
    });
    setEditDialogOpen(true);
  };

  // Handle update bundle
  const handleUpdateBundle = async () => {
    if (!selectedBundle || !validateForm()) return;

    try {
      const bundleData = {
        name: formData.name!,
        amount: formData.amount!,
        price: formData.price!,
        discount_type: formData.discount_type!,
        percentage:
          formData.discount_type === "percentage"
            ? formData.percentage
            : undefined,
        bonus: formData.discount_type === "bonus" ? formData.bonus : undefined,
        tag: formData.tag!,
        currency: formData.currency!,
        is_active: formData.is_active!,
      };

      await updateBundleMutation.mutateAsync({
        id: selectedBundle._id || selectedBundle.id!,
        ...bundleData,
      });

      // Show success toast
      success("Pollcoin bundle updated successfully!");

      setEditDialogOpen(false);
      setSelectedBundle(null);
      resetForm();

      // Refetch bundles
      refetch();
    } catch (error) {
      console.error("Error updating bundle:", error);

      // Show error toast
      toastError("Failed to update pollcoin bundle. Please try again.");
    }
  };

  // Handle view bundle
  const handleViewBundle = (bundle: IPollcoinBundle) => {
    setSelectedBundle(bundle);
    setExpandedCountries({ included: false, exempted: false });
    setViewDialogOpen(true);
  };

  // Handle toggle status
  const handleToggleStatus = async (bundle: IPollcoinBundle) => {
    try {
      const newStatus = bundle.is_active ? "unpublished" : "published";
      await updateBundleMutation.mutateAsync({
        id: bundle._id || bundle.id!,
        status: newStatus,
      });

      // Show success toast
      success(
        `Bundle ${
          !bundle.is_active ? "activated" : "deactivated"
        } successfully!`
      );

      // Refetch bundles
      refetch();
    } catch (error) {
      console.error("Error toggling bundle status:", error);

      // Show error toast
      toastError("Failed to update bundle status. Please try again.");
    }
  };

  // Handle delete bundle
  const handleDeleteBundle = (bundle: IPollcoinBundle) => {
    setBundleToDelete(bundle);
    setDeleteDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (bundleToDelete) {
      try {
        await deleteBundleMutation.mutateAsync(
          bundleToDelete._id || bundleToDelete.id!
        );

        // Show success toast
        success("Bundle deleted successfully!");

        setDeleteDialogOpen(false);
        setBundleToDelete(null);

        // Refetch bundles
        refetch();
      } catch (error) {
        console.error("Error deleting bundle:", error);

        // Show error toast
        toastError("Failed to delete bundle. Please try again.");
      }
    }
  };

  // Handle create new bundle button
  const handleCreateNewBundle = () => {
    resetForm();
    setCreateDialogOpen(true);
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(price);
  };

  const getDiscountText = (bundle: IPollcoinBundle) => {
    switch (bundle.discount_type) {
      case "percentage":
        return `${bundle.percentage}% OFF`;
      case "bonus":
        return `+${bundle.bonus} Bonus`;
      default:
        return "No Discount";
    }
  };

  const getDiscountColor = (bundle: IPollcoinBundle) => {
    switch (bundle.discount_type) {
      case "percentage":
        return "bg-green-100 text-green-800";
      case "bonus":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Pollcoins Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage pollcoin bundles and pricing
            </p>
          </div>
          <Button
            onClick={handleCreateNewBundle}
            className="bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] hover:from-[#5B03B2] hover:to-[#9D50BB]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Bundle
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3 }}
          className="flex flex-col justify-between p-6 rounded-xl shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-700">
              Total Bundles
            </h3>
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md">
              <Package className="text-2xl text-purple-700" />
            </div>
          </div>
          <div className="mt-6">
            <h2 className="text-3xl font-bold text-gray-800">
              {isLoading ? (
                <ScaleLoader color="#9D50BB" height={15} />
              ) : (
                totalBundles
              )}
            </h2>
            <div className="flex justify-between items-center mt-3 text-sm">
              <span className="text-purple-600 font-medium">Available</span>
              <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded-full text-xs">
                ↗ Active
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex flex-col justify-between p-6 rounded-xl shadow-lg bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-700">
              Active Bundles
            </h3>
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md">
              <Power className="text-2xl text-green-600" />
            </div>
          </div>
          <div className="mt-6">
            <h2 className="text-3xl font-bold text-gray-800">
              {isLoading ? (
                <ScaleLoader color="#059669" height={15} />
              ) : (
                activeBundles
              )}
            </h2>
            <div className="flex justify-between items-center mt-3 text-sm">
              <span className="text-green-600 font-medium">Active</span>
              <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs">
                ↗ Growing
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex flex-col justify-between p-6 rounded-xl shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-700">
              Total Revenue
            </h3>
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md">
              <DollarSign className="text-2xl text-blue-600" />
            </div>
          </div>
          <div className="mt-6">
            <h2 className="text-3xl font-bold text-gray-800">
              {isLoading ? (
                <ScaleLoader color="#2563EB" height={15} />
              ) : (
                `$${totalRevenue.toFixed(2)}`
              )}
            </h2>
            <div className="flex justify-between items-center mt-3 text-sm">
              <span className="text-blue-600 font-medium">Potential</span>
              <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs">
                ↗ Trending
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.3 }}
          className="flex flex-col justify-between p-6 rounded-xl shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-700">
              Avg. Price
            </h3>
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md">
              <TrendingUp className="text-2xl text-orange-600" />
            </div>
          </div>
          <div className="mt-6">
            <h2 className="text-3xl font-bold text-gray-800">
              {isLoading ? (
                <ScaleLoader color="#EA580C" height={15} />
              ) : (
                `$${averagePrice.toFixed(2)}`
              )}
            </h2>
            <div className="flex justify-between items-center mt-3 text-sm">
              <span className="text-orange-600 font-medium">Per Bundle</span>
              <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded-full text-xs">
                ↗ Stable
              </span>
            </div>
          </div>
        </motion.div>
      </div> */}

      {/* Filters */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Filter Section */}
          <div className="flex flex-1 flex-wrap items-center gap-2 bg-gray-100 border border-gray-300 rounded-full px-4 py-1">
            {/* Filter Icon and Label */}
            <div className="flex items-center gap-2 border-r border-border pr-2">
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                Filter By
              </span>
            </div>

            {/* Status Filter */}
            <Select
              value={filters.status}
              onValueChange={(value) => updateFilter("status", value)}
            >
              <SelectTrigger className="w-24 h-8 text-sm border-gray-300 bg-transparent line-clamp-1">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Active</SelectItem>
                <SelectItem value="unpublished">Inactive</SelectItem>
              </SelectContent>
            </Select>

            {/* Tag Filter */}
            <Select
              value={filters.tag}
              onValueChange={(value) => updateFilter("tag", value)}
            >
              <SelectTrigger className="w-24 h-8 text-sm border-gray-300 bg-transparent line-clamp-1">
                <SelectValue placeholder="Tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {tags.map((tag: any) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Region Filter */}
            <Select
              value={filters.region}
              onValueChange={(value) => updateFilter("region", value)}
            >
              <SelectTrigger className="w-32 h-8 text-sm border-gray-300 bg-transparent line-clamp-1">
                <SelectValue placeholder="Region covered" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {regions.map((region: any) => (
                  <SelectItem key={region._id} value={region._id}>
                    {region.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Page Size Selector */}
            <Select
              value={filters.pageSize.toString()}
              onValueChange={(value) =>
                updateFilter("pageSize", parseInt(value))
              }
            >
              <SelectTrigger className="w-20 h-8 text-sm border-gray-300 bg-transparent">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>

            {/* Reset Filter Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reset Filter
            </Button>
          </div>

          {/* Search Section */}
          <div className="flex items-center bg-gray-100 border border-gray-300 rounded-full px-4 py-0 min-w-64">
            <svg
              className="w-4 h-4 text-gray-400 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <Input
              placeholder="Search"
              value={filters.searchTerm}
              onChange={(e) => updateFilter("searchTerm", e.target.value)}
              className="border-0 bg-transparent p-0 text-sm placeholder-gray-400 focus:ring-0 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Bundles Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 pl-2 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Pollcoin Bundles
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Manage and configure your pollcoin bundle offerings
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Showing {displayBundles.length} of {totalBundles} bundles
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bundle Name</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Tag</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading skeleton rows
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow
                    key={`skeleton-${index}`}
                    className={
                      index % 2 === 0 ? "bg-[#FEF5FED6]" : "bg-[#F7EEFED9]"
                    }
                  >
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-8" />
                    </TableCell>
                  </TableRow>
                ))
              ) : displayBundles.length > 0 ? (
                displayBundles.map((bundle: IPollcoinBundle, index: number) => (
                  <TableRow
                    key={bundle._id || bundle.id}
                    className={
                      index % 2 === 0 ? "bg-[#FEF5FED6]" : "bg-[#F7EEFED9]"
                    }
                  >
                    <TableCell className="font-medium">{bundle.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Image
                          src={Pollcoin}
                          alt="PollCoin"
                          className="size-4"
                        />
                        {bundle.amount.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatPrice(bundle.price, bundle.currency)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getDiscountColor(bundle)}>
                        {getDiscountText(bundle)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {typeof bundle.region === "object"
                          ? bundle.region?.name
                          : bundle.region || "No Region"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{bundle.tag}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={bundle.is_active ? "default" : "secondary"}
                        className={
                          bundle.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {bundle.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewBundle(bundle)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditBundle(bundle)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Bundle
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleStatus(bundle)}
                          >
                            {bundle.is_active ? (
                              <>
                                <PowerOff className="h-4 w-4 mr-2" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <Power className="h-4 w-4 mr-2" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteBundle(bundle)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="text-center">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No pollcoin bundles found
                        </h3>
                        <p className="text-gray-500 mb-4">
                          Get started by creating your first pollcoin bundle.
                        </p>
                        <Button
                          onClick={handleCreateNewBundle}
                          className="bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] hover:from-[#5B03B2] hover:to-[#9D50BB]"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create New Bundle
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {(effectiveTotalPages > 1 || totalBundles > 1) && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {(currentPage - 1) * actualPageSize + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(
                    currentPage * actualPageSize,
                    totalBundles || bundles.length
                  )}
                </span>{" "}
                of{" "}
                <span className="font-medium">
                  {totalBundles || bundles.length}
                </span>{" "}
                results
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                Previous
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from(
                  { length: Math.min(5, effectiveTotalPages) },
                  (_, i) => {
                    let pageNum;
                    if (effectiveTotalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= effectiveTotalPages - 2) {
                      pageNum = effectiveTotalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => goToPage(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  }
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= effectiveTotalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* View Bundle Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Bundle Details
            </DialogTitle>
          </DialogHeader>
          {selectedBundle && (
            <div className="space-y-8">
              {/* Header Card */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <Package className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {selectedBundle.name}
                      </h2>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge
                          variant={
                            selectedBundle.is_active ? "default" : "secondary"
                          }
                          className={
                            selectedBundle.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {selectedBundle.is_active ? "Active" : "Inactive"}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-purple-100 text-purple-800"
                        >
                          {selectedBundle.tag}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-purple-600">
                      {formatPrice(
                        selectedBundle.price,
                        selectedBundle.currency
                      )}
                    </p>
                    <p className="text-sm text-gray-500">Bundle Price</p>
                  </div>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Pollcoin Amount Card */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Pollcoin Amount
                      </h3>
                      <Image
                        src={Pollcoin}
                        alt="PollCoin"
                        className="w-6 h-6"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-4xl font-bold text-blue-600">
                        {selectedBundle.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Pollcoins</p>
                    </div>
                  </div>

                  {/* Discount Information */}
                  {selectedBundle.discount_type !== "none" && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Discount Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Type:</span>
                          <Badge className="bg-orange-100 text-orange-800 capitalize">
                            {selectedBundle.discount_type}
                          </Badge>
                        </div>
                        {selectedBundle.discount_type === "percentage" &&
                          selectedBundle.percentage && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Percentage:</span>
                              <span className="text-xl font-bold text-orange-600">
                                {selectedBundle.percentage}%
                              </span>
                            </div>
                          )}
                        {selectedBundle.discount_type === "bonus" &&
                          selectedBundle.bonus && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Bonus:</span>
                              <div className="flex items-center space-x-1">
                                <Image
                                  src={Pollcoin}
                                  alt="PollCoin"
                                  className="w-4 h-4"
                                />
                                <span className="text-xl font-bold text-orange-600">
                                  {selectedBundle.bonus.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  )}

                  {/* Region Information */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Region & Countries
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Region:</span>
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700"
                        >
                          {typeof selectedBundle.region === "object"
                            ? selectedBundle.region?.name
                            : selectedBundle.region || "No Region"}
                        </Badge>
                      </div>
                      {selectedBundle.countries_to_include &&
                        selectedBundle.countries_to_include.length > 0 && (
                          <div>
                            <span className="text-gray-600 block mb-2">
                              Countries Included:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {(expandedCountries.included
                                ? selectedBundle.countries_to_include
                                : selectedBundle.countries_to_include.slice(
                                    0,
                                    5
                                  )
                              ).map((country: any, index: number) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {typeof country === "object"
                                    ? country.name
                                    : country}
                                </Badge>
                              ))}
                              {selectedBundle.countries_to_include.length >
                                5 && (
                                <Badge
                                  variant="outline"
                                  className="text-xs cursor-pointer hover:bg-blue-50"
                                  onClick={() =>
                                    setExpandedCountries((prev) => ({
                                      ...prev,
                                      included: !prev.included,
                                    }))
                                  }
                                >
                                  {expandedCountries.included
                                    ? "Show less"
                                    : `+${
                                        selectedBundle.countries_to_include
                                          .length - 5
                                      } more`}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      {selectedBundle.countries_to_exempt &&
                        selectedBundle.countries_to_exempt.length > 0 && (
                          <div>
                            <span className="text-gray-600 block mb-2">
                              Countries Exempted:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {(expandedCountries.exempted
                                ? selectedBundle.countries_to_exempt
                                : selectedBundle.countries_to_exempt.slice(0, 5)
                              ).map((country: any, index: number) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs bg-red-50 text-red-700"
                                >
                                  {typeof country === "object"
                                    ? country.name
                                    : country}
                                </Badge>
                              ))}
                              {selectedBundle.countries_to_exempt.length >
                                5 && (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-red-50 text-red-700 cursor-pointer hover:bg-red-100"
                                  onClick={() =>
                                    setExpandedCountries((prev) => ({
                                      ...prev,
                                      exempted: !prev.exempted,
                                    }))
                                  }
                                >
                                  {expandedCountries.exempted
                                    ? "Show less"
                                    : `+${
                                        selectedBundle.countries_to_exempt
                                          .length - 5
                                      } more`}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Pricing Details */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Pricing Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Base Price:</span>
                        <span className="text-lg font-semibold">
                          {formatPrice(
                            selectedBundle.price,
                            selectedBundle.currency
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Currency:</span>
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700"
                        >
                          {selectedBundle.currency}
                        </Badge>
                      </div>
                      {selectedBundle.discount_type === "percentage" &&
                        selectedBundle.percentage && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">
                              Discounted Price:
                            </span>
                            <span className="text-lg font-semibold text-green-600">
                              {formatPrice(
                                selectedBundle.price *
                                  (1 - selectedBundle.percentage / 100),
                                selectedBundle.currency
                              )}
                            </span>
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Bundle Statistics */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Bundle Statistics
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Value:</span>
                        <div className="flex items-center space-x-1">
                          <Image
                            src={Pollcoin}
                            alt="PollCoin"
                            className="w-4 h-4"
                          />
                          <span className="font-semibold">
                            {selectedBundle.amount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      {selectedBundle.discount_type === "bonus" &&
                        selectedBundle.bonus && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">
                              Total with Bonus:
                            </span>
                            <div className="flex items-center space-x-1">
                              <Image
                                src={Pollcoin}
                                alt="PollCoin"
                                className="w-4 h-4"
                              />
                              <span className="font-semibold text-green-600">
                                {(
                                  selectedBundle.amount + selectedBundle.bonus
                                ).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        )}
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">
                          Price per Pollcoin:
                        </span>
                        <span className="font-semibold">
                          {formatPrice(
                            selectedBundle.price / selectedBundle.amount,
                            selectedBundle.currency
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Timestamps */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Timeline
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Created:</span>
                        <span className="text-sm">
                          {new Date(
                            selectedBundle.createdAt ||
                              selectedBundle.created_at ||
                              ""
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Last Updated:</span>
                        <span className="text-sm">
                          {new Date(
                            selectedBundle.updatedAt ||
                              selectedBundle.updated_at ||
                              ""
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Bundle Sheet */}
      <Sheet open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit pricing</SheetTitle>
            <SheetDescription>
              Update the pollcoin bundle with pricing and regional settings.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-6 mt-6">
            {/* Bundle Name */}
            <div className="space-y-2">
              <Label htmlFor="edit-name">Bundle Name</Label>
              <Input
                value={formData.name || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange("name", e.target.value)
                }
                placeholder="Enter bundle name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Currency */}
            <div className="space-y-2">
              <Label htmlFor="edit-currency">Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) =>
                  handleInputChange("currency", value as "USD" | "NGN")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="NGN">NGN (₦)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* PollCoins */}
            <div className="space-y-2">
              <Label htmlFor="edit-amount">PollCoins</Label>
              <div className="relative">
                <Input
                  type="text"
                  value={formData.amount ? formData.amount.toString() : ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const numericValue = e.target.value.replace(/[^0-9]/g, "");
                    const parsedValue = parseInt(numericValue) || 0;
                    handleInputChange("amount", parsedValue);
                  }}
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                    // Format with commas when user finishes typing
                    if (formData.amount) {
                      e.target.value = formData.amount.toLocaleString();
                    }
                  }}
                  placeholder="Enter PollCoin amount"
                  className={errors.amount ? "border-red-500" : ""}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <Image src={Pollcoin} alt="PollCoin" className="size-4" />
                </div>
              </div>
              {errors.amount && (
                <p className="text-sm text-red-500">{errors.amount}</p>
              )}
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="edit-price">Price</Label>
              <div className="relative">
                <Input
                  type="text"
                  value={formData.price ? formData.price.toString() : ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const inputValue = e.target.value;
                    // Allow only numbers and one decimal point
                    const numericValue = inputValue.replace(/[^0-9.]/g, "");

                    // Ensure only one decimal point
                    const parts = numericValue.split(".");
                    const cleanValue =
                      parts.length > 2
                        ? parts[0] + "." + parts.slice(1).join("")
                        : numericValue;

                    // Allow typing like "12.7" - convert to number for storage
                    const parsedValue =
                      cleanValue === "" ? 0 : parseFloat(cleanValue);
                    if (!isNaN(parsedValue)) {
                      handleInputChange("price", parsedValue);
                    }
                  }}
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                    // Format with commas and 2 decimal places when user finishes typing
                    if (formData.price) {
                      const formatted = formData.price.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      });
                      e.target.value = formatted;
                    }
                  }}
                  placeholder="Enter price (e.g., 12.7)"
                  className={errors.price ? "border-red-500" : ""}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">
                  {formData.currency === "USD" ? "$" : "₦"}
                </div>
              </div>
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price}</p>
              )}
            </div>

            {/* Discount Type */}
            <div className="space-y-2">
              <Label htmlFor="edit-discount-type">Discount type</Label>
              <Select
                value={formData.discount_type}
                onValueChange={(value) =>
                  handleInputChange("discount_type", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Enter discount type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Discount</SelectItem>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="bonus">Bonus</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Discount Percentage */}
            {formData.discount_type === "percentage" && (
              <div className="space-y-2">
                <Label htmlFor="edit-percentage">Discount Percentage</Label>
                <div className="relative">
                  <Input
                    type="text"
                    value={
                      formData.percentage ? formData.percentage.toString() : ""
                    }
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const numericValue = e.target.value.replace(
                        /[^0-9]/g,
                        ""
                      );
                      const parsedValue = parseInt(numericValue) || 0;
                      if (parsedValue <= 99) {
                        handleInputChange("percentage", parsedValue);
                      }
                    }}
                    placeholder="Enter percentage (1-99)"
                    className={errors.percentage ? "border-red-500" : ""}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">
                    %
                  </div>
                </div>
                {errors.percentage && (
                  <p className="text-sm text-red-500">{errors.percentage}</p>
                )}
              </div>
            )}

            {/* Bonus Amount */}
            {formData.discount_type === "bonus" && (
              <div className="space-y-2">
                <Label htmlFor="edit-bonus">Bonus Amount</Label>
                <div className="relative">
                  <Input
                    type="text"
                    value={formData.bonus ? formData.bonus.toString() : ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const numericValue = e.target.value.replace(
                        /[^0-9]/g,
                        ""
                      );
                      const parsedValue = parseInt(numericValue) || 0;
                      handleInputChange("bonus", parsedValue);
                    }}
                    onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                      // Format with commas when user finishes typing
                      if (formData.bonus) {
                        e.target.value = formData.bonus.toLocaleString();
                      }
                    }}
                    placeholder="Enter bonus amount"
                    className={errors.bonus ? "border-red-500" : ""}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <Image src={Pollcoin} alt="PollCoin" className="size-4" />
                  </div>
                </div>
                {errors.bonus && (
                  <p className="text-sm text-red-500">{errors.bonus}</p>
                )}
              </div>
            )}

            {/* Region */}
            <div className="space-y-2">
              <Label htmlFor="edit-region">Region</Label>
              <Select
                value={formData.region}
                onValueChange={(value) => {
                  handleInputChange("region", value);
                  // Reset countries when region changes
                  handleInputChange("countries_to_exempt", []);
                  handleInputChange("countries_to_include", []);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {regions && regions.length > 0 ? (
                    regions.map((region: any) => (
                      <SelectItem key={region._id} value={region._id}>
                        {region.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-regions" disabled>
                      No regions available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {errors.region && (
                <p className="text-sm text-red-500">{errors.region}</p>
              )}
            </div>

            {/* Countries */}
            {formData.region && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Country to exempt */}
                <div className="space-y-2">
                  <Label htmlFor="edit-countries-exempt">
                    Countries to Exempt
                  </Label>
                  <ReactSelectMulti
                    options={countries.map((country: any) => {
                      console.log("Country data:", country);
                      return {
                        value: country.id || country._id || country.code,
                        label: country.name || country.country_name,
                      };
                    })}
                    value={formData.countries_to_exempt}
                    onChange={(value) => {
                      console.log("Selected countries to exempt:", value);
                      handleInputChange("countries_to_exempt", value);
                    }}
                    placeholder="Select countries to exempt"
                    loading={countriesQuery.isLoading}
                  />
                </div>

                {/* Country to include */}
                <div className="space-y-2">
                  <Label htmlFor="edit-countries-include">
                    Countries to Include
                  </Label>
                  <ReactSelectMulti
                    options={countries.map((country: any) => {
                      console.log("Country data:", country);
                      return {
                        value: country.id || country._id || country.code,
                        label: country.name || country.country_name,
                      };
                    })}
                    value={formData.countries_to_include}
                    onChange={(value) => {
                      console.log("Selected countries to include:", value);
                      handleInputChange("countries_to_include", value);
                    }}
                    placeholder="Select countries to include"
                    loading={countriesQuery.isLoading}
                  />
                </div>
              </div>
            )}

            {/* Tag */}
            <div className="space-y-2">
              <Label htmlFor="edit-tag">Tag</Label>
              <Input
                value={formData.tag || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange("tag", e.target.value)
                }
                placeholder="Enter tag"
                className={errors.tag ? "border-red-500" : ""}
              />
              {errors.tag && (
                <p className="text-sm text-red-500">{errors.tag}</p>
              )}
            </div>
          </div>
          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateBundle}
              disabled={updateBundleMutation.isPending || !canSubmitForm()}
              className="bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] hover:from-[#5B03B2] hover:to-[#9D50BB] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateBundleMutation.isPending ? "Updating..." : "Update Bundle"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Create Bundle Sheet */}
      <Sheet open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add new pricing</SheetTitle>
            <SheetDescription>
              Create a new pollcoin bundle with pricing and regional settings.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-6 mt-6">
            {/* Bundle Name */}
            <div className="space-y-2">
              <Label htmlFor="create-name">Bundle Name</Label>
              <Input
                value={formData.name || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange("name", e.target.value)
                }
                placeholder="Enter bundle name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Currency */}
            <div className="space-y-2">
              <Label htmlFor="create-currency">Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) =>
                  handleInputChange("currency", value as "USD" | "NGN")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="NGN">NGN (₦)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* PollCoins */}
            <div className="space-y-2">
              <Label htmlFor="create-amount">PollCoins</Label>
              <div className="relative">
                <Input
                  type="text"
                  value={formData.amount ? formData.amount.toString() : ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const numericValue = e.target.value.replace(/[^0-9]/g, "");
                    const parsedValue = parseInt(numericValue) || 0;
                    handleInputChange("amount", parsedValue);
                  }}
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                    // Format with commas when user finishes typing
                    if (formData.amount) {
                      e.target.value = formData.amount.toLocaleString();
                    }
                  }}
                  placeholder="Enter PollCoin amount"
                  className={errors.amount ? "border-red-500" : ""}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <Image src={Pollcoin} alt="PollCoin" className="size-4" />
                </div>
              </div>
              {errors.amount && (
                <p className="text-sm text-red-500">{errors.amount}</p>
              )}
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="create-price">Price</Label>
              <div className="relative">
                <Input
                  type="text"
                  value={formData.price ? formData.price.toString() : ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const inputValue = e.target.value;
                    // Allow only numbers and one decimal point
                    const numericValue = inputValue.replace(/[^0-9.]/g, "");

                    // Ensure only one decimal point
                    const parts = numericValue.split(".");
                    const cleanValue =
                      parts.length > 2
                        ? parts[0] + "." + parts.slice(1).join("")
                        : numericValue;

                    // Allow typing like "12.7" - convert to number for storage
                    const parsedValue =
                      cleanValue === "" ? 0 : parseFloat(cleanValue);
                    if (!isNaN(parsedValue)) {
                      handleInputChange("price", parsedValue);
                    }
                  }}
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                    // Format with commas and 2 decimal places when user finishes typing
                    if (formData.price) {
                      const formatted = formData.price.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      });
                      e.target.value = formatted;
                    }
                  }}
                  placeholder="Enter price (e.g., 12.7)"
                  className={errors.price ? "border-red-500" : ""}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">
                  {formData.currency === "USD" ? "$" : "₦"}
                </div>
              </div>
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price}</p>
              )}
            </div>

            {/* Discount Type */}
            <div className="space-y-2">
              <Label htmlFor="create-discount-type">Discount type</Label>
              <Select
                value={formData.discount_type}
                onValueChange={(value) =>
                  handleInputChange("discount_type", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Enter discount type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Discount</SelectItem>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="bonus">Bonus</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Discount Percentage */}
            {formData.discount_type === "percentage" && (
              <div className="space-y-2">
                <Label htmlFor="create-percentage">Discount Percentage</Label>
                <div className="relative">
                  <Input
                    type="text"
                    value={
                      formData.percentage ? formData.percentage.toString() : ""
                    }
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const numericValue = e.target.value.replace(
                        /[^0-9]/g,
                        ""
                      );
                      const parsedValue = parseInt(numericValue) || 0;
                      if (parsedValue <= 99) {
                        handleInputChange("percentage", parsedValue);
                      }
                    }}
                    placeholder="Enter percentage (1-99)"
                    className={errors.percentage ? "border-red-500" : ""}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">
                    %
                  </div>
                </div>
                {errors.percentage && (
                  <p className="text-sm text-red-500">{errors.percentage}</p>
                )}
              </div>
            )}

            {/* Bonus Amount */}
            {formData.discount_type === "bonus" && (
              <div className="space-y-2">
                <Label htmlFor="create-bonus">Bonus Amount</Label>
                <div className="relative">
                  <Input
                    type="text"
                    value={formData.bonus ? formData.bonus.toString() : ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const numericValue = e.target.value.replace(
                        /[^0-9]/g,
                        ""
                      );
                      const parsedValue = parseInt(numericValue) || 0;
                      handleInputChange("bonus", parsedValue);
                    }}
                    onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                      // Format with commas when user finishes typing
                      if (formData.bonus) {
                        e.target.value = formData.bonus.toLocaleString();
                      }
                    }}
                    placeholder="Enter bonus amount"
                    className={errors.bonus ? "border-red-500" : ""}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <Image src={Pollcoin} alt="PollCoin" className="size-4" />
                  </div>
                </div>
                {errors.bonus && (
                  <p className="text-sm text-red-500">{errors.bonus}</p>
                )}
              </div>
            )}

            {/* Region */}
            <div className="space-y-2">
              <Label htmlFor="create-region">Region</Label>
              <Select
                value={formData.region}
                onValueChange={(value) => {
                  handleInputChange("region", value);
                  // Reset countries when region changes
                  handleInputChange("countries_to_exempt", []);
                  handleInputChange("countries_to_include", []);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {regions && regions.length > 0 ? (
                    regions.map((region: any) => (
                      <SelectItem key={region._id} value={region._id}>
                        {region.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-regions" disabled>
                      No regions available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {errors.region && (
                <p className="text-sm text-red-500">{errors.region}</p>
              )}
            </div>

            {/* Countries */}
            {formData.region && (
              <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                {/* Country to exempt */}
                <div className="space-y-2">
                  <Label htmlFor="create-countries-exempt">
                    Countries to Exempt
                  </Label>
                  <ReactSelectMulti
                    options={countries.map((country: any) => {
                      console.log("Country data:", country);
                      return {
                        value: country.id || country._id || country.code,
                        label: country.name || country.country_name,
                      };
                    })}
                    value={formData.countries_to_exempt}
                    onChange={(value) => {
                      console.log("Selected countries to exempt:", value);
                      handleInputChange("countries_to_exempt", value);
                    }}
                    placeholder="Select countries to exempt"
                    loading={countriesQuery.isLoading}
                  />
                </div>

                {/* Country to include */}
                <div className="space-y-2">
                  <Label htmlFor="create-countries-include">
                    Countries to Include
                  </Label>
                  <ReactSelectMulti
                    options={countries.map((country: any) => {
                      console.log("Country data:", country);
                      return {
                        value: country.id || country._id || country.code,
                        label: country.name || country.country_name,
                      };
                    })}
                    value={formData.countries_to_include}
                    onChange={(value) => {
                      console.log("Selected countries to include:", value);
                      handleInputChange("countries_to_include", value);
                    }}
                    placeholder="Select countries to include"
                    loading={countriesQuery.isLoading}
                  />
                </div>
              </div>
            )}

            {/* Tag */}
            <div className="space-y-2">
              <Label htmlFor="create-tag">Tag</Label>
              <Input
                value={formData.tag || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange("tag", e.target.value)
                }
                placeholder="Enter tag"
                className={errors.tag ? "border-red-500" : ""}
              />
              {errors.tag && (
                <p className="text-sm text-red-500">{errors.tag}</p>
              )}
            </div>
          </div>
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateBundle}
              disabled={createBundleMutation.isPending || !canSubmitForm()}
              className="bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] hover:from-[#5B03B2] hover:to-[#9D50BB] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createBundleMutation.isPending
                ? "Saving..."
                : "Save and Continue"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Delete Bundle
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the bundle "{bundleToDelete?.name}
              "? This action cannot be undone and will permanently remove the
              bundle from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteBundleMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteBundleMutation.isPending ? "Deleting..." : "Delete Bundle"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PollcoinsPage;
