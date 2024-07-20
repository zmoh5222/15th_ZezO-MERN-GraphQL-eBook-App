const { inputRule } = require("graphql-shield");

exports.createBookValidation = inputRule()(
  (yup, context) =>
    yup.object({
      category: yup.array().of(yup.string().matches(/^[0-9a-fA-F]{24}$/, "Invalid Category ID")).required("Category is required").min(1, "Please select at least one category"),
      description: yup.string().required("Description is required").trim(),
      title: yup.string().required("Title is required").trim(),
      author: yup.string().required("Author is required").trim(),
    }),
)