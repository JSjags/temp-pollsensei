"use client";

import { loadStripe } from "@stripe/stripe-js";
import { useEffect } from "react";

const PaymentRedirect = ({ clientSecret }: { clientSecret: string }) => {
  useEffect(() => {
    const redirectToStripe = async () => {
      // Initialize Stripe
      const stripe = await loadStripe("your-publishable-key-here");

      if (!stripe) {
        console.error("Stripe failed to initialize.");
        return;
      }

      // Confirm the payment and handle redirection
      const { error } = await stripe.confirmCardPayment(clientSecret);

      if (error) {
        // Handle any errors that occur during redirection
        console.error("Payment failed:", error.message);
        alert("Failed to redirect to payment. Please try again.");
      }
    };

    redirectToStripe();
  }, [clientSecret]);

  return <div>Redirecting to payment...</div>;
};

// Example usage with server response
export default function PaymentPage({
  clientSecret,
}: {
  clientSecret: string;
}) {
  return <PaymentRedirect clientSecret={clientSecret} />;
}
