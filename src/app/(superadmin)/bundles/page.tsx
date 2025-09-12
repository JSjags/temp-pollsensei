import React from "react";
import Link from "next/link";
import { Package, Coins } from "lucide-react";

type Props = {};

const BundlesPage = (props: Props) => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bundles Management</h1>
        <p className="text-gray-600 mt-2">
          Manage different types of bundles and packages
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/bundles/pollcoins" className="group">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-200 border border-gray-200 group-hover:border-purple-300">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-purple-100 rounded-lg mr-4">
                <Coins className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Pollcoins
                </h3>
                <p className="text-sm text-gray-600">Manage pollcoin bundles</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              Configure pollcoin packages, pricing, and availability for users.
            </p>
          </div>
        </Link>

        {/* Placeholder for future bundle types */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200 opacity-50">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-gray-100 rounded-lg mr-4">
              <Package className="h-6 w-6 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-400">
                More Bundles
              </h3>
              <p className="text-sm text-gray-400">Coming soon</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm">
            Additional bundle types will be available in future updates.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BundlesPage;
