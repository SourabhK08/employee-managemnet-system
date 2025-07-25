"use client";
import React, { useEffect, useState } from "react";
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
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";

const groupByModule = (permissions) => {
  const grouped = {};
  permissions.forEach((perm) => {
    const parts = perm.key.split("_");
    const module = parts.slice(1).join("_");
    if (!grouped[module]) {
      grouped[module] = [];
    }
    grouped[module].push(perm);
  });
  return grouped;
};

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
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(roleSchema),
    defaultValues: {
      name: "",
      description: "",
      permissions: [],
    },
  });

  const selectedPermissions = watch("permissions");
  const [internalPermissions, setInternalPermissions] = useState([]);

  const handleTogglePermission = (permKey) => {
    const updated = selectedPermissions.includes(permKey)
      ? selectedPermissions.filter((p) => p !== permKey)
      : [...selectedPermissions, permKey];

    setValue("permissions", updated);
  };

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

  const { data: permissionList } = useGetPermissionListQuery();

  const groupedPermissions = groupByModule(permissionList?.data || []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-100 p-4">
      <div className="p-2 text-center border-b-2">
        <h1 className="font-bold text-2xl">
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

      <div className="mt-6">
        <h2 className="font-semibold text-lg mb-2">Permissions</h2>
        <Accordion type="multiple" className="w-full">
          {Object.entries(groupedPermissions).map(([module, perms]) => (
            <AccordionItem key={module} value={module} className={`mb-3`}>
              <AccordionTrigger className={` p-2 `}>
                {module.replace(/_/g, " ").toUpperCase()}
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-4 pl-2 mt-2">
                  {perms.map((perm) => (
                    <label key={perm.key} className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedPermissions.includes(perm.key)}
                        onCheckedChange={() => handleTogglePermission(perm.key)}
                        className={`cursor-pointer`}
                      />
                      <span className="capitalize">
                        {perm.value.replace(/-/g, " ")}
                      </span>
                    </label>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        {errors.permissions && (
          <p className="text-sm text-red-600 mt-1">
            {errors.permissions.message}
          </p>
        )}
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
