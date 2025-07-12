import mongoose, { Schema } from "mongoose";

const employeeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
  },
  { timestamps: true }
);

export const Employee = mongoose.model("Employee", employeeSchema);
