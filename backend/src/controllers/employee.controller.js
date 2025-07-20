import { Employee } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/AsyncHandler.js";

const generateAccessAndRefreshToken = async (id) => {
  try {
    const employee = await Employee.findById(id);

    const accessToken = employee.generateAccessToken();
    const refreshToken = employee.generateRefreshToken();

    employee.refreshToken = refreshToken;
    await employee.save({
      validateBeforeSave: false,
    });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong in genrating tokens");
  }
};

const options = {
  httpOnly: true,
  secure: true,
};

const createEmployee = asyncHandler(async (req, res) => {
  const { name, email, phone, salary, department, role, password } = req.body;

  if (name === "") {
    throw new ApiError(400, "Name is required");
  }
  if (email === "") {
    throw new ApiError(400, "Email is required");
  }
  if (password === "") {
    throw new ApiError(400, "Password is required");
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

  const exsistingEmployee = await Employee.findOne({
    email: email.toLowerCase(),
  });

  if (exsistingEmployee) {
    throw new ApiError(400, "Email already exists, Please login!");
  }

  const emp = await Employee.create({
    name: name.toLowerCase(),
    email: email.toLowerCase(),
    password,
    phone,
    salary,
    department,
    role,
  });

  console.log("Emp details ---", emp);

  const createdEmployee = await Employee.findById(emp._id)
    .select("-refreshToken")
    .populate({ path: "department", select: "name description" })
    .populate({ path: "role", select: "name description" });

  if (!createdEmployee) {
    throw new ApiError(500, "Employee not created successfully");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(200, createdEmployee, "Employee created successfully")
    );
});

const loginEmployee = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log("email--", email);
  console.log("password--", password);

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  const employeeFoundInDb = await Employee.findOne({
    email,
  });

  if (!employeeFoundInDb) {
    throw new ApiError(404, "Email does not exists");
  }

  const isPasswordValid = await employeeFoundInDb.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Password is incorrect");
  }

  console.log("isPasswordValid", isPasswordValid);

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    employeeFoundInDb._id
  );

  const loggedInEmployee = await Employee.findById(
    employeeFoundInDb._id
  ).select("-password -refreshToken -__v");

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          employee: loggedInEmployee,
          refreshToken,
          accessToken,
        },
        "Logged in successfully"
      )
    );
});

const logoutEmployee = asyncHandler(async (req, res) => {
  await Employee.findByIdAndUpdate(
    req.employee._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Employee logged out successfully"));
});

const listEmployees = asyncHandler(async (req, res) => {
  const employee = await Employee.find()
    .select("-__v -password")
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
  const { name, email, phone, salary, department, role, password } = req.body;

  const updatedEmp = await Employee.findByIdAndUpdate(
    id,
    {
      $set: {
        name: name,
        email,
        phone,
        salary,
        department,
        role,
        password,
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
    .json(
      new ApiResponse(200, updatedEmp, "Employee details updated successfully")
    );
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
  loginEmployee,
  logoutEmployee,
};
