import { Router } from "express";
import { createRole, deleteRole, getRoleById, listRole, updateRole } from "../controllers/role.controller.js";

const roleRoutes = Router()

roleRoutes.route('/add').post(createRole)
roleRoutes.route('/').get(listRole)
roleRoutes.route('/:id').get(getRoleById)
roleRoutes.route('/:id').put(updateRole)
roleRoutes.route('/:id').delete(deleteRole)

export  {roleRoutes}