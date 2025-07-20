import { Employee } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.headers["authorization"]?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedInfoFromToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    const employee = await Employee.findById(decodedInfoFromToken?._id).select(
      "-password -refreshToken"
    );

    if (!employee) {
      throw new ApiError(401, "Invalid access token");
    }

    req.employee = employee;
    next();
  } catch (error) {
    throw new ApiError(401, error.message || "Invalid access token");
  }
});
