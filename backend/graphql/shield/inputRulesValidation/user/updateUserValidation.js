const { inputRule } = require("graphql-shield");

exports.updateUserValidation = inputRule()(
  (yup, context) =>
    yup.object({
      email: yup.string().email('Invalid email format!').required("Email is required").trim(),
      name: yup.string().required("Name is required").trim(),
    }),
)