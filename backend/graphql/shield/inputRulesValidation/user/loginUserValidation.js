const { inputRule } = require("graphql-shield");


exports.loginUserValidation = inputRule()(
  (yup, context) =>
    yup.object({
      password: yup.string().required("Password is required").trim(),
      email: yup.string().email('Invalid email format!').required("Email is required").trim(),
    }),
)