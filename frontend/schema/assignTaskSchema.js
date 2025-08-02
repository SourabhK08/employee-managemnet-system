import * as yup from "yup";

const addTaskSchema = yup.object().shape({
  taskDescription: yup.array().of(
    yup.object().shape({
      description: yup.string().required("Task description is required"),
    })
  ),
  assignedBy: yup.string().required(),
  assignedTo: yup.string().required("Please select at least one employee"),
  startDate: yup.date().required("Start date is required"),
  endDate: yup.date().required("End date is required"),
  status: yup.string().required("Status is required"),
  priority: yup.string().required("Priority is required"),
});

export default addTaskSchema;
