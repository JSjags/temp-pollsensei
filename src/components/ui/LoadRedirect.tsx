"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface LoadRedirectProps {
  text: string;
  goto: string;
}

const LoadRedirect: React.FC<LoadRedirectProps> = ({ text, goto }) => {
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
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-75 text-center">
        <p className="text-red-300 font-bold">{text}</p>
        <p>Redirecting you in {count} second(s)</p>
      </div>
    </div>
  );
};

export default LoadRedirect;
