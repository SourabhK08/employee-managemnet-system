"use client";

import React, { useEffect, useState } from "react";
import ReusableTable from "@/components/ui-main/Table";

import { Button } from "@/components/ui/button";

import { PlusIcon } from "lucide-react";
import { toast } from "react-toastify";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import SheetDrawer from "@/components/ui-main/Sheet";
import deptSchema from "@/schema/addDepartmentSchema copy";
import {
  useAddDepartmentMutation,
  useDeleteDepartmentMutation,
  useGetDepartmentListQuery,
  useUpdateDepartmentMutation,
} from "@/store/features/departmentSlice";
import AddDepartmentForm from "./_components/add-department";
import usePermission from "@/hooks/useCheckPermission";

function DepartmentPage() {
  const canAddDept = usePermission("ADD_DEPARTMENT");
  const canListDept = usePermission("LIST_DEPARTMENT");
  const canEditDept = usePermission("UPDATE_DEPARTMENT");
  const canDeleteDept = usePermission("DELETE_DEPARTMENT");

  const [searchTerm, setsearchTerm] = useState("");
  const {
    data: departmentList,
    isLoading,
    refetch,
  } = useGetDepartmentListQuery({
    search: searchTerm,
  });
  const [addDepartment] = useAddDepartmentMutation();
  const [updateDepartment] = useUpdateDepartmentMutation();
  const [deleteDepartment] = useDeleteDepartmentMutation();

  const deptData = departmentList?.data?.departments;

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedDept, setSelectedDept] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(deptSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (mode === "edit" && selectedDept) {
      reset({
        name: selectedDept.name,
        description: selectedDept.description,
      });
    } else {
      reset({
        name: "",
        description: "",
      });
    }
  }, [selectedDept, mode, isSheetOpen]);

  const handleDelete = async (id) => {
    try {
      const res = await deleteDepartment(id).unwrap();
      if (res.success) {
        toast.success(res.message || "Deleted successfully");
        refetch();
      } else {
        toast.error("Failed to delete");
      }
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  const onSubmit = async (data) => {
    try {
      if (mode === "edit") {
        const res = await updateDepartment({
          id: selectedDept._id,
          updatedDept: data,
        }).unwrap();
        toast.success(res.message || "Department updated");
      } else {
        const res = await addDepartment(data).unwrap();
        toast.success(res.message || "Department added");
      }

      setIsSheetOpen(false);
      setSelectedDept(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Error occurred");
    }
  };

  const openAddSheet = () => {
    setMode("add");
    setSelectedDept(null);
    setIsSheetOpen(true);
  };

  const openEditSheet = (dept) => {
    setMode("edit");
    setSelectedDept(dept);
    setIsSheetOpen(true);
  };

  const columns = [
    {
      Header: "ID",
      accessor: "_id",
      render: (value) => value.slice(-6),
    },
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Description",
      accessor: "description",
    },
  ];

  if (canEditDept || canDeleteDept) {
    columns.push({
      Header: "Actions",
      accessor: "actions",
      render: (value, row) => (
        <div className="flex gap-2">
          {canEditDept && (
            <Button
              className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
              onClick={() => openEditSheet(row)}
            >
              Edit
            </Button>
          )}
          {canDeleteDept && (
            <Button
              className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
              onClick={() => handleDelete(row._id)}
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
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Department Management</h1>
        {canAddDept && (
          <Button icon={PlusIcon} onClick={openAddSheet}>
            Add Department
          </Button>
        )}
      </div>

      {canListDept ? (
        <ReusableTable
          columns={columns}
          data={deptData}
          loading={isLoading}
          emptyMessage={departmentList?.message || "No department found"}
          searchBarPlaceholder="Search by name or description"
          searchValue={searchTerm}
          onSearchChange={(val) => setsearchTerm(val)}
        />
      ) : (
        <section>
          <div>You do not have permission to view this section.</div>
        </section>
      )}

      <SheetDrawer
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        title={`${mode === "edit" ? "Edit" : "Add"} Department`}
        size="md"
      >
        <AddDepartmentForm
          register={register}
          errors={errors}
          onSubmit={handleSubmit(onSubmit)}
          onCancel={() => setIsSheetOpen(false)}
          mode={mode}
        />
      </SheetDrawer>
    </div>
  );
}

export default DepartmentPage;
