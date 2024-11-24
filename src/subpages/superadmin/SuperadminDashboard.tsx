"use client"

import DashboardAnalytics from '@/components/superAdmin/DashboardAnalytics'
import OverviewCards from '@/components/superAdmin/DashboardOverView'
import { useSuperadminOverviewQuery } from '@/services/superadmin.service'
import React from 'react'

const SuperadminDashboard = () => {
  const { data:overview, isLoading:isLoadingOverview } = useSuperadminOverviewQuery(null)
  console.log(overview)

  return (
    <div>
         <OverviewCards items={overview?.data} />
         <DashboardAnalytics />
    </div>
  )
}

export default SuperadminDashboard
