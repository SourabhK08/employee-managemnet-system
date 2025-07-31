import mongoose, { Schema } from "mongoose";
import { enums } from "../constants/enum.js";

const taskSchema = new Schema(
  {
    taskDescription: [
      {
        id: {
          type: String,
          default: () => new mongoose.Types.ObjectId().toString(),
        },
        description: {
          type: String,
          required: true,
          trim: true,
          maxlength: 500,
        },
      },
    ],

    assignedBy: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value >= this.startDate;
        },
        message: "End date must be after start date",
      },
    },

    status: {
      type: String,
      enum: Object.values(enums.taskStatus),
      default: "Pending",
    },

    priority: {
      type: String,
      enum: Object.values(enums.taskPriority),
    },

    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    // comments feature in future
  },
  { timestamps: true }
);

export const Task = mongoose.model("Task", taskSchema);
