import { Router } from "express";
import {
  createEmployee,
  deleteEmployee,
  getEmployeeById,
  listEmployees,
  loginEmployee,
  logoutEmployee,
  updateEmployee,
} from "../controllers/employee.controller.js";
import { verifyJWT } from "../middlewares/auth.js";
const employeeRouter = Router();

employeeRouter.route("/add").post(verifyJWT, createEmployee);
employeeRouter.route("/").get(verifyJWT, listEmployees);
employeeRouter.route("/:id").get(verifyJWT, getEmployeeById);
employeeRouter.route("/:id").put(verifyJWT, updateEmployee);
employeeRouter.route("/:id").delete(verifyJWT, deleteEmployee);

employeeRouter.route("/login").post(loginEmployee);
employeeRouter.route("/logout").post(verifyJWT, logoutEmployee);

export { employeeRouter };
