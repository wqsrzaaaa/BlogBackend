import express from 'express';
import SignIn, { AllUser, CurrentUser, following, Login, unfollowUser, UserProfile } from '../Controller/UserController.js';
import { BlogCreate, BlogUpdate, DeleteBlog, getSingleBlog, LikeBlog } from '../Controller/BlogController.js';
import Blog from '../models/Blog.js';
import User from '../models/User.js';
import auth from '../Controller/auth.js';

const Router = express.Router();

// --- Auth/User routes ---
Router.post('/signup', SignIn);
Router.post('/login', Login);
Router.get('/current-user', auth, CurrentUser);
Router.get('/alluser', AllUser);

// --- Blog routes ---
Router.post('/create', BlogCreate);
Router.get('/all', async (req, res) => {
  try {
    const data = await Blog.find()
      .populate('author', 'username profile email')
      .populate('likes', 'username profile email');

    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch blogs" });
  }
});

Router.get('/myblogs', auth, async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.userId }).populate("author");
    res.json({ success: true, data: blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

Router.get('/user/:id', UserProfile);
Router.get('/blog/:id', getSingleBlog);
Router.put('/myblog/edit/:id', BlogUpdate);
Router.delete('/myblog/delete/:id', DeleteBlog);
Router.post('/:blogId/like', auth, LikeBlog);

// --- Follow/unfollow ---
Router.post('/follow/:id', following);
Router.post('/unfollow/:id', auth, unfollowUser);

// --- Update profile ---
Router.post('/update-profile/:id', async (req, res) => {
  try {
    const { username, bio, profile, banner } = req.body;
    const userId = req.params.id;

    const existingUser = await User.findOne({
      username,
      _id: { $ne: userId },
    });

    if (existingUser) {
      return res.status(400).json({ success: false, message: "Username is already in use" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, bio, profile, banner },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ success: false, message: "Failed to update profile" });
  }
});

export default Router;
