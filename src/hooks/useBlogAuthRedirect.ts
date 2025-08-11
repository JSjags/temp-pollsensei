import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { redirectUtils } from "@/utils/redirectUtils";

export const useBlogAuthRedirect = () => {
  const pathname = usePathname();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user?.user);

  const redirectToAuth = (authType: "login" | "register" = "login") => {
    if (redirectUtils.shouldStoreRoute(pathname)) {
      redirectUtils.storeRedirectRoute(pathname);
    }

    router.push(`/${authType}`);
  };

  const requireAuth = (authType: "login" | "register" = "login"): boolean => {
    if (!user) {
      redirectToAuth(authType);
      return false;
    }
    return true;
  };

  return {
    redirectToAuth,
    requireAuth,
    isAuthenticated: !!user,
  };
};
