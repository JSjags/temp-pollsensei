import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/new-dialog";
import Image from "next/image";
import { useRouter } from "next/navigation";

import React from "react";

type SuccessDialogProps = {
  successMessage?: string;
};
export function SuccessDialog({ successMessage }: SuccessDialogProps) {
  const router = useRouter()
  return (
    <Dialog.Body>
      <div className="flex items-center justify-center w-full">
        <Image
          src={"/assets/shop/coffetti.png"}
           alt="Confetti celebration"
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
          <Button onClick={() => router.push('/dashboard')} variant="gradient" className="w-full rounded h-12">
            Go to Dashboard
          </Button>

          <Dialog.Close>
            <p className="cursor-pointer text-tertiary text-center mt-6 underline">
              Go back
            </p>
          </Dialog.Close>
        </div>
      </div>
    </Dialog.Body>
  );
}
