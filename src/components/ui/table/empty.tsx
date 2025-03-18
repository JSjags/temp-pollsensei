import Image from "next/image";
import { Card } from "../card";
import { Button } from "../button";
import { Arrow } from "@/assets/images";
import { ReactNode } from "react";
// import Wallet from '@/icons/wallet.svg'

type TableEmptyStateProps = {
  children?: ReactNode;
};

export function TableEmptyState({ children }: TableEmptyStateProps) {
  return (
    <div className="min-h-[168px] flex items-center justify-center w-full gap-[53px] max-md:flex-col py-12">
      <Image
        src={"/assets/shop/table_empty.png"}
        alt="empty state"
        width={285}
        height={220}
        className="max-w-[285px] w-full"
      />

      <div className="md:max-w-[223px] max-md:text-center">{children}</div>
    </div>
  );
}
