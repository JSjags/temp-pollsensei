"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import { Pollcoin } from "@/assets/images";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useShopStore } from "../store/useShopStore";
import { cn } from "@/lib/utils";
import BuyPollcoinsFlow from "@/components/shop/components/dialogs/BuyPollcoins";

interface PollCoinBundle {
  id: string;
  price: number;
  pollcoins: number;
  bonus?: number;
  tag?: string;
  discount?: number;
  originalPrice?: number;
  popular?: boolean;
}

const pollCoinBundles: PollCoinBundle[] = [
  {
    id: "bundle-1",
    price: 25,
    pollcoins: 50,
  },
  {
    id: "bundle-2",
    price: 47.5,
    pollcoins: 95,
    bonus: 5,
    tag: "Early Bird",
    popular: true,
  },
  {
    id: "bundle-3",
    price: 115,
    pollcoins: 230,
    discount: 53,
    originalPrice: 125,
  },
  {
    id: "bundle-4",
    price: 220,
    pollcoins: 440,
    bonus: 60,
  },
  {
    id: "bundle-5",
    price: 400,
    pollcoins: 800,
    bonus: 200,
  },
  {
    id: "bundle-6",
    price: 950,
    pollcoins: 1900,
    bonus: 600,
  },
];

export function PollCoinBundles() {
  const router = useRouter();
  const { setPollcoins, setPollAmount, setPollDialogOpen, setPollStep } =
    useShopStore();

  const handlePurchase = (bundle: PollCoinBundle) => {
    // Set the bundle values in the store
    setPollcoins(bundle.pollcoins.toString());
    setPollAmount(bundle.price.toString());

    // Open the PollCoin purchase dialog directly
    setPollDialogOpen(true);
    setPollStep("checkout");
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {pollCoinBundles.map((bundle) => (
          <div
            key={bundle.id}
            className={cn(
              `relative bg-white overflow-hidden rounded-xl border p-4 transition-all duration-300 hover:shadow-lg hover:scale-105`,
              //   bundle.popular
              //     ? "border-purple-500 shadow-lg"
              //     :
              "border-gray-200 hover:border-purple-300"
            )}
          >
            {/* Background Pollcoin Symbol */}
            <div
              className="absolute pointer-events-none z-0 flex items-center justify-end"
              style={{
                top: "50%",
                right: "12px",
                transform: "translateY(-50%)",
                height: "0",
                width: "100%",
              }}
            >
              <Image
                src={Pollcoin}
                alt="PollCoin background"
                className="w-28 h-28 opacity-10 select-none"
                style={{
                  position: "relative",
                  zIndex: 0,
                  pointerEvents: "none",
                  filter: "blur(0.5px)",
                }}
                aria-hidden="true"
              />
            </div>

            {/* Popular Badge */}
            {/* {bundle.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
                <div className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current" />
                  Most Popular
                </div>
              </div>
            )} */}

            {/* Early Bird Tag */}
            {bundle.tag && (
              <div className="absolute top-0 right-0 w-full flex justify-end pointer-events-none z-20">
                <div
                  className="origin-top-right"
                  style={{
                    position: "relative",
                    width: "max-content",
                    right: "-26px",
                    top: "18px",
                  }}
                >
                  <div
                    className="bg-purple-700 text-white text-xs font-bold py-1 px-8 shadow-lg"
                    style={{
                      transform: "rotate(45deg)",
                      minWidth: "120px",
                      textAlign: "center",
                      pointerEvents: "auto",
                    }}
                  >
                    {bundle.tag}
                  </div>
                </div>
              </div>
            )}

            {/* Discount Badge */}
            {bundle.discount && (
              <div className="absolute top-1/2 -translate-y-1/2 right-4 z-20">
                <div className="bg-purple-700 text-white w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold">
                  -{bundle.discount}%
                </div>
              </div>
            )}

            <div className="text-start relative z-10">
              {/* Price */}
              <div className="mb-4">
                <span className="text-xl font-bold text-gray-700 mr-2">
                  ${bundle.price}
                </span>
                {bundle.originalPrice && (
                  <span className="!text-lg text-gray-400 line-through">
                    ${bundle.originalPrice}
                  </span>
                )}
              </div>

              {/* PollCoins */}
              <div className="">
                <div className="flex items-center justify-start gap-2 mb-2">
                  <Image src={Pollcoin} alt="PollCoin" className="w-8 h-8" />
                  <span className="text-2xl font-bold text-purple-800">
                    {bundle.pollcoins}
                  </span>
                  <span className="text-2xl text-purple-800 font-bold">
                    PollCoins
                  </span>
                </div>

                {/* Bonus */}
                <div className="h-10">
                  {bundle.bonus && (
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium inline-block">
                      +{bundle.bonus} PollCoins Bonus
                    </div>
                  )}
                </div>
              </div>

              {/* Purchase Button */}
              <BuyPollcoinsFlow>
                <Button
                  variant="ghost"
                  className="h-10 rounded-full text-base hover:!bg-transparent text-gray-500 hover:text-gray-700 px-0 font-medium gap-2 hover:scale-105 transition-transform w-fit"
                >
                  Buy now
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </BuyPollcoinsFlow>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
