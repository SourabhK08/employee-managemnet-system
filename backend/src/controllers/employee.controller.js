import { Employee } from "../models/emp.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/AsyncHandler.js";

const createEmployee = asyncHandler(async (req, res) => {
  const { name, email, phone, salary, department, role } = req.body;

  if (name === "") {
    throw new ApiError(400, "Name is required");
  }
  if (email === "") {
    throw new ApiError(400, "Email is required");
  }
  if (phone === null) {
    throw new ApiError(400, "Phone is required");
  }
  if (salary === null) {
    throw new ApiError(400, "Salary is required");
  }
  if (department === "") {
    throw new ApiError(400, "Department is required");
  }
  if (role === "") {
    throw new ApiError(400, "Role is required");
  }

  const emp = await Employee.create({
    name: name.toLowerCase(),
    email,
    phone,
    salary,
    department,
    role,
  });

  console.log("Emp det ---", emp);

  const createdEmployee = await Employee.findById(emp._id)
    .populate({ path: "department", select: "name description" })
    .populate({ path: "role", select: "name description" });

  if (!createdEmployee) {
    throw new ApiError(500, "Employee not created successfully");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, createdEmployee, "Employee created successfully")
    );
});

const listEmployees = asyncHandler(async (req, res) => {
  const employee = await Employee.find()
    .select("-__v")
    .populate({ path: "department", select: "name description" })
    .populate({ path: "role", select: "name description" });

  if (!employee) {
    throw new ApiError(500, "Employee list not fetched");
  }

  const count = employee.length;

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { count, employee },
        "Employee list fetched successfully"
      )
    );
});

const getEmployeeById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const fetchedEmp = await Employee.findById(id)
    .select("-__v")
    .populate({ path: "department", select: "name description" })
    .populate({ path: "role", select: "name description" });

  if (!fetchedEmp) {
    throw new ApiError(500, "Employee data not fetched");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, fetchedEmp, "Employee data fetched successfully")
    );
});

const updateEmployee = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, salary, department, role } = req.body;

  const updatedEmp = await Employee.findByIdAndUpdate(
    id,
    {
      $set: {
        name: name.toLowerCase(),
        email,
        phone,
        salary,
        department,
        role,
      },
    },
    {
      new: true,
    }
  );

  if (!updatedEmp) {
    throw new ApiError(500, "Can not update employee");
  }

  return res
    .status(200)
    .json(200, updatedEmp, "Employee details updated successfully");
});

const deleteEmployee = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedEmp = await Employee.findByIdAndDelete(id).select("-__v");

  if (!deletedEmp) {
    throw new ApiError(500, "Can not delete employee");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedEmp, "Employee deleted successfully"));
});

export {
  createEmployee,
  listEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};
