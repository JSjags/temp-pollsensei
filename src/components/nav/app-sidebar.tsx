"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { pollsensei_icon, pollsensei_new_logo } from "@/assets/images";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: "/assets/sidebar/home.svg",
  },
  // {
  //   title: "Earn",
  //   url: "/earn",
  //   icon: "/assets/sidebar/earn.svg",
  // },
  // {
  //   title: "Shop",
  //   url: "/shop",
  //   icon: "/assets/sidebar/shop.svg",
  // },
  {
    title: "Survey Board",
    url: "/surveys",
    icon: "/assets/sidebar/survey-board.svg",
  },
  // {
  //   title: "Payouts",
  //   url: "/payouts",
  //   icon: "/assets/sidebar/payouts.svg",
  // },
  // {
  //   title: "Referrals",
  //   url: "/referrals",
  //   icon: "/assets/sidebar/referrals.svg",
  // },
  {
    title: "Learning Hub",
    url: "/learning-hub",
    icon: "/assets/sidebar/learning-hub.svg",
  },
  {
    title: "Profile",
    url: "/settings/profile",
    icon: "/assets/sidebar/profile.svg",
  },
  // {
  //   title: "Survey Settings",
  //   url: "/survey-settings",
  //   icon: "/assets/sidebar/survey-settings.svg",
  // },
  {
    title: "Settings",
    url: "/settings/account-security",
    icon: "/assets/sidebar/settings.svg",
  },
];

export function AppSidebar() {
  const { open, isMobile, setOpenMobile } = useSidebar();
  const pathname = usePathname();

  const isActive = (itemUrl: string) => {
    // Special case for dashboard
    if (itemUrl === "/dashboard" && pathname === "/dashboard") {
      return true;
    }
    // For other routes, check exact match or if current path starts with item URL
    return pathname === itemUrl || pathname.startsWith(itemUrl + "/");
  };

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar
      collapsible={isMobile ? "offcanvas" : "icon"}
      variant="floating"
      className="transition-all pr-0 z-[100000]"
    >
      <SidebarContent className={cn("pt-4")}>
        <SidebarHeader
          className={cn(
            "w-full items-center",
            !open ? "flex justify-center" : "pl-6"
          )}
        >
          {!open ? (
            <Link
              href="/dashboard"
              className="w-fit -translate-x-0"
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
        <SidebarGroup className="pt-6 px-0">
          <SidebarGroupContent>
            <SidebarMenu
              className={cn("gap-y-6", !open && "flex flex-col items-center")}
            >
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="px-4 relative">
                  {isActive(item.url) && (
                    <div className="bg-[#3734A9] w-[3.15px] h-[70%] absolute left-0 top-1/2 -translate-y-1/2" />
                  )}
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "gap-4 h-10 px-3 rounded-xl",
                      isActive(item.url) &&
                        "bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] shadow-[-5px_5px_10px_#563BFF42]"
                    )}
                    isActive={isActive(item.url)}
                  >
                    <Link href={item.url} onClick={handleNavClick}>
                      <Image
                        src={item.icon}
                        alt={item.title}
                        width={24}
                        height={24}
                        className={cn(isActive(item.url) && "brightness-200")}
                      />
                      <span
                        className={cn(
                          "text-foreground/50",
                          isActive(item.url) && "text-white"
                        )}
                      >
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
