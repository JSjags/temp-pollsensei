const REDIRECT_KEY = "auth_redirect_url";
const LAST_STORED_KEY = "last_stored_route";

export const redirectUtils = {
  storeRedirectRoute: (currentPath: string): void => {
    const isBlogRoute =
      currentPath === "/blog" ||
      (currentPath.startsWith("/blog/") && !currentPath.includes("/bookmarks"));

    if (isBlogRoute) {
      try {
        // Prevent storing the same route multiple times
        const lastStored = sessionStorage.getItem(LAST_STORED_KEY);
        if (lastStored === currentPath) {
          console.log("Route already stored, skipping:", currentPath);
          return;
        }

        sessionStorage.setItem(REDIRECT_KEY, currentPath);
        sessionStorage.setItem(LAST_STORED_KEY, currentPath);
      } catch (error) {
        console.warn("Failed to store redirect route:", error);
      }
    }
  },

  getAndClearRedirectRoute: (): string | null => {
    try {
      const storedRoute = sessionStorage.getItem(REDIRECT_KEY);
      if (storedRoute) {
        sessionStorage.removeItem(REDIRECT_KEY);
        sessionStorage.removeItem(LAST_STORED_KEY);
        return storedRoute;
      }
    } catch (error) {
      console.warn("Failed to retrieve redirect route:", error);
    }
    return null;
  },

  shouldStoreRoute: (path: string): boolean => {
    return (
      path === "/blog" ||
      (path.startsWith("/blog/") && !path.includes("/bookmarks"))
    );
  },

  getRedirectAfterAuth: (userRoles: string[], ed?: string | null): string => {
    const storedRoute = redirectUtils.getAndClearRedirectRoute();
    if (storedRoute) {
      return storedRoute;
    }

    // Handle special 'ed' parameter routes
    if (ed) {
      switch (ed) {
        case "2":
          return "/surveys/edit-survey";
        case "3":
          return "/surveys/manual-survey-create";
        case "as":
          return "/settings/account-security";
        default:
          break;
      }
    }

    // Role-based routing
    if (userRoles.includes("Super Admin")) {
      return "/super-admin";
    }

    // Default to dashboard
    return "/dashboard";
  },
};

export const useRedirectAfterAuth = () => {
  return {
    storeRedirectRoute: redirectUtils.storeRedirectRoute,
    getRedirectAfterAuth: redirectUtils.getRedirectAfterAuth,
    shouldStoreRoute: redirectUtils.shouldStoreRoute,
  };
};
