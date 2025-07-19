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
const employeeRouter = Router();

employeeRouter.route("/add").post(createEmployee);
employeeRouter.route("/").get(listEmployees);
employeeRouter.route("/:id").get(getEmployeeById);
employeeRouter.route("/:id").put(updateEmployee);
employeeRouter.route("/:id").delete(deleteEmployee);

employeeRouter.route("/login").post(loginEmployee);
employeeRouter.route("/logout").post(logoutEmployee);

export { employeeRouter };
