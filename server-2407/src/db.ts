import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URL || 'mongodb+srv://admin:qwe@cluster1407.pcgzf5p.mongodb.net/main?retryWrites=true&w=majority&appName=Cluster1407'
    )
    console.log('MongoDB connected...')
  } catch (err: any) {
    console.error(err.message)
    process.exit(1)
  }
}

export default connectDB
