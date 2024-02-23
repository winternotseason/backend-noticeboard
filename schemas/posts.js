const mongoose = require("mongoose");

const { Schema } = mongoose;
const {
  Types: { ObjectId },
} = Schema;

const PostSchema = new Schema({
  writer: {
    type: ObjectId,
    required: true,
    ref: "User",
  },
  content : {
      type:String,
      required:true
  }
  date: {
    type: String,
    required: true,
  },
  postedDate : new Date();
});

module.exports = mongoose.model("posts", PostSchema);
