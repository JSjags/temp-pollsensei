// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/shadcn-input";
// import React, { useEffect } from "react";

// import { Dialog } from "@/components/ui/new-dialog";
// import { usePayoutStore } from "@/components/payouts/store/usePayoutStore";

// export function FirstStep() {
//   const {
//     coinAmount,
//     coinQuantity,
//     errors,
//     redeemableCoins,
//     setCoinAmount,
//     setCoinQuantity,
//     setErrors,
//     clearError,
//     setStep,
//   } = usePayoutStore();

//   const COINS_PER_DOLLAR = 50;
//   const leastPay = 50;

//   useEffect(() => {
//     if (coinQuantity) {
//       const calculatedAmount = (
//         parseFloat(coinQuantity) / COINS_PER_DOLLAR
//       ).toFixed(2);
//       setCoinAmount(calculatedAmount);
//     } else {
//       setCoinAmount("");
//     }
//   }, [coinQuantity, setCoinAmount, COINS_PER_DOLLAR]);

//   const validate = () => {
//     const newErrors: { quantity?: string } = {};
//     const quantityNum = parseFloat(coinQuantity);

//     if (!coinQuantity) {
//       newErrors.quantity = "Coin amount is required.";
//     } else if (isNaN(quantityNum) || quantityNum <= 0) {
//       newErrors.quantity = "Enter a valid Coin quantity.";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = () => {
//     if (!validate()) return;
//     setStep("checkout");
//   };

//   return (
//     <Dialog.Body className="flex flex-col h-full">
//       <div className="mt-5 flex flex-col items-center justify-center">
//         <p className="text-2xl font-bold">Payouts</p>

//         <div className="w-full">
//           <div className="mt-12">
//             <label htmlFor="credits" className="text-sm">
//               Amount of Coins
//             </label>
//             <Input
//               type="number"
//               name="credits"
//               placeholder="Enter Amount of Coins"
//               className="mt-2 h-[54px]"
//               value={coinQuantity}
//               onChange={(e) => {
//                 setCoinQuantity(e.target.value);
//                 if (errors.quantity) clearError("quantity");
//               }}
//             />
//             {errors.quantity && (
//               <p className="mt-1 text-xs text-red-600">{errors.quantity}</p>
//             )}
//             <p className="mt-1 text-xs">
//               Conversion rate: {COINS_PER_DOLLAR} coins = $1
//             </p>
//           </div>

//           <div className="mt-4 flex items-center w-full justify-between h-[54px] border rounded-md bg-muted/50">
//             <div className="h-[54px] flex items-center justify-center min-w-[90px] border-r px-3">
//               <p className="text-sm text-muted-foreground">
//                 Amount in cash ($)
//               </p>
//             </div>

//             <input
//               type="text"
//               value={coinAmount}
//               readOnly
//               className="h-[54px] flex-1 pl-2.5 bg-transparent outline-none text-muted-foreground"
//             />
//           </div>
//           <div className="mt-4 rounded-[10px] bg-[#F7F8FB] w-full py-1.5 px-2.5">
//             <p className="text-[#898989] text-xs">
//               NB: The least payout amount is $50.00
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="flex mt-auto w-full">
//         <Button
//           onClick={handleSubmit}
//           disabled={!coinQuantity || parseFloat(coinAmount) < leastPay}
//           variant="gradient"
//           className="w-full rounded mt-12 max-[441px]:!h-12"
//         >
//           Proceed
//         </Button>
//       </div>
//     </Dialog.Body>
//   );
// }

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/shadcn-input";
import React, { useEffect } from "react";
import { Dialog } from "@/components/ui/new-dialog";
import { usePayoutStore } from "@/components/payouts/store/usePayoutStore";
import { usePayoutConversionRate } from "../../queries/usePayoutConverionrate";
import { useGeoLocation } from "@/subpages/settings/subscription/PricingCards";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserBalance } from "@/components/shop/queries/useBalance";

export function FirstStep() {
  const {
    coinAmount,
    coinQuantity,
    errors,
    redeemableCoins,
    setCoinAmount,
    setCoinQuantity,
    setErrors,
    clearError,
    setStep,
  } = usePayoutStore();
  const { data, isLoading } = usePayoutConversionRate();
  const {
    data: locationData,
    isLoading: locationLoading,
    isError: locationError,
  } = useGeoLocation();
  const isNigeria = locationData?.isNigeria;
  const COINS_PER_DOLLAR = 50;
  const leastPay = 50;
  const { data: userBalance } = useUserBalance();
  const { restrictedBalance = 0 } = userBalance || {};

  useEffect(() => {
    if (!data || !coinQuantity) {
      setCoinAmount("");
      return;
    }

    const convertibleAmount = data.convertible_amount;
    const rate = isNigeria
      ? data.conversion_rate?.NGN
      : data.conversion_rate?.USD;

    if (convertibleAmount && rate && parseFloat(coinQuantity)) {
      const coinToCash = (
        (parseFloat(coinQuantity) / convertibleAmount) *
        rate
      ).toFixed(2);
      setCoinAmount(coinToCash);
    } else {
      setCoinAmount("");
    }
  }, [coinQuantity, data, isNigeria, setCoinAmount]);

  const validate = () => {
    const newErrors: { quantity?: string } = {};
    const quantityNum = parseFloat(coinQuantity);

    if (!coinQuantity) {
      newErrors.quantity = "Coin amount is required.";
    } else if (isNaN(quantityNum) || quantityNum <= 0) {
      newErrors.quantity = "Enter a valid Coin quantity.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (restrictedBalance === 0) return;
    if (!validate()) return;
    setStep("checkout");
  };

  return (
    <Dialog.Body className="flex flex-col h-full">
      <div className="mt-5 flex flex-col items-center justify-center">
        <p className="text-2xl font-bold">Payouts</p>

        <div className="w-full">
          <div className="mt-12">
            <label htmlFor="credits" className="text-sm">
              Amount of Coins
            </label>
            <Input
              type="number"
              name="credits"
              placeholder="Enter Amount of Coins"
              className="mt-2 h-[54px]"
              value={coinQuantity}
              disabled={restrictedBalance === 0}
              onChange={(e) => {
                setCoinQuantity(e.target.value);
                if (errors.quantity) clearError("quantity");
              }}
            />
            {errors.quantity && (
              <p className="mt-1 text-xs text-red-600">{errors.quantity}</p>
            )}
            {redeemableCoins === 0 && (
              <p className="mt-2 text-sm text-red-600 italic">
                You currently have no redeemable coins.
              </p>
            )}

            {isLoading ? (
              <Skeleton className="h-3 w-[50%] mt-2" />
            ) : (
              <p className="mt-1 text-xs">
                Conversion rate: {data?.convertible_amount} coins ={" "}
                {isNigeria
                  ? `₦${data?.conversion_rate?.NGN}`
                  : `$${data?.conversion_rate?.USD}`}
              </p>
            )}
          </div>

          <div className="mt-4 flex items-center w-full justify-between h-[54px] border rounded-md bg-muted/50">
            <div className="h-[54px] flex items-center justify-center min-w-[90px] border-r px-3">
              <p className="text-sm text-muted-foreground">
                {locationLoading ? (
                  <Skeleton className="h-3 w-[50%] mt-2" />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Amount in cash ({isNigeria ? "₦" : "$"})
                  </p>
                )}
              </p>
            </div>

            <input
              type="text"
              value={coinAmount}
              readOnly
              className="h-[54px] flex-1 pl-2.5 bg-transparent outline-none text-muted-foreground"
            />
          </div>

          <div className="mt-4 rounded-[10px] bg-[#F7F8FB] w-full py-1.5 px-2.5">
            <p className="text-[#898989] text-xs">
              NB: The least payout amount is{" "}
              {isNigeria
                ? `₦${data?.conversion_rate?.NGN}`
                : `$${data?.conversion_rate?.USD}`}
            </p>
          </div>
        </div>
      </div>

      <div className="flex mt-auto w-full">
        <Button
          onClick={handleSubmit}
          disabled={
            !coinQuantity ||
            restrictedBalance === 0 ||
            parseFloat(coinAmount || "0") <
              (isNigeria
                ? parseFloat(data?.conversion_rate?.NGN || "0")
                : parseFloat(data?.conversion_rate?.USD || "0"))
          }
          variant="gradient"
          className="w-full rounded mt-12 max-[441px]:!h-12"
        >
          Proceed
        </Button>
      </div>
    </Dialog.Body>
  );
}
