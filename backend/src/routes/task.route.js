import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.js";
import {
  createTask,
  deleteTask,
  getMyTasks,
  getTaskById,
  listAssignedTask,
  updateTask,
} from "../controllers/task.controller.js";

const taskRoutes = Router();

taskRoutes.use(verifyJWT);

taskRoutes.route("/add").post(createTask);
taskRoutes.route("/assignedTaskList").get(listAssignedTask);
taskRoutes.route("/myTaskList").get(getMyTasks);

taskRoutes.route("/:id").delete(deleteTask);
taskRoutes.route("/:id").put(updateTask);
taskRoutes.route("/:id").get(getTaskById);

export { taskRoutes };
