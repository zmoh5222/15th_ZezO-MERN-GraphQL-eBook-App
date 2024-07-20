const { inputRule } = require("graphql-shield");

exports.updateUserPasswordValidation = inputRule()(
  (yup, context) =>
    yup.object({
      confirmPassword: yup.string().required("Confirm password is required").trim().oneOf([yup.ref('password')], 'Passwords must match'),
      password: yup.string().required("Password is required").trim(),
    }),
)