import React from "react";

interface TableHeadProps {
  headers: string[];
}

const TableHead: React.FC<TableHeadProps> = ({ headers }) => (
  <thead className="text-[1rem] text-[#7A8699] uppercase bg-gray-50 dark:text-gray-400">
    <tr className="text-zinc-400 text-base font-light text-left">
      {headers.map((header, index) => (
        <th key={index} scope="col" className="px-6 py-3 flex items-center">
          {header}
        </th>
      ))}
    </tr>
  </thead>
);

export default TableHead;
