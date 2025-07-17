import { Employee } from "../models/index.js";
import { Role } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/AsyncHandler.js";

const createRole = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    throw new ApiError(400, "Name is required");
  }

  const role = await Role.create({
    name: name.toLowerCase(),
    description,
  });

  const createdRole = await Role.findById(role._id);

  if (!createdRole) {
    throw new ApiError(500, "Role not created");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdRole, "Role Created Successfully"));
});

const listRole = asyncHandler(async (req, res) => {
  const roles = await Role.find().select("-__v -updatedAt -createdAt");

  if (!roles || roles.length === 0) {
    throw new ApiError(404, "No roles found");
  }

  const count = roles.length;
  return res
    .status(200)
    .json(new ApiResponse(200, { count, roles }, "Roles fetched successfully"));
});

const getRoleById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const role = await Role.findById(id).select("-__v");

  if (!role) {
    throw new ApiError(404, "Role not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, role, "Role fetched successfully"));
});

const updateRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const updatedRole = await Role.findByIdAndUpdate(
    id,
    {
      $set: {
        name,
        description,
      },
    },
    {
      new: true, // returns updated doc
    }
  );

  if (!updatedRole) {
    throw new ApiError(404, "Role not found or not updated");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedRole, "Role updated successfully"));

  //     const updateFields = {};
  // if (name) updateFields.name = name.toLowerCase();
  // if (description) updateFields.description = description;

  // const updatedRole = await Role.findByIdAndUpdate(
  //   id,
  //   { $set: updateFields },
  //   { new: true }
  // );
});

const deleteRole = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const assignedEmployees = await Employee.find({ department: id });

  if (assignedEmployees.length > 0) {
    throw new ApiError(400, "Cannot delete role. It is assigned to employees.");
  }

  const deletedRole = await Role.findByIdAndDelete(id);

  if (!deletedRole) {
    throw new ApiError(404, "Role not found or not deleted");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedRole, "Role deleted successfully"));
});

export { createRole, listRole, getRoleById, updateRole, deleteRole };
