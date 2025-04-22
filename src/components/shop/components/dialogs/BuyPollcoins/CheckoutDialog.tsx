// import React, { useEffect, useState } from "react";
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
// import { useGeoLocation } from "@/subpages/settings/subscription/PricingCards";

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
//   const [expiryError, setExpiryError] = useState<string | null>(null);

//   const { mutate: purchasePollcoins } = usePollcoinPurchase();

//   const { data: locationData } = useGeoLocation();
//   const isNigeria = locationData?.isNigeria;

//   const paymentOptions = isNigeria
//     ? PaymentOptionsData.filter((opt) => opt.label !== "Stripe")
//     : PaymentOptionsData;

//   useEffect(() => {
//     if (isNigeria && selectedOption === "Stripe") {
//       setSelectedOption("Card");
//     }
//   }, [isNigeria, selectedOption]);

//   const {
//     pollAmount,
//     pollcoins,
//     loading,
//     setLoading,
//     setPollStep,
//     orderSummary,
//     setPollcoins
//   } = useShopStore();

//   const txnOverview = [
//     {
//       label: "Amount of Pollcoins",
//       value: pollcoins,
//     },
//     {
//       label: "Unit Price",
//       value: orderSummary?.unitPrice,
//     },
//     {
//       label: "VAT",
//       value: orderSummary?.vat,
//     },
//     {
//       label: "Transaction Fee",
//       value: orderSummary?.transactionFee,
//     },
//     {
//       label: "Coin Cost",
//       value: orderSummary?.baseAmount,
//     },
//   ];

//   const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value.replace(/\D/g, "").slice(0, 16);
//     const formatted = value.replace(/(\d{4})(?=\d)/g, "$1 ");
//     setCardNumber(formatted);
//   };

//   const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value.replace(/\D/g, "").slice(0, 4);
//     const formatted =
//       value.length > 2 ? `${value.slice(0, 2)}/${value.slice(2)}` : value;
//     setCardExpiry(formatted);

//     if (formatted.length === 5) {
//       const [month, year] = formatted.split("/");
//       const currentDate = new Date();
//       const currentYear = currentDate.getFullYear();
//       const currentMonth = currentDate.getMonth() + 1;
//       const expiryYear = parseInt(year, 10) + 2000;
//       const expiryMonth = parseInt(month, 10);

//       if (
//         expiryYear < currentYear ||
//         (expiryYear === currentYear && expiryMonth < currentMonth)
//       ) {
//         setExpiryError("Card has expired. Please use a valid card.");
//       } else {
//         setExpiryError(null);
//       }
//     }
//   };

//   // Handle CVV formatting
//   const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value.replace(/\D/g, "").slice(0, 4);
//     setCardCVV(value);
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

//     if (expiryError) {
//       toast.error(expiryError);
//       setLoading(false);
//       return;
//     }

//     try {
//       if (!orderSummary) {
//         throw new Error("Order summary not found");
//       }

//       setPollcoins(pollcoinsInt.toString());

//       localStorage.setItem("purchasedPollcoins", pollcoinsInt.toString());

