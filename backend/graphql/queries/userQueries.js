const User = require("../../models/User");
const { getOneDocument } = require("../../utils/handlersFactory");

const userQueries = {
  // get one user
  getOneUser: (parent, args, context, info) => {
    return getOneDocument(User, args, context);
  },
  // get me
  getMe: (parent, args, context, info) => {
    const user = context.user;
    const token = context.req.cookies?.token;
    return {
      user,
      token,
    };
  },
};

module.exports = userQueries;
