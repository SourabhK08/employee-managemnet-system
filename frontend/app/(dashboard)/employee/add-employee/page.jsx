"use client";
import SelectInput from "@/components/ui-main/SelectInput";
import TextInput from "@/components/ui-main/TextInput";
import { Button } from "@/components/ui/button";
import employeeSchema from "@/schema/addEmployeeSchema";
import { useGetDepartmentListQuery } from "@/store/features/departmentSlice";
import { useGetEmployeeByIdQuery } from "@/store/features/employeeSlice";
import { useGetRoleListQuery } from "@/store/features/roleSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { Controller, useForm } from "react-hook-form";

function page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    register,
    getValues,
    setValue,
    formState: { errors },
    control,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(employeeSchema),
    defaultValues: {
      role: "",
      department: "",
      name: "",
      email: "",
      phone: null,
      salary: null,
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

  console.log("empdata===>>", empData);

  const onsubmit = async (data) => {
    console.log("form submitted data is here", data);
  };

  console.log("form values", getValues(), "form errors", errors);

  return (
    <>
      <form className="bg-gray-100 p-4" onSubmit={handleSubmit(onsubmit)}>
        <div className="p-2 text-center border-b-2">
          <h2>Add Employee</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3  gap-2">
          <TextInput
            name="name"
            placeholder="Enter name"
            label={"Name"}
            register={register}
            error={errors.name}
          />
          <TextInput
            name="email"
            placeholder="Enter email"
            label={"Email"}
            register={register}
            error={errors.email}
          />
          <TextInput
            name="phone"
            type="number"
            placeholder="Enter phone number"
            label={"Phone"}
            register={register}
            error={errors.phone}
          />
          <TextInput
            name="salary"
            type="number"
            placeholder="Enter salary"
            label={"Salary"}
            register={register}
            error={errors.salary}
          />
          <Controller
            name="department"
            control={control}
            render={({ field }) => (
              <SelectInput
                label={"Department"}
                options={
                  departmentList?.data?.dept.map((dept) => ({
                    id: dept._id,
                    label: dept.name,
                  })) || []
                }
                value={field.value}
                onChange={field.onChange}
                placeholder="Select Department"
              />
            )}
          />
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <SelectInput
                label={"Role"}
                options={
                  roleList?.data?.roles?.map((role) => ({
                    id: role._id,
                    label: role.name,
                  })) || []
                }
                value={field.value}
                onChange={field.onChange}
                placeholder="Select Role"
              />
            )}
          />
        </div>

        <div className="flex justify-between p-3 mt-5">
          <Button onClick={() => router.push("/employee")}>Back</Button>
          <Button type="submit" variant="submit">
            Submit
          </Button>
        </div>
      </form>
    </>
  );
}

export default page;
