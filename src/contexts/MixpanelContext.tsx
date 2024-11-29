"use client";

import { RootState } from "@/redux/store";
import mixpanel from "mixpanel-browser";
import { usePathname } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSelector } from "react-redux";

// The current version of the mixpanel types does not include all methods. Let's add them
declare module "mixpanel-browser" {
  interface Mixpanel {
    init(token: string, config?: any): void;
    track(event_name: string, properties?: Record<string, any>): void;
    track_pageview(properties?: Record<string, any>): void;
  }
}

const MixPanelContext = createContext<typeof mixpanel | undefined>(undefined);

type Props = {
  children: ReactNode;
};

const MixPanelProvider = ({ children }: Props) => {
  const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
  const pathname = usePathname();
  const state = useSelector((state: RootState) => state.user);

  useEffect(() => {
    // Initialize Mixpanel here
    if (typeof window !== "undefined" && MIXPANEL_TOKEN) {
      try {
        mixpanel.init(MIXPANEL_TOKEN, {
          debug: process.env.NODE_ENV === "development",
          persistence: "localStorage",
        });
      } catch (error) {
        console.error("Failed to initialize Mixpanel:", error);
      }
    }
  }, []);

  useEffect(() => {
    try {
      if (
        typeof window !== "undefined" &&
        MIXPANEL_TOKEN && // Check if token exists
        mixpanel &&
        typeof mixpanel.track === "function"
      ) {
        const eventProperties = {
          page: pathname,
          ...(state?.user && { user: state.user }),
        };
        mixpanel.track("Page View", eventProperties);
      }
    } catch (error) {
      console.error("Failed to track page view:", error);
    }
  }, [pathname, state]);

  return (
    <MixPanelContext.Provider value={mixpanel}>
      {children}
    </MixPanelContext.Provider>
  );
};

function useMixPanel() {
  const context = useContext(MixPanelContext);
  if (context === undefined) {
    throw new Error("MixPanelContext must be used within a MixpanelProvider");
  }

  return context;
}

export { MixPanelProvider, useMixPanel };
