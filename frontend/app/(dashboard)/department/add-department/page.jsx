"use client";

import TextInput from "@/components/ui-main/TextInput";
import { Button } from "@/components/ui/button";
import employeeSchema from "@/schema/addEmployeeSchema";
import { useGetDepartmentListQuery } from "@/store/features/departmentSlice";
import {
  useAddEmployeeMutation,
  useGetEmployeeByIdQuery,
  useUpdateEmployeeMutation,
} from "@/store/features/employeeSlice";
import { useGetRoleListQuery } from "@/store/features/roleSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

function page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    register,
    getValues,
    setValue,
    formState: { errors },
    control,
    reset,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(employeeSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { data: roleList } = useGetRoleListQuery();

  console.log("roleList", roleList);

  const { data: departmentList } = useGetDepartmentListQuery();

  console.log("departmentList", departmentList);

  const id = searchParams.get("id");
  const mode = searchParams.get("mode");

  console.log("id", id, "mode", mode);

  const { data: empData } = useGetEmployeeByIdQuery(id, { skip: !id });
  const [addEmployee] = useAddEmployeeMutation();
  const [updatedEmployee] = useUpdateEmployeeMutation();

  console.log("empdata===>>", empData);

  const onsubmit = async (data) => {
    console.log("form submitted data is here", data);

    try {
      if (mode === "edit" && id) {
        const res = await updatedEmployee({
          id,
          updatedEmpData: data,
        }).unwrap();

        toast.success(res.message || "Employee updated successfully");
        router.push("/employee");
      } else {
        const res = await addEmployee(data).unwrap();

        toast.success(res.message || "Employee created successfully");
        router.push("/employee");
      }
    } catch (error) {
      toast.error(error?.data?.message || "An error occured");
    }
  };

  useEffect(() => {
    if (empData && mode === "edit") {
      reset(empData?.data);
    }

    setValue(
      "department",
      empData?.data?.department.map((dept) => dept?._id)
    );
    setValue("role", empData?.data?.role?._id);
  }, [empData, id]);

  console.log("form values", getValues(), "form errors", errors);

  return (
    <>
      <form className="bg-gray-100 p-4" onSubmit={handleSubmit(onsubmit)}>
        <div className="p-2 text-center border-b-2">
          <h1 className="font-bold text-2xl">
            {" "}
            {mode === "edit" ? "Update" : "Add"} Department
          </h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2  gap-2">
          <TextInput
            name="name"
            placeholder="Enter name"
            label={"Name"}
            register={register}
            error={errors.name}
            required={true}
          />
          <TextInput
            name="description"
            placeholder="Enter description"
            label={"Description"}
            register={register}
            error={errors.description}
            required={false}
          />
        </div>

        <div className="flex justify-between p-3 mt-5">
          <Button type="button" onClick={() => router.push("/department")}>
            {mode === "edit" ? "Cancel" : "Back"}
          </Button>
          <Button type="submit" variant="submit">
            {mode === "edit" ? "Update" : "Submit"}
          </Button>
        </div>
      </form>
    </>
  );
}

export default page;
