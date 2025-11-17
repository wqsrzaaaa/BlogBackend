import user from "../models/User.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Blog from "../models/Blog.js";
import path from "path";

const SignIn = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await user.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      return res.status(400).json({ message: "Email or Username already in use" });
    }

    const newPass = await bcrypt.hash(password, 10)

    const newUser = new user({ username, email, password: newPass });
    await newUser.save();


    const token = jwt.sign(
      { userId: newUser._id, },
      'SecrertKey')

    const UserData = {
      userId: newUser._id,
      username: newUser.username,
      email: newUser.email
    }

    res.status(201).json({
      user: {
        _id: newUser._id,
        username: newUser.username,
      },
      token: token
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }

}

export const Login = async (req, res) => {

  const { email, password } = req.body;

  const findUser = await user.findOne({ email })

  if (!findUser) {
    return res.json({ messege: "User not found" })
  }
  const correctPass = await bcrypt.compare(password, findUser.password)

  if (!correctPass) {
    return res.json({ messege: "Incorrect password" })
  }

  const token = jwt.sign(
    { userId: findUser._id, },
    'SecrertKey')

  res.json({
    user: {
      _id: findUser._id,
      username: findUser.username,
      email: findUser.email,
      profile: findUser.profile,
      banner: findUser.banner,
      bio: findUser.bio,
      blog: findUser.blogs
    },
    token
  })

}

export const AllUser = async (req, res) => {
  try {
    const users = await user.find().select('-password').populate({
      path: 'blogs',
      populate: {
        path: 'author',
      }
    }).populate('follower').populate('following')
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const following = async (req, res) => {
  const { currentUserId } = req.body;
  const targetUserId = req.params.id;

  if (currentUserId === targetUserId) {
    return res.status(400).json({ message: "You cannot follow yourself" });
  }

  try {
    const currentUser = await user.findById(currentUserId);
    const targetUser = await user.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isAlreadyFollowing = targetUser.follower.includes(currentUserId);
    if (isAlreadyFollowing) {
      return res.status(400).json({ message: "Already following this user" });
    }

    targetUser.follower.push(currentUserId);
    currentUser.following.push(targetUserId);

    await currentUser.save();
    await targetUser.save();

    const updatedTargetUser = await user.findById(targetUserId)
      .populate("follower")
      .populate("following");

    res.json({
      success: true,
      message: "Followed successfully",
      updatedUser: updatedTargetUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const unfollowUser = async (req, res) => {
  const { currentUserId } = req.body;
  const targetUserId = req.params.id;

  try {
    const currentUser = await user.findById(currentUserId);
    const targetUser = await user.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    currentUser.following = currentUser.following.filter(
      id => id.toString() !== targetUserId
    );
    targetUser.follower = targetUser.follower.filter(
      id => id.toString() !== currentUserId
    );

    await currentUser.save();
    await targetUser.save();

    const updatedTargetUser = await user.findById(targetUserId)
      .populate("follower")
      .populate("following");

    res.json({
      success: true,
      message: "Unfollowed successfully",
      updatedUser: updatedTargetUser,
    });
  } catch (err) {
    res.status(500).json({ message: "Error unfollowing user", error: err.message });
  }
};



export const CurrentUser = async (req, res) => {
  try {
    const me = await User.findById(req.userId)
      .select('-password') // exclude password only
      .populate({
        path: "blogs",
        populate: [
          { path: "author" },
          { path: "likes" }
        ]
      })
      .populate('follower')
      .populate('following')
      .lean(); 

    if (!me) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user: me });
  } catch (error) {
    console.error('Error in CurrentUser:', error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const UserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const userData = await user.findById(userId)
      .select("-password").populate("follower").populate("following")
      .lean()

    if (!userData) return res.status(404).json({ message: "User not found" });

    const blogs = await Blog.find({ author: userId })
      .populate("author", "username profile")
      .lean();

    res.json({ user: { ...userData, blogs } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



export default SignIn