"use client";
import ReusableTable from "@/components/ui-main/Table";
import { Button } from "@/components/ui/button";
import { useGetDepartmentListQuery } from "@/store/features/departmentSlice";
import {
  useDeleteEmployeeMutation,
  useGetEmployeeListQuery,
} from "@/store/features/employeeSlice";
import { useGetRoleListQuery } from "@/store/features/roleSlice";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";

function page() {
  const router = useRouter();
  const { data: roleList, isLoading } = useGetRoleListQuery();
  const [deleteEmployee] = useDeleteEmployeeMutation();

  const roleData = roleList?.data?.roles;

  const handleDelete = async (id) => {
    console.log("selected id", id);

    try {
      const res = await deleteEmployee(id).unwrap();
      console.log("del res ---", res);

      if (res.success) {
        toast.success(res.message || "Employee deleted successfully");
      } else {
        toast.error("Failed to delete employee");
      }
    } catch (err) {
      console.error("Delete error", err);
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
      Header: "Description",
      accessor: "description",
    },

    {
      Header: "Actions",
      accessor: "actions",
      render: (value, row) => (
        <div className="flex gap-2">
          <Button
            className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
            onClick={() =>
              router.push(`/department/add-department?id=${row._id}&mode=edit`)
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
          <h1 className="text-2xl font-bold mb-6">Role Management</h1>
        </div>
        <div>
          <Button
            icon={PlusIcon}
            onClick={() => router.push("/department/add-department")}
          >
            Add Role
          </Button>
        </div>
      </div>

      <ReusableTable
        columns={columns}
        data={roleData}
        loading={isLoading}
        emptyMessage="No role found"
      />
    </div>
  );
}

export default page;
