
import DashboardAnalytics from "@/components/superAdmin/DashboardAnalytics";
import OverviewCards from "@/components/superAdmin/DashboardOverView";
import React from "react";

type Props = {};

const page = (props: Props) => {
  return(
    <div>
    <OverviewCards />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

    </div>
    <DashboardAnalytics />
    </div>
  );
};

export default page;
