import { Router } from "express";
import { listPermissions } from "../controllers/permissions.controller.js";

const permissionRoutes = Router();

permissionRoutes.route('/').get(listPermissions)

export {permissionRoutes}