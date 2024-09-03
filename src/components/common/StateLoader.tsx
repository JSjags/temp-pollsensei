"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";

interface StateLoaderProps {
  goto: string;
}

const StateLoader: React.FC<StateLoaderProps> = ({ goto }) => {
  const [count, setCount] = useState(5);
  const router = useRouter();

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
