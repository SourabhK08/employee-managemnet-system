import { Router } from "express";
import { createEmployee } from "../controllers/employee.controller.js";
const employeeRouter = Router();

employeeRouter.route("/add").post(createEmployee);

export default employeeRouter;
