import React, { useState } from "react";
import { useShopStore } from "../../../store/useShopStore";
import Image from "next/image";
import { LockIcon, PaystackLogo, StripeLogo, VisaLogo } from "@/assets/images";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/shadcn-input";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/new-dialog";
import { usePollcoinPurchase } from "@/lib/purchase";
import { toast } from "react-toastify";
import { usePollcoinOrderSummary } from "@/components/shop/queries/usePollcoinsPurchase";
import { useGeoLocation } from "@/subpages/settings/subscription/PricingCards";

const PaymentOptionsData = [
  {
    label: "Card",
    src: VisaLogo,
  },
  {
    label: "Stripe",
    src: StripeLogo,
  },
  {
    label: "Paystack",
    src: PaystackLogo,
  },
];

export function CheckoutDialog() {
  const [selectedOption, setSelectedOption] = useState<string | null>("Card");
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [mobileView, setMobileView] = useState<"details" | "overview">(
    "overview"
  );
  const { mutate: purchasePollcoins } = usePollcoinPurchase();
  const { mutateAsync: createOrderSummary } = usePollcoinOrderSummary();
    const {
      data: locationData,
      isLoading: locationLoading,
      isError: locationError,
    } = useGeoLocation();
    const isNigeria = locationData?.isNigeria;

  const {
    pollAmount,
    pollcoins,
    loading,
    setLoading,
    setPollStep,
    setPollcoins
  } = useShopStore();

  const txnOverview = [
    {
      label: "Amount of Pollcoins",
      value: pollcoins,
    },
    {
      label: "Unit Price",
      value: 0.25,
    },
    {
      label: "VAT",
      value: 0.05,
    },
    {
      label: "Transaction Fee",
      value: 0.01,
    },
    {
      label: "Coin Cost",
      value: pollAmount,
    },
  ];

  // These are just for testing
  const resetLocalState = () => {
    setCardHolder("");
    setCardNumber("");
    setCardExpiry("");
    setCardCVV("");
    setSelectedOption("Card");
  };

  const handleCheckout = async () => {
    setLoading(true);

    const amount = parseFloat(pollAmount);
    const pollcoinsInt = Number(pollcoins);

    if (isNaN(amount) || amount <= 0) {
      toast.error("Invalid amount");
      setLoading(false);
      return;
    }

    try {
      const summary = await createOrderSummary({
        currency: isNigeria? "NGN" : 'USD',
        amount,
        pollcoins: pollcoinsInt,
      });

      if (!summary?.success || !summary.data?.orderSummary) {
        throw new Error("Invalid order summary response");
      }

      const orderSummary = summary.data.orderSummary;

      // 1. FIRST update the local state with the purchase amount
      useShopStore.getState().setPollcoins(pollcoinsInt.toString());

      // 2. THEN store in localStorage for retrieval after payment
      localStorage.setItem('purchasedPollcoins', pollcoinsInt.toString());

      // 3. FINALLY initiate payment
      const paymentGateway = selectedOption?.toLowerCase() === "stripe" ? "stripe" : "paystack";
      const redirectUrl = `${window.location.origin}/shop?success=true`;

      purchasePollcoins(
        {
          paymentGateway,
          currency: "NGN",
          amount: orderSummary.totalAmount,
          pollcoins: pollcoinsInt,
          orderReferenceId: orderSummary.referenceId,
          redirect_url: redirectUrl,
        },
        {
          onSuccess: (res) => {
            if (res.success && res.data?.payment?.authorization_url) {
              // Only redirect if everything succeeded
              window.location.href = res.data.payment.authorization_url;
            } else {
              // Clean up if failed
              localStorage.removeItem('purchasedPollcoins');
              toast.error(res.message || "Payment initialization failed");
              setLoading(false);
            }
          },
          onError: (err) => {
            localStorage.removeItem('purchasedPollcoins');
            const errorMessage = err.message || "Payment failed";
            toast.error(errorMessage);
            setLoading(false);
          },
        }
      );
    } catch (err: any) {
      localStorage.removeItem('purchasedPollcoins');
      const errorMessage = err.response?.data?.message || err.message || "Order summary failed";
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  return (
    <Dialog.Body className="h-full mt-2.5">
      <div className="flex gap-14 h-full max-[440px]:flex-row-reverse">
        <div
          className={cn(
            "w-[55%] flex flex-col gap-4 details h-full max-[440px]:w-full",
            mobileView !== "details" && "max-[440px]:hidden"
          )}
        >
          <h3 className="text-2xl font-bold text-tertiary">Checkout</h3>
          <div className="flex items-center bg-sec-bg p-4">
            <p>
              Payments are SSL encrypted so that your credit card and payment
              details stay safe.
            </p>
            <Image src={LockIcon} alt="lock icon" />
          </div>
          <div className="flex items-center justify-between gap-2 border-b pb-4">
            {PaymentOptionsData.map((option) => (
              <PaymentOptions
                {...option}
                key={option.label}
                isActive={selectedOption === option.label}
                onClick={() => setSelectedOption(option.label)}
              />
            ))}
          </div>
          <div>
            <label htmlFor="name" className="text-sm">
              Card Holder Name
            </label>
            <Input
              type="text"
              id="name"
              name="name"
              placeholder="Enter card holder name"
              className="mt-2 h-[54px]"
              value={cardHolder}
              onChange={(e) => {
                setCardHolder(e.target.value);
              }}
            />
          </div>
          <div>
            <label htmlFor="number" className="text-sm">
              Card Number
            </label>
            <Input
              type="number"
              id="number"
              name="number"
              placeholder="Enter card number"
              className="mt-2 h-[54px]"
              value={cardNumber}
              onChange={(e) => {
                setCardNumber(e.target.value);
              }}
            />
          </div>
          <div className="flex w-full items-center gap-2.5 min-[440px]:mt-auto">
            <div className="w-1/2">
              <label htmlFor="expiry" className="text-sm">
                Card Expiry Date
              </label>
              <Input
                type="number"
                id="expiry"
                name="expiry"
                placeholder="Enter CVV"
                className="mt-2 h-[54px]"
                value={cardExpiry}
                onChange={(e) => {
                  setCardExpiry(e.target.value);
                }}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="number" className="text-sm">
                CVV
              </label>
              <Input
                type="number"
                id="cvv"
                name="cvv"
                placeholder="Enter CVV"
                className="mt-2 h-[54px]"
                value={cardCVV}
                onChange={(e) => {
                  setCardCVV(e.target.value);
                }}
              />
            </div>
          </div>

          <div className="mt-auto w-full flex items-end justify-end min-[440px]:hidden">
            <Button
              onClick={handleCheckout}
              disabled={loading}
              variant="gradient"
              className="w-full rounded h-[53px] gap-2"
            >
              {loading && <LoadingSpinner />}
              {loading ? "Processing..." : "Checkout"}
            </Button>
          </div>
        </div>

        <div
          className={cn(
            "flex-1 overview h-full flex flex-col",
            mobileView !== "overview" && "max-[440px]:hidden"
          )}
        >
          <div className="min-[440px]:bg-sec-bg p-8 max-[440px]:px-4 flex items-center flex-col pb-20">
            <div className="flex items-center justify-between max-[440px]:justify-center w-full mb-6">
              <p className="text-xl font-bold">Order Summary</p>
              <button
                onClick={() => setPollStep("buy")}
                className="uppercase underline text-tertiary font-bold max-[440px]:hidden"
              >
                Edit
              </button>
            </div>
            {/* <div className="flex-col flex gap-2 w-full">
              {txnOverview.map((item) => (
                <div
                  key={item.label}
                  className="w-full flex items-center justify-between border-b border-dashed pb-[14px]"
                >
                  <p className="text-sm font-bold">{item.label}</p>
                  <p>
                    {item.label === "Amount of Pollcoins"
                      ? item.value
                      : `$${item.value}`}
                  </p>
                </div>
              ))}
            </div> */}
             <div className="flex-col flex gap-2 w-full">
              {txnOverview.map((item) => (
                <div
                  key={item.label}
                  className="w-full flex items-center justify-between border-b border-dashed pb-[14px]"
                >
                  <p className="text-sm font-bold">{item.label}</p>
                  <p>
                    {item.label === "Amount of Pollcoins"
                      ? item.value
                      : `${isNigeria ? "₦" : "$"}${item.value}`}
                  </p>
                </div>
              ))}
            </div>
            {/* <div className="w-full flex items-center justify-between pt-4 mt-6">
              <p className="text-base font-bold">Total</p>
              <p className="text-base font-bold">
                $
                {txnOverview
                  .filter((item) => item.label !== "Amount of Pollcoins")
                  .reduce((acc, item) => acc + Number(item.value), 0)
                  .toFixed(2)}
              </p>
            </div> */}
            <div className="w-full flex items-center justify-between pt-4 mt-6">
              <p className="text-base font-bold">Total</p>
              <p className="text-base font-bold">
                {isNigeria ? "₦" : "$"}
                {txnOverview
                  .filter((item) => item.label !== "Amount of Pollcoins")
                  .reduce((acc, item) => acc + Number(item.value), 0)
                  .toFixed(2)}
              </p>
            </div>
          </div>
          <div className="mt-auto w-full flex items-end justify-end max-[440px]:hidden">
            <Button
              onClick={handleCheckout}
              disabled={loading}
              variant="gradient"
              className="w-full rounded h-[53px] gap-2"
            >
              {loading && <LoadingSpinner />}
              {loading ? "Processing..." : "Checkout"}
            </Button>
          </div>

          <div className="mt-auto w-full flex items-end justify-end min-[440px]:hidden gap-6">
            <Button
              onClick={() => setPollStep("buy")}
              variant="outline"
              size="lg"
              className="w-1/2 text-sec-text"
            >
              Edit
            </Button>
            <Button
              onClick={() => setMobileView("details")}
              variant="gradient"
              size="lg"
              className="w-1/2 rounded"
            >
              Proceed
            </Button>
          </div>
        </div>
      </div>
    </Dialog.Body>
  );
}

// import React, { useState, useEffect } from "react";
// import { useShopStore } from "../../../store/useShopStore";
// import Image from "next/image";
// import { LockIcon, PaystackLogo, StripeLogo, VisaLogo } from "@/assets/images";
// import { cn } from "@/lib/utils";
// import { Input } from "@/components/ui/shadcn-input";
// import { Button } from "@/components/ui/button";
// import { Dialog } from "@/components/ui/new-dialog";
// import { usePollcoinPurchase } from "@/lib/purchase";
// import { toast } from "react-toastify";
// import { usePollcoinOrderSummary } from "@/components/shop/queries/usePollcoinsPurchase";
// import { loadStripe } from "@stripe/stripe-js";

// // Initialize Stripe - use your publishable key here
// const stripePromise = loadStripe(
//   process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
// );

// const PaymentOptionsData = [
//   {
//     label: "Card",
//     src: VisaLogo,
//   },
//   {
//     label: "Stripe",
//     src: StripeLogo,
//   },
//   {
//     label: "Paystack",
//     src: PaystackLogo,
//   },
// ];

// export function CheckoutDialog() {
//   const [selectedOption, setSelectedOption] = useState<string | null>("Card");
//   const [cardHolder, setCardHolder] = useState("");
//   const [cardNumber, setCardNumber] = useState("");
//   const [cardExpiry, setCardExpiry] = useState("");
//   const [cardCVV, setCardCVV] = useState("");
//   const [mobileView, setMobileView] = useState<"details" | "overview">(
//     "overview"
//   );
//   const { mutate: purchasePollcoins } = usePollcoinPurchase();
//   const { mutateAsync: createOrderSummary } = usePollcoinOrderSummary();

//   const {
//     pollAmount,
//     pollcoins,
//     loading,
//     setLoading,
//     setPollStep,
//     setPollcoins,
//   } = useShopStore();

//   const txnOverview = [
//     {
//       label: "Amount of Pollcoins",
//       value: pollcoins,
//     },
//     {
//       label: "Unit Price",
//       value: 0.25,
//     },
//     {
//       label: "VAT",
//       value: 0.05,
//     },
//     {
//       label: "Transaction Fee",
//       value: 0.01,
//     },
//     {
//       label: "Coin Cost",
//       value: pollAmount,
//     },
//   ];

//   const resetLocalState = () => {
//     setCardHolder("");
//     setCardNumber("");
//     setCardExpiry("");
//     setCardCVV("");
//     setSelectedOption("Card");
//   };

//   // Define a specific type for the clientSecret parameter
//   const handleStripePayment = async (clientSecret: string) => {
//     const stripe = await stripePromise;
//     if (!stripe) {
//       toast.error("Stripe failed to load");
//       setLoading(false);
//       return;
//     }

//     // Redirect to Stripe Checkout
//     const { error } = await stripe.redirectToCheckout({
//       sessionId: clientSecret,
//     });

//     if (error) {
//       toast.error(error.message || "Payment failed");
//       setLoading(false);
//       localStorage.removeItem("purchasedPollcoins");
//     }
//   };
//   const handleCheckout = async () => {
//     setLoading(true);

//     const amount = parseFloat(pollAmount);
//     const pollcoinsInt = Number(pollcoins);

//     if (isNaN(amount) || amount <= 0) {
//       toast.error("Invalid amount");
//       setLoading(false);
//       return;
//     }

//     try {
//       const summary = await createOrderSummary({
//         currency: "NGN",
//         amount,
//         pollcoins: pollcoinsInt,
//       });

//       if (!summary?.success || !summary.data?.orderSummary) {
//         throw new Error("Invalid order summary response");
//       }

//       const orderSummary = summary.data.orderSummary;

//       // 1. Update local state with the purchase amount
//       useShopStore.getState().setPollcoins(pollcoinsInt.toString());

//       // 2. Store in localStorage for retrieval after payment
//       localStorage.setItem("purchasedPollcoins", pollcoinsInt.toString());

//       // 3. Determine payment gateway
//       const isStripe = selectedOption?.toLowerCase() === "stripe";
//       const paymentGateway = isStripe ? "stripe" : "paystack";
//       const redirectUrl = `${window.location.origin}/shop?success=true`;

//       purchasePollcoins(
//         {
//           paymentGateway,
//           currency: "NGN",
//           amount: orderSummary.totalAmount,
//           pollcoins: pollcoinsInt,
//           orderReferenceId: orderSummary.referenceId,
//           redirect_url: redirectUrl,
//         },
//         {
//           onSuccess: (res) => {
//             if (!res.success) {
//               localStorage.removeItem("purchasedPollcoins");
//               toast.error(res.message || "Payment initialization failed");
//               setLoading(false);
//               return;
//             }

//             // Handle payment based on gateway
//             if (isStripe && res.data?.payment?.client_secret) {
//               // For Stripe, use the client secret
//               handleStripePayment(res.data.payment.client_secret);
//             } else if (res.data?.payment?.authorization_url) {
//               // For Paystack, redirect to authorization URL
//               window.location.href = res.data.payment.authorization_url;
//             } else {
//               // Unknown payment flow
//               localStorage.removeItem("purchasedPollcoins");
//               toast.error("Invalid payment response");
//               setLoading(false);
//             }
//           },
//           onError: (err) => {
//             localStorage.removeItem("purchasedPollcoins");
//             const errorMessage = err.message || "Payment failed";
//             toast.error(errorMessage);
//             setLoading(false);
//           },
//         }
//       );
//     } catch (err: any) {
//       localStorage.removeItem("purchasedPollcoins");
//       const errorMessage =
//         err.response?.data?.message || err.message || "Order summary failed";
//       toast.error(errorMessage);
//       setLoading(false);
//     }
//   };

//   // The rest of your component remains the same
//   return (
//     <Dialog.Body className="h-full mt-2.5">
//       {/* Component JSX remains the same as original */}
//       <div className="flex gap-14 h-full max-[440px]:flex-row-reverse">
//         <div
//           className={cn(
//             "w-[55%] flex flex-col gap-4 details h-full max-[440px]:w-full",
//             mobileView !== "details" && "max-[440px]:hidden"
//           )}
//         >
//           <h3 className="text-2xl font-bold text-tertiary">Checkout</h3>
//           <div className="flex items-center bg-sec-bg p-4">
//             <p>
//               Payments are SSL encrypted so that your credit card and payment
//               details stay safe.
//             </p>
//             <Image src={LockIcon} alt="lock icon" />
//           </div>
//           <div className="flex items-center justify-between gap-2 border-b pb-4">
//             {PaymentOptionsData.map((option) => (
//               <PaymentOptions
//                 {...option}
//                 key={option.label}
//                 isActive={selectedOption === option.label}
//                 onClick={() => setSelectedOption(option.label)}
//               />
//             ))}
//           </div>
//           <div>
//             <label htmlFor="name" className="text-sm">
//               Card Holder Name
//             </label>
//             <Input
//               type="text"
//               id="name"
//               name="name"
//               placeholder="Enter card holder name"
//               className="mt-2 h-[54px]"
//               value={cardHolder}
//               onChange={(e) => {
//                 setCardHolder(e.target.value);
//               }}
//             />
//           </div>
//           <div>
//             <label htmlFor="number" className="text-sm">
//               Card Number
//             </label>
//             <Input
//               type="number"
//               id="number"
//               name="number"
//               placeholder="Enter card number"
//               className="mt-2 h-[54px]"
//               value={cardNumber}
//               onChange={(e) => {
//                 setCardNumber(e.target.value);
//               }}
//             />
//           </div>
//           <div className="flex w-full items-center gap-2.5 min-[440px]:mt-auto">
//             <div className="w-1/2">
//               <label htmlFor="expiry" className="text-sm">
//                 Card Expiry Date
//               </label>
//               <Input
//                 type="number"
//                 id="expiry"
//                 name="expiry"
//                 placeholder="Enter CVV"
//                 className="mt-2 h-[54px]"
//                 value={cardExpiry}
//                 onChange={(e) => {
//                   setCardExpiry(e.target.value);
//                 }}
//               />
//             </div>
//             <div className="flex-1">
//               <label htmlFor="number" className="text-sm">
//                 CVV
//               </label>
//               <Input
//                 type="number"
//                 id="cvv"
//                 name="cvv"
//                 placeholder="Enter CVV"
//                 className="mt-2 h-[54px]"
//                 value={cardCVV}
//                 onChange={(e) => {
//                   setCardCVV(e.target.value);
//                 }}
//               />
//             </div>
//           </div>

//           <div className="mt-auto w-full flex items-end justify-end min-[440px]:hidden">
//             <Button
//               onClick={handleCheckout}
//               disabled={loading}
//               variant="gradient"
//               className="w-full rounded h-[53px] gap-2"
//             >
//               {loading && <LoadingSpinner />}
//               {loading ? "Processing..." : "Checkout"}
//             </Button>
//           </div>
//         </div>

//         <div
//           className={cn(
//             "flex-1 overview h-full flex flex-col",
//             mobileView !== "overview" && "max-[440px]:hidden"
//           )}
//         >
//           <div className="min-[440px]:bg-sec-bg p-8 max-[440px]:px-4 flex items-center flex-col pb-20">
//             <div className="flex items-center justify-between max-[440px]:justify-center w-full mb-6">
//               <p className="text-xl font-bold">Order Summary</p>
//               <button
//                 onClick={() => setPollStep("buy")}
//                 className="uppercase underline text-tertiary font-bold max-[440px]:hidden"
//               >
//                 Edit
//               </button>
//             </div>
//             <div className="flex-col flex gap-2 w-full">
//               {txnOverview.map((item) => (
//                 <div
//                   key={item.label}
//                   className="w-full flex items-center justify-between border-b border-dashed pb-[14px]"
//                 >
//                   <p className="text-sm font-bold">{item.label}</p>
//                   <p>
//                     {item.label === "Amount of Pollcoins"
//                       ? item.value
//                       : `$${item.value}`}
//                   </p>
//                 </div>
//               ))}
//             </div>
//             <div className="w-full flex items-center justify-between pt-4 mt-6">
//               <p className="text-base font-bold">Total</p>
//               <p className="text-base font-bold">
//                 $
//                 {txnOverview
//                   .filter((item) => item.label !== "Amount of Pollcoins")
//                   .reduce((acc, item) => acc + Number(item.value), 0)
//                   .toFixed(2)}
//               </p>
//             </div>
//           </div>
//           <div className="mt-auto w-full flex items-end justify-end max-[440px]:hidden">
//             <Button
//               onClick={handleCheckout}
//               disabled={loading}
//               variant="gradient"
//               className="w-full rounded h-[53px] gap-2"
//             >
//               {loading && <LoadingSpinner />}
//               {loading ? "Processing..." : "Checkout"}
//             </Button>
//           </div>

//           <div className="mt-auto w-full flex items-end justify-end min-[440px]:hidden gap-6">
//             <Button
//               onClick={() => setPollStep("buy")}
//               variant="outline"
//               size="lg"
//               className="w-1/2 text-sec-text"
//             >
//               Edit
//             </Button>
//             <Button
//               onClick={() => setMobileView("details")}
//               variant="gradient"
//               size="lg"
//               className="w-1/2 rounded"
//             >
//               Proceed
//             </Button>
//           </div>
//         </div>
//       </div>
//     </Dialog.Body>
//   );
// }


type PaymentOptionsProps = {
  label: string;
  src: string;
  isActive: boolean;
  onClick: () => void;
};

const PaymentOptions = ({
  label,
  src,
  isActive,
  onClick,
}: PaymentOptionsProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "border flex-1 py-6 rounded-[5px] transition-all duration-300 ease-in-out",
        {
          "border-[#D195FCCC]": isActive,
          "hover:border-[#D195FCCC]": !isActive,
        }
      )}
    >
      <div className="flex items-center flex-col">
        <p>{label}</p>
        <Image src={src} alt={label} />
      </div>
    </button>
  );
};

const LoadingSpinner = () => {
  return (
    <svg
      className="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
};
