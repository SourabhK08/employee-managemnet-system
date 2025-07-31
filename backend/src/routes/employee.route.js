import { Router } from "express";
import {
  createEmployee,
  deleteEmployee,
  getEmployeeById,
  getSubordinatesList,
  listEmployees,
  loginEmployee,
  logoutEmployee,
  updateEmployee,
} from "../controllers/employee.controller.js";
import { verifyJWT } from "../middlewares/auth.js";
import { Profile } from "../controllers/getProfile.controller.js";

const employeeRouter = Router();

employeeRouter.route("/add").post(verifyJWT, createEmployee);
employeeRouter.route("/").get(verifyJWT, listEmployees);
employeeRouter.route("/subordinatesList").get(verifyJWT, getSubordinatesList);

employeeRouter.route("/profile").get(verifyJWT, Profile);

employeeRouter.route("/login").post(loginEmployee);
employeeRouter.route("/logout").post(verifyJWT, logoutEmployee);

employeeRouter.route("/:id").get(verifyJWT, getEmployeeById);
employeeRouter.route("/:id").put(verifyJWT, updateEmployee);
employeeRouter.route("/:id").delete(verifyJWT, deleteEmployee);

export { employeeRouter };
