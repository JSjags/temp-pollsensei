import React from "react";
import Image from "next/image";
import FilterButton from "../../components/filter/FilterButton";
import search from "../../assets/images/search.svg";
import { IoFilterOutline } from "react-icons/io5";
import { PiDotsThreeBold } from "react-icons/pi";
import { formatDate } from "../../lib/helpers";

interface Role {
  _id: string;
  role: string[];
}

interface Member {
  name: string;
  email: string;
  roles: Role[];
  createdAt: string;
}

interface MembersTableProps {
  members: Member[];
  tableState: boolean;
}

const MembersTable: React.FC<MembersTableProps> = ({ members, tableState }) => {
  return (
    <>
      {tableState && (
        <>
          <div className="flex my-10 items-center justify-between">
            <div className="flex gap-5 items-center">
              <FilterButton text="Filter by" icon={<IoFilterOutline />} />

              <div className="flex items-center px-4 gap-2 rounded-[2rem] border-[1px] px- border-[#d9d9d9] w-[292px] h-[40px]">
                <input
                  className="ring-0 text-[#838383] flex-1 outline-none"
                  type="text"
                  placeholder="Search team members by name, email address"
                />
                <Image src={search} alt="Search" width={24} height={24} />
              </div>
            </div>
          </div>
          <div className="relative overflow-x-auto radius sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right ">
              <thead className="text-[1rem] bg-[#F1F1F1] ">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-[calc(1rem-2px)] flex items-center"
                  >
                    <input type="checkbox" name="" id="" className="mr-4" />{" "}
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-[calc(1rem-2px)]">
                    Email Address
                  </th>
                  <th scope="col" className="px-6 py-3 text-[calc(1rem-2px)]">
                    Roles
                  </th>
                  <th scope="col" className="px-6 py-3 text-[calc(1rem-2px)]">
                    Date Added
                  </th>
                  <th scope="col" className="px-6 py-3 text-[calc(1rem-2px)]">
                    Invoice Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-[calc(1rem-2px)]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {members?.map((member, index) => (
                  <tr
                    className="bg-white border-b text-[calc(1rem-2px)]  hover:bg-gray-50 "
                    key={index}
                  >
                    <td
                      scope="row"
                      className="px-6 py-4 font-medium  whitespace-nowrap"
                    >
                      <input type="checkbox" name="" id="" className="mr-4" />{" "}
                      {member.name}
                    </td>
                    <td className="px-6 py-4">{member.email}</td>
                    <td className="px-6 py-4">
                      {member.roles.map((roleItem) => {
                        const rolesToShow = roleItem.role.slice(0, 2);
                        const remainingRolesCount = roleItem.role.length - 2;
                        return (
                          <div key={roleItem._id}>
                            {rolesToShow.map((role) => (
                              <span
                                className="rounded-full border-2 border-black mx-1 px-3"
                                key={role}
                              >
                                {role}
                              </span>
                            ))}
                            {remainingRolesCount > 0 && (
                              <span>+{remainingRolesCount}</span>
                            )}
                          </div>
                        );
                      })}
                    </td>
                    <td className="px-6 py-4">
                      {formatDate(member.createdAt)}
                    </td>
                    <td className="px-6 py-4">invited</td>
                    <td className="px-6 py-4 text-right">
                      <PiDotsThreeBold />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
};

export default MembersTable;
