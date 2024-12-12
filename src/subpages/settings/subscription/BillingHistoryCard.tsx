"use client";

import { motion } from "framer-motion";
import { DollarSign, Percent } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function BillingHistoryCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-lg border-none bg-[#FAF8FB] shadow-sm h-full lg:col-span-2 opacity-0 grayscale"
    >
      <div className="flex items-center h-full">
        <div className="relative h-full flex-[0.9]">
          <Image
            src="/assets/subscription/billings.svg"
            alt="Shopping bag image"
            width={128}
            height={128}
            className="absolute bottom-0 left-0"
          />
        </div>
        <div className="flex h-full flex-1 justify-between py-6">
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold">
                Billing History
              </h3>
              <div className="space-y-1 mt-4">
                <p className="text-xs sm:text-sm text-muted-foreground opacity-0">
                  10th December, 2024
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground opacity-0">
                  9th January, 2025
                </p>
              </div>
            </div>
            <Link
              href="#"
              className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
            >
              View all
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
