'use client'
import ReusableTable from "@/components/ui-main/Table";
import { useGetEmployeeListQuery } from "@/store/features/employeeSlice";
import React from "react";

function page() {

  const {data:employeeList,isLoading} = useGetEmployeeListQuery()

  const employeeData = employeeList?.data?.employee

const columns = [
    {
      Header: 'ID',
      accessor: '_id',
      render: (value) => value.slice(-6) // Show last 6 characters
    },
    {
      Header: 'Name',
      accessor: 'name',
      render: (value) => value.charAt(0).toUpperCase() + value.slice(1)
    },
    {
      Header: 'Email',
      accessor: 'email'
    },
    {
      Header: 'Phone',
      accessor: 'phone'
    },
    {
      Header: 'Salary',
      accessor: 'salary',
      render: (value) => `₹${value.toLocaleString()}`
    },
    {
      Header: 'Actions',
      accessor: 'actions',
      render: (value, row) => (
        <div className="flex gap-2">
          <button 
            className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
            onClick={() => alert(`Edit ${row.name}`)}
          >
            Edit
          </button>
          <button 
            className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
            onClick={() => alert(`Delete ${row.name}`)}
          >
            Delete
          </button>
        </div>
      )
    }
  ];

   return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Employee Management</h1>
      
      <ReusableTable
        columns={columns} 
        data={employeeData}
        loading={isLoading}
        emptyMessage="No employees found"
      />
    </div>
  );
}

export default page;
