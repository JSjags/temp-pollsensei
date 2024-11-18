"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface StateLoaderProps {
  goto: string;
}

const StateLoader: React.FC<StateLoaderProps> = ({ goto }) => {
  const [count, setCount] = useState(5);
  const router = useRouter();
  const state = useSelector((state: RootState) => state.user);
  console.log(state?.user?.roles);



  useEffect(() => {
    const interval = setInterval(() => {
      setCount((currentCount) => currentCount - 1);
    }, 1000);

    if (count === 0) {
      router.replace(goto);
    }

    return () => clearInterval(interval);
  }, [count, goto, router]);

  return (
    <div className="flex justify-center items-center max-h-screen">
      <div className="text-center">
        <ClipLoader size={50} />
        <p className="text-[1rem]">Preparing your dashboard...</p>
      </div>
    </div>
  );
};

export default StateLoader;


// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { ClipLoader } from "react-spinners";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";

// interface StateLoaderProps {
//   defaultGoto: string; // Fallback route
// }

// const roleRouteMap: { [key: string]: string } = {
//   Admin: "/dashboard",
//   "Data Collector": "/surveys/survey-list",
//   "Data Validator": "/surveys/survey-list",
//   "Data Analyst": "/surveys/analysis",
//   "Data Editor": "/surveys/survey-list",
// };

// const StateLoader: React.FC<StateLoaderProps> = ({ defaultGoto }) => {
//   const [count, setCount] = useState(5);
//   const router = useRouter();
//   const userRoles = useSelector((state: RootState) => state.user.user?.roles[0].role || []);
//   console.log(userRoles)

//   const getDestinationRoute = () => {
//     if (userRoles.includes("Admin")) return roleRouteMap["Admin"]; // Admin has highest priority
//     for (const role of Object.keys(roleRouteMap)) {
//       if (userRoles.includes(role)) {
//         return roleRouteMap[role]; // Direct to the first matching role's route
//       }
//     }
//     return defaultGoto; // Fallback if no matching roles
//   };

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCount((currentCount) => currentCount - 1);
//     }, 1000);

//     if (count === 0) {
//       const destination = getDestinationRoute();
//       router.replace(destination);
//     }

//     return () => clearInterval(interval);
//   }, [count, router]);

//   return (
//     <div className="flex justify-center items-center max-h-screen">
//       <div className="text-center">
//         <ClipLoader size={50} />
//         <p className="text-[1rem]">Preparing your dashboard...</p>
//       </div>
//     </div>
//   );
// };

// export default StateLoader;

