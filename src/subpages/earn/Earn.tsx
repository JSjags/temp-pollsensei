"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FaArrowRightLong } from "react-icons/fa6";
import ActivityCard from "@/components/earn/ActivityCard";
import stethoscope from "@/assets/images/stethoscope.jpg";
import walk from "@/assets/images/walk.jpg";
import Image from "next/image";
import logoGold from "@/assets/images/logo-gold.png";
import tiltCup from "@/assets/images/tilt-cup.png";
import { MdInfo } from "react-icons/md";
import DailyLoginCard from "@/components/earn/DailyLoginCard";
import SocialMediaCard from "@/components/earn/SocialMediaCard";
import SurveyTabs from "@/subpages/earn/SurveyTabs";
import AdsDialog from "@/subpages/earn/AdsDialog";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  openSurveyTabs,
  openAdsDialog,
  closeAdsDialog,
  openSurveyFormDialog,
  closeSurveyFormDialog,
  openSuccessDialog,
  closeSuccessDialog,
} from "@/redux/slices/earnDialogSlice";
import { PayoutDialog } from "@/components/payouts/components/dialogs";
import { useRouter } from "next/navigation";
import SurveyFormDialog from "@/subpages/earn/SurveyFormDialog";
import BannerNote from "@/components/earn/BannerNote";
import { fetchUnrestrictedBalance } from "@/services/api/apiRequest";
import { useQuery } from "@tanstack/react-query";
import { APP_KEYS } from "@/constants";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchLoginStreak } from "@/services/api/apiRequest";
import { formatLargeNumber } from "@/utils";
import congrats from "@/assets/images/congrats.svg";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";

const Earn = () => {
  const router = useRouter();
  const [activitiesCompleted, setActivitiesCompleted] = useState<number>(0);

  const {
    data: balance,
    isLoading,
    refetch: refetchBalance,
  } = useQuery({
    queryKey: [...[APP_KEYS.UNRESTRICTED_BALANCE]],
    queryFn: () => fetchUnrestrictedBalance(),
    enabled: true,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const { data: streak, refetch: refetchStreak } = useQuery({
    queryKey: [...[APP_KEYS.LOGIN_STREAK]],
    queryFn: () => fetchLoginStreak(),
    enabled: true,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const currentStreak = streak?.current_streak || 0;

  const activities = [
    {
      title: "Surveys",
      desktopDescription:
        "Get rewarded with Pollcoins that can be redeemed for cash by participating in tailored surveys",
      mobileDescription: "Earn coins by filling surveys",
      image: stethoscope,
      buttonText: "Complete Survey",
    },
    {
      title: "Ads",
      desktopDescription:
        "Earn Pollcoins that can be redeemed and changed to cash by watching a specified number of Ads daily.",
      mobileDescription: "Earn coins by watching Ads",
      image: walk,
      buttonText: "Watch ads",
    },
    {
      title: "Referrals",
      desktopDescription:
        "Invite your friends and acquaintances to follow us on social media by sharing your referral link with them to earn Pollcoins",
      mobileDescription: "Earn coins by referring ",
      image: stethoscope,
      buttonText: "Refer a Friend ",
    },
    {
      title: "Newsletter",
      desktopDescription:
        "Subscribe to our monthly Newsletter to earn coins which are redeemable for cash or can be used as voucher.",
      mobileDescription: "Subscribe to earn coins",
      image: walk,
      buttonText: "Subscribe to Newsletter",
    },
  ];

  const dispatch = useDispatch();
  const { isAdsDialogOpen, isSurveyFormDialogOpen, isSuccessDialogOpen } =
    useSelector((state: RootState) => state.earnDialogSlice);

  const handleActivityClick = async (buttonText: string) => {
    if (buttonText === "Complete Survey") {
      dispatch(openSurveyTabs());
    } else if (buttonText === "Watch ads") {
      dispatch(openAdsDialog());
    } else if (buttonText === "Refer a Friend") {
      router.push("/referral");
    }
  };

  return (
    <>
      <SurveyTabs />

      <AdsDialog
        open={isAdsDialogOpen}
        onOpenChange={(open) =>
          dispatch(open ? openAdsDialog() : closeAdsDialog())
        }
      />
      <div className="w-full h-auto flex flex-col gap-5 lg:gap-10 mb-5 overflow-hidden">
        <div className="w-full h-auto rounded-xl bg-gradient-to-r from-[#260D3E] via-[#260D3E] to-[#EB06AB] px-4 py-2 flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1 items-center justify-start lg:justify-normal h-[120px] lg:h-auto">
            <div className="flex gap-1 items-center">
              <h1 className="text-[32px] md:text-[42px] font-bold text-white">
                {isLoading ? (
                  <Skeleton className="h-6 w-16" />
                ) : (
                  formatLargeNumber(balance?.unrestrictedBalance || 0)
                )}
              </h1>
              <Image src={logoGold} width={20} height={20} alt="pollcoin" />
            </div>
            <p className="text-xs lg:text-sm text-white/80">Pollcoins Earned</p>
          </div>
          <span className="w-[1px] h-16 bg-white/50">&nbsp;</span>
          <div className="flex flex-col lg:flex-row items-center gap-5 h-[120px] lg:h-auto">
            <div className="flex flex-col items-center">
              <h1 className="text-[32px] md:text-[42px] font-bold text-white">
                {activitiesCompleted}
              </h1>
              <p className="text-xs lg:text-sm text-white/80">
                Activities completed
              </p>
            </div>

            <PayoutDialog>
              <Button
                variant="default"
                size="sm"
                className="bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] flex items-center gap-2 text-white hover:scale-105 transition-all rounded-full text-sm lg:text-base"
                type="button"
                disabled={balance?.unrestrictedBalance === 0}
              >
                Redeem Coins
                <FaArrowRightLong className="text-base text-white" />
              </Button>
            </PayoutDialog>
          </div>
          <div className="hidden lg:inline-block">
            <BannerNote />
          </div>
        </div>
        <div className="block lg:hidden">
          <BannerNote />
        </div>
        <div className="w-full h-auto flex flex-col gap-3">
          <h3 className="text-[#1C1C1C] text-lg font-bold">Activities</h3>
          <div className="w-full h-auto grid grid-cols-2 lg:grid-cols-4 gap-3 items-center">
            {activities.map((activity, index) => (
              <ActivityCard
                key={index}
                {...activity}
                onClick={() => handleActivityClick(activity.buttonText)}
              />
            ))}
          </div>
        </div>
        <div className="w-full h-auto lg:h-[150px] flex flex-col lg:flex-row items-center gap-3">
          <div className="bg-[#490688] h-[50px] lg:h-full w-full lg:w-[20%] p-3 rounded-bl-none lg:rounded-bl-lg rounded-tl-lg rounded-tr-lg lg:rounded-tr-none relative flex items-center lg:items-start">
            <p className="text-xs lg:text-sm font-bold text-left lg:text-center text-white">
              Daily Check in to Claim Rewards
            </p>
            <Image
              src={tiltCup}
              width={200}
              height={200}
              alt="Earn coins illustration"
              className="absolute bottom-0 left-0 hidden lg:block"
            />
            <Image
              src={tiltCup}
              width={100}
              height={100}
              alt="Earn coins illustration"
              className="absolute bottom-0 -right-5 block lg:hidden"
            />
          </div>
          <div className="w-full lg:w-auto h-full px-2 py-1 flex flex-col gap-4 lg:gap-2">
            <div className="w-full h-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 lg:gap-0">
              <div className="flex items-center gap-2">
                <p className="text-[#1C1C1C] text-base lg:text-lg font-bold">
                  Daily Login
                </p>
                <MdInfo className="text-[#6704AE] text-lg" />
              </div>
              <div className="flex items-center bg-[#EDE1F9] w-full lg:w-auto px-5 py-1 rounded-lg lg:rounded-full">
                <p className="text-[#453951] text-xs">
                  You have logged in for{" "}
                  <span className="font-bold text-[13px]">
                    {currentStreak && Number(currentStreak) <= 1
                      ? `${currentStreak} day`
                      : `${currentStreak} days`}
                  </span>{" "}
                  straight
                </p>
              </div>
            </div>

            <DailyLoginCard
              onClaimSuccess={refetchBalance}
              streak={streak}
              refetchStreak={refetchStreak}
            />
          </div>
        </div>
        <div className="w-full h-auto flex flex-col gap-5">
          <h2 className="text-[#1C1C1C] text-base lg:text-lg font-bold">
            Follow us on social media to earn coins
          </h2>

          <SocialMediaCard />
        </div>
      </div>

      <SurveyFormDialog
        open={isSurveyFormDialogOpen}
        onOpenChange={(open) => {
          if (open) {
            dispatch(openSurveyFormDialog(""));
          } else {
            dispatch(closeSurveyFormDialog());
          }
        }}
      />

      <Dialog
        open={isSuccessDialogOpen}
        onOpenChange={(open) => {
          if (open) {
            dispatch(openSuccessDialog());
          } else {
            dispatch(closeSuccessDialog());
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogDescription className="h-[400px] flex flex-col gap-10 justify-center items-center">
              <Image src={congrats} width={250} height={250} alt="congrats" />
              <h1 className="text-2xl font-bold text-center">Successful!</h1>
              <div className="flex items-center gap-1">
                <p className="text-base text-center">
                  You have successfully filled the survey and earned 3
                </p>
                <Image src={logoGold} width={15} height={15} alt="pollcoin" />
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default Earn;
