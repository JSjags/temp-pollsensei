import React from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstanceWithoutToken from "@/lib/axios-instance-without-token";

const PricingTableSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8 overflow-x-auto">
      <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mx-auto mb-8"></div>
      <div className="h-[600px] bg-gray-200 rounded animate-pulse"></div>
    </div>
  );
};

const PricingTable: React.FC = () => {
  const { data: plansData, isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const response = await axiosInstanceWithoutToken.get("/plan");
      return response.data.data;
    },
  });

  if (isLoading) {
    return <PricingTableSkeleton />;
  }

  const getFeatureValue = (plan: any, featureName: string) => {
    const feature = plan.features.find(
      (f: any) => f.feature_name === featureName
    );
    return feature ? "✔️" : "-";
  };

  return (
    <div className="container mx-auto px-4 py-8 overflow-x-auto">
      <h2 className="text-2xl font-semibold text-center mb-8">
        Compare Our Plans
      </h2>
      <table className="w-full border-collapse border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="w-1/4 p-4 border border-gray-200 font-semibold text-left"></th>
            {plansData?.map((plan: any) => (
              <th
                key={plan._id}
                className="w-1/4 p-4 border border-gray-200 font-semibold text-center"
              >
                {plan.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white">
            <td className="p-4 border border-gray-200 text-left font-medium">
              Monthly Responses
            </td>
            {plansData?.map((plan: any) => (
              <td
                key={plan._id}
                className="p-4 border border-gray-200 text-center"
              >
                {plan.number_of_monthly_responses}
              </td>
            ))}
          </tr>
          <tr className="bg-gray-50">
            <td className="p-4 border border-gray-200 text-left font-medium">
              Collaborators
            </td>
            {plansData?.map((plan: any) => (
              <td
                key={plan._id}
                className="p-4 border border-gray-200 text-center"
              >
                {plan.number_of_collaborators}
              </td>
            ))}
          </tr>
          {[
            "Unlimited Access",
            "AI Survey/Poll Generation",
            "Data Export (pdf)",
            "Unlimited Polls and Surveys",
            "Account Customization",
            "Offline Data Collection and Analytics",
            "AI Survey Assistant",
            "Automatic AI Survey Reporting",
            "Speech to Text",
            "Priority Email Support",
            "A/B Testing and Radomization",
            "Skip Logic",
            "Multilingual Survey",
            "Dedicated Customer Success Manager",
          ].map((feature, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="p-4 border border-gray-200 text-left font-medium">
                {feature}
              </td>
              {plansData?.map((plan: any) => (
                <td
                  key={plan._id}
                  className="p-4 border border-gray-200 text-center"
                >
                  {getFeatureValue(plan, feature)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PricingTable;
