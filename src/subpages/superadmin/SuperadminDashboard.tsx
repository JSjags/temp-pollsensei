"use client";

import DashboardAnalytics from "@/components/superAdmin/DashboardAnalytics";
import OverviewCards from "@/components/superAdmin/DashboardOverView";
import { useSuperadminOverviewQuery } from "@/services/superadmin.service";
import React, { useState } from "react";

const SuperadminDashboard = () => {
  const [selected, setSelected] = useState<string>("");
  const {
    data: overview,
    isLoading: isLoadingOverview,
    isFetching,
  } = useSuperadminOverviewQuery(selected);
  console.log(overview);

  return (
    <div>
      <OverviewCards
        items={overview?.data}
        isLoading={isLoadingOverview || isFetching}
        selected={selected}
        setSelected={setSelected}
      />
      <DashboardAnalytics />
    </div>
  );
};

export default SuperadminDashboard;
