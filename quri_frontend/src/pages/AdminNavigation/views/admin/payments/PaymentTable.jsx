import React from "react";
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";

const PaymentTable = ({ columns, tableData }) => {
  return (
    <div className="bg-white dark:bg-gray-800">
      <DataTable
        noHeader
        fixedHeader
        columns={columns}
        data={tableData}
        pagination
        paginationRowsPerPageOptions={[10, 15, 25, 50, 100]}
        sortIcon={<ChevronDown size={10} />}
      />
    </div>
  );
};

export default PaymentTable;
