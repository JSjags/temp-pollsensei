"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface StateLoader2Props {
  defaultGoto: string; // Fallback route
  directRoute?: string; // Fallback route
}

const roleRouteMap: { [key: string]: string } = {
  Admin: "/dashboard",
  "Data Collector": "/surveys/survey-list",
  "Data Validator": "/surveys/survey-list",
  "Data Analyst": "/surveys/survey-list",
  "Data Editor": "/surveys/survey-list",
  "Super Admin": "/super-admin",
};

const StateLoader2: React.FC<StateLoader2Props> = ({
  defaultGoto,
  directRoute,
}) => {
  const [count, setCount] = useState(5);
  const router = useRouter();
  const userRoles = useSelector(
    (state: RootState) => state.user.user?.roles[0].role || []
  );
  console.log(userRoles);

  const getDestinationRoute = () => {
    console.log(directRoute);

    if (directRoute) {
      return directRoute;
    }
    if (userRoles.includes("Admin")) return roleRouteMap["Admin"]; // Admin has highest priority
    for (const role of Object.keys(roleRouteMap)) {
      if (userRoles.includes(role)) {
        return roleRouteMap[role]; // Direct to the first matching role's route
      }
    }
    return defaultGoto; // Fallback if no matching roles
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((currentCount) => currentCount - 1);
    }, 1000);

    if (count === 0) {
      const destination = getDestinationRoute();
      router.replace(destination);
    }

    return () => clearInterval(interval);
  }, [count, router]);

  return (
    <div className="flex flex-col justify-center items-center max-h-screen gap-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-20 h-20"
      >
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        >
          <svg className="w-full h-full" viewBox="0 0 50 50">
            <circle
              cx="25"
              cy="25"
              r="15"
              fill="none"
              strokeWidth="2"
              stroke="url(#gradient)"
              strokeLinecap="round"
              strokeDasharray="80"
              style={{
                animation: "dash 2s ease-in-out infinite",
              }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#5B03B2" />
                <stop offset="100%" stopColor="#9D50BB" />
              </linearGradient>
            </defs>
            <style>
              {`
                @keyframes dash {
                  0% {
                    stroke-dashoffset: 80;
                  }
                  50% {
                    stroke-dashoffset: 0;
                  }
                  100% {
                    stroke-dashoffset: -80;
                  }
                }
              `}
            </style>
          </svg>
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-center"
      >
        <p className="text-lg font-medium">Preparing your dashboard...</p>
      </motion.div>
    </div>
  );
};

export default StateLoader2;
