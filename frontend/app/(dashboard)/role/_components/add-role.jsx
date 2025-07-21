"use client";
import React, { useEffect } from "react";
import TextInput from "@/components/ui-main/TextInput";
import { Button } from "@/components/ui/button";
import { useGetPermissionListQuery } from "@/store/features/permissionSlice";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import roleSchema from "@/schema/addRoleSchema";
import {
  useAddRoleMutation,
  useGetRoleByIdQuery,
  useUpdateRoleMutation,
} from "@/store/features/roleSlice";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";

export default function AddRoleForm() {
  const router = useRouter();
  const [addRole] = useAddRoleMutation();
  const [updateRole] = useUpdateRoleMutation();

  const searchParams = useSearchParams();

  const id = searchParams.get("id");
  const mode = searchParams.get("mode");

  const { data: selectedRole } = useGetRoleByIdQuery(id, {
    skip: !id || mode !== "edit",
  });

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

  const onSubmit = async (data) => {
    try {
      if (mode === "edit") {
        const res = await updateRole({
          id,
          updatedRole: data,
        }).unwrap();

        toast.success(res.message, "Role updated successfully");
        router.push("/role");
      } else {
        const res = await addRole(data).unwrap();
        toast.success(res.message, "Role created successfully");
        router.push("/role");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (mode === "edit" && id) {
      reset({
        name: selectedRole?.data?.name,
        description: selectedRole?.data?.description,
      });
    }
  }, [selectedRole, mode]);

  const { data: permissionList } = useGetPermissionListQuery();
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-100 p-4">
      <div className="p-2 text-center border-b-2">
        <h1 className="font-bold text-2xl">
          {" "}
          {mode === "edit" ? "Update" : "Add"} Role
        </h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <TextInput
          name="name"
          label="Name"
          placeholder="Enter role name"
          register={register}
          error={errors.name}
          required
        />
        <TextInput
          name="description"
          label="Description"
          placeholder="Enter role description"
          register={register}
          error={errors.description}
        />
      </div>
      <div className="flex justify-between pt-4">
        <Button type="button" onClick={() => router.push("/role")}>
          Cancel
        </Button>
        <Button type="submit" variant="submit">
          {mode === "edit" ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}
