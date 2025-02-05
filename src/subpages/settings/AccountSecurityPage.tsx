"use client";

import { useRouter } from "next/navigation";
import Switch from "../../components/settings/Switch";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { changePassword, getPasswordResetCode } from "@/services/admin";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/shadcn-input";
import { AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

interface PasswordChangeFormData {
  code: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordChangeModalProps {
  showPasswordModal: boolean;
  onClose: () => void;
}

const AccountSecurityPage = () => {
  const router = useRouter();
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const [getCode, setGetCode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const resetCodeQuery = useQuery({
    queryKey: ["reset-code"],
    queryFn: getPasswordResetCode,
    enabled: getCode,
  });

  const handlePasswordReset = () => {
    setGetCode(true);
  };

  useEffect(() => {
    if (resetCodeQuery.isSuccess) {
      toast.success("Password reset code sent to your email.");
      setGetCode(false);
      setShowPasswordModal(true);
    }
  }, [resetCodeQuery.isSuccess]);

  return (
    <div className="px-4 sm:px-6 lg:px-[4.4rem] flex flex-col py-6 sm:py-8 lg:py-[3.88rem]">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center pb-5 space-y-4 lg:space-y-0">
        <div className="flex flex-col lg:w-2/3">
          <h3 className="text-lg sm:text-xl lg:text-[calc(1rem+4px)] font-bold">
            Change Password
          </h3>
          <p className="text-[#898989] text-sm sm:text-base mt-2">
            Regularly updating your password helps protect your account from
            unauthorized access and enhances overall security.
          </p>
        </div>
        <button
          className="shadow-md text-sm rounded text-[#898989] px-4 py-2 w-full lg:w-auto mt-4 lg:mt-0"
          onClick={() => handlePasswordReset()}
          disabled={resetCodeQuery.isLoading}
        >
          {resetCodeQuery.isLoading
            ? "Sending reset code ..."
            : "Change Password"}
        </button>
        <PasswordChangeModal
          onClose={() => setShowPasswordModal(false)}
          showPasswordModal={showPasswordModal}
        />
      </div>
      {/* <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
        <div className="flex flex-col lg:w-2/3">
          <h3 className="text-lg sm:text-xl lg:text-[calc(1rem+4px)] font-bold">
            Two-Factor Authentication
          </h3>
          <p className="text-[#898989] text-sm sm:text-base mt-2">
            Regularly updating your password helps protect your account from
            unauthorized access and enhances overall security.
          </p>
        </div>
        <Switch
          isChecked={isTwoFactorEnabled}
          onClick={() => setIsTwoFactorEnabled(!isTwoFactorEnabled)}
        />
      </div> */}
    </div>
  );
};

export default AccountSecurityPage;

const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({
  showPasswordModal,
  onClose,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<PasswordChangeFormData>({ mode: "onChange" });

  const submitPasswordQuery = useMutation({
    mutationKey: ["change-password"],
    mutationFn: (data: {
      code: number;
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    }) => changePassword(data),
    onSuccess: () => {
      toast.success("Password updated successfully");
      onClose();
    },
    // onError: (error: any) => {
    //   console.log(error);

    //   toast.error(
    //     "Encountered error while updating password, please try again later."
    //   );
    // },
  });

  const onSubmit = (data: PasswordChangeFormData) => {
    submitPasswordQuery.mutate({
      code: parseInt(data.code),
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    });
  };

  const newPassword = watch("newPassword");

  return (
    <Dialog open={showPasswordModal} onOpenChange={onClose}>
      <DialogContent className="w-[95%] max-w-[425px] mx-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl text-center">
            Change Password
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="code" className="text-sm sm:text-base">
              Reset Code
            </Label>
            <Input
              id="code"
              type="text"
              className="w-full"
              {...register("code", { required: "Reset code is required" })}
            />
            {errors.code && (
              <p className="text-xs sm:text-sm text-red-500 flex items-center">
                <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                {errors.code.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-sm sm:text-base">
              Current Password
            </Label>
            <Input
              id="currentPassword"
              type="password"
              className="w-full"
              {...register("currentPassword", {
                required: "Current password is required",
              })}
            />
            {errors.currentPassword && (
              <p className="text-xs sm:text-sm text-red-500 flex items-center">
                <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                {errors.currentPassword.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-sm sm:text-base">
              New Password
            </Label>
            <Input
              id="newPassword"
              type="password"
              className="w-full"
              {...register("newPassword", {
                required: "New password is required",
                pattern: {
                  value:
                    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
                  message:
                    "Password must be between 8 and 20 characters long, contain at least one uppercase letter, one number, and one special character",
                },
              })}
            />
            {errors.newPassword && (
              <p className="text-xs sm:text-sm text-red-500 flex items-center">
                <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                {errors.newPassword.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm sm:text-base">
              Confirm New Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              className="w-full"
              {...register("confirmPassword", {
                required: "Please confirm your new password",
                validate: (value) =>
                  value === newPassword || "The passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <p className="text-xs sm:text-sm text-red-500 flex items-center">
                <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full mt-6"
            disabled={!isValid || submitPasswordQuery.isPending}
          >
            {submitPasswordQuery.isPending ? "Hang on ..." : "Change Password"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
