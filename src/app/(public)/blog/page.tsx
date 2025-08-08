"use client";
import NavBar from "@/components/blocks/NavBar";
import Navbar from "@/components/navbar/Navbar";
import Dashboard from "@/subpages/blog/Dashboard";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const BlogPage = () => {
  const user = useSelector((state: RootState) => state.user?.user);

  return (
    <>
      {user ? <Navbar showReportsHeader={true} /> : <NavBar />}
      <Dashboard />
    </>
  );
};
export default BlogPage;
