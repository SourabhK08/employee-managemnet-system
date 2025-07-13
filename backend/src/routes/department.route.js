import { Router } from "express";
import { createDepartment } from "../controllers/department.controller.js";


const departmentRoutes = Router()

departmentRoutes.route('/add').post(createDepartment)

export default departmentRoutes