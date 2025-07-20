import { Router } from "express";
import {
  createDepartment,
  deleteDepartment,
  getDepartmentById,
  listDepartment,
  updateDepartment,
} from "../controllers/department.controller.js";
import { verifyJWT } from "../middlewares/auth.js";

const departmentRoutes = Router();

departmentRoutes.use(verifyJWT);

departmentRoutes.route("/add").post(createDepartment);
departmentRoutes.route("/").get(listDepartment);
departmentRoutes.route("/:id").get(getDepartmentById);
departmentRoutes.route("/:id").put(updateDepartment);
departmentRoutes.route("/:id").delete(deleteDepartment);

export { departmentRoutes };
