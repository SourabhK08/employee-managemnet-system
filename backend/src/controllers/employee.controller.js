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

  const createdEmployee = await Employee.findById(emp._id);

  if (!createdEmployee) {
    throw new ApiError(500, "Employee not created successfully");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, createdEmployee, "Employee created successfully")
    );
});

export { createEmployee };
