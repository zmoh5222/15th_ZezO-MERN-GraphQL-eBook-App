const Book = require("../../models/Book")
const deleteSingleFile = require("../../utils/fileUploads/deleteSingleFile")
const uploadSingleFile = require("../../utils/fileUploads/uploadSingleFile")
const { deleteOneDocument } = require("../../utils/handlersFactory")
const CustomGQLError = require("../errors/CustomGQLError")


const bookMutations = {
  // create new book
  createBook: async (parent, { title, author, description, category, cover, pdf }, context, info) => {
    // upload cover
    let coverUrl = undefined
    if (cover) {
      const { encyptedFilename } = await uploadSingleFile(cover, context, "book-cover", "books")
      if (encyptedFilename) coverUrl = encyptedFilename
    }

    // upload pdf
    let pdfUrl = undefined
    if (pdf) {
      const { encyptedFilename } = await uploadSingleFile(pdf, context, "book-pdf", "books")
      if (encyptedFilename) pdfUrl = encyptedFilename
    }

    // create book
    const book = await Book.create({
      user: context.user._id,
      title,
      author,
      description,
      category,
      cover: coverUrl,
      pdf: pdfUrl
    })

    // publish new book to subscribers
    context.pubsub.publish("NEW_BOOK", { newBook: book })

    // return book
    return book
  },
  // update book
  updateBook: async (parent, { id, title, author, description, category, cover, pdf }, context, info) => {
    const book = await Book.findById(id)

    // check if book exists
    if (!book) throw new CustomGQLError('Book not found', "BOOK_NOT_FOUND")

    // check if user owns book
    if (book?.user.toString() !== context.user._id.toString()) {
      throw new CustomGQLError('Not authorized, only owner is allowed', "FORBIDDEN")
    }

    // upload cover if provided
    let coverUrl = undefined
    if (cover) {
      const { encyptedFilename } = await uploadSingleFile(cover, context, "book-cover", "books")
      if (encyptedFilename) {
        coverUrl = encyptedFilename

        // delete old cover
        await deleteSingleFile("books", book.cover)
      }
    }

    // upload pdf if provided
    let pdfUrl = undefined
    if (pdf) {
      const { encyptedFilename } = await uploadSingleFile(pdf, context, "book-pdf", "books")
      if (encyptedFilename) {
        pdfUrl = encyptedFilename

        // delete old pdf
        await deleteSingleFile("books", book.pdf)
      }
    }

    // update book
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      {
        title,
        author,
        description,
        category,
        cover: coverUrl,
        pdf: pdfUrl
      }, {
        new: true
      }
    )

    // return updated book
    return updatedBook
  },
  // delete book
  deleteBook: async (parent, { id }, context, info) => {
    const book = await Book.findById(id)

    // check if book exists
    if (!book) throw new CustomGQLError('Book not found', "BOOK_NOT_FOUND")

    // delete cover
    if (book.cover) await deleteSingleFile("books", book.cover)

    // delete pdf
    if (book.pdf) await deleteSingleFile("books", book.pdf)

    // delete book
    return deleteOneDocument(Book, args, context)
  }
}

module.exports = bookMutations