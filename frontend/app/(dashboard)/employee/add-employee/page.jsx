"use client";
import SelectInput from "@/components/ui-main/SelectInput";
import TextInput from "@/components/ui-main/TextInput";
import { Button } from "@/components/ui/button";
import { useGetRoleListQuery } from "@/store/features/roleSlice";
import { useRouter } from "next/navigation";
import React from "react";
import { Controller, useForm } from "react-hook-form";

function page() {
  const router = useRouter();
  const {
    register,
    getValues,
    setValue,
    formState: { errors },
    control,
  } = useForm();

  const options = [
    { id: "1", label: "Option One" },
    { id: "2", label: "Option Two" },
    { id: "3", label: "Option Three" },
  ];

  const { data: roleList } = useGetRoleListQuery();

  console.log("roleList", roleList);

  return (
    <>
      <form className="bg-gray-100 p-4">
        <div className="p-2 text-center border-b-2">
          <h2>Add Employee</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3  gap-2">
          <TextInput
            name="name"
            placeholder="Enter name"
            label={"Name"}
            register={register}
          />
          <TextInput
            name="email"
            placeholder="Enter email"
            label={"Email"}
            register={register}
          />
          <TextInput
            name="phone"
            type="number"
            placeholder="Enter phone number"
            label={"Phone"}
            register={register}
          />
          <TextInput
            name="salary"
            type="number"
            placeholder="Enter salary"
            label={"Salary"}
            register={register}
          />
          <Controller
            name="department"
            control={control}
            render={({ field }) => (
              <SelectInput
                label={"Department"}
                options={options}
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
                options={options}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select Role"
              />
            )}
          />
        </div>

        <div className="flex justify-between p-3 mt-5">
          <Button>Back</Button>
          <Button type="submit" variant="submit">
            Submit
          </Button>
        </div>
      </form>
    </>
  );
}

export default page;
