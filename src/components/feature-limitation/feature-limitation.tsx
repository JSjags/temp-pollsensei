"use client";

import React, { useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { setIsLimited, setMessage } from "@/redux/slices/limitation.slice";
import { FaLock } from "react-icons/fa";
import Link from "next/link";

const FeatureLimitation: React.FC = () => {
  const { isLimited, message } = useSelector(
    (state: RootState) => state.limitation || { isLimited: false, message: "" }
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const [open, setOpen] = React.useState(isLimited);

  console.log(isLimited);
  console.log(message);

  // Keep dialog open if limited, close otherwise
  useEffect(() => {
    setOpen(isLimited);
  }, [isLimited]);

  // Reset limitation state
  const resetLimitation = useCallback(() => {
    dispatch(setIsLimited(false));
    dispatch(setMessage(""));
  }, [dispatch]);

  // Go back in history and reset limitation
  const handleGoBack = useCallback(() => {
    resetLimitation();
    router.back();
  }, [resetLimitation, router]);

  // Go to subscription/upgrade page and reset limitation
  const handleUpgrade = useCallback(() => {
    resetLimitation();
    router.push("/settings/subscription");
  }, [resetLimitation, router]);

  // If dialog closes, reset limitation and go back
  const handleOpenChange = (val: boolean) => {
    if (!val) {
      handleGoBack();
    }
    setOpen(val);
  };

  if (!isLimited) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-md rounded-2xl shadow-2xl bg-white z-[1000000] animate-fade-in-up"
        overlayClassName="z-[1000000] bg-black bg-opacity-70 backdrop-blur-md"
      >
        <div className="flex flex-col items-center">
          <div className="bg-gradient-to-r from-primary to-purple-600 rounded-full p-4 mb-2 shadow-lg">
            <FaLock className="text-white text-3xl" />
          </div>
        </div>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent text-center">
            Feature Limited
          </DialogTitle>
          <DialogDescription className="pt-4 text-center text-base text-gray-700">
            {message ||
              "You have reached a limitation for your current plan. Please upgrade to continue."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center mt-2">
          <Link
            onClick={handleUpgrade}
            href="/settings/subscription"
            className="text-xs text-primary underline hover:text-purple-600 transition-colors duration-200"
          >
            Compare Plans
          </Link>
        </div>
        <DialogFooter className="flex gap-4 mt-8 justify-center">
          <Button
            variant="outline"
            className="flex-1 h-10 font-medium border-2 hover:bg-gray-50 transition-colors duration-200"
            onClick={handleGoBack}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 h-10 font-medium bg-gradient-to-r from-[#5b03b2] to-[#9d50bb] hover:opacity-90 transition-opacity duration-200 text-white shadow-glow animate-glow"
            onClick={handleUpgrade}
          >
            Upgrade Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeatureLimitation;
