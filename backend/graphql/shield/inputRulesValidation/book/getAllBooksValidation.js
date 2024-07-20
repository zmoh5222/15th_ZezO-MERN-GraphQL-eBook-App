const { inputRule } = require("graphql-shield");

exports.getAllBooksValidation = inputRule()(
  (yup, context) =>
    yup.object({
      limit: yup.number().integer("Limit must be an integer").min(1).max(100),
      page: yup.number().integer("Page must be an integer").min(1),
      sort: yup.string().trim()
      // .default("-createdAt")
      ,
      first: yup.number().integer("First must be an integer").min(1),
      last: yup.number().integer("Last must be an integer").min(1),
      filter: yup.array().of(yup.object({
        field: yup.string().trim().required("filter.field Field is required, example: {field: \"price\", value: \"$gte 50\"} - you can use direct value without any operator, example: {field: \"price\", value: \"50\"} - you can use an array so you can filter by multiple fields or the same field with multiple values, example: [{field: \"price\", value: \"$gte 50\"},{field: \"price\", value: \"$lte 100\"}]"),
        value: yup.string().trim().required("filter.value Field is required, example: {field: \"price\", value: \"$gte 50\"} - you can use direct value without any operator, example: {field: \"price\", value: \"50\"} - you can use an array so you can filter by multiple fields or the same field with multiple values, example: [{field: \"price\", value: \"$gte 50\"},{field: \"price\", value: \"$lte 100\"}]"),
      })),
      search: yup.array().of(yup.object({
        field: yup.string().trim().required("search.field Field is required, example: {field: \"title\", keyword: \"dev\"} - you can use an array so you can search by multiple fields, example: [{field: \"title\", keyword: \"dev\"},{field: \"author\", keyword: \"zezo\"}]"),
        keyword: yup.string().trim().required("search.keyword Field is required"),
      }))
    }),
)