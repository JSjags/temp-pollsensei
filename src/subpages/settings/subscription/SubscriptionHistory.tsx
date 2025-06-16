import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getSubscriptionHistory } from "@/services/admin";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaCreditCard,
  FaPaypal,
  FaStripe,
  FaCalendarAlt,
} from "react-icons/fa";
import dynamic from "next/dynamic";
import InvoiceDownloadButton from "@/components/reusable/InvoiceDownloadButton";

interface SubscriptionRecord {
  _id: string;
  plan_id: { name: string };
  amount: number;
  currency: string;
  status: string;
  gateway: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700 border-green-300",
  success: "bg-green-100 text-green-700 border-green-300",
  failed: "bg-red-100 text-red-700 border-red-300",
  cancelled: "bg-gray-100 text-gray-700 border-gray-300",
  pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
  default: "bg-gray-100 text-gray-700 border-gray-300",
};

const statusIcons: Record<string, JSX.Element> = {
  active: <FaCheckCircle className="inline mr-1" />,
  success: <FaCheckCircle className="inline mr-1" />,
  failed: <FaTimesCircle className="inline mr-1" />,
  cancelled: <FaTimesCircle className="inline mr-1" />,
  pending: <FaHourglassHalf className="inline mr-1" />,
  default: <FaHourglassHalf className="inline mr-1" />,
};

const gatewayIcons: Record<string, JSX.Element> = {
  stripe: <FaStripe className="inline mr-1 text-indigo-600" />,
  paypal: <FaPaypal className="inline mr-1 text-blue-600" />,
  card: <FaCreditCard className="inline mr-1 text-gray-700" />,
  default: <FaCreditCard className="inline mr-1 text-gray-700" />,
};

const SkeletonRow = () => (
  <tr>
    {[...Array(7)].map((_, i) => (
      <td key={i} className="p-3">
        <div className="h-4 rounded-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse w-5/6 mx-auto" />
      </td>
    ))}
  </tr>
);

const getStatusBadge = (status: string) => {
  const key = status?.toLowerCase() || "default";
  return (
    <span
      className={`inline-flex items-center px-2 py-1 border rounded text-xs font-semibold ${
        statusColors[key] || statusColors.default
      }`}
    >
      {statusIcons[key] || statusIcons.default}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const getGatewayIcon = (gateway: string) => {
  const key = gateway?.toLowerCase() || "default";
  return (
    <span className="inline-flex items-center">
      {gatewayIcons[key] || gatewayIcons.default}
      {gateway.charAt(0).toUpperCase() + gateway.slice(1)}
    </span>
  );
};

const PAGE_SIZE = 10;

const PDFDownloadButton = dynamic(
  () => import("@/components/reusable/PDFDownloadButton"),
  { ssr: false }
);

const SubscriptionHistory: React.FC = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["subscriptionHistory", page],
    queryFn: () => getSubscriptionHistory(page, PAGE_SIZE),
  });

  const history: SubscriptionRecord[] = data?.data || [];
  const total: number = data?.total || 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleBack = () => {
    router.push("/settings/subscription");
  };

  // Pagination logic
  const getPageNumbers = () => {
    const pages = [];
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, page + 2);
    if (page <= 3) end = Math.min(5, totalPages);
    if (page >= totalPages - 2) start = Math.max(1, totalPages - 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="p-6 mx-auto w-full">
      <button
        onClick={handleBack}
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium"
      >
        ← Back
      </button>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Subscription History</h2>
        <InvoiceDownloadButton />
      </div>
      <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200 bg-white">
        <table className="min-w-full text-sm rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-gray-50 text-gray-700 uppercase text-xs tracking-wider">
              <th className="p-3 font-semibold text-left">Plan</th>
              <th className="p-3 font-semibold text-left">Amount</th>
              <th className="p-3 font-semibold text-left">Currency</th>
              <th className="p-3 font-semibold text-left">Status</th>
              <th className="p-3 font-semibold text-left">Gateway</th>
              <th className="p-3 font-semibold text-left">Date</th>
              <th className="p-3 font-semibold text-left">Receipt</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [...Array(PAGE_SIZE)].map((_, i) => <SkeletonRow key={i} />)
            ) : isError ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-red-500">
                  {(error as Error)?.message ||
                    "Failed to fetch subscription history."}
                </td>
              </tr>
            ) : history.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  No subscription history found.
                </td>
              </tr>
            ) : (
              history.map((item, idx) => (
                <tr
                  key={item._id}
                  className={`transition-colors duration-150 ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-purple-50 border-b border-gray-100 last:border-b-0`}
                >
                  <td className="p-3 font-medium text-gray-900">
                    {item.plan_id?.name}
                  </td>
                  <td className="p-3">{item.amount.toLocaleString()}</td>
                  <td className="p-3">{item.currency}</td>
                  <td className="p-3">{getStatusBadge(item.status)}</td>
                  <td className="p-3">{getGatewayIcon(item.gateway)}</td>
                  <td className="p-3">
                    <span className="inline-flex items-center">
                      <FaCalendarAlt className="mr-1 text-gray-400" />
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </td>
                  <td className="p-3">
                    <PDFDownloadButton record={item} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between mt-4 gap-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <div className="flex gap-1">
          {getPageNumbers().map((num) => (
            <button
              key={num}
              onClick={() => setPage(num)}
              className={`px-3 py-1 rounded border ${
                num === page
                  ? "bg-gray-200 text-black border-gray-200"
                  : "bg-white hover:bg-purple-100 border-gray-300"
              }`}
              disabled={num === page}
            >
              {num}
            </button>
          ))}
        </div>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages || totalPages === 0}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <style jsx>{`
        @media (max-width: 640px) {
          table,
          thead,
          tbody,
          th,
          td,
          tr {
            display: block;
          }
          thead tr {
            display: none;
          }
          td {
            position: relative;
            padding-left: 50%;
            min-height: 40px;
          }
          td:before {
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            white-space: nowrap;
            font-weight: bold;
          }
          td:nth-of-type(1):before {
            content: "Plan";
          }
          td:nth-of-type(2):before {
            content: "Amount";
          }
          td:nth-of-type(3):before {
            content: "Currency";
          }
          td:nth-of-type(4):before {
            content: "Status";
          }
          td:nth-of-type(5):before {
            content: "Gateway";
          }
          td:nth-of-type(6):before {
            content: "Date";
          }
        }
      `}</style>
      <style jsx>{`
        table {
          border-collapse: separate;
          border-spacing: 0;
        }
        th:first-child {
          border-top-left-radius: 0.75rem;
        }
        th:last-child {
          border-top-right-radius: 0.75rem;
        }
        tr:last-child td:first-child {
          border-bottom-left-radius: 0.75rem;
        }
        tr:last-child td:last-child {
          border-bottom-right-radius: 0.75rem;
        }
      `}</style>
    </div>
  );
};

export default SubscriptionHistory;
