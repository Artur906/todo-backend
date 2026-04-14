import mongoose from 'mongoose'

export async function connectDB() {
  console.log('Connecting to MongoDB...', process.env.MONGO_URI)
  await mongoose.connect(process.env.MONGO_URI)
}

export async function disconnectDB() {
  await mongoose.disconnect()
}