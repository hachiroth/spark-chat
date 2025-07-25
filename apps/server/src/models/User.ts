import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: String,
  avatar: String
}, {
  timestamps: true
})

export const User = mongoose.models.User || mongoose.model("User", userSchema)