import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn, generateInitials } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { pollsensei_new_logo } from "@/assets/images";
import { logoutUser } from "@/redux/slices/user.slice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface SuperAdminSidebarProps {
  isSidebarOpen: boolean;
  onClose: () => void;
}

const SuperAdminSidebar: React.FC<SuperAdminSidebarProps> = ({
  isSidebarOpen,
  onClose,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.user);

  return (
    <aside
      className={cn(
        " bg-white transition-all duration-300 h-full border",
        isSidebarOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex flex-col h-full border">
        {/* Hamburger Menu */}
        <div className="p-4 flex items-center justify-between">
          {isSidebarOpen && (
            <Image
              src={pollsensei_new_logo}
              alt="Logo"
              className="h-8 w-auto"
            />
          )}
          <button className="p-2 rounded " onClick={onClose}>
            {isSidebarOpen ? (
              // <X className="w-5 h-5" /> ""
              ""
            ) : (
              <Image
                src="/favicon.ico?v=1"
                alt="Logo"
                width={5}
                height={5}
                className="h-5 w-auto"
              />
              // <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex flex-col justify-between items-center h-full">
          <nav className="">
            {isSidebarOpen && (
              <div className="flex justify-between items-center">
                <Avatar className="size-10">
                  <AvatarImage
                    src={(user as any)?.photo_url ?? ""}
                    alt="@johndoe"
                  />
                  <AvatarFallback className="font-semibold">
                    {generateInitials((user as any)?.name ?? "")}
                  </AvatarFallback>
                </Avatar>
                <h2>{(user as any)?.name ?? ""}</h2>
              </div>
            )}
            <ul className="space-y-2 p-2">
              <li>
                <Link
                  href="/super-admin"
                  className="flex items-center gap-2 p-2 rounded hover:bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] px-4 hover:text-white"
                >
                  {/* <span>🏠</span> */}
                  {isSidebarOpen && <span>Dashboard</span>}
                </Link>
              </li>
              <li>
                <Link
                  href="/users"
                  className="flex items-center gap-2 p-2 rounded hover:bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] px-4 hover:text-white"
                >
                  {/* <span>📊</span> */}
                  {isSidebarOpen && <span>Users</span>}
                </Link>
              </li>
              <li>
                <Link
                  href="/tutorials"
                  className="flex items-center gap-2 p-2 rounded hover:bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] px-4 hover:text-white"
                >
                  {/* <span>⚙️</span> */}
                  {isSidebarOpen && <span>Tutorials</span>}
                </Link>
              </li>

              <li>
                <Link
                  href="/faqs"
                  className="flex items-center gap-2 p-2 rounded hover:bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] px-4 hover:text-white"
                >
                  {/* <span>⚙️</span> */}
                  {isSidebarOpen && <span>FAQs</span>}
                </Link>
              </li>
              <li>
                <Link
                  href="/subscriptions"
                  className="flex items-center gap-2 p-2 rounded hover:bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] px-4 hover:text-white"
                >
                  {/* <span>⚙️</span> */}
                  {isSidebarOpen && <span>Subscriptions</span>}
                </Link>
              </li>
            </ul>
          </nav>

          <nav className="text-start">
            <ul className="space-y-2 p-2">
              <li>
                <Link
                  href="/FAQs"
                  className="flex items-center gap-2 p-2 rounded hover:bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] px-4 hover:text-white"
                >
                  {isSidebarOpen && <span>Settings</span>}
                </Link>
              </li>
              <li>
                <span
                  onClick={() => {
                    dispatch(logoutUser());
                    router.push("/login");
                  }}
                  className="flex items-center gap-2 p-2 text-red-500 rounded hover:bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] px-4 hover:text-white"
                >
                  {isSidebarOpen && <span>Logout</span>}
                </span>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default SuperAdminSidebar;
