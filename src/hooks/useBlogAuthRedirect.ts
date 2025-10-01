import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useCallback, useRef } from "react";
import { RootState } from "@/redux/store";
import { redirectUtils } from "@/utils/redirectUtils";

export const useBlogAuthRedirect = () => {
  const pathname = usePathname();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user?.user);

  // Prevent multiple simultaneous redirects
  const redirectingRef = useRef(false);

  const redirectToAuth = useCallback(
    (authType: "login" | "register" = "login") => {
      if (redirectingRef.current) {
        return;
      }

      redirectingRef.current = true;

      if (redirectUtils.shouldStoreRoute(pathname)) {
        redirectUtils.storeRedirectRoute(pathname);
      }

      router.push(`/${authType}`);

      // Reset the flag after navigation
      setTimeout(() => {
        redirectingRef.current = false;
      }, 1000);
    },
    [pathname, router]
  );

  const requireAuth = useCallback(
    (authType: "login" | "register" = "login"): boolean => {
      if (!user) {
        redirectToAuth(authType);
        return false;
      }
      return true;
    },
    [user, redirectToAuth]
  );

  return {
    redirectToAuth,
    requireAuth,
    isAuthenticated: !!user,
  };
};
