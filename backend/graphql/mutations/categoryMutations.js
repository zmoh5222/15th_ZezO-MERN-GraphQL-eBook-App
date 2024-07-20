const Category = require("../../models/Category")
const { updateOneDocument, deleteOneDocument } = require("../../utils/handlersFactory")
const CustomGQLError = require("../errors/CustomGQLError")


const categoryMutations = {
  // create category
  createCategory: async (parent, { name }, context, info) => {
    // check if category exists
    const existingCategory = await Category.findOne({ name })

    if (existingCategory) throw new CustomGQLError('Category already exists', "CATEGORY_ALREADY_EXISTS")
    // create category
    const category = await Category.create({
      name
    })

    // return category
    return category
  },
  // update category
  updateCategory: async (parent, { id, name }, context, info) => {
    // update category
    return updateOneDocument(Category, args, context)
  },
  // delete category
  deleteCategory: async (parent, { id }, context, info) => {
    // delete category
    return deleteOneDocument(Category, args, context)
  }
}

module.exports = categoryMutations