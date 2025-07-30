import { Employee } from "../models/index.js";
import { Task } from "../models/task.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/AsyncHandler.js";

const createTask = asyncHandler(async (req, res) => {
  const {
    taskDescription,
    assignedBy,
    assignedTo,
    startDate,
    endDate,
    status,
    priority,
    // progress,
  } = req.body;

  if (
    !taskDescription ||
    !Array.isArray(taskDescription) ||
    taskDescription.length === 0
  ) {
    throw new ApiError(400, "Task description is required");
  }
  if (!assignedBy) {
    throw new ApiError(400, "Task Assigned by is required");
  }
  if (!assignedTo) {
    throw new ApiError(400, "Task Assigned to is required");
  }
  if (!startDate) {
    throw new ApiError(400, "Start date is required");
  }
  if (!endDate) {
    throw new ApiError(400, "End date is required");
  }

  const employee = await Employee.findById(assignedTo);
  if (!employee) {
    throw new ApiError(404, "Assigned employee not found");
  }

  const task = await Task.create({
    taskDescription,
    assignedBy,
    assignedTo,
    startDate,
    endDate,
    // startDate: new Date(startDate),
    // endDate: new Date(endDate),
    status,
    priority,
    // progress,
  });

  const createdTask = await Task.findById(task._id);

  if (!createdTask) {
    throw new ApiError(500, "Task is not created");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createTask, "Task created successfully"));
});

// Get all tasks assigned by team leader

const listAssignedTask = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 10, status, priority } = req.query;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  let query = { assignedBy: req.employee._id };

  if (search) {
    query["taskDescription.description"] = { $regex: search, $options: "i" };
  }
  if (status) {
    query.status = status;
  }
  if (priority) {
    query.priority = priority;
  }
  const totalCount = await Task.countDocuments(query);

  const tasks = await Task.find(query)
    .populate({
      path: "assignedBy",
      select: "name email phone",
    })
    .populate({
      path: "assignedTo",
      select: "name email phone",
    })
    .skip(skip)
    .limit(limitNum);

  const message =
    totalCount === 0
      ? search
        ? `No matching tasks found for the keyword "${search}"`
        : "No tasks found"
      : "Task list fetched successfully";

  return res
    .status(200)
    .json(new ApiResponse(200, { tasks, totalCount }, message));
});

// Get all tasks assigned to employee (My Tasks)
const getMyTasks = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 10, status, priority } = req.query;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  let query = { assignedTo: req.employee._id };

  if (search) {
    query["taskDescription.description"] = { $regex: search, $options: "i" };
  }
  if (status) {
    query.status = status;
  }
  if (priority) {
    query.priority = priority;
  }
  const totalCount = await Task.countDocuments(query);

  const tasks = await Task.find(query)
    .populate({
      path: "assignedBy",
      select: "name email phone",
    })
    .populate({
      path: "assignedTo",
      select: "name email phone",
    })
    .skip(skip)
    .limit(limitNum);

  const message =
    totalCount === 0
      ? search
        ? `No matching tasks found for the keyword "${search}"`
        : "No tasks found"
      : "Task list fetched successfully";

  return res
    .status(200)
    .json(new ApiResponse(200, { tasks, totalCount }, message));
});

const getTaskById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const task = await Task.findById(id);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task details fetched successfully"));
});

const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    taskDescription,
    assignedBy,
    assignedTo,
    startDate,
    endDate,
    status,
    priority,
    // progress,
  } = req.body;

  const updatedTask = await Task.findByIdAndUpdate(
    id,
    {
      $set: {
        taskDescription,
        assignedBy,
        assignedTo,
        startDate,
        endDate,
        status,
        priority,
        // progress,
      },
    },
    { new: true }
  );

  if (!updatedTask) {
    throw new ApiError(500, "Task not updated");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTask, "Task updated successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const task = await Task.findById(id);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (task.assignedTo) {
    throw new ApiError(400, "Cannot delete: Task is assigned to an employee");
  }

  const deletedTask = await Task.findByIdAndDelete(id);

  if (!deletedTask) {
    throw new ApiError(500, "Task not deleted");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedTask, "Task deleted successfully"));
});

export {
  createTask,
  listAssignedTask,
  getMyTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
