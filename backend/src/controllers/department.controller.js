import { Department } from "../models/index.js";
import { Employee } from "../models/emp.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/AsyncHandler.js";

const createDepartment = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    throw new ApiError(400, "Name is required");
  }

  const dept = await Department.create({
    name: name.toLowerCase(),
    description,
  });

  const createdDepartment = await Department.findById(dept._id);

  if (!createdDepartment) {
    throw new ApiError(500, "Department not created");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, createdDepartment, "Department Created Successfully")
    );
});

const listDepartment = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 2 } = req.query;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);

  const skip = (pageNum - 1) * limitNum;

  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const totalDepartments = await Department.countDocuments(query);

  const departments = await Department.find(query)
    .select("-__v")
    .skip(skip)
    .limit(limitNum);

    const totalPages = Math.ceil(totalDepartments/limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1

    const paginationInfo = {
      currentPage:pageNum,
      totalPages,
      totalDepartments,
      hasNextPage,
      hasPrevPage,
      limit:limitNum
    }

  const message =
    totalDepartments === 0
      ? search
        ? `No matching departments found for the keyword "${search}"`
        : "No departments found"
      : "Department list fetched successfully";

  return res.status(200).json(new ApiResponse(200, { departments,paginationInfo }, message));
});

const getDepartmentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const foundedDepartment = await Department.findById(id).select("-__v");

  if (!foundedDepartment) {
    throw new ApiError(404, "Department did not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, foundedDepartment, "Department founded successfully")
    );
});

const updateDepartment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const updatedDept = await Department.findByIdAndUpdate(
    id,
    {
      $set: {
        name: name.toLowerCase(),
        description,
      },
    },
    {
      new: true,
    }
  );

  if (!updatedDept) {
    throw new ApiError(500, "Can not update department");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedDept, "Department updated successfully"));
});

const deleteDepartment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const assignedEmployees = await Employee.find({ department: id });

  if (assignedEmployees.length > 0) {
    throw new ApiError(
      400,
      "Cannot delete department. It is assigned to employees."
    );
  }

  const deletedDept = await Department.findByIdAndDelete(id);

  if (!deletedDept) {
    throw new ApiError(500, "Can not delete department");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedDept, "Dpeartment deleted successfully"));
});

export {
  createDepartment,
  listDepartment,
  getDepartmentById,
  deleteDepartment,
  updateDepartment,
};
