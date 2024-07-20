const { withFilter } = require("graphql-subscriptions")


const bookSubscriptions = {
  newBook: {
    subscribe: withFilter(
      (_, __, { pubsub }) => {
        return pubsub.asyncIterator(["NEW_BOOK"])
      },
      (parent, args, { ctx }) => {
        console.log(parent)
        console.log(args)
        return parent.newBook.user.toString() === args.userId
      }
    )
  },
}

module.exports = bookSubscriptions