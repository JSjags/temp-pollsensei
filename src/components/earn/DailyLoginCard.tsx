"use client";
import React, { FC, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Coin from "@/assets/images/Coin.png";
import { GiPadlock } from "react-icons/gi";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { fetchDailyReward } from "@/services/api/apiRequest";
import { queryClient } from "@/contexts/index";
import { APP_KEYS } from "@/constants";
import logoGold from "@/assets/images/logo-gold.png";

interface MonthlyLogin {
  count: number;
  date: string;
  streak: number;
}

interface StreakData {
  current_streak: number;
  has_logged_in_today: boolean;
  longest_streak: number;
  monthly_logins: MonthlyLogin[];
  total_logins: number;
}

interface DailyLoginCardProps {
  onClaimSuccess?: () => void;
  streak?: StreakData;
  refetchStreak?: () => void;
}

const DailyLoginCard: FC<DailyLoginCardProps> = ({
  onClaimSuccess,
  streak,
  refetchStreak,
}) => {
  const [currentDay, setCurrentDay] = useState<number>(0);
  const [claimedDays, setClaimedDays] = useState<number[]>([]);
  const [daysInMonth, setDaysInMonth] = useState<number>(0);
  const [displayRange, setDisplayRange] = useState({ start: 1, end: 7 });

  useEffect(() => {
    const today = new Date();
    const currentDate = today.getDate();
    setCurrentDay(currentDate);

    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    setDaysInMonth(daysInMonth);

    // Calculate initial display range to include current day
    const start = Math.max(1, Math.min(currentDate - 3, daysInMonth - 6));
    const end = Math.min(daysInMonth, start + 6);
    setDisplayRange({ start, end });
  }, []);

  useEffect(() => {
    // Extract claimed days from monthly_logins
    if (streak?.monthly_logins) {
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();

      const claimedDaysFromAPI = streak.monthly_logins
        .map((login: MonthlyLogin) => {
          const loginDate = new Date(login.date);
          // Only include logins from current month and year
          if (
            loginDate.getMonth() === currentMonth &&
            loginDate.getFullYear() === currentYear
          ) {
            return loginDate.getDate();
          }
          return null;
        })
        .filter((day: number | null) => day !== null) as number[];

      // Remove duplicates in case there are multiple logins on the same day
      const uniqueClaimedDays = Array.from(new Set(claimedDaysFromAPI));
      setClaimedDays(uniqueClaimedDays);
    }
  }, [streak?.monthly_logins]);

  // Function to Handle claim day
  const handleClaimDay = async (day: number) => {
    if (!claimedDays.includes(day) && day === currentDay) {
      const { success } = await fetchDailyReward();

      if (success) {
        if (refetchStreak) {
          await refetchStreak();
        }
        onClaimSuccess?.();
        queryClient.invalidateQueries({
          queryKey: [...[APP_KEYS.UNRESTRICTED_BALANCE]],
        });
      }
    }
  };

  const generateLoginRewards = () => {
    const rewards = [];

    for (let day = 1; day <= daysInMonth; day++) {
      rewards.push({
        day: day.toString(),
        price: "1",
      });
    }

    return rewards;
  };

  const logins = generateLoginRewards();

  const displayedLogins = logins.filter(
    (login) =>
      parseInt(login.day) >= displayRange.start &&
      parseInt(login.day) <= displayRange.end
  );

  const handleNext = () => {
    if (displayRange.end >= daysInMonth) return;

    const newStart = displayRange.start + 7;
    const newEnd = Math.min(daysInMonth, newStart + 6);
    setDisplayRange({ start: newStart, end: newEnd });
  };

  const handlePrev = () => {
    if (displayRange.start <= 1) return;

    const newStart = Math.max(1, displayRange.start - 7);
    const newEnd = newStart + 6;
    setDisplayRange({ start: newStart, end: newEnd });
  };

  return (
    <div className="w-full h-auto flex items-center gap-3 overflow-x-auto relative">
      <FaChevronLeft
        onClick={handlePrev}
        className={`hover:cursor-pointer hover:scale-105 transition-all text-3xl absolute left-0 top-1/2 -translate-y-1/2 z-10 ${
          displayRange.start <= 1
            ? "text-[#979797] cursor-not-allowed"
            : "text-[#6704AE]"
        }`}
      />
      {displayedLogins.map((login, index) => (
        <div
          key={index}
          className={`min-w-[80px] lg:min-w-[100px] h-auto border rounded-lg bg-[#EFE6F657] p-2 flex flex-col items-center gap-1 ${
            claimedDays.includes(parseInt(login.day))
              ? "border-[#9D50BB]"
              : parseInt(login.day) === currentDay
              ? "border-[#5B03B2]"
              : "border-[#979797]"
          }`}
        >
          <p className="text-[#333333] text-xs">Day {login.day}</p>
          <div className="flex items-center gap-1">
            <p className="text-sm text-[#5B03B2] font-bold">+{login.price}</p>
            <Image src={logoGold} width={15} height={15} alt="pollcoin" />
          </div>
          <Button
            variant="default"
            size="sm"
            disabled={
              claimedDays.includes(parseInt(login.day)) ||
              parseInt(login.day) < currentDay ||
              parseInt(login.day) > currentDay
            }
            onClick={() => handleClaimDay(parseInt(login.day))}
            className={`${
              claimedDays.includes(parseInt(login.day))
                ? "bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] font-normal cursor-not-allowed"
                : parseInt(login.day) < currentDay ||
                  parseInt(login.day) > currentDay
                ? "bg-[#979797] font-normal cursor-not-allowed"
                : "bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] cursor-pointer hover:scale-105"
            } shadow-[-5px_5px_10px_#563BFF42] text-[10px] text-[#F7F8FB] rounded-full flex items-center gap-2 transition-all w-full h-5 p-0 justify-center font-bold cursor-pointer`}
          >
            {parseInt(login.day) > currentDay && (
              <GiPadlock className="text-white text-lg" />
            )}
            {claimedDays.includes(parseInt(login.day))
              ? "Claimed"
              : parseInt(login.day) < currentDay
              ? "Missed"
              : parseInt(login.day) > currentDay
              ? "Claim"
              : "Claim"}
          </Button>
        </div>
      ))}
      <FaChevronRight
        onClick={handleNext}
        className={`hover:cursor-pointer hover:scale-105 transition-all text-3xl absolute right-0 top-1/2 -translate-y-1/2 z-10 ${
          displayRange.end >= daysInMonth
            ? "text-[#979797] cursor-not-allowed"
            : "text-[#6704AE]"
        }`}
      />
    </div>
  );
};

export default DailyLoginCard;
