"use client";
import ReactSelect from "react-select";
import SelectInput from "@/components/ui-main/SelectInput";
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
      role: "",
      department: [],
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
            {mode === "edit" ? "Update" : "Add"} Employee
          </h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3  gap-2">
          <TextInput
            name="name"
            placeholder="Enter name"
            label={"Name"}
            register={register}
            error={errors.name}
            required={true}
          />
          <TextInput
            name="email"
            placeholder="Enter email"
            label={"Email"}
            register={register}
            error={errors.email}
            required={true}
          />
          <TextInput
            name="phone"
            type="number"
            placeholder="Enter phone number"
            label={"Phone"}
            register={register}
            error={errors.phone}
            required={true}
          />
          <TextInput
            name="salary"
            type="number"
            placeholder="Enter salary"
            label={"Salary"}
            register={register}
            error={errors.salary}
            required={true}
          />

          <div className="w-full mt-5">
            <label className="form-label" htmlFor="department">
              Select Department <span style={{ color: "red" }}>*</span>
            </label>
            <Controller
              name="department"
              control={control}
              render={({ field }) => (
                <ReactSelect
                  {...field}
                  options={
                    departmentList?.data?.dept?.map((dept) => ({
                      value: dept._id,
                      label: dept.name,
                    })) || []
                  }
                  placeholder="Select departments"
                  className="react-select"
                  classNamePrefix="select"
                  id="department"
                  isMulti={true}
                  closeMenuOnSelect={false}
                  value={
                    departmentList?.data?.dept
                      ?.filter((dept) => field.value?.includes(dept._id))
                      .map((dept) => ({
                        value: dept._id,
                        label: dept.name,
                      })) || []
                  }
                  onChange={(selectedOptions) => {
                    // Send only the array of selected values (_id)
                    const selectedValues = selectedOptions.map(
                      (opt) => opt.value
                    );
                    field.onChange(selectedValues);
                  }}
                  styles={{
                    control: (provided, state) => ({
                      ...provided,
                      backgroundColor:
                        state.isFocused || state.menuIsOpen
                          ? "transparent"
                          : "transparent",
                      color:
                        state.isFocused || state.menuIsOpen
                          ? "black"
                          : "inherit",
                      borderRadius: "8px",
                      paddingTop: "4px",
                      paddingBottom: "4px",
                      borderColor: "#d1d5db",
                      boxShadow: "none",
                      outline: "none",
                      "&:hover": {
                        borderColor: "#d1d5db",
                      },
                    }),
                    menu: (provided) => ({
                      ...provided,
                      borderRadius: "8px",
                      paddingTop: "5px",
                      paddingBottom: "5px",
                      backgroundColor: "white",
                      color: "black",
                    }),
                    multiValue: (provided) => ({
                      ...provided,
                      backgroundColor: "#e2e8f0", // Tailwind's gray-200
                      color: "black",
                    }),
                    multiValueLabel: (provided) => ({
                      ...provided,
                      color: "black",
                    }),
                    multiValueRemove: (provided) => ({
                      ...provided,
                      color: "black",
                      ":hover": {
                        backgroundColor: "#cbd5e0", // Tailwind's gray-300
                        color: "black",
                      },
                    }),
                    placeholder: (provided) => ({
                      ...provided,
                      color: "#a0aec0", // Tailwind's gray-400
                    }),
                  }}
                />
              )}
            />
            {errors.department && (
              <p className="text-red-500 text-sm mt-1">
                {errors.department.message}
              </p>
            )}
          </div>

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
                required={true}
                placeholder="Select Role"
                error={errors.role}
              />
            )}
          />
        </div>

        <div className="flex justify-between p-3 mt-5">
          <Button type="button" onClick={() => router.push("/employee")}>
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
