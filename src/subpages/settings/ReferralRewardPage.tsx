"use client";
import { RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaUsers, FaMoneyBillWave } from "react-icons/fa";
import { MdOutlinePayments } from "react-icons/md";
import { Input } from "@/components/ui/shadcn-input";
import { ClipboardCopy } from "lucide-react";
import { toast } from "react-toastify";
import { useUserProfileQuery } from "@/services/user.service";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { postReferralPayout } from "@/services/api/referrals.api";

interface UserData {
  referral_code: string;
  referral_link: string;
}

const Page = () => {
  const referral_reward = useSelector(
    (state: RootState) => state.user?.user?.referral_reward
  );
  const [userData, setUserData] = useState<UserData>({
    referral_code: "",
    referral_link: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    account_name: "",
    account_number: "",
    bank_name: "",
  });
  const [formErrors, setFormErrors] = useState({
    account_name: "",
    account_number: "",
    bank_name: "",
  });

  const { data, isLoading } = useUserProfileQuery({});

  const minPayout = 20000; // Naira
  const accruedAmount = referral_reward?.accrued_amount || 0;
  const payoutAmount = referral_reward?.payout_amount || 0;
  const lastDateRequested = referral_reward?.date_requested;
  const newReferredUsers = referral_reward?.new_referred_users || 0;

  const payoutMutation = useMutation({
    mutationFn: postReferralPayout,
    onSuccess: (res) => {
      toast.success((res as any)?.message || "Payout request submitted!");
      setDialogOpen(false);
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.msg ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to request payout."
      );
    },
  });

  const validateForm = () => {
    let valid = true;
    const errors = { account_name: "", account_number: "", bank_name: "" };
    if (!form.account_name.trim()) {
      errors.account_name = "Account name is required";
      valid = false;
    }
    if (!form.account_number.trim()) {
      errors.account_number = "Account number is required";
      valid = false;
    } else if (!/^\d{10}$/.test(form.account_number.trim())) {
      errors.account_number = "Account number must be 10 digits";
      valid = false;
    }
    if (!form.bank_name.trim()) {
      errors.bank_name = "Bank name is required";
      valid = false;
    }
    setFormErrors(errors);
    return valid;
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: "" });
  };

  const handleDialogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    payoutMutation.mutate(form);
  };

  useEffect(() => {
    if (data?.data) {
      const { referral_code } = data.data;

      const baseUrl =
        typeof window !== "undefined"
          ? window.location.origin
          : "https://pollsensei.ai";
      const referral_link = referral_code
        ? `${baseUrl}/register?ref=${referral_code}`
        : "";

      setUserData({
        referral_code: referral_code || "",
        referral_link: referral_link,
      });
    }
  }, [data]);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard!`);
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-6">Referral Rewards</h1>

      {isLoading ? (
        <>
          {/* Referral Summary Skeleton */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-4 rounded-lg flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full mr-4" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Request Payout Skeleton */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <Skeleton className="h-6 w-40 mb-4" />
            <Skeleton className="h-4 w-80 mb-4" />
            <Skeleton className="h-10 w-40 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>

          {/* Referral Link Skeleton */}
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6 mb-6">
            <Skeleton className="h-6 w-40 mb-4" />
            <Skeleton className="h-4 w-80 mb-4" />
            <div className="flex flex-col sm:flex-row gap-3">
              <Skeleton className="h-10 w-full sm:w-96" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>

          {/* Referral Code Skeleton */}
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <Skeleton className="h-6 w-40 mb-4" />
            <Skeleton className="h-4 w-80 mb-4" />
            <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-md border border-gray-200 w-fit">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Your Referral Summary</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FaUsers className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Referred Users</p>
                <p className="text-2xl font-bold">
                  {referral_reward?.number_of_referred_users || 0}
                </p>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg flex items-center">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <FaMoneyBillWave className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Accrued Amount</p>
                <p className="text-2xl font-bold">
                  ₦{referral_reward?.accrued_amount?.toFixed(2) || "0.00"}
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg flex items-center">
              <div className="bg-yellow-100 p-3 rounded-full mr-4">
                <FaUsers className="text-yellow-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600">New Referred Users</p>
                <p className="text-2xl font-bold">{newReferredUsers}</p>
              </div>
            </div>

            <div className="bg-pink-50 p-4 rounded-lg flex items-center">
              <div className="bg-pink-100 p-3 rounded-full mr-4">
                <FaMoneyBillWave className="text-pink-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Payout Amount</p>
                <p className="text-2xl font-bold">
                  ₦{payoutAmount?.toFixed(2) || "0.00"}
                </p>
              </div>
            </div>
            {/* 
            <div className="bg-purple-50 p-4 rounded-lg flex items-center">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <MdOutlinePayments className="text-purple-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Payout Date</p>
                <p className="text-lg font-semibold">
                  {lastDateRequested
                    ? new Date(lastDateRequested).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : "Never"}
                </p>
              </div>
            </div> */}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Request Payout</h2>
        <p className="text-gray-600 mb-4">
          You can request a payout once your payout amount reaches ₦
          {minPayout.toLocaleString()}.00.
        </p>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className={`px-6 py-2 rounded-md font-medium ${
                payoutAmount >= minPayout
                  ? "bg-gradient-to-r from-[#5b03b2] to-[#9d50bb] text-white"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
              disabled={payoutAmount < minPayout}
              onClick={() => {
                if (payoutAmount >= minPayout) setDialogOpen(true);
              }}
            >
              Request Payout
            </Button>
          </DialogTrigger>
          <DialogContent className="z-[1000000]" overlayClassName="z-[100000]">
            <DialogHeader>
              <DialogTitle>Request Payout</DialogTitle>
              <DialogDescription>
                Enter your bank details to request your referral payout.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleDialogSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Account Name
                </label>
                <Input
                  name="account_name"
                  value={form.account_name}
                  onChange={handleFormChange}
                  placeholder="e.g. Chinedu Emesue"
                  disabled={payoutMutation.isPending}
                />
                {formErrors.account_name && (
                  <p className="text-xs text-red-600 mt-1">
                    {formErrors.account_name}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Account Number
                </label>
                <Input
                  name="account_number"
                  value={form.account_number}
                  onChange={handleFormChange}
                  placeholder="e.g. 0123456789"
                  maxLength={10}
                  disabled={payoutMutation.isPending}
                />
                {formErrors.account_number && (
                  <p className="text-xs text-red-600 mt-1">
                    {formErrors.account_number}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Bank Name
                </label>
                <Input
                  name="bank_name"
                  value={form.bank_name}
                  onChange={handleFormChange}
                  placeholder="e.g. First Bank"
                  disabled={payoutMutation.isPending}
                />
                {formErrors.bank_name && (
                  <p className="text-xs text-red-600 mt-1">
                    {formErrors.bank_name}
                  </p>
                )}
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={payoutMutation.isPending}
                  className="bg-gradient-to-r from-[#5b03b2] to-[#9d50bb] text-white"
                >
                  {payoutMutation.isPending ? "Submitting..." : "Submit"}
                </Button>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        {payoutAmount < minPayout && (
          <p className="text-sm text-amber-600 mt-2">
            You need ₦
            {(minPayout - payoutAmount).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}{" "}
            more to request a payout.
          </p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Last Payout Date</h2>
        <p className="text-gray-600 mb-4">
          {lastDateRequested
            ? new Date(lastDateRequested).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })
            : "Never requested"}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Your Referral Link</h2>
        <p className="text-gray-600 mb-4">
          Share this link with friends and earn rewards when they sign up!
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            type="text"
            readOnly
            value={userData.referral_link}
            className="flex-1 border border-gray-300 rounded-md px-4 py-2 bg-gray-50"
          />
          <button
            onClick={() => handleCopy(userData.referral_link, "Referral link")}
            className="bg-gradient-to-r from-[#5b03b2] to-[#9d50bb] text-white px-6 py-2 rounded-md font-medium flex items-center justify-center gap-2"
          >
            <span>Copy Link</span>
            <ClipboardCopy size={16} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Your Referral Code</h2>
        <p className="text-gray-600 mb-4">
          Share this code with friends who prefer to enter it manually during
          signup.
        </p>

        <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-md border border-gray-200 w-fit">
          <h3 className="text-[#070707] text-[1rem] font-medium">
            {userData?.referral_code || "Not set"}
          </h3>
          {userData?.referral_code && (
            <button
              onClick={() =>
                handleCopy(userData.referral_code, "Referral code")
              }
              className="text-[#5B03B2] hover:text-[#4A029A] transition-all duration-200 hover:scale-110"
            >
              <ClipboardCopy size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
