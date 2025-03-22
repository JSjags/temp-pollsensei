import React from "react";

const TableSkeleton = () => {
  return (
    <div className="w-full overflow-x-auto bg-white">
      <table className="min-w-full table-auto">
        <tbody>
          {[...Array(20)].map((_, index) => (
            <tr key={index} className="animate-pulse">
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full" />
                  <div className="h-4 w-8 bg-gray-200 rounded" />
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="h-4 w-32 bg-gray-200 rounded" />
              </td>
              <td className="py-3 px-4">
                <div className="h-4 w-40 bg-gray-200 rounded" />
              </td>
              <td className="py-3 px-4">
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </td>
              <td className="py-3 px-4">
                <div className="h-4 w-20 bg-gray-200 rounded" />
              </td>
              <td className="py-3 px-4">
                <div className="h-4 w-28 bg-gray-200 rounded" />
              </td>
              <td className="py-3 px-4">
                <div className="h-4 w-20 bg-gray-200 rounded" />
              </td>
              <td className="py-3 px-4">
                <div className="h-8 w-16 bg-gray-200 rounded" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSkeleton;
