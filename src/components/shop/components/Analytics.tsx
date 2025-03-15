import { Button } from "@/components/ui/button";
import React from "react";
import { cn } from "@/lib/utils";
import {
  Arrow,
  AvailableIcon,
  Coins,
  InfoIcon,
  MoneyIcon,
  RespondentIcon,
  WalletIcon,
} from "@/assets/images";
import Link from "next/link";
import Image from "next/image";
import BuyDialog from "./dialogs/BuyPollcoins";

const analyticData = [
  {
    label: "Available Pollcoins",
    value: 0,
    icon: AvailableIcon,
    iconColor: "#3575FF",
  },
  {
    label: "Available AI-prompt Credit",
    value: 0,
    icon: WalletIcon,
    iconColor: "#F36643",
  },
  {
    label: "Purchased Respondents",
    value: 0,
    icon: RespondentIcon,
    iconColor: "#4524F8",
  },
  {
    label: "Redeemable Pollcoins",
    value: 0,
    icon: MoneyIcon,
    iconColor: "#0ACF80",
  },
];
export function Analytics() {
  return (
    <div className="w-full">
      <h3 className="text-2xl font-bold mb-[26px] max-md:hidden">Sensei Shop</h3>
      <div className="flex gap-[22px] w-full max-md:flex-col">
        <div className="bg-gradient-to-br from-[#9D50BB] via-[#5B03B2] md:min-w-[231px] max-md:w-full text-white to-[#260D3E] px-4 pt-5 md:rounded-[6.8px] pb-2 max-md:pb-0 relative">
          <p>Welcome to the</p>
          <h3 className="text-3xl max-md:text-2xl font-bold">Sensei Shop</h3>
          <div className="flex items-center justify-center w-full">
          <div className="rounded-tr-[27px] rounded-tl-[27px] mt-[14px] pb-[11px] flex items-center flex-col justify-center gap-[11px] bg-white/10 md:px-[18px] px-10 pt-[14px] max-md:pt-6 max-md:max-w-[317px] max-md:pb-8">
            <p className="text-[0.8125rem] md:w-[176px] w-[217px] text-center">
              Purchase Pollcoins with cash to be able to participate in various
              activities such as buying respondents for your survey.{" "}
            </p>
            <BuyDialog>
              <Button
                variant={"gradient"}
                className="min-w-[131px] h-[29px] max-md:h-11 max-md:w-full font-bold gap-1 py-[7px] max-md:mt-6"
              >
                Buy Pollcoins
                <Image src={Arrow} alt="icons" className="size-5" />
              </Button>
            </BuyDialog>
          </div>
          </div>

          <div className="absolute top-0 right-0">
            <Image src={Coins} alt="icons" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 w-full max-md:px-5">
          {analyticData.map((analytic) => {
            const { label, icon, value, iconColor } = analytic;
            return (
              <div
                key={label}
                className="bg-white rounded-[6.8px] p-5 shadow-[0px_1.36px_4.08px_0px_#34037914] md:min-w-[246px]"
              >
                <div className="h-full flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1.5">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <h4 className="text-xl font-bold">{value}</h4>
                    </div>
                    <div
                      style={{ backgroundColor: `${iconColor}1A` }}
                      className={cn(
                        "size-[34px] rounded-[6.8px] flex items-center justify-center"
                      )}
                    >
                      <Image src={icon} alt="icons" />
                    </div>
                  </div>

                  <div className="mt-auto flex items-end justify-end pt-2">
                    {label !== "Redeemable Pollcoins" && (
                      <div className="flex items-center gap-1">
                        <span>
                          <Image src={InfoIcon} alt="icons" />
                        </span>
                        <Link
                          href="#"
                          className="text-muted-foreground text-xs underline"
                        >
                          Learn more
                        </Link>
                      </div>
                    )}
                    {label === "Redeemable Pollcoins" && (
                      <Button variant="gradient">Redeem coins</Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="px-2 relative min-w-[327px] max-md:hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src={"/assets/shop/webp/banner.webp"}
              alt="banner"
              layout="fill"
              objectFit="cover"
              className="rounded-[10px]"
            />
          </div>
          <div className="bg-[#FFC822CC] w-[282px] z-30 absolute bottom-3 flex items-center justify-center flex-col py-5 text-white">
            <p className="text-xl font-bold w-[80%]">
              <span className="font-bold italic text-[25px]">GET 50% OFF</span>{" "}
              <br /> ON ALL ORDERS FROM TEMU TODAY
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
