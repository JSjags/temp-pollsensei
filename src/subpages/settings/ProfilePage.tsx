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

interface UserData {
  name: string;
  lastName: string;
  email: string;
  username: string;
  bio: string;
  file: string;
  referral_code: string;
}

const ProfileSkeleton = () => {
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

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch();
  const { data, refetch, isLoading } = useUserProfileQuery({});
  const [editProfile, setEditProfile] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData>({
    name: "",
    lastName: "",
    email: "",
    username: "",
    bio: "",
    file: "",
    referral_code: "",
  });
  const [profileImage, setProfileImage] = useState<File | string | null>(null);

  useEffect(() => {
    if (data?.data) {
      console.log(data.data);

      const { name, email, username, bios, file, photo_url, referral_code } =
        data.data;
      setUserData({
        name: name || "",
        lastName: "",
        email: email || "",
        username: username || "",
        bio: bios[0]?.bio || "",
        file: file || photo_url || "",
        referral_code: referral_code || "",
      });
      setProfileImage(photo_url || userPlaceholder);
    }
  }, [data]);

  const [updateUserProfile, { isLoading: isUpdating }] =
    useUpdateUserProfileMutation();
  const [updateProfileImage, { isLoading: Updating }] =
    useUpdateProfileImageMutation();

  const toggleEdit = useCallback(() => {
    setEditProfile((prev) => !prev);
  }, []);

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
      setProfileImage(file);
    }
  };

  const handleImageUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
                <label htmlFor="userImage" className="text-[#5B03B2] font-bold">
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
            <button
              className="shadow-md flex text-sm rounded items-center px-4 py-2 w-full md:w-auto justify-center md:justify-start"
              onClick={toggleEdit}
            >
              <FaRegEdit className="mr-2" /> Edit
            </button>
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
                <h3 className="text-[#070707] text-[1rem]">
                  {userData.referral_code || "Not set"}
                </h3>
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
                className="text-[#5B03B2] font-bold"
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
