const Category = require("../../models/Category")
const { getAllDocuments } = require("../../utils/handlersFactory")


const categoryQueries = {
  // get all categories
  getAllCategories: async (parent, args, context, info) => {
    const allCategories = await Category.find()
    return allCategories
  }
}

module.exports = categoryQueries