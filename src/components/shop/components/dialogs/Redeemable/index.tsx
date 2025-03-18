import { RedeemableEmpty } from "@/assets/images";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/new-dialog";
import Image from "next/image";
import React from "react";

export default function Redeemable() {
  return (
    <Dialog.Body>
      <div className="flex items-center justify-center w-full flex-col gap-6">
        <Image src={RedeemableEmpty} alt="Empty state" />
        <div className="flex items-center justify-center flex-col text-center">
          <p className="text-[1.75rem] font-bold">Oops!!</p>
          <p className="text-muted-foreground">
            Your redeemable coins has not reached the transfer minimum of 50
            coins. Refer friends to Earn more redeemable coins
          </p>
        </div>
        <div className="w-full text-center">
          <Button variant="gradient" className="rounded w-full">Earn more coins</Button>
          <Dialog.Close>
            <p className="cursor-pointer text-tertiary text-center mt-6 underline">
              Return to Shop
            </p>
          </Dialog.Close>
        </div>
      </div>
    </Dialog.Body>
  );
}
