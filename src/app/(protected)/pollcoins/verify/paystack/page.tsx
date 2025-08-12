"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "@/lib/axios-instance";
import rawAxiosInstance from "@/lib/rawAxiosInstance";

export default function PaystackVerificationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get("reference");

  useEffect(() => {
    if (reference) {
      rawAxiosInstance
        .get(`/purchases/pollcoins/verify/paystack?reference=${reference}`)
        .then((res) => {
          console.log("Payment verified:", res.data);
          router.replace("/shop"); // Redirect after success
        })
        .catch((err) => {
          console.error(
            "Verification failed:",
            err.response?.data || err.message
          );
        });
    }
  }, [reference, router]);

  return <div>Verifying your payment...</div>;
}
