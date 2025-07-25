import mongoose from 'mongoose'

const chatMessageSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    index: true,
  },
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    default: 'user',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  replyTo: String,
  conversationId: String
}, {
  timestamps: true,
})

export const ChatMessage = mongoose.models.ChatMessage || mongoose.model('ChatMessage', chatMessageSchema)
