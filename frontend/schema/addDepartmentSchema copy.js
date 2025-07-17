import * as yup from "yup";

const deptSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string(),
});

export default deptSchema;