//       const paymentGateway =
//         selectedOption?.toLowerCase() === "stripe" ? "stripe" : "paystack";
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
//             if (res.success && res.data?.payment?.authorization_url) {
//               window.location.href = res.data.payment.authorization_url;
//             } else {
//               localStorage.removeItem("purchasedPollcoins");
//               toast.error(res.message || "Payment initialization failed");
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
//       const errorMessage = err.message || "Order summary failed";
//       toast.error(errorMessage);
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog.Body className="h-full mt-2.5">
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
//             {paymentOptions.map((option) => (
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
//               type="text"
//               id="number"
//               name="number"
//               placeholder="XXXX XXXX XXXX XXXX"
//               className="mt-2 h-[54px]"
//               value={cardNumber}
//               onChange={handleCardNumberChange}
//               inputMode="numeric"
//               maxLength={19} // 16 digits + 3 spaces
//             />
//           </div>
//           <div className="flex w-full items-center gap-2.5 min-[440px]:mt-auto">
//             <div className="w-1/2">
//               <label htmlFor="expiry" className="text-sm">
//                 Card Expiry Date
//               </label>
//               <Input
//                 type="text"
//                 id="expiry"
//                 name="expiry"
//                 placeholder="MM/YY"
//                 className="mt-2 h-[54px]"
//                 value={cardExpiry}
//                 onChange={handleExpiryChange}
//                 inputMode="numeric"
//                 maxLength={5}
//               />
//             </div>
//             <div className="flex-1">
//               <label htmlFor="cvv" className="text-sm">
//                 CVV
//               </label>
//               <Input
//                 type="text"
//                 id="cvv"
//                 name="cvv"
//                 placeholder="XXX"
//                 className="mt-2 h-[54px]"
//                 value={cardCVV}
//                 onChange={handleCVVChange}
//                 inputMode="numeric"
//                 maxLength={4}
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
//                       : `${isNigeria ? "₦" : "$"}${Number(item.value).toFixed(2)}`}
//                   </p>
//                 </div>
//               ))}
//             </div>
//             <div className="w-full flex items-center justify-between pt-4 mt-6">
//               <p className="text-base font-bold">Total</p>
//               <p className="text-base font-bold">
//                 {isNigeria ? "₦" : "$"}
//                 {orderSummary?.totalAmount}
//               </p>
//             </div>
//           </div>
//           <div className="mt-auto w-full flex items-end justify-end max-[440px]:hidden">
//             <Button
//               onClick={handleCheckout}
//               disabled={
//                 loading || !cardNumber || !cardHolder || !cardExpiry || !cardCVV
//               }
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
// import React, { useEffect, useState } from "react";
// import { useShopStore } from "../../../store/useShopStore";
// import Image from "next/image";
// import { LockIcon, PaystackLogo, StripeLogo, VisaLogo } from "@/assets/images";
// import { cn } from "@/lib/utils";
// import { Input } from "@/components/ui/shadcn-input";
// import { Button } from "@/components/ui/button";
// import { Dialog } from "@/components/ui/new-dialog";
// import { PurchasePayload, usePollcoinPurchase } from "@/lib/purchase";
// import { toast } from "react-toastify";
// import { usePollcoinOrderSummary } from "@/components/shop/queries/usePollcoinsPurchase";
// import { useGeoLocation } from "@/subpages/settings/subscription/PricingCards";
// import { loadStripe } from "@stripe/stripe-js";
// import {
//   CardElement,
//   Elements,
//   useStripe,
//   useElements,
// } from "@stripe/react-stripe-js";

// // Initialize Stripe (you'll need to replace with your publishable key)
// const stripePromise = loadStripe(
//   process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
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

// // Stripe Card Form component
// const StripeCardForm = ({
//   onCardChange,
// }: {
//   onCardChange: (complete: boolean) => void;
// }) => {
//   const handleChange = (event: any) => {
//     onCardChange(event.complete);
//   };

//   return (
//     <div className="mt-4">
//       <label className="text-sm mb-2 block">Card Details</label>
//       <div className="p-3 border rounded-md bg-white">
//         <CardElement
//           options={{
//             style: {
//               base: {
//                 fontSize: "16px",
//                 color: "#424770",
//                 "::placeholder": {
//                   color: "#aab7c4",
//                 },
//               },
//               invalid: {
//                 color: "#9e2146",
//               },
//             },
//           }}
//           onChange={handleChange}
//         />
//       </div>
//     </div>
//   );
// };

// // Wrapper for CheckoutDialog to provide Stripe context
// export function CheckoutDialogWrapper() {
//   return (
//     <Elements stripe={stripePromise}>
//       <CheckoutDialog />
//     </Elements>
//   );
// }

// function CheckoutDialog() {
//   const [selectedOption, setSelectedOption] = useState<string | null>("Card");
//   const [cardHolder, setCardHolder] = useState("");
//   const [cardNumber, setCardNumber] = useState("");
//   const [cardExpiry, setCardExpiry] = useState("");
//   const [cardCVV, setCardCVV] = useState("");
//   const [mobileView, setMobileView] = useState<"details" | "overview">(
//     "overview"
//   );
//   const [expiryError, setExpiryError] = useState<string | null>(null);
//   const [isProcessingStripe, setIsProcessingStripe] = useState(false);
//   const [isStripeCardComplete, setIsStripeCardComplete] = useState(false);

