"use client";
import SheetDrawer from "@/components/ui-main/Sheet";
import ReusableTable from "@/components/ui-main/Table";
import { Button } from "@/components/ui/button";
import roleSchema from "@/schema/addRoleSchema";

import { useAddRoleMutation, useGetRoleListQuery, useUpdateRoleMutation } from "@/store/features/roleSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import AddRoleForm from "./_components/add-role";

function page() {
 
  const { data: roleList, isLoading } = useGetRoleListQuery();
  const [addRole] = useAddRoleMutation()
  const [updateRole] = useUpdateRoleMutation()

  const roleData = roleList?.data?.roles;
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(roleSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const [isSheetOpen,setIsSheetOpen] = useState(false)
  const [mode,setMode] = useState('add')
  const [selectedRole,setSelectedRole] = useState(null)

  const openAddSheet = () => {
    setMode('add')
    setIsSheetOpen(true)
    setSelectedRole(null)
  }

  const openEditSheet = (role) => {
    setMode('edit')
    setIsSheetOpen(true)
    setSelectedRole(role)
  }

  const onSubmit = async data => {
    try {
      if(mode === 'edit'){
        const res = await updateRole({
          id:selectedRole._id,
          updatedRole:data
        }).unwrap();

        toast.success(res.message,'Role updated successfully')
      } else{
        const res = await addRole(data).unwrap();
        toast.success(res.message,'Role created successfully')
      }

      setIsSheetOpen(false)
      setSelectedRole(null)
      
    } catch (error) {
      toast.error(error?.data?.message || 'Something went wrong')
    }
    
  }

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

    useEffect(() => {
      if (mode === "edit" && selectedRole) {
        reset({
          name: selectedRole.name,
          description: selectedRole.description,
        });
      } else {
        reset({
          name: "",
          description: "",
        });
      }
    }, [selectedRole, mode, isSheetOpen]);

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
              openEditSheet(row)
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
            onClick={openAddSheet}
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

      <SheetDrawer
      isOpen={isSheetOpen}
      onClose={() => setIsSheetOpen(false)}
      title={`${mode === 'edit' ? 'Update' : 'Add'} Role`}
      size="md"
      >
        <AddRoleForm
        register={register}
        errors={errors}
        mode={mode}
        onCancel={() => setIsSheetOpen(false)}
        onSubmit={handleSubmit(onSubmit)}
        />
      </SheetDrawer>
    </div>
  );
}

export default page;
