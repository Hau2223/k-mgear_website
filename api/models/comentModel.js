const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  idProduct: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Product",
  },
  idUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: "",
  },
  datetime: {
    type: Date,
    default: Date.now()
  },
  comment: {
    type: String,
    require: true
  },
  rating: {
    type: Number,
    default: 0,
  }, 
  nameUser: {
    type: String,
    require: true
  },

});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
