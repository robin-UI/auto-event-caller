import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Use 127.0.0.1 instead of localhost for Node.js v18+ compatibility
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('MongoDB Connected successfully');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`MongoDB connection error: ${message}`);
    process.exit(1); // Exit process on failure
  }
};

export default connectDB;
