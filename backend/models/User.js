const { default: mongoose } = require("mongoose");


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  avatar: {
    type: String
  },
}, {
  timestamps: true
})

const User = mongoose.model('User', userSchema)

module.exports = User