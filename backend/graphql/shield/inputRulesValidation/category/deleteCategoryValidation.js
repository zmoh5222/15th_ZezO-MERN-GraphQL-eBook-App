const { inputRule } = require("graphql-shield");

exports.deleteCategoryValidation = inputRule()(
  (yup, context) =>
    yup.object({
      id: yup.string().required("ID is required").matches(/^[0-9a-fA-F]{24}$/, "Invalid ID").trim(),
    }),
)