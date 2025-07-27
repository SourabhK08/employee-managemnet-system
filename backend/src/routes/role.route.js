import { Router } from "express";
import {
  createRole,
  deleteRole,
  getRoleById,
  listRole,
  teamLeaderList,
  updateRole,
} from "../controllers/role.controller.js";
import { verifyJWT } from "../middlewares/auth.js";

const roleRoutes = Router();

roleRoutes.use(verifyJWT);

roleRoutes.route("/add").post(createRole);
roleRoutes.route("/").get(listRole);
roleRoutes.route("/teamLeadersList").get(teamLeaderList);
roleRoutes.route("/:id").get(getRoleById);
roleRoutes.route("/:id").put(updateRole);
roleRoutes.route("/:id").delete(deleteRole);

export { roleRoutes };
