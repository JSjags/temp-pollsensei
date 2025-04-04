"use client";
import React, { FC, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Coin from "@/assets/images/Coin.png";
import { GiPadlock } from "react-icons/gi";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface DailyLoginCardProps {
  currentDay: number;
  setCurrentDay: (day: number) => void;
  claimedDays: number[];
  setClaimedDays: (days: number[]) => void;
  streak: number;
  setStreak: (streak: number) => void;
}

const DailyLoginCard: FC<DailyLoginCardProps> = ({
  currentDay,
  setCurrentDay,
  claimedDays,
  setClaimedDays,
  streak,
  setStreak,
}) => {
  const [daysInMonth, setDaysInMonth] = useState<number>(0);
  const [displayRange, setDisplayRange] = useState({ start: 1, end: 7 });

  // Initialize date and days in month
  useEffect(() => {
    const today = new Date();
    setCurrentDay(today.getDate());

    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    setDaysInMonth(daysInMonth);

    // Calculate initial display range (showing current day in context)
    let start = Math.max(1, currentDay - 3);
    let end = Math.min(daysInMonth, start + 6);
    if (end - start < 6) {
      start = Math.max(1, end - 6);
    }
    setDisplayRange({ start, end });

    // Load claimed days and streak from localStorage
    const savedClaims = localStorage.getItem("claimedDays");
    const savedStreak = localStorage.getItem("streak");
    if (savedClaims) {
      setClaimedDays(JSON.parse(savedClaims));
    }
    if (savedStreak) {
      setStreak(parseInt(savedStreak));
    }
  }, [currentDay, setCurrentDay, setClaimedDays, setStreak]);

  // Handle claiming a day
  const handleClaimDay = (day: number) => {
    if (!claimedDays.includes(day) && day === currentDay) {
      const newClaimedDays = [...claimedDays, day];
      setClaimedDays(newClaimedDays);
      localStorage.setItem("claimedDays", JSON.stringify(newClaimedDays));

      // Update streak
      const today = new Date();
      const lastClaimedTimestamp = localStorage.getItem("lastClaimedTimestamp");
      if (lastClaimedTimestamp) {
        const lastClaimedDate = new Date(parseInt(lastClaimedTimestamp));
        if (today.getTime() - lastClaimedDate.getTime() === 86400000) {
          setStreak(streak + 1);
        } else {
          setStreak(1);
        }
      } else {
        setStreak(1);
      }
      localStorage.setItem("lastClaimedTimestamp", today.getTime().toString());
      localStorage.setItem("streak", streak.toString());
    }
  };

  // Generate login rewards data
  const generateLoginRewards = () => {
    const rewards = [];
    const baseReward = 25;
    const increment = 5;

    for (let day = 1; day <= daysInMonth; day++) {
      const reward = baseReward + (day - 1) * increment;
      rewards.push({
        day: day.toString(),
        price: reward.toString(),
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

    const newStart = displayRange.end;
    const newEnd = Math.min(daysInMonth, newStart + 6);
    setDisplayRange({ start: newStart, end: newEnd });
  };

  const handlePrev = () => {
    if (displayRange.start <= 1) return;

    const newEnd = displayRange.start;
    const newStart = Math.max(1, newEnd - 6);
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
            <Image src={Coin} width={20} height={20} alt="Coin" />
            <p className="text-sm text-[#5B03B2] font-bold">+{login.price}</p>
          </div>
          <Button
            variant="default"
            size="sm"
            disabled={
              parseInt(login.day) !== currentDay ||
              claimedDays.includes(parseInt(login.day))
            }
            onClick={() => handleClaimDay(parseInt(login.day))}
            className={`${
              parseInt(login.day) > currentDay
                ? "bg-[#979797] font-normal cursor-not-allowed"
                : claimedDays.includes(parseInt(login.day))
                ? "bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] font-normal cursor-not-allowed"
                : parseInt(login.day) === currentDay
                ? "bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] cursor-pointer hover:scale-105"
                : "bg-[#979797] font-normal cursor-not-allowed"
            } shadow-[-5px_5px_10px_#563BFF42] text-[10px] text-[#F7F8FB] rounded-full flex items-center gap-2 transition-all w-full h-5 p-0 justify-center font-bold cursor-pointer`}
          >
            {parseInt(login.day) > currentDay && (
              <GiPadlock className="text-white text-lg" />
            )}
            {claimedDays.includes(parseInt(login.day))
              ? "Claimed"
              : parseInt(login.day) === currentDay
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
