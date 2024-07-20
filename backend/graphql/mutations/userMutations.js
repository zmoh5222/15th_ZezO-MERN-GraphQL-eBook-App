const bcrypt = require("bcryptjs")
const User = require("../../models/User")
const uploadSingleFile = require("../../utils/fileUploads/uploadSingleFile")
const CustomGQLError = require("../errors/CustomGQLError")
const generateToken = require("../../utils/generateToken");
const deleteSingleFile = require("../../utils/fileUploads/deleteSingleFile");

const userMutations = {
  // register user
  registerUser: async (parent, { name, email, password, avatar}, context, info) => {
    // check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new CustomGQLError("User already exists", "USER_ALREADY_EXISTS")
    }

    // upload avatar
    let avatarUrl = undefined
    if (avatar) {
      const {encyptedFilename} = await uploadSingleFile(avatar, context, "profile-image", "users")
      if (encyptedFilename) avatarUrl = encyptedFilename
    }

    // create user
    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 12),
      avatar: avatarUrl
    })

    // generate token
    const token = generateToken(user)

    // return user with token
    return { user, token }
  },
  // login user
  loginUser: async (parent, { email, password }, context, info) => {
    // check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      throw new CustomGQLError("User doesn't exists", "USER_NOT_FOUND")
    }

    // check if password is correct
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      throw new CustomGQLError("Invalid credentials", "INVALID_CREDENTIALS")
    }

    // generate token
    const token = generateToken(user)

    // store token in cookie
    context.res.cookie("token", token, {
      maxAge: parseInt(process.env.COOKIE_MAX_AGE),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      // sameSite: true,
    })

    // set logged status to true in cookie
    context.res.cookie("isLoggedIn", true, {
      maxAge: parseInt(process.env.COOKIE_MAX_AGE),
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      // sameSite: true,
    })

    // return user with token
    return { user, token }
  },
  // logout user
  logoutUser: (parent, args, context, info) => {
    // delete token from cookie
    context.res.clearCookie("token")
    context.res.clearCookie("isLoggedIn")
    return "Logged out successfully"
  },
  // update user
  updateUser: async (parent, { name, email, avatar }, context, info) => {
    const user = await User.findById(context.user._id)

    // upload avatar if provided
    let avatarUrl = undefined
    if (avatar) {
      const { encyptedFilename } = await uploadSingleFile(avatar, context, "profile-image", "users")
      if (encyptedFilename) {
        avatarUrl = encyptedFilename

        // delete old avatar if exists
        if (user?.avatar) await deleteSingleFile("users", user.avatar)
      }
    }

    // update user
    const updatedUser = await User.findByIdAndUpdate(
      context.user._id,
      {
        name,
        email,
        avatar: avatarUrl
      },
      { new: true }
    )

    // return updated user
    return updatedUser
  },
  // update user password
  updateUserPassword: async (parent, { password, passwordConfirm }, context, info) => {
    // update user password
    const updatedUser = await User.findByIdAndUpdate(
      context.user._id,
      {
        password: await bcrypt.hash(password, 12)
      },
      { new: true }
    )

    // return updated user
    return updatedUser
  }
}

module.exports = userMutations