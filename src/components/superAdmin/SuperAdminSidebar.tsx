import React from "react";
import { cn, generateInitials } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { pollsensei_icon, pollsensei_new_logo } from "@/assets/images";
import { logoutUser } from "@/redux/slices/user.slice";
import { useDispatch } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Star,
  HelpCircle,
  CreditCard,
  Users2,
  Settings,
  LogOut,
  User,
} from "lucide-react";
import { Button } from "../ui/button";

const SuperAdminSidebar: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.user);
  const pathname = usePathname();
  const isActiveRoute = (route: string) => pathname === route;

  const { open, isMobile, setOpenMobile } = useSidebar();

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const sidebarItems = [
    {
      label: "Dashboard",
      path: "/super-admin",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    { label: "Users", path: "/users", icon: <Users className="h-4 w-4" /> },
    {
      label: "Tutorials",
      path: "/tutorials",
      icon: <BookOpen className="h-4 w-4" />,
    },
    { label: "Reviews", path: "/reviews", icon: <Star className="h-4 w-4" /> },
    { label: "FAQs", path: "/faqs", icon: <HelpCircle className="h-4 w-4" /> },
    // {
    //   label: "Subscriptions",
    //   path: "/subscriptions",
    //   icon: <CreditCard className="h-4 w-4" />,
    // },
    {
      label: "Referrers",
      path: "/referrers",
      icon: <Users2 className="h-4 w-4" />,
    },
  ];

  return (
    <Sidebar
      className={cn("transition-all duration-300", open ? "w-64" : "w-16")}
      collapsible={isMobile ? "offcanvas" : "icon"}
      variant="floating"
    >
      <SidebarHeader className="h-14 px-4">
        {!open ? (
          <Link
            href="/dashboard"
            className="w-full -translate-x-0 flex justify-center transition-all"
            onClick={handleNavClick}
          >
            <Image src={pollsensei_icon} alt="Logo" />
          </Link>
        ) : (
          <Link href="/dashboard" className="w-full" onClick={handleNavClick}>
            <Image src={pollsensei_new_logo} alt="Logo" className="w-[60%]" />
          </Link>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {sidebarItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <Button
                variant={isActiveRoute(item.path) ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActiveRoute(item.path) &&
                    "bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] text-white hover:from-[#5B03B2] hover:to-[#9D50BB]",
                  !open && "justify-center"
                )}
              >
                {item.icon}
                {open && <span className="ml-2">{item.label}</span>}
              </Button>
            </Link>
          ))}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t pt-2">
        {/* <Button variant="ghost" className="w-full justify-start">
          <Settings className="h-4 w-4" />
          {open && <span className="ml-2">Settings</span>}
        </Button> */}
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-500 hover:bg-red-50"
          onClick={() => {
            dispatch(logoutUser());
            router.push("/login");
          }}
        >
          <LogOut className="h-4 w-4" />
          {open && <span className="ml-2">Logout</span>}
        </Button>

        {/* Admin Profile Section */}
        <div
          className={cn(
            "mt-2 p-4 flex items-center gap-3 px-2",
            !open && "justify-center"
          )}
        >
          <Avatar className="h-10 w-10 border bg-gray-50 border-border p-0">
            <AvatarImage src={(user as any)?.photo_url} />
            <AvatarFallback className="text-black bg-gray-50 p-0">
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          {open && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold">
                {(user as any)?.name}
              </span>
              <span className="text-xs text-muted-foreground">Super Admin</span>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SuperAdminSidebar;
