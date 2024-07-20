const { rule } = require("graphql-shield")
const CustomGQLError = require("../errors/CustomGQLError")

exports.isAuthenticated = rule({ cache: 'contextual' })(async (parent, args, context, info) => {
  if (!context.user) {
    throw new CustomGQLError('Not authenticated, please login', "UNAUTHENTICATED")
  }
  return true
})

exports.isAdmin = rule({ cache: 'contextual' })(async (parent, args, context, info) => {
  if (!context.user.isAdmin) {
    throw new CustomGQLError('Not authorized, only admins are allowed', "FORBIDDEN")
  }
  return true
})

exports.isSelf = rule({ cache: 'contextual' })(async (parent, args, context, info) => {
  if (context.user._id.toString() !== args.id) {
    throw new CustomGQLError('Not authorized, only owner is allowed', "FORBIDDEN")
  }
  return true
})

// higer order function to pass parameter to rule
exports.isOwner = (model) => rule({ cache: 'contextual' })(async (parent, args, context, info) => {
  const document = await model.findById(args.id)
  if (context.user._id.toString() !== document?.user.toString()) {
    throw new CustomGQLError('Not authorized, only owner is allowed', "FORBIDDEN")
  }
  return true
})