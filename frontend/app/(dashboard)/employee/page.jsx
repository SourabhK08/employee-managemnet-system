"use client";
import ReusableTable from "@/components/ui-main/Table";
import { Button } from "@/components/ui/button";
import usePermission from "@/hooks/useCheckPermission";
import {
  useDeleteEmployeeMutation,
  useGetEmployeeListQuery,
} from "@/store/features/employeeSlice";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

function page() {
  const router = useRouter();
  const canAddEmployee = usePermission("ADD_EMPLOYEE");
  const canListEmployee = usePermission("LIST_EMPLOYEE");
  const canEditEmployee = usePermission("UPDATE_EMPLOYEE");
  const canDeleteEmployee = usePermission("DELETE_EMPLOYEE");

  const [searchTerm, setsearchTerm] = useState("");
  const { data: employeeList, isLoading } = useGetEmployeeListQuery({
    search: searchTerm,
  });
  const [deleteEmployee] = useDeleteEmployeeMutation();

  const employeeData = employeeList?.data?.employees;

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
      render: (value) => value?.name || "---",
    },
    {
      Header: "Salary",
      accessor: "salary",
    },
  ];

  if (canEditEmployee || canDeleteEmployee) {
    columns.push({
      Header: "Actions",
      accessor: "actions",
      render: (value, row) => (
        <div className="flex gap-2">
          {canEditEmployee && (
            <Button
              className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
              onClick={() =>
                router.push(`/employee/add-employee?id=${row._id}&mode=edit`)
              }
            >
              Edit
            </Button>
          )}
          {canDeleteEmployee && (
            <Button
              className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
              onClick={() => handleDelete(row?._id)}
            >
              Delete
            </Button>
          )}
        </div>
      ),
    });
  }

  return (
    <div className="p-6 bg-gray-100">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-6">Employee Management</h1>
        </div>
        {canAddEmployee && (
          <div>
            <Button
              icon={PlusIcon}
              onClick={() => router.push("/employee/add-employee")}
            >
              Add Employee
            </Button>
          </div>
        )}
      </div>

      {canListEmployee ? (
        <ReusableTable
          columns={columns}
          data={employeeData}
          loading={isLoading}
          emptyMessage={employeeList?.message || "No employees found"}
          searchBarPlaceholder="Search by name or email"
          searchValue={searchTerm}
          onSearchChange={(val) => setsearchTerm(val)}
        />
      ) : (
        <section>
          <div>You do not have permission to view this section.</div>
        </section>
      )}
    </div>
  );
}

export default page;
