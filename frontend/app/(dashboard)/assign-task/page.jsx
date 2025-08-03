"use client";

import ReusableTable from "@/components/ui-main/Table";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import usePermission from "@/hooks/useCheckPermission";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useDeleteTaskMutation,
  useGetAssignedTaskListQuery,
} from "@/store/features/taskSlice";
import { formatDate, StatusBadge } from "@/utils";

function page() {
  const canAssignTask = usePermission("ADD_ASSIGN_TASK");
  const canListAssignedTask = usePermission("LIST_ASSIGN_TASK");
  const canEditAssignedTask = usePermission("UPDATE_ASSIGN_TASK");
  const canDeleteAssignedTask = usePermission("DELETE_ASSIGN_TASK");

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

  const [deleteAssignedTask] = useDeleteTaskMutation();

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
      const res = await deleteAssignedTask(id).unwrap();
      console.log("del res ---", res);

      if (res.success) {
        toast.success(res.message || "Assigned Task deleted successfully");
      } else {
        toast.error("Failed to delete assigned task");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
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
      render: (val) => formatDate(val),
    },
    {
      Header: "End Date",
      accessor: "endDate",
      render: (val) => formatDate(val),
    },
    {
      Header: "Status",
      accessor: "status",
      render: (val) => <StatusBadge status={val} />,
    },
  ];

  if (canEditAssignedTask || canDeleteAssignedTask) {
    columns.push({
      Header: "Actions",
      accessor: "actions",
      render: (value, row) => (
        <div className="flex gap-2">
          {canEditAssignedTask && (
            <Button
              className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
              onClick={() =>
                router.push(`assign-task/add-task?id=${row?._id}&mode=edit`)
              }
            >
              Edit
            </Button>
          )}
          {canDeleteAssignedTask && (
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
        {canAssignTask && (
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

      {canListAssignedTask ? (
        <ReusableTable
          columns={columns}
          data={assignedTaskList}
          loading={isLoading}
          emptyMessage={assignList?.message || "No assigned task found"}
          searchValue={searchTerm}
          searchBarPlaceholder="Search by task description"
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
