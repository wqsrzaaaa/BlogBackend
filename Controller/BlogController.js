import Blog from "../models/Blog.js";
import User from "../models/User.js";

export const BlogCreate = async (req, res) => {
  const { title, description, Categories, image, author } = req.body;

  if (!title || !description || !Categories || !image) {
    return res
      .status(400)
      .json({ success: false, message: "Please fill all fields" });
  }

  try {
    const newBlog = new Blog({
      title,
      description,
      Categories,
      image,
      author,
    });

    await newBlog.save();

    await User.findByIdAndUpdate(author, {
      $push: { blogs: newBlog._id },
    });

    res.status(201).json({ success: true, blog: newBlog });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const BlogUpdate = async (req, res) => {
  const { title, description, Categories, image } = req.body;
  const { id } = req.params;

  if (!title || !description || !Categories || !image) {
    return res
      .status(400)
      .json({ success: false, message: "Please fill all fields" });
  }

  try {
    const updateBlog = await Blog.findByIdAndUpdate(
      id,
      { title, description, Categories, image },
      { new: true, runValidators: true }
    );

    if (!updateBlog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    res.status(200).json({ success: true, blog: updateBlog });
  } catch (err) {
    console.error("Error updating blog:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const DeleteBlog = async(req , res)=> {
  const {id} = req.params;
  const deleteblog = await Blog.findByIdAndDelete(id)
   res.status(200).json({ success: true, message: "Blog deleted successfully" });
}
export const LikeBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const userId = req.userId; 

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    if (blog.likes.includes(userId)) {
      blog.likes = blog.likes.filter(id => id.toString() !== userId);
    } else {
      blog.likes.push(userId);
    }

    await blog.save();
    res.status(200).json({ success: true, likes: blog.likes.length });
  } catch (err) {
    console.error("Error liking blog:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
export const getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "username profile"); 
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


