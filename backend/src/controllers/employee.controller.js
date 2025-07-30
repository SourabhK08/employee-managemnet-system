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
  const {
    name,
    email,
    phone,
    salary,
    department,
    role,
    password,
    gender,
    teamLeader,
  } = req.body;

  if (name === "") {
    throw new ApiError(400, "Name is required");
  }

  if (gender === "") {
    throw new ApiError(400, "Gender is required");
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
    gender,
    teamLeader,
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
      new ApiResponse(201, createdEmployee, "Employee created successfully")
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
  const { search,page=1,limit=10 } = req.query;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit)  

  const skip = (pageNum - 1) * limitNum

  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const totalCount = await Employee.countDocuments(query)

  const employees = await Employee.find(query)
    .select("-__v -password -refreshToken")
    .populate({ path: "department", select: "name description" })
    .populate({ path: "role", select: "name description" })
    .skip(skip)
    .limit(limitNum)

  const message =
    totalCount === 0
      ? search
        ? `No matching employees found for the keyword "${search}"`
        : "No employees found"
      : "Employee list fetched successfully";
      
  return res
    .status(200)
    .json(new ApiResponse(200, {totalCount,employees}, message));
});

const getEmployeeById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const fetchedEmp = await Employee.findById(id)
    .select("-__v -password -refreshToken")
    .populate({ path: "department", select: "name description" })
    .populate({ path: "role", select: "name description permissions" });

  if (!fetchedEmp) {
    throw new ApiError(500, "Employee data not fetched");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, fetchedEmp, "Employee data fetched successfully")
    );
});

// const updateEmployee = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const {
//     name,
//     email,
//     phone,
//     salary,
//     department,
//     role,
//     password,
//     gender,
//     teamLeader,
//   } = req.body;

//   const updatedEmp = await Employee.findByIdAndUpdate(
//     id,
//     {
//       $set: {
//         name: name,
//         email,
//         phone,
//         salary,
//         department,
//         role,
//         password,
//         gender,
//         teamLeader,
//       },
//     },
//     {
//       new: true,
//     }
//   );

//   if (!updatedEmp) {
//     throw new ApiError(500, "Can not update employee");
//   }

//   return res
//     .status(200)
//     .json(
//       new ApiResponse(200, updatedEmp, "Employee details updated successfully")
//     );
// });

const updateEmployee = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    name,
    email,
    phone,
    salary,
    department,
    role,
    password,
    gender,
    teamLeader,
  } = req.body;

  const employee = await Employee.findById(id);

  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }

  if (name) employee.name = name;
  if (email) employee.email = email;
  if (phone) employee.phone = phone;
  if (salary) employee.salary = salary;
  if (department) employee.department = department;
  if (role) employee.role = role;
  if (gender) employee.gender = gender;
  if (teamLeader) employee.teamLeader = teamLeader;

  if (password && password.trim() !== "") {
    employee.password = password; // Ye pre('save') middleware trigger karega
  }

  // Save karo - ye pre('save') middleware chalayega
  const updatedEmp = await employee.save({ validateBeforeSave: true });

  if (!updatedEmp) {
    throw new ApiError(500, "Cannot update employee");
  }

  const responseData = await Employee.findById(updatedEmp._id)
    .select("-password -refreshToken -__v")
    .populate({ path: "department", select: "name description" })
    .populate({ path: "role", select: "name description permissions" });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        responseData,
        "Employee details updated successfully"
      )
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
