import * as yup from "yup";

const registerSchema = yup.object().shape({
  fullname:yup.string().required('Full name is required'),
  phone_number:yup.number().transform((val,originalVal) => originalVal === '' ? undefined:val).required('Phone number is required'),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Minimum 6 characters").required("Password is required"),
});

export default registerSchema;
