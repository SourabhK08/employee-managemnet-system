
import React from "react";
import TextInput from "@/components/ui-main/TextInput";
import { Button } from "@/components/ui/button";

export default function AddRoleForm({ register, errors, onSubmit, onCancel, mode }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <TextInput
        name="name"
        label="Name"
        placeholder="Enter department name"
        register={register}
        error={errors.name}
        required
      />
      <TextInput
        name="description"
        label="Description"
        placeholder="Enter description"
        register={register}
        error={errors.description}
      />
      <div className="flex justify-between pt-4">
        <Button type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="submit">
          {mode === "edit" ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}
