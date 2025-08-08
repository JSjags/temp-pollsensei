"use client";
import React from "react";
import NavBar from "@/components/blocks/NavBar";
import Navbar from "@/components/navbar/Navbar";
import BlogDetails from "@/subpages/blog/BlogDetails";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface BlogPageContentProps {
  params: {
    slug: string;
  };
}

const BlogPageContent: React.FC<BlogPageContentProps> = ({ params }) => {
  const user = useSelector((state: RootState) => state.user?.user);

  return (
    <>
      {user ? <Navbar showReportsHeader={true} /> : <NavBar />}
      <BlogDetails slug={params.slug} />
    </>
  );
};

export default BlogPageContent;
