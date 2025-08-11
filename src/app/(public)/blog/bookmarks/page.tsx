//Bookmark page with min-height fix
"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Bookmarks from "@/subpages/blog/Bookmarks";
import Navbar from "@/components/navbar/Navbar";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const BookmarkPage = () => {
  const user = useSelector((state: RootState) => state.user?.user);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Redirecting to login page...</div>
      </div>
    );
  }

  return (
    // Add min-height to prevent shrinking
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Bookmarks />
      </div>
    </div>
  );
};

export default BookmarkPage;
