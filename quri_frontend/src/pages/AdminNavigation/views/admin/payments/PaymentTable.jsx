import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";

const PaymentTable = ({ columns, tableData }) => {
  const [search, setSearch] = useState("");


  const filteredData = tableData.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="bg-white dark:bg-gray-800 p-4">
      <input
        type="text"
        placeholder="Search..."
        className="mb-4 p-2 border rounded w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <DataTable
        noHeader
        fixedHeader
        columns={columns}
        data={filteredData}
        pagination
        paginationRowsPerPageOptions={[10, 15, 25, 50, 100]}
        sortIcon={<ChevronDown size={10} />}
      />
    </div>
  );
};

export default PaymentTable;
