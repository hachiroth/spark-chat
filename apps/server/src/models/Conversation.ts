import mongoose from 'mongoose'

const conversationSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    index: true,
  },
  title: String,
}, {
  timestamps: true,
})
export const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema)
