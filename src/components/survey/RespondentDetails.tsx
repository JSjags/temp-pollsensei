import { formatDate, formatTo12Hour } from "@/lib/helpers";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface UserDetails {
  respondent_name: string;
  status: string;
  createdAt: string;
  time: string;
  country: string;
  respondent_email: string;
  answers: any[];
}

interface RespondentDetailsProps {
  data?: UserDetails;
  validCount?: number;
  isLoading?: boolean;
}

const RespondentDetails: React.FC<RespondentDetailsProps> = ({
  data,
  validCount,
  isLoading = false,
}) => {
  const detailItems = [
    { label: "Respondent", value: data?.respondent_name },
    { label: "Status", value: `${validCount} / ${data?.answers?.length}` },
    { label: "Date", value: data?.createdAt && formatDate(data.createdAt) },
    { label: "Time", value: data?.createdAt && formatTo12Hour(data.createdAt) },
    { label: "Country", value: data?.country || "Not provided" },
    { label: "Email", value: data?.respondent_email },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-0 bg-white/50 backdrop-blur-sm border-none shadow-none">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {detailItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center space-x-4 group"
            >
              <span className="text-sm font-medium text-gray-500 min-w-[100px] group-hover:text-purple-600 transition-colors">
                {item.label}:
              </span>
              {isLoading ? (
                <Skeleton className="h-4 w-[200px]" />
              ) : (
                <span className="text-sm text-gray-700 font-medium">
                  {item.value}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default RespondentDetails;
