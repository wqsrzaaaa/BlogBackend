import mongoose from "mongoose";

const BlogSchema = mongoose.Schema({
  title: String,
  description: String,
  image: String,
  Categories : [],
  date: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  likes : [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Blog = mongoose.model("Blog", BlogSchema);

export default Blog;
