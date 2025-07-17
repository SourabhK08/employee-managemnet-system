import * as yup from "yup";

const roleSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string(),
});

export default roleSchema;
