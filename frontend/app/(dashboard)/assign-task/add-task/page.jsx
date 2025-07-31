"use client";
import React, { useEffect, useState } from "react";
import TextInput from "@/components/ui-main/TextInput";
import { Button } from "@/components/ui/button";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import roleSchema from "@/schema/addRoleSchema";
import {
  useAddRoleMutation,
  useGetRoleByIdQuery,
  useUpdateRoleMutation,
} from "@/store/features/roleSlice";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";

import usePermission from "@/hooks/useCheckPermission";
import SelectInput from "@/components/ui-main/SelectInput";
import {
  useGetEnumListQuery,
  useGetSubordinatesListQuery,
} from "@/store/features/employeeSlice";
import { useSelector } from "react-redux";
import { PlusIcon } from "lucide-react";

export default function AddTaskForm() {
  const hasAddRolePermisssion = usePermission("ADD_ROLE");

  const router = useRouter();
  useEffect(() => {
    if (!hasAddRolePermisssion) {
      router.push("/dashboard");
    }
  }, []);
  const [addRole] = useAddRoleMutation();
  const [updateRole] = useUpdateRoleMutation();

  const { data: enumData } = useGetEnumListQuery();
  const { data: subordinatesList } = useGetSubordinatesListQuery();

  const user = useSelector((state) => state.user.user);

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
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(roleSchema),
    defaultValues: {
      taskDescription: [
        {
          description: "",
        },
      ],
      assignedBy: user.name,
      assignedTo: "",
      startDate: "",
      endDate: "",
      status: "",
      priority: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "taskDescription",
  });

  const onSubmit = async (data) => {
    try {
      if (mode === "edit") {
        const res = await updateRole({
          id,
          updatedRole: data,
        }).unwrap();

        toast.success(res.message || "Role updated successfully");
        router.push("/role");
      } else {
        const res = await addRole(data).unwrap();
        toast.success(res.message || "Role created successfully");
        router.push("/role");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (mode === "edit" && id && selectedRole?.data) {
      reset({
        name: selectedRole.data.name,
        description: selectedRole.data.description,
        permissions: selectedRole.data.permissions || [],
      });
    }
  }, [selectedRole, mode]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-100 p-4">
      <div className="p-2 text-center border-b-2">
        <h1 className="font-bold text-2xl">
          {mode === "edit" ? "Update" : "Add"} Task
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <TextInput
          name="assignedBy"
          label={"Assign By"}
          register={register}
          error={errors.assignedBy}
          required={true}
          disabled={true}
        />
        <Controller
          name="assignedTo"
          control={control}
          render={({ field }) => (
            <SelectInput
              label={"Assign To"}
              options={(subordinatesList?.data || []).map((subordinate) => ({
                id: subordinate._id,
                label: subordinate.name,
              }))}
              value={field.value}
              onChange={field.onChange}
              required={true}
              placeholder="Select subordinate"
              error={errors.assignedTo}
            />
          )}
        />

        <div className="col-span-2 mt-3">
          <div className="flex justify-between items-center ">
            <h3 className="font-semibold ml-3">Tasks</h3>
            <Button
              type="button"
              onClick={() => append({ description: "" })}
              icon={PlusIcon}
            >
              Add Task
            </Button>
          </div>

          <div className="">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-2">
                <div className="flex-1">
                  <TextInput
                    name={`taskDescription.${index}.description`}
                    // label={`Description ${index + 1}`}
                    register={register}
                    error={errors?.taskDescription?.[index]?.description}
                    required={true}
                    placeholder={`Enter task ${index + 1} description...`}
                  />
                </div>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded mt-6"
                  >
                    ×
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <SelectInput
              label={"Status"}
              options={
                Object.entries(enumData?.data?.taskStatus || {}).map(
                  ([id, label]) => ({
                    id,
                    label,
                  })
                ) || []
              }
              value={field.value}
              onChange={field.onChange}
              required={true}
              placeholder="Select Status"
              error={errors.status}
            />
          )}
        />
        <Controller
          name="priority"
          control={control}
          render={({ field }) => (
            <SelectInput
              label={"Priority"}
              options={
                Object.entries(enumData?.data?.taskPriority || {}).map(
                  ([id, label]) => ({
                    id,
                    label,
                  })
                ) || []
              }
              value={field.value}
              onChange={field.onChange}
              required={true}
              placeholder="Select priority"
              error={errors.priority}
            />
          )}
        />
        <TextInput
          name="startDate"
          label={"Start Date"}
          type="date"
          register={register}
          error={errors.startDate}
          required={true}
        />
        <TextInput
          name="endDate"
          label={"End Date"}
          type="date"
          register={register}
          error={errors.endDate}
          required={true}
        />
      </div>

      <div className="flex justify-between pt-6">
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
