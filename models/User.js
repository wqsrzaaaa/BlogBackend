import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  follower: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  bio: {
    type: String,
  },
  banner: String,
  password: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  profile: String,
  blogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
  }]
})

const user = mongoose.model('User', UserSchema)

export default user