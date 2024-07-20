const { inputRule } = require("graphql-shield");

exports.updateBookValidation = inputRule()(
  (yup, context) =>
    yup.object({
      id: yup.string().required("ID is required").matches(/^[0-9a-fA-F]{24}$/, "Invalid Book ID").trim(),
      title: yup.string().trim(),
      author: yup.string().trim(),
      description: yup.string().trim(),
      category: yup.array().of(yup.string().matches(/^[0-9a-fA-F]{24}$/, "Invalid Category ID")).min(1, "Please select at least one category"),
    }),
)