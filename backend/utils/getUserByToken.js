const User = require("../models/User")
const jwt = require("jsonwebtoken")
const CustomGQLError = require("../graphql/errors/CustomGQLError")

// verify token and user authorization
const getUserByToken = async (req, res) => {
    // 1- get token from req.header.authorization
    let token
    if (req?.headers?.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1]
    } else if (req?.cookies?.token) {
      token = req.cookies.token
    }
  
    if (!token) {
      return null
    }
  
    // 2- verify token with jwt secret key
    const verifiedToken = jwt.verify(token, process.env.JWT_SCRET_KET, (error, decoded) => {
      if (error) {
        // clear token from cookie
        res.clearCookie('token')
        res.clearCookie('isLoggedIn')

        if (error.expiredAt) {
          throw new CustomGQLError('Expired token, Please login again', 'TOKEN_EXPIRED')
        }
        throw new CustomGQLError('Invalid token, Please login again', 'INVALID_TOKEN')
      }
      return decoded
    })
  
    // 3- get document by verified token
    const document = await User.findById(verifiedToken.userId)
  
    if (!document) {
      throw new Error(`your user account is not exists any more please signup again`)
    }
  
    return document
}

module.exports = getUserByToken