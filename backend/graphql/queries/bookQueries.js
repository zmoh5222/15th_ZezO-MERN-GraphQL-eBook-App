const Book = require("../../models/Book")
const { getAllDocuments, getOneDocument } = require("../../utils/handlersFactory")


const bookQueries = {
  // get all books
  getAllBooks: (parent, args, context, info) => {
    return getAllDocuments(Book, args, context)
  },
  // get user books
  getUserBooks: (parent, args, context, info) => {
    return getAllDocuments(Book, args, context, { user: context.user._id })
  },
  // get one book
  getOneBook: (parent, args, context, info) => {
    return getOneDocument(Book, args, context)
  }
}

module.exports = bookQueries