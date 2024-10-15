import { openForm } from "@/redux/slices/form.slice";
import { useGetCollaboratorsListQuery } from "@/services/survey.service";
import { useParams } from "next/navigation";
import React from "react";
import { useDispatch } from "react-redux";

interface User {
  name: string;
  email: string;
  status: "Invited" | "Active";
  avatar: string;
  roles: string[]; // Array of roles
}



const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "Invited":
      return "bg-yellow-100 text-yellow-600";
    case "Active":
      return "bg-green-100 text-green-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const CollaboratorsList: React.FC = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const { data } = useGetCollaboratorsListQuery(params.id);
  console.log(data);
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      {data?.data?.map((user:any, index:number) => (
        <div key={index} className="flex items-center justify-between mb-4">
          {/* User Info */}
          <div className="flex items-center space-x-4">
            <img
              src={user?.photo_url}
              alt={user?.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="text-gray-800 font-semibold">{user?.name}</p>
              <p className="text-gray-500 text-sm">{user?.email}</p>
            </div>
          </div>

          {/* Status Badge and Roles */}
          <div className="flex justify-between items-center space-x-4">
            <span
              className={`px-3 py-1 flex-1 rounded-full text-sm font-semibold ${getStatusBadgeColor(
                user?.status?.status
              )}`}
            >
              {user?.status?.status}
            </span>

            {/* Display Multiple Roles */}
            <div className="flex space-x-2 flex-1">
              {user?.collaborator_roles?.role?.map((role:any, idx:number) => (
                <span
                  key={idx}
                  className="border border-gray-400 text-gray-600 px-4 py-2 rounded-full text-sm"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Invite Button */}
      <div className="flex justify-end">
        <button
          className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700"
          onClick={() => dispatch(openForm())}
        >
          Send Invite
        </button>
      </div>
    </div>
  );
};

export default CollaboratorsList;
