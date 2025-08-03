"use client";
import React, { useEffect, useState } from "react";
import TextInput from "@/components/ui-main/TextInput";
import { Button } from "@/components/ui/button";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
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
import {
  useAddTaskMutation,
  useGetTaskByIdQuery,
  useUpdateTaskMutation,
} from "@/store/features/taskSlice";
import addTaskSchema from "@/schema/assignTaskSchema";
import { formatDate } from "@/utils";

export default function AddTaskForm() {
  const hasAssignTaskPermisssion = usePermission("ADD_ASSIGN_TASK");

  const router = useRouter();
  useEffect(() => {
    if (!hasAssignTaskPermisssion) {
      router.push("/dashboard");
    }
  }, []);
  const [addTask] = useAddTaskMutation();
  const [updateTask] = useUpdateTaskMutation();

  const { data: enumData } = useGetEnumListQuery();
  const { data: subordinatesList } = useGetSubordinatesListQuery();

  const user = useSelector((state) => state.user.user);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const mode = searchParams.get("mode");

  const { data: taskDataById } = useGetTaskByIdQuery(id, {
    skip: !id || mode !== "edit",
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addTaskSchema),
    defaultValues: {
      taskDescription: [
        {
          description: "",
        },
      ],
      assignedBy: "",
      assignedTo: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: null,
      status: "Pending",
      priority: "Medium",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "taskDescription",
  });

  useEffect(() => {
    if (user?._id) {
      setValue("assignedBy", user._id);
    }
  }, [user, setValue]);

  console.log("form values", getValues(), "form errors", errors);

  const onSubmit = async (data) => {
    console.log("form data--->", data);

    try {
      if (mode === "edit") {
        const res = await updateTask({
          id,
          updatedTask: data,
        }).unwrap();

        toast.success(res.message || "Task updated successfully");
        router.push("/assign-task");
      } else {
        const res = await addTask(data).unwrap();
        toast.success(res.message || "Task assigned successfully");
        router.push("/assign-task");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    } finally {
      reset();
    }
  };

  useEffect(() => {
    if (mode === "edit" && id && taskDataById?.data) {
      reset({
        assignedTo: taskDataById?.data.assignedTo,
        taskDescription: taskDataById?.data.taskDescription || {},
        status: taskDataById?.data.status,
        priority: taskDataById?.data.priority,
        startDate: formatDate(taskDataById?.data.startDate),
        endDate: formatDate(taskDataById?.data.endDate),
      });
    }
  }, [taskDataById, mode]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-100 p-4">
      <div className="p-2 text-center border-b-2">
        <h1 className="font-bold text-2xl">
          {mode === "edit" ? "Update Assigned" : "Assign"} Task
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <TextInput
          name="assignedBy"
          label={"Assign By"}
          // register={register}
          error={errors.assignedBy}
          required={true}
          value={user.name}
          disabled={true}
        />
        <input type="hidden" {...register("assignedBy")} value={user._id} />
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
            <h3 className="font-semibold ml-3">
              Tasks <span className="text-red-500">*</span>{" "}
            </h3>
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
                    id: label,
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
                    id: label,
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
        <Button type="button" onClick={() => router.push("/assign-task")}>
          Cancel
        </Button>
        <Button type="submit" variant="submit">
          {mode === "edit" ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}
