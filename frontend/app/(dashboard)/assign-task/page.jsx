"use client";

import ReusableTable from "@/components/ui-main/Table";
import { Button } from "@/components/ui/button";
import {
  useDeleteRoleMutation,
  useGetassignListQuery,
} from "@/store/features/roleSlice";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import usePermission from "@/hooks/useCheckPermission";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetAssignedTaskListQuery } from "@/store/features/taskSlice";

function page() {
  const canAddRole = usePermission("ADD_ROLE");
  const canListRole = usePermission("LIST_ROLE");
  const canEditRole = usePermission("UPDATE_ROLE");
  const canDeleteRole = usePermission("DELETE_ROLE");

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 2;

  const debouncedSearch = useDebounce(searchTerm, 500);

  const router = useRouter();
  const { data: assignList, isLoading } = useGetAssignedTaskListQuery({
    search: debouncedSearch,
    page,
    limit,
  });

  const [deleteRole] = useDeleteRoleMutation();

  const assignedTaskList = assignList?.data?.tasks || {};
  console.log("assignedTaskList", assignedTaskList);

  const totalCount = assignList?.data?.totalCount;
  const totalPages = Math.ceil(totalCount / limit);

  console.log("assignList", assignList);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleDelete = async (id) => {
    console.log("selected id", id);

    try {
      const res = await deleteRole(id).unwrap();
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
      Header: "Assigned To",
      accessor: "assignedTo",
      render: (_, row) => row?.assignedTo?.name || "N/A",
    },
    {
      Header: "Description",
      accessor: "taskDescription",
      render: (_, row) =>
        row?.taskDescription?.map((desc) => desc.description).join(", "),
    },
    {
      Header: "Start Date",
      accessor: "startDate",
    },
    {
      Header: "End Date",
      accessor: "endDate",
    },
    {
      Header: "Status",
      accessor: "status",
    },
  ];

  if (canEditRole || canDeleteRole) {
    columns.push({
      Header: "Actions",
      accessor: "actions",
      render: (value, row) => (
        <div className="flex gap-2">
          {canEditRole && (
            <Button
              className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
              onClick={() =>
                router.push(`role/add-role?id=${row?._id}&mode=edit`)
              }
            >
              Edit
            </Button>
          )}
          {canDeleteRole && (
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
          <h1 className="text-2xl font-bold mb-6">Assigned Task Management</h1>
        </div>
        {canAddRole && (
          <div>
            <Button
              icon={PlusIcon}
              onClick={() => router.push("assign-task/add-task")}
            >
              Assign Task
            </Button>
          </div>
        )}
      </div>

      {canListRole ? (
        <ReusableTable
          columns={columns}
          data={assignedTaskList}
          loading={isLoading}
          emptyMessage={assignList?.message || "No role found"}
          searchValue={searchTerm}
          searchBarPlaceholder="Search by name"
          onSearchChange={(val) => setSearchTerm(val)}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
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
