// "use client";

// import React from "react";
// import { useQuery } from "@tanstack/react-query";
// import axiosInstance from "@/lib/axios-instance";
// import { isValidResponse, handleApiErrors } from "@/lib/utils";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
//   CardDescription,
// } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { ChatBotIcon } from "@/components/icons";
// import {
//   FaUser,
//   FaMicrophone,
//   FaDatabase,
//   FaRobot,
//   FaUsers,
//   FaRegIdBadge,
//   FaClipboardList,
// } from "react-icons/fa";
// import { useUserProfileQuery } from "@/services/user.service";

// const fetchFeatureStats = async () => {
//   const response = await axiosInstance.get("/organization/feature-stats");
//   if (isValidResponse(response)) {
//     return response;
//   } else {
//     handleApiErrors(response);
//     return null;
//   }
// };

// const resourceConfig = [
//   {
//     key: "number_of_offline_data_collection",
//     label: "Offline Data Collection",
//     icon: <FaDatabase className="text-purple-700 text-2xl" />,
//     color: "bg-purple-100",
//   },
//   {
//     key: "number_of_voice_response",
//     label: "Voice Responses",
//     icon: <FaMicrophone className="text-pink-700 text-2xl" />,
//     color: "bg-pink-100",
//   },
//   {
//     key: "number_of_monthly_responses",
//     label: "Monthly Responses",
//     icon: <FaRegIdBadge className="text-blue-700 text-2xl" />,
//     color: "bg-blue-100",
//   },
//   {
//     key: "number_of_contributors",
//     label: "Contributors",
//     icon: <FaUsers className="text-green-700 text-2xl" />,
//     color: "bg-green-100",
//   },
//   {
//     key: "number_of_ai_surveys",
//     label: "AI Surveys",
//     icon: <FaRobot className="text-yellow-600 text-2xl" />,
//     color: "bg-yellow-100",
//   },
//   {
//     key: "number_of_accounts",
//     label: "Accounts",
//     icon: <FaUser className="text-gray-700 text-2xl" />,
//     color: "bg-gray-100",
//   },
// ];

// const formatNumber = (num: number) => num?.toLocaleString() ?? 0;

// const Page = () => {
//   const { data, isLoading, error } = useQuery({
//     queryKey: ["organization-feature-stats"],
//     queryFn: fetchFeatureStats,
//   });

//   const { data: profileData, refetch } = useUserProfileQuery({});

//   const stats = data?.data;

//   console.log(profileData?.data?.plan?.name);

//   if (isLoading)
//     return (
//       <div className="py-20 text-center text-lg px-6">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {[...Array(6)].map((_, i) => (
//             <Card key={i} className="shadow-md animate-pulse">
//               <CardHeader className="flex flex-row items-center justify-between pb-2">
//                 <div className="rounded-full p-2 bg-gray-200 h-10 w-10" />
//                 <div className="h-6 w-20 bg-gray-200 rounded-full" />
//               </CardHeader>
//               <CardContent>
//                 <div className="flex items-end justify-between mb-2">
//                   <div className="h-8 w-20 bg-gray-200 rounded" />
//                 </div>
//                 <div className="h-2 w-full bg-gray-200 rounded" />
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>
//     );
//   if (error || !stats)
//     return (
//       <div className="py-20 text-center text-destructive">
//         Error loading feature stats.
//       </div>
//     );

//   // Filter out resources with assigned === 0
//   const filteredResources = resourceConfig.filter((resource) => {
//     const resourceStats = stats[resource.key] || { assigned: 0 };
//     return resourceStats.assigned > 0;
//   });

//   return (
//     <div className="w-full mx-auto py-10 px-6">
//       <h1 className="text-3xl font-bold mb-2 text-center">
//         Resource Usage Dashboard
//       </h1>
//       <p className="text-muted-foreground text-center mb-8">
//         Track your organization's resource usage and limits in real time.
//       </p>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredResources.map((resource) => {
//           const resourceStats = stats[resource.key] || {
//             assigned: 0,
//             used: 0,
//             balance: 0,
//           };
//           const percentUsed =
//             resourceStats.assigned > 0
//               ? (resourceStats.used / resourceStats.assigned) * 100
//               : 0;
//           return (
//             <Card
//               key={resource.key}
//               className="shadow-md hover:shadow-lg transition-shadow duration-200"
//             >
//               <CardHeader className="flex flex-row items-center justify-between pb-2">
//                 <div className={`rounded-full p-2 ${resource.color}`}>
//                   {resource.icon}
//                 </div>
//                 <Badge variant="secondary">{resource.label}</Badge>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex items-end justify-between mb-2">
//                   <div>
//                     <div className="text-2xl font-bold text-foreground">
//                       {formatNumber(resourceStats.used)}
//                     </div>
//                     <div className="text-xs text-muted-foreground">Used</div>
//                   </div>
//                   <div className="text-right">
//                     <div className="text-lg font-semibold text-muted-foreground">
//                       {formatNumber(resourceStats.assigned)}
//                     </div>
//                     <div className="text-xs text-muted-foreground">
//                       Assigned
//                     </div>
//                   </div>
//                 </div>
//                 <Progress value={percentUsed} />
//                 <div className="flex justify-between mt-2 text-xs">
//                   <span className="text-muted-foreground">
//                     Balance:{" "}
//                     <span className="font-semibold text-foreground">
//                       {formatNumber(resourceStats.balance)}
//                     </span>
//                   </span>
//                   <span className="text-muted-foreground">
//                     {percentUsed.toFixed(0)}% used
//                   </span>
//                 </div>
//               </CardContent>
//             </Card>
//           );
//         })}
//         {/* Manual Surveys Card - Free Forever */}
//         <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <div className="rounded-full p-2 bg-pink-200">
//               <FaClipboardList className="text-pink-700 text-2xl" />
//             </div>
//             <Badge variant="secondary">Manual Surveys</Badge>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-center justify-center mb-2">
//               <div className="text-2xl font-bold text-foreground">
//                 Unlimited
//               </div>
//             </div>
//             <Progress value={100} />
//             <div className="flex justify-center mt-2 text-xs">
//               <span className="text-muted-foreground font-semibold">
//                 Free Forever
//               </span>
//             </div>
//           </CardContent>
//         </Card>
//         {/* AI Surveys Card - Free Forever for Pro and Team plans*/}
//         {(profileData?.data?.plan?.name === "Team Plan" ||
//           profileData?.data?.plan?.name === "Pro plan") && (
//           <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <div className="rounded-full p-2 bg-yellow-200">
//                 <FaClipboardList className="text-yellow-700 text-2xl" />
//               </div>
//               <Badge variant="secondary">AI Surveys</Badge>
//             </CardHeader>
//             <CardContent>
//               <div className="flex items-center justify-center mb-2">
//                 <div className="text-2xl font-bold text-foreground">
//                   Unlimited
//                 </div>
//               </div>
//               <Progress value={100} />
//               <div className="flex justify-center mt-2 text-xs">
//                 <span className="text-muted-foreground font-semibold">
//                   {/* Free Forever */}
//                 </span>
//               </div>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//       <Separator className="my-10" />
//       <div className="text-center text-xs text-muted-foreground">
//         <span>Last updated: {new Date(stats.updatedAt).toLocaleString()}</span>
//       </div>
//     </div>
//   );
// };

// export default Page;

import { notFound } from "next/navigation";

export default function SettingsPage() {
  notFound(); // Will render your 404 page
}
