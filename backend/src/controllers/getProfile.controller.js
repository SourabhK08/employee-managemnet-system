import { Employee } from "../models/emp.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/AsyncHandler.js";

const Profile = asyncHandler(async (req, res) => {
  const loggedInEmployee = await Employee.findById(req.employee._id)
    .select("-password -refreshToken -__v")
    .populate({ path: "department", select: "name description" })
    .populate({ path: "role", select: "name description permissions" });

  if (!loggedInEmployee) {
    throw new ApiError(404, "Employee not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, loggedInEmployee, "Profile fetched successfully")
    );
});

export { Profile };
