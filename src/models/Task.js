import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: false
  },
  description: {
    type: String,
    required: false,
    unique: false
  },
  status: {
    type: String,
    enum: ['done', 'pending'],
    default: 'pending',
    required: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

export default mongoose.model('Task', userSchema)