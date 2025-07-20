"use client";
import ReusableTable from "@/components/ui-main/Table";
import { Button } from "@/components/ui/button";
import {
  useDeleteEmployeeMutation,
  useGetEmployeeListQuery,
} from "@/store/features/employeeSlice";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";

function page() {
  const router = useRouter();
  const { data: employeeList, isLoading } = useGetEmployeeListQuery();
  const [deleteEmployee] = useDeleteEmployeeMutation();

  const employeeData = employeeList?.data?.employee;

  const handleDelete = async (id) => {
    console.log("selected id", id);

    try {
      const res = await deleteEmployee(id).unwrap();
      console.log("del res ---", res);

      toast.success(res.message || "Employee deleted successfully");
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    }
  };

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
      Header: "Department",
      accessor: "department",
      render: (value) => value?.map((v) => v.name).join(", "),
    },
    {
      Header: "Role",
      accessor: "role",
      render: (value) => value.name,
    },
    {
      Header: "Salary",
      accessor: "salary",
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
            onClick={() => handleDelete(row?._id)}
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
