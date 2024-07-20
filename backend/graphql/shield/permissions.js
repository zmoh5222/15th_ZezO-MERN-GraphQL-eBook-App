const objectHash = require("object-hash");
const { ulid } = require("ulid");
const { shield, and } = require("graphql-shield");
const { isAuthenticated, isAdmin, isSelf } = require("./rules");
const CustomGQLError = require("../errors/CustomGQLError");
const { getOneUserValidation } = require("./inputRulesValidation/user/getOneUserValidation");
const { loginUserValidation } = require("./inputRulesValidation/user/loginUserValidation");
const { registerUserValidation } = require("./inputRulesValidation/user/registerUserValidation");
const { updateUserValidation } = require("./inputRulesValidation/user/updateUserValidation");
const { updateUserPasswordValidation } = require("./inputRulesValidation/user/updateUserPasswordValidation");
const { createBookValidation } = require("./inputRulesValidation/book/createBookValidation");
const { updateBookValidation } = require("./inputRulesValidation/book/updateBookValidation");
const { deleteBookValidation } = require("./inputRulesValidation/book/deleteBookValidation");
const { createCategoryValidation } = require("./inputRulesValidation/category/createCategoryValidation");
const { updateCategoryValidation } = require("./inputRulesValidation/category/updateCategoryValidation");
const { deleteCategoryValidation } = require("./inputRulesValidation/category/deleteCategoryValidation");
const { getAllBooksValidation } = require("./inputRulesValidation/book/getAllBooksValidation");
const { getOneBookValidation } = require("./inputRulesValidation/book/getOneBookValidation");
const { getUserBooksValidation } = require("./inputRulesValidation/book/getUserBooksValidation");

const permissions = shield(
  {
  Query: {
    // user
    getOneUser: and(isAuthenticated, getOneUserValidation),
    getMe: isAuthenticated,

    // book
    getAllBooks: getAllBooksValidation,
    getUserBooks: and(isAuthenticated, getUserBooksValidation),
    getOneBook: getOneBookValidation
  },
  Mutation: {
    // user
    registerUser: registerUserValidation,
    loginUser:  loginUserValidation,
    updateUser: and(isAuthenticated, updateUserValidation),
    updateUserPassword: and(isAuthenticated, updateUserPasswordValidation),

    // book
    createBook: and(isAuthenticated, createBookValidation),
    updateBook: and(isAuthenticated, updateBookValidation),
    deleteBook: and(isAuthenticated, isAdmin, deleteBookValidation),

    // category
    createCategory: and(isAuthenticated, createCategoryValidation),
    updateCategory: and(isAuthenticated, isAdmin, updateCategoryValidation),
    deleteCategory: and(isAuthenticated, isAdmin, deleteCategoryValidation),
  },

}, 
{
  fallbackError: new CustomGQLError("Not Authorized!", "GLOBAL_ERROR"),
  allowExternalErrors: true,
  debug: true,
  hashFunction: ({ args }) => {
    try {
      return objectHash(args)
    } catch (error) {
      if (error.message === 'Unknown object type "promise"') {
        return ulid()
      }
    }
  }
}
);

module.exports = permissions