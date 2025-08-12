import React, { useEffect, useState } from "react";
import { CheckIcon, CopyIcon } from "@/assets/images";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useUserProfileQuery } from "@/services/user.service";
import { Skeleton } from "@/components/ui/skeleton";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { toast } from "react-toastify";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Header() {
  const user = useSelector((state: RootState) => state.user.user);
  const { data, isLoading } = useUserProfileQuery({});
  const [referralLink, setReferralLink] = useState("");
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCopyToClipboard()[1];

  const copy = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (copied) return;
    if (referralLink) {
      copyToClipboard(referralLink);
      toast.success(`Referral link copied successfully.`);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };
  useEffect(() => {
    if (data?.data) {
      const { referral_code } = data.data;

      const baseUrl =
        typeof window !== "undefined"
          ? window.location.origin
          : "https://pollsensei.ai";

      const referral_link = referral_code
        ? `${baseUrl}/register?ref=${referral_code}`
        : "";

      setReferralLink(referral_link);
    }
  }, [data]);
  return (
    <div className="flex lg:items-center justify-between max-lg:flex-col gap-5">
      <div className="space-y-2 flex-1">
        <div className="flex lg:items-center gap-2">
          <h1 className="text-xl md:text-[38px] font-bold">
            Hey, {user?.name.split(" ")[0]} 👋
          </h1>
        </div>
        <p className="text-lg md:text-3xl text-new-elements mt-1">
          Here’s your Referral Activity
        </p>
      </div>
      <div className="flex justify-end w-[65%] max-lg:w-full">
        <div
          className={cn(
            "border border-[#5B03B24D] rounded-[10px] h-12 flex items-center justify-center w-fit max-md:w-full gap-4 px-5 max-sm:px-2 overflow-hidden",
            {
              "w-[55%]": isLoading,
            }
          )}
        >
          {isLoading ? (
            <Skeleton className="h-6 w-full" />
          ) : (
            <div className="flex items-center gap-4 w-full overflow-hidden">
              <p className="flex items-center gap-1 max-md:text-sm">
                Referral Link:{" "}
                <span className="text-sm font-medium text-[#837575] truncate max-md:max-w-[200px] inline-block">
                  {referralLink}
                </span>
              </p>
              <div className="flex justify-end flex-1">
                <div onClick={copy} className="cursor-pointer shrink-0">
                  {copied ? (
                    <Image src={CheckIcon} alt="checkmark" className="size-6" />
                  ) : (
                    <Image src={CopyIcon} alt="copy" className="size-6" />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
