import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/new-dialog";
import Image from "next/image";
import React from "react";

type SuccessDialogProps = {
  successMessage?: string;
};
export function SuccessDialog({ successMessage }: SuccessDialogProps) {
  return (
    <Dialog.Body>
      <div className="flex items-center justify-center w-full">
        <Image
          src={"/assets/shop/coffetti.png"}
          alt="Coffetti"
          width={300}
          height={300}
        />
      </div>
      <div className="flex items-center justify-center w-full mt-6 flex-col">
        <p className="text-[28px] font-bold">Congratulations</p>
        <p className="max-w-[215px] text-center text-muted-foreground">
          {successMessage}
        </p>
        <div className=" mt-5 w-full text-center">
          <Button variant="gradient" className="w-full rounded h-12">
            Buy Respondent
          </Button>

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
