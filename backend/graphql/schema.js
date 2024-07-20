const { makeExecutableSchema } = require("@graphql-tools/schema");
const { applyMiddleware } = require("graphql-middleware");
const { GraphQLUpload } = require("graphql-upload");
const permissions = require("./shield/permissions");
const userQueries = require("./queries/userQueries");
const bookQueries = require("./queries/bookQueries");
const categoryQueries = require("./queries/categoryQueries");
const userMutations = require("./mutations/userMutations");
const bookMutations = require("./mutations/bookMutations");
const categoryMutations = require("./mutations/categoryMutations");
const bookSubscriptions = require("./subscriptions/bookSubscriptions");


// typeDefs
const typeDefs = `#graphql

# upload
scalar Upload

# user
type User {
  id: ID
  name: String
  email: String
  isAdmin: Boolean
  avatar: String
  createdAt: String
  updatedAt: String
}
type AuthPayload {
  user: User,
  token: String
}

# book
type Book {
  id: ID
  title: String
  author: String
  description: String
  category: [Category]
  cover: String
  pdf: String
  user: ID
  createdAt: String
  updatedAt: String
}
type BookResultWithPaginationPayload {
  data: [Book]
  pagination: Pagination
}

# category
type Category {
  id: ID
  name: String
  createdAt: String
  updatedAt: String
}

# pagination and filter features
type Pagination {
  limit: Int
  previousPage: Int
  currentPage: Int
  nextPage: Int
  totalPages: Int
  resultTotalDocuments: Int
  overallDocuments: Int
}
input Filter {
  field: String
  value: String
}
input Search {
  field: String
  keyword: String
}

type Query {
  # user
  getOneUser(id: ID!): User
  getMe: AuthPayload

  # book
  getAllBooks(page: Int, limit: Int, sort: String, first: Int, last: Int, filter: [Filter], search: [Search]): BookResultWithPaginationPayload
  getUserBooks(page: Int, limit: Int, sort: String, first: Int, last: Int, filter: [Filter], search: [Search]): BookResultWithPaginationPayload
  getOneBook(id: ID!): Book

  # category
  getAllCategories: [Category]
}

type Mutation {
  # user
  registerUser(name: String!, email: String!, password: String!, confirmPassword: String!, avatar: Upload): AuthPayload
  loginUser(email: String!, password: String!): AuthPayload
  updateUser(name: String, email: String, avatar: Upload): User
  updateUserPassword(password: String!, confirmPassword: String!): User
  logoutUser: String

  # book
  createBook(title: String!, author: String!, description: String!, category: [ID]!, cover: Upload!, pdf: Upload!): Book
  updateBook(id: ID!, title: String, author: String, description: String, category: [ID], cover: Upload, pdf: Upload): Book
  deleteBook(id: ID!): Book

  # category
  createCategory(name: String!): Category
  updateCategory(id: ID!, name: String!): Category
  deleteCategory(id: ID!): Category
}

type Subscription {
  newBook(userId: ID): Book
}
`;

// resolvers
const resolvers = {
  Upload: GraphQLUpload,

  User: {
    avatar: (parent) => {
      if (parent.avatar)
      return `${process.env.BASE_URL}/users/${parent.avatar}`
    },
  },

  Book: {
    cover: (parent) => {
      if (parent.cover)
      return `${process.env.BASE_URL}/books/${parent.cover}`
    },
    pdf: (parent) => {
      if (parent.pdf)
      return `${process.env.BASE_URL}/books/${parent.pdf}`
    },
  },

  Query: {
    ...userQueries,
    ...bookQueries,
    ...categoryQueries
  },
  Mutation: {
    ...userMutations,
    ...bookMutations,
    ...categoryMutations
  },
  Subscription: {
    ...bookSubscriptions
  }
}

// build schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

// apply schema with permissions
const schemaWithPermissions = applyMiddleware(schema, permissions)

module.exports = schemaWithPermissions