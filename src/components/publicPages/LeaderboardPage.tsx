"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Trophy,
  Users,
  LineChart,
  ClipboardList,
  AlertCircle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { pollsensei_new_logo } from "@/assets/images";
import axiosInstance from "@/lib/axios-instance";
import Link from "next/link";

interface LeaderboardEntry {
  rank: number;
  referrerId: string;
  referrerName: string;
  totalReferrals: number;
  totalSurveysByReferrals: number;
}

interface LeaderboardResponse {
  data: LeaderboardEntry[];
  total: number;
  page: number;
  page_size: number;
}

const fetchLeaderboardData = async (
  page: number = 1,
  limit: number = 20
): Promise<LeaderboardResponse> => {
  const response = await axiosInstance.get<LeaderboardResponse>(
    `/ps/leaderboard?page=${page}&page_size=${limit}`
  );
  return response.data;
};

const LeaderboardPage = () => {
  const [page, setPage] = useState(1);
  const limit = 20;

  const {
    data: leaderboardResponse,
    isLoading,
    isError,
    error,
  } = useQuery<LeaderboardResponse>({
    queryKey: ["leaderboard", page],
    queryFn: () => fetchLeaderboardData(page, limit),
  });

  if (isLoading) {
    return (
      <div className="p-4 sm:p-8 bg-gradient-to-b from-[#5B03B2]/5 to-transparent min-h-screen">
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div className="w-[150px]">
              <Link href="/">
                <Image
                  src={pollsensei_new_logo}
                  alt="PollSensei"
                  width={150}
                  height={150}
                  className="w-full h-auto"
                />
              </Link>
            </div>

            <div className="flex flex-wrap justify-center sm:justify-end gap-2 sm:gap-4">
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-[#5B03B2]/10 hover:text-[#5B03B2] border-[#5B03B2]/20"
                >
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="bg-[#5B03B2] text-white hover:bg-[#5B03B2]/90"
                >
                  Register
                </Button>
              </Link>
            </div>
          </div>

          <div className="text-center space-y-4">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] bg-clip-text text-transparent">
              Referral Champions
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Discover our top performers who are making a difference through
              their referrals
            </p>
          </div>

          <Card className="border-[#5B03B2]/20">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-[#5B03B2]/10 to-[#9D50BB]/10">
                    <TableHead className="w-[100px]">Rank</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead className="text-right">
                      Total Referrals
                    </TableHead>
                    <TableHead className="text-right">Total Surveys</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(20)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse ml-auto" />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 py-4 px-2">
              <div className="w-full sm:w-24">
                <Skeleton className="h-9 w-full" />
              </div>
              <div className="w-32">
                <Skeleton className="h-6 w-full" />
              </div>
              <div className="w-full sm:w-24">
                <Skeleton className="h-9 w-full" />
              </div>
            </div>
          </Card>

          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="border-[#5B03B2]/20">
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl sm:text-2xl text-[#5B03B2]">
                  Understanding the Metrics
                </CardTitle>
                <CardDescription className="text-sm">
                  Key metrics explained for better understanding
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="flex items-start sm:items-center gap-2">
                    <Users className="h-5 w-5 mt-0.5 sm:mt-0 text-[#9D50BB]" />
                    <p className="text-sm">
                      <span className="font-semibold text-[#5B03B2]">
                        Total Referrals:
                      </span>{" "}
                      The total number of users referred
                    </p>
                  </div>
                  <div className="flex items-start sm:items-center gap-2">
                    <ClipboardList className="h-5 w-5 mt-0.5 sm:mt-0 text-[#9D50BB]" />
                    <p className="text-sm">
                      <span className="font-semibold text-[#5B03B2]">
                        Total Surveys:
                      </span>{" "}
                      Total number of surveys created by referred users
                    </p>
                  </div>
                  <div className="flex items-start sm:items-center gap-2">
                    <Trophy className="h-5 w-5 mt-0.5 sm:mt-0 text-[#9D50BB]" />
                    <p className="text-sm">
                      <span className="font-semibold text-[#5B03B2]">
                        Top 3 Qualification:
                      </span>{" "}
                      Minimum of 150 referrals required to win Top 3 positions
                    </p>
                  </div>
                  <div className="flex items-start sm:items-center gap-2">
                    <LineChart className="h-5 w-5 mt-0.5 sm:mt-0 text-[#9D50BB]" />
                    <p className="text-sm">
                      <span className="font-semibold text-[#5B03B2]">
                        Points Calculation:
                      </span>{" "}
                      Points = Total Referrals + (2 × Total Surveys)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#5B03B2]/20">
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl sm:text-2xl text-[#5B03B2]">
                  Prize Pool*
                </CardTitle>
                <CardDescription className="text-sm">
                  Exciting rewards for our top performers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="flex items-start sm:items-center gap-2">
                    <Trophy className="h-5 w-5 mt-0.5 sm:mt-0 text-yellow-500" />
                    <p className="text-sm">
                      <span className="font-semibold text-[#5B03B2]">
                        1st Position:
                      </span>{" "}
                      ₦250,000
                    </p>
                  </div>
                  <div className="flex items-start sm:items-center gap-2">
                    <Trophy className="h-5 w-5 mt-0.5 sm:mt-0 text-gray-400" />
                    <p className="text-sm">
                      <span className="font-semibold text-[#5B03B2]">
                        2nd Position:
                      </span>{" "}
                      ₦150,000
                    </p>
                  </div>
                  <div className="flex items-start sm:items-center gap-2">
                    <Trophy className="h-5 w-5 mt-0.5 sm:mt-0 text-amber-700" />
                    <p className="text-sm">
                      <span className="font-semibold text-[#5B03B2]">
                        3rd Position:
                      </span>{" "}
                      ₦50,000
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4 italic">
                    *Terms and Conditions apply
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-red-500">
          Error loading leaderboard: {(error as Error).message}
        </p>
      </div>
    );
  }

  const { data: leaderboardData } = leaderboardResponse || { data: [] };

  return (
    <div className="p-4 sm:p-8 bg-gradient-to-b from-[#5B03B2]/5 to-transparent min-h-screen">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="w-[150px]">
            <Link href="/">
              <Image
                src={pollsensei_new_logo}
                alt="PollSensei"
                width={150}
                height={150}
                className="w-full h-auto"
              />
            </Link>
          </div>

          <div className="flex flex-wrap justify-center sm:justify-end gap-2 sm:gap-4">
            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-[#5B03B2]/10 hover:text-[#5B03B2] border-[#5B03B2]/20"
              >
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="sm"
                className="bg-[#5B03B2] text-white hover:bg-[#5B03B2]/90"
              >
                Register
              </Button>
            </Link>
          </div>
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] bg-clip-text text-transparent">
            Referral Champions
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Discover our top performers who are making a difference through
            their referrals
          </p>
        </div>

        <Card className="border-[#5B03B2]/20">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-[#5B03B2]/10 to-[#9D50BB]/10">
                  <TableHead className="w-[100px]">Rank</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead className="text-right">Total Referrals</TableHead>
                  <TableHead className="text-right">Total Surveys</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboardData.map((row) => (
                  <TableRow
                    key={row.referrerId}
                    className="hover:bg-[#5B03B2]/5 transition-colors"
                  >
                    <TableCell className="font-medium">
                      {row.rank}
                      {row.rank === 1 && (
                        <Trophy className="inline ml-2 h-4 w-4 text-yellow-500" />
                      )}
                      {row.rank === 2 && (
                        <Trophy className="inline ml-2 h-4 w-4 text-gray-400" />
                      )}
                      {row.rank === 3 && (
                        <Trophy className="inline ml-2 h-4 w-4 text-amber-700" />
                      )}
                    </TableCell>
                    <TableCell>{row.referrerName}</TableCell>
                    <TableCell className="text-right">
                      {row.totalReferrals}
                    </TableCell>
                    <TableCell className="text-right">
                      {row.totalSurveysByReferrals}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="border-t border-[#5B03B2]/10">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 py-4 px-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((old) => Math.max(old - 1, 1))}
                disabled={page === 1}
                className="w-full sm:w-auto hover:bg-[#5B03B2]/10 hover:text-[#5B03B2] border-[#5B03B2]/20"
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                Page {leaderboardResponse?.page || 1} of{" "}
                {Math.ceil((leaderboardResponse?.total || 0) / limit)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPage((old) =>
                    Math.min(
                      old + 1,
                      Math.ceil((leaderboardResponse?.total || 0) / limit)
                    )
                  )
                }
                disabled={
                  page === Math.ceil((leaderboardResponse?.total || 0) / limit)
                }
                className="w-full sm:w-auto hover:bg-[#5B03B2]/10 hover:text-[#5B03B2] border-[#5B03B2]/20"
              >
                Next
              </Button>
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-center gap-2 text-muted-foreground py-4">
          <AlertCircle className="h-4 w-4" />
          <p className="text-sm italic">
            Fake accounts are being purged from our database on an ongoing basis
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Card className="border-[#5B03B2]/20">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl sm:text-2xl text-[#5B03B2]">
                Understanding the Metrics
              </CardTitle>
              <CardDescription className="text-sm">
                Key metrics explained for better understanding
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-start sm:items-center gap-2">
                  <Users className="h-5 w-5 mt-0.5 sm:mt-0 text-[#9D50BB]" />
                  <p className="text-sm">
                    <span className="font-semibold text-[#5B03B2]">
                      Total Referrals:
                    </span>{" "}
                    The total number of users referred
                  </p>
                </div>
                <div className="flex items-start sm:items-center gap-2">
                  <ClipboardList className="h-5 w-5 mt-0.5 sm:mt-0 text-[#9D50BB]" />
                  <p className="text-sm">
                    <span className="font-semibold text-[#5B03B2]">
                      Total Surveys:
                    </span>{" "}
                    Total number of surveys created by referred users
                  </p>
                </div>
                <div className="flex items-start sm:items-center gap-2">
                  <Trophy className="h-5 w-5 mt-0.5 sm:mt-0 text-[#9D50BB]" />
                  <p className="text-sm">
                    <span className="font-semibold text-[#5B03B2]">
                      Top 3 Qualification:
                    </span>{" "}
                    Minimum of 150 referrals required to win Top 3 positions
                  </p>
                </div>
                <div className="flex items-start sm:items-center gap-2">
                  <LineChart className="h-5 w-5 mt-0.5 sm:mt-0 text-[#9D50BB]" />
                  <p className="text-sm">
                    <span className="font-semibold text-[#5B03B2]">
                      Points Calculation:
                    </span>{" "}
                    Points = Total Referrals + (2 × Total Surveys)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#5B03B2]/20">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl sm:text-2xl text-[#5B03B2]">
                Prize Pool*
              </CardTitle>
              <CardDescription className="text-sm">
                Exciting rewards for our top performers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-start sm:items-center gap-2">
                  <Trophy className="h-5 w-5 mt-0.5 sm:mt-0 text-yellow-500" />
                  <p className="text-sm">
                    <span className="font-semibold text-[#5B03B2]">
                      1st Position:
                    </span>{" "}
                    ₦250,000
                  </p>
                </div>
                <div className="flex items-start sm:items-center gap-2">
                  <Trophy className="h-5 w-5 mt-0.5 sm:mt-0 text-gray-400" />
                  <p className="text-sm">
                    <span className="font-semibold text-[#5B03B2]">
                      2nd Position:
                    </span>{" "}
                    ₦150,000
                  </p>
                </div>
                <div className="flex items-start sm:items-center gap-2">
                  <Trophy className="h-5 w-5 mt-0.5 sm:mt-0 text-amber-700" />
                  <p className="text-sm">
                    <span className="font-semibold text-[#5B03B2]">
                      3rd Position:
                    </span>{" "}
                    ₦50,000
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-4 italic">
                  *Terms and Conditions apply
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
