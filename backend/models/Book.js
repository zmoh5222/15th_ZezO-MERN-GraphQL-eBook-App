const { default: mongoose } = require("mongoose");


const bookSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    }
  ],
  cover: {
    type: String,
    required: true
  },
  pdf: {
    type: String,
    required: true
  },
}, {
  timestamps: true
})

// populate category
bookSchema.pre("findOne", function (next) {
  this.populate("category")
  next()
})

const Book = mongoose.model("Book", bookSchema);

module.exports = Book