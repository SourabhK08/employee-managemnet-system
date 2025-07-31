import * as yup from "yup";

const addTaskSchema = yup.object().shape({
  taskDescription: [
    {
      description: yup.string().required(),
    },
  ],
  assignedBy: yup.string.required(),
  assignedTo: yup.string.required(),
  startDate: yup.date().required(),
  endDate: yup.date().required(),
  status: yup.string().required(),
  priority: yup.string().required(),
});

export default addTaskSchema;
