"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserProfileQuery } from "@/services/user.service";
import { useDispatch } from "react-redux";
import apiSlice from "@/services/config/apiSlice";
import { useQueryClient } from "@tanstack/react-query";

export default function PaymentSuccess({
  searchParams: { amount },
}: {
  searchParams: { amount: string };
}) {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { data, refetch } = useUserProfileQuery({});
  const router = useRouter();

  useEffect(() => {
    // Launch confetti when component mounts
    const duration = 3 * 1000;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval: any = setInterval(() => {
      const particleCount = 50;
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    setTimeout(() => clearInterval(interval), duration);
  }, []);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["profile"] });
  }, []);

  return (
    <main className="w-full h-full mx-auto flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full h-full text-center min-h-[70vh] rounded-lg space-y-8 bg-gradient-to-tr from-purple-600 to-blue-600 p-12 shadow-2xl"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center"
        >
          <div className="bg-white/10 backdrop-blur-lg p-4 rounded-full">
            <CheckCircle2 className="w-16 h-16 text-white" />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <h1 className="text-5xl font-bold text-white">Payment Successful!</h1>
          <p className="text-xl text-white/80">Thank you for your payment</p>
        </motion.div>

        {/* <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-white/10 backdrop-blur-lg p-6 rounded-xl inline-block"
        >
          <span className="text-5xl font-bold text-white">${amount}</span>
        </motion.div> */}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="pt-4"
        >
          <p className="text-white/60">
            Your subscription has been activated successfully
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="flex gap-4 justify-center pt-8"
        >
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-white/90 transition-colors"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => router.push("/settings/subscription")}
            className="px-6 py-3 bg-white/10 backdrop-blur-lg text-white rounded-lg font-semibold hover:bg-white/20 transition-colors"
          >
            View Subscription
          </button>
        </motion.div>
      </motion.div>
    </main>
  );
}
