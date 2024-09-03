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

interface UserData {
  name: string;
  lastName: string;
  email: string;
  username: string;
  bio: string;
  file: string;
}

const ProfilePage: React.FC = () => {
  const { data, refetch } = useUserProfileQuery({});
  const [editProfile, setEditProfile] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData>({
    name: "",
    lastName: "",
    email: "",
    username: "",
    bio: "",
    file: "",
  });
  const [profileImage, setProfileImage] = useState<File | string | null>(null);

  useEffect(() => {
    if (data?.data) {
      const { name, email, username, bios, file, photo_url } = data.data;
      setUserData({
        name: name || "",
        lastName: "",
        email: email || "",
        username: username || "",
        bio: bios[0]?.bio || "",
        file: file || photo_url || "",
      });
      setProfileImage(photo_url || userPlaceholder);
    }
  }, [data]);

  console.log(data);
  console.log(userData);

  const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation();
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

  return (
    <div className="px-[4.4rem] flex flex-col py-[3.88rem]">
      {!editProfile ? (
        <>
          <div className="flex justify-between items-center">
            <div className="flex gap-3 items-center">
              <Image
                src={
                  typeof profileImage === "string"
                    ? profileImage
                    : userPlaceholder
                }
                alt="Profile image"
                width={107}
                height={107}
                className="rounded-full"
              />
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
              className="shadow-md flex text-sm rounded items-center px-4 py-2"
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
                <h3 className="text-[#070707] text-[1rem]">
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
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex gap-3 items-center">
            <Image
              src={
                profileImage instanceof File
                  ? URL.createObjectURL(profileImage)
                  : typeof profileImage === "string"
                  ? profileImage
                  : userPlaceholder
              }
              alt="Profile"
              width={107}
              height={107}
              className="rounded-full"
            />
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
                <form onSubmit={handleSubmit} className="w-2/3">
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

                  <div className="w-full flex gap-3 pt-3">
                    <button
                      className="text-[#898989] border-border border w-full justify-center rounded-lg hover:bg-gray-100"
                      type="button"
                      onClick={toggleEdit}
                    >
                      Cancel
                    </button>
                    <button
                      className="auth-btn w-full justify-center items-center"
                      type="submit"
                      disabled={submitting || isLoading}
                    >
                      {submitting || isLoading ? (
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
