import { Router } from "express";
import { createEmployee, deleteEmployee, getEmployeeById, listEmployees, updateEmployee } from "../controllers/employee.controller.js";
const employeeRouter = Router();

employeeRouter.route("/add").post(createEmployee);
employeeRouter.route("/").get(listEmployees);
employeeRouter.route("/:id").get(getEmployeeById);
employeeRouter.route("/:id").post(updateEmployee);
employeeRouter.route("/:id").delete(deleteEmployee);

export default employeeRouter;
