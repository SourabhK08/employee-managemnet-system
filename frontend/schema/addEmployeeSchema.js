import * as yup from "yup";

const employeeSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required(),
  name: yup.string().required(),
  gender: yup.string().required(),
  role: yup.string().required(),
  department: yup.array().required(),
  phone: yup
    .number()
    .transform((val, originalVal) => (originalVal === "" ? undefined : val))
    .required(),
  salary: yup
    .number()
    .transform((val, originalVal) => (originalVal === "" ? undefined : val))
    .required(),
});

export default employeeSchema;