//   // Stripe hooks
//   const stripe = useStripe();
//   const elements = useElements();

//   const { mutate: purchasePollcoins } = usePollcoinPurchase();

//   const { data: locationData } = useGeoLocation();
//   const isNigeria = locationData?.isNigeria;

//   const paymentOptions = isNigeria
//     ? PaymentOptionsData.filter((opt) => opt.label !== "Stripe")
//     : PaymentOptionsData;

//   // useEffect(() => {
//   //   if (isNigeria && selectedOption === "Stripe") {
//   //     setSelectedOption("Card");
//   //   }
//   // }, [isNigeria, selectedOption]);

//   const {
//     pollAmount,
//     pollcoins,
//     loading,
//     setLoading,
//     setPollStep,
//     orderSummary,
//   } = useShopStore();

//   const txnOverview = [
//     {
//       label: "Amount of Pollcoins",
//       value: pollcoins,
//     },
//     {
//       label: "Unit Price",
//       value: orderSummary?.unitPrice,
//     },
//     {
//       label: "VAT",
//       value: orderSummary?.vat,
//     },
//     {
//       label: "Transaction Fee",
//       value: orderSummary?.transactionFee,
//     },
//     {
//       label: "Coin Cost",
//       value: orderSummary?.baseAmount,
//     },
//   ];

//   const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value.replace(/\D/g, "").slice(0, 16);
//     const formatted = value.replace(/(\d{4})(?=\d)/g, "$1 ");
//     setCardNumber(formatted);
//   };

//   const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value.replace(/\D/g, "").slice(0, 4);
//     const formatted =
//       value.length > 2 ? `${value.slice(0, 2)}/${value.slice(2)}` : value;
//     setCardExpiry(formatted);

//     if (formatted.length === 5) {
//       const [month, year] = formatted.split("/");
//       const currentDate = new Date();
//       const currentYear = currentDate.getFullYear();
//       const currentMonth = currentDate.getMonth() + 1;
//       const expiryYear = parseInt(year, 10) + 2000;
//       const expiryMonth = parseInt(month, 10);

//       if (
//         expiryYear < currentYear ||
//         (expiryYear === currentYear && expiryMonth < currentMonth)
//       ) {
//         setExpiryError("Card has expired. Please use a valid card.");
//       } else {
//         setExpiryError(null);
//       }
//     }
//   };

//   // Handle CVV formatting
//   const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value.replace(/\D/g, "").slice(0, 4);
//     setCardCVV(value);
//   };

//   // Handle Stripe payment confirmation
//   const handleStripePaymentConfirm = async (clientSecret: string) => {
//     if (!stripe || !elements) {
//       toast.error("Stripe has not been initialized");
//       setLoading(false);
//       return;
//     }
//     const pollcoinsInt = Number(pollcoins);
//     setIsProcessingStripe(true);
//     try {
//       const cardElement = elements.getElement(CardElement);

//       if (!cardElement) {
//         throw new Error("Card element not found");
//       }

//       // Use the card Element to confirm payment
//       const { error, paymentIntent } = await stripe.confirmCardPayment(
//         clientSecret,
//         {
//           payment_method: {
//             card: cardElement,
//             billing_details: {
//               name: cardHolder,
//             },
//           },
//         }
//       );

//       if (error) {
//         throw new Error(error.message || "Payment failed");
//       } else if (paymentIntent.status === "succeeded") {
//         // Payment successful
//         toast.success("Payment successful!");
//         localStorage.setItem("purchasedPollcoins", pollcoinsInt.toString());
//         window.location.href = `${window.location.origin}/shop?success=true`;
//       } else {
//         // Payment requires additional steps (like 3D Secure authentication)
//         toast.info(
//           "Additional authentication required. Please follow the instructions."
//         );
//       }
//     } catch (error: any) {
//       toast.error(error.message || "Payment failed");
//       localStorage.removeItem("purchasedPollcoins");
//     } finally {
//       setIsProcessingStripe(false);
//       setLoading(false);
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

//     if (expiryError) {
//       toast.error(expiryError);
//       setLoading(false);
//       return;
//     }

//     // For Stripe payment, check if card details are complete
//     if (selectedOption === "Stripe" && !isStripeCardComplete) {
//       toast.error("Please complete your card details");
//       setLoading(false);
//       return;
//     }

//     // For manual card entry, check all fields
//     if (
//       selectedOption === "Card" &&
//       (!cardNumber || !cardHolder || !cardExpiry || !cardCVV)
//     ) {
//       toast.error("Please fill in all card details");
//       setLoading(false);
//       return;
//     }

//     try {
//       if (!orderSummary) {
//         throw new Error("Order summary not found");
//       }

//       useShopStore.getState().setPollcoins(pollcoinsInt.toString());
//       localStorage.setItem("purchasedPollcoins", pollcoinsInt.toString());

//       // Ensure paymentGateway is properly typed
//       const paymentGateway =
//         selectedOption?.toLowerCase() === "stripe"
//           ? ("stripe" as const)
//           : ("paystack" as const);

//       const redirectUrl = `${window.location.origin}/shop?success=true`;

//       // Create payload based on payment gateway type
//       let paymentPayload: PurchasePayload;

//       if (paymentGateway === "stripe") {
//         paymentPayload = {
//           paymentGateway,
//           currency: "NGN",
//           orderReferenceId: orderSummary.referenceId,
//           redirect_url: redirectUrl,
//           // orderSummaryId: orderSummary._id // Assuming orderSummary has an ID field
//         };
//       } else {
//         paymentPayload = {
//           paymentGateway,
//           currency: "NGN",
//           orderReferenceId: orderSummary.referenceId,
//           redirect_url: redirectUrl,
//           amount: orderSummary.totalAmount,
//           pollcoins: pollcoinsInt,
//         };
//       }

//       purchasePollcoins(paymentPayload, {
//         onSuccess: (res) => {
//           if (res.success) {
//             if (
//               paymentGateway === "stripe" &&
//               res.data?.payment?.client_secret
//             ) {
//               // Handle Stripe payment confirmation
//               localStorage.setItem(
//                 "purchasedPollcoins",
//                 pollcoinsInt.toString()
//               );
//               handleStripePaymentConfirm(res.data.payment.client_secret);
//             } 
            
//             else if (res.data?.payment?.authorization_url) {
//               // Handle Paystack redirect
//               window.location.href = res.data.payment.authorization_url;
//             } else {
//               localStorage.removeItem("purchasedPollcoins");
//               toast.error("Payment initialization failed");
//               setLoading(false);
//             }
//           } else {
//             localStorage.removeItem("purchasedPollcoins");
//             toast.error(res.message || "Payment initialization failed");
//             setLoading(false);
//           }
//         },
//         onError: (err) => {
//           localStorage.removeItem("purchasedPollcoins");
//           const errorMessage = err.message || "Payment failed";
//           toast.error(errorMessage);
//           setLoading(false);
//         },
//       });
//     } catch (err: any) {
//       localStorage.removeItem("purchasedPollcoins");
//       const errorMessage = err.message || "Order summary failed";
//       toast.error(errorMessage);
//       setLoading(false);
//     }
//   };
//   return (
//     <Dialog.Body className="h-full mt-2.5">
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

//           {selectedOption === "Stripe" ? (
//             <>
//               <div>
//                 <label htmlFor="name" className="text-sm">
//                   Card Holder Name
//                 </label>
//                 <Input
//                   type="text"
//                   id="name"
//                   name="name"
//                   placeholder="Enter card holder name"
//                   className="mt-2 h-[54px]"
//                   value={cardHolder}
//                   onChange={(e) => {
//                     setCardHolder(e.target.value);
//                   }}
//                 />
//               </div>
//               <StripeCardForm
//                 onCardChange={(complete) => setIsStripeCardComplete(complete)}
//               />
//             </>
//           ) : (
//             <>
//               <div>
//                 <label htmlFor="name" className="text-sm">
//                   Card Holder Name
//                 </label>
//                 <Input
//                   type="text"
//                   id="name"
//                   name="name"
//                   placeholder="Enter card holder name"
//                   className="mt-2 h-[54px]"
//                   value={cardHolder}
//                   onChange={(e) => {
//                     setCardHolder(e.target.value);
//                   }}
//                 />
//               </div>
//               <div>
//                 <label htmlFor="number" className="text-sm">
//                   Card Number
//                 </label>
//                 <Input
//                   type="text"
//                   id="number"
//                   name="number"
//                   placeholder="XXXX XXXX XXXX XXXX"
//                   className="mt-2 h-[54px]"
//                   value={cardNumber}
//                   onChange={handleCardNumberChange}
//                   inputMode="numeric"
//                   maxLength={19} // 16 digits + 3 spaces
//                 />
//               </div>
//               <div className="flex w-full items-center gap-2.5">
//                 <div className="w-1/2">
//                   <label htmlFor="expiry" className="text-sm">
//                     Card Expiry Date
//                   </label>
//                   <Input
//                     type="text"
//                     id="expiry"
//                     name="expiry"
//                     placeholder="MM/YY"
//                     className="mt-2 h-[54px]"
//                     value={cardExpiry}
//                     onChange={handleExpiryChange}
//                     inputMode="numeric"
//                     maxLength={5}
//                   />
//                 </div>
//                 <div className="flex-1">
//                   <label htmlFor="cvv" className="text-sm">
//                     CVV
//                   </label>
//                   <Input
//                     type="text"
//                     id="cvv"
//                     name="cvv"
//                     placeholder="XXX"
//                     className="mt-2 h-[54px]"
//                     value={cardCVV}
//                     onChange={handleCVVChange}
//                     inputMode="numeric"
//                     maxLength={4}
//                   />
//                 </div>
//               </div>
//             </>
//           )}

//           <div className="mt-auto w-full flex items-end justify-end min-[440px]:hidden">
//             <Button
//               onClick={handleCheckout}
//               disabled={loading || isProcessingStripe}
//               variant="gradient"
//               className="w-full rounded h-[53px] gap-2"
//             >
//               {(loading || isProcessingStripe) && <LoadingSpinner />}
//               {loading || isProcessingStripe ? "Processing..." : "Checkout"}
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
//                       : `${isNigeria ? "₦" : "$"}${Number(item.value).toFixed(
//                           2
//                         )}`}
//                   </p>
//                 </div>
//               ))}
//             </div>
//             <div className="w-full flex items-center justify-between pt-4 mt-6">
//               <p className="text-base font-bold">Total</p>
//               <p className="text-base font-bold">
//                 {isNigeria ? "₦" : "$"}
//                 {orderSummary?.totalAmount}
//               </p>
//             </div>
//           </div>
//           <div className="mt-auto w-full flex items-end justify-end max-[440px]:hidden">
//             <Button
//               onClick={handleCheckout}
//               disabled={
//                 loading ||
//                 isProcessingStripe ||
//                 (selectedOption === "Card" &&
//                   (!cardNumber || !cardHolder || !cardExpiry || !cardCVV)) ||
//                 (selectedOption === "Stripe" &&
//                   (!cardHolder || !isStripeCardComplete))
//               }
//               variant="gradient"
//               className="w-full rounded h-[53px] gap-2"
//             >
//               {(loading || isProcessingStripe) && <LoadingSpinner />}
//               {loading || isProcessingStripe ? "Processing..." : "Checkout"}
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

// // Export the wrapped component instead of the raw component
// export { CheckoutDialogWrapper as CheckoutDialog };

import React, { useEffect, useState } from "react";
import { useShopStore } from "../../../store/useShopStore";
import Image from "next/image";
import { LockIcon, PaystackLogo, StripeLogo, VisaLogo } from "@/assets/images";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/shadcn-input";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/new-dialog";
import { PurchasePayload, usePollcoinPurchase } from "@/lib/purchase";
import { toast } from "react-toastify";
import { usePollcoinOrderSummary } from "@/components/shop/queries/usePollcoinsPurchase";
import { useGeoLocation } from "@/subpages/settings/subscription/PricingCards";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Initialize Stripe (you'll need to replace with your publishable key)
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

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

// Stripe Card Form component
const StripeCardForm = ({
  onCardChange,
}: {
  onCardChange: (complete: boolean) => void;
}) => {
  const handleChange = (event: any) => {
    onCardChange(event.complete);
  };

  return (
    <div className="mt-4">
      <label className="text-sm mb-2 block">Card Details</label>
      <div className="p-3 border rounded-md bg-white">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

// Wrapper for CheckoutDialog to provide Stripe context
export function CheckoutDialogWrapper() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutDialog />
    </Elements>
  );
}

function CheckoutDialog() {
  const [selectedOption, setSelectedOption] = useState<string | null>("Card");
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [mobileView, setMobileView] = useState<"details" | "overview">(
    "overview"
  );
  const [expiryError, setExpiryError] = useState<string | null>(null);
  const [isProcessingStripe, setIsProcessingStripe] = useState(false);
  const [isStripeCardComplete, setIsStripeCardComplete] = useState(false);

  // Stripe hooks
  const stripe = useStripe();
  const elements = useElements();

  const { mutate: purchasePollcoins } = usePollcoinPurchase();

  const { data: locationData } = useGeoLocation();
  const isNigeria = locationData?.isNigeria;

  const paymentOptions = isNigeria
    ? PaymentOptionsData.filter((opt) => opt.label !== "Stripe")
    : PaymentOptionsData;

  useEffect(() => {
    if (isNigeria && selectedOption === "Stripe") {
      setSelectedOption("Card");
    }
  }, [isNigeria, selectedOption]);

  const {
    pollAmount,
    pollcoins,
    loading,
    setLoading,
    setPollStep,
    orderSummary,
  } = useShopStore();

  const txnOverview = [
    {
      label: "Amount of Pollcoins",
      value: pollcoins,
    },
    {
      label: "Unit Price",
      value: orderSummary?.unitPrice,
    },
    {
      label: "VAT",
      value: orderSummary?.vat,
    },
    {
      label: "Transaction Fee",
      value: orderSummary?.transactionFee,
    },
    {
      label: "Coin Cost",
      value: orderSummary?.baseAmount,
    },
  ];

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    const formatted =
      value.length > 2 ? `${value.slice(0, 2)}/${value.slice(2)}` : value;
    setCardExpiry(formatted);

    if (formatted.length === 5) {
      const [month, year] = formatted.split("/");
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      const expiryYear = parseInt(year, 10) + 2000;
      const expiryMonth = parseInt(month, 10);

      if (
        expiryYear < currentYear ||
        (expiryYear === currentYear && expiryMonth < currentMonth)
      ) {
        setExpiryError("Card has expired. Please use a valid card.");
      } else {
        setExpiryError(null);
      }
    }
  };

  // Handle CVV formatting
  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCardCVV(value);
  };

  // Handle Stripe payment confirmation
  const handleStripePaymentConfirm = async (clientSecret: string) => {
    if (!stripe || !elements) {
      toast.error("Stripe has not been initialized");
      setLoading(false);
      return;
    }
    
    const pollcoinsInt = Number(pollcoins);
    setIsProcessingStripe(true);
    
    try {
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        throw new Error("Card element not found");
      }

      // Use createPaymentMethod first to get a payment method ID
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: cardHolder,
        },
      });

      if (paymentMethodError) {
        throw new Error(paymentMethodError.message || "Failed to create payment method");
      }

      // Now use confirmCardPayment with the payment method ID
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
        setup_future_usage: 'off_session',
      });

      if (error) {
        throw new Error(error.message || "Payment failed");
      } else if (paymentIntent?.status === "succeeded") {
        // Payment successful
        toast.success("Payment successful!");
        localStorage.setItem("purchasedPollcoins", pollcoinsInt.toString());
        window.location.href = `${window.location.origin}/shop?success=true`;
      } else if (paymentIntent?.status === "processing") {
        toast.info("Payment processing. We'll update you when payment is received.");
        localStorage.setItem("purchasedPollcoins", pollcoinsInt.toString());
      } else if (paymentIntent?.status === "requires_action") {
        // Handle 3D Secure or other authentication
        const { error: actionError } = await stripe.handleCardAction(clientSecret);
        if (actionError) {
          throw new Error(actionError.message || "Authentication failed");
        } else {
          // After successful authentication, confirm again to complete payment
          const { error: finalError } = await stripe.confirmCardPayment(clientSecret);
          if (finalError) {
            throw new Error(finalError.message || "Final confirmation failed");
          } else {
            toast.success("Payment successful!");
            localStorage.setItem("purchasedPollcoins", pollcoinsInt.toString());
            window.location.href = `${window.location.origin}/shop?success=true`;
          }
        }
      } else {
        // Other payment status
        toast.info("Payment status: " + paymentIntent?.status);
      }
    } catch (error: any) {
      toast.error(error.message || "Payment failed");
      localStorage.removeItem("purchasedPollcoins");
    } finally {
      setIsProcessingStripe(false);
      setLoading(false);
    }
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

    if (expiryError) {
      toast.error(expiryError);
      setLoading(false);
      return;
    }

    // For Stripe payment, check if card details are complete
    if (selectedOption === "Stripe" && !isStripeCardComplete) {
      toast.error("Please complete your card details");
      setLoading(false);
      return;
    }

    // For manual card entry, check all fields
    if (
      selectedOption === "Card" &&
      (!cardNumber || !cardHolder || !cardExpiry || !cardCVV)
    ) {
      toast.error("Please fill in all card details");
      setLoading(false);
      return;
    }

    try {
      if (!orderSummary) {
        throw new Error("Order summary not found");
      }

      useShopStore.getState().setPollcoins(pollcoinsInt.toString());
      localStorage.setItem("purchasedPollcoins", pollcoinsInt.toString());

      // Ensure paymentGateway is properly typed
      const paymentGateway =
        selectedOption?.toLowerCase() === "stripe"
          ? ("stripe" as const)
          : ("paystack" as const);

      const redirectUrl = `${window.location.origin}/shop?success=true`;

      // Create payload based on payment gateway type
      let paymentPayload: PurchasePayload;

      if (paymentGateway === "stripe") {
        paymentPayload = {
          paymentGateway,
          currency: "NGN",
          orderReferenceId: orderSummary.referenceId,
          redirect_url: redirectUrl,
          // orderSummaryId: orderSummary._id // Assuming orderSummary has an ID field
        };
      } else {
        paymentPayload = {
          paymentGateway,
          currency: "NGN",
          orderReferenceId: orderSummary.referenceId,
          redirect_url: redirectUrl,
          amount: orderSummary.totalAmount,
          pollcoins: pollcoinsInt,
        };
      }

      purchasePollcoins(paymentPayload, {
        onSuccess: (res) => {
          if (res.success) {
            if (
              paymentGateway === "stripe" &&
              res.data?.payment?.client_secret
            ) {
              // Handle Stripe payment confirmation
              localStorage.setItem(
                "purchasedPollcoins",
                pollcoinsInt.toString()
              );
              handleStripePaymentConfirm('res.data.payment.client_secret');
            } 
            
            else if (res.data?.payment?.authorization_url) {
              // Handle Paystack redirect
              window.location.href = res.data.payment.authorization_url;
            } else {
              localStorage.removeItem("purchasedPollcoins");
              toast.error("Payment initialization failed");
              setLoading(false);
            }
          } else {
            localStorage.removeItem("purchasedPollcoins");
            toast.error(res.message || "Payment initialization failed");
            setLoading(false);
          }
        },
        onError: (err) => {
          localStorage.removeItem("purchasedPollcoins");
          const errorMessage = err.message || "Payment failed";
          toast.error(errorMessage);
          setLoading(false);
        },
      });
    } catch (err: any) {
      localStorage.removeItem("purchasedPollcoins");
      const errorMessage = err.message || "Order summary failed";
      toast.error(errorMessage);
      setLoading(false);
    }
  };
  return (
    <Dialog.Body className="h-full mt-2.5">
      <div className="flex gap-14 h-full max-md:flex-row-reverse text-black">
        <div
          className={cn(
            "w-[55%] flex flex-col gap-4 details h-full max-md:w-full",
            mobileView !== "details" && "max-md:hidden"
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
            {paymentOptions.map((option) => (
              <PaymentOptions
                {...option}
                key={option.label}
                isActive={selectedOption === option.label}
                onClick={() => setSelectedOption(option.label)}
              />
            ))}
          </div>

          {selectedOption === "Stripe" ? (
            <>
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
              <StripeCardForm
                onCardChange={(complete) => setIsStripeCardComplete(complete)}
              />
            </>
          ) : (
            <>
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
                  type="text"
                  id="number"
                  name="number"
                  placeholder="XXXX XXXX XXXX XXXX"
                  className="mt-2 h-[54px]"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  inputMode="numeric"
                  maxLength={19} // 16 digits + 3 spaces
                />
              </div>
              <div className="flex w-full items-center gap-2.5">
                <div className="w-1/2">
                  <label htmlFor="expiry" className="text-sm">
                    Card Expiry Date
                  </label>
                  <Input
                    type="text"
                    id="expiry"
                    name="expiry"
                    placeholder="MM/YY"
                    className="mt-2 h-[54px]"
                    value={cardExpiry}
                    onChange={handleExpiryChange}
                    inputMode="numeric"
                    maxLength={5}
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="cvv" className="text-sm">
                    CVV
                  </label>
                  <Input
                    type="text"
                    id="cvv"
                    name="cvv"
                    placeholder="XXX"
                    className="mt-2 h-[54px]"
                    value={cardCVV}
                    onChange={handleCVVChange}
                    inputMode="numeric"
                    maxLength={4}
                  />
                </div>
              </div>
            </>
          )}

          <div className="mt-auto w-full flex items-end justify-end md:hidden">
            <Button
              onClick={handleCheckout}
              disabled={loading || isProcessingStripe}
              variant="gradient"
              className="w-full rounded h-[53px] gap-2"
            >
              {(loading || isProcessingStripe) && <LoadingSpinner />}
              {loading || isProcessingStripe ? "Processing..." : "Checkout"}
            </Button>
          </div>
        </div>

        <div
          className={cn(
            "flex-1 overview h-full flex flex-col",
            mobileView !== "overview" && "max-md:hidden"
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
                      : `${isNigeria ? "₦" : "$"}${Number(item.value).toFixed(
                          2
                        )}`}
                  </p>
                </div>
              ))}
            </div>
            <div className="w-full flex items-center justify-between pt-4 mt-6">
              <p className="text-base font-bold">Total</p>
              <p className="text-base font-bold">
                {isNigeria ? "₦" : "$"}
                {orderSummary?.totalAmount}
              </p>
            </div>
          </div>
          <div className="mt-auto w-full flex items-end justify-end max-md:hidden">
            <Button
              onClick={handleCheckout}
              disabled={
                loading ||
                isProcessingStripe ||
                (selectedOption === "Card" &&
                  (!cardNumber || !cardHolder || !cardExpiry || !cardCVV)) ||
                (selectedOption === "Stripe" &&
                  (!cardHolder || !isStripeCardComplete))
              }
              variant="gradient"
              className="w-full rounded h-[53px] gap-2"
            >
              {(loading || isProcessingStripe) && <LoadingSpinner />}
              {loading || isProcessingStripe ? "Processing..." : "Checkout"}
            </Button>
          </div>

          <div className="mt-auto w-full flex items-end justify-end md:hidden gap-6">
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

// Export the wrapped component instead of the raw component
export { CheckoutDialogWrapper as CheckoutDialog };
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

export const LoadingSpinner = () => {
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
