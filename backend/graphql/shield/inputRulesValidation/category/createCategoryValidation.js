const { inputRule } = require("graphql-shield");
const CustomGQLError = require("../../../errors/CustomGQLError");

exports.createCategoryValidation = inputRule()(
  (yup, context) =>
    yup.object({
      name: yup.string().required("Name is required").trim(),
    }),
)