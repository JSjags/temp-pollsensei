// import React, { ReactNode } from "react";
// import { useShopStore } from "../../../store/useShopStore";
// import { BuyFirstStep } from "./BuyFirstStep";
// import { CheckoutDialog } from "./CheckoutDialog";
// import { SuccessDialog } from "../SuccessDialog";
// import { cn } from "@/lib/utils";
// import { Dialog } from "@/components/ui/new-dialog";

// type BuyDialogProps = {
//   children: ReactNode;
// };
// export default function BuyPollcoinsFlow({ children }: BuyDialogProps) {
//   const {
//     pollDialogOpen,
//     setPollDialogOpen,
//     pollstep,
//     setPollStep,
//     pollcoins,
//     reset,
//   } = useShopStore();
//   const description = `You have purchased ${pollcoins} Pollcoins`;
//   let DialogStepComponent = null;

//   switch (pollstep) {
//     case "buy":
//       DialogStepComponent = <BuyFirstStep />;
//       break;
//     case "checkout":
//       DialogStepComponent = <CheckoutDialog />;
//       break;
//     case "success":
//       DialogStepComponent = <SuccessDialog successMessage={description} />;
//       break;
//     default:
//       DialogStepComponent = <BuyFirstStep />;
//   }
//   return (
//     <Dialog.Root
//       open={pollDialogOpen}
//       onOpenChange={(open) => {
//         setPollDialogOpen(open);
//         if (!open) {
//           if (pollstep === "success") {
//             reset();
//           }
//           setPollStep("buy");
//         }
//       }}
//     >
//       <Dialog.Trigger>{children}</Dialog.Trigger>
//       <Dialog.Content
//         className={cn(
//           "z-[100000000] max-w-[442px] w-full max-[440px]:max-h-[85%]",
//           {
//             "max-w-[941px]": pollstep === "checkout",
//           }
//         )}
//       >
//         <div className="flex items-center justify-center w-full pt-3 min-[441px]:hidden">
//           <div className="w-[155px] h-1 bg-[#D9D9D9] rounded-[10px]" />
//         </div>
//         {DialogStepComponent}
//       </Dialog.Content>
//     </Dialog.Root>
//   );
// }

"use client";

import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import { useShopStore } from "../../../store/useShopStore";
import { BuyFirstStep } from "./BuyFirstStep";
import { CheckoutDialog } from "./CheckoutDialog";
import { SuccessDialog } from "../SuccessDialog";
import { cn } from "@/lib/utils";
import { Dialog } from "@/components/ui/new-dialog";
import { usePathname, useSearchParams } from "next/navigation";

type BuyDialogProps = {
  children: ReactNode;
};

export default function BuyPollcoinsFlow({ children }: BuyDialogProps) {
  const {
    pollDialogOpen,
    setPollDialogOpen,
    pollstep,
    setPollStep,
    pollcoins,
    reset,
    setPollcoins,
    addPollcoinsToTotal
  } = useShopStore();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const success = searchParams.get("success");
    const trxref = searchParams.get("trxref");
    const reference = searchParams.get("reference");
  
    if (
      success === "true" &&
      (trxref || reference) &&
      pollstep !== "success"
    ) {
      // Retrieve the purchased pollcoins from localStorage
      const purchasedPollcoins = localStorage.getItem("purchasedPollcoins");
  
      if (purchasedPollcoins) {
        const pollcoinsNumber = Number(purchasedPollcoins); // ✅ Convert to number
  
        if (!isNaN(pollcoinsNumber) && pollcoinsNumber > 0) {
          // ✅ Add purchased amount to total
          addPollcoinsToTotal(String(pollcoinsNumber));
          // ✅ Set for success message
          setPollcoins(String(pollcoinsNumber));
        }
  
        // ✅ Clear localStorage after use
        localStorage.removeItem("purchasedPollcoins");
      }
  
      // ✅ Open the dialog and set success step
      setPollDialogOpen(true);
      setPollStep("success");
  
      // ✅ Update URL to remove success params (without triggering a full page reload)
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("success");
      newSearchParams.delete("trxref");
      newSearchParams.delete("reference");
  
      const newUrl = newSearchParams.toString()
        ? `${pathname}?${newSearchParams}`
        : pathname;
  
      window.history.replaceState(null, "", newUrl);
    }
  }, [
    searchParams,
    pollstep,
    setPollStep,
    setPollDialogOpen,
    setPollcoins,
    addPollcoinsToTotal,
    pathname,
  ]);
  


  const description = `You have purchased ${pollcoins} Pollcoins`;

  let DialogStepComponent = null;
  switch (pollstep) {
    case "buy":
      DialogStepComponent = <BuyFirstStep />;
      break;
    case "checkout":
      DialogStepComponent = <CheckoutDialog />;
      break;
    case "success":
      DialogStepComponent = <SuccessDialog successMessage={description} />;
      break;
    default:
      DialogStepComponent = <BuyFirstStep />;
  }

  return (
    <Dialog.Root
      open={pollDialogOpen}
      onOpenChange={(open) => {
        setPollDialogOpen(open);
        if (!open) {
          if (pollstep === "success") {
            reset();
          }
          setPollStep("buy");
        }
      }}
    >
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Content
        className={cn(
          "z-[100000000] max-w-[442px] w-full max-[440px]:max-h-[85%]",
          { "max-w-[941px]": pollstep === "checkout" }
        )}
      >
        <div className="flex items-center justify-center w-full pt-3 min-[441px]:hidden">
          <div className="w-[155px] h-1 bg-[#D9D9D9] rounded-[10px]" />
        </div>
        {DialogStepComponent}
      </Dialog.Content>
    </Dialog.Root>
  );
}
