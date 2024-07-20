const { inputRule } = require("graphql-shield");

exports.updateCategoryValidation = inputRule()(
  (yup, context) =>
    yup.object({
      id: yup.string().required("ID is required").matches(/^[0-9a-fA-F]{24}$/, "Invalid ID").trim(),
      name: yup.string().required("Name is required").trim(),
    }),
)