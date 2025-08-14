"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Field, Form } from "react-final-form";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { FaRegEdit } from "react-icons/fa";
import Image from "next/image";
import {
  useUpdateUserProfileMutation,
  useUpdateProfileImageMutation,
  useUserProfileQuery,
} from "../../services/user.service";
import { userPlaceholder } from "../../assets/images";
import TextArea from "../../components/ui/TextArea";
import InputEdit from "../../components/ui/InputEdit";
import { useDispatch } from "react-redux";
import apiSlice from "@/services/config/apiSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { ClipboardCopy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Star, Rocket, User, Users, Shield } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const ProfileSkeleton = () => {
  return (
    <div className="px-4 md:px-[4.4rem] flex flex-col py-6 md:py-[3.88rem]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
        <div className="flex flex-col md:flex-row flex-1 gap-3 items-start md:items-center">
          <Skeleton className="w-24 h-24 md:w-28 md:h-28 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-20 mt-7" />
        <div className="py-7">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="pb-4">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-6 w-48" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export interface UserData {
  name: string;
  lastName: string;
  email: string;
  username: string;
  bio: string;
  file: string;
  referral_code: string;
  referral_link: string;
  plan: {
    _id: string;
    name: string;
    description: string;
    number_of_monthly_responses: number;
    number_of_accounts: number;
    features: string[];
  } | null;
}

// Helper to get badge style and icon based on plan name
const getPlanBadgeProps = (planName: string) => {
  switch (planName.toLowerCase()) {
    case "basic plan":
      return {
        icon: <Star className="w-4 h-4 mr-1 text-blue-400" />,
        bg: "bg-gradient-to-r from-blue-200 to-blue-400 text-blue-900 border-blue-300 shadow",
        tooltipIcon: <Star className="w-4 h-4 mr-1 text-blue-400" />,
      };
    case "essential plan":
      return {
        icon: <Shield className="w-4 h-4 mr-1 text-purple-400" />,
        bg: "bg-gradient-to-r from-purple-400 to-purple-700 text-white border-purple-400 shadow-md",
        tooltipIcon: <Shield className="w-4 h-4 mr-1 text-purple-400" />,
      };
    case "starter plan":
      return {
        icon: <Rocket className="w-4 h-4 mr-1 text-amber-400" />,
        bg: "bg-gradient-to-r from-yellow-200 to-yellow-500 text-yellow-900 border-yellow-400 shadow-lg",
        tooltipIcon: <Rocket className="w-4 h-4 mr-1 text-amber-400" />,
      };
    case "professional plan":
      return {
        icon: <Users className="w-4 h-4 mr-1 text-gray-400" />,
        bg: "bg-gradient-to-r from-gray-200 to-gray-600 text-gray-900 border-gray-400 shadow-lg",
        tooltipIcon: <Users className="w-4 h-4 mr-1 text-gray-400" />,
      };
    case "enterprise plan":
      return {
        icon: <Shield className="w-4 h-4 mr-1 text-indigo-500" />,
        bg: "bg-gradient-to-r from-indigo-200 to-indigo-700 text-white border-indigo-400 shadow-lg",
        tooltipIcon: <Shield className="w-4 h-4 mr-1 text-indigo-500" />,
      };
    case "custom enterprise plan":
      return {
        icon: <Star className="w-4 h-4 mr-1 text-pink-400" />,
        bg: "bg-gradient-to-r from-pink-200 to-pink-600 text-white border-pink-400 shadow-lg",
        tooltipIcon: <Star className="w-4 h-4 mr-1 text-pink-400" />,
      };
    default:
      return {
        icon: <Star className="w-4 h-4 mr-1 text-blue-400" />,
        bg: "bg-gradient-to-r from-blue-200 to-blue-400 text-blue-900 border-blue-300 shadow",
        tooltipIcon: <Star className="w-4 h-4 mr-1 text-blue-400" />,
      };
  }
};

const ProfilePage: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [editProfile, setEditProfile] = useState<boolean>(false);
  const [profileImage, setProfileImage] = useState<File | string | null>(null);
  const [userData, setUserData] = useState<UserData>({
    name: "",
    lastName: "",
    email: "",
    username: "",
    bio: "",
    file: "",
    referral_code: "",
    referral_link: "",
    plan: null,
  });

  const dispatch = useDispatch();

  const { data, refetch, isLoading } = useUserProfileQuery({
    skip: !isClient,
  });
  const [updateUserProfile, { isLoading: isUpdating }] =
    useUpdateUserProfileMutation();
  const [updateProfileImage, { isLoading: Updating }] =
    useUpdateProfileImageMutation();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (data?.data) {
      const {
        name,
        email,
        username,
        bios,
        file,
        photo_url,
        referral_code,
        plan,
      } = data.data;

      const baseUrl =
        typeof window !== "undefined"
          ? window.location.origin
          : "https://pollsensei.ai";
      const referral_link = referral_code
        ? `${baseUrl}/register?ref=${referral_code}`
        : "";

      setUserData({
        name: name || "",
        lastName: "",
        email: email || "",
        username: username || "",
        bio: bios?.[0]?.bio || "",
        file: file || photo_url || "",
        referral_code: referral_code || "",
        referral_link: referral_link,
        plan,
      });
      setProfileImage(photo_url || userPlaceholder);
    }
  }, [data]);

  const toggleEdit = useCallback(() => {
    setEditProfile((prev) => !prev);
  }, []);

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${type} copied to clipboard!`);
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const onSubmit = async (values: UserData) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("bio", values.bio);
    if (profileImage instanceof File) {
      formData.append("file", profileImage);
    }
    if (values.username !== userData.username) {
      formData.append("username", values.username);
    }

    try {
      await updateUserProfile(formData).unwrap();
      toast.success("User profile updated successfully");
      toggleEdit();
      refetch();
      dispatch(apiSlice.util.resetApiState());
    } catch (err: any) {
      toast.error(
        "Failed to update user " + (err?.data?.message || err.message)
      );
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setProfileImage(file);
    }
  };

  const handleImageUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setProfileImage(file);
    }
    if (profileImage instanceof File) {
      const formData = new FormData();
      formData.append("file", profileImage);

      try {
        await updateProfileImage(formData).unwrap();
        toast.success("Profile image updated successfully");
        refetch();
      } catch (err: any) {
        toast.error(
          "Failed to update profile image " +
            (err?.data?.message || err.message)
        );
      }
    }
  };

  if (!isClient) {
    return <ProfileSkeleton />;
  }

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="px-4 md:px-[4.4rem] flex flex-col py-6 md:py-[3.88rem]">
      {!editProfile ? (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
            <div className="flex flex-col md:flex-row flex-1 gap-3 items-start md:items-center">
              <div className="w-24 h-24 md:w-28 md:h-28 relative">
                <Image
                  src={
                    typeof profileImage === "string"
                      ? profileImage
                      : userPlaceholder
                  }
                  alt="Profile image"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-[#333333] font-semibold">Profile picture</p>
                <small className="text-[#BDBDBD]">PNG, JPG up to 5MB</small>
                <label
                  htmlFor="userImage"
                  className="text-[#5B03B2] font-bold cursor-pointer hover:text-[#4A029A]"
                >
                  {Updating ? "Updating..." : "Update"}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  id="userImage"
                  className="hidden"
                  onChange={handleImageUpdate}
                />
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 min-w-[120px]">
              {(() => {
                if (!userData.plan) return null;
                const { icon, bg, tooltipIcon } = getPlanBadgeProps(
                  userData.plan.name
                );
                return (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Badge
                        variant="secondary"
                        className={`cursor-pointer h-8 px-4 py-2 text-sm font-bold rounded-full border-1 flex items-center gap-2 ${bg} transition-transform duration-200 hover:scale-105`}
                        style={{ letterSpacing: 0.5, minWidth: 140 }}
                      >
                        {icon}
                        {userData.plan.name}
                      </Badge>
                    </DialogTrigger>
                    <DialogContent
                      className="z-[1000000]"
                      overlayClassName="z-[1000000]"
                    >
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                          {tooltipIcon}
                          {userData.plan.name}
                        </DialogTitle>
                        <DialogDescription className="mb-2 text-xs text-gray-700 italic">
                          {userData.plan.description}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex gap-2 mb-2">
                        <span className="inline-block bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs font-semibold border border-gray-200">
                          {userData.plan.number_of_monthly_responses}{" "}
                          responses/mo
                        </span>
                        <span className="inline-block bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs font-semibold border border-gray-200">
                          {userData.plan.number_of_accounts} account(s)
                        </span>
                      </div>
                      {userData.plan.features &&
                        userData.plan.features.length > 0 && (
                          <ul className="list-none pl-0 text-xs text-gray-700 space-y-1 mt-2">
                            {userData.plan.features.map((feature, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <Star className="w-3 h-3 text-blue-400 flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                    </DialogContent>
                  </Dialog>
                );
              })()}
              <button
                className="shadow-md flex text-sm rounded items-center px-4 py-2 w-full md:w-auto justify-center md:justify-start hover:bg-gray-50"
                onClick={toggleEdit}
              >
                <FaRegEdit className="mr-2" /> Edit
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="mt-7 font-semibold">Details</h4>
            <div className="py-7">
              <div className="pb-4">
                <p className="text-[#7D8398] text-sm">Name</p>
                <h3 className="text-[#070707] text-[1rem]">
                  {userData.name || "Not set"}
                </h3>
              </div>
              <div className="pb-4">
                <p className="text-[#7D8398] text-sm">Email Address</p>
                <h3 className="text-[#070707] text-[1rem] break-all">
                  {userData.email || "Not set"}
                </h3>
              </div>
              <div className="pb-4">
                <p className="text-[#7D8398] text-sm">Username</p>
                <h3 className="text-[#070707] text-[1rem]">
                  {userData.username || "Not set"}
                </h3>
              </div>
              <div className="pb-4">
                <p className="text-[#7D8398] text-sm">
                  Bio (Write a short introduction)
                </p>
                <p className="text-[#070707] text-[1rem]">
                  {userData.bio || "Not set"}
                </p>
              </div>
              <div className="pb-4">
                <p className="text-[#7D8398] text-sm">Referral Code</p>
                <div className="flex items-center gap-2">
                  <h3 className="text-[#070707] text-[1rem]">
                    {userData.referral_code || "Not set"}
                  </h3>
                  {userData.referral_code && (
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
              <div className="pb-4">
                <p className="text-[#7D8398] text-sm">Referral Link</p>
                <div className="flex items-center gap-2">
                  <h3 className="text-[#070707] text-[1rem]">
                    {userData.referral_link || "Not set"}
                  </h3>
                  {userData.referral_link && (
                    <button
                      onClick={() =>
                        handleCopy(userData.referral_link, "Referral link")
                      }
                      className="text-[#5B03B2] hover:text-[#4A029A] transition-all duration-200 hover:scale-110"
                    >
                      <ClipboardCopy size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
            <div className="w-24 h-24 md:w-28 md:h-28 relative">
              <Image
                src={
                  profileImage instanceof File
                    ? URL.createObjectURL(profileImage)
                    : typeof profileImage === "string"
                    ? profileImage
                    : userPlaceholder
                }
                alt="Profile"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-[#333333] font-semibold">Profile picture</p>
              <small className="text-[#BDBDBD]">PNG, JPG up to 5MB</small>
              <label
                htmlFor="editUserImage"
                className="text-[#5B03B2] font-bold cursor-pointer hover:text-[#4A029A]"
              >
                Update
              </label>
              <input
                type="file"
                accept="image/*"
                id="editUserImage"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="mt-7 font-semibold">Details</h4>
            <Form
              onSubmit={onSubmit}
              initialValues={userData}
              render={({ handleSubmit, form, submitting }) => (
                <form onSubmit={handleSubmit} className="w-full md:w-2/3">
                  <Field name="name">
                    {({ input, meta }) => (
                      <InputEdit
                        label="Name"
                        type="text"
                        form={form as any}
                        placeholder="Enter your Name"
                        initialValue={userData.name}
                        {...input}
                      />
                    )}
                  </Field>
                  <Field name="email">
                    {({ input, meta }) => (
                      <InputEdit
                        label="Email"
                        type="text"
                        placeholder="Enter your Email"
                        {...input}
                        form={form as any}
                        readOnly={true}
                        initialValue={userData.email}
                      />
                    )}
                  </Field>
                  <Field name="username">
                    {({ input, meta }) => (
                      <InputEdit
                        label="Username"
                        type="text"
                        placeholder="Enter your Username"
                        {...input}
                        form={form as any}
                        initialValue={userData.username}
                      />
                    )}
                  </Field>
                  <Field name="bio">
                    {({ input, meta }) => (
                      <TextArea
                        label="Bio (Write a short introduction)"
                        type="text"
                        placeholder="Describe yourself here"
                        {...input}
                        form={form as any}
                      />
                    )}
                  </Field>

                  <div className="w-full flex flex-col md:flex-row gap-3 pt-3">
                    <button
                      className="text-[#898989] border-border border w-full justify-center rounded-lg hover:bg-gray-100 py-2"
                      type="button"
                      onClick={toggleEdit}
                    >
                      Cancel
                    </button>
                    <button
                      className="auth-btn w-full justify-center items-center py-2"
                      type="submit"
                      disabled={submitting || isUpdating}
                    >
                      {submitting || isUpdating ? (
                        <ClipLoader size={20} color="white" />
                      ) : (
                        "Save"
                      )}
                    </button>
                  </div>
                </form>
              )}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
