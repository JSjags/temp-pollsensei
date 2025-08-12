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
    <div className="min-h-[4vh] flex items-center justify-center w-full gap-[53px] max-md:flex-col py-12">
      {children}
    </div>
  );
}
