"use client";
import ReusableTable from "@/components/ui-main/Table";
import { Button } from "@/components/ui/button";
import { useGetEmployeeListQuery } from "@/store/features/employeeSlice";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

function page() {
  const router = useRouter();
  const { data: employeeList, isLoading } = useGetEmployeeListQuery();

  const employeeData = employeeList?.data?.employee;

  const columns = [
    {
      Header: "ID",
      accessor: "_id",
      render: (value) => value.slice(-6), // Show last 6 characters
    },
    {
      Header: "Name",
      accessor: "name",
      render: (value) => value.charAt(0).toUpperCase() + value.slice(1),
    },
    {
      Header: "Email",
      accessor: "email",
    },
    {
      Header: "Phone",
      accessor: "phone",
    },
    {
      Header: "Salary",
      accessor: "salary",
      render: (value) => `₹${value.toLocaleString()}`,
    },
    {
      Header: "Actions",
      accessor: "actions",
      render: (value, row) => (
        <div className="flex gap-2">
          <Button
            className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
            onClick={() =>
              router.push(`/employee/add-employee?id=${row._id}&mode=edit`)
            }
          >
            Edit
          </Button>
          <Button
            className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
            onClick={() => alert(`Delete ${row.name}`)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-6">Employee Management</h1>
        </div>
        <div>
          <Button
            icon={PlusIcon}
            onClick={() => router.push("/employee/add-employee")}
          >
            Add Employee
          </Button>
        </div>
      </div>

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
