"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ScaleLoader } from "react-spinners";
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
import TextArea from "@/components/ui/TextArea";
import { IPollcoinBundle } from "@/types/pollcoin-bundle";
import Image from "next/image";
import { Pollcoin } from "@/assets/images";

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

const PollcoinsPage = (props: Props) => {
  const [bundles, setBundles] = useState<IPollcoinBundle[]>(dummyBundles);
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
  const [isLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<IPollcoinBundle>>({
    name: "",
    amount: 0,
    price: 0,
    discount_type: "none",
    percentage: 0,
    bonus: 0,
    tag: "",
    currency: "USD",
    is_active: true,
  });

  // Form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate overview stats
  const totalBundles = bundles.length;
  const activeBundles = bundles.filter((b) => b.is_active).length;
  const totalRevenue = bundles.reduce((sum, bundle) => {
    const discountedPrice =
      bundle.discount_type === "percentage"
        ? bundle.price * (1 - (bundle.percentage || 0) / 100)
        : bundle.price;
    return sum + discountedPrice;
  }, 0);
  const averagePrice = totalRevenue / totalBundles;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
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

    setIsSubmitting(true);
    try {
      const newBundle: IPollcoinBundle = {
        id: Date.now().toString(), // Simple ID generation
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
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setBundles((prev) => [newBundle, ...prev]);
      setCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error creating bundle:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit bundle
  const handleEditBundle = (bundle: IPollcoinBundle) => {
    setSelectedBundle(bundle);
    setFormData({
      name: bundle.name,
      amount: bundle.amount,
      price: bundle.price,
      discount_type: bundle.discount_type,
      percentage: bundle.percentage || 0,
      bonus: bundle.bonus || 0,
      tag: bundle.tag,
      currency: bundle.currency,
      is_active: bundle.is_active,
    });
    setEditDialogOpen(true);
  };

  // Handle update bundle
  const handleUpdateBundle = async () => {
    if (!selectedBundle || !validateForm()) return;

    setIsSubmitting(true);
    try {
      const updatedBundle: IPollcoinBundle = {
        ...selectedBundle,
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
        updated_at: new Date().toISOString(),
      };

      setBundles((prev) =>
        prev.map((bundle) =>
          bundle.id === selectedBundle.id ? updatedBundle : bundle
        )
      );
      setEditDialogOpen(false);
      setSelectedBundle(null);
      resetForm();
    } catch (error) {
      console.error("Error updating bundle:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle view bundle
  const handleViewBundle = (bundle: IPollcoinBundle) => {
    setSelectedBundle(bundle);
    setViewDialogOpen(true);
  };

  // Handle toggle status
  const handleToggleStatus = (bundle: IPollcoinBundle) => {
    setBundles((prev) =>
      prev.map((b) =>
        b.id === bundle.id
          ? {
              ...b,
              is_active: !b.is_active,
              updated_at: new Date().toISOString(),
            }
          : b
      )
    );
  };

  // Handle delete bundle
  const handleDeleteBundle = (bundle: IPollcoinBundle) => {
    setBundleToDelete(bundle);
    setDeleteDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (bundleToDelete) {
      setBundles((prev) => prev.filter((b) => b.id !== bundleToDelete.id));
      setDeleteDialogOpen(false);
      setBundleToDelete(null);
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
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
              <span className="text-green-600 font-medium">Enabled</span>
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
      </div>

      {/* Bundles Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Pollcoin Bundles
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage and configure your pollcoin bundle offerings
          </p>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bundle Name</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Tag</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bundles.map((bundle) => (
                <TableRow key={bundle.id}>
                  <TableCell className="font-medium">{bundle.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Image src={Pollcoin} alt="PollCoin" className="size-4" />
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
                              Disable
                            </>
                          ) : (
                            <>
                              <Power className="h-4 w-4 mr-2" />
                              Enable
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
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* View Bundle Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bundle Details</DialogTitle>
          </DialogHeader>
          {selectedBundle && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Name
                  </label>
                  <p className="text-lg font-semibold">{selectedBundle.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Amount
                  </label>
                  <p className="text-lg font-semibold flex items-center">
                    <Image
                      src={Pollcoin}
                      alt="PollCoin"
                      className="size-4 mr-2"
                    />
                    {selectedBundle.amount.toLocaleString()} Pollcoins
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Price
                  </label>
                  <p className="text-lg font-semibold">
                    {formatPrice(selectedBundle.price, selectedBundle.currency)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Currency
                  </label>
                  <p className="text-lg font-semibold">
                    {selectedBundle.currency}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Discount Type
                  </label>
                  <p className="text-lg font-semibold capitalize">
                    {selectedBundle.discount_type}
                  </p>
                </div>
                {selectedBundle.discount_type === "percentage" &&
                  selectedBundle.percentage && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Discount Percentage
                      </label>
                      <p className="text-lg font-semibold">
                        {selectedBundle.percentage}%
                      </p>
                    </div>
                  )}
                {selectedBundle.discount_type === "bonus" &&
                  selectedBundle.bonus && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Bonus Amount
                      </label>
                      <p className="text-lg font-semibold">
                        <Image
                          src={Pollcoin}
                          alt="PollCoin"
                          className="size-4"
                        />
                        {selectedBundle.bonus} Pollcoins
                      </p>
                    </div>
                  )}
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Tag
                  </label>
                  <Badge variant="outline">{selectedBundle.tag}</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Status
                  </label>
                  <Badge
                    variant={selectedBundle.is_active ? "default" : "secondary"}
                    className={
                      selectedBundle.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {selectedBundle.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Created At
                    </label>
                    <p className="text-sm">
                      {new Date(
                        selectedBundle.created_at || ""
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Updated At
                    </label>
                    <p className="text-sm">
                      {new Date(
                        selectedBundle.updated_at || ""
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Bundle Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Bundle</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Bundle Name *</Label>
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

              <div className="space-y-2">
                <Label htmlFor="edit-amount">Amount *</Label>
                <Input
                  type="number"
                  value={formData.amount || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("amount", parseInt(e.target.value) || 0)
                  }
                  placeholder="Enter pollcoin amount"
                  className={errors.amount ? "border-red-500" : ""}
                />
                {errors.amount && (
                  <p className="text-sm text-red-500">{errors.amount}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-price">Price *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("price", parseFloat(e.target.value) || 0)
                  }
                  placeholder="Enter price"
                  className={errors.price ? "border-red-500" : ""}
                />
                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-currency">Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) =>
                    handleInputChange("currency", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="NGN">NGN</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-discount-type">Discount Type</Label>
                <Select
                  value={formData.discount_type}
                  onValueChange={(value) =>
                    handleInputChange("discount_type", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select discount type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Discount</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="bonus">Bonus</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.discount_type === "percentage" && (
                <div className="space-y-2">
                  <Label htmlFor="edit-percentage">Discount Percentage *</Label>
                  <Input
                    type="number"
                    min="1"
                    max="99"
                    value={formData.percentage || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange(
                        "percentage",
                        parseInt(e.target.value) || 0
                      )
                    }
                    placeholder="Enter percentage (1-99)"
                    className={errors.percentage ? "border-red-500" : ""}
                  />
                  {errors.percentage && (
                    <p className="text-sm text-red-500">{errors.percentage}</p>
                  )}
                </div>
              )}

              {formData.discount_type === "bonus" && (
                <div className="space-y-2">
                  <Label htmlFor="edit-bonus">Bonus Amount *</Label>
                  <Input
                    type="number"
                    value={formData.bonus || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange("bonus", parseInt(e.target.value) || 0)
                    }
                    placeholder="Enter bonus amount"
                    className={errors.bonus ? "border-red-500" : ""}
                  />
                  {errors.bonus && (
                    <p className="text-sm text-red-500">{errors.bonus}</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="edit-tag">Tag *</Label>
                <Input
                  value={formData.tag || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("tag", e.target.value)
                  }
                  placeholder="Enter tag (e.g., popular, early bird)"
                  className={errors.tag ? "border-red-500" : ""}
                />
                {errors.tag && (
                  <p className="text-sm text-red-500">{errors.tag}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={formData.is_active ? "active" : "inactive"}
                  onValueChange={(value) =>
                    handleInputChange("is_active", value === "active")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateBundle}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] hover:from-[#5B03B2] hover:to-[#9D50BB]"
            >
              {isSubmitting ? "Updating..." : "Update Bundle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Bundle Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Bundle</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-name">Bundle Name *</Label>
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

              <div className="space-y-2">
                <Label htmlFor="create-amount">Amount *</Label>
                <Input
                  type="number"
                  value={formData.amount || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("amount", parseInt(e.target.value) || 0)
                  }
                  placeholder="Enter pollcoin amount"
                  className={errors.amount ? "border-red-500" : ""}
                />
                {errors.amount && (
                  <p className="text-sm text-red-500">{errors.amount}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-price">Price *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("price", parseFloat(e.target.value) || 0)
                  }
                  placeholder="Enter price"
                  className={errors.price ? "border-red-500" : ""}
                />
                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-currency">Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) =>
                    handleInputChange("currency", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="NGN">NGN</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-discount-type">Discount Type</Label>
                <Select
                  value={formData.discount_type}
                  onValueChange={(value) =>
                    handleInputChange("discount_type", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select discount type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Discount</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="bonus">Bonus</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.discount_type === "percentage" && (
                <div className="space-y-2">
                  <Label htmlFor="create-percentage">
                    Discount Percentage *
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    max="99"
                    value={formData.percentage || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange(
                        "percentage",
                        parseInt(e.target.value) || 0
                      )
                    }
                    placeholder="Enter percentage (1-99)"
                    className={errors.percentage ? "border-red-500" : ""}
                  />
                  {errors.percentage && (
                    <p className="text-sm text-red-500">{errors.percentage}</p>
                  )}
                </div>
              )}

              {formData.discount_type === "bonus" && (
                <div className="space-y-2">
                  <Label htmlFor="create-bonus">Bonus Amount *</Label>
                  <Input
                    type="number"
                    value={formData.bonus || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange("bonus", parseInt(e.target.value) || 0)
                    }
                    placeholder="Enter bonus amount"
                    className={errors.bonus ? "border-red-500" : ""}
                  />
                  {errors.bonus && (
                    <p className="text-sm text-red-500">{errors.bonus}</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="create-tag">Tag *</Label>
                <Input
                  value={formData.tag || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("tag", e.target.value)
                  }
                  placeholder="Enter tag (e.g., popular, early bird)"
                  className={errors.tag ? "border-red-500" : ""}
                />
                {errors.tag && (
                  <p className="text-sm text-red-500">{errors.tag}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-status">Status</Label>
                <Select
                  value={formData.is_active ? "active" : "inactive"}
                  onValueChange={(value) =>
                    handleInputChange("is_active", value === "active")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateBundle}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] hover:from-[#5B03B2] hover:to-[#9D50BB]"
            >
              {isSubmitting ? "Creating..." : "Create Bundle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Bundle
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PollcoinsPage;
